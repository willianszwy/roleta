import { useState, useCallback, useEffect } from 'react';
import type { Participant, RouletteHistory, RouletteState } from '../types';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

const PARTICIPANTS_KEY = 'roulette-participants';
const HISTORY_KEY = 'roulette-history';

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

export function useRoulette() {
  const [participants, setParticipants] = useState<Participant[]>(() => 
    loadFromStorage(PARTICIPANTS_KEY, [])
  );
  const [history, setHistory] = useState<RouletteHistory[]>(() => 
    loadFromStorage(HISTORY_KEY, [])
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>();

  useEffect(() => {
    saveToStorage(PARTICIPANTS_KEY, participants);
  }, [participants]);

  useEffect(() => {
    saveToStorage(HISTORY_KEY, history);
  }, [history]);

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

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  const spinRoulette = useCallback(async (): Promise<Participant | null> => {
    if (participants.length === 0 || isSpinning) return null;

    setIsSpinning(true);
    setSelectedParticipant(undefined);

    await new Promise(resolve => setTimeout(resolve, 100));

    const selected = selectRandomParticipant(participants);
    
    if (selected) {
      const historyEntry: RouletteHistory = {
        id: generateId(),
        participantId: selected.id,
        participantName: selected.name,
        selectedAt: new Date(),
        removed: false,
      };
      
      setHistory(prev => [historyEntry, ...prev]);
      setSelectedParticipant(selected);
    }

    return selected;
  }, [participants, isSpinning]);

  const finishSpin = useCallback(() => {
    setIsSpinning(false);
  }, []);

  const removeFromRouletteAfterSpin = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setHistory(prev => prev.map(h => 
      h.participantId === participantId && !h.removed 
        ? { ...h, removed: true }
        : h
    ));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const restoreParticipant = useCallback((participantName: string) => {
    const historyEntry = history.find(h => h.participantName === participantName && h.removed);
    
    const newParticipant: Participant = {
      id: generateId(),
      name: participantName,
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    
    if (historyEntry) {
      setHistory(prev => prev.map(h => 
        h.id === historyEntry.id 
          ? { ...h, removed: false }
          : h
      ));
    }
  }, [history]);

  const state: RouletteState = {
    participants,
    history,
    isSpinning,
    selectedParticipant,
    animationDuration: 3000,
  };

  return {
    state,
    actions: {
      addParticipant,
      removeParticipant,
      clearParticipants,
      spinRoulette,
      finishSpin,
      removeFromRouletteAfterSpin,
      clearHistory,
      restoreParticipant,
    },
  };
}