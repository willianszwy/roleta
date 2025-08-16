import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticipantManager } from '../ParticipantManager/ParticipantManager';
import { History } from '../History/History';
import { Settings, type SettingsConfig } from '../Settings/Settings';
import { PrizeManager } from '../PrizeManager/PrizeManager';
import { PrizeHistory } from '../PrizeHistory/PrizeHistory';
import { TaskManager } from '../TaskManager/TaskManager';
import { TaskHistory } from '../TaskHistory/TaskHistory';
import type { Participant, RouletteHistory, Prize, PrizeHistory as PrizeHistoryType, Task, TaskHistory as TaskHistoryType } from '../../types';

const PanelContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: stretch;
`;

const PanelContent = styled(motion.div)`
  width: 420px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: -8px 0 32px rgba(31, 38, 135, 0.37);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1001;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MenuNav = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 0.5rem;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid ${props => props.active ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 8px;
  color: ${props => props.active ? '#a5b4fc' : 'rgba(255, 255, 255, 0.75)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  min-height: 60px;
  white-space: nowrap;
  
  i {
    font-size: 1.25rem;
    line-height: 1;
    color: inherit;
  }
  
  span {
    font-size: inherit;
    line-height: 1.2;
  }
  
  &:hover {
    background: ${props => props.active ? 'rgba(102, 126, 234, 0.35)' : 'rgba(255, 255, 255, 0.12)'};
    border-color: ${props => props.active ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255, 255, 255, 0.25)'};
    color: ${props => props.active ? '#c7d2fe' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem 0.25rem;
    min-height: 50px;
    gap: 0.375rem;
    
    i {
      font-size: 1rem;
    }
  }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const HamburgerButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px 0 0 12px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-shadow: -4px 0 16px rgba(31, 38, 135, 0.2);
  margin-top: 15vh;
  transition: all 0.3s ease;
  z-index: 1002;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateX(-2px);
    box-shadow: -6px 0 20px rgba(102, 126, 234, 0.2);
  }
  
  @media (max-width: 768px) {
    margin-top: 10vh;
  }
`;

const HamburgerLine = styled(motion.div)<{ isOpen: boolean }>`
  width: 18px;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1px;
  transition: all 0.3s ease;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

interface SidePanelProps {
  participants: Participant[];
  history: RouletteHistory[];
  prizes?: Prize[];
  prizeHistory?: PrizeHistoryType[];
  tasks?: Task[];
  taskHistory?: TaskHistoryType[];
  settings: SettingsConfig;
  onAddParticipant: (name: string) => void;
  onAddParticipantsBulk: (names: string[]) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
  onAddPrize?: (name: string, description?: string) => void;
  onAddPrizesBulk?: (names: string[]) => void;
  onRemovePrize?: (id: string) => void;
  onClearPrizes?: () => void;
  onClearPrizeHistory?: () => void;
  onAddTask?: (name: string, description?: string) => void;
  onAddTasksBulk?: (taskLines: string[]) => void;
  onRemoveTask?: (id: string) => void;
  onClearTasks?: () => void;
  onClearTaskHistory?: () => void;
  onSettingsChange: (settings: SettingsConfig) => void;
  onResetSettings: () => void;
}

export function SidePanel({
  participants,
  history,
  prizes = [],
  prizeHistory = [],
  tasks = [],
  taskHistory = [],
  settings,
  onAddParticipant,
  onAddParticipantsBulk,
  onRemoveParticipant,
  onClearParticipants,
  onRemoveFromRoulette,
  onClearHistory,
  onAddPrize,
  onAddPrizesBulk,
  onRemovePrize,
  onClearPrizes,
  onClearPrizeHistory,
  onAddTask,
  onAddTasksBulk,
  onRemoveTask,
  onClearTasks,
  onClearTaskHistory,
  onSettingsChange,
  onResetSettings,
}: SidePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'participants' | 'prizes' | 'tasks' | 'history' | 'prizeHistory' | 'taskHistory' | 'settings'>('participants');

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <PanelContainer>
      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={togglePanel}
            />
            <PanelContent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <CloseButton onClick={togglePanel}>×</CloseButton>
              
              <PanelHeader>
                <PanelTitle>
                  🎰 LuckyWheel
                </PanelTitle>
                <MenuNav>
                  <NavButton
                    active={activeSection === 'participants'}
                    onClick={() => setActiveSection('participants')}
                  >
                    <i className="fi fi-tr-users"></i>
                    <span>Participantes</span>
                  </NavButton>
                  {settings.rouletteMode === 'prizes' && (
                    <NavButton
                      active={activeSection === 'prizes'}
                      onClick={() => setActiveSection('prizes')}
                    >
                      <i className="fi fi-tr-gift"></i>
                      <span>Prêmios</span>
                    </NavButton>
                  )}
                  {settings.rouletteMode === 'tasks' && (
                    <NavButton
                      active={activeSection === 'tasks'}
                      onClick={() => setActiveSection('tasks')}
                    >
                      <i className="fi fi-tr-clipboard-list"></i>
                      <span>Tarefas</span>
                    </NavButton>
                  )}
                  <NavButton
                    active={activeSection === (
                      settings.rouletteMode === 'prizes' ? 'prizeHistory' : 
                      settings.rouletteMode === 'tasks' ? 'taskHistory' : 'history'
                    )}
                    onClick={() => setActiveSection(
                      settings.rouletteMode === 'prizes' ? 'prizeHistory' : 
                      settings.rouletteMode === 'tasks' ? 'taskHistory' : 'history'
                    )}
                  >
                    <i className="fi fi-tr-chart-histogram"></i>
                    <span>Histórico</span>
                  </NavButton>
                  <NavButton
                    active={activeSection === 'settings'}
                    onClick={() => setActiveSection('settings')}
                  >
                    <i className="fi fi-tr-settings"></i>
                    <span>Config</span>
                  </NavButton>
                </MenuNav>
                {activeSection === 'participants' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <ParticipantManager
                    participants={participants}
                    onAdd={onAddParticipant}
                    onAddBulk={onAddParticipantsBulk}
                    onRemove={onRemoveParticipant}
                    onClear={onClearParticipants}
                    />
                  </div>
                )}
                {activeSection === 'history' && settings.rouletteMode === 'participants' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <History
                    history={history}
                    onRemoveFromRoulette={onRemoveFromRoulette}
                    onClearHistory={onClearHistory}
                    />
                  </div>
                )}
                {activeSection === 'prizeHistory' && settings.rouletteMode === 'prizes' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <PrizeHistory
                    prizeHistory={prizeHistory}
                    onClearHistory={onClearPrizeHistory!}
                  />
                  </div>
                )}
                {activeSection === 'tasks' && settings.rouletteMode === 'tasks' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <TaskManager
                    tasks={tasks}
                    onAdd={onAddTask!}
                    onAddBulk={onAddTasksBulk!}
                    onRemove={onRemoveTask!}
                    onClear={onClearTasks!}
                    />
                  </div>
                )}
                {activeSection === 'taskHistory' && settings.rouletteMode === 'tasks' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <TaskHistory
                    taskHistory={taskHistory}
                    onClearHistory={onClearTaskHistory!}
                    />
                  </div>
                )}
                {activeSection === 'settings' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <Settings
                    config={settings}
                    onConfigChange={onSettingsChange}
                    onResetSettings={onResetSettings}
                    />
                  </div>
                )}
              </PanelHeader>
              
              {(activeSection === 'prizes' && settings.rouletteMode === 'prizes') && (
                <PanelBody>
                  <PrizeManager
                    prizes={prizes}
                    onAdd={onAddPrize!}
                    onAddBulk={onAddPrizesBulk!}
                    onRemove={onRemovePrize!}
                    onClear={onClearPrizes!}
                  />
                </PanelBody>
              )}
            </PanelContent>
          </>
        )}
      </AnimatePresence>
      
      <HamburgerButton
        onClick={togglePanel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HamburgerLine
          isOpen={isOpen}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
          }}
        />
        <HamburgerLine
          isOpen={isOpen}
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
        />
        <HamburgerLine
          isOpen={isOpen}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
          }}
        />
      </HamburgerButton>
    </PanelContainer>
  );
}