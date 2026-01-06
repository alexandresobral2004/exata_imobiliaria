# Pasta de Imagens

Esta pasta é destinada ao armazenamento de imagens estáticas do projeto.

## Como usar:

1. **Imagens públicas**: Coloque suas imagens nesta pasta para acessá-las via URL
2. **Acesso via código**: Use o caminho `/images/nome-da-imagem.ext`
3. **Formatos suportados**: JPG, PNG, GIF, SVG, WebP

## Exemplos de uso:

```jsx
// No Next.js, você pode acessar as imagens assim:
<img src="/images/logo.png" alt="Logo" />

// Ou com o componente Image do Next.js:
import Image from 'next/image'

<Image 
  src="/images/foto.jpg" 
  alt="Descrição" 
  width={500} 
  height={300} 
/>
```

## Estrutura sugerida:

```
images/
├── avatars/          # Imagens de perfil
├── logos/           # Logos da empresa
├── products/        # Imagens de produtos
├── backgrounds/     # Imagens de fundo
└── icons/          # Ícones e símbolos
```
