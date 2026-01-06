# Sistema de Design Exata

## Visão Geral

O Sistema de Design Exata é um conjunto abrangente de diretrizes, componentes e padrões que garantem consistência visual e funcional em toda a aplicação. Este documento serve como referência única para desenvolvedores e designers.

## 🎨 Paleta de Cores

### Cores Primárias (Verde Exata)
```css
--primary-50: #f0fdf4   /* Verde muito claro */
--primary-100: #dcfce7  /* Verde claro */
--primary-200: #bbf7d0  /* Verde suave */
--primary-300: #86efac  /* Verde médio claro */
--primary-400: #4ade80  /* Verde médio */
--primary-500: #22c55e  /* Verde principal */
--primary-600: #16a34a  /* Verde escuro (padrão) */
--primary-700: #15803d  /* Verde mais escuro */
--primary-800: #166534  /* Verde muito escuro */
--primary-900: #14532d  /* Verde profundo */
```

### Cores Neutras
```css
--neutral-50: #fafafa   /* Branco quase puro */
--neutral-100: #f5f5f5  /* Cinza muito claro */
--neutral-200: #e5e5e5  /* Cinza claro */
--neutral-300: #d4d4d4  /* Cinza médio claro */
--neutral-400: #a3a3a3  /* Cinza médio */
--neutral-500: #737373  /* Cinza */
--neutral-600: #525252  /* Cinza escuro */
--neutral-700: #404040  /* Cinza muito escuro */
--neutral-800: #262626  /* Cinza profundo */
--neutral-900: #171717  /* Quase preto */
```

### Cores de Status
```css
/* Sucesso (Verde) */
--success-50: #f0fdf4
--success-500: #22c55e
--success-600: #16a34a

/* Aviso (Amarelo/Laranja) */
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-600: #d97706

/* Erro (Vermelho) */
--error-50: #fef2f2
--error-500: #ef4444
--error-600: #dc2626

/* Informação (Azul) */
--info-50: #eff6ff
--info-500: #3b82f6
--info-600: #2563eb
```

## 📝 Sistema de Tipografia

### Hierarquia de Tamanhos
```css
--text-xs: 0.75rem      /* 12px - Legendas, labels pequenos */
--text-sm: 0.875rem     /* 14px - Texto secundário, descrições */
--text-base: 1rem       /* 16px - Texto padrão do corpo */
--text-lg: 1.125rem     /* 18px - Texto destacado */
--text-xl: 1.25rem      /* 20px - Subtítulos pequenos */
--text-2xl: 1.5rem      /* 24px - Subtítulos */
--text-3xl: 1.875rem    /* 30px - Títulos de seção */
--text-4xl: 2.25rem     /* 36px - Títulos principais */
--text-5xl: 3rem        /* 48px - Títulos de página */
```

### Pesos de Fonte
```css
--font-weight-light: 300      /* Texto leve */
--font-weight-normal: 400     /* Texto normal */
--font-weight-medium: 500     /* Texto médio (padrão para labels) */
--font-weight-semibold: 600   /* Texto semi-negrito */
--font-weight-bold: 700       /* Texto negrito (títulos) */
--font-weight-extrabold: 800  /* Texto extra negrito */
```

### Altura de Linha
```css
--leading-tight: 1.25     /* Títulos */
--leading-snug: 1.375     /* Subtítulos */
--leading-normal: 1.5     /* Texto padrão */
--leading-relaxed: 1.625  /* Texto longo */
--leading-loose: 2        /* Texto espaçado */
```

## 📐 Sistema de Espaçamento

### Escala de Espaçamento (baseada em 4px)
```css
--space-0: 0          /* 0px */
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
```

### Uso Recomendado
- **space-1 a space-2**: Espaçamento interno pequeno (padding de botões, gaps pequenos)
- **space-3 a space-4**: Espaçamento padrão (padding de cards, gaps médios)
- **space-6 a space-8**: Espaçamento entre seções
- **space-12+**: Espaçamento de layout principal

## 🔲 Sistema de Bordas e Sombras

### Border Radius
```css
--radius-none: 0         /* Sem arredondamento */
--radius-sm: 0.125rem    /* 2px - Elementos pequenos */
--radius-base: 0.25rem   /* 4px - Padrão */
--radius-md: 0.375rem    /* 6px - Inputs, botões */
--radius-lg: 0.5rem      /* 8px - Cards */
--radius-xl: 0.75rem     /* 12px - Modais */
--radius-2xl: 1rem       /* 16px - Elementos grandes */
--radius-full: 9999px    /* Circular */
```

