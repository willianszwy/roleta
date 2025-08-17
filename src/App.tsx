import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GlobalStyles, Container } from './styles/GlobalStyles';
import { Roulette } from './components/Roulette/Roulette';
import { TaskRoulette } from './components/TaskRoulette/TaskRoulette';
import { SidePanel } from './components/SidePanel/SidePanel';
import { WinnerModal } from './components/WinnerModal/WinnerModal';
import { useRoulette } from './hooks/useRoulette';
import { useTaskRoulette } from './hooks/useTaskRoulette';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Participant, Task } from './types';
import type { SettingsConfig } from './components/Settings/Settings';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background: 
    radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 120vw 60vh at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 130vw 50vh at 50% 100%, rgba(79, 172, 254, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, transparent 30%),
    #0f0f23;
  background-attachment: fixed;
  padding: 1rem 0;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    background: 
      radial-gradient(ellipse 200vw 50vh at 50% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 70%),
      radial-gradient(ellipse 150vw 40vh at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
      #0f0f23;
    background-attachment: scroll;
  }
`;

const AppHeader = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    padding: 0 2.5rem;
  }
  
  @media (min-width: 1920px) {
    padding: 0 4rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #8b5cf6 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const HeaderMenuButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  }
`;

const MenuLine = styled(motion.div)<{ isOpen: boolean }>`
  width: 18px;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1px;
  transition: all 0.3s ease;
`;



const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 70px);
  padding: 1.5rem;
  padding-top: calc(70px + 1.5rem);
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    padding-top: calc(70px + 0.5rem);
    min-height: calc(100vh - 70px);
  }
`;

const RouletteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 160px);
  
  @media (max-width: 768px) {
    min-height: calc(100vh - 130px);
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: calc(100vh - 110px);
  }
`;

const defaultSettings: SettingsConfig = {
  showWinnerModal: true,
  sorteioBomRuim: true,
  autoRemoveWinner: false,
  winnerDisplayDuration: 5,
  rouletteMode: 'participants'
};

