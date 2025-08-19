import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { RouletteProvider } from '../RouletteProvider';
import { useRouletteContext } from '../RouletteContext';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the context
const TestComponent = () => {
  const { state, actions } = useRouletteContext();
  
  return (
    <div>
      <div data-testid="participants-count">{state.participants.length}</div>
      <div data-testid="tasks-count">{state.tasks.length}</div>
      <div data-testid="projects-count">{state.projects.length}</div>
      <div data-testid="active-project-id">{state.activeProjectId || 'none'}</div>
      <button
        data-testid="add-participant"
        onClick={() => actions.addParticipant('Test Participant')}
      >
        Add Participant
      </button>
      <button
        data-testid="add-task"
        onClick={() => actions.addTask('Test Task', 'Test Description', 2)}
      >
        Add Task
      </button>
      <button
        data-testid="create-project"
        onClick={() => actions.createProject('Test Project', 'Test Description')}
      >
        Create Project
      </button>
    </div>
  );
};

describe('RouletteProvider', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('should provide initial context state', () => {
    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    expect(screen.getByTestId('participants-count')).toHaveTextContent('0');
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('0');
    expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
    expect(screen.getByTestId('active-project-id')).toHaveTextContent('none');
  });

  it('should allow adding participants through actions', async () => {
    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    const addButton = screen.getByTestId('add-participant');
    
    await act(async () => {
      addButton.click();
    });

    expect(screen.getByTestId('participants-count')).toHaveTextContent('1');
  });

  it('should allow adding tasks through actions', async () => {
    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    const addButton = screen.getByTestId('add-task');
    
    await act(async () => {
      addButton.click();
    });

    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('should allow creating projects through actions', async () => {
    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    const createButton = screen.getByTestId('create-project');
    
    await act(async () => {
      createButton.click();
    });

    expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
    expect(screen.getByTestId('active-project-id')).not.toHaveTextContent('none');
  });

  it('should persist data to localStorage', async () => {
    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    const addParticipantButton = screen.getByTestId('add-participant');
    const createProjectButton = screen.getByTestId('create-project');
    
    await act(async () => {
      createProjectButton.click();
      addParticipantButton.click();
    });

    // Check that data was saved to localStorage
    expect(mockLocalStorage.getItem('roulette-projects')).toBeTruthy();
    expect(mockLocalStorage.getItem('roulette-participants')).toBeTruthy();
    expect(mockLocalStorage.getItem('roulette-active-project')).toBeTruthy();
  });

  it('should migrate legacy data on initialization', () => {
    // Setup legacy data
    const legacyParticipants = [
      { id: 'p1', name: 'Legacy Participant', createdAt: new Date().toISOString() }
    ];
    const legacyTasks = [
      { id: 't1', name: 'Legacy Task', createdAt: new Date().toISOString() }
    ];
    const legacyHistory = [
      { id: 'h1', participantId: 'p1', participantName: 'Legacy Participant', selectedAt: new Date().toISOString() }
    ];

    mockLocalStorage.setItem('roulette-participants', JSON.stringify(legacyParticipants));
    mockLocalStorage.setItem('task-roulette-tasks', JSON.stringify(legacyTasks));
    mockLocalStorage.setItem('roulette-history', JSON.stringify(legacyHistory));

    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    // Should have created a default project with legacy data
    expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
    expect(screen.getByTestId('participants-count')).toHaveTextContent('1');
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('should handle missing requiredParticipants in legacy tasks', () => {
    const legacyTasks = [
      { id: 't1', name: 'Legacy Task Without Required', createdAt: new Date().toISOString() }
    ];

    mockLocalStorage.setItem('task-roulette-tasks', JSON.stringify(legacyTasks));

    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    // Should have created project and task with default requiredParticipants
    expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('should convert legacy task history format', () => {
    const legacyTaskHistory = [
      {
        id: 'th1',
        participantId: 'p1',
        participantName: 'Legacy Participant',
        taskId: 't1',
        taskName: 'Legacy Task',
        selectedAt: new Date().toISOString()
      }
    ];

    mockLocalStorage.setItem('task-roulette-history', JSON.stringify(legacyTaskHistory));

    render(
      <RouletteProvider>
        <TestComponent />
      </RouletteProvider>
    );

    // Should have migrated successfully without errors
    expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
  });
});