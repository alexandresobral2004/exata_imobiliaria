#!/usr/bin/env tsx

/**
 * Benchmark de Performance do Sistema Exata
 * Testa as otimizações aplicadas
 */

import { FinancialRepository } from '../repositories/financial.repository';
import { OwnersRepository } from '../repositories/owners.repository';
import { PropertiesRepository } from '../repositories/properties.repository';
import { ContractsRepository } from '../repositories/contracts.repository';
import { getCacheStats, clearAllCache } from './cache';
import { closeDatabase } from './client';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

async function benchmark(name: string, fn: () => any, iterations: number = 1) {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { avg, min, max, times };
}

async function main() {
  log('\n' + '='.repeat(60), colors.bright);
  log('🚀 BENCHMARK DE PERFORMANCE - SISTEMA EXATA', colors.bright);
  log('='.repeat(60) + '\n', colors.bright);

  const financialRepo = new FinancialRepository();
  const ownersRepo = new OwnersRepository();
  const propertiesRepo = new PropertiesRepository();
  const contractsRepo = new ContractsRepository();

  // ========================================
  // 1. TESTE DE QUERIES SIMPLES
  // ========================================
  log('📊 1. QUERIES SIMPLES (sem cache)', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  clearAllCache(); // Limpa cache para teste justo
  
  const simpleQueries = [
    { name: 'Buscar todos os clientes', fn: () => ownersRepo.findAll() },
    { name: 'Buscar todas as propriedades', fn: () => propertiesRepo.findAll() },
    { name: 'Buscar todos os contratos', fn: () => contractsRepo.findAll() },
    { name: 'Buscar categorias financeiras', fn: () => financialRepo.getAllCategories() },
  ];
  
  for (const query of simpleQueries) {
    const result = await benchmark(query.name, query.fn, 3);
    log(`  ${query.name}: ${formatTime(result.avg)}`, colors.green);
  }
  
  // ========================================
  // 2. TESTE DE CACHE (HIT)
  // ========================================
  log('\n📦 2. CACHE HIT (queries repetidas)', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  // Primeira execução (popula cache)
  financialRepo.getAllCategories();
  
  // Segunda execução (cache hit)
  const cacheHitResult = await benchmark(
    'Categorias (cache hit)',
    () => financialRepo.getAllCategories(),
    10
  );
  
  log(`  Média: ${formatTime(cacheHitResult.avg)}`, colors.green);
  log(`  Mínimo: ${formatTime(cacheHitResult.min)}`, colors.green);
  log(`  Máximo: ${formatTime(cacheHitResult.max)}`, colors.green);
  
  // ========================================
  // 3. TESTE DE AGREGAÇÕES
  // ========================================
  log('\n🔢 3. AGREGAÇÕES COMPLEXAS', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  clearAllCache();
  
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  
  // Primeira execução (sem cache)
  const aggregationNoCacheResult = await benchmark(
    'Sumário mensal (sem cache)',
    () => financialRepo.getMonthlySummary(month, year),
    3
  );
  
  log(`  Sem cache: ${formatTime(aggregationNoCacheResult.avg)}`, colors.yellow);
  
  // Segunda execução (com cache)
  const aggregationCacheResult = await benchmark(
    'Sumário mensal (com cache)',
    () => financialRepo.getMonthlySummary(month, year),
    10
  );
  
  log(`  Com cache: ${formatTime(aggregationCacheResult.avg)}`, colors.green);
  log(`  Melhoria: ${((aggregationNoCacheResult.avg / aggregationCacheResult.avg) * 100).toFixed(0)}x mais rápido`, colors.bright);
  
  // ========================================
  // 4. TESTE DE CONCORRÊNCIA
  // ========================================
  log('\n⚡ 4. QUERIES CONCORRENTES (connection pooling)', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  clearAllCache();
  
  const concurrentQueries = async () => {
    await Promise.all([
      ownersRepo.findAll(),
      propertiesRepo.findAll(),
      contractsRepo.findAll(),
      financialRepo.getAllCategories(),
      financialRepo.getMonthlySummary(month, year),
    ]);
  };
  
  const concurrentResult = await benchmark(
    '5 queries simultâneas',
    concurrentQueries,
    3
  );
  
  log(`  Tempo total: ${formatTime(concurrentResult.avg)}`, colors.green);
  log(`  Tempo médio por query: ${formatTime(concurrentResult.avg / 5)}`, colors.green);
  
  // ========================================
  // 5. ESTATÍSTICAS DE CACHE
  // ========================================
  log('\n📈 5. ESTATÍSTICAS DE CACHE', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  const stats = getCacheStats();
  
  log(`  Query Cache:`, colors.yellow);
  log(`    - Chaves: ${stats.query.keys}`, colors.green);
  log(`    - Hits: ${stats.query.hits}`, colors.green);
  log(`    - Misses: ${stats.query.misses}`, colors.green);
  log(`    - Hit Rate: ${((stats.query.hits / (stats.query.hits + stats.query.misses)) * 100).toFixed(1)}%`, colors.bright);
  
  log(`  Aggregation Cache:`, colors.yellow);
  log(`    - Chaves: ${stats.aggregation.keys}`, colors.green);
  log(`    - Hits: ${stats.aggregation.hits}`, colors.green);
  log(`    - Misses: ${stats.aggregation.misses}`, colors.green);
  log(`    - Hit Rate: ${((stats.aggregation.hits / (stats.aggregation.hits + stats.aggregation.misses)) * 100).toFixed(1)}%`, colors.bright);
  
  log(`  Static Cache:`, colors.yellow);
  log(`    - Chaves: ${stats.static.keys}`, colors.green);
  log(`    - Hits: ${stats.static.hits}`, colors.green);
  log(`    - Misses: ${stats.static.misses}`, colors.green);
  log(`    - Hit Rate: ${((stats.static.hits / (stats.static.hits + stats.static.misses)) * 100).toFixed(1)}%`, colors.bright);
  
  // ========================================
  // 6. TESTE DE PAGINAÇÃO
  // ========================================
  log('\n📄 6. PAGINAÇÃO', colors.cyan);
  log('-'.repeat(60), colors.cyan);
  
  const paginationResult = await benchmark(
    'Buscar página 1 (50 registros)',
    () => financialRepo.findPaginated(0, 50),
    5
  );
  
  log(`  Tempo médio: ${formatTime(paginationResult.avg)}`, colors.green);
  
  // ========================================
  // RESUMO FINAL
  // ========================================
  log('\n' + '='.repeat(60), colors.bright);
  log('✅ RESUMO DE PERFORMANCE', colors.bright);
  log('='.repeat(60), colors.bright);
  
  const totalHits = stats.query.hits + stats.aggregation.hits + stats.static.hits;
  const totalMisses = stats.query.misses + stats.aggregation.misses + stats.static.misses;
  const overallHitRate = (totalHits / (totalHits + totalMisses)) * 100;
  
  log(`\n  Cache Hit Rate Geral: ${overallHitRate.toFixed(1)}%`, colors.green);
  log(`  Queries Concorrentes: ${formatTime(concurrentResult.avg)} para 5 queries`, colors.green);
  log(`  Melhoria com Cache: ${((aggregationNoCacheResult.avg / aggregationCacheResult.avg) * 100).toFixed(0)}x`, colors.green);
  log(`  Paginação: ${formatTime(paginationResult.avg)} para 50 registros`, colors.green);
  
  log('\n🎉 Benchmark concluído com sucesso!\n', colors.bright);
  
  // Cleanup
  closeDatabase();
}

// Execute
main().catch(console.error);

