import { BaseRepository } from './base.repository';

export interface Property {
  id: string;
  ownerId: string;
  address: string;
  type: string;
  value: number;
  iptu?: number;
  pmsControlNumber?: string;
  status: 'Disponível' | 'Alugado';
}

export class PropertiesRepository extends BaseRepository<Property> {
  constructor() {
    super('properties');
  }

  findAll(): Property[] {
    const rows = this.db.prepare(`
      SELECT 
        p.id,
        p.owner_id as ownerId,
        p.address,
        pt.name as type,
        p.value,
        p.iptu,
        p.pms_control_number as pmsControlNumber,
        ps.name as status
      FROM properties p
      JOIN property_types pt ON p.property_type_id = pt.id
      JOIN property_statuses ps ON p.status_id = ps.id
      ORDER BY p.address
    `).all();

    return rows.map(row => ({
      id: row.id,
      ownerId: row.ownerId,
      address: row.address,
      type: row.type,
      value: row.value,
      iptu: row.iptu,
      pmsControlNumber: row.pmsControlNumber,
      status: row.status as 'Disponível' | 'Alugado'
    }));
  }

  findById(id: string): Property | null {
    const row = this.db.prepare(`
      SELECT 
        p.id,
        p.owner_id as ownerId,
        p.address,
        pt.name as type,
        p.value,
        p.iptu,
        p.pms_control_number as pmsControlNumber,
        ps.name as status
      FROM properties p
      JOIN property_types pt ON p.property_type_id = pt.id
      JOIN property_statuses ps ON p.status_id = ps.id
      WHERE p.id = ?
    `).get(id);

    if (!row) return null;

    return {
      id: row.id,
      ownerId: row.ownerId,
      address: row.address,
      type: row.type,
      value: row.value,
      iptu: row.iptu,
      pmsControlNumber: row.pmsControlNumber,
      status: row.status as 'Disponível' | 'Alugado'
    };
  }

  findByOwnerId(ownerId: string): Property[] {
    const rows = this.db.prepare(`
      SELECT 
        p.id,
        p.owner_id as ownerId,
        p.address,
        pt.name as type,
        p.value,
        p.iptu,
        p.pms_control_number as pmsControlNumber,
        ps.name as status
      FROM properties p
      JOIN property_types pt ON p.property_type_id = pt.id
      JOIN property_statuses ps ON p.status_id = ps.id
      WHERE p.owner_id = ?
      ORDER BY p.address
    `).all(ownerId);

    return rows.map(row => ({
      id: row.id,
      ownerId: row.ownerId,
      address: row.address,
      type: row.type,
      value: row.value,
      iptu: row.iptu,
      pmsControlNumber: row.pmsControlNumber,
      status: row.status as 'Disponível' | 'Alugado'
    }));
  }

  create(property: Omit<Property, 'id' | 'status'>): Property {
    const id = this.generateId('prop');
    const propertyTypeId = this.getPropertyTypeId(property.type);

    this.db.prepare(`
      INSERT INTO properties (
        id, owner_id, property_type_id, address, value, iptu,
        pms_control_number, status_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
    `).run(
      id,
      property.ownerId,
      propertyTypeId,
      property.address,
      property.value,
      property.iptu || null,
      property.pmsControlNumber || null
    );

    return {
      id,
      ...property,
      status: 'Disponível'
    };
  }

  update(id: string, updates: Partial<Property>): Property {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.ownerId !== undefined) {
      fields.push('owner_id = ?');
      values.push(updates.ownerId);
    }
    if (updates.address !== undefined) {
      fields.push('address = ?');
      values.push(updates.address);
    }
    if (updates.type !== undefined) {
      fields.push('property_type_id = ?');
      values.push(this.getPropertyTypeId(updates.type));
    }
    if (updates.value !== undefined) {
      fields.push('value = ?');
      values.push(updates.value);
    }
    if (updates.iptu !== undefined) {
      fields.push('iptu = ?');
      values.push(updates.iptu);
    }
    if (updates.pmsControlNumber !== undefined) {
      fields.push('pms_control_number = ?');
      values.push(updates.pmsControlNumber);
    }
    if (updates.status !== undefined) {
      fields.push('status_id = ?');
      values.push(updates.status === 'Disponível' ? 'available' : 'rented');
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      this.db.prepare(`
        UPDATE properties SET ${fields.join(', ')} WHERE id = ?
      `).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) throw new Error('Property not found after update');
    return updated;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM properties WHERE id = ?').run(id);
  }

  updateStatus(id: string, status: 'Disponível' | 'Alugado'): void {
    const statusId = status === 'Disponível' ? 'available' : 'rented';
    this.db.prepare('UPDATE properties SET status_id = ? WHERE id = ?').run(statusId, id);
  }

  private getPropertyTypeId(typeName: string): string {
    // Map display name to database ID
    const typeMap: Record<string, string> = {
      'Apartamento': 'apt',
      'Casa': 'house',
      'Kitnete': 'kitnete',
      'Galpão': 'warehouse',
      'Sala Comercial': 'commercial',
      'Terreno': 'land',
      'Taxa de Condomínio': 'condo_fee',
      'Outros': 'other'
    };

    const typeId = typeMap[typeName];
    if (!typeId) {
      // Try to find by name in database
      const row = this.db.prepare('SELECT id FROM property_types WHERE name = ?').get(typeName) as any;
      if (row) return row.id;
      
      // Default to 'other'
      return 'other';
    }

    return typeId;
  }
}

