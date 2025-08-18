# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite roulette application called "LuckyWheel". It's a modern lottery/spin wheel app that allows users to add participants, spin a roulette wheel, and track winners.

## Common Commands

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Architecture

### State Management
✅ **RESOLVIDO**: Context API + useReducer implementado com sucesso
- **RouletteContext**: Estado centralizado unificado para ambos modos (participantes/tarefas)
- **RouletteReducer**: Actions atômicas eliminam race conditions  
- **State Machine**: Estados `idle` → `spinning` → `completed` garantem timing correto
- **Persistent storage**: localStorage para participantes, tarefas e histórico
- **Estado unificado**: participants, tasks, history, taskHistory, isSpinning, selectedParticipant, autoRemove

### Key Components Structure
- **App.tsx**: Main component with 3-column responsive grid layout
- **Roulette**: Central spinning wheel component with animation
- **ParticipantManager**: Add/remove participants interface
- **History**: Track and manage spin results

### Core Data Flow
1. Participants are added via ParticipantManager
2. Roulette component handles spinning animation and selection
3. `useRoulette` hook manages state and persistence
4. History component tracks all spin results
5. Confetti animations trigger on spin completion

### Technology Stack
- **Styling**: Styled-components with glassmorphism design
- **Animations**: Framer Motion for component animations, canvas-confetti for celebrations
- **Storage**: localStorage with JSON serialization/deserialization for Date objects
- **Types**: Comprehensive TypeScript interfaces in `src/types/index.ts`

### Key Hooks & Context
- **`useRouletteContext`**: Consume estado centralizado do Context API
- **`useLocalStorage`**: Generic localStorage hook for persistence
- **RouletteProvider**: Gerencia estado global da aplicação

### Styling Approach
- Glassmorphism design with backdrop-filter blur effects
- Responsive grid layout (3-col → 2-col → 1-col)
- CSS-in-JS with styled-components
- Gradient backgrounds and modern UI elements

## Design System Guide

### Visual Identity
- **Clean, minimalist interface** without external dependencies
- **No emojis or decorative icons** - text-only approach for professional appearance
- **Simple text symbols** for status indicators: ✓ (completed), ○ (pending), + (positive), - (negative)

### Color Palette
```css
/* Primary Gradients */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--secondary-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

/* Status Colors */
--success: rgba(34, 197, 94, 0.3)  /* Green for completed */
--error: rgba(239, 68, 68, 0.3)    /* Red for errors/negative */
--warning: rgba(251, 191, 36, 0.3) /* Yellow for warnings */

/* Glass Morphism Colors */
--glass-primary: rgba(255, 255, 255, 0.08)
--glass-border: rgba(255, 255, 255, 0.15)
--glass-hover: rgba(255, 255, 255, 0.12)
```

### Typography
```css
/* Text Colors */
--text-primary: rgba(255, 255, 255, 0.9)
--text-secondary: rgba(255, 255, 255, 0.7)
--text-muted: rgba(255, 255, 255, 0.6)

/* Font Weights */
--weight-normal: 500
--weight-medium: 600
--weight-bold: 700
```

### Component Standards

#### Buttons
```css
/* Standard Button Style - based on Settings ResetButton */
background: rgba(102, 126, 234, 0.2);
border: 1px solid rgba(102, 126, 234, 0.4);
border-radius: 6px;
color: #a5b4fc;
font-weight: 600;
transition: all 0.3s ease;

/* Hover State */
&:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.6);
}

/* Disabled State */
&:disabled {
  background: rgba(156, 163, 175, 0.2);
  border-color: rgba(156, 163, 175, 0.4);
  color: rgba(156, 163, 175, 0.6);
}
```

