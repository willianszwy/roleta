import { useState, useCallback, useEffect } from 'react';
import type { Participant, Task, TaskHistory, TaskRouletteState } from '../types';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

const PARTICIPANTS_KEY = 'task-roulette-participants';
const TASKS_KEY = 'task-roulette-tasks';
const TASK_HISTORY_KEY = 'task-roulette-history';

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

export function useTaskRoulette() {
  const [participants, setParticipants] = useState<Participant[]>(() => 
    loadFromStorage(PARTICIPANTS_KEY, [])
  );
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage(TASKS_KEY, [])
  );
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>(() => 
    loadFromStorage(TASK_HISTORY_KEY, [])
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    saveToStorage(PARTICIPANTS_KEY, participants);
  }, [participants]);

  useEffect(() => {
    saveToStorage(TASKS_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(TASK_HISTORY_KEY, taskHistory);
  }, [taskHistory]);

  const addParticipant = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const newParticipant: Participant = {
      id: generateId(),
      name: name.trim(),
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setParticipants(prev => [...prev, newParticipant]);
  }, []);

  const addParticipantsBulk = useCallback((names: string[]) => {
    const validNames = names
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (validNames.length === 0) return;
    
    const newParticipants: Participant[] = validNames.map(name => ({
      id: generateId(),
      name,
      color: getRandomColor(),
      createdAt: new Date(),
    }));
    
    setParticipants(prev => [...prev, ...newParticipants]);
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(participant => participant.id !== id));
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  const addTask = useCallback((name: string, description?: string) => {
    if (!name.trim()) return;
    
    const newTask: Task = {
      id: generateId(),
      name: name.trim(),
      description: description?.trim() || undefined,
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
  }, []);

  const addTasksBulk = useCallback((taskLines: string[]) => {
    const validTasks = taskLines
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (validTasks.length === 0) return;
    
    const newTasks: Task[] = validTasks.map(line => {
      // Support format: "Task Name | Description" or just "Task Name"
      const [name, description] = line.split('|').map(part => part.trim());
      
      return {
        id: generateId(),
        name,
        description: description || undefined,
        color: getRandomColor(),
        createdAt: new Date(),
      };
    });
    
    setTasks(prev => [...prev, ...newTasks]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const clearTaskHistory = useCallback(() => {
    setTaskHistory([]);
  }, []);

  const spinTaskRoulette = useCallback(() => {
    if (participants.length === 0 || tasks.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedParticipant(undefined);
    setSelectedTask(undefined);
  }, [participants.length, tasks.length, isSpinning]);

  const finishTaskSpin = useCallback((selectedParticipant?: Participant, selectedTask?: Task) => {
    setIsSpinning(false);
    
    if (selectedParticipant && selectedTask) {
      setSelectedParticipant(selectedParticipant);
      setSelectedTask(selectedTask);
      
      // Add to history
      const historyEntry: TaskHistory = {
        id: generateId(),
        participantId: selectedParticipant.id,
        participantName: selectedParticipant.name,
        taskId: selectedTask.id,
        taskName: selectedTask.name,
        taskDescription: selectedTask.description,
        selectedAt: new Date(),
      };
      
      setTaskHistory(prev => [historyEntry, ...prev]);
    }
  }, []);

  const state: TaskRouletteState = {
    participants,
    tasks,
    taskHistory,
    isSpinning,
    selectedParticipant,
    selectedTask,
    animationDuration: 3000,
  };

  const actions = {
    addParticipant,
    addParticipantsBulk,
    removeParticipant,
    clearParticipants,
    addTask,
    addTasksBulk,
    removeTask,
    clearTasks,
    clearTaskHistory,
    spinTaskRoulette,
    finishTaskSpin,
  };

  return { state, actions };
}