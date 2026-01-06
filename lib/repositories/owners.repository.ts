import { BaseRepository } from './base.repository';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BankAccount {
  bankName: string;
  accountType: 'Corrente' | 'Poupança';
  agency: string;
  accountNumber: string;
  pixKey?: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  commercialPhone?: string;
  document: string;
  profession?: string;
  address?: Address;
  bankAccount?: BankAccount;
  num_contrato_adm?: string;
  commission_rate?: number;
  admContractAddendum?: string;
  admContractAddendumDate?: string;
}

export class OwnersRepository extends BaseRepository<Owner> {
  constructor() {
    super('owners');
  }

  findAll(): Owner[] {
    const rows = this.db.prepare(`
      SELECT 
        o.*,
        a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.zipcode,
        ba.bank_name, ba.account_type, ba.agency, ba.account_number, ba.pix_key
      FROM owners o
      LEFT JOIN addresses a ON a.entity_type = 'owner' AND a.entity_id = o.id
      LEFT JOIN bank_accounts ba ON ba.owner_id = o.id AND ba.is_primary = 1
      ORDER BY o.name
    `).all();

    return rows.map(this.mapRowToOwner);
  }

  findById(id: string): Owner | null {
    const row = this.db.prepare(`
      SELECT 
        o.*,
        a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.zipcode,
        ba.bank_name, ba.account_type, ba.agency, ba.account_number, ba.pix_key
      FROM owners o
      LEFT JOIN addresses a ON a.entity_type = 'owner' AND a.entity_id = o.id
      LEFT JOIN bank_accounts ba ON ba.owner_id = o.id AND ba.is_primary = 1
      WHERE o.id = ?
    `).get(id);

    return row ? this.mapRowToOwner(row) : null;
  }

