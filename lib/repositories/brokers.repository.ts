import { BaseRepository } from './base.repository';

export interface Broker {
  id: string;
  name: string;
  creci: string;
  email: string;
  phone: string;
  commissionRate?: number;
}

export class BrokersRepository extends BaseRepository<Broker> {
  constructor() {
    super('brokers');
  }

  findAll(): Broker[] {
    const rows = this.db.prepare('SELECT * FROM brokers ORDER BY name').all();
    return rows.map(this.mapRowToBroker);
  }

  findById(id: string): Broker | null {
    const row = this.db.prepare('SELECT * FROM brokers WHERE id = ?').get(id);
    return row ? this.mapRowToBroker(row) : null;
  }

  create(broker: Omit<Broker, 'id'>): Broker {
    const id = this.generateId('broker');

    this.db.prepare(`
      INSERT INTO brokers (id, name, creci, email, phone, commission_rate)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      broker.name,
      broker.creci,
      broker.email,
      broker.phone,
      broker.commissionRate || 10
    );

    return { id, ...broker };
  }

  update(id: string, updates: Partial<Broker>): Broker {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.creci !== undefined) {
      fields.push('creci = ?');
      values.push(updates.creci);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.commissionRate !== undefined) {
      fields.push('commission_rate = ?');
      values.push(updates.commissionRate);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      this.db.prepare(`UPDATE brokers SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) throw new Error('Broker not found after update');
    return updated;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM brokers WHERE id = ?').run(id);
  }

  private mapRowToBroker(row: any): Broker {
    return {
      id: row.id,
      name: row.name,
      creci: row.creci,
      email: row.email,
      phone: row.phone,
      commissionRate: row.commission_rate
    };
  }
}

