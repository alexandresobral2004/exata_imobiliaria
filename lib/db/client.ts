import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Conexão principal (leitura e escrita)
let db: Database.Database | null = null;

// Pool de conexões somente leitura para queries concorrentes
let readConnections: Database.Database[] = [];
const MAX_READ_CONNECTIONS = 5;
let currentReadIndex = 0;

/**
 * Force close and reopen database connection
 */
export function reconnectDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
  
  // Fecha conexões de leitura
  readConnections.forEach(conn => conn.close());
  readConnections = [];
  currentReadIndex = 0;
  
  getDatabase();
}

/**
 * Get a read-only connection from the pool (for concurrent reads)
 * Usa round-robin para distribuir carga
 */
export function getReadConnection(): Database.Database {
  // Inicializa pool se necessário
  if (readConnections.length === 0) {
    const dbDir = getDatabaseDir();
    const dbPath = path.join(dbDir, 'exata.db');
    
    for (let i = 0; i < MAX_READ_CONNECTIONS; i++) {
      const readDb = new Database(dbPath, { readonly: true });
      
      // Mesmas otimizações da conexão principal
      readDb.pragma('journal_mode = WAL');
      readDb.pragma('cache_size = -32000'); // 32MB por conexão
      readDb.pragma('temp_store = MEMORY');
      readDb.pragma('mmap_size = 30000000000');
      
      readConnections.push(readDb);
    }
    
    console.log(`✅ Read connection pool initialized (${MAX_READ_CONNECTIONS} connections)`);
  }
  
  // Round-robin: distribui queries entre conexões
  const connection = readConnections[currentReadIndex];
  currentReadIndex = (currentReadIndex + 1) % readConnections.length;
  
  return connection;
}

/**
 * Get write connection (singleton)
 */
export function getWriteConnection(): Database.Database {
  return getDatabase();
}

/**
 * Get database directory path
 * Uses Railway volume in production, current directory in development
 */
function getDatabaseDir(): string {
  // Railway mount path (quando volume estiver configurado)
  if (process.env.RAILWAY_VOLUME_MOUNT_PATH) {
    return process.env.RAILWAY_VOLUME_MOUNT_PATH;
  }
  
  // Fallback: usa /app/data em produção (Railway padrão)
  if (process.env.NODE_ENV === 'production') {
    return '/app/data';
  }
  
  // Development: usa diretório atual
  return process.cwd();
}

/**
 * Get or create SQLite database connection (Singleton pattern)
 * Optimized for maximum performance
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  // Database directory
  const dbDir = getDatabaseDir();
  
  // Create directory if it doesn't exist (important for Railway volume)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Database file path
  const dbPath = path.join(dbDir, 'exata.db');

  // Create database connection
  db = new Database(dbPath);

  // ========================================
  // PERFORMANCE OPTIMIZATIONS
  // ========================================
  
  // WAL mode: Permite leituras concorrentes durante escritas
  db.pragma('journal_mode = WAL');
  
  // NORMAL: Mais rápido que FULL, seguro o suficiente com WAL
  // FULL seria mais seguro mas 2-3x mais lento
  db.pragma('synchronous = NORMAL');
  
  // Cache de 64MB (valor negativo = KB)
  // Aumenta performance de queries complexas
  db.pragma('cache_size = -64000');
  
  // Armazena tabelas temporárias em memória (mais rápido)
  db.pragma('temp_store = MEMORY');
  
  // Memory-mapped I/O: 30GB
  // Permite que o SO gerencie cache de páginas
  db.pragma('mmap_size = 30000000000');
  
  // Page size otimizado para SSDs modernos
  db.pragma('page_size = 4096');
  
  // Otimiza para queries que retornam muitas linhas
  db.pragma('optimize');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Análise automática para otimizar query planner
  db.pragma('analysis_limit = 1000');

  console.log('✅ Database connection established with optimizations:', dbPath);

  return db;
}

/**
 * Initialize database schema
 */
export function initializeDatabase(): void {
  const db = getDatabase();
  
  // Read schema file
  const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Execute schema
  db.exec(schema);

  console.log('✅ Database schema initialized');
}

/**
 * Close database connection and pool
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
  
  // Fecha todas as conexões de leitura
  readConnections.forEach(conn => {
    try {
      conn.close();
    } catch (error) {
      console.error('Error closing read connection:', error);
    }
  });
  readConnections = [];
  currentReadIndex = 0;
  
  console.log('✅ Database connections closed (write + read pool)');
}

/**
 * Execute a transaction
 */
export function transaction<T>(fn: () => T): T {
  const db = getDatabase();
  const transactionFn = db.transaction(fn);
  return transactionFn();
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

