import { rouletteReducer } from '../RouletteReducer';
import type { RouletteAction } from '../RouletteReducer';
import type { RouletteState } from '../RouletteContext';
import type { Project, Team, Task, Participant } from '../../types';

describe('RouletteReducer', () => {
  const initialState: RouletteState = {
    projects: [],
    activeProjectId: null,
    globalTeams: [],
    participants: [],
    tasks: [],
    history: [],
    taskHistory: [],
    isSpinning: false,
    selectedParticipant: undefined,
    selectedTask: undefined,
    selectedParticipants: undefined,
    autoRemoveParticipants: false,
    animationDuration: 3000,
    allowDuplicateParticipantsInTask: false,
    lastWinner: undefined,
  };

  const mockProject: Project = {
    id: 'project-1',
    name: 'Test Project',
    description: 'Test Description',
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

  const mockParticipant: Participant = {
    id: 'participant-1',
    name: 'John Doe',
    createdAt: new Date(),
  };

  const mockTask: Task = {
    id: 'task-1',
    name: 'Test Task',
    description: 'Test Description',
    requiredParticipants: 1,
    createdAt: new Date(),
  };

  const mockTeam: Team = {
    id: 'team-1',
    name: 'Test Team',
    description: 'Test Description',
    members: [],
    createdAt: new Date(),
  };

  describe('Project Management', () => {
    it('should create a new project', () => {
      const action: RouletteAction = {
        type: 'CREATE_PROJECT',
        payload: { name: 'New Project', description: 'New Description' },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].name).toBe('New Project');
      expect(result.projects[0].description).toBe('New Description');
      expect(result.activeProjectId).toBe(result.projects[0].id);
    });

    it('should delete a project', () => {
      const stateWithProject = {
        ...initialState,
        projects: [mockProject],
        activeProjectId: mockProject.id,
      };

      const action: RouletteAction = {
        type: 'DELETE_PROJECT',
        payload: { id: mockProject.id },
      };

      const result = rouletteReducer(stateWithProject, action);

      expect(result.projects).toHaveLength(0);
      expect(result.activeProjectId).toBeNull();
    });

    it('should switch to a different project', () => {
      const project2: Project = { ...mockProject, id: 'project-2', name: 'Project 2' };
      const stateWithProjects = {
        ...initialState,
        projects: [mockProject, project2],
        activeProjectId: mockProject.id,
      };

      const action: RouletteAction = {
        type: 'SWITCH_PROJECT',
        payload: { id: project2.id },
      };

      const result = rouletteReducer(stateWithProjects, action);

      expect(result.activeProjectId).toBe(project2.id);
    });

    it('should rename a project', () => {
      const stateWithProject = {
        ...initialState,
        projects: [mockProject],
      };

      const action: RouletteAction = {
        type: 'RENAME_PROJECT',
        payload: { id: mockProject.id, name: 'Renamed Project' },
      };

      const result = rouletteReducer(stateWithProject, action);

      expect(result.projects[0].name).toBe('Renamed Project');
    });
  });

  describe('Team Management', () => {
    it('should add a global team', () => {
      const action: RouletteAction = {
        type: 'ADD_TEAM',
        payload: { name: 'New Team', description: 'New Description' },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.globalTeams).toHaveLength(1);
      expect(result.globalTeams[0].name).toBe('New Team');
    });

    it('should remove a global team', () => {
      const stateWithTeam = {
        ...initialState,
        globalTeams: [mockTeam],
      };

      const action: RouletteAction = {
        type: 'REMOVE_TEAM',
        payload: { id: mockTeam.id },
      };

      const result = rouletteReducer(stateWithTeam, action);

      expect(result.globalTeams).toHaveLength(0);
    });

    it('should edit a global team', () => {
      const stateWithTeam = {
        ...initialState,
        globalTeams: [mockTeam],
      };

      const action: RouletteAction = {
        type: 'EDIT_TEAM',
        payload: { id: mockTeam.id, name: 'Edited Team', description: 'Edited Description' },
      };

      const result = rouletteReducer(stateWithTeam, action);

      expect(result.globalTeams[0].name).toBe('Edited Team');
      expect(result.globalTeams[0].description).toBe('Edited Description');
    });

    it('should add member to team', () => {
      const stateWithTeam = {
        ...initialState,
        globalTeams: [mockTeam],
      };

      const action: RouletteAction = {
        type: 'ADD_MEMBER_TO_TEAM',
        payload: { teamId: mockTeam.id, participant: mockParticipant },
      };

      const result = rouletteReducer(stateWithTeam, action);

      expect(result.globalTeams[0].members).toHaveLength(1);
      expect(result.globalTeams[0].members[0]).toEqual(mockParticipant);
    });

    it('should remove member from team', () => {
      const teamWithMember = { ...mockTeam, members: [mockParticipant] };
      const stateWithTeam = {
        ...initialState,
        globalTeams: [teamWithMember],
      };

      const action: RouletteAction = {
        type: 'REMOVE_MEMBER_FROM_TEAM',
        payload: { teamId: mockTeam.id, participantId: mockParticipant.id },
      };

      const result = rouletteReducer(stateWithTeam, action);

      expect(result.globalTeams[0].members).toHaveLength(0);
    });
  });

  describe('Participant Management', () => {
    it('should add a participant', () => {
      const action: RouletteAction = {
        type: 'ADD_PARTICIPANT',
        payload: { name: 'John Doe' },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.participants).toHaveLength(1);
      expect(result.participants[0].name).toBe('John Doe');
    });

    it('should add multiple participants in bulk', () => {
      const action: RouletteAction = {
        type: 'ADD_PARTICIPANTS_BULK',
        payload: { names: ['John', 'Jane', 'Bob'] },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.participants).toHaveLength(3);
      expect(result.participants.map(p => p.name)).toEqual(['John', 'Jane', 'Bob']);
    });

    it('should remove a participant', () => {
      const stateWithParticipant = {
        ...initialState,
        participants: [mockParticipant],
      };

      const action: RouletteAction = {
        type: 'REMOVE_PARTICIPANT',
        payload: { id: mockParticipant.id },
      };

      const result = rouletteReducer(stateWithParticipant, action);

      expect(result.participants).toHaveLength(0);
    });

    it('should clear all participants', () => {
      const stateWithParticipants = {
        ...initialState,
        participants: [mockParticipant, { ...mockParticipant, id: 'participant-2' }],
      };

      const action: RouletteAction = { type: 'CLEAR_PARTICIPANTS' };

      const result = rouletteReducer(stateWithParticipants, action);

      expect(result.participants).toHaveLength(0);
    });
  });

  describe('Task Management', () => {
    it('should add a task', () => {
      const action: RouletteAction = {
        type: 'ADD_TASK',
        payload: { name: 'New Task', description: 'New Description', requiredParticipants: 2 },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].name).toBe('New Task');
      expect(result.tasks[0].requiredParticipants).toBe(2);
    });

    it('should add multiple tasks in bulk', () => {
      const action: RouletteAction = {
        type: 'ADD_TASKS_BULK',
        payload: { taskLines: ['Task 1', 'Task 2|Description 2|2', 'Task 3|Description 3|3'] },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.tasks).toHaveLength(3);
      expect(result.tasks[0].name).toBe('Task 1');
      expect(result.tasks[0].requiredParticipants).toBe(1);
      expect(result.tasks[1].name).toBe('Task 2');
      expect(result.tasks[1].description).toBe('Description 2');
      expect(result.tasks[1].requiredParticipants).toBe(2);
      expect(result.tasks[2].name).toBe('Task 3');
      expect(result.tasks[2].description).toBe('Description 3');
      expect(result.tasks[2].requiredParticipants).toBe(3);
    });

    it('should remove a task', () => {
      const stateWithTask = {
        ...initialState,
        tasks: [mockTask],
      };

      const action: RouletteAction = {
        type: 'REMOVE_TASK',
        payload: { id: mockTask.id },
      };

      const result = rouletteReducer(stateWithTask, action);

      expect(result.tasks).toHaveLength(0);
    });

    it('should clear all tasks', () => {
      const stateWithTasks = {
        ...initialState,
        tasks: [mockTask, { ...mockTask, id: 'task-2' }],
      };

      const action: RouletteAction = { type: 'CLEAR_TASKS' };

      const result = rouletteReducer(stateWithTasks, action);

      expect(result.tasks).toHaveLength(0);
    });
  });

  describe('Spinning Logic', () => {
    it('should start participant spin', () => {
      const stateWithParticipants = {
        ...initialState,
        participants: [mockParticipant],
      };
      const resolve = jest.fn();
      const action: RouletteAction = {
        type: 'SPIN_ROULETTE_REQUEST',
        payload: { resolve },
      };

      const result = rouletteReducer(stateWithParticipants, action);

      expect(result.isSpinning).toBe(true);
      expect(result.selectedParticipant).toBeUndefined();
    });

    it('should finish participant spin with selected participant', () => {
      const spinningState = { ...initialState, isSpinning: true };
      const action: RouletteAction = {
        type: 'FINISH_SPIN',
        payload: { participant: mockParticipant },
      };

      const result = rouletteReducer(spinningState, action);

      expect(result.isSpinning).toBe(false);
      expect(result.selectedParticipant).toEqual(mockParticipant);
      expect(result.history).toHaveLength(1);
      expect(result.history[0].participantName).toBe(mockParticipant.name);
    });

    it('should finish task spin with multiple participants', () => {
      const participant2 = { ...mockParticipant, id: 'participant-2', name: 'Jane Doe' };
      const spinningState = { ...initialState, isSpinning: true };
      const action: RouletteAction = {
        type: 'FINISH_TASK_SPIN',
        payload: { participants: [mockParticipant, participant2], task: mockTask },
      };

      const result = rouletteReducer(spinningState, action);

      expect(result.isSpinning).toBe(false);
      expect(result.taskHistory).toHaveLength(1);
      expect(result.taskHistory[0].participants).toHaveLength(2);
      expect(result.taskHistory[0].taskName).toBe(mockTask.name);
    });
  });

  describe('Settings Management', () => {
    it('should set auto remove participants', () => {
      const action: RouletteAction = {
        type: 'SET_AUTO_REMOVE_PARTICIPANTS',
        payload: { enabled: true },
      };

      const result = rouletteReducer(initialState, action);

      expect(result.autoRemoveParticipants).toBe(true);
    });
  });

  describe('History Management', () => {
    it('should clear history', () => {
      const stateWithHistory = {
        ...initialState,
        history: [{
          id: 'history-1',
          participantId: mockParticipant.id,
          participantName: mockParticipant.name,
          selectedAt: new Date(),
        }],
      };

      const action: RouletteAction = { type: 'CLEAR_HISTORY' };

      const result = rouletteReducer(stateWithHistory, action);

      expect(result.history).toHaveLength(0);
    });

    it('should clear task history', () => {
      const stateWithTaskHistory = {
        ...initialState,
        taskHistory: [{
          id: 'task-history-1',
          participants: [{ id: mockParticipant.id, name: mockParticipant.name }],
          taskId: mockTask.id,
          taskName: mockTask.name,
          selectedAt: new Date(),
        }],
      };

      const action: RouletteAction = { type: 'CLEAR_TASK_HISTORY' };

      const result = rouletteReducer(stateWithTaskHistory, action);

      expect(result.taskHistory).toHaveLength(0);
    });
  });
});