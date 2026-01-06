import Database from 'better-sqlite3'
import { BaseRepository } from '../base.repository'
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as dbClient from '../../db/client'

// Mock the database client
vi.mock('../../db/client', () => ({
  getDatabase: vi.fn(),
  generateId: vi.fn((prefix: string) => `${prefix}-${Date.now()}-${Math.random()}`),
}))

// Mock implementation for testing
class TestRepository extends BaseRepository<{ id: string; name: string }> {
  constructor() {
    super('test_table')
  }

  findAll(): { id: string; name: string }[] {
    const stmt = this.db.prepare('SELECT * FROM test_table ORDER BY name')
    return stmt.all().map((row: any) => ({
      id: row.id,
      name: row.name,
    }))
  }

  findById(id: string): { id: string; name: string } | null {
    const stmt = this.db.prepare('SELECT * FROM test_table WHERE id = ?')
    const row = stmt.get(id) as any
    return row
      ? {
          id: row.id,
          name: row.name,
        }
      : null
  }

  create(data: Omit<{ id: string; name: string }, 'id'>): { id: string; name: string } {
    const id = this.generateId('test')
    const stmt = this.db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)')
    stmt.run(id, data.name)
    return { id, name: data.name }
  }

  update(id: string, updates: Partial<{ id: string; name: string }>): { id: string; name: string } {
    const stmt = this.db.prepare('UPDATE test_table SET name = ? WHERE id = ?')
    stmt.run(updates.name, id)
    const updated = this.findById(id)
    if (!updated) throw new Error('Item not found')
    return updated
  }

  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM test_table WHERE id = ?')
    stmt.run(id)
  }
}

describe('BaseRepository', () => {
  let db: Database.Database
  let repository: TestRepository

  beforeEach(() => {
    // Create an in-memory database for testing
    db = new Database(':memory:')
    db.exec(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `)

    // Mock getDatabase to return our test database
    vi.mocked(dbClient.getDatabase).mockReturnValue(db)

    repository = new TestRepository()
  })

  afterEach(() => {
    db.close()
  })

  describe('findAll', () => {
    it('should return all items', () => {
      db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Item 1')
      db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('2', 'Item 2')

      const result = repository.findAll()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Item 1')
      expect(result[1].name).toBe('Item 2')
    })

    it('should return empty array when no items exist', () => {
      const result = repository.findAll()

      expect(result).toHaveLength(0)
    })
  })

  describe('findById', () => {
    it('should return item by id', () => {
      db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Item 1')

      const result = repository.findById('1')

      expect(result).toBeTruthy()
      expect(result?.id).toBe('1')
      expect(result?.name).toBe('Item 1')
    })

    it('should return null when item does not exist', () => {
      const result = repository.findById('999')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new item', () => {
      const newItem = repository.create({ name: 'New Item' })

      expect(newItem.id).toBeTruthy()
      expect(newItem.name).toBe('New Item')

      const saved = repository.findById(newItem.id)
      expect(saved).toBeTruthy()
      expect(saved?.name).toBe('New Item')
    })
  })

  describe('update', () => {
    it('should update an existing item', () => {
      db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Original Name')

      const updated = repository.update('1', { name: 'Updated Name' })

      expect(updated.name).toBe('Updated Name')

      const saved = repository.findById('1')
      expect(saved?.name).toBe('Updated Name')
    })

    it('should throw error when updating non-existent item', () => {
      expect(() => {
        repository.update('999', { name: 'Updated Name' })
      }).toThrow('Item not found')
    })
  })

  describe('delete', () => {
    it('should delete an item', () => {
      db.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Item 1')

      repository.delete('1')

      const result = repository.findById('1')
      expect(result).toBeNull()
    })

    it('should not throw error when deleting non-existent item', () => {
      expect(() => {
        repository.delete('999')
      }).not.toThrow()
    })
  })

  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = repository['generateId']('test')
      const id2 = repository['generateId']('test')

      expect(id1).not.toBe(id2)
      expect(id1).toContain('test')
    })
  })
})

