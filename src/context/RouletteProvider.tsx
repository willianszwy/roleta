import { useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { RouletteContext } from './RouletteContext';
import type { RouletteState, RouletteActions } from './RouletteContext';
import { rouletteReducer } from './RouletteReducer';
import type { Participant, Task } from '../types';

// Storage keys
const PARTICIPANTS_KEY = 'roulette-participants';
const TASKS_KEY = 'task-roulette-tasks';
const HISTORY_KEY = 'roulette-history';
const TASK_HISTORY_KEY = 'task-roulette-history';
const SETTINGS_KEY = 'roulette-settings';

// Storage utilities
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item, (_key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

// Initial state
const initialState: RouletteState = {
  participants: [],
  tasks: [],
  history: [],
  taskHistory: [],
  isSpinning: false,
  selectedParticipant: undefined,
  selectedTask: undefined,
  autoRemoveParticipants: false,
  animationDuration: 3000,
  lastWinner: undefined,
};

interface RouletteProviderProps {
  children: ReactNode;
}

export function RouletteProvider({ children }: RouletteProviderProps) {
  // Load initial state from localStorage
  const loadInitialState = (): RouletteState => {
    const participants = loadFromStorage(PARTICIPANTS_KEY, []);
    const tasks = loadFromStorage(TASKS_KEY, []);
    const history = loadFromStorage(HISTORY_KEY, []);
    const taskHistory = loadFromStorage(TASK_HISTORY_KEY, []);
    const settings = loadFromStorage(SETTINGS_KEY, { autoRemoveParticipants: false });

    return {
      ...initialState,
      participants,
      tasks,
      history,
      taskHistory,
      autoRemoveParticipants: settings.autoRemoveParticipants,
    };
  };

  const [state, dispatch] = useReducer(rouletteReducer, initialState, loadInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(PARTICIPANTS_KEY, state.participants);
  }, [state.participants]);

  useEffect(() => {
    saveToStorage(TASKS_KEY, state.tasks);
  }, [state.tasks]);

  useEffect(() => {
    saveToStorage(HISTORY_KEY, state.history);
  }, [state.history]);

  useEffect(() => {
    saveToStorage(TASK_HISTORY_KEY, state.taskHistory);
  }, [state.taskHistory]);

  useEffect(() => {
    saveToStorage(SETTINGS_KEY, { autoRemoveParticipants: state.autoRemoveParticipants });
  }, [state.autoRemoveParticipants]);

  // Actions
  const actions: RouletteActions = useMemo(() => ({
    // Participant actions
    addParticipant: (name: string) => {
      dispatch({ type: 'ADD_PARTICIPANT', payload: { name } });
    },

    addParticipantsBulk: (names: string[]) => {
      dispatch({ type: 'ADD_PARTICIPANTS_BULK', payload: { names } });
    },

    removeParticipant: (id: string) => {
      dispatch({ type: 'REMOVE_PARTICIPANT', payload: { id } });
    },

    clearParticipants: () => {
      dispatch({ type: 'CLEAR_PARTICIPANTS' });
    },

    // Task actions
    addTask: (name: string, description?: string) => {
      dispatch({ type: 'ADD_TASK', payload: { name, description } });
    },

    addTasksBulk: (taskLines: string[]) => {
      dispatch({ type: 'ADD_TASKS_BULK', payload: { taskLines } });
    },

    removeTask: (id: string) => {
      dispatch({ type: 'REMOVE_TASK', payload: { id } });
    },

    clearTasks: () => {
      dispatch({ type: 'CLEAR_TASKS' });
    },

    // Spin actions
    spinRoulette: async (): Promise<Participant | null> => {
      return new Promise((resolve) => {
        dispatch({ type: 'SPIN_ROULETTE_REQUEST', payload: { resolve } });
      });
    },

    spinTaskRoulette: async (): Promise<{ participant: Participant; task: Task } | null> => {
      return new Promise((resolve) => {
        dispatch({ type: 'SPIN_TASK_ROULETTE_REQUEST', payload: { resolve } });
      });
    },

    finishSpin: (selectedParticipant?: Participant) => {
      dispatch({ type: 'FINISH_SPIN', payload: { participant: selectedParticipant } });
    },

    finishTaskSpin: (selectedParticipant?: Participant, selectedTask?: Task) => {
      dispatch({ type: 'FINISH_TASK_SPIN', payload: { participant: selectedParticipant, task: selectedTask } });
    },

    // History actions
    clearHistory: () => {
      dispatch({ type: 'CLEAR_HISTORY' });
    },

    clearTaskHistory: () => {
      dispatch({ type: 'CLEAR_TASK_HISTORY' });
    },

    removeFromRouletteAfterSpin: (participantId: string) => {
      dispatch({ type: 'REMOVE_FROM_ROULETTE_AFTER_SPIN', payload: { participantId } });
    },

    restoreParticipant: (participantName: string) => {
      dispatch({ type: 'RESTORE_PARTICIPANT', payload: { participantName } });
    },

    // Settings actions
    setAutoRemoveParticipants: (enabled: boolean) => {
      dispatch({ type: 'SET_AUTO_REMOVE_PARTICIPANTS', payload: { enabled } });
    },

    // Utility actions
    getCurrentTask: () => {
      return state.tasks.find(task =>
        !state.taskHistory.some(history => history.taskId === task.id)
      );
    },
  }), [state.tasks, state.taskHistory]);

  const contextValue = useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <RouletteContext.Provider value={contextValue}>
      {children}
    </RouletteContext.Provider>
  );
}