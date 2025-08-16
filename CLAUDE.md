# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite roulette application called "Roleta Premium". It's a modern lottery/spin wheel app that allows users to add participants, spin a roulette wheel, and track winners.

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
- Uses custom `useRoulette` hook for centralized state management
- Persistent storage via localStorage for participants and history
- Main state includes participants, spin history, spinning status, and selected participant

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