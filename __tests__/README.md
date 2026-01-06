# Testes TDD - Sistema Exata

Este documento descreve a estrutura de testes implementada seguindo a metodologia TDD (Test-Driven Development).

## 📁 Estrutura de Testes

```
exata/
├── __tests__/              # Testes de integração e E2E
├── utils/__tests__/        # Testes de utilitários
├── hooks/__tests__/        # Testes de hooks customizados
├── components/__tests__/   # Testes de componentes React
├── lib/repositories/__tests__/ # Testes de repositories
├── app/api/__tests__/      # Testes de API routes
├── jest.config.js          # Configuração do Jest
└── jest.setup.js           # Setup do ambiente de testes
```

## 🚀 Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes em CI/CD
```bash
npm run test:ci
```

## 📋 Cobertura de Testes

### ✅ Utilitários (Utils)
- **formatters.ts**: Testes para formatadores de CPF, CNPJ, telefone, CEP, moeda
- **masks.ts**: Testes para máscaras de input

### ✅ Hooks
- **usePagination.ts**: Testes para paginação de dados

### ✅ Componentes UI
- **pagination.tsx**: Testes para componente de paginação

### ✅ Repositories
- **base.repository.ts**: Testes para classe base de repositories
- Outros repositories seguem o mesmo padrão

### ✅ API Routes
- **/api/data**: Testes para todas as operações CRUD da API

## 🧪 Padrões de Teste

### Testes Unitários
Testes isolados para funções puras e componentes individuais:

```typescript
describe('formatCPF', () => {
  it('should format a valid CPF string', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })
})
```

### Testes de Componentes
Testes que verificam renderização e interações:

```typescript
it('should call onPageChange when clicking next page', () => {
  render(<Pagination {...props} />)
  fireEvent.click(screen.getByTitle(/Próxima página/i))
  expect(props.onPageChange).toHaveBeenCalledWith(2)
})
```

### Testes de Integração
Testes que verificam a integração entre diferentes partes do sistema:

```typescript
it('should create contract and generate financial records', async () => {
  const response = await POST(request)
  expect(response.status).toBe(201)
})
```

## 🎯 Metodologia TDD

### Ciclo Red-Green-Refactor

1. **Red**: Escrever um teste que falha
2. **Green**: Escrever código mínimo para fazer o teste passar
3. **Refactor**: Melhorar o código mantendo os testes passando

### Exemplo Prático

```typescript
// 1. RED - Teste falhando
describe('formatCPF', () => {
  it('should format CPF correctly', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })
})

// 2. GREEN - Implementação mínima
export const formatCPF = (value: string) => {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// 3. REFACTOR - Melhorar código
export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
}
```

## 📊 Cobertura Alvo

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🔧 Configuração

### Jest Config (`jest.config.js`)
- Usa Next.js Jest preset
- Ambiente jsdom para testes de componentes React
- Mapeamento de paths para @/*
- Coleta de cobertura de código

### Setup (`jest.setup.js`)
- Configuração do `@testing-library/jest-dom`
- Mocks do Next.js router
- Mocks de bibliotecas externas (sonner, etc.)

## 📝 Boas Práticas

1. **Testes devem ser isolados**: Cada teste deve ser independente
2. **Nomes descritivos**: Use nomes claros que descrevam o comportamento
3. **AAA Pattern**: Arrange, Act, Assert
4. **Evite testes frágeis**: Não teste detalhes de implementação
5. **Mocks quando necessário**: Use mocks para dependências externas

## 🐛 Debugging

Para debugar testes no VS Code, use a configuração:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)

