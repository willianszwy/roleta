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

export interface RouletteState {
  participants: Participant[];
  history: RouletteHistory[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  animationDuration: number;
}

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