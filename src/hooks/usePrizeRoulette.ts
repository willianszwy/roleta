import { useState, useCallback, useEffect } from 'react';
import type { Participant, Prize, PrizeHistory, PrizeRouletteState } from '../types';
import { generateId, getRandomColor, selectRandomParticipant } from '../utils/helpers';

const PARTICIPANTS_KEY = 'prize-roulette-participants';
const PRIZES_KEY = 'prize-roulette-prizes';
const PRIZE_HISTORY_KEY = 'prize-roulette-history';

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

export function usePrizeRoulette() {
  const [participants, setParticipants] = useState<Participant[]>(() => 
    loadFromStorage(PARTICIPANTS_KEY, [])
  );
  const [prizes, setPrizes] = useState<Prize[]>(() => 
    loadFromStorage(PRIZES_KEY, [])
  );
  const [prizeHistory, setPrizeHistory] = useState<PrizeHistory[]>(() => 
    loadFromStorage(PRIZE_HISTORY_KEY, [])
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | undefined>();
  const [selectedPrize, setSelectedPrize] = useState<Prize | undefined>();

  useEffect(() => {
    saveToStorage(PARTICIPANTS_KEY, participants);
  }, [participants]);

  useEffect(() => {
    saveToStorage(PRIZES_KEY, prizes);
  }, [prizes]);

  useEffect(() => {
    saveToStorage(PRIZE_HISTORY_KEY, prizeHistory);
  }, [prizeHistory]);

  const addParticipant = useCallback((name: string) => {
    if (!name.trim()) return;
    
    const trimmedName = name.trim();
    
    // Verificar se já existe um participante com o mesmo nome
    const existingNames = participants.map(p => p.name.toLowerCase());
    let finalName = trimmedName;
    
    // Se o nome já existe, adicionar número
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
    
    setParticipants(prev => [...prev, newParticipant]);
  }, [participants]);

  const addParticipantsBulk = useCallback((names: string[]) => {
    if (names.length === 0) return;
    
    const existingNames = participants.map(p => p.name.toLowerCase());
    const newParticipants: Participant[] = [];
    const usedNames = [...existingNames];
    
    names.forEach(name => {
      const trimmedName = name.trim();
      if (!trimmedName) return;
      
      let finalName = trimmedName;
      
      // Se o nome já existe, adicionar número
      if (usedNames.includes(trimmedName.toLowerCase())) {
        let counter = 2;
        while (usedNames.includes(`${trimmedName} (${counter})`.toLowerCase())) {
          counter++;
        }
        finalName = `${trimmedName} (${counter})`;
      }
      
      // Adicionar o nome usado à lista para evitar duplicatas dentro do próprio lote
      usedNames.push(finalName.toLowerCase());
      
      const newParticipant: Participant = {
        id: generateId(),
        name: finalName,
        color: getRandomColor(),
        createdAt: new Date(),
      };
      
      newParticipants.push(newParticipant);
    });
    
    setParticipants(prev => [...prev, ...newParticipants]);
  }, [participants]);

  const addPrize = useCallback((name: string, description?: string) => {
    if (!name.trim()) return;
    
    const trimmedName = name.trim();
    
    // Verificar se já existe um prêmio com o mesmo nome
    const existingNames = prizes.map(p => p.name.toLowerCase());
    let finalName = trimmedName;
    
    // Se o nome já existe, adicionar número
    if (existingNames.includes(trimmedName.toLowerCase())) {
      let counter = 2;
      while (existingNames.includes(`${trimmedName} (${counter})`.toLowerCase())) {
        counter++;
      }
      finalName = `${trimmedName} (${counter})`;
    }
    
    const newPrize: Prize = {
      id: generateId(),
      name: finalName,
      description: description?.trim(),
      color: getRandomColor(),
      createdAt: new Date(),
    };
    
    setPrizes(prev => [...prev, newPrize]);
  }, [prizes]);

  const addPrizesBulk = useCallback((names: string[]) => {
    if (names.length === 0) return;
    
    const existingNames = prizes.map(p => p.name.toLowerCase());
    const newPrizes: Prize[] = [];
    const usedNames = [...existingNames];
    
    names.forEach(name => {
      const trimmedName = name.trim();
      if (!trimmedName) return;
      
      let finalName = trimmedName;
      
      // Se o nome já existe, adicionar número
      if (usedNames.includes(trimmedName.toLowerCase())) {
        let counter = 2;
        while (usedNames.includes(`${trimmedName} (${counter})`.toLowerCase())) {
          counter++;
        }
        finalName = `${trimmedName} (${counter})`;
      }
      
      // Adicionar o nome usado à lista para evitar duplicatas dentro do próprio lote
      usedNames.push(finalName.toLowerCase());
      
      const newPrize: Prize = {
        id: generateId(),
        name: finalName,
        color: getRandomColor(),
        createdAt: new Date(),
      };
      
      newPrizes.push(newPrize);
    });
    
    setPrizes(prev => [...prev, ...newPrizes]);
  }, [prizes]);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const removePrize = useCallback((id: string) => {
    setPrizes(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  const clearPrizes = useCallback(() => {
    setPrizes([]);
  }, []);

  const clearPrizeHistory = useCallback(() => {
    setPrizeHistory([]);
  }, []);

  const spinPrizeRoulette = useCallback(async (): Promise<{ participant: Participant | null, prize: Prize | null }> => {
    if (participants.length === 0 || prizes.length === 0 || isSpinning) {
      return { participant: null, prize: null };
    }

    setIsSpinning(true);
    setSelectedParticipant(undefined);
    setSelectedPrize(undefined);

    await new Promise(resolve => setTimeout(resolve, 100));

    const selectedParticipant = selectRandomParticipant(participants);
    const selectedPrize = selectRandomParticipant(prizes); // Reutilizar a mesma função
    
    return { participant: selectedParticipant, prize: selectedPrize };
  }, [participants, prizes, isSpinning]);

  const finishPrizeSpin = useCallback((selectedParticipant?: Participant, selectedPrize?: Prize) => {
    setIsSpinning(false);
    
    if (selectedParticipant && selectedPrize) {
      setSelectedParticipant(selectedParticipant);
      setSelectedPrize(selectedPrize);
      
      // Adicionar ao histórico
      const historyEntry: PrizeHistory = {
        id: generateId(),
        participantId: selectedParticipant.id,
        participantName: selectedParticipant.name,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name,
        selectedAt: new Date(),
      };
      
      setPrizeHistory(prev => [historyEntry, ...prev]);
      
      // Remover o prêmio da lista (uma vez sorteado, não pode ser sorteado novamente)
      setPrizes(prev => prev.filter(p => p.id !== selectedPrize.id));
    }
  }, []);

  const resetPrizeRoulette = useCallback(() => {
    setParticipants([]);
    setPrizes([]);
    setPrizeHistory([]);
    setSelectedParticipant(undefined);
    setSelectedPrize(undefined);
  }, []);

  const state: PrizeRouletteState = {
    participants,
    prizes,
    prizeHistory,
    isSpinning,
    selectedParticipant,
    selectedPrize,
    animationDuration: 4500,
  };

  return {
    state,
    actions: {
      addParticipant,
      addParticipantsBulk,
      removeParticipant,
      clearParticipants,
      addPrize,
      addPrizesBulk,
      removePrize,
      clearPrizes,
      spinPrizeRoulette,
      finishPrizeSpin,
      clearPrizeHistory,
      resetPrizeRoulette,
    },
  };
}