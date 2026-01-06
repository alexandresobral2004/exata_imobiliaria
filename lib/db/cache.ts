import NodeCache from 'node-cache';

/**
 * Cache global para queries do banco de dados
 * TTL padrão: 60 segundos
 * Check period: 120 segundos
 */
const queryCache = new NodeCache({
  stdTTL: 60, // Time to live padrão: 1 minuto
  checkperiod: 120, // Verifica itens expirados a cada 2 minutos
  useClones: false, // Melhor performance, mas cuidado com mutações
  deleteOnExpire: true,
});

/**
 * Cache para agregações e sumários (TTL maior)
 */
const aggregationCache = new NodeCache({
  stdTTL: 300, // 5 minutos para agregações
  checkperiod: 600,
  useClones: false,
});

/**
 * Cache para dados estáticos (lookup tables)
 */
const staticCache = new NodeCache({
  stdTTL: 3600, // 1 hora para dados estáticos
  checkperiod: 7200,
  useClones: false,
});

/**
 * Executa uma query com cache
 * @param key Chave única para o cache
 * @param queryFn Função que executa a query
 * @param ttl Time to live em segundos (opcional)
 * @param cacheType Tipo de cache a usar
 */
export function cachedQuery<T>(
  key: string,
  queryFn: () => T,
  ttl?: number,
  cacheType: 'query' | 'aggregation' | 'static' = 'query'
): T {
  const cache = cacheType === 'aggregation' 
    ? aggregationCache 
    : cacheType === 'static'
    ? staticCache
    : queryCache;

  // Tenta buscar do cache
  const cached = cache.get<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  // Executa a query
  const result = queryFn();

  // Armazena no cache
  if (ttl !== undefined) {
    cache.set(key, result, ttl);
  } else {
    cache.set(key, result);
  }

  return result;
}

/**
 * Invalida cache por chave
 */
export function invalidateCache(key: string): void {
  queryCache.del(key);
  aggregationCache.del(key);
  staticCache.del(key);
}

/**
 * Invalida cache por padrão (usando regex)
 */
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(pattern);
  
  // Invalida em todos os caches
  [queryCache, aggregationCache, staticCache].forEach(cache => {
    const keys = cache.keys();
    keys.forEach(key => {
      if (regex.test(key)) {
        cache.del(key);
      }
    });
  });
}

/**
 * Invalida todo o cache
 */
export function clearAllCache(): void {
  queryCache.flushAll();
  aggregationCache.flushAll();
  staticCache.flushAll();
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats() {
  return {
    query: queryCache.getStats(),
    aggregation: aggregationCache.getStats(),
    static: staticCache.getStats(),
  };
}

/**
 * Helper para gerar chaves de cache consistentes
 */
export function generateCacheKey(
  entity: string,
  operation: string,
  params?: Record<string, any>
): string {
  if (!params) {
    return `${entity}:${operation}`;
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  return `${entity}:${operation}:${sortedParams}`;
}

