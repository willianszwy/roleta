import type { Participant, Task, RouletteHistory, TaskHistory, Project, Team } from '../types';
import type { RouletteState } from './RouletteContext';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

export type RouletteAction =
  // Participant actions
  | { type: 'ADD_PARTICIPANT'; payload: { name: string } }
  | { type: 'ADD_PARTICIPANTS_BULK'; payload: { names: string[] } }
  | { type: 'REMOVE_PARTICIPANT'; payload: { id: string } }
  | { type: 'CLEAR_PARTICIPANTS' }
  // Task actions
  | { type: 'ADD_TASK'; payload: { name: string; description?: string; requiredParticipants?: number } }
  | { type: 'ADD_TASKS_BULK'; payload: { taskLines: string[] } }
  | { type: 'REMOVE_TASK'; payload: { id: string } }
  | { type: 'CLEAR_TASKS' }
  // Spin actions
  | { type: 'START_SPIN' }
  | { type: 'SPIN_ROULETTE_REQUEST'; payload: { resolve: (value: Participant | null) => void } }
  | { type: 'SPIN_TASK_ROULETTE_REQUEST'; payload: { resolve: (value: { participants: Participant[]; task: Task } | null) => void } }
  | { type: 'FINISH_SPIN'; payload: { participant?: Participant } }
  | { type: 'FINISH_TASK_SPIN'; payload: { participants?: Participant[]; task?: Task } }
  // History actions
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_TASK_HISTORY' }
  | { type: 'REMOVE_FROM_ROULETTE_AFTER_SPIN'; payload: { participantId: string } }
  | { type: 'RESTORE_PARTICIPANT'; payload: { participantName: string } }
  // Settings actions
  | { type: 'SET_AUTO_REMOVE_PARTICIPANTS'; payload: { enabled: boolean } }
  // Auto-removal action (atomic operation)
  | { type: 'AUTO_REMOVE_PARTICIPANT'; payload: { participantId: string } }
  // Project management actions
  | { type: 'CREATE_PROJECT'; payload: { name: string; description?: string } }
  | { type: 'DELETE_PROJECT'; payload: { id: string } }
  | { type: 'SWITCH_PROJECT'; payload: { id: string } }
  | { type: 'RENAME_PROJECT'; payload: { id: string; name: string } }
  // Team management actions
  | { type: 'ADD_TEAM'; payload: { name: string; description?: string } }
  | { type: 'REMOVE_TEAM'; payload: { id: string } }
  | { type: 'EDIT_TEAM'; payload: { id: string; name: string; description?: string } }
  | { type: 'ADD_MEMBER_TO_TEAM'; payload: { teamId: string; participant: Participant } }
  | { type: 'REMOVE_MEMBER_FROM_TEAM'; payload: { teamId: string; participantId: string } }
  | { type: 'IMPORT_TEAM_TO_PROJECT'; payload: { teamId: string } };

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
      const { name, description, requiredParticipants = 1 } = action.payload;
      if (!name.trim()) return state;

      const newTask: Task = {
        id: generateId(),
        name: name.trim(),
        description: description?.trim() || undefined,
        requiredParticipants: Math.max(1, Math.min(10, requiredParticipants)), // Clamp between 1-10
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
        const [name, description, requiredParticipantsStr] = line.split('|').map(part => part.trim());
        const requiredParticipants = requiredParticipantsStr ? 
          Math.max(1, Math.min(10, parseInt(requiredParticipantsStr, 10) || 1)) : 1;

        return {
          id: generateId(),
          name,
          description: description || undefined,
          requiredParticipants,
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
      const { participants, task } = action.payload;
      
      if (!participants || participants.length === 0 || !task) {
        return {
          ...state,
          isSpinning: false,
        };
      }

      const historyEntry: TaskHistory = {
        id: generateId(),
        participants: participants.map(p => ({ id: p.id, name: p.name })),
        taskId: task.id,
        taskName: task.name,
        taskDescription: task.description,
        selectedAt: new Date(),
      };

      let newState = {
        ...state,
        isSpinning: false,
        selectedParticipants: participants,
        selectedTask: task,
        lastWinner: participants[0], // First participant for compatibility
        taskHistory: [historyEntry, ...state.taskHistory],
      };

      // Auto-remove participants if enabled
      if (state.autoRemoveParticipants) {
        const participantIds = participants.map(p => p.id);
        newState = {
          ...newState,
          participants: newState.participants.filter(p => !participantIds.includes(p.id)),
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
        
        // Select multiple participants for task
        const requiredCount = currentTask.requiredParticipants || 1;
        const availableParticipants = [...state.participants];
        const selectedParticipants: Participant[] = [];
        
        for (let i = 0; i < requiredCount && availableParticipants.length > 0; i++) {
          const selected = selectRandomParticipant(availableParticipants);
          if (selected) {
            selectedParticipants.push(selected);
            // Remove from available to avoid duplicates (unless allowed)
            if (!state.allowDuplicateParticipantsInTask) {
              const index = availableParticipants.findIndex(p => p.id === selected.id);
              if (index !== -1) {
                availableParticipants.splice(index, 1);
              }
            }
          }
        }
        
        if (selectedParticipants.length === 0) {
          resolve(null);
        } else {
          resolve({ participants: selectedParticipants, task: currentTask });
        }
      }, 0);

      return newState;
    }

    // Project Management Cases
    case 'CREATE_PROJECT': {
      const { name, description } = action.payload;
      if (!name.trim()) return state;

      const newProject: Project = {
        id: generateId(),
        name: name.trim(),
        description: description?.trim() || undefined,
        participants: [],
        tasks: [],
        teams: [],
        history: [],
        taskHistory: [],
        settings: {
          autoRemoveParticipants: false,
          animationDuration: 3000,
          allowDuplicateParticipantsInTask: false,
        },
        createdAt: new Date(),
        lastModified: new Date(),
      };

      return {
        ...state,
        projects: [...state.projects, newProject],
        activeProjectId: newProject.id,
        // Reset current state to new project
        participants: [],
        tasks: [],
        history: [],
        taskHistory: [],
        autoRemoveParticipants: false,
        animationDuration: 3000,
      };
    }

    case 'DELETE_PROJECT': {
      const { id } = action.payload;
      const updatedProjects = state.projects.filter(p => p.id !== id);
      
      let newActiveProjectId = state.activeProjectId;
      let newCurrentState = {
        participants: state.participants,
        tasks: state.tasks,
        history: state.history,
        taskHistory: state.taskHistory,
        autoRemoveParticipants: state.autoRemoveParticipants,
        animationDuration: state.animationDuration,
      };

      // If we deleted the active project, switch to first available or reset
      if (state.activeProjectId === id) {
        if (updatedProjects.length > 0) {
          const firstProject = updatedProjects[0];
          newActiveProjectId = firstProject.id;
          newCurrentState = {
            participants: firstProject.participants,
            tasks: firstProject.tasks,
            history: firstProject.history,
            taskHistory: firstProject.taskHistory,
            autoRemoveParticipants: firstProject.settings.autoRemoveParticipants,
            animationDuration: firstProject.settings.animationDuration,
          };
        } else {
          newActiveProjectId = null;
          newCurrentState = {
            participants: [],
            tasks: [],
            history: [],
            taskHistory: [],
            autoRemoveParticipants: false,
            animationDuration: 3000,
          };
        }
      }

      return {
        ...state,
        projects: updatedProjects,
        activeProjectId: newActiveProjectId,
        ...newCurrentState,
      };
    }

    case 'SWITCH_PROJECT': {
      const { id } = action.payload;
      const project = state.projects.find(p => p.id === id);
      
      if (!project) return state;

      return {
        ...state,
        activeProjectId: id,
        participants: project.participants,
        tasks: project.tasks,
        history: project.history,
        taskHistory: project.taskHistory,
        autoRemoveParticipants: project.settings.autoRemoveParticipants,
        animationDuration: project.settings.animationDuration,
      };
    }

    case 'RENAME_PROJECT': {
      const { id, name } = action.payload;
      if (!name.trim()) return state;

      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === id
            ? { ...project, name: name.trim(), lastModified: new Date() }
            : project
        ),
      };
    }

    // Team Management Cases
    case 'ADD_TEAM': {
      const { name, description } = action.payload;
      if (!name.trim()) return state;

      const newTeam: Team = {
        id: generateId(),
        name: name.trim(),
        description: description?.trim() || undefined,
        members: [],
        color: getRandomColor(),
        createdAt: new Date(),
      };

      return {
        ...state,
        globalTeams: [...state.globalTeams, newTeam],
      };
    }

    case 'REMOVE_TEAM': {
      const { id } = action.payload;
      return {
        ...state,
        globalTeams: state.globalTeams.filter(t => t.id !== id),
      };
    }

    case 'EDIT_TEAM': {
      const { id, name, description } = action.payload;
      if (!name.trim()) return state;

      return {
        ...state,
        globalTeams: state.globalTeams.map(team =>
          team.id === id
            ? { ...team, name: name.trim(), description: description?.trim() || undefined }
            : team
        ),
      };
    }

    case 'ADD_MEMBER_TO_TEAM': {
      const { teamId, participant } = action.payload;
      
      return {
        ...state,
        globalTeams: state.globalTeams.map(team =>
          team.id === teamId
            ? { ...team, members: [...team.members, participant] }
            : team
        ),
      };
    }

    case 'REMOVE_MEMBER_FROM_TEAM': {
      const { teamId, participantId } = action.payload;
      
      return {
        ...state,
        globalTeams: state.globalTeams.map(team =>
          team.id === teamId
            ? { ...team, members: team.members.filter(m => m.id !== participantId) }
            : team
        ),
      };
    }

    case 'IMPORT_TEAM_TO_PROJECT': {
      const { teamId } = action.payload;
      const team = state.globalTeams.find(t => t.id === teamId);
      
      if (!team || !state.activeProjectId) return state;

      // Add team members to current project participants
      const existingNames = state.participants.map(p => p.name.toLowerCase());
      const newParticipants = team.members.filter(member => 
        !existingNames.includes(member.name.toLowerCase())
      );

      const updatedParticipants = [...state.participants, ...newParticipants];

      // Update the active project
      const updatedProjects = state.projects.map(project =>
        project.id === state.activeProjectId
          ? { ...project, participants: updatedParticipants, lastModified: new Date() }
          : project
      );

      return {
        ...state,
        participants: updatedParticipants,
        projects: updatedProjects,
      };
    }

    default:
      return state;
  }
}