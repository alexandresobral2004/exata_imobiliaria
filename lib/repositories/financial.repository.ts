import { BaseRepository } from './base.repository';
import { cachedQuery, generateCacheKey } from '../db/cache';

export type TransactionType = 'Receita' | 'Despesa';

export interface FinancialCategory {
  id: string;
  name: string;
  type: TransactionType;
}

export interface FinancialRecord {
  id: string;
  contractId: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  type: TransactionType;
}

export class FinancialRepository extends BaseRepository<FinancialRecord> {
  constructor() {
    super('financial_records', true); // Enable cache
  }

  findAll(): FinancialRecord[] {
    const rows = this.db.prepare(`
      SELECT 
        fr.id,
        fr.contract_id as contractId,
        fr.description,
        fc.name as category,
        fr.amount,
        fr.due_date as dueDate,
        fs.name as status,
        fr.type
      FROM financial_records fr
      JOIN financial_categories fc ON fr.category_id = fc.id
      JOIN financial_statuses fs ON fr.status_id = fs.id
      ORDER BY fr.due_date DESC
    `).all();

    return rows.map(this.mapRowToFinancialRecord);
  }

  findById(id: string): FinancialRecord | null {
    const row = this.db.prepare(`
      SELECT 
        fr.id,
        fr.contract_id as contractId,
        fr.description,
        fc.name as category,
        fr.amount,
        fr.due_date as dueDate,
        fs.name as status,
        fr.type
      FROM financial_records fr
      JOIN financial_categories fc ON fr.category_id = fc.id
      JOIN financial_statuses fs ON fr.status_id = fs.id
      WHERE fr.id = ?
    `).get(id);

    return row ? this.mapRowToFinancialRecord(row) : null;
  }

  create(record: Omit<FinancialRecord, 'id'>): FinancialRecord {
    const id = this.generateId('financial');
    const categoryId = this.getCategoryId(record.category, record.type);
    const statusId = this.getStatusId(record.status);

    this.db.prepare(`
      INSERT INTO financial_records (
        id, contract_id, category_id, status_id, description,
        amount, due_date, type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      record.contractId,
      categoryId,
      statusId,
      record.description,
      record.amount,
      record.dueDate,
      record.type
    );

    // Invalida cache após criar
    this.invalidateEntityCache();

    return { id, ...record };
  }

  update(id: string, updates: Partial<FinancialRecord>): FinancialRecord {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.contractId !== undefined) {
      fields.push('contract_id = ?');
      values.push(updates.contractId);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.category !== undefined) {
      fields.push('category_id = ?');
      const currentRecord = this.findById(id);
      const type = updates.type || currentRecord?.type || 'Receita';
      values.push(this.getCategoryId(updates.category, type));
    }
    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.dueDate !== undefined) {
      fields.push('due_date = ?');
      values.push(updates.dueDate);
    }
    if (updates.status !== undefined) {
      fields.push('status_id = ?');
      values.push(this.getStatusId(updates.status));
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      this.db.prepare(`UPDATE financial_records SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) throw new Error('Financial record not found after update');
    return updated;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM financial_records WHERE id = ?').run(id);
  }

  getAllCategories(): FinancialCategory[] {
    // Cache estático: categorias raramente mudam
    return cachedQuery(
      generateCacheKey('financial_categories', 'all'),
      () => {
        const rows = this.readDb.prepare('SELECT * FROM financial_categories ORDER BY type, name').all();
        return rows.map(row => ({
          id: row.id,
          name: row.name,
          type: row.type as TransactionType
        }));
      },
      undefined,
      'static' // Cache de 1 hora
    );
  }

  /**
   * Get paginated financial records
   */
  findPaginated(offset: number, limit: number): FinancialRecord[] {
    const rows = this.db.prepare(`
      SELECT 
        fr.id,
        fr.contract_id as contractId,
        fr.description,
        fc.name as category,
        fr.amount,
        fr.due_date as dueDate,
        fs.name as status,
        fr.type
      FROM financial_records fr
      JOIN financial_categories fc ON fr.category_id = fc.id
      JOIN financial_statuses fs ON fr.status_id = fs.id
      ORDER BY fr.due_date DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    return rows.map(this.mapRowToFinancialRecord);
  }

  /**
   * Count total records
   */
  count(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM financial_records').get() as any;
    return result.count;
  }

  /**
   * Get financial summary for a specific month/year
   * Cached for 5 minutes (agregações são pesadas)
   */
  getMonthlySummary(month: number, year: number) {
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();

    return cachedQuery(
      generateCacheKey('financial', 'summary', { month, year }),
      () => {
        const summary = this.readDb.prepare(`
          SELECT 
            fr.type,
            fs.name as status,
            fc.name as category,
            SUM(fr.amount) as total,
            COUNT(*) as count
          FROM financial_records fr
          INDEXED BY idx_financial_type_status_date
          JOIN financial_categories fc ON fr.category_id = fc.id
          JOIN financial_statuses fs ON fr.status_id = fs.id
          WHERE strftime('%m', fr.due_date) = ? 
            AND strftime('%Y', fr.due_date) = ?
          GROUP BY fr.type, fs.name, fc.name
          ORDER BY fr.type, fs.name, fc.name
        `).all(monthStr, yearStr);

        return summary;
      },
      undefined,
      'aggregation' // Cache de 5 minutos
    );
  }

  /**
   * Get records for current month only
   */
  findByMonth(month: number, year: number): FinancialRecord[] {
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();

    const rows = this.db.prepare(`
      SELECT 
        fr.id,
        fr.contract_id as contractId,
        fr.description,
        fc.name as category,
        fr.amount,
        fr.due_date as dueDate,
        fs.name as status,
        fr.type
      FROM financial_records fr
      JOIN financial_categories fc ON fr.category_id = fc.id
      JOIN financial_statuses fs ON fr.status_id = fs.id
      WHERE strftime('%m', fr.due_date) = ? 
        AND strftime('%Y', fr.due_date) = ?
      ORDER BY fr.due_date DESC
    `).all(monthStr, yearStr);

    return rows.map(this.mapRowToFinancialRecord);
  }

  addCategory(category: Omit<FinancialCategory, 'id'>): FinancialCategory {
    const id = this.generateId('cat');
    this.db.prepare(`
      INSERT INTO financial_categories (id, name, type)
      VALUES (?, ?, ?)
    `).run(id, category.name, category.type);

    return { id, ...category };
  }

  private getCategoryId(categoryName: string, type: TransactionType): string {
    // Try to find existing category
    const row = this.db.prepare(
      'SELECT id FROM financial_categories WHERE name = ? AND type = ?'
    ).get(categoryName, type) as any;

    if (row) return row.id;

    // Create new category if not found
    const newCategory = this.addCategory({ name: categoryName, type });
    return newCategory.id;
  }

  private getStatusId(statusName: string): string {
    const statusMap: Record<string, string> = {
      'Pendente': 'pending',
      'Pago': 'paid',
      'Atrasado': 'overdue'
    };

    return statusMap[statusName] || 'pending';
  }

  private mapRowToFinancialRecord(row: any): FinancialRecord {
    return {
      id: row.id,
      contractId: row.contractId,
      description: row.description,
      category: row.category,
      amount: row.amount,
      dueDate: row.dueDate,
      status: row.status as 'Pendente' | 'Pago' | 'Atrasado',
      type: row.type as TransactionType
    };
  }
}

