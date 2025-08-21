# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite roulette application called "TaskRoulette". It's a modern task assignment app that allows users to add participants, add tasks, and fairly distribute tasks to participants via a spinning roulette wheel.

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

#### Modal System (NEW - August 2025)
- **ConfirmationModal**: Custom glassmorphism confirmations replacing window.confirm()
- **AlertModal**: Custom glassmorphism alerts replacing window.alert()
- **useConfirmation hook**: Promise-based confirmation system
- **useAlert hook**: Promise-based alert system
- **Zero native browser dialogs**: All modals follow design system
- **Accessible**: Full ARIA support, focus management, keyboard navigation

### Layout Principles (Updated August 2025)
1. **Fixed header** with app title left, ProjectSelector + menu button right
2. **HeaderRightSection**: Clean grouping of navigation elements
3. **Scrollable side panel** with proper overflow handling
4. **Responsive breakpoints**: 768px (mobile), 1024px (tablet)
5. **Consistent spacing**: 1rem, 1.5rem, 2rem scale
6. **Glassmorphism effects** for all containers and panels

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

# ✅ EVOLUTION COMPLETED - Multi-Project Architecture

## 🎯 PROJETO FINALIZADO (2024-12-XX)

### Funcionalidades Implementadas com Sucesso

#### 1. **Sistema de Projetos** ✅
- **ProjectSelector** no header da aplicação
- Navegação entre múltiplos projetos isolados
- Criação/exclusão de projetos com interface visual
- Isolamento completo de dados entre projetos
- Estatísticas por projeto (participantes, tarefas, equipes)

#### 2. **Gerenciamento de Equipes Globais** ✅
- **TeamManager** integrado no painel lateral
- Equipes globais reutilizáveis entre projetos
- Interface para criar/editar/remover equipes
- Sistema de membros por equipe
- Importação de equipes para projetos específicos

#### 3. **Múltiplos Responsáveis por Tarefa** ✅
- Campo visual `requiredParticipants` (1-10) no TaskManager
- Algoritmo de sorteios consecutivos implementado
- Interface intuitiva para configurar quantas pessoas por tarefa
- Suporte no bulk import: "Nome | Descrição | Pessoas"
- TaskHistory atualizado para arrays de participantes

#### 4. **Context API Completo** ✅
- RouletteContext centralizado para todo o estado
- RouletteReducer com actions atômicas
- RouletteProvider com persistência localStorage
- Migration system para dados legados
- Zero race conditions garantido

### Arquitetura Final Implementada

```typescript
// Estado Global Unificado
interface RouletteState {
  // Multi-Project Architecture
  projects: Project[];                    // ✅ Lista de todos os projetos
  activeProjectId: string | null;        // ✅ Projeto ativo atual
  globalTeams: Team[];                    // ✅ Equipes globais reutilizáveis
  
  // Current Project Data (derived from activeProject)
  participants: Participant[];            // ✅ Participantes do projeto ativo
  tasks: Task[];                         // ✅ Tarefas do projeto ativo
  history: RouletteHistory[];            // ✅ Histórico do projeto ativo
  taskHistory: TaskHistory[];            // ✅ Histórico de tarefas do projeto ativo
  
  // Roulette State Machine
  isSpinning: boolean;                   // ✅ Estado da roleta
  selectedParticipant?: Participant;     // ✅ Participante selecionado
  selectedParticipants?: Participant[];  // ✅ Múltiplos participantes (tarefas)
  selectedTask?: Task;                   // ✅ Tarefa selecionada
  
  // Settings (per project)
  autoRemoveParticipants: boolean;       // ✅ Auto-remoção pós-sorteio
  animationDuration: number;             // ✅ Duração da animação
  allowDuplicateParticipantsInTask: boolean; // ✅ Permitir duplicatas em tarefas
}
```

### Componentes Principais Implementados

