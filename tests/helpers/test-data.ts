import participantsData from '../fixtures/participants.json';
import tasksData from '../fixtures/tasks.json';

export interface TestParticipant {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface TestTask {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export class TestDataGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static getRandomColor(): string {
    const colors = [
      '#667eea', '#8b5cf6', '#a855f7', '#4facfe', '#00f2fe',
      '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308',
      '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  static generateParticipants(count: number): TestParticipant[] {
    const participants: TestParticipant[] = [];
    const shuffled = [...participantsData].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      participants.push({
        id: this.generateId(),
        name: shuffled[i],
        color: this.getRandomColor(),
        createdAt: new Date()
      });
    }
    
    return participants;
  }

  static generateTasks(count: number): TestTask[] {
    const tasks: TestTask[] = [];
    const shuffled = [...tasksData].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      tasks.push({
        id: this.generateId(),
        name: shuffled[i],
        description: i % 3 === 0 ? `Descrição detalhada da tarefa: ${shuffled[i]}` : undefined,
        color: this.getRandomColor(),
        createdAt: new Date()
      });
    }
    
    return tasks;
  }

  static createScenario(type: 'small' | 'medium' | 'large' | 'edge' | 'stress') {
    switch (type) {
      case 'small':
        return {
          participants: this.generateParticipants(3),
          tasks: this.generateTasks(5)
        };
      case 'medium':
        return {
          participants: this.generateParticipants(10),
          tasks: this.generateTasks(15)
        };
      case 'large':
        return {
          participants: this.generateParticipants(25),
          tasks: this.generateTasks(20)
        };
      case 'edge':
        return {
          participants: this.generateParticipants(1),
          tasks: this.generateTasks(1)
        };
      case 'stress':
        return {
          participants: this.generateParticipants(26), // All available
          tasks: this.generateTasks(20) // All available
        };
      default:
        return this.createScenario('medium');
    }
  }
}

export const TEST_SCENARIOS = {
  SMALL: 'small' as const,
  MEDIUM: 'medium' as const,
  LARGE: 'large' as const,
  EDGE: 'edge' as const,
  STRESS: 'stress' as const
};

export const SELECTORS = {
  // Header
  HEADER: 'header',
  TITLE: 'h1:has-text("LuckyWheel")',
  MENU_BUTTON: 'button:has-text("☰")',
  
  // Roulette
  ROULETTE_CONTAINER: '[data-testid="roulette-container"]',
  ROULETTE_WHEEL: 'svg[viewBox]',
  SPIN_BUTTON: 'button:has-text("Girar")',
  SPIN_BUTTON_TASK: 'button:has-text("Sortear Tarefa")',
  
  // Side Panel
  SIDE_PANEL: '[data-testid="side-panel"]',
  NAV_PARTICIPANTS: 'button:has-text("Participantes")',
  NAV_TASKS: 'button:has-text("Tarefas")',
  NAV_HISTORY: 'button:has-text("Histórico")',
  NAV_SETTINGS: 'button:has-text("Config")',
  
  // Participant Management
  PARTICIPANT_INPUT: 'input[placeholder*="participante"]',
  ADD_PARTICIPANT_BUTTON: 'button:has-text("Adicionar")',
  PARTICIPANT_LIST_ITEM: '[data-testid="participant-item"]',
  BULK_TEXTAREA: 'textarea[placeholder*="bulk"]',
  
  // Task Management  
  TASK_INPUT: 'input[placeholder*="tarefa"]',
  TASK_DESCRIPTION_INPUT: 'input[placeholder*="descrição"]',
  ADD_TASK_BUTTON: 'button:has-text("Adicionar Tarefa")',
  TASK_LIST_ITEM: '[data-testid="task-item"]',
  
  // Winner Modal
  WINNER_MODAL: '[data-testid="winner-modal"]',
  MODAL_TITLE: 'h1:has-text("VENCEDOR"), h1:has-text("TAREFA SORTEADA")',
  MODAL_WINNER_NAME: '[data-testid="winner-name"]',
  MODAL_TASK_NAME: '[data-testid="task-name"]',
  MODAL_CLOSE_BUTTON: 'button:has-text("Fechar")',
  
  // Settings
  SETTING_TOGGLE_MODE: 'input[type="checkbox"]',
  SETTING_AUTO_REMOVE: 'input[type="checkbox"]',
  SETTING_SHOW_MODAL: 'input[type="checkbox"]',
  SETTING_DURATION: 'input[type="number"]',
  
  // History
  HISTORY_LIST: '[data-testid="history-list"]',
  HISTORY_ITEM: '[data-testid="history-item"]',
  CLEAR_HISTORY_BUTTON: 'button:has-text("Limpar")',
} as const;

export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  ANIMATION: 5000, // Roulette animation duration
  LONG: 10000,
} as const;