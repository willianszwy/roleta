import type { Participant, Task, RouletteHistory, TaskHistory } from '../types';
import type { RouletteState } from './RouletteContext';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

export type RouletteAction =
  // Participant actions
  | { type: 'ADD_PARTICIPANT'; payload: { name: string } }
  | { type: 'ADD_PARTICIPANTS_BULK'; payload: { names: string[] } }
  | { type: 'REMOVE_PARTICIPANT'; payload: { id: string } }
  | { type: 'CLEAR_PARTICIPANTS' }
  // Task actions
  | { type: 'ADD_TASK'; payload: { name: string; description?: string } }
  | { type: 'ADD_TASKS_BULK'; payload: { taskLines: string[] } }
  | { type: 'REMOVE_TASK'; payload: { id: string } }
  | { type: 'CLEAR_TASKS' }
  // Spin actions
  | { type: 'START_SPIN' }
  | { type: 'SPIN_ROULETTE_REQUEST'; payload: { resolve: (value: Participant | null) => void } }
  | { type: 'SPIN_TASK_ROULETTE_REQUEST'; payload: { resolve: (value: { participant: Participant; task: Task } | null) => void } }
  | { type: 'FINISH_SPIN'; payload: { participant?: Participant } }
  | { type: 'FINISH_TASK_SPIN'; payload: { participant?: Participant; task?: Task } }
  // History actions
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_TASK_HISTORY' }
  | { type: 'REMOVE_FROM_ROULETTE_AFTER_SPIN'; payload: { participantId: string } }
  | { type: 'RESTORE_PARTICIPANT'; payload: { participantName: string } }
  // Settings actions
  | { type: 'SET_AUTO_REMOVE_PARTICIPANTS'; payload: { enabled: boolean } }
  // Auto-removal action (atomic operation)
  | { type: 'AUTO_REMOVE_PARTICIPANT'; payload: { participantId: string } };

