"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface BankAccount {
  bankName: string;
  accountType: 'Corrente' | 'Poupança';
  agency: string;
  accountNumber: string;
  pixKey?: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  commercialPhone?: string; 
  document: string; // CPF ou CNPJ
  profession?: string; 
  address?: Address; 
  bankAccount?: BankAccount; 
  num_contrato_adm?: string; 
  commission_rate?: number;
  admContractAddendum?: string;
  admContractAddendumDate?: string;
}

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

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  document: string; // CPF ou CNPJ
  rg?: string;
  profession?: string;
  naturalness?: string;
  birthDate?: string;
}

export interface Broker {
  id: string;
  name: string;
  creci: string;
  email: string;
  phone: string;
  commissionRate?: number; // Taxa de intermediação em percentual (ex: 1.5 = 1,5%)
}

export interface User {
  id: string;
  name: string;
  phone: string; // WhatsApp
  email: string;
  role: 'Admin' | 'Operador';
  password?: string; 
}

export interface Intermediation {
  id: string;
  contractId: string;
  brokerId: string;
  commissionAmount: number;
  date: string;
}

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  contractDate?: string; // Data do contrato/assinatura
  durationMonths: number;
  rentAmount: number;
  paymentDay: number;
  status: 'Ativo' | 'Encerrado';
  contractNumber?: string;
  brokerId?: string; // Corretor responsável pela intermediação
  securityDeposit?: number; // Caução
  complement?: string; // Complemento / Garantia
}

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

interface RealEstateContextType {
  owners: Owner[];
  properties: Property[];
  tenants: Tenant[];
  contracts: Contract[];
  brokers: Broker[];
  users: User[];
  intermediations: Intermediation[];
  financialRecords: FinancialRecord[];
  categories: FinancialCategory[];
  