  create(owner: Omit<Owner, 'id'>): Owner {
    const id = this.generateId('owner');

    return this.transaction(() => {
      // Insert owner
      this.db.prepare(`
        INSERT INTO owners (
          id, name, email, phone, commercial_phone, document, profession,
          num_contrato_adm, commission_rate, adm_contract_addendum, adm_contract_addendum_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        owner.name,
        owner.email,
        owner.phone,
        owner.commercialPhone || null,
        owner.document,
        owner.profession || null,
        owner.num_contrato_adm || null,
        owner.commission_rate || 10,
        owner.admContractAddendum || null,
        owner.admContractAddendumDate || null
      );

      // Insert address if exists
      if (owner.address) {
        const addrId = this.generateId('addr');
        this.db.prepare(`
          INSERT INTO addresses (
            id, entity_type, entity_id, street, number, complement,
            neighborhood, city, state, zipcode
          )
          VALUES (?, 'owner', ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          addrId,
          id,
          owner.address.street,
          owner.address.number,
          owner.address.complement || null,
          owner.address.neighborhood,
          owner.address.city,
          owner.address.state,
          owner.address.zipCode
        );
      }

      // Insert bank account if exists
      if (owner.bankAccount) {
        const bankId = this.generateId('bank');
        this.db.prepare(`
          INSERT INTO bank_accounts (
            id, owner_id, bank_name, account_type, agency,
            account_number, pix_key, is_primary
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          bankId,
          id,
          owner.bankAccount.bankName,
          owner.bankAccount.accountType,
          owner.bankAccount.agency,
          owner.bankAccount.accountNumber,
          owner.bankAccount.pixKey || null
        );
      }

      return { id, ...owner };
    });
  }

  update(id: string, updates: Partial<Owner>): Owner {
    return this.transaction(() => {
      // Build dynamic UPDATE query
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
      if (updates.commercialPhone !== undefined) {
        fields.push('commercial_phone = ?');
        values.push(updates.commercialPhone);
      }
      if (updates.document !== undefined) {
        fields.push('document = ?');
        values.push(updates.document);
      }
      if (updates.profession !== undefined) {
        fields.push('profession = ?');
        values.push(updates.profession);
      }
      if (updates.num_contrato_adm !== undefined) {
        fields.push('num_contrato_adm = ?');
        values.push(updates.num_contrato_adm);
      }
      if (updates.commission_rate !== undefined) {
        fields.push('commission_rate = ?');
        values.push(updates.commission_rate);
      }
      if (updates.admContractAddendum !== undefined) {
        fields.push('adm_contract_addendum = ?');
        values.push(updates.admContractAddendum);
      }
      if (updates.admContractAddendumDate !== undefined) {
        fields.push('adm_contract_addendum_date = ?');
        values.push(updates.admContractAddendumDate);
      }

      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        this.db.prepare(`
          UPDATE owners SET ${fields.join(', ')} WHERE id = ?
        `).run(...values);
      }

      // Update address if provided
      if (updates.address) {
        const existingAddr = this.db.prepare(
          "SELECT id FROM addresses WHERE entity_type = 'owner' AND entity_id = ?"
        ).get(id) as any;

        if (existingAddr) {
          this.db.prepare(`
            UPDATE addresses SET
              street = ?, number = ?, complement = ?, neighborhood = ?,
              city = ?, state = ?, zipcode = ?, updated_at = CURRENT_TIMESTAMP
            WHERE entity_type = 'owner' AND entity_id = ?
          `).run(
            updates.address.street,
            updates.address.number,
            updates.address.complement || null,
            updates.address.neighborhood,
            updates.address.city,
            updates.address.state,
            updates.address.zipCode,
            id
          );
        } else {
          const addrId = this.generateId('addr');
          this.db.prepare(`
            INSERT INTO addresses (
              id, entity_type, entity_id, street, number, complement,
              neighborhood, city, state, zipcode
            )
            VALUES (?, 'owner', ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            addrId,
            id,
            updates.address.street,
            updates.address.number,
            updates.address.complement || null,
            updates.address.neighborhood,
            updates.address.city,
            updates.address.state,
            updates.address.zipCode
          );
        }
      }

      // Update bank account if provided
      if (updates.bankAccount) {
        const existingBank = this.db.prepare(
          'SELECT id FROM bank_accounts WHERE owner_id = ? AND is_primary = 1'
        ).get(id) as any;

        if (existingBank) {
          this.db.prepare(`
            UPDATE bank_accounts SET
              bank_name = ?, account_type = ?, agency = ?,
              account_number = ?, pix_key = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(
            updates.bankAccount.bankName,
            updates.bankAccount.accountType,
            updates.bankAccount.agency,
            updates.bankAccount.accountNumber,
            updates.bankAccount.pixKey || null,
            existingBank.id
          );
        } else {
          const bankId = this.generateId('bank');
          this.db.prepare(`
            INSERT INTO bank_accounts (
              id, owner_id, bank_name, account_type, agency,
              account_number, pix_key, is_primary
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
          `).run(
            bankId,
            id,
            updates.bankAccount.bankName,
            updates.bankAccount.accountType,
            updates.bankAccount.agency,
            updates.bankAccount.accountNumber,
            updates.bankAccount.pixKey || null
          );
        }
      }

      const updated = this.findById(id);
      if (!updated) throw new Error('Owner not found after update');
      return updated;
    });
  }

  delete(id: string): void {
    this.transaction(() => {
      // Delete address (cascade will handle it, but explicit is clearer)
      this.db.prepare("DELETE FROM addresses WHERE entity_type = 'owner' AND entity_id = ?").run(id);
      
      // Delete bank accounts (cascade will handle it)
      this.db.prepare('DELETE FROM bank_accounts WHERE owner_id = ?').run(id);
      
      // Delete owner
      this.db.prepare('DELETE FROM owners WHERE id = ?').run(id);
    });
  }

  private mapRowToOwner(row: any): Owner {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      commercialPhone: row.commercial_phone,
      document: row.document,
      profession: row.profession,
      num_contrato_adm: row.num_contrato_adm,
      commission_rate: row.commission_rate,
      admContractAddendum: row.adm_contract_addendum,
      admContractAddendumDate: row.adm_contract_addendum_date,
      address: row.street ? {
        street: row.street,
        number: row.number,
        complement: row.complement,
        neighborhood: row.neighborhood,
        city: row.city,
        state: row.state,
        zipCode: row.zipcode
      } : undefined,
      bankAccount: row.bank_name ? {
        bankName: row.bank_name,
        accountType: row.account_type,
        agency: row.agency,
        accountNumber: row.account_number,
        pixKey: row.pix_key
      } : undefined
    };
  }
}