function App() {
  const { state, actions } = useRoulette();
  const { state: taskState, actions: taskActions } = useTaskRoulette();
  const [settings, setSettings] = useLocalStorage<SettingsConfig>('luckywheel-settings', defaultSettings);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [lastWinner, setLastWinner] = useState<{participant: Participant, mode: 'participants' | 'tasks'} | null>(null);

  // Custom spin functions that handle removal and provide feedback
  const handleParticipantSpin = async (): Promise<Participant | null> => {
    console.log('🎲 HandleParticipantSpin called');
    console.log('🏆 LastWinner:', lastWinner);
    console.log('⚙️ AutoRemoveWinner:', settings.autoRemoveWinner);
    
    // Remove previous winner if exists
    if (lastWinner && settings.autoRemoveWinner && lastWinner.mode === 'participants') {
      console.log('🗑️ Removing previous winner:', lastWinner.participant.name);
      actions.removeParticipant(lastWinner.participant.id);
      setLastWinner(null);
      
      // Give time for UI to update
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('✅ Removal complete, proceeding with spin');
    }
    
    // Now perform the normal spin
    console.log('🎰 Starting normal spin');
    return actions.spinRoulette();
  };

  const handleTaskSpin = async (): Promise<{ participant: Participant; task: Task } | null> => {
    console.log('🎯 HandleTaskSpin called');
    console.log('🏆 LastWinner:', lastWinner);
    console.log('⚙️ AutoRemoveWinner:', settings.autoRemoveWinner);
    
    // Remove previous winner if exists
    if (lastWinner && settings.autoRemoveWinner && lastWinner.mode === 'tasks') {
      console.log('🗑️ Removing previous winner:', lastWinner.participant.name);
      taskActions.removeParticipant(lastWinner.participant.id);
      setLastWinner(null);
      
      // Give time for UI to update
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('✅ Removal complete, proceeding with spin');
    }
    
    // Now perform the normal spin
    console.log('🎰 Starting normal task spin');
    return taskActions.spinTaskRoulette();
  };

  const handleSpinComplete = (selected?: Participant) => {
    actions.finishSpin(selected);
    
    if (selected) {
      setCurrentWinner(selected);
      
      
      // Show winner modal if enabled
      if (settings.showWinnerModal) {
        setShowWinnerModal(true);
      }
      
      // Store last winner for next spin removal
      if (settings.autoRemoveWinner) {
        console.log('💾 Storing winner for removal:', selected.name);
        setLastWinner({ participant: selected, mode: 'participants' });
      }
      
      // Trigger confetti animation only if modal is disabled
      if (!settings.showWinnerModal) {
        const colors = ['#667eea', '#8b5cf6', '#a855f7', '#4facfe', '#00f2fe', '#3b82f6'];
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        });
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: colors,
          });
        }, 300);
      }
    }
  };


  const handleTaskSpinComplete = (selectedParticipant?: Participant, selectedTask?: Task) => {
    taskActions.finishTaskSpin(selectedParticipant, selectedTask);
    
    if (selectedParticipant && selectedTask) {
      setCurrentWinner(selectedParticipant);
      setCurrentTask(selectedTask);
      
      
      // Show winner modal if enabled
      if (settings.showWinnerModal) {
        setShowWinnerModal(true);
      }
      
      // Store last winner for next spin removal
      if (settings.autoRemoveWinner) {
        console.log('💾 Storing task winner for removal:', selectedParticipant.name);
        setLastWinner({ participant: selectedParticipant, mode: 'tasks' });
      }
      
      // Trigger confetti animation only if modal is disabled
      if (!settings.showWinnerModal) {
        const colors = ['#667eea', '#4facfe', '#00f2fe', '#8b5cf6', '#a855f7', '#3b82f6'];
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        });
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: colors,
          });
        }, 300);
      }
    }
  };

  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
    setCurrentWinner(null);
    setCurrentTask(null);
  };

  const handleSettingsChange = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <AppHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeaderTitle>LuckyWheel</HeaderTitle>
          <HeaderMenuButton
            onClick={togglePanel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MenuLine
              isOpen={isPanelOpen}
              animate={{
                rotate: isPanelOpen ? 45 : 0,
                y: isPanelOpen ? 8 : 0,
              }}
            />
            <MenuLine
              isOpen={isPanelOpen}
              animate={{
                opacity: isPanelOpen ? 0 : 1,
              }}
            />
            <MenuLine
              isOpen={isPanelOpen}
              animate={{
                rotate: isPanelOpen ? -45 : 0,
                y: isPanelOpen ? -8 : 0,
              }}
            />
          </HeaderMenuButton>
        </AppHeader>
        
        <Container>

          <MainContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <RouletteSection>
                {settings.rouletteMode === 'participants' ? (
                  <Roulette
                    participants={state.participants}
                    isSpinning={state.isSpinning}
                    selectedParticipant={state.selectedParticipant}
                    onSpin={handleParticipantSpin}
                    onSpinComplete={handleSpinComplete}
                  />
                ) : (
                  <TaskRoulette
                    participants={taskState.participants}
                    tasks={taskState.tasks}
                    taskHistory={taskState.taskHistory}
                    isSpinning={taskState.isSpinning}
                    selectedParticipant={taskState.selectedParticipant}
                    currentTask={taskActions.getCurrentTask()}
                    onSpin={handleTaskSpin}
                    onSpinComplete={handleTaskSpinComplete}
                  />
                )}
              </RouletteSection>
            </motion.div>
          </MainContent>

          <SidePanel
            isOpen={isPanelOpen}
            onToggle={togglePanel}
            participants={
              settings.rouletteMode === 'participants' ? state.participants :
              taskState.participants
            }
            history={state.history}
            tasks={taskState.tasks}
            taskHistory={taskState.taskHistory}
            settings={settings}
            onAddParticipant={
              settings.rouletteMode === 'participants' ? actions.addParticipant :
              taskActions.addParticipant
            }
            onAddParticipantsBulk={
              settings.rouletteMode === 'participants' ? actions.addParticipantsBulk :
              taskActions.addParticipantsBulk
            }
            onRemoveParticipant={
              settings.rouletteMode === 'participants' ? actions.removeParticipant :
              taskActions.removeParticipant
            }
            onClearParticipants={
              settings.rouletteMode === 'participants' ? actions.clearParticipants :
              taskActions.clearParticipants
            }
            onRemoveFromRoulette={actions.removeFromRouletteAfterSpin}
            onClearHistory={actions.clearHistory}
            onAddTask={taskActions.addTask}
            onAddTasksBulk={taskActions.addTasksBulk}
            onRemoveTask={taskActions.removeTask}
            onClearTasks={taskActions.clearTasks}
            onClearTaskHistory={taskActions.clearTaskHistory}
            onSettingsChange={handleSettingsChange}
            onResetSettings={handleResetSettings}
          />

          <WinnerModal
            isOpen={showWinnerModal}
            winner={currentWinner}
            task={currentTask}
            autoCloseDuration={settings.winnerDisplayDuration}
            onClose={handleCloseWinnerModal}
            mode={settings.rouletteMode}
          />
          
        </Container>
      </AppContainer>
    </>
  );
}

export default App;