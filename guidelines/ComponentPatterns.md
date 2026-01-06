# Padrões de Componentes - Sistema Exata

## Visão Geral

Este documento define os padrões específicos para implementação de componentes no sistema Exata, garantindo consistência visual e funcional.

## 🎯 Cards de KPI

### Estrutura Padrão
```jsx
<Card className="kpi-card kpi-card-blue">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="kpi-title">TÍTULO DO KPI</p>
        <h3 className="kpi-value">302</h3>
        <p className="kpi-change-positive">
          Informação adicional
        </p>
      </div>
      <div className="kpi-icon-container kpi-icon-blue">
        <HomeIcon className="h-6 w-6" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Variações de Cor
- **Blue**: `kpi-card-blue` + `kpi-icon-blue` - Para métricas gerais
- **Green**: `kpi-card-green` + `kpi-icon-green` - Para receitas e sucessos
- **Purple**: `kpi-card-purple` + `kpi-icon-purple` - Para contratos e documentos
- **Red**: `kpi-card-red` + `kpi-icon-red` - Para alertas e pendências
- **Orange**: `kpi-card-orange` + `kpi-icon-orange` - Para avisos

### Diretrizes
1. Título sempre em MAIÚSCULAS
2. Valor principal com fonte grande e negrito
3. Informação adicional com cor de status apropriada
4. Ícone relacionado ao contexto do KPI

## 🔘 Botões

### Hierarquia de Botões
```jsx
// Primário - Ação principal da tela
<Button className="btn-primary">Salvar</Button>

// Secundário - Ações secundárias
<Button className="btn-secondary">Cancelar</Button>

// Outline - Ações alternativas
<Button className="btn-outline">Editar</Button>

// Ghost - Ações sutis
<Button className="btn-ghost">Ver detalhes</Button>

// Destructive - Ações perigosas
<Button className="btn-destructive">Excluir</Button>
```

### Regras de Uso
1. **Máximo 1 botão primário** por seção visual
2. **Botões destrutivos** sempre com confirmação
3. **Textos concisos** (máximo 3 palavras)
4. **Ícones opcionais** para clareza adicional

## 📝 Formulários

### Estrutura de Campo
```jsx
<div className="form-group">
  <label className="label-standard">
    Nome do Campo *
  </label>
  <input 
    className="input-standard"
    placeholder="Digite aqui..."
  />
  <p className="text-xs text-gray-500 dark:text-zinc-400">
    Texto de ajuda (opcional)
  </p>
</div>
```

### Layout de Formulário
```jsx
<form className="form-section">
  <h3 className="form-section-title">Informações Básicas</h3>
  
  <div className="form-row">
    <div className="form-group">
      {/* Campo 1 */}
    </div>
    <div className="form-group">
      {/* Campo 2 */}
    </div>
  </div>
  
  <div className="form-group">
    {/* Campo full-width */}
  </div>
