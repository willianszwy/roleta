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

## 🧪 E2E Testing Strategy with Playwright

### Testing Overview
Comprehensive end-to-end testing to validate all user workflows and critical business logic using Playwright. Tests should cover both happy paths and edge cases for maximum reliability.

### Setup & Configuration

#### Installation
```bash
# Install Playwright
npm create playwright@latest

# Install dependencies
npm install --save-dev @playwright/test

# Install browsers
npx playwright install

# Run tests
npm run test:e2e
```

#### Project Structure
```
tests/
├── e2e/
│   ├── participant-roulette.spec.ts   # Basic participant roulette tests
│   ├── task-roulette.spec.ts          # Task assignment tests
│   ├── participant-management.spec.ts # CRUD operations
│   ├── task-management.spec.ts        # Task CRUD operations
│   ├── settings.spec.ts               # Settings and configuration
│   ├── data-persistence.spec.ts       # LocalStorage functionality
│   ├── responsive.spec.ts             # Mobile/tablet layouts
│   └── accessibility.spec.ts          # A11y compliance
├── helpers/
│   ├── test-data.ts                   # Mock data generators
│   ├── page-objects.ts                # Page object models
│   └── utils.ts                       # Test utilities
└── fixtures/
    ├── participants.json              # Test participant data
    └── tasks.json                     # Test task data
```

### Core Test Scenarios

#### 1. **Participant Roulette Tests** (`participant-roulette.spec.ts`)
```typescript
// Critical test cases:
✅ Add single participant and spin
✅ Add multiple participants (2-20) and verify random selection
✅ Verify roulette animation duration (4.5s) before modal
✅ Check winner modal appears with correct participant
✅ Validate confetti animation triggers
✅ Test auto-close modal functionality
✅ Verify history tracking and persistence
✅ Test auto-removal feature (participant removed after winning)
✅ Validate empty state handling (no participants)
✅ Test bulk participant import via textarea
```

#### 2. **Task Roulette Tests** (`task-roulette.spec.ts`)
```typescript
// Business logic validation:
✅ Add participants and tasks, verify task assignment
✅ Verify task queue (first pending task selected)
✅ Check task completion tracking in sidebar
✅ Validate participant-task pairing in history
✅ Test auto-removal in task mode
✅ Verify task progress indicators (pending/completed)
✅ Test task description display in modal
✅ Validate task roulette animation timing
✅ Test task completion state persistence
✅ Verify no duplicate task assignments
```

#### 3. **Participant Management Tests** (`participant-management.spec.ts`)
```typescript
// CRUD operations:
✅ Add participant via input field
✅ Add multiple participants via bulk import
✅ Remove individual participants
✅ Clear all participants
✅ Edit participant names (if implemented)
✅ Validate duplicate name handling
✅ Test participant color assignment
✅ Verify participant count updates
✅ Test undo/restore functionality
✅ Validate input field validation and limits
```

#### 4. **Task Management Tests** (`task-management.spec.ts`)
```typescript
// Task lifecycle:
✅ Add task with name only
✅ Add task with name + description
✅ Add multiple tasks via bulk import
✅ Remove individual tasks
✅ Clear all tasks
✅ Verify task status transitions (pending → completed)
✅ Test task queue ordering
✅ Validate task history tracking
✅ Test task restoration from history
✅ Verify task validation rules
```

#### 5. **Settings & Configuration Tests** (`settings.spec.ts`)
```typescript
// Settings validation:
✅ Toggle between participant/task roulette modes
✅ Enable/disable winner modal
✅ Configure auto-removal setting
✅ Adjust modal auto-close duration
✅ Test settings persistence across sessions
✅ Verify mode switching updates UI correctly
✅ Test confetti enable/disable
✅ Validate animation duration settings
✅ Test reset to default settings
✅ Verify settings export/import (if implemented)
```

#### 6. **Data Persistence Tests** (`data-persistence.spec.ts`)
```typescript
// LocalStorage reliability:
✅ Add data, refresh page, verify persistence
✅ Test data survival across browser sessions
✅ Validate history tracking persistence
✅ Test settings persistence
✅ Verify data corruption handling
✅ Test localStorage quota limits
✅ Validate date serialization/deserialization
✅ Test data migration scenarios
✅ Verify backup/restore functionality
✅ Test cross-tab synchronization (if implemented)
```

