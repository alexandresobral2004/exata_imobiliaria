import { BaseRepository } from './base.repository';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Admin' | 'Operador';
  password?: string;
}

export class UsersRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  findAll(): User[] {
    const rows = this.db.prepare('SELECT * FROM users ORDER BY name').all();
    return rows.map(this.mapRowToUser);
  }

  findById(id: string): User | null {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? this.mapRowToUser(row) : null;
  }

  create(user: Omit<User, 'id'>): User {
    const id = this.generateId('user');

    this.db.prepare(`
      INSERT INTO users (id, name, phone, email, role, password_hash, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      user.name,
      user.phone,
      user.email,
      user.role,
      user.password || null
    );

    return { id, ...user };
  }

  update(id: string, updates: Partial<User>): User {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }
    if (updates.password !== undefined) {
      fields.push('password_hash = ?');
      values.push(updates.password);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      this.db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      role: row.role as 'Admin' | 'Operador',
      password: row.password_hash
    };
  }
}

