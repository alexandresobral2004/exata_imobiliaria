import { BaseRepository } from './base.repository';

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  contractDate?: string;
  durationMonths: number;
  rentAmount: number;
  paymentDay: number;
  status: 'Ativo' | 'Encerrado';
  contractNumber?: string;
  brokerId?: string;
  securityDeposit?: number;
  complement?: string;
}

export class ContractsRepository extends BaseRepository<Contract> {
  constructor() {
    super('contracts');
  }

  findAll(): Contract[] {
    const rows = this.db.prepare(`
      SELECT 
        c.id,
        c.property_id as propertyId,
        c.tenant_id as tenantId,
        c.start_date as startDate,
        c.contract_date as contractDate,
        c.duration_months as durationMonths,
        c.rent_amount as rentAmount,
        c.payment_day as paymentDay,
        cs.name as status,
        c.contract_number as contractNumber,
        c.broker_id as brokerId,
        g.security_deposit as securityDeposit,
        g.complement
      FROM contracts c
      JOIN contract_statuses cs ON c.status_id = cs.id
      LEFT JOIN guarantees g ON c.id = g.contract_id
      ORDER BY c.start_date DESC
    `).all();

    return rows.map(this.mapRowToContract);
  }

  findById(id: string): Contract | null {
    const row = this.db.prepare(`
      SELECT 
        c.id,
        c.property_id as propertyId,
        c.tenant_id as tenantId,
        c.start_date as startDate,
        c.contract_date as contractDate,
        c.duration_months as durationMonths,
        c.rent_amount as rentAmount,
        c.payment_day as paymentDay,
        cs.name as status,
        c.contract_number as contractNumber,
        c.broker_id as brokerId,
        g.security_deposit as securityDeposit,
        g.complement
      FROM contracts c
      JOIN contract_statuses cs ON c.status_id = cs.id
      LEFT JOIN guarantees g ON c.id = g.contract_id
      WHERE c.id = ?
    `).get(id);

    return row ? this.mapRowToContract(row) : null;
  }

  create(contract: Omit<Contract, 'id' | 'status'>): Contract {
    const id = this.generateId('contract');

    return this.transaction(() => {
      // Insert contract
      this.db.prepare(`
        INSERT INTO contracts (
          id, property_id, tenant_id, broker_id, contract_number,
          start_date, contract_date, duration_months, rent_amount,
          payment_day, status_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `).run(
        id,
        contract.propertyId,
        contract.tenantId,
        contract.brokerId || null,
        contract.contractNumber || null,
        contract.startDate,
        contract.contractDate || null,
        contract.durationMonths,
        contract.rentAmount,
        contract.paymentDay
      );

      // Insert guarantee if security deposit exists
      if (contract.securityDeposit || contract.complement) {
        const guaranteeId = this.generateId('guarantee');
        this.db.prepare(`
          INSERT INTO guarantees (
            id, contract_id, guarantee_type, security_deposit, complement
          )
          VALUES (?, ?, 'caucao', ?, ?)
        `).run(
          guaranteeId,
          id,
          contract.securityDeposit || null,
          contract.complement || null
        );
      }

      // Update property status to rented
      this.db.prepare("UPDATE properties SET status_id = 'rented' WHERE id = ?").run(contract.propertyId);

      return {
        id,
        ...contract,
        status: 'Ativo' as 'Ativo' | 'Encerrado'
      };
    });
  }

  update(id: string, updates: Partial<Contract>): Contract {
    return this.transaction(() => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.propertyId !== undefined) {
        fields.push('property_id = ?');
        values.push(updates.propertyId);
      }
      if (updates.tenantId !== undefined) {
        fields.push('tenant_id = ?');
        values.push(updates.tenantId);
      }
      if (updates.brokerId !== undefined) {
        fields.push('broker_id = ?');
        values.push(updates.brokerId);
      }
      if (updates.contractNumber !== undefined) {
        fields.push('contract_number = ?');
        values.push(updates.contractNumber);
      }
      if (updates.startDate !== undefined) {
        fields.push('start_date = ?');
        values.push(updates.startDate);
      }
      if (updates.contractDate !== undefined) {
        fields.push('contract_date = ?');
        values.push(updates.contractDate);
      }
      if (updates.durationMonths !== undefined) {
        fields.push('duration_months = ?');
        values.push(updates.durationMonths);
      }
      if (updates.rentAmount !== undefined) {
        fields.push('rent_amount = ?');
        values.push(updates.rentAmount);
      }
      if (updates.paymentDay !== undefined) {
        fields.push('payment_day = ?');
        values.push(updates.paymentDay);
      }
      if (updates.status !== undefined) {
        fields.push('status_id = ?');
        values.push(updates.status === 'Ativo' ? 'active' : 'terminated');
      }

      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        this.db.prepare(`UPDATE contracts SET ${fields.join(', ')} WHERE id = ?`).run(...values);
      }

      // Update guarantee if needed
      if (updates.securityDeposit !== undefined || updates.complement !== undefined) {
        const existingGuarantee = this.db.prepare('SELECT id FROM guarantees WHERE contract_id = ?').get(id) as any;
        
        if (existingGuarantee) {
          const gFields: string[] = [];
          const gValues: any[] = [];

          if (updates.securityDeposit !== undefined) {
            gFields.push('security_deposit = ?');
            gValues.push(updates.securityDeposit);
          }
          if (updates.complement !== undefined) {
            gFields.push('complement = ?');
            gValues.push(updates.complement);
          }

          if (gFields.length > 0) {
            gFields.push('updated_at = CURRENT_TIMESTAMP');
            gValues.push(existingGuarantee.id);
            this.db.prepare(`UPDATE guarantees SET ${gFields.join(', ')} WHERE id = ?`).run(...gValues);
          }
        } else if (updates.securityDeposit || updates.complement) {
          const guaranteeId = this.generateId('guarantee');
          this.db.prepare(`
            INSERT INTO guarantees (id, contract_id, guarantee_type, security_deposit, complement)
            VALUES (?, ?, 'caucao', ?, ?)
          `).run(guaranteeId, id, updates.securityDeposit || null, updates.complement || null);
        }
      }

      const updated = this.findById(id);
      if (!updated) throw new Error('Contract not found after update');
      return updated;
    });
  }

  delete(id: string): void {
    this.transaction(() => {
      // Get property ID before deleting contract
      const contract = this.db.prepare('SELECT property_id FROM contracts WHERE id = ?').get(id) as any;
      
      if (contract) {
        // Update property status back to available
        this.db.prepare("UPDATE properties SET status_id = 'available' WHERE id = ?").run(contract.property_id);
      }

      // Delete contract (cascade will handle guarantees and financial records)
      this.db.prepare('DELETE FROM contracts WHERE id = ?').run(id);
    });
  }

  private mapRowToContract(row: any): Contract {
    return {
      id: row.id,
      propertyId: row.propertyId,
      tenantId: row.tenantId,
      startDate: row.startDate,
      contractDate: row.contractDate,
      durationMonths: row.durationMonths,
      rentAmount: row.rentAmount,
      paymentDay: row.paymentDay,
      status: row.status as 'Ativo' | 'Encerrado',
      contractNumber: row.contractNumber,
      brokerId: row.brokerId,
      securityDeposit: row.securityDeposit,
      complement: row.complement
    };
  }
}

