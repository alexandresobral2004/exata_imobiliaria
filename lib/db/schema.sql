-- ================================
-- EXATA - Real Estate Management System
-- Normalized Database Schema (1FN, 2FN, 3FN)
-- ================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ================================
-- LOOKUP TABLES (3FN - Eliminate transitive dependencies)
-- ================================

CREATE TABLE IF NOT EXISTS property_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_statuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contract_statuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_statuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('Receita', 'Despesa')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- MAIN ENTITIES
-- ================================

CREATE TABLE IF NOT EXISTS owners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    commercial_phone TEXT,
    document TEXT NOT NULL UNIQUE,
    profession TEXT,
    num_contrato_adm TEXT UNIQUE,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    adm_contract_addendum TEXT,
    adm_contract_addendum_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    document TEXT NOT NULL UNIQUE,
    rg TEXT,
    profession TEXT,
    naturalness TEXT,
    birth_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brokers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    creci TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Operador')),
    password_hash TEXT,
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- NORMALIZED TABLES (1FN - Eliminate repeating groups)
-- ================================

CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL CHECK(length(state) = 2),
    zipcode TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK(account_type IN ('Corrente', 'Poupança')),
    agency TEXT NOT NULL,
    account_number TEXT NOT NULL,
    pix_key TEXT,
    is_primary BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    property_type_id TEXT NOT NULL,
    address TEXT NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    iptu DECIMAL(10,2),
    pms_control_number TEXT,
    status_id TEXT NOT NULL DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE RESTRICT,
    FOREIGN KEY (property_type_id) REFERENCES property_types(id),
    FOREIGN KEY (status_id) REFERENCES property_statuses(id)
);

CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    broker_id TEXT,
    contract_number TEXT UNIQUE,
    start_date DATE NOT NULL,
    contract_date DATE,
    duration_months INTEGER NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    payment_day INTEGER NOT NULL CHECK(payment_day BETWEEN 1 AND 31),
    status_id TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES contract_statuses(id)
);

-- ================================
-- RELATED DATA TABLES (2FN - Eliminate partial dependencies)
-- ================================

CREATE TABLE IF NOT EXISTS guarantees (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL UNIQUE,
    guarantee_type TEXT NOT NULL CHECK(guarantee_type IN ('none', 'caucao', 'fiador', 'seguro', 'sem_garantia')),
    security_deposit DECIMAL(10,2),
    caucao_complement DECIMAL(10,2),
    complement TEXT,
    guarantor_name TEXT,
    guarantor_document TEXT,
    guarantor_phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS addendums (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    addendum_number TEXT NOT NULL UNIQUE,
    addendum_date DATE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financial_records (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    status_id TEXT NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    type TEXT NOT NULL CHECK(type IN ('Receita', 'Despesa')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES financial_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (status_id) REFERENCES financial_statuses(id)
);

CREATE TABLE IF NOT EXISTS intermediations (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    broker_id TEXT NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- ================================
-- INDEXES (Performance optimization)
-- ================================

-- Addresses
CREATE INDEX IF NOT EXISTS idx_addresses_entity ON addresses(entity_type, entity_id);

-- Properties
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON properties(owner_id, status_id);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_property ON contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_broker ON contracts(broker_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status_id);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON contracts(start_date, duration_months);
CREATE INDEX IF NOT EXISTS idx_contracts_status_dates ON contracts(status_id, start_date, duration_months);

-- Financial Records (Critical for performance)
CREATE INDEX IF NOT EXISTS idx_financial_contract ON financial_records(contract_id);
CREATE INDEX IF NOT EXISTS idx_financial_category ON financial_records(category_id);
CREATE INDEX IF NOT EXISTS idx_financial_status ON financial_records(status_id);
CREATE INDEX IF NOT EXISTS idx_financial_due_date ON financial_records(due_date);
CREATE INDEX IF NOT EXISTS idx_financial_type_status ON financial_records(type, status_id);
CREATE INDEX IF NOT EXISTS idx_financial_type_status_date ON financial_records(type, status_id, due_date);
CREATE INDEX IF NOT EXISTS idx_financial_date_status ON financial_records(due_date, status_id);

-- Guarantees
CREATE INDEX IF NOT EXISTS idx_guarantees_contract ON guarantees(contract_id);

-- Addendums
CREATE INDEX IF NOT EXISTS idx_addendums_contract ON addendums(contract_id);

-- Bank Accounts
CREATE INDEX IF NOT EXISTS idx_bank_accounts_owner ON bank_accounts(owner_id);

-- Intermediations
CREATE INDEX IF NOT EXISTS idx_intermediations_contract ON intermediations(contract_id);
CREATE INDEX IF NOT EXISTS idx_intermediations_broker ON intermediations(broker_id);

