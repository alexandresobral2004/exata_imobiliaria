import { getDatabase, generateId, transaction } from '../db/client';
import type Database from 'better-sqlite3';

/**
 * Base Repository with common CRUD operations
 */
export abstract class BaseRepository<T> {
  protected db: Database.Database;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = getDatabase();
    this.tableName = tableName;
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

