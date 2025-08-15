import { useState, useCallback } from 'react';
import { Participant, RouletteHistory, RouletteState } from '../types';
import { useLocalStorageWithDate } from './useLocalStorage';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

const PARTICIPANTS_KEY = 'roulette-participants';
const HISTORY_KEY = 'roulette-history';

export function useRoulette() {
  const [participants, setParticipants] = useLocalStorageWithDate<Participant[]>(PARTICIPANTS_KEY, []);
  const [history, setHistory] = useLocalStorageWithDate<RouletteHistory[]>(HISTORY_KEY, []);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>();

  const addParticipant = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const newParticipant: Participant = {
      id: generateId(),
      name: name.trim(),
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setParticipants(prev => [...prev, newParticipant]);
  }, [setParticipants]);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, [setParticipants]);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, [setParticipants]);

  const spinRoulette = useCallback(async (): Promise<Participant | null> => {
    if (participants.length === 0 || isSpinning) return null;

    setIsSpinning(true);
    setSelectedParticipant(undefined);

    // Simulate spinning animation duration
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
  }, [participants, isSpinning, setHistory]);

  const finishSpin = useCallback(() => {
    setIsSpinning(false);
  }, []);

  const removeFromRouletteAfterSpin = useCallback((participantId: string) => {
    // Remove participant from active list
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    
    // Mark as removed in history
    setHistory(prev => prev.map(h => 
      h.participantId === participantId && !h.removed 
        ? { ...h, removed: true }
        : h
    ));
  }, [setParticipants, setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const restoreParticipant = useCallback((participantName: string) => {
    // Find a removed participant in history to restore their color
    const historyEntry = history.find(h => h.participantName === participantName && h.removed);
    
    const newParticipant: Participant = {
      id: generateId(),
      name: participantName,
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    
    // Update history to mark as restored (not removed)
    if (historyEntry) {
      setHistory(prev => prev.map(h => 
        h.id === historyEntry.id 
          ? { ...h, removed: false }
          : h
      ));
    }
  }, [history, setParticipants, setHistory]);

  const state: RouletteState = {
    participants,
    history,
    isSpinning,
    selectedParticipant,
    animationDuration: 3000, // 3 seconds default
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