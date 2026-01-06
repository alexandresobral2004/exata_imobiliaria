import { getDatabase, getReadConnection, getWriteConnection, generateId, transaction } from '../db/client';
import { cachedQuery, invalidateCachePattern, generateCacheKey } from '../db/cache';
import type Database from 'better-sqlite3';

/**
 * Base Repository with common CRUD operations
 * Suporta cache e connection pooling
 */
export abstract class BaseRepository<T> {
  protected db: Database.Database;
  protected readDb: Database.Database;
  protected tableName: string;
  protected enableCache: boolean;

  constructor(tableName: string, enableCache: boolean = true) {
    this.db = getWriteConnection(); // Para escritas
    this.readDb = getReadConnection(); // Para leituras
    this.tableName = tableName;
    this.enableCache = enableCache;
  }
  
  /**
   * Invalida cache relacionado a esta entidade
   */
  protected invalidateEntityCache(): void {
    if (this.enableCache) {
      invalidateCachePattern(`^${this.tableName}:`);
    }
  }

  /**
   * Generate a unique ID with optional prefix
   */
  protected generateId(prefix?: string): string {
    return generateId(prefix);
  }

  /**
   * Execute operations in a transaction
   */
  protected transaction<R>(fn: () => R): R {
    return transaction(fn);
  }

  /**
   * Find all records
   */
  abstract findAll(): T[];

  /**
   * Find by ID
   */
  abstract findById(id: string): T | null;

  /**
   * Create a new record
   */
  abstract create(data: Omit<T, 'id'>): T;

  /**
   * Update a record
   */
  abstract update(id: string, updates: Partial<T>): T;

  /**
   * Delete a record
   */
  abstract delete(id: string): void;
}

