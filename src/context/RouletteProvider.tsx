import { useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { RouletteContext } from './RouletteContext';
import type { RouletteState, RouletteActions } from './RouletteContext';
import { rouletteReducer } from './RouletteReducer';
import { DropdownProvider } from './DropdownContext';
import type { Participant, Task, Project, TaskHistory } from '../types';

// Storage keys (only project-based system)
const PROJECTS_KEY = 'roulette-projects';
const GLOBAL_TEAMS_KEY = 'roulette-global-teams';
const ACTIVE_PROJECT_KEY = 'roulette-active-project';
const MIGRATION_COMPLETE_KEY = 'roulette-migration-complete';

// Legacy keys for one-time migration
const LEGACY_PARTICIPANTS_KEY = 'roulette-participants';
const LEGACY_TASKS_KEY = 'task-roulette-tasks';
const LEGACY_HISTORY_KEY = 'roulette-history';
const LEGACY_TASK_HISTORY_KEY = 'task-roulette-history';
const LEGACY_SETTINGS_KEY = 'roulette-settings';

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
  // Project Manager State
  projects: [],
  activeProjectId: null,
  isSpinning: false,
  selectedParticipant: undefined,
  selectedTask: undefined,
  selectedParticipants: undefined,
  
  // Global teams (shared across projects)
  globalTeams: [],
  
  // Current active project data (for backward compatibility)
  participants: [],
  tasks: [],
  history: [],
  taskHistory: [],
  
  // Settings from active project
  autoRemoveParticipants: false,
  animationDuration: 3000,
  allowDuplicateParticipantsInTask: false,
  
  // Last winner tracking for auto-removal
  lastWinner: undefined,
  
  // Multi-participant task state
  currentTaskSpin: undefined,
};

interface RouletteProviderProps {
  children: ReactNode;
}

