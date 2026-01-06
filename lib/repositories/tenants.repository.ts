import { BaseRepository } from './base.repository';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  document: string;
  rg?: string;
  profession?: string;
  naturalness?: string;
  birthDate?: string;
}

export class TenantsRepository extends BaseRepository<Tenant> {
  constructor() {
    super('tenants');
  }

  findAll(): Tenant[] {
    const rows = this.db.prepare('SELECT * FROM tenants ORDER BY name').all();
    return rows.map(this.mapRowToTenant);
  }

  findById(id: string): Tenant | null {
    const row = this.db.prepare('SELECT * FROM tenants WHERE id = ?').get(id);
    return row ? this.mapRowToTenant(row) : null;
  }

  create(tenant: Omit<Tenant, 'id'>): Tenant {
    const id = this.generateId('tenant');

    this.db.prepare(`
      INSERT INTO tenants (
        id, name, email, phone, whatsapp, document, rg,
        profession, naturalness, birth_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      tenant.name,
      tenant.email,
      tenant.phone,
      tenant.whatsapp || null,
      tenant.document,
      tenant.rg || null,
      tenant.profession || null,
      tenant.naturalness || null,
      tenant.birthDate || null
    );

    return { id, ...tenant };
  }

  update(id: string, updates: Partial<Tenant>): Tenant {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.whatsapp !== undefined) {
      fields.push('whatsapp = ?');
      values.push(updates.whatsapp);
    }
    if (updates.document !== undefined) {
      fields.push('document = ?');
      values.push(updates.document);
    }
    if (updates.rg !== undefined) {
      fields.push('rg = ?');
      values.push(updates.rg);
    }
    if (updates.profession !== undefined) {
      fields.push('profession = ?');
      values.push(updates.profession);
    }
    if (updates.naturalness !== undefined) {
      fields.push('naturalness = ?');
      values.push(updates.naturalness);
    }
    if (updates.birthDate !== undefined) {
      fields.push('birth_date = ?');
      values.push(updates.birthDate);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      this.db.prepare(`UPDATE tenants SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) throw new Error('Tenant not found after update');
    return updated;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM tenants WHERE id = ?').run(id);
  }

  private mapRowToTenant(row: any): Tenant {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      whatsapp: row.whatsapp,
      document: row.document,
      rg: row.rg,
      profession: row.profession,
      naturalness: row.naturalness,
      birthDate: row.birth_date
    };
  }
}