#### Glass Containers
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(15px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 1rem;
box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
```

#### Navigation Elements
- **No icons or emojis** in navigation buttons
- Text-only labels: "Participantes", "Tarefas", "Histórico", "Config"
- Consistent button styling across all navigation

#### Status Indicators
- **Completed**: ✓ (checkmark)
- **Pending**: ○ (circle)
- **Positive Result**: + (plus sign)
- **Negative Result**: - (minus sign)
- **Neutral/Empty**: · (center dot)

### Layout Principles
1. **Fixed header** with app title left, menu button right
2. **Scrollable side panel** with proper overflow handling
3. **Responsive breakpoints**: 768px (mobile), 1024px (tablet)
4. **Consistent spacing**: 1rem, 1.5rem, 2rem scale
5. **Glassmorphism effects** for all containers and panels

### Animation Guidelines
- **Framer Motion** for all component animations
- **Smooth transitions**: 0.3s ease for interactive elements
- **Spring animations** for modals and important state changes
- **Stagger animations** for lists with 0.05s delay between items

### Accessibility & UX
- **High contrast text** on glass backgrounds
- **Clear visual hierarchy** with proper font weights and sizes
- **Consistent interactive states** (hover, active, disabled)
- **Responsive design** that works on all screen sizes
- **Clean information architecture** without visual clutter

### Code Conventions
- **No external icon libraries** (removed Flaticon dependency)
- **Styled-components** for all styling
- **TypeScript interfaces** for all props and data structures
- **Consistent naming**: PascalCase for components, camelCase for props
- **Modular component structure** with clear separation of concerns

## ✅ REFACTORING COMPLETADO - Estado Arquitetural

### State Management Implementation
A aplicação foi **completamente refatorada** com Context API + useReducer, eliminando race conditions:

#### Estrutura Implementada
```typescript
// Arquitetura atual:
src/
├── context/
│   ├── RouletteContext.tsx     # ✅ Central state context
│   ├── RouletteReducer.ts      # ✅ State reducer with actions
│   └── RouletteProvider.tsx    # ✅ Provider component
└── hooks/
    ├── useRouletteContext.ts   # ✅ Hook to consume context (removed)
    └── useLocalStorage.ts      # ✅ Keep for persistence
```

#### Melhorias Implementadas
1. ✅ **RouletteContext criado** com estado centralizado (participants, tasks, history, taskHistory)
2. ✅ **RouletteReducer implementado** com actions atômicas: REMOVE_PARTICIPANT, FINISH_SPIN, AUTO_REMOVE
3. ✅ **Hooks customizados substituídos** por context consumer direto
4. ✅ **Lógica timeout removida** de App.tsx - substituída por state machine
5. ✅ **Operações atômicas garantidas** para todas mudanças de estado

#### Benefícios Alcançados
- ✅ **Race conditions eliminadas** - todas mudanças de estado são síncronas
- ✅ **State updates previsíveis** - reducer pattern garante consistência
- ✅ **Debugging melhorado** - fluxo claro de actions e estado
- ✅ **Zero dependências externas** - usa Context API built-in do React
- ✅ **Código maintível** - lógica centralizada vs hooks espalhados
- ✅ **State Machine nas roletas** - timing perfeito para modals
- ✅ **Props DOM limpas** - shouldForwardProp elimina warnings

### Auto-Removal Feature Status
- **Current Status**: ✅ **RESOLVIDO** - Context API eliminou race conditions
- **Expected Behavior**: Participant removed immediately after winning, cannot be selected again
- **Test Case**: Import 10 participants, enable auto-removal, run multiple task assignments
- **Success**: State machine garante remoção atômica pós-sorteio

# FEATURE DEVELOPMENT MANDATORY STANDARDS

## 🚨 ALWAYS REQUIRED for new features:

### 1. PLANNING PHASE (ALWAYS create TODO item first)
- Detailed analysis and architecture planning
- Break down into subtasks
- Define acceptance criteria and validation steps
- Consider impact on existing components

### 2. TESTING (NEVER skip)
- Unit tests for business logic
- Component tests for UI behavior  
- Integration tests for complete flows
- Accessibility tests using jest-axe
- Minimum 80% coverage for new code

### 3. ACCESSIBILITY (ALWAYS implement)
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- WCAG 2.1 AA color contrast
- Focus management

### 4. INTERNATIONALIZATION (ALWAYS include)
- Translation keys for ALL text content
- Complete translations in 4 languages: pt-BR, en-US, es-ES, fr-FR
- NO hardcoded text allowed
- Localized data formatting

### 5. VALIDATION CHECKLIST (ALWAYS verify before completion)
- ✅ All tests passing
- ✅ ESLint without errors  
- ✅ Build successful
- ✅ Accessibility validated
- ✅ All translations implemented
- ✅ Coverage > 80%

## 🔄 WORKFLOW ORDER (follow strictly):
1. Planning TODO item → 2. Implementation → 3. Tests → 4. Accessibility → 5. Translations → 6. Validation

## 🚫 BLOCKING CRITERIA:
Do NOT complete any feature that lacks: tests, accessibility, translations, or proper planning.

See FEATURE_GUIDELINES.md for detailed implementation standards.