export function RouletteProvider({ children }: RouletteProviderProps) {
  // Load initial state from localStorage
  const loadInitialState = (): RouletteState => {
    let projects: Project[] = loadFromStorage(PROJECTS_KEY, []);
    const globalTeams = loadFromStorage(GLOBAL_TEAMS_KEY, []);
    let activeProjectId: string | null = loadFromStorage(ACTIVE_PROJECT_KEY, null);
    
    const migrationComplete = loadFromStorage(MIGRATION_COMPLETE_KEY, false);
    
    // One-time legacy data migration
    if (!migrationComplete) {
      const legacyParticipants = loadFromStorage(LEGACY_PARTICIPANTS_KEY, []);
      const legacyTasksRaw = loadFromStorage(LEGACY_TASKS_KEY, []);
      const legacyHistory = loadFromStorage(LEGACY_HISTORY_KEY, []);
      const legacyTaskHistoryRaw = loadFromStorage(LEGACY_TASK_HISTORY_KEY, []);
      const legacySettings = loadFromStorage(LEGACY_SETTINGS_KEY, { autoRemoveParticipants: false });

    // Migrate legacy tasks to include requiredParticipants
    const legacyTasks = legacyTasksRaw.map((task: Partial<Task> & { id: string; name: string; description?: string }) => ({
      ...task,
      requiredParticipants: task.requiredParticipants || 1,
      createdAt: task.createdAt || new Date(),
    }));

    // Migrate legacy task history to new format  
    const legacyTaskHistory = legacyTaskHistoryRaw.map((item: any) => {
      if (item.participants) {
        return item; // Already in new format
      }
      // Convert old format to new format
      return {
        id: item.id,
        taskId: item.task?.id || 'unknown',
        taskName: item.task?.name || 'Unknown Task',
        taskDescription: item.task?.description,
        selectedAt: item.timestamp,
        participants: [{
          id: item.participantId || 'unknown',
          name: item.participantName || 'Unknown'
        }],
      } as TaskHistory;
    });

      // Create default project if legacy data exists or no projects exist
      if (projects.length === 0) {
        const defaultProject: Project = {
          id: 'default-project',
          name: legacyParticipants.length > 0 || legacyTasks.length > 0 ? 'Projeto Principal' : 'Meu Primeiro Projeto',
          description: legacyParticipants.length > 0 || legacyTasks.length > 0 ? 'Projeto migrado dos dados anteriores' : 'Comece adicionando participantes e tarefas',
          participants: legacyParticipants,
          tasks: legacyTasks,
          teams: [],
          history: legacyHistory,
          taskHistory: legacyTaskHistory,
          settings: {
            autoRemoveParticipants: legacySettings.autoRemoveParticipants || false,
            animationDuration: 3000,
            allowDuplicateParticipantsInTask: false,
          },
          createdAt: new Date(),
          lastModified: new Date(),
        };
        
        projects = [defaultProject];
        activeProjectId = defaultProject.id;
      }
      
      // Save migrated data and mark migration complete
      saveToStorage(PROJECTS_KEY, projects);
      saveToStorage(ACTIVE_PROJECT_KEY, activeProjectId);
      saveToStorage(MIGRATION_COMPLETE_KEY, true);
      
      // Clean up legacy keys
      localStorage.removeItem(LEGACY_PARTICIPANTS_KEY);
      localStorage.removeItem(LEGACY_TASKS_KEY);
      localStorage.removeItem(LEGACY_HISTORY_KEY);
      localStorage.removeItem(LEGACY_TASK_HISTORY_KEY);
      localStorage.removeItem(LEGACY_SETTINGS_KEY);
    }

    // Get active project data
    const activeProject = projects.find(p => p.id === activeProjectId);
    const currentProjectData = activeProject ? {
      participants: activeProject.participants,
      tasks: activeProject.tasks,
      history: activeProject.history,
      taskHistory: activeProject.taskHistory,
      autoRemoveParticipants: activeProject.settings.autoRemoveParticipants,
      animationDuration: activeProject.settings.animationDuration,
      allowDuplicateParticipantsInTask: activeProject.settings.allowDuplicateParticipantsInTask,
    } : {
      participants: [],
      tasks: [],
      history: [],
      taskHistory: [],
      autoRemoveParticipants: false,
      animationDuration: 3000,
      allowDuplicateParticipantsInTask: false,
    };

    return {
      ...initialState,
      projects,
      activeProjectId,
      globalTeams,
      ...currentProjectData,
    };
  };

  const [state, dispatch] = useReducer(rouletteReducer, initialState, loadInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(PROJECTS_KEY, state.projects);
  }, [state.projects]);

  useEffect(() => {
    saveToStorage(GLOBAL_TEAMS_KEY, state.globalTeams);
  }, [state.globalTeams]);

  useEffect(() => {
    saveToStorage(ACTIVE_PROJECT_KEY, state.activeProjectId);
  }, [state.activeProjectId]);

  // No more legacy storage - everything is project-based now

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
    addTask: (name: string, description?: string, requiredParticipants?: number) => {
      dispatch({ type: 'ADD_TASK', payload: { name, description, requiredParticipants } });
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

    spinTaskRoulette: async (): Promise<{ participants: Participant[]; task: Task } | null> => {
      return new Promise((resolve) => {
        dispatch({ type: 'SPIN_TASK_ROULETTE_REQUEST', payload: { resolve } });
      });
    },

    finishSpin: (selectedParticipant?: Participant) => {
      dispatch({ type: 'FINISH_SPIN', payload: { participant: selectedParticipant } });
    },

    finishTaskSpin: (selectedParticipants?: Participant[], selectedTask?: Task) => {
      dispatch({ type: 'FINISH_TASK_SPIN', payload: { participants: selectedParticipants, task: selectedTask } });
    },

    // Multi-participant task spin actions
    startMultiParticipantTaskSpin: (task: Task) => {
      dispatch({ type: 'START_MULTI_PARTICIPANT_TASK_SPIN', payload: { task } });
    },

    finishSingleParticipantSpin: (participant: Participant) => {
      dispatch({ type: 'FINISH_SINGLE_PARTICIPANT_SPIN', payload: { participant } });
    },

    completeMultiParticipantTaskSpin: () => {
      dispatch({ type: 'COMPLETE_MULTI_PARTICIPANT_TASK_SPIN' });
    },

    cancelMultiParticipantTaskSpin: () => {
      dispatch({ type: 'CANCEL_MULTI_PARTICIPANT_TASK_SPIN' });
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

    // Project management actions
    createProject: (name: string, description?: string) => {
      dispatch({ type: 'CREATE_PROJECT', payload: { name, description } });
    },

    deleteProject: (id: string) => {
      dispatch({ type: 'DELETE_PROJECT', payload: { id } });
    },

    switchProject: (id: string) => {
      dispatch({ type: 'SWITCH_PROJECT', payload: { id } });
    },

    renameProject: (id: string, name: string) => {
      dispatch({ type: 'RENAME_PROJECT', payload: { id, name } });
    },

    // Team management actions
    addTeam: (name: string, description?: string) => {
      dispatch({ type: 'ADD_TEAM', payload: { name, description } });
    },

    removeTeam: (id: string) => {
      dispatch({ type: 'REMOVE_TEAM', payload: { id } });
    },

    editTeam: (id: string, name: string, description?: string) => {
      dispatch({ type: 'EDIT_TEAM', payload: { id, name, description } });
    },

    addMemberToTeam: (teamId: string, participant: Participant) => {
      dispatch({ type: 'ADD_MEMBER_TO_TEAM', payload: { teamId, participant } });
    },

    removeMemberFromTeam: (teamId: string, participantId: string) => {
      dispatch({ type: 'REMOVE_MEMBER_FROM_TEAM', payload: { teamId, participantId } });
    },

    importTeamToProject: (teamId: string) => {
      dispatch({ type: 'IMPORT_TEAM_TO_PROJECT', payload: { teamId } });
    },

    // Utility actions
    getCurrentTask: (currentState: RouletteState) => {
      return currentState.tasks.find(task =>
        !currentState.taskHistory.some(history => history.taskId === task.id)
      );
    },

    getActiveProject: (currentState: RouletteState) => {
      return currentState.projects.find(p => p.id === currentState.activeProjectId);
    },
  }), [dispatch]);

  const contextValue = useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <DropdownProvider>
      <RouletteContext.Provider value={contextValue}>
        {children}
      </RouletteContext.Provider>
    </DropdownProvider>
  );
}