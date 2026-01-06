import { getDatabase, initializeDatabase, transaction, generateId } from './client';

// =====================================
// HELPER FUNCTIONS
// =====================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function randomDecimal(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function generateCPF(): string {
  const n = (n: number) => randomInt(0, n);
  const d1 = n(9), d2 = n(9), d3 = n(9), d4 = n(9), d5 = n(9), d6 = n(9), d7 = n(9), d8 = n(9), d9 = n(9);
  let d10 = ((d1 * 10 + d2 * 9 + d3 * 8 + d4 * 7 + d5 * 6 + d6 * 5 + d7 * 4 + d8 * 3 + d9 * 2) * 10) % 11;
  d10 = d10 === 10 ? 0 : d10;
  let d11 = ((d1 * 11 + d2 * 10 + d3 * 9 + d4 * 8 + d5 * 7 + d6 * 6 + d7 * 5 + d8 * 4 + d9 * 3 + d10 * 2) * 10) % 11;
  d11 = d11 === 10 ? 0 : d11;
  return `${d1}${d2}${d3}.${d4}${d5}${d6}.${d7}${d8}${d9}-${d10}${d11}`;
}

function generateCNPJ(): string {
  const n = () => randomInt(0, 9);
  return `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}/${n()}${n()}${n()}${n()}-${n()}${n()}`;
}

function generatePhone(): string {
  const ddd = randomInt(11, 99);
  const prefix = randomInt(90000, 99999);
  const suffix = randomInt(1000, 9999);
  return `(${ddd}) ${prefix}-${suffix}`;
}

function generateEmail(name: string, suffix: string = '@exata.com'): string {
  return name.toLowerCase().replace(/\s+/g, '.') + suffix;
}

