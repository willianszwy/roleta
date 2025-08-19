export interface Participant {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

export interface RouletteHistory {
  id: string;
  participantId: string;
  participantName: string;
  selectedAt: Date;
  removed?: boolean;
}


export interface Task {
  id: string;
  name: string;
  description?: string;
  color?: string;
  requiredParticipants: number; // Number of participants needed for this task (1-10)
  createdAt: Date;
}

export interface TaskHistory {
  id: string;
  participants: Array<{
    id: string;
    name: string;
  }>; // Support multiple participants per task
  taskId: string;
  taskName: string;
  taskDescription?: string;
  selectedAt: Date;
}

export interface RouletteState {
  participants: Participant[];
  history: RouletteHistory[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  animationDuration: number;
}


export interface TaskRouletteState {
  participants: Participant[];
  tasks: Task[];
  taskHistory: TaskHistory[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  selectedTask?: Task;
  animationDuration: number;
}

export type RouletteMode = 'participants' | 'tasks';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface SpinConfig {
  duration: number;
  easing: string;
  minRotations: number;
  maxRotations: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface RouletteProps {
  participants: Participant[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  onSpin: () => void;
  onSpinComplete: (participant: Participant) => void;
}

export interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export interface HistoryProps {
  history: RouletteHistory[];
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
}

export interface ConfettiConfig {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
  gravity: number;
  drift: number;
  scalar: number;
}

// Team Management Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: Participant[];
  color?: string;
  createdAt: Date;
}

// Project Management Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  participants: Participant[];
  tasks: Task[];
  teams: Team[];
  history: RouletteHistory[];
  taskHistory: TaskHistory[];
  settings: ProjectSettings;
  createdAt: Date;
  lastModified: Date;
}

export interface ProjectSettings {
  autoRemoveParticipants: boolean;
  animationDuration: number;
  allowDuplicateParticipantsInTask: boolean; // For multi-participant tasks
}

// Project Manager State
export interface ProjectManagerState {
  projects: Project[];
  activeProjectId: string | null;
  isSpinning: boolean;
  selectedParticipant?: Participant;
  selectedTask?: Task;
  selectedParticipants?: Participant[]; // For multi-participant task results
}

// Team Manager Props
export interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (name: string, description?: string) => void;
  onRemoveTeam: (id: string) => void;
  onEditTeam: (id: string, name: string, description?: string) => void;
  onAddMemberToTeam: (teamId: string, participant: Participant) => void;
  onRemoveMemberFromTeam: (teamId: string, participantId: string) => void;
  onImportTeamToProject: (teamId: string) => void;
}

// Project Manager Props
export interface ProjectManagerProps {
  projects: Project[];
  activeProjectId: string | null;
  onCreateProject: (name: string, description?: string) => void;
  onDeleteProject: (id: string) => void;
  onSwitchProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
}