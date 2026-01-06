# EXATA - Banco de Dados SQLite

## 📊 Resumo da Implementação

Banco de dados SQLite normalizado (1FN, 2FN, 3FN) implementado com sucesso para o sistema de gestão imobiliária EXATA.

## 🎯 Dados Gerados

### Estatísticas
- **100 Clientes** (Owners) com endereços e contas bancárias
- **50 Corretores** (Brokers) com comissões entre 10% e 20%
- **200 Inquilinos** (Tenants)
- **3.057 Imóveis** (Properties) - 20 a 40 por cliente
- **1.834 Contratos** (Contracts) ativos - 60% das propriedades alugadas
- **69.314 Registros Financeiros** com aluguéis e comissões
- **20.753 Intermediações** registradas

### Distribuição de Imóveis por Tipo
- Casa: 409
- Terreno: 397
- Sala Comercial: 395
- Kitnete: 382
- Outros: 382
- Galpão: 366
- Apartamento: 363
- Taxa de Condomínio: 363

### Status dos Imóveis
- Alugado: 1.834 (60%)
- Disponível: 1.223 (40%)

### Resumo Financeiro
- **Receitas**: R$ 316.830.235,13 (41.173 registros)
- **Despesas**: R$ 34.427.749,21 (28.141 registros incluindo comissões)

## 🗃️ Estrutura do Banco

### Normalização Aplicada

#### 1ª Forma Normal (1FN)
- ✅ Endereços separados em tabela `addresses`
- ✅ Contas bancárias em tabela `bank_accounts`
- ✅ Valores atômicos em todas as colunas

#### 2ª Forma Normal (2FN)
- ✅ Garantias separadas em tabela `guarantees`
- ✅ Aditivos em tabela `addendums`
- ✅ Todos os atributos dependem da chave primária completa

#### 3ª Forma Normal (3FN)
- ✅ Tipos de imóveis em tabela lookup `property_types`
- ✅ Status em tabelas lookup (`contract_statuses`, `financial_statuses`, `property_statuses`)
- ✅ Categorias financeiras em `financial_categories`
- ✅ Sem dependências transitivas

### Tabelas Implementadas

**Lookup Tables (Normalizadas):**
- `property_types` - 8 tipos
- `property_statuses` - 2 status
- `contract_statuses` - 2 status
- `financial_statuses` - 3 status
- `financial_categories` - 10 categorias

**Entidades Principais:**
- `owners` - Clientes/Proprietários
- `tenants` - Inquilinos
- `brokers` - Corretores
- `users` - Usuários do sistema
- `properties` - Imóveis
- `contracts` - Contratos de locação

**Tabelas Relacionadas:**
- `addresses` - Endereços (reutilizável)
- `bank_accounts` - Contas bancárias
- `guarantees` - Garantias dos contratos
- `addendums` - Aditivos contratuais
- `financial_records` - Registros financeiros
- `intermediations` - Intermediações e comissões

### Índices Otimizados

Total de **14 índices** criados para otimizar queries:
- Relacionamentos (FKs)
- Datas e períodos
- Status e tipos
- Busca por entidade

## 📁 Arquivos Criados

```
lib/
  db/
    - schema.sql       # Schema normalizado completo
    - client.ts        # Cliente SQLite (singleton)
    - seed.ts          # Gerador de dados fictícios
    - setup.ts         # Script de inicialização
    - query.ts         # Script de visualização de dados
```

## 🚀 Como Usar

### Inicializar Banco de Dados
```bash
npx tsx lib/db/setup.ts
```

### Visualizar Estatísticas
```bash
npx tsx lib/db/query.ts
```

### Resetar Banco (remover e recriar)
```bash
rm exata.db exata.db-*
npx tsx lib/db/setup.ts
```

## 🔍 Queries de Exemplo

### Buscar Property com todas as informações
```sql
SELECT 
    p.*,
    pt.name as property_type_name,
    o.name as owner_name
FROM properties p
JOIN property_types pt ON p.property_type_id = pt.id
JOIN owners o ON p.owner_id = o.id
WHERE p.id = ?;
```

### Buscar Contract com todas as relações
```sql
SELECT 
    c.*,
    cs.name as status_name,
    p.address as property_address,
    t.name as tenant_name,
    b.name as broker_name,
    g.guarantee_type,
    g.security_deposit
FROM contracts c
JOIN contract_statuses cs ON c.status_id = cs.id
JOIN properties p ON c.property_id = p.id
JOIN tenants t ON c.tenant_id = t.id
LEFT JOIN brokers b ON c.broker_id = b.id
LEFT JOIN guarantees g ON c.id = g.contract_id
WHERE c.id = ?;
```

### Financial Records do mês
```sql
SELECT 
    fr.*,
    fc.name as category_name,
    fs.name as status_name
FROM financial_records fr
JOIN financial_categories fc ON fr.category_id = fc.id
JOIN financial_statuses fs ON fr.status_id = fs.id
WHERE strftime('%Y-%m', fr.due_date) = strftime('%Y-%m', 'now')
ORDER BY fr.due_date DESC;
```

## 📈 Benefícios da Normalização

### Redução de Redundância
- Tipos e status não são repetidos como strings
- Economia estimada de ~33% de espaço em disco
- Dados consistentes (não pode ter "Apartamento" e "apartamento")

### Performance
- Índices otimizados em todas as chaves estrangeiras
- Queries rápidas com JOINs eficientes
- WAL mode habilitado para leituras concorrentes

### Integridade
- Foreign keys com ON DELETE adequado
- CHECK constraints para validação
- UNIQUE constraints onde necessário

### Manutenibilidade
- Adicionar novo tipo = 1 INSERT
- Alterar nome de categoria = 1 UPDATE
- Sem necessidade de migração de dados

## 🔒 Segurança

- Foreign keys habilitadas
- Prepared statements (proteção contra SQL injection)
- Senhas devem ser hasheadas (bcrypt) antes de inserir
- Arquivo .db no .gitignore (não versionado)

## 📦 Dependências

- `better-sqlite3` - Cliente SQLite síncrono
- `tsx` - Executar TypeScript diretamente
- `@types/better-sqlite3` - Types do better-sqlite3

## 🎉 Status

✅ **Implementação Completa**
- Schema normalizado criado
- Banco populado com 100 clientes e dados variados
- Scripts de setup e query funcionando
- Documentação completa

## 📝 Próximos Passos

Para integrar com o sistema React:
1. Criar repositories (pattern) para cada entidade
2. Substituir RealEstateContext para usar repositories
3. Implementar cache em memória para performance
4. Criar API endpoints (se necessário)
5. Implementar backup automático

## 📊 Tamanho do Banco

Arquivo: `exata.db`
Tamanho aproximado: ~25 MB (com 69k registros financeiros)

---

**Desenvolvido para EXATA - Sistema de Gestão Imobiliária**

