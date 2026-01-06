-- ================================
-- ÍNDICES PARCIAIS PARA OTIMIZAÇÃO
-- Índices parciais são menores e mais rápidos
-- ================================

-- Índice apenas para receitas (queries separadas por tipo)
CREATE INDEX IF NOT EXISTS idx_financial_receitas 
ON financial_records(due_date, category_id, amount, status_id) 
WHERE type = 'Receita';

-- Índice apenas para despesas
CREATE INDEX IF NOT EXISTS idx_financial_despesas 
ON financial_records(due_date, category_id, amount, status_id) 
WHERE type = 'Despesa';

-- ================================
-- ÍNDICES COMPOSTOS ADICIONAIS
-- Para queries complexas frequentes
-- ================================

-- Para buscar registros financeiros por contrato e data
CREATE INDEX IF NOT EXISTS idx_financial_contract_date 
ON financial_records(contract_id, due_date, status_id);

-- Para buscar contratos por inquilino e status
CREATE INDEX IF NOT EXISTS idx_contracts_tenant_status 
ON contracts(tenant_id, status_id, start_date);

-- Para buscar propriedades por tipo e status
CREATE INDEX IF NOT EXISTS idx_properties_type_status 
ON properties(property_type_id, status_id, owner_id);

-- ================================
-- ANÁLISE E OTIMIZAÇÃO
-- ================================

-- Atualiza estatísticas para o query planner
ANALYZE;

-- Otimiza o banco de dados
PRAGMA optimize;