</form>
```

### Estados de Input
- **Padrão**: `input-standard`
- **Erro**: `input-error`
- **Disabled**: adicionar `disabled` + `opacity-50`
- **Loading**: adicionar spinner interno

## 📊 Tabelas

### Estrutura Padrão
```jsx
<div className="table-container">
  <div className="table-header">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Título da Tabela
    </h3>
  </div>
  
  <div className="divide-y divide-gray-200 dark:divide-zinc-700">
    {items.map((item) => (
      <div key={item.id} className="table-row">
        <div className="flex items-center justify-between">
          <div>
            <p className="table-cell">{item.name}</p>
            <p className="table-cell-secondary">{item.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="badge-success">Ativo</Badge>
            <Button className="btn-ghost" size="sm">
              Editar
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### Padrões de Conteúdo
1. **Primeira coluna**: Informação principal + secundária
2. **Última coluna**: Status + ações
3. **Hover**: Destaque sutil da linha
4. **Responsivo**: Stack em mobile

## 🏷️ Badges de Status

### Tipos Disponíveis
```jsx
// Sucesso - Verde
<Badge className="badge-success">
  <CheckCircle className="h-3 w-3 mr-1" />
  Ativo
</Badge>

// Aviso - Amarelo
<Badge className="badge-warning">
  <AlertTriangle className="h-3 w-3 mr-1" />
  Pendente
</Badge>

// Erro - Vermelho
<Badge className="badge-error">
  <AlertCircle className="h-3 w-3 mr-1" />
  Inativo
</Badge>

// Informação - Azul
<Badge className="badge-info">
  <Info className="h-3 w-3 mr-1" />
  Processando
</Badge>

// Neutro - Cinza
<Badge className="badge-neutral">
  Rascunho
</Badge>
```

### Mapeamento de Status
- **Ativo/Aprovado/Pago**: `badge-success`
- **Pendente/Em análise**: `badge-warning`
- **Inativo/Rejeitado/Vencido**: `badge-error`
- **Em processamento**: `badge-info`
- **Rascunho/Neutro**: `badge-neutral`

## 🪟 Modais e Dialogs

### Estrutura Padrão
```jsx
<Dialog>
  <DialogTrigger asChild>
    <Button className="btn-primary">Abrir Modal</Button>
  </DialogTrigger>
  
  <DialogContent className="modal-content">
    <DialogHeader className="modal-header">
      <DialogTitle className="modal-title">
        Título do Modal
      </DialogTitle>
      <DialogDescription className="modal-description">
        Descrição do que o modal faz
      </DialogDescription>
    </DialogHeader>
    
    <div className="modal-body">
      {/* Conteúdo do modal */}
    </div>
    
    <DialogFooter className="modal-footer">
      <Button className="btn-secondary">Cancelar</Button>
      <Button className="btn-primary">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tipos de Modal
1. **Confirmação**: Ações destrutivas
2. **Formulário**: Criação/edição de dados
3. **Visualização**: Exibição de detalhes
4. **Seleção**: Escolha de opções

## 📱 Layout Responsivo

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Padrões Responsivos
```jsx
// Grid responsivo para KPIs
<div className="grid-kpi">
  {/* 1 coluna mobile, 2 tablet, 4 desktop */}
</div>

// Grid responsivo para cards
<div className="grid-cards">
  {/* 1 coluna mobile, 2 tablet, 3 desktop */}
</div>

// Formulário responsivo
<div className="grid-form">
  {/* 1 coluna mobile, 2 desktop */}
</div>
```

### Sidebar Responsiva
- **Desktop**: Sidebar fixa lateral
- **Mobile**: Sidebar colapsada com menu hambúrguer

## 🎨 Estados Visuais

### Estados de Interação
```css
/* Hover suave */
.hover-lift:hover {
  transform: translateY(-1px);
}

/* Loading */
.loading-spinner {
  /* Spinner animado */
}

/* Focus acessível */
.focus-visible:focus {
  /* Outline verde */}
```

### Feedback Visual
1. **Hover**: Elevação sutil (-1px)
2. **Loading**: Spinner verde
3. **Success**: Toast verde
4. **Error**: Toast vermelho
5. **Focus**: Outline verde acessível

## 🔍 Busca e Filtros

### Campo de Busca
```jsx
<div className="relative">
  <input
    type="text"
    placeholder="Buscar..."
    className="input-standard pl-10"
  />
  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
</div>
```

### Filtros
```jsx
<div className="flex items-center gap-4">
  <select className="input-standard">
    <option>Todos os status</option>
    <option>Ativo</option>
    <option>Inativo</option>
  </select>
  
  <Button className="btn-outline">
    <FilterIcon className="h-4 w-4 mr-2" />
    Filtros
  </Button>
</div>
```

## 📋 Listas e Cards

### Lista Simples
```jsx
<div className="space-y-3">
  {items.map((item) => (
    <div key={item.id} className="card-interactive">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {item.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {item.description}
          </p>
        </div>
        <Badge className="badge-success">
          {item.status}
        </Badge>
      </div>
    </div>
  ))}
</div>
```

### Card de Ação Rápida
```jsx
<button className="card-interactive text-left w-full">
  <div className="p-6 flex flex-col items-center gap-3">
    <div className="kpi-icon-container kpi-icon-blue">
      <PlusIcon className="h-6 w-6" />
    </div>
    <div className="text-center">
      <h4 className="font-medium text-gray-900 dark:text-white">
        Nova Ação
      </h4>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Descrição da ação
      </p>
    </div>
  </div>
</button>
```

## 🎯 Navegação

### Menu Principal
```jsx
<nav className="space-y-2">
  {menuItems.map((item) => (
    <button
      key={item.id}
      className={`nav-item ${
        isActive ? 'nav-item-active' : 'nav-item-inactive'
      }`}
    >
      <item.icon className="h-5 w-5" />
      {item.label}
    </button>
  ))}
</nav>
```

### Breadcrumb
```jsx
<nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-zinc-400">
  <a href="/" className="hover:text-green-600">Home</a>
  <ChevronRightIcon className="h-4 w-4" />
  <a href="/imoveis" className="hover:text-green-600">Imóveis</a>
  <ChevronRightIcon className="h-4 w-4" />
  <span className="text-gray-900 dark:text-white">Detalhes</span>
</nav>
```

## 📊 Gráficos e Visualizações

### Container de Gráfico
```jsx
<Card className="card-standard">
  <CardHeader>
    <CardTitle>Título do Gráfico</CardTitle>
    <CardDescription>Descrição dos dados</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-80 w-full">
      {/* Componente do gráfico */}
    </div>
  </CardContent>
</Card>
```

### Cores para Gráficos
- **Primária**: Verde Exata (#16a34a)
- **Secundária**: Azul (#3b82f6)
- **Terciária**: Roxo (#8b5cf6)
- **Quaternária**: Laranja (#f97316)

---

*Este documento deve ser consultado sempre que implementar novos componentes ou modificar existentes.*
