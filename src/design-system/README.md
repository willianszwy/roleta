# LuckyWheel Design System

Um sistema de design robusto e reutilizável para a aplicação LuckyWheel, baseado nos princípios de glassmorphism e design moderno.

## 🎯 Objetivos

- **Consistência**: Interface uniforme em toda a aplicação
- **Reutilização**: Componentes modulares e reutilizáveis
- **Manutenibilidade**: Código organizado e fácil de manter
- **Acessibilidade**: Componentes acessíveis por padrão
- **Performance**: Otimizado para melhor performance

## 📁 Estrutura

```
src/design-system/
├── tokens.ts                 # Design tokens (cores, tipografia, espaçamentos)
├── components/              # Componentes base
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── index.ts
├── hooks/                   # Hooks utilitários
│   ├── useBreakpoint.ts
│   ├── useToggle.ts
│   └── index.ts
├── examples/               # Componentes de demonstração
│   └── DesignSystemDemo.tsx
└── README.md               # Esta documentação
```

## 🎨 Design Tokens

### Cores

```typescript
// Gradientes principais
primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
secondaryGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'

// Cores de status
success: '#22c55e'
error: '#ef4444'
warning: '#f59e0b'

// Glassmorphism
glass.primary: 'rgba(255, 255, 255, 0.08)'
glass.border: 'rgba(255, 255, 255, 0.15)'
```

### Tipografia

```typescript
fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', ... }
fontWeights: { normal: 500, medium: 600, bold: 700 }
```

### Espaçamentos

```typescript
spacing: {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  // ...
}
```

## 🧩 Componentes

### Button

Componente de botão com múltiplas variantes e estados.

```tsx
import { Button } from '@/design-system';

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>
<Button variant="ghost">Ghost</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Estados
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- `fullWidth?: boolean`
- `loading?: boolean`
- `disabled?: boolean`

### Input & TextArea

Componentes de entrada de dados com labels e estados de erro.

```tsx
import { Input, TextArea } from '@/design-system';

<Input
  label="Nome"
  placeholder="Digite seu nome..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error="Campo obrigatório"
  fullWidth
/>

<TextArea
  label="Descrição"
  placeholder="Digite uma descrição..."
  rows={4}
/>
```

**Input Props:**
- `label?: string`
- `error?: string`
- `fullWidth?: boolean`
- `startIcon?: React.ReactNode`
- `endIcon?: React.ReactNode`

### Card

Container com efeitos glassmorphism e variações de estilo.

```tsx
import { Card } from '@/design-system';

<Card variant="glass" hoverable>
  <h3>Título</h3>
  <p>Conteúdo do card...</p>
</Card>
```

**Props:**
- `variant?: 'glass' | 'solid' | 'outlined'`
- `padding?: 'sm' | 'md' | 'lg'`
- `hoverable?: boolean`

### Modal

Modal responsivo com animações e backdrop blur.

```tsx
import { Modal } from '@/design-system';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  maxWidth="600px"
>
  <p>Conteúdo do modal...</p>
</Modal>
```

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `maxWidth?: string`
- `closeOnOverlayClick?: boolean`
- `closeOnEscape?: boolean`

## 🪝 Hooks Utilitários

### useBreakpoint

Hook para detecção responsiva de breakpoints.

```tsx
import { useBreakpoint } from '@/design-system';

const { current, isMobile, isTablet, width } = useBreakpoint();

// current: 'mobile' | 'tablet' | 'desktop' | 'wide'
// isMobile: boolean
// width: number (largura atual)
```

### useToggle

Hook simples para alternar estados booleanos.

```tsx
import { useToggle } from '@/design-system';

const [isOpen, toggle, setIsOpen] = useToggle(false);

// toggle() - alterna o estado
// setIsOpen(true) - define explicitamente
```

## 🎨 Usando Design Tokens

```tsx
import { tokens } from '@/design-system';

const StyledComponent = styled.div`
  background: ${tokens.colors.glass.primary};
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.lg};
  color: ${tokens.colors.text.primary};
  font-size: ${tokens.typography.sizes.base};
  transition: all ${tokens.transitions.normal};
`;
```

## 🏗️ Extensibilidade

### Criando Novos Componentes

1. Siga a estrutura de tokens existente
2. Use styled-components com glassmorphism
3. Implemente estados hover/focus/disabled
4. Adicione TypeScript interfaces
5. Exporte no index.ts

### Exemplo de Novo Componente

```tsx
import React from 'react';
import styled from 'styled-components';
import { tokens } from '../tokens';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error';
}

const StyledTag = styled.span<{ variant: string }>`
  display: inline-block;
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.full};
  font-size: ${tokens.typography.sizes.xs};
  font-weight: ${tokens.typography.fontWeights.medium};
  
  ${props => props.variant === 'success' && `
    background: ${tokens.colors.success.background};
    color: ${tokens.colors.success.light};
  `}
`;

export const Tag: React.FC<TagProps> = ({ 
  children, 
  variant = 'default' 
}) => (
  <StyledTag variant={variant}>
    {children}
  </StyledTag>
);
```

## 🚀 Benefícios

- **Consistência Visual**: Todos os componentes seguem o mesmo padrão
- **DX Melhorado**: Desenvolvimento mais rápido com componentes prontos
- **Manutenibilidade**: Mudanças globais via tokens
- **Performance**: Componentes otimizados com animações suaves
- **Acessibilidade**: Estados de foco e navegação por teclado
- **Responsividade**: Breakpoints consistentes em toda aplicação

## 📱 Responsividade

Breakpoints definidos:
- **Mobile**: até 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px - 1024px
- **Wide**: 1025px+

Use o hook `useBreakpoint()` para lógica responsiva em JavaScript.

## 🎯 Próximos Passos

1. **Novos Componentes**: Tooltip, Dropdown, Toast
2. **Variações de Tema**: Modo claro/escuro
3. **Animações Avançadas**: Micro-interações
4. **Testes**: Cobertura completa com Jest/RTL
5. **Storybook**: Documentação interativa