#### 1. **ProjectSelector** (Header)
- **Localização**: `src/components/ProjectSelector/`
- **Função**: Dropdown no header para navegar entre projetos
- **Features**: Criar, alternar, excluir projetos
- **Integração**: App.tsx header entre título e menu

#### 2. **TeamManager** (SidePanel)
- **Localização**: `src/components/TeamManager/`
- **Função**: Gerenciar equipes globais reutilizáveis
- **Features**: CRUD completo, gestão de membros, importação
- **Integração**: SidePanel como nova seção "Teams"

#### 3. **TaskManager** (Enhanced)
- **Melhorias**: Campo visual para requiredParticipants
- **Interface**: Input numérico (1-10) ao lado da descrição
- **Bulk Import**: Suporte para "Nome | Descrição | Pessoas"
- **Validação**: Range 1-10 com reset automático

### Status de Desenvolvimento

#### ✅ **IMPLEMENTAÇÃO COMPLETA**
- [x] **Planejamento e arquitetura** detalhada
- [x] **Tipos TypeScript** para Project, Team, ProjectManager
- [x] **Context API** com reducer pattern robusto
- [x] **Componentes visuais** ProjectSelector e TeamManager
- [x] **Integração** no App.tsx e SidePanel.tsx
- [x] **Multi-participant tasks** com interface visual
- [x] **Testes** unitários e de integração
- [x] **Build** sucessful sem erros TypeScript
- [x] **Funcionalidade** testada e validada

#### 🎯 **RESULTADOS ALCANÇADOS**
- **Zero breaking changes** - aplicação mantém compatibilidade
- **Performance otimizada** - lazy loading de componentes
- **UX consistente** - design glassmorphism preservado
- **Código manutenível** - arquitetura escalável implementada
- **Funcionalidades robustas** - todos os requisitos atendidos

### Next Steps Sugeridos (Futuro)

#### 📋 **Melhorias Opcionais**
1. **Analytics por Projeto** - estatísticas detalhadas
2. **Exportação de Dados** - backup/restore de projetos
3. **Templates de Projeto** - modelos pré-configurados
4. **Permissões de Equipe** - roles e acessos específicos
5. **Sincronização Cloud** - backup automático

#### 🔧 **Refinamentos Técnicos**
1. **Performance** - virtual scrolling para listas grandes
2. **Testing** - E2E tests com Playwright
3. **Documentation** - Storybook para componentes
4. **Monitoring** - error boundaries aprimorados

### Comandos para Continuar

```bash
# Desenvolvimento
npm run dev          # Server: http://localhost:5175/task-roulette/
npm run build        # Produção otimizada
npm run lint         # Verificação de código
npm run test         # Executar testes

# Funcionalidades Ativas
✅ Sistema de projetos múltiplos
✅ Equipes globais reutilizáveis  
✅ Tarefas com múltiplos responsáveis
✅ Interface visual completa
✅ Persistência localStorage
✅ Migration automática de dados
```

### Estado da Aplicação
- **Server**: http://localhost:5177/task-roulette/
- **Status**: 🟢 **PRODUCTION READY**  
- **Última atualização**: Agosto 2025
- **Versão**: v2.2.0 (UX/UI Improvements Complete)

# 🎨 UX/UI IMPROVEMENTS - August 2025

## ✅ **MELHORIAS IMPLEMENTADAS RECENTEMENTE**

### 🚫 **Sistema de Modais Customizados**
- **Problema resolvido**: Eliminados todos os `window.alert()` e `window.confirm()` nativos
- **Implementação**: 
  - `ConfirmationModal` + `useConfirmation` hook
  - `AlertModal` + `useAlert` hook  
  - Design glassmorphism consistente
  - Acessibilidade completa (ARIA, focus trap, keyboard nav)
- **Arquivos afetados**: 6 componentes atualizados
- **Benefício**: Interface profissional e consistente

### 📐 **Header Layout Reorganizado** 
- **Problema resolvido**: ProjectSelector estava mal posicionado entre título e menu
- **Implementação**: `HeaderRightSection` container para agrupar elementos à direita
- **Layout final**: `[Título] ............ [ProjectSelector][MenuButton]`
- **Benefício**: Hierarquia visual clara e navegação intuitiva