### Sombras
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)           /* Sombra mínima */
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1)            /* Sombra pequena */
--shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1)       /* Sombra padrão */
--shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1)       /* Sombra média */
--shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1)       /* Sombra grande */
--shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)     /* Sombra extra grande */
```

## 🎯 Componentes Padrão

### Cards
```css
/* Card Padrão */
.card-standard {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

/* Card com Destaque */
.card-highlighted {
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

/* Card Hover */
.card-interactive:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  transition: all var(--transition-base);
}
```

### Botões
```css
/* Botão Primário */
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* Botão Secundário */
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

/* Botão Outline */
.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.btn-outline:hover {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

### Inputs
```css
.input-standard {
  background: var(--input);
  color: var(--input-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
}

.input-standard:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgb(34 197 94 / 0.1);
}
```

### Tabelas
```css
.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-header {
  background: var(--muted);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.table-row {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background: var(--muted);
}

.table-row:last-child {
  border-bottom: none;
}
```

## 🌙 Modo Escuro

### Implementação
O modo escuro é implementado através da classe `.dark` aplicada ao elemento raiz. Todas as variáveis CSS são automaticamente ajustadas.

### Cores no Modo Escuro
- **Background**: `#0a0a0a` (quase preto)
- **Cards**: `#171717` (cinza muito escuro)
- **Borders**: `#262626` (cinza escuro)
- **Text**: `#fafafa` (branco quase puro)

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Grid System
```css
/* Container Principal */
.layout-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

/* Mobile */
@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}
```

## 🎭 Estados de Componentes

### Estados de Interação
```css
/* Hover */
.interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

/* Focus */
.focusable:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(34 197 94 / 0.2);
}

/* Active */
.interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Disabled */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Estados de Status
```css
/* Sucesso */
.status-success {
  background: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

/* Aviso */
.status-warning {
  background: var(--warning-50);
  color: var(--warning-700);
  border: 1px solid var(--warning-200);
}

/* Erro */
.status-error {
  background: var(--error-50);
  color: var(--error-700);
  border: 1px solid var(--error-200);
}

/* Informação */
.status-info {
  background: var(--info-50);
  color: var(--info-700);
  border: 1px solid var(--info-200);
}
```

## 🔧 Utilitários

### Classes de Espaçamento
```css
/* Padding */
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

/* Margin */
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

/* Gap */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }
```

### Classes de Texto
```css
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }

.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }
```

## 📋 Boas Práticas

### 1. Consistência
- Sempre use as variáveis CSS definidas
- Mantenha o mesmo padrão de espaçamento
- Use a hierarquia de cores estabelecida

### 2. Acessibilidade
- Contraste mínimo de 4.5:1 para texto normal
- Contraste mínimo de 3:1 para texto grande
- Estados de foco visíveis
- Suporte a navegação por teclado

### 3. Performance
- Use transições suaves (150-300ms)
- Evite animações desnecessárias
- Otimize imagens e ícones

### 4. Responsividade
- Design mobile-first
- Teste em diferentes tamanhos de tela
- Use unidades relativas (rem, %, vw, vh)

## 🎨 Exemplos de Uso

### Card de KPI
```jsx
<div className="bg-white dark:bg-zinc-800 border-0 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
  <div className="p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
          IMÓVEIS TOTAIS
        </p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">302</h3>
        <p className="text-xs text-green-600 dark:text-green-400">
          30 alugados (9.9%)
        </p>
      </div>
      <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
        <HomeIcon className="h-6 w-6" />
      </div>
    </div>
  </div>
</div>
```

### Botão de Ação
```jsx
<button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
  + Novo Imóvel
</button>
```

### Input com Label
```jsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
    Nome do Proprietário
  </label>
  <input 
    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    placeholder="Digite o nome..."
  />
</div>
```

## 🔄 Versionamento

**Versão Atual**: 1.0.0

### Changelog
- **1.0.0** (Janeiro 2025): Sistema de design inicial com paleta de cores, tipografia e componentes base.

---

*Este documento é mantido pela equipe de desenvolvimento e deve ser atualizado sempre que houver mudanças no sistema de design.*
