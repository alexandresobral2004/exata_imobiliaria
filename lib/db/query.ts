#!/usr/bin/env tsx

import { getDatabase } from './client';

function queryDatabase() {
  const db = getDatabase();

  console.log('\n📊 EXATA Database Statistics\n');
  console.log('═'.repeat(60));

  // Counts
  const stats = {
    owners: db.prepare('SELECT COUNT(*) as count FROM owners').get(),
    brokers: db.prepare('SELECT COUNT(*) as count FROM brokers').get(),
    tenants: db.prepare('SELECT COUNT(*) as count FROM tenants').get(),
    properties: db.prepare('SELECT COUNT(*) as count FROM properties').get(),
    contracts: db.prepare('SELECT COUNT(*) as count FROM contracts').get(),
    financial: db.prepare('SELECT COUNT(*) as count FROM financial_records').get(),
    addresses: db.prepare('SELECT COUNT(*) as count FROM addresses').get(),
    bankAccounts: db.prepare('SELECT COUNT(*) as count FROM bank_accounts').get(),
    guarantees: db.prepare('SELECT COUNT(*) as count FROM guarantees').get(),
    intermediations: db.prepare('SELECT COUNT(*) as count FROM intermediations').get(),
  };

  console.log(`\n📋 Tabelas Principais:`);
  console.log(`   Clientes (Owners):           ${stats.owners.count}`);
  console.log(`   Corretores (Brokers):        ${stats.brokers.count}`);
  console.log(`   Inquilinos (Tenants):        ${stats.tenants.count}`);
  console.log(`   Imóveis (Properties):        ${stats.properties.count}`);
  console.log(`   Contratos (Contracts):       ${stats.contracts.count}`);

  console.log(`\n💰 Financeiro:`);
  console.log(`   Registros Financeiros:       ${stats.financial.count}`);
  console.log(`   Intermediações:              ${stats.intermediations.count}`);

  console.log(`\n📍 Dados Normalizados:`);
  console.log(`   Endereços:                   ${stats.addresses.count}`);
  console.log(`   Contas Bancárias:            ${stats.bankAccounts.count}`);
  console.log(`   Garantias:                   ${stats.guarantees.count}`);

  // Properties by type
  console.log(`\n🏠 Imóveis por Tipo:`);
  const propTypes = db.prepare(`
    SELECT pt.name, COUNT(*) as count
    FROM properties p
    JOIN property_types pt ON p.property_type_id = pt.id
    GROUP BY pt.name
    ORDER BY count DESC
  `).all();
  
  propTypes.forEach((pt: any) => {
    console.log(`   ${pt.name.padEnd(25)} ${pt.count}`);
  });

  // Properties by status
  console.log(`\n📊 Imóveis por Status:`);
  const propStatus = db.prepare(`
    SELECT ps.name, COUNT(*) as count
    FROM properties p
    JOIN property_statuses ps ON p.status_id = ps.id
    GROUP BY ps.name
  `).all();
  
  propStatus.forEach((ps: any) => {
    console.log(`   ${ps.name.padEnd(25)} ${ps.count}`);
  });

  // Financial summary
  console.log(`\n💵 Resumo Financeiro:`);
  const financialSummary = db.prepare(`
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) as total
    FROM financial_records
    GROUP BY type
  `).all();
  
  financialSummary.forEach((fs: any) => {
    console.log(`   ${fs.type.padEnd(15)} ${fs.count} registros - R$ ${fs.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  });

  // Top 5 owners by properties
  console.log(`\n🏆 Top 5 Clientes (por quantidade de imóveis):`);
  const topOwners = db.prepare(`
    SELECT o.name, COUNT(p.id) as prop_count
    FROM owners o
    LEFT JOIN properties p ON o.id = p.owner_id
    GROUP BY o.id
    ORDER BY prop_count DESC
    LIMIT 5
  `).all();
  
  topOwners.forEach((owner: any, idx: number) => {
    console.log(`   ${idx + 1}. ${owner.name.padEnd(30)} ${owner.prop_count} imóveis`);
  });

  // Top 5 brokers by commission
  console.log(`\n💼 Top 5 Corretores (por comissão total):`);
  const topBrokers = db.prepare(`
    SELECT b.name, b.commission_rate, COUNT(i.id) as intermediation_count, SUM(i.commission_amount) as total_commission
    FROM brokers b
    LEFT JOIN intermediations i ON b.id = i.broker_id
    GROUP BY b.id
    ORDER BY total_commission DESC
    LIMIT 5
  `).all();
  
  topBrokers.forEach((broker: any, idx: number) => {
    const total = broker.total_commission || 0;
    console.log(`   ${idx + 1}. ${broker.name.padEnd(25)} ${broker.commission_rate}% - R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
  });

  // Recent contracts
  console.log(`\n📄 Últimos 5 Contratos:`);
  const recentContracts = db.prepare(`
    SELECT 
      c.contract_number,
      p.address as property_address,
      t.name as tenant_name,
      c.rent_amount,
      c.start_date
    FROM contracts c
    JOIN properties p ON c.property_id = p.id
    JOIN tenants t ON c.tenant_id = t.id
    ORDER BY c.created_at DESC
    LIMIT 5
  `).all();
  
  recentContracts.forEach((contract: any) => {
    console.log(`   ${contract.contract_number} - ${contract.tenant_name}`);
    console.log(`      ${contract.property_address}`);
    console.log(`      R$ ${contract.rent_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})} - Início: ${contract.start_date}`);
    console.log();
  });

  console.log('═'.repeat(60));
  console.log('\n✅ Query completed successfully!\n');
}

// Run if called directly
if (require.main === module) {
  queryDatabase();
  process.exit(0);
}

export { queryDatabase };