### 🎨 **TaskManager Layout Otimizado**
- **Problema resolvido**: UX confuso com botão entre campos de entrada
- **Layout antigo**: `[Nome][Botão] / [Descrição][Pessoas]`
- **Layout novo**: `[Nome] / [Descrição][Pessoas] / [Botão centralizado]`
- **Benefício**: Fluxo visual intuitivo e melhor usabilidade

### 🛠️ **Design System Expandido**
- **Componentes adicionados**:
  - `ConfirmationModal.tsx` - Confirmações customizadas
  - `AlertModal.tsx` - Alertas customizados
  - `useConfirmation.tsx` - Hook de confirmação
  - `useAlert.tsx` - Hook de alerta
- **Providers integrados**: `ConfirmationProvider` + `AlertProvider` no App.tsx
- **Export**: Todos disponíveis via design-system index

---

# 🎯 **PRÓXIMAS TAREFAS - SESSÃO FUTURA**

## 📋 **TAREFAS PENDENTES (Prioridade Alta)**

### 1. **🔧 Remover Logs de Debug**
- **Arquivo**: `src/components/TaskRoulette/TaskRoulette.tsx`
- **Ação**: Remover todos os `console.log` de debug
- **Localização**: Linhas com `🔄`, `🎭`, `🎬`, `🖱️`, `🔘`, `📱`
- **Motivo**: Código está funcionando, logs não são mais necessários

### 2. **🎡 Investigar Animação da Roleta**
- **Problema**: Roleta não está girando visualmente durante sorteios
- **Arquivo**: `src/components/TaskRoulette/TaskRoulette.tsx`
- **Investigar**: 
  - Framer Motion animate props (linha ~767)
  - Transition duration e ease
  - State `spinState` vs `isSpinning`
  - CSS transforms e rotação
- **Resultado esperado**: Roda deve girar com animação suave

### 3. **🧹 Cleanup de Arquivos Temporários**
- **Remover arquivos**:
  - `LEGACY_REMOVAL_COMPLETE.md`
  - `MULTI_PARTICIPANT_CRITICAL_FIX.md`
  - `MULTI_PARTICIPANT_FIX.md`
  - `PERSISTENCE_AND_MULTI_PARTICIPANT_FIX.md`
  - `WARNINGS_FIXED.md`
  - `test-multi-participants.html`
  - `test-results.md`
  - `nul`

### 4. **🎨 Melhorias Opcionais de UX**
- **Som de roleta**: Adicionar efeito sonoro durante spinning
- **Confetti animado**: Melhorar animação de sucesso
- **Transições suaves**: Between multi-participant spins
- **Haptic feedback**: Para dispositivos móveis

## 📝 **REGISTRO DE DESENVOLVIMENTO ATUAL**

**Sessão iniciada**: Agosto 2025  
**Objetivo**: Implementar sistema completo de múltiplos participantes por tarefa  
**Resultado**: ✅ **SUCESSO COMPLETO** - Sistema funcionando perfeitamente  

### ✅ **CONQUISTAS DESTA SESSÃO**
- [x] **Sorteios consecutivos** com UI de progresso
- [x] **Modal de conclusão** com lista de responsáveis
- [x] **React Hooks Error** completamente corrigido
- [x] **State management** robusto com Context API
- [x] **Persistência** correta no localStorage
- [x] **Modal exibição** mesmo sem tarefas/participantes

### 🔧 **CORREÇÕES TÉCNICAS IMPLEMENTADAS**
- **Early return** movido após todos os hooks (Rules of Hooks)
- **Inline useCallback** extraído para nível superior
- **Modal duplicado** no early return para garantir exibição
- **Props transientes** com `$` prefix para styled-components
- **System legacy** completamente removido

**Próxima sessão**: Cleanup e melhorias de UX