function generateDate(startYear: number, endYear: number): string {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// =====================================
// DATA GENERATORS
// =====================================

const firstNames = [
  'João', 'Maria', 'José', 'Ana', 'Carlos', 'Paula', 'Pedro', 'Juliana', 'Lucas', 'Fernanda',
  'Rafael', 'Mariana', 'Bruno', 'Camila', 'Felipe', 'Amanda', 'Ricardo', 'Beatriz', 'Rodrigo', 'Carolina',
  'Guilherme', 'Larissa', 'Marcelo', 'Patrícia', 'Thiago', 'Gabriela', 'Diego', 'Letícia', 'Vinícius', 'Priscila',
  'Leonardo', 'Tatiana', 'André', 'Vanessa', 'Gustavo', 'Bruna', 'Mateus', 'Cristina', 'Henrique', 'Renata',
  'Fernando', 'Daniela', 'Eduardo', 'Adriana', 'Roberto', 'Simone', 'Alexandre', 'Mônica', 'Fábio', 'Sandra',
  'Marcio', 'Luciana', 'Paulo', 'Elaine', 'Leandro', 'Alessandra', 'Sérgio', 'Carla', 'Daniel', 'Rosana'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Almeida', 'Nascimento', 'Araújo', 'Melo', 'Barbosa',
  'Cardoso', 'Correia', 'Dias', 'Teixeira', 'Monteiro', 'Mendes', 'Moreira', 'Pinto', 'Castro', 'Cavalcanti'
];

const streetNames = [
  'Rua das Flores', 'Avenida Paulista', 'Rua Augusta', 'Rua Oscar Freire', 'Avenida Brigadeiro Faria Lima',
  'Rua Consolação', 'Avenida Ipiranga', 'Rua Haddock Lobo', 'Rua da Mooca', 'Avenida São João',
  'Rua Voluntários da Pátria', 'Avenida Rebouças', 'Rua Estados Unidos', 'Avenida Brasil', 'Rua Itapeva',
  'Avenida Europa', 'Rua Pamplona', 'Rua Joaquim Floriano', 'Avenida Angélica', 'Rua Bela Cintra'
];

const neighborhoods = [
  'Centro', 'Jardins', 'Bela Vista', 'Pinheiros', 'Moema', 'Vila Mariana', 'Ipiranga', 'Perdizes',
  'Santana', 'Tatuapé', 'Vila Madalena', 'Brooklin', 'Itaim Bibi', 'Morumbi', 'Butantã'
];

const cities = ['São Paulo', 'Campinas', 'Santos', 'São Bernardo do Campo', 'Santo André', 'Osasco'];

const professions = [
  'Advogado', 'Médico', 'Empresário', 'Engenheiro', 'Professor', 'Arquiteto', 'Aposentado',
  'Contador', 'Dentista', 'Psicólogo', 'Farmacêutico', 'Veterinário', 'Jornalista', 'Desenvolvedor',
  'Designer', 'Consultor', 'Administrador', 'Economista', 'Analista', 'Gerente'
];

const banks = ['Itaú', 'Bradesco', 'Banco do Brasil', 'Santander', 'Nubank', 'Caixa', 'Sicredi', 'Inter'];

const propertyTypeIds = ['apt', 'house', 'kitnete', 'warehouse', 'commercial', 'land', 'condo_fee', 'other'];

function generateName(): string {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

// =====================================
// SEED FUNCTIONS
// =====================================

function seedLookupTables(db: any) {
  console.log('📝 Seeding lookup tables...');

  // Property Types
  const propertyTypes = [
    { id: 'apt', name: 'Apartamento' },
    { id: 'house', name: 'Casa' },
    { id: 'kitnete', name: 'Kitnete' },
    { id: 'warehouse', name: 'Galpão' },
    { id: 'commercial', name: 'Sala Comercial' },
    { id: 'land', name: 'Terreno' },
    { id: 'condo_fee', name: 'Taxa de Condomínio' },
    { id: 'other', name: 'Outros' }
  ];

  const insertPropertyType = db.prepare('INSERT INTO property_types (id, name) VALUES (?, ?)');
  for (const type of propertyTypes) {
    insertPropertyType.run(type.id, type.name);
  }

  // Property Statuses
  const propertyStatuses = [
    { id: 'available', name: 'Disponível' },
    { id: 'rented', name: 'Alugado' }
  ];

  const insertPropertyStatus = db.prepare('INSERT INTO property_statuses (id, name) VALUES (?, ?)');
  for (const status of propertyStatuses) {
    insertPropertyStatus.run(status.id, status.name);
  }

  // Contract Statuses
  const contractStatuses = [
    { id: 'active', name: 'Ativo' },
    { id: 'terminated', name: 'Encerrado' }
  ];

  const insertContractStatus = db.prepare('INSERT INTO contract_statuses (id, name) VALUES (?, ?)');
  for (const status of contractStatuses) {
    insertContractStatus.run(status.id, status.name);
  }

  // Financial Statuses
  const financialStatuses = [
    { id: 'pending', name: 'Pendente' },
    { id: 'paid', name: 'Pago' },
    { id: 'overdue', name: 'Atrasado' }
  ];

  const insertFinancialStatus = db.prepare('INSERT INTO financial_statuses (id, name) VALUES (?, ?)');
  for (const status of financialStatuses) {
    insertFinancialStatus.run(status.id, status.name);
  }

  // Financial Categories
  const financialCategories = [
    { id: 'cat-rent', name: 'Aluguel', type: 'Receita' },
    { id: 'cat-reservation', name: 'Taxa de Reserva', type: 'Receita' },
    { id: 'cat-late-fee', name: 'Multa por Atraso', type: 'Receita' },
    { id: 'cat-refund', name: 'Reembolso', type: 'Receita' },
    { id: 'cat-maintenance', name: 'Manutenção', type: 'Despesa' },
    { id: 'cat-condo', name: 'Condomínio', type: 'Despesa' },
    { id: 'cat-iptu', name: 'IPTU', type: 'Despesa' },
    { id: 'cat-commission', name: 'Comissão', type: 'Despesa' },
    { id: 'cat-transfer', name: 'Repasse a Cliente', type: 'Despesa' },
    { id: 'cat-advertising', name: 'Publicidade', type: 'Despesa' }
  ];

  const insertCategory = db.prepare('INSERT INTO financial_categories (id, name, type) VALUES (?, ?, ?)');
  for (const cat of financialCategories) {
    insertCategory.run(cat.id, cat.name, cat.type);
  }

  console.log('✅ Lookup tables seeded');
}

function seedBrokers(db: any, count: number) {
  console.log(`📝 Seeding ${count} brokers...`);

  const insertBroker = db.prepare(`
    INSERT INTO brokers (id, name, creci, email, phone, commission_rate)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const brokerIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const id = generateId('broker');
    const name = generateName();
    const creci = `${randomInt(10000, 99999)}-F`;
    const email = generateEmail(name, '@corretor.com');
    const phone = generatePhone();
    const commissionRate = randomDecimal(10, 20, 1); // 10% to 20%

    insertBroker.run(id, name, creci, email, phone, commissionRate);
    brokerIds.push(id);
  }

  console.log(`✅ ${count} brokers seeded`);
  return brokerIds;
}

function seedOwners(db: any, count: number) {
  console.log(`📝 Seeding ${count} owners...`);

  const insertOwner = db.prepare(`
    INSERT INTO owners (id, name, email, phone, commercial_phone, document, profession, num_contrato_adm, commission_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAddress = db.prepare(`
    INSERT INTO addresses (id, entity_type, entity_id, street, number, complement, neighborhood, city, state, zipcode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBankAccount = db.prepare(`
    INSERT INTO bank_accounts (id, owner_id, bank_name, account_type, agency, account_number, pix_key, is_primary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const ownerIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const id = generateId('owner');
    const name = generateName();
    const email = generateEmail(name);
    const phone = generatePhone();
    const commercialPhone = Math.random() > 0.5 ? generatePhone() : null;
    const document = Math.random() > 0.7 ? generateCNPJ() : generateCPF();
    const profession = randomItem(professions);
    const numContratoAdm = `ADM-2024-${i.toString().padStart(4, '0')}`;
    const commissionRate = randomDecimal(8, 15, 1);

    insertOwner.run(id, name, email, phone, commercialPhone, document, profession, numContratoAdm, commissionRate);

    // Address
    const addressId = generateId('addr');
    const street = randomItem(streetNames);
    const number = randomInt(10, 5000).toString();
    const complement = Math.random() > 0.7 ? `Apto ${randomInt(1, 150)}` : null;
    const neighborhood = randomItem(neighborhoods);
    const city = randomItem(cities);
    const state = 'SP';
    const zipcode = `${randomInt(10000, 99999)}-${randomInt(100, 999)}`;

    insertAddress.run(addressId, 'owner', id, street, number, complement, neighborhood, city, state, zipcode);

    // Bank Account
    const bankId = generateId('bank');
    const bankName = randomItem(banks);
    const accountType = randomItem(['Corrente', 'Poupança']);
    const agency = randomInt(1000, 9999).toString();
    const accountNumber = `${randomInt(10000, 99999)}-${randomInt(0, 9)}`;
    const pixKey = document;

    insertBankAccount.run(bankId, id, bankName, accountType, agency, accountNumber, pixKey, 1);

    ownerIds.push(id);
  }

  console.log(`✅ ${count} owners seeded`);
  return ownerIds;
}

function seedTenants(db: any, count: number) {
  console.log(`📝 Seeding ${count} tenants...`);

  const insertTenant = db.prepare(`
    INSERT INTO tenants (id, name, email, phone, whatsapp, document, rg, profession, naturalness, birth_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tenantIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const id = generateId('tenant');
    const name = generateName();
    const email = generateEmail(name, '@email.com');
    const phone = generatePhone();
    const whatsapp = Math.random() > 0.3 ? phone : null;
    const document = generateCPF();
    const rg = `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`;
    const profession = randomItem(professions);
    const naturalness = randomItem(cities);
    const birthDate = generateDate(1950, 2000);

    insertTenant.run(id, name, email, phone, whatsapp, document, rg, profession, naturalness, birthDate);
    tenantIds.push(id);
  }

  console.log(`✅ ${count} tenants seeded`);
  return tenantIds;
}

function seedProperties(db: any, ownerIds: string[], minPerOwner: number, maxPerOwner: number) {
  console.log(`📝 Seeding properties (${minPerOwner}-${maxPerOwner} per owner)...`);

  const insertProperty = db.prepare(`
    INSERT INTO properties (id, owner_id, property_type_id, address, value, iptu, pms_control_number, status_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const propertyIds: string[] = [];
  let totalProperties = 0;

  for (const ownerId of ownerIds) {
    const numProps = randomInt(minPerOwner, maxPerOwner);

    for (let j = 1; j <= numProps; j++) {
      const id = generateId('prop');
      const typeId = randomItem(propertyTypeIds);
      const street = randomItem(streetNames);
      const number = randomInt(10, 2000);
      const unit = (typeId === 'apt' || typeId === 'commercial') ? ` - Apt ${randomInt(1, 100)}` : '';
      const address = `${street}, ${number}${unit}`;
      const value = randomDecimal(200000, 3000000, 2);
      const iptu = randomDecimal(500, 8000, 2);
      const pmsControlNumber = Math.random() > 0.5 ? `PMS-${randomInt(100000, 999999)}` : null;
      const statusId = 'available';

      insertProperty.run(id, ownerId, typeId, address, value, iptu, pmsControlNumber, statusId);
      propertyIds.push(id);
      totalProperties++;
    }
  }

  console.log(`✅ ${totalProperties} properties seeded`);
  return propertyIds;
}

function seedContracts(db: any, propertyIds: string[], tenantIds: string[], brokerIds: string[], contractsPercentage: number) {
  console.log(`📝 Seeding contracts (${contractsPercentage}% of properties)...`);

  const numContracts = Math.floor(propertyIds.length * contractsPercentage / 100);
  const availableProperties = [...propertyIds];
  const availableTenants = [...tenantIds];

  const insertContract = db.prepare(`
    INSERT INTO contracts (id, property_id, tenant_id, broker_id, contract_number, start_date, contract_date, duration_months, rent_amount, payment_day, status_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertGuarantee = db.prepare(`
    INSERT INTO guarantees (id, contract_id, guarantee_type, security_deposit, caucao_complement, guarantor_name, guarantor_document, guarantor_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updatePropertyStatus = db.prepare('UPDATE properties SET status_id = ? WHERE id = ?');

  const contractIds: string[] = [];

  for (let i = 0; i < numContracts && availableProperties.length > 0; i++) {
    const propertyId = availableProperties.splice(randomInt(0, availableProperties.length - 1), 1)[0];
    const tenantId = randomItem(availableTenants);
    const brokerId = Math.random() > 0.3 ? randomItem(brokerIds) : null;
    const contractId = generateId('contract');
    const contractNumber = `LOC-2024-${(i + 1).toString().padStart(5, '0')}`;
    const startDate = generateDate(2023, 2024);
    const contractDate = new Date(startDate);
    contractDate.setDate(contractDate.getDate() - randomInt(1, 30));
    const durationMonths = randomItem([12, 24, 30, 36]);
    const rentAmount = randomDecimal(1500, 15000, 2);
    const paymentDay = randomItem([1, 5, 10, 15, 20, 25]);
    const statusId = 'active';

    insertContract.run(
      contractId, propertyId, tenantId, brokerId, contractNumber,
      startDate, contractDate.toISOString().split('T')[0],
      durationMonths, rentAmount, paymentDay, statusId
    );

    // Update property status
    updatePropertyStatus.run('rented', propertyId);

    // Guarantee
    const guaranteeId = generateId('guarantee');
    const guaranteeType = randomItem(['none', 'caucao', 'fiador', 'seguro']);
    let securityDeposit = null;
    let caucaoComplement = null;
    let guarantorName = null;
    let guarantorDocument = null;
    let guarantorPhone = null;

    if (guaranteeType === 'caucao') {
      securityDeposit = rentAmount * randomInt(1, 3);
      caucaoComplement = Math.random() > 0.7 ? randomDecimal(500, 2000, 2) : null;
    } else if (guaranteeType === 'fiador') {
      guarantorName = generateName();
      guarantorDocument = generateCPF();
      guarantorPhone = generatePhone();
    }

    insertGuarantee.run(guaranteeId, contractId, guaranteeType, securityDeposit, caucaoComplement, guarantorName, guarantorDocument, guarantorPhone);

    contractIds.push(contractId);
  }

  console.log(`✅ ${contractIds.length} contracts seeded`);
  return contractIds;
}

function seedFinancialRecords(db: any, contractIds: string[], brokerIds: string[]) {
  console.log(`📝 Seeding financial records...`);

  const getContract = db.prepare('SELECT * FROM contracts WHERE id = ?');
  const getBroker = db.prepare('SELECT * FROM brokers WHERE id = ?');

  const insertFinancial = db.prepare(`
    INSERT INTO financial_records (id, contract_id, category_id, status_id, description, amount, due_date, payment_date, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertIntermediation = db.prepare(`
    INSERT INTO intermediations (id, contract_id, broker_id, commission_amount, commission_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  let totalRecords = 0;

  for (const contractId of contractIds) {
    const contract: any = getContract.get(contractId);
    if (!contract) continue;

    const startDate = new Date(contract.start_date);
    const now = new Date();
    const monthsElapsed = Math.min(
      Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)),
      contract.duration_months
    );

    // Generate rent records for elapsed months
    for (let month = 0; month < monthsElapsed; month++) {
      const dueDate = addMonths(startDate, month);
      dueDate.setDate(contract.payment_day);

      const recordId = generateId('financial');
      const statusId = Math.random() > 0.2 ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'overdue');
      const paymentDate = statusId === 'paid' ? new Date(dueDate.getTime() + randomInt(0, 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
      const description = `Aluguel ${dueDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;

      insertFinancial.run(
        recordId, contractId, 'cat-rent', statusId, description,
        contract.rent_amount, dueDate.toISOString().split('T')[0], paymentDate, 'Receita'
      );

      totalRecords++;

      // Generate commission if paid and has broker
      if (statusId === 'paid' && contract.broker_id) {
        const broker: any = getBroker.get(contract.broker_id);
        if (broker && broker.commission_rate) {
          const commissionAmount = (contract.rent_amount * broker.commission_rate) / 100;
          const commissionId = generateId('financial');
          const commissionDescription = `Comissão ${broker.name} - ${description}`;

          insertFinancial.run(
            commissionId, contractId, 'cat-commission', 'paid', commissionDescription,
            commissionAmount, dueDate.toISOString().split('T')[0], paymentDate, 'Despesa'
          );

          // Intermediation record
          const intermediationId = generateId('intermediation');
          insertIntermediation.run(intermediationId, contractId, broker.id, commissionAmount, paymentDate);

          totalRecords++;
        }
      }

      // Random additional charges (condo, iptu, late fees)
      if (Math.random() > 0.7) {
        const additionalId = generateId('financial');
        const additionalType = randomItem(['cat-condo', 'cat-iptu', 'cat-late-fee']);
        const additionalAmount = additionalType === 'cat-late-fee' 
          ? randomDecimal(100, 500, 2)
          : randomDecimal(300, 2000, 2);
        const additionalDesc = additionalType === 'cat-late-fee' 
          ? `Multa por atraso - ${description}`
          : `${additionalType === 'cat-condo' ? 'Condomínio' : 'IPTU'} - ${description}`;

        insertFinancial.run(
          additionalId, contractId, additionalType, statusId, additionalDesc,
          additionalAmount, dueDate.toISOString().split('T')[0], paymentDate,
          additionalType === 'cat-late-fee' ? 'Receita' : 'Despesa'
        );

        totalRecords++;
      }
    }
  }

  console.log(`✅ ${totalRecords} financial records seeded`);
}

// =====================================
// SEED USERS
// =====================================

function seedUsers(db: any): string[] {
  console.log('   Seeding users...');
  
  const users = [
    {
      id: generateId('user'),
      name: 'Admin',
      email: 'admin@exata.com',
      phone: '(11) 99999-9999',
      role: 'Admin',
      password_hash: '123', // In production, this should be hashed
      is_active: 1
    },
    {
      id: generateId('user'),
      name: 'Operador',
      email: 'operador@exata.com',
      phone: '(11) 98888-8888',
      role: 'Operador',
      password_hash: '123',
      is_active: 1
    },
    {
      id: generateId('user'),
      name: 'João Silva',
      email: 'joao.silva@exata.com',
      phone: '(11) 97777-7777',
      role: 'Operador',
      password_hash: '123',
      is_active: 1
    },
    {
      id: generateId('user'),
      name: 'Maria Santos',
      email: 'maria.santos@exata.com',
      phone: '(11) 96666-6666',
      role: 'Operador',
      password_hash: '123',
      is_active: 1
    },
    {
      id: generateId('user'),
      name: 'Carlos Admin',
      email: 'carlos@exata.com',
      phone: '(11) 95555-5555',
      role: 'Admin',
      password_hash: '123',
      is_active: 1
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, role, password_hash, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const userIds: string[] = [];
  for (const user of users) {
    insertUser.run(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.password_hash,
      user.is_active
    );
    userIds.push(user.id);
  }

  console.log(`   ✓ Created ${users.length} users`);
  return userIds;
}

// =====================================
// MAIN SEED FUNCTION
// =====================================

export function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  const db = getDatabase();

  transaction(() => {
    // 1. Lookup tables
    seedLookupTables(db);

    // 2. Users - Usuários do sistema
    seedUsers(db);

    // 3. Brokers - 50 corretores (dezenas conforme solicitado)
    const brokerIds = seedBrokers(db, 50);

    // 4. Owners - 100 clientes
    const ownerIds = seedOwners(db, 100);

    // 5. Tenants - 200 inquilinos (diversos)
    const tenantIds = seedTenants(db, 200);

    // 6. Properties - 20-40 por cliente (dezenas variadas)
    const propertyIds = seedProperties(db, ownerIds, 20, 40);

    // 7. Contracts - 60% das propriedades alugadas (diversos contratos)
    const contractIds = seedContracts(db, propertyIds, tenantIds, brokerIds, 60);

    // 8. Financial records - registros de aluguéis e comissões
    seedFinancialRecords(db, contractIds, brokerIds);
  });

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  
  const counts = {
    users: db.prepare('SELECT COUNT(*) as count FROM users').get(),
    owners: db.prepare('SELECT COUNT(*) as count FROM owners').get(),
    brokers: db.prepare('SELECT COUNT(*) as count FROM brokers').get(),
    tenants: db.prepare('SELECT COUNT(*) as count FROM tenants').get(),
    properties: db.prepare('SELECT COUNT(*) as count FROM properties').get(),
    contracts: db.prepare('SELECT COUNT(*) as count FROM contracts').get(),
    financial: db.prepare('SELECT COUNT(*) as count FROM financial_records').get()
  };

  console.log(`   - Usuários: ${counts.users.count}`);
  console.log(`   - Clientes: ${counts.owners.count}`);
  console.log(`   - Corretores: ${counts.brokers.count}`);
  console.log(`   - Inquilinos: ${counts.tenants.count}`);
  console.log(`   - Imóveis: ${counts.properties.count}`);
  console.log(`   - Contratos: ${counts.contracts.count}`);
  console.log(`   - Registros Financeiros: ${counts.financial.count}`);
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
  seedDatabase();
  process.exit(0);
}

