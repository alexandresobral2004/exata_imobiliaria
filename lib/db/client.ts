import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

/**
 * Force close and reopen database connection
 */
export function reconnectDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
  getDatabase();
}

/**
 * Get or create SQLite database connection (Singleton pattern)
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  // Database file path
  const dbPath = path.join(process.cwd(), 'exata.db');

  // Create database connection
  db = new Database(dbPath);

  // Enable WAL mode for better concurrent performance
  db.pragma('journal_mode = WAL');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  console.log('✅ Database connection established:', dbPath);

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
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Database connection closed');
  }
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

