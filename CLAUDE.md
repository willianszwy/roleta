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
⚠️ **NEEDS REFACTORING**: Current implementation has race conditions with participant removal
- Uses custom `useRoulette` and `useTaskRoulette` hooks 
- **PROBLEM**: Timeouts used for state propagation causing unreliable participant removal
- **SOLUTION NEEDED**: Implement Context API + useReducer for robust state management
- Persistent storage via localStorage for participants and history
- Main state includes participants, tasks, spin history, spinning status, and selected participant

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

### Key Hooks
- `useRoulette`: Main business logic hook (state + actions)
- `useLocalStorage`: Generic localStorage hook for persistence

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

## 🚨 URGENT REFACTORING NEEDED

### Current State Management Issues
The application currently suffers from **race conditions** in participant removal functionality:

#### Problem Details
- **File**: `src/App.tsx` (lines 173-233)
- **Issue**: Uses `setTimeout` and manual filtering to prevent removed participants from being re-selected
- **Symptoms**: Participants can win multiple tasks even when auto-removal is enabled
- **Root Cause**: State propagation delays between hooks and manual filtering logic

#### Proposed Solution: Context API + useReducer
```typescript
// Recommended structure:
src/
├── context/
│   ├── RouletteContext.tsx     # Central state context
│   ├── RouletteReducer.ts      # State reducer with actions
│   └── RouletteProvider.tsx    # Provider component
└── hooks/
    ├── useRouletteContext.ts   # Hook to consume context
    └── useLocalStorage.ts      # Keep for persistence
```

#### Implementation Priority
1. **Create RouletteContext** with centralized state (participants, tasks, history, lastWinner)
2. **Implement RouletteReducer** with actions: REMOVE_PARTICIPANT, SET_LAST_WINNER, SPIN_COMPLETE
3. **Replace custom hooks** with context consumer hooks
4. **Remove timeout-based logic** from App.tsx
5. **Ensure atomic operations** for all state changes

#### Benefits
- ✅ **Eliminates race conditions** - all state changes are synchronous
- ✅ **Predictable state updates** - reducer pattern ensures consistency
- ✅ **Better debugging** - clear action history and state flow
- ✅ **No external dependencies** - uses React's built-in Context API
- ✅ **Maintainable code** - centralized logic instead of scattered hooks

#### Debug Logs Currently Present
The App.tsx contains extensive console.log statements for debugging the current issue. These should be removed after implementing the new state management.

### Auto-Removal Feature Status
- **Current Status**: ❌ Broken (participants can win multiple times)
- **Expected Behavior**: Participant removed immediately after winning, cannot be selected again
- **Test Case**: Import 10 participants, enable auto-removal, run multiple task assignments
- **Failure Mode**: Same participant appears multiple times in task history