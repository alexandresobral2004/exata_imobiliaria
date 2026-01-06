# Exata - Sistema de Gestão Imobiliária

Sistema completo de gestão imobiliária desenvolvido com Next.js, React e TypeScript, seguindo um sistema de design moderno e consistente.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI base
- **Sonner** - Notificações toast
- **Lucide React** - Ícones consistentes
- **Sistema de Design Exata** - Padrões visuais customizados

## 📦 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🏗️ Estrutura do Projeto

```
exata/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/             # Componentes React
│   ├── admin/             # Componentes de administração
│   ├── real-estate/       # Componentes do módulo imobiliário
│   ├── ui/                # Componentes UI (shadcn/ui)
│   ├── DesignSystem.tsx   # Documentação visual do sistema
│   └── ...
├── guidelines/             # Documentação do projeto
│   ├── DesignSystem.md    # Sistema de design completo
│   ├── ComponentPatterns.md # Padrões de componentes
│   └── Guidelines.md      # Diretrizes gerais
├── styles/                 # Estilos e CSS
│   ├── globals.css        # CSS global com variáveis do sistema
│   ├── design-system.css  # Classes utilitárias do design system
│   └── modern-layout.css  # Sistema de layout flexível
├── utils/                  # Utilitários
│   ├── formatters.ts      # Formatadores
│   └── masks.ts           # Máscaras de input
└── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🎨 Sistema de Design

O projeto implementa um sistema de design completo e documentado:

### Paleta de Cores
- **Verde Exata**: Cor primária do sistema (#16a34a)
- **Neutros**: Escala de cinzas para textos e backgrounds
- **Status**: Cores semânticas (sucesso, aviso, erro, informação)

### Componentes Padronizados
- **Cards de KPI**: Com bordas coloridas e ícones
- **Botões**: Hierarquia clara (primário, secundário, outline, ghost)
- **Formulários**: Inputs consistentes com estados visuais
- **Tabelas**: Layout responsivo e interativo
- **Modais**: Estrutura padronizada

### Documentação
- 📖 `/guidelines/DesignSystem.md` - Sistema completo
- 🧩 `/guidelines/ComponentPatterns.md` - Padrões específicos
- 🎯 Componente `DesignSystem.tsx` - Visualização interativa

## 🌙 Modo Escuro

Suporte completo ao modo escuro com:
- Variáveis CSS automáticas
- Transições suaves
- Contraste otimizado
- Persistência da preferência

## 📱 Responsividade

Design mobile-first com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 📝 Notas Técnicas

- Migrado de Vite para Next.js 14
- Componentes adaptados para SSR
- ThemeProvider otimizado para Next.js
- Sistema de design baseado em CSS Variables
- Classes utilitárias customizadas

## 🔐 Credenciais de Teste

- **Admin**: admin@exata.com / 123
- **Operador**: op@exata.com / 123

## 🚀 Próximos Passos

1. Implementar testes automatizados
2. Adicionar animações micro-interações
3. Expandir documentação de acessibilidade
4. Criar biblioteca de componentes standalone

