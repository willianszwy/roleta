import { createContext, useContext } from 'react';
import type { Participant, Task, RouletteHistory, TaskHistory } from '../types';

export interface RouletteState {
  // Participants
  participants: Participant[];
  // Tasks
  tasks: Task[];
  // History
  history: RouletteHistory[];
  taskHistory: TaskHistory[];
  // Spinning state
  isSpinning: boolean;
  selectedParticipant?: Participant;
  selectedTask?: Task;
  // Settings
  autoRemoveParticipants: boolean;
  animationDuration: number;
  // Last winner tracking for auto-removal
  lastWinner?: Participant;
}

export interface RouletteActions {
  // Participant actions
  addParticipant: (name: string) => void;
  addParticipantsBulk: (names: string[]) => void;
  removeParticipant: (id: string) => void;
  clearParticipants: () => void;
  
  // Task actions
  addTask: (name: string, description?: string) => void;
  addTasksBulk: (taskLines: string[]) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
  
  // Spin actions
  spinRoulette: () => Promise<Participant | null>;
  spinTaskRoulette: () => Promise<{ participant: Participant; task: Task } | null>;
  finishSpin: (selectedParticipant?: Participant) => void;
  finishTaskSpin: (selectedParticipant?: Participant, selectedTask?: Task) => void;
  
  // History actions
  clearHistory: () => void;
  clearTaskHistory: () => void;
  removeFromRouletteAfterSpin: (participantId: string) => void;
  restoreParticipant: (participantName: string) => void;
  
  // Settings actions
  setAutoRemoveParticipants: (enabled: boolean) => void;
  
  // Utility actions
  getCurrentTask: () => Task | undefined;
}

export interface RouletteContextType {
  state: RouletteState;
  actions: RouletteActions;
}

export const RouletteContext = createContext<RouletteContextType | null>(null);

export function useRouletteContext(): RouletteContextType {
  const context = useContext(RouletteContext);
  if (!context) {
    throw new Error('useRouletteContext must be used within a RouletteProvider');
  }
  return context;
}