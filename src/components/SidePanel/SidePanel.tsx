import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticipantManager } from '../ParticipantManager/ParticipantManager';
import { History } from '../History/History';
import { Settings, type SettingsConfig } from '../Settings/Settings';
import type { Participant, RouletteHistory } from '../../types';

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
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
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
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const NavButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.12)'};
  border: 1px solid ${props => props.active ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255, 255, 255, 0.25)'};
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.active ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255, 255, 255, 0.18)'};
    border-color: ${props => props.active ? 'rgba(102, 126, 234, 0.6)' : 'rgba(255, 255, 255, 0.35)'};
    color: #fff;
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
  settings: SettingsConfig;
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
  onSettingsChange: (settings: SettingsConfig) => void;
  onResetSettings: () => void;
}

export function SidePanel({
  participants,
  history,
  settings,
  onAddParticipant,
  onRemoveParticipant,
  onClearParticipants,
  onRemoveFromRoulette,
  onClearHistory,
  onSettingsChange,
  onResetSettings,
}: SidePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'participants' | 'history' | 'settings'>('participants');

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
                    👥 Participantes
                  </NavButton>
                  <NavButton
                    active={activeSection === 'history'}
                    onClick={() => setActiveSection('history')}
                  >
                    📊 Histórico
                  </NavButton>
                  <NavButton
                    active={activeSection === 'settings'}
                    onClick={() => setActiveSection('settings')}
                  >
                    ⚙️ Configurações
                  </NavButton>
                </MenuNav>
              </PanelHeader>
              
              <PanelBody>
                {activeSection === 'participants' ? (
                  <ParticipantManager
                    participants={participants}
                    onAdd={onAddParticipant}
                    onRemove={onRemoveParticipant}
                    onClear={onClearParticipants}
                  />
                ) : activeSection === 'history' ? (
                  <History
                    history={history}
                    onRemoveFromRoulette={onRemoveFromRoulette}
                    onClearHistory={onClearHistory}
                  />
                ) : (
                  <Settings
                    config={settings}
                    onConfigChange={onSettingsChange}
                    onResetSettings={onResetSettings}
                  />
                )}
              </PanelBody>
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