import { createContext, useContext } from 'react';
import type { 
  Participant, 
  Task, 
  RouletteHistory, 
  TaskHistory, 
  Project, 
  Team, 
  ProjectManagerState 
} from '../types';

export interface RouletteState extends ProjectManagerState {
  // Global teams (shared across projects)
  globalTeams: Team[];
  // Current active project data (for backward compatibility)
  participants: Participant[];
  tasks: Task[];
  history: RouletteHistory[];
  taskHistory: TaskHistory[];
  // Settings from active project
  autoRemoveParticipants: boolean;
  animationDuration: number;
  allowDuplicateParticipantsInTask: boolean;
  // Last winner tracking for auto-removal
  lastWinner?: Participant;
  // Multi-participant task state
  currentTaskSpin?: {
    task: Task;
    requiredParticipants: number;
    selectedParticipants: Participant[];
    currentSpinIndex: number;
    isSpinning: boolean;
  };
}

export interface RouletteActions {
  // Participant actions
  addParticipant: (name: string) => void;
  addParticipantsBulk: (names: string[]) => void;
  removeParticipant: (id: string) => void;
  clearParticipants: () => void;
  
  // Task actions  
  addTask: (name: string, description?: string, requiredParticipants?: number) => void;
  addTasksBulk: (taskLines: string[]) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
  
  // Spin actions
  spinRoulette: () => Promise<Participant | null>;
  spinTaskRoulette: () => Promise<{ participants: Participant[]; task: Task } | null>;
  finishSpin: (selectedParticipant?: Participant) => void;
  finishTaskSpin: (selectedParticipants?: Participant[], selectedTask?: Task) => void;
  
  // Multi-participant task spin actions
  startMultiParticipantTaskSpin: (task: Task) => void;
  finishSingleParticipantSpin: (participant: Participant) => void;
  completeMultiParticipantTaskSpin: () => void;
  cancelMultiParticipantTaskSpin: () => void;
  
  // History actions
  clearHistory: () => void;
  clearTaskHistory: () => void;
  removeFromRouletteAfterSpin: (participantId: string) => void;
  restoreParticipant: (participantName: string) => void;
  
  // Settings actions
  setAutoRemoveParticipants: (enabled: boolean) => void;
  
  // Project management actions
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  switchProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  
  // Team management actions
  addTeam: (name: string, description?: string) => void;
  removeTeam: (id: string) => void;
  editTeam: (id: string, name: string, description?: string) => void;
  addMemberToTeam: (teamId: string, participant: Participant) => void;
  removeMemberFromTeam: (teamId: string, participantId: string) => void;
  importTeamToProject: (teamId: string) => void;
  
  // Utility actions
  getCurrentTask: (currentState: RouletteState) => Task | undefined;
  getActiveProject: (currentState: RouletteState) => Project | undefined;
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