  addOwner: (owner: Omit<Owner, 'id'>) => void;
  updateOwner: (id: string, updates: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  addProperty: (property: Omit<Property, 'id' | 'status'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  
  addBroker: (broker: Omit<Broker, 'id'>) => void;
  updateBroker: (id: string, updates: Partial<Broker>) => void;
  deleteBroker: (id: string) => void;
  
  addContract: (contract: Omit<Contract, 'id' | 'status'>, generateCommission?: boolean) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  updateFinancialRecord: (id: string, updates: Partial<FinancialRecord>) => void;
  deleteFinancialRecord: (id: string) => void;
  
  addCategory: (category: Omit<FinancialCategory, 'id'>) => void;
  
  generateBrokerCommission: (contractId: string) => void; // Gerar taxa de intermediação
  
  // Navigation Control
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

// --- Data Generation Helpers ---
const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Mariana', 'José', 'Lucia', 'Paulo', 'Fernanda', 'Roberto', 'Camila', 'Ricardo', 'Beatriz', 'Lucas', 'Juliana', 'Marcos', 'Patricia', 'Gabriel', 'Larissa'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'];
const streetNames = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Alameda Santos', 'Rua Oscar Freire', 'Av. Faria Lima', 'Rua da Consolação', 'Rua Bela Cintra', 'Rua Haddock Lobo', 'Al. Lorena', 'Rua dos Pinheiros', 'Av. Rebouças', 'Rua Pamplona', 'Av. Brasil', 'Rua Estados Unidos'];
const professions = ['Engenheiro', 'Médico', 'Professor', 'Advogado', 'Designer', 'Programador', 'Arquiteto', 'Contador', 'Empresário', 'Jornalista'];
const naturalnesses = ['São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Curitiba - PR', 'Porto Alegre - RS', 'Salvador - BA', 'Recife - PE', 'Fortaleza - CE'];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T,>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];
const generateName = () => `${randomItem(firstNames)} ${randomItem(lastNames)}`;
const generatePhone = () => `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`;
const generateCPF = () => `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`;
const generateRG = () => `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`;
const generateBirthDate = () => {
    const start = new Date(1960, 0, 1);
    const end = new Date(2000, 0, 1);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

function generateMockData() {
  const owners: Owner[] = [];
  const users: User[] = [];
  const properties: Property[] = [];
  const tenants: Tenant[] = [];
  const brokers: Broker[] = [];
  const contracts: Contract[] = [];
  const financialRecords: FinancialRecord[] = [];
  const intermediations: Intermediation[] = [];

  // 0. Users
  users.push(
    { id: '1', name: 'Admin User', email: 'admin@exata.com', phone: '(11) 99999-0000', role: 'Admin', password: '123' },
    { id: '2', name: 'Operador Teste', email: 'op@exata.com', phone: '(11) 98888-0000', role: 'Operador', password: '123' }
  );

  // 1. Brokers
  brokers.push(
    { id: '1', name: 'Carlos Santos', creci: '12345-F', email: 'carlos@imob.com', phone: '(11) 97777-7777' },
    { id: '2', name: 'Ana Pereira', creci: '54321-F', email: 'ana@imob.com', phone: '(11) 97777-8888' },
    { id: '3', name: 'Roberto Costa', creci: '98765-F', email: 'roberto@imob.com', phone: '(11) 97777-9999' }
  );

  // 2. Owners (20)
  for (let i = 1; i <= 20; i++) {
    const ownerId = `owner-${i}`;
    owners.push({
      id: ownerId,
      name: generateName(),
      email: `prop${i}@exata.com`,
      phone: generatePhone(),
      commercialPhone: Math.random() > 0.5 ? generatePhone() : undefined,
      document: generateCPF(),
      profession: randomItem(['Advogado', 'Médico', 'Empresário', 'Engenheiro', 'Professor', 'Arquiteto', 'Aposentado']),
      num_contrato_adm: `ADM-2024-${i.toString().padStart(3, '0')}`,
      commission_rate: 10,
      address: {
         street: randomItem(streetNames),
         number: String(randomInt(10, 5000)),
         neighborhood: randomItem(['Centro', 'Jardins', 'Bela Vista', 'Pinheiros', 'Moema']),
         city: 'São Paulo',
         state: 'SP',
         zipCode: '01000-000'
      },
      bankAccount: {
         bankName: randomItem(['Itaú', 'Bradesco', 'Banco do Brasil', 'Santander', 'Nubank']),
         accountType: 'Corrente',
         agency: String(randomInt(1000, 9999)),
         accountNumber: String(randomInt(10000, 99999)),
         pixKey: generateCPF()
      }
    });

    // 3. Properties (10-20 per owner)
    const numProps = randomInt(10, 20);
    for (let j = 1; j <= numProps; j++) {
      const type = randomItem(['Apartamento', 'Casa','Galpão','Kitnete', 'Stúdio','Sala Comercial','Terreno','Outros']);
      const street = randomItem(streetNames);
      const number = randomInt(10, 2000);
      const unit = type === 'Apartamento' || type === 'Comercial' ? ` - Apt ${randomInt(1, 100)}` : '';
      const value = randomInt(300000, 2000000);
      
      properties.push({
        id: `prop-${i}-${j}`,
        ownerId: ownerId,
        address: `${street}, ${number}${unit}`,
        type: type,
        value: value,
        iptu: randomInt(500, 5000), // Mock IPTU
        status: 'Disponível'
      });
    }
  }

  // 4. Tenants (40)
  for (let i = 1; i <= 40; i++) {
    const phone = generatePhone();
    tenants.push({
      id: `tenant-${i}`,
      name: generateName(),
      email: `inquilino${i}@email.com`,
      phone: phone,
      whatsapp: Math.random() > 0.3 ? phone : undefined,
      document: generateCPF(),
      rg: generateRG(),
      profession: randomItem(professions),
      naturalness: randomItem(naturalnesses),
      birthDate: generateBirthDate()
    });
  }

  // 5. Contracts (30)
  const shuffledProps = [...properties].sort(() => 0.5 - Math.random());
  
  for (let k = 0; k < 30; k++) {
    const property = shuffledProps[k];
    const tenant = tenants[k % tenants.length];
    const broker = randomItem(brokers);
    const contractId = `contract-${k}`;
    const rentAmount = randomInt(1500, 15000);
    // Random start date between Jan 2023 and May 2024
    const startYear = randomItem([2023, 2024]);
    const contractNumber = `LOC-${startYear}-${String(k + 1).padStart(3, '0')}`;
    const startMonth = randomInt(0, 11);
    const startDate = new Date(startYear, startMonth, randomInt(1, 28));
    const duration = randomItem([12, 24, 30, 36]);
    const paymentDay = randomInt(1, 28);
    
    // Caução & Complemento
    const hasDeposit = Math.random() > 0.5;
    const securityDeposit = hasDeposit ? rentAmount * 3 : undefined;
    const complement = hasDeposit ? '3x o valor do aluguel' : 'Seguro Fiança';

    // Update property status in our local array (state init will take this)
    property.status = 'Alugado';

    contracts.push({
      id: contractId,
      propertyId: property.id,
      tenantId: tenant.id,
      contractDate: new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias antes do início
      startDate: startDate.toISOString().split('T')[0],
      durationMonths: duration,
      rentAmount: rentAmount,
      paymentDay: paymentDay,
      status: 'Ativo',
      contractNumber: contractNumber,
      brokerId: broker.id,
      securityDeposit,
      complement
    });

    // Intermediation
    intermediations.push({
       id: `inter-${k}`,
       contractId: contractId,
       brokerId: broker.id,
       commissionAmount: rentAmount,
       date: startDate.toISOString()
    });

    // Commission Expense
    financialRecords.push({
       id: `fin-com-${k}`,
       contractId: contractId,
       description: `Comissão Intermediação - ${broker.name}`,
       category: 'Comissão',
       amount: rentAmount,
       dueDate: startDate.toISOString().split('T')[0],
       status: 'Pago',
       type: 'Despesa'
    });

    // Monthly Rents (Generate only up to current date + 12 months to avoid too many records)
    const today = new Date();
    // const limitDate = new Date();
    // limitDate.setFullYear(today.getFullYear() + 1);

    for (let m = 0; m < duration; m++) {
       const dueDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, paymentDay);
       
       // Stop generating if it's too far in the future (> 6 months from now) to keep table clean? 
       // User asked for realistic data, so let's keep all valid contract months.
       
       const isPast = dueDate < today;
       
       // Randomly mark past as Paid or Overdue (mostly paid)
       let status: 'Pendente' | 'Pago' | 'Atrasado' = 'Pendente';
       if (isPast) {
         status = Math.random() > 0.1 ? 'Pago' : 'Atrasado';
       }

       financialRecords.push({
         id: `fin-rent-${k}-${m}`,
         contractId: contractId,
         description: `Aluguel Mês ${m + 1}/${duration}`,
         category: 'Aluguel',
         amount: rentAmount,
         dueDate: dueDate.toISOString().split('T')[0],
         status: status,
         type: 'Receita'
       });
       
       // Also generate "Repasse" expense for the owner (Rent - 10%)
       if (isPast && status === 'Pago') {
           const adminFee = rentAmount * 0.1;
           const ownerAmount = rentAmount - adminFee;
           financialRecords.push({
             id: `fin-repasse-${k}-${m}`,
             contractId: contractId,
             description: `Repasse Aluguel Mês ${m + 1}`,
             category: 'Repasse a Cliente',
             amount: ownerAmount,
             dueDate: new Date(dueDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days after receipt
             status: Math.random() > 0.2 ? 'Pago' : 'Pendente',
             type: 'Despesa'
           });
       }
    }
  }

  return { owners, users, properties, tenants, brokers, contracts, intermediations, financialRecords };
}

export function RealEstateProvider({ children }: { children: ReactNode }) {
  // Initialize state with generated data
  const [initialData] = useState(generateMockData);

  const [owners, setOwners] = useState<Owner[]>(initialData.owners);
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [properties, setProperties] = useState<Property[]>(initialData.properties);
  const [tenants, setTenants] = useState<Tenant[]>(initialData.tenants);
  const [brokers, setBrokers] = useState<Broker[]>(initialData.brokers);
  const [contracts, setContracts] = useState<Contract[]>(initialData.contracts);
  const [intermediations, setIntermediations] = useState<Intermediation[]>(initialData.intermediations);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(initialData.financialRecords);

  // Categorias Padrão
  const [categories, setCategories] = useState<FinancialCategory[]>([
    // Receitas
    { id: '1', name: 'Aluguel', type: 'Receita' },
    { id: '2', name: 'Taxa de Reserva', type: 'Receita' },
    { id: '3', name: 'Multa por Atraso', type: 'Receita' },
    { id: '4', name: 'Reembolso', type: 'Receita' },
    // Despesas
    { id: '5', name: 'Manutenção', type: 'Despesa' },
    { id: '6', name: 'Condomínio', type: 'Despesa' },
    { id: '7', name: 'IPTU', type: 'Despesa' },
    { id: '8', name: 'Comissão', type: 'Despesa' },
    { id: '9', name: 'Repasse a Cliente', type: 'Despesa' },
    { id: '10', name: 'Publicidade', type: 'Despesa' },
    { id: '11', name: 'SPC/Serasa', type: 'Despesa' },
  ]);

  const [activeTab, setActiveTab] = useState('owners');

  // Actions
  const addOwner = (owner: Omit<Owner, 'id'>) => {
    const newOwner = { ...owner, id: Math.random().toString(36).substr(2, 9) };
    setOwners(prev => [...prev, newOwner]);
  };

  const updateOwner = (id: string, updates: Partial<Owner>) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOwner = (id: string) => {
    setOwners(prev => prev.filter(o => o.id !== id));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addProperty = (property: Omit<Property, 'id' | 'status'>) => {
    const newProperty = { ...property, id: Math.random().toString(36).substr(2, 9), status: 'Disponível' as const };
    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const addTenant = (tenant: Omit<Tenant, 'id'>) => {
    const newTenant = { ...tenant, id: Math.random().toString(36).substr(2, 9) };
    setTenants(prev => [...prev, newTenant]);
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTenant = (id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id));
  };

  const addBroker = (broker: Omit<Broker, 'id'>) => {
    const newBroker = { ...broker, id: Math.random().toString(36).substr(2, 9) };
    setBrokers(prev => [...prev, newBroker]);
  };

  const updateBroker = (id: string, updates: Partial<Broker>) => {
    setBrokers(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBroker = (id: string) => {
    setBrokers(prev => prev.filter(b => b.id !== id));
  };

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    setFinancialRecords(prev => [...prev, newRecord]);
  };

  const updateFinancialRecord = (id: string, updates: Partial<FinancialRecord>) => {
    setFinancialRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };

  const deleteFinancialRecord = (id: string) => {
    setFinancialRecords(prev => prev.filter(f => f.id !== id));
  };

  const addCategory = (category: Omit<FinancialCategory, 'id'>) => {
    const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
    setCategories(prev => [...prev, newCategory]);
  };

  // Gerar taxa de intermediação do corretor
  const generateBrokerCommission = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || !contract.brokerId) {
      console.log('Contrato não encontrado ou sem corretor associado');
      return;
    }

    const broker = brokers.find(b => b.id === contract.brokerId);
    if (!broker || !broker.commissionRate || broker.commissionRate === 0) {
      console.log('Corretor não encontrado ou sem taxa de intermediação definida');
      return;
    }

    // Calcular valor da comissão (percentual do aluguel)
    const commissionAmount = (contract.rentAmount * broker.commissionRate) / 100;

    // Criar registro financeiro de despesa (taxa de intermediação)
    const commissionRecord = {
      type: 'Despesa' as const,
      amount: commissionAmount,
      category: 'Comissão',
      description: `Taxa de intermediação - Contrato ${contract.contractNumber || contract.id}`,
      contractId: contractId,
      dueDate: contract.startDate,
      status: 'Pendente' as const
    };

    addFinancialRecord(commissionRecord);
    console.log(`Taxa de intermediação gerada: R$ ${commissionAmount.toFixed(2)} para ${broker.name}`);
  };

  const addContract = (contractData: Omit<Contract, 'id' | 'status'>) => {
    const contractId = Math.random().toString(36).substr(2, 9);
    const newContract: Contract = { 
      ...contractData, 
      id: contractId, 
      status: 'Ativo' 
    };

    // Update property status
    setProperties(prev => prev.map(p => p.id === contractData.propertyId ? { ...p, status: 'Alugado' } : p));

    // Handle Broker Intermediation
    if (contractData.brokerId) {
      const broker = brokers.find(b => b.id === contractData.brokerId);
      if (broker) {
        const intermediation: Intermediation = {
          id: Math.random().toString(36).substr(2, 9),
          contractId,
          brokerId: contractData.brokerId,
          commissionAmount: contractData.rentAmount, 
          date: new Date().toISOString()
        };
        setIntermediations(prev => [...prev, intermediation]);
        
        // Se o corretor tem taxa de intermediação definida, gerar registro financeiro automaticamente
        if (broker.commissionRate && broker.commissionRate > 0) {
          const commissionAmount = (contractData.rentAmount * broker.commissionRate) / 100;
          setFinancialRecords(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            contractId,
            description: `Taxa de intermediação - Contrato ${contractData.contractNumber || contractId}`,
            category: 'Comissão',
            amount: commissionAmount,
            type: 'Despesa',
            dueDate: contractData.startDate,
            status: 'Pendente'
          }]);
        }
      }
    }

    setContracts(prev => [...prev, newContract]);

    const records: FinancialRecord[] = [];
    const start = new Date(contractData.startDate);
    
    for (let i = 0; i < contractData.durationMonths; i++) {
      const dueDate = new Date(start.getFullYear(), start.getMonth() + i, contractData.paymentDay);
      records.push({
        id: Math.random().toString(36).substr(2, 9),
        contractId,
        description: `Aluguel Mês ${i + 1}/${contractData.durationMonths}`,
        category: 'Aluguel',
        amount: contractData.rentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Pendente',
        type: 'Receita'
      });
    }

    setFinancialRecords(prev => [...prev, ...records]);
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContract = (id: string) => {
    // When deleting a contract, we should probably set property back to Available?
    // For now simple delete.
    const contract = contracts.find(c => c.id === id);
    if (contract) {
       setProperties(prev => prev.map(p => p.id === contract.propertyId ? { ...p, status: 'Disponível' } : p));
    }
    setContracts(prev => prev.filter(c => c.id !== id));
  };


  return (
    <RealEstateContext.Provider value={{
      owners,
      users,
      properties,
      tenants,
      contracts,
      brokers,
      intermediations,
      financialRecords,
      categories,
      addOwner,
      updateOwner,
      deleteOwner,
      addUser,
      updateUser,
      deleteUser,
      addProperty,
      updateProperty,
      deleteProperty,
      addTenant,
      updateTenant,
      deleteTenant,
      addBroker,
      updateBroker,
      deleteBroker,
      addContract,
      updateContract,
      deleteContract,
      addFinancialRecord,
      updateFinancialRecord,
      deleteFinancialRecord,
      addCategory,
      generateBrokerCommission,
      activeTab,
      setActiveTab
    }}>
      {children}
    </RealEstateContext.Provider>
  );
}

export function useRealEstate() {
  const context = useContext(RealEstateContext);
  if (context === undefined) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
}