#### 7. **Responsive Design Tests** (`responsive.spec.ts`)
```typescript
// Multi-device validation:
✅ Desktop layout (1920x1080, 1366x768)
✅ Tablet layout (768x1024, 1024x768)
✅ Mobile layout (375x667, 414x896)
✅ Ultra-wide displays (2560x1440)
✅ Verify roulette wheel scaling
✅ Test side panel responsive behavior
✅ Validate modal responsiveness
✅ Check navigation button accessibility
✅ Test touch interactions on mobile
✅ Verify text legibility across sizes
```

#### 8. **Accessibility Tests** (`accessibility.spec.ts`)
```typescript
// A11y compliance:
✅ Keyboard navigation support
✅ Screen reader compatibility
✅ Focus management in modals
✅ ARIA labels and roles
✅ Color contrast validation
✅ Tab order verification
✅ Skip link functionality
✅ Error message accessibility
✅ High contrast mode support
✅ Reduced motion preferences
```

### Advanced Test Scenarios

#### 9. **Edge Cases & Error Handling**
```typescript
// Stress testing:
✅ Test with 100+ participants
✅ Test with 50+ tasks
✅ Rapid clicking during spin animation
✅ Network disconnection scenarios
✅ Browser tab switching during spin
✅ Memory leak detection in long sessions
✅ Concurrent user interactions
✅ Invalid data input handling
✅ Extreme screen sizes
✅ Browser compatibility (Chrome, Firefox, Safari, Edge)
```

#### 10. **Performance Tests**
```typescript
// Speed & efficiency:
✅ Roulette spin animation performance
✅ Large dataset rendering performance
✅ Modal open/close speed
✅ Side panel scroll performance
✅ Memory usage monitoring
✅ Bundle size validation
✅ First contentful paint timing
✅ Interaction responsiveness
✅ Animation frame rate monitoring
✅ LocalStorage read/write performance
```

### Test Data Management

#### Mock Data Strategy
```typescript
// Test data generators:
- generateParticipants(count: number): Participant[]
- generateTasks(count: number): Task[]
- generateHistory(entries: number): RouletteHistory[]
- createTestScenario(scenario: string): TestData
```

#### Test Scenarios
```typescript
// Predefined scenarios:
- SMALL_GROUP: 3 participants, 5 tasks
- MEDIUM_GROUP: 10 participants, 15 tasks  
- LARGE_GROUP: 50 participants, 30 tasks
- EDGE_CASE: 1 participant, 1 task
- STRESS_TEST: 100 participants, 100 tasks
```

### CI/CD Integration

#### GitHub Actions Workflow
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

#### Test Reports
- **HTML Reports**: Visual test results with screenshots
- **JUnit XML**: Integration with CI systems
- **Coverage Reports**: Component interaction coverage
- **Performance Metrics**: Timing and resource usage
- **Accessibility Audits**: WCAG compliance reports

### Maintenance & Best Practices

#### Test Organization
```typescript
// Page Object Model pattern:
class RoulettePage {
  async addParticipant(name: string): Promise<void>
  async spinRoulette(): Promise<string>
  async waitForSpinComplete(): Promise<void>
  async getWinnerFromModal(): Promise<string>
}
```

#### Assertions Strategy
```typescript
// Comprehensive validations:
- Visual assertions (screenshots)
- DOM structure validation
- State consistency checks
- Animation timing verification
- Accessibility compliance
- Performance thresholds
```

#### Test Execution
```bash
# Run all tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- participant-roulette

# Run with UI mode
npm run test:e2e -- --ui

# Run in headed mode
npm run test:e2e -- --headed

# Generate report
npm run test:e2e -- --reporter=html
```

### Success Criteria
- **95%+ pass rate** on all test scenarios
- **Zero flaky tests** (tests must be deterministic)
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Mobile responsiveness** validation
- **Accessibility compliance** (WCAG 2.1 AA)
- **Performance benchmarks** met
- **Data integrity** guaranteed across all scenarios