export function rouletteReducer(state: RouletteState, action: RouletteAction): RouletteState {
  switch (action.type) {
    case 'ADD_PARTICIPANT': {
      const { name } = action.payload;
      if (!name.trim()) return state;

      const trimmedName = name.trim();
      const existingNames = state.participants.map(p => p.name.toLowerCase());
      let finalName = trimmedName;

      // Handle duplicate names
      if (existingNames.includes(trimmedName.toLowerCase())) {
        let counter = 2;
        while (existingNames.includes(`${trimmedName} (${counter})`.toLowerCase())) {
          counter++;
        }
        finalName = `${trimmedName} (${counter})`;
      }

      const newParticipant: Participant = {
        id: generateId(),
        name: finalName,
        color: getRandomColor(),
        createdAt: new Date(),
      };

      return {
        ...state,
        participants: [...state.participants, newParticipant],
      };
    }

    case 'ADD_PARTICIPANTS_BULK': {
      const { names } = action.payload;
      if (names.length === 0) return state;

      const existingNames = state.participants.map(p => p.name.toLowerCase());
      const newParticipants: Participant[] = [];
      const usedNames = [...existingNames];

      names.forEach(name => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        let finalName = trimmedName;

        // Handle duplicate names
        if (usedNames.includes(trimmedName.toLowerCase())) {
          let counter = 2;
          while (usedNames.includes(`${trimmedName} (${counter})`.toLowerCase())) {
            counter++;
          }
          finalName = `${trimmedName} (${counter})`;
        }

        usedNames.push(finalName.toLowerCase());

        const newParticipant: Participant = {
          id: generateId(),
          name: finalName,
          color: getRandomColor(),
          createdAt: new Date(),
        };

        newParticipants.push(newParticipant);
      });

      return {
        ...state,
        participants: [...state.participants, ...newParticipants],
      };
    }

    case 'REMOVE_PARTICIPANT': {
      const { id } = action.payload;
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== id),
      };
    }

    case 'CLEAR_PARTICIPANTS': {
      return {
        ...state,
        participants: [],
      };
    }

    case 'ADD_TASK': {
      const { name, description } = action.payload;
      if (!name.trim()) return state;

      const newTask: Task = {
        id: generateId(),
        name: name.trim(),
        description: description?.trim() || undefined,
        color: getRandomColor(),
        createdAt: new Date(),
      };

      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'ADD_TASKS_BULK': {
      const { taskLines } = action.payload;
      const validTasks = taskLines
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (validTasks.length === 0) return state;

      const newTasks: Task[] = validTasks.map(line => {
        const [name, description] = line.split('|').map(part => part.trim());

        return {
          id: generateId(),
          name,
          description: description || undefined,
          color: getRandomColor(),
          createdAt: new Date(),
        };
      });

      return {
        ...state,
        tasks: [...state.tasks, ...newTasks],
      };
    }

    case 'REMOVE_TASK': {
      const { id } = action.payload;
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== id),
      };
    }

    case 'CLEAR_TASKS': {
      return {
        ...state,
        tasks: [],
      };
    }

    case 'START_SPIN': {
      return {
        ...state,
        isSpinning: true,
        selectedParticipant: undefined,
        selectedTask: undefined,
      };
    }

    case 'FINISH_SPIN': {
      const { participant } = action.payload;
      
      if (!participant) {
        return {
          ...state,
          isSpinning: false,
        };
      }

      const historyEntry: RouletteHistory = {
        id: generateId(),
        participantId: participant.id,
        participantName: participant.name,
        selectedAt: new Date(),
        removed: false,
      };

      return {
        ...state,
        isSpinning: false,
        selectedParticipant: participant,
        lastWinner: participant,
        history: [historyEntry, ...state.history],
      };
    }

    case 'FINISH_TASK_SPIN': {
      const { participant, task } = action.payload;
      
      if (!participant || !task) {
        return {
          ...state,
          isSpinning: false,
        };
      }

      const historyEntry: TaskHistory = {
        id: generateId(),
        participantId: participant.id,
        participantName: participant.name,
        taskId: task.id,
        taskName: task.name,
        taskDescription: task.description,
        selectedAt: new Date(),
      };

      let newState = {
        ...state,
        isSpinning: false,
        selectedParticipant: participant,
        selectedTask: task,
        lastWinner: participant,
        taskHistory: [historyEntry, ...state.taskHistory],
      };

      // Auto-remove participant if enabled
      if (state.autoRemoveParticipants) {
        newState = {
          ...newState,
          participants: newState.participants.filter(p => p.id !== participant.id),
        };
      }

      return newState;
    }

    case 'AUTO_REMOVE_PARTICIPANT': {
      const { participantId } = action.payload;
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== participantId),
      };
    }

    case 'CLEAR_HISTORY': {
      return {
        ...state,
        history: [],
      };
    }

    case 'CLEAR_TASK_HISTORY': {
      return {
        ...state,
        taskHistory: [],
      };
    }

    case 'REMOVE_FROM_ROULETTE_AFTER_SPIN': {
      const { participantId } = action.payload;
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== participantId),
        history: state.history.map(h =>
          h.participantId === participantId && !h.removed
            ? { ...h, removed: true }
            : h
        ),
      };
    }

    case 'RESTORE_PARTICIPANT': {
      const { participantName } = action.payload;
      const historyEntry = state.history.find(h => h.participantName === participantName && h.removed);

      const newParticipant: Participant = {
        id: generateId(),
        name: participantName,
        color: getRandomColor(),
        createdAt: new Date(),
      };

      return {
        ...state,
        participants: [...state.participants, newParticipant],
        history: historyEntry
          ? state.history.map(h =>
              h.id === historyEntry.id
                ? { ...h, removed: false }
                : h
            )
          : state.history,
      };
    }

    case 'SET_AUTO_REMOVE_PARTICIPANTS': {
      const { enabled } = action.payload;
      return {
        ...state,
        autoRemoveParticipants: enabled,
      };
    }

    case 'SPIN_ROULETTE_REQUEST': {
      const { resolve } = action.payload;
      
      if (state.participants.length === 0 || state.isSpinning) {
        resolve(null);
        return state;
      }

      const newState = {
        ...state,
        isSpinning: true,
        selectedParticipant: undefined,
        selectedTask: undefined,
      };

      setTimeout(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const selected = selectRandomParticipant(state.participants);
        resolve(selected);
      }, 0);

      return newState;
    }

    case 'SPIN_TASK_ROULETTE_REQUEST': {
      const { resolve } = action.payload;
      
      if (state.participants.length === 0 || state.tasks.length === 0 || state.isSpinning) {
        resolve(null);
        return state;
      }

      // Get current task (first pending task)
      const pendingTasks = state.tasks.filter(task =>
        !state.taskHistory.some(history => history.taskId === task.id)
      );
      
      if (pendingTasks.length === 0) {
        resolve(null);
        return state;
      }

      const currentTask = pendingTasks[0];
      const newState = {
        ...state,
        isSpinning: true,
        selectedParticipant: undefined,
        selectedTask: undefined,
      };

      setTimeout(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const selectedParticipant = selectRandomParticipant(state.participants);
        if (!selectedParticipant) {
          resolve(null);
        } else {
          resolve({ participant: selectedParticipant, task: currentTask });
        }
      }, 0);

      return newState;
    }

    default:
      return state;
  }
}