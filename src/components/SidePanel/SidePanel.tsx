import React, { useState, Suspense, lazy } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant, RouletteHistory, Task, TaskHistory as TaskHistoryType, Team } from '../../types';
import type { SettingsConfig } from '../Settings/Settings';
import { Loading } from '../Loading/Loading';
import { useI18n } from '../../i18n';

// Lazy load components that are not immediately visible
const ParticipantManager = lazy(() => import('../ParticipantManager/ParticipantManager').then(module => ({ default: module.ParticipantManager })));
const History = lazy(() => import('../History/History').then(module => ({ default: module.History })));
const Settings = lazy(() => import('../Settings/Settings').then(module => ({ default: module.Settings })));
const TaskManager = lazy(() => import('../TaskManager/TaskManager').then(module => ({ default: module.TaskManager })));
const TaskHistory = lazy(() => import('../TaskHistory/TaskHistory').then(module => ({ default: module.TaskHistory })));
const TeamManager = lazy(() => import('../TeamManager/TeamManager').then(module => ({ default: module.TeamManager })));

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
  width: 480px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: -8px 0 32px rgba(31, 38, 135, 0.37);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  position: relative;
  height: 100vh;
  
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const PanelHeader = styled.div`
  padding: 5rem 2rem 1rem 2rem;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 5.5rem 2rem 1rem 2rem;
  }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem 2rem 2rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;


const MenuNav = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25rem;
  }
  
  @media (max-height: 600px) {
    gap: 0.25rem;
  }
  
  @media (max-height: 500px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.125rem;
  }
`;

const NavButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
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
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60px;
  white-space: nowrap;
  
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
  }
  
  @media (max-height: 600px) {
    padding: 0.5rem 0.25rem;
    min-height: 45px;
    font-size: 0.75rem;
  }
  
  @media (max-height: 500px) {
    padding: 0.375rem 0.125rem;
    min-height: 40px;
    font-size: 0.7rem;
  }
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
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(31, 38, 135, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(31, 38, 135, 0.2);
  }
  
  &::before {
    content: '✕';
    font-size: 0.9rem;
    line-height: 1;
  }
`;

interface SidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  participants: Participant[];
  history: RouletteHistory[];
  tasks?: Task[];
  taskHistory?: TaskHistoryType[];
  teams?: Team[];
  settings: SettingsConfig;
  onAddParticipant: (name: string) => void;
  onAddParticipantsBulk: (names: string[]) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
  onAddTask?: (name: string, description?: string, requiredParticipants?: number) => void;
  onAddTasksBulk?: (taskLines: string[]) => void;
  onRemoveTask?: (id: string) => void;
  onClearTasks?: () => void;
  onClearTaskHistory?: () => void;
  onAddTeam?: (name: string, description?: string) => void;
  onRemoveTeam?: (id: string) => void;
  onEditTeam?: (id: string, name: string, description?: string) => void;
  onAddMemberToTeam?: (teamId: string, participant: Participant) => void;
  onRemoveMemberFromTeam?: (teamId: string, participantId: string) => void;
  onImportTeamToProject?: (teamId: string) => void;
  onSettingsChange: (settings: SettingsConfig) => void;
  onResetSettings: () => void;
}

export function SidePanel({
  isOpen,
  onToggle,
  participants,
  history,
  tasks = [],
  taskHistory = [],
  teams = [],
  settings,
  onAddParticipant,
  onAddParticipantsBulk,
  onRemoveParticipant,
  onClearParticipants,
  onRemoveFromRoulette,
  onClearHistory,
  onAddTask,
  onAddTasksBulk,
  onRemoveTask,
  onClearTasks,
  onClearTaskHistory,
  onAddTeam,
  onRemoveTeam,
  onEditTeam,
  onAddMemberToTeam,
  onRemoveMemberFromTeam,
  onImportTeamToProject,
  onSettingsChange,
  onResetSettings,
}: SidePanelProps) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState<'participants' | 'tasks' | 'teams' | 'history' | 'taskHistory' | 'settings'>('participants');

  return (
    <PanelContainer data-testid="side-panel">
      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />
            <PanelContent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <CloseButton onClick={onToggle}></CloseButton>
              
              <PanelHeader>
                <MenuNav>
                  <NavButton
                    active={activeSection === 'participants'}
                    onClick={() => setActiveSection('participants')}
                  >
                    <span>{t('nav.participants')}</span>
                  </NavButton>
                  {settings.rouletteMode === 'tasks' && (
                    <NavButton
                      active={activeSection === 'tasks'}
                      onClick={() => setActiveSection('tasks')}
                    >
                      <span>{t('nav.tasks')}</span>
                    </NavButton>
                  )}
                  <NavButton
                    active={activeSection === 'teams'}
                    onClick={() => setActiveSection('teams')}
                  >
                    <span>{t('teams.title')}</span>
                  </NavButton>
                  <NavButton
                    active={activeSection === (
                      settings.rouletteMode === 'tasks' ? 'taskHistory' : 'history'
                    )}
                    onClick={() => setActiveSection(
                      settings.rouletteMode === 'tasks' ? 'taskHistory' : 'history'
                    )}
                  >
                    <span>{t('nav.history')}</span>
                  </NavButton>
                  <NavButton
                    active={activeSection === 'settings'}
                    onClick={() => setActiveSection('settings')}
                  >
                    <span>{t('nav.settings')}</span>
                  </NavButton>
                </MenuNav>
              </PanelHeader>
              
              <PanelBody>
                <Suspense fallback={<Loading text={t('status.loading')} />}>
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
                  {activeSection === 'teams' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <TeamManager
                        teams={teams}
                        onAddTeam={onAddTeam!}
                        onRemoveTeam={onRemoveTeam!}
                        onEditTeam={onEditTeam!}
                        onAddMemberToTeam={onAddMemberToTeam!}
                        onRemoveMemberFromTeam={onRemoveMemberFromTeam!}
                        onImportTeamToProject={onImportTeamToProject!}
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
                </Suspense>
              </PanelBody>
              
            </PanelContent>
          </>
        )}
      </AnimatePresence>
    </PanelContainer>
  );
}