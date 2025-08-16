import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GlobalStyles, Container } from './styles/GlobalStyles';
import { Roulette } from './components/Roulette/Roulette';
import { PrizeRoulette } from './components/PrizeRoulette/PrizeRoulette';
import { TaskRoulette } from './components/TaskRoulette/TaskRoulette';
import { SidePanel } from './components/SidePanel/SidePanel';
import { WinnerModal, generateSpecialResult, type SpecialResultType } from './components/WinnerModal/WinnerModal';
import { useRoulette } from './hooks/useRoulette';
import { usePrizeRoulette } from './hooks/usePrizeRoulette';
import { useTaskRoulette } from './hooks/useTaskRoulette';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Participant, Prize, Task } from './types';
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
  padding: 2rem 0;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    background: 
      radial-gradient(ellipse 200vw 50vh at 50% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 70%),
      radial-gradient(ellipse 150vw 40vh at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
      #0f0f23;
    background-attachment: scroll;
  }
`;

const Header = styled(motion.header)`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const MainTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #8b5cf6 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #6b7280;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Attribution = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  backdrop-filter: blur(10px);
  z-index: 999;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  @media (max-width: 768px) {
    position: relative;
    margin: 1rem auto;
    text-align: center;
    background: transparent;
    backdrop-filter: none;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    min-height: calc(100vh - 100px);
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
  const { state: prizeState, actions: prizeActions } = usePrizeRoulette();
  const { state: taskState, actions: taskActions } = useTaskRoulette();
  const [settings, setSettings] = useLocalStorage<SettingsConfig>('luckywheel-settings', defaultSettings);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [specialResult, setSpecialResult] = useState<SpecialResultType | null>(null);

  const handleSpinComplete = (selected?: Participant) => {
    actions.finishSpin(selected);
    
    if (selected) {
      setCurrentWinner(selected);
      
      // Generate special result based on toggle setting
      if (settings.showWinnerModal) {
        // settings.sorteioBomRuim = true means "sorteio de sortudo"
        // settings.sorteioBomRuim = false means "sorteio de azarado"
        const isGoodResult = settings.sorteioBomRuim;
        const results = isGoodResult ? 
          [
            { title: "Sortudo!", description: "A sorte está com você hoje! 🎉", emoji: "🍀", isGood: true },
            { title: "Pessoa Sortuda!", description: "O destino sorriu para você!", emoji: "✨", isGood: true },
            { title: "Dia de Sorte!", description: "Você está em um dia de muita sorte!", emoji: "🌟", isGood: true },
            { title: "Vencedor Sortudo!", description: "Venceu e ainda por cima é sortudo!", emoji: "👑", isGood: true },
            { title: "Estrela da Sorte!", description: "As estrelas estão alinhadas para você!", emoji: "⭐", isGood: true }
          ] :
          [
            { title: "Azarado!", description: "Parabéns... você foi o escolhido para dar azar! 😏", emoji: "😅", isGood: false },
            { title: "Que Sorte... NÃO!", description: "Ops! Parece que hoje não é seu dia de sorte!", emoji: "🎲", isGood: false },
            { title: "Escolhido pelo Azar!", description: "De todas as pessoas... foi você quem deu azar! 🤭", emoji: "🌪️", isGood: false },
            { title: "Sem Sorte Mesmo!", description: "Conseguiu ser sorteado E dar azar ao mesmo tempo!", emoji: "⚖️", isGood: false },
            { title: "O Azarado da Vez!", description: "Sua missão hoje: ser a pessoa menos sortuda! 😈", emoji: "🎭", isGood: false }
          ];
        
        const randomResult = results[Math.floor(Math.random() * results.length)];
        setSpecialResult(randomResult);
      } else {
        setSpecialResult(null);
      }
      
      // Show winner modal if enabled
      if (settings.showWinnerModal) {
        setShowWinnerModal(true);
      }
      
      // Auto remove winner if enabled
      if (settings.autoRemoveWinner) {
        setTimeout(() => {
          actions.removeParticipant(selected.id);
        }, settings.showWinnerModal ? (settings.winnerDisplayDuration * 1000) + 500 : 2000);
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

  const handlePrizeSpinComplete = (selectedParticipant?: Participant, selectedPrize?: Prize) => {
    prizeActions.finishPrizeSpin(selectedParticipant, selectedPrize);
    
    if (selectedParticipant && selectedPrize) {
      setCurrentWinner(selectedParticipant);
      setCurrentPrize(selectedPrize);
      
      // Show winner modal if enabled
      if (settings.showWinnerModal) {
        setShowWinnerModal(true);
      }
      
      // Trigger confetti animation only if modal is disabled
      if (!settings.showWinnerModal) {
        const colors = ['#8b5cf6', '#a855f7', '#667eea', '#4facfe', '#00f2fe', '#3b82f6'];
        
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
    setCurrentPrize(null);
    setCurrentTask(null);
    setSpecialResult(null);
  };

  const handleSettingsChange = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Container>
          <Header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MainTitle>🎰 LuckyWheel</MainTitle>
          </Header>

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
                    onSpin={actions.spinRoulette}
                    onSpinComplete={handleSpinComplete}
                  />
                ) : settings.rouletteMode === 'prizes' ? (
                  <PrizeRoulette
                    participants={prizeState.participants}
                    prizes={prizeState.prizes}
                    isSpinning={prizeState.isSpinning}
                    selectedParticipant={prizeState.selectedParticipant}
                    selectedPrize={prizeState.selectedPrize}
                    onSpin={prizeActions.spinPrizeRoulette}
                    onSpinComplete={handlePrizeSpinComplete}
                  />
                ) : (
                  <TaskRoulette
                    participants={taskState.participants}
                    tasks={taskState.tasks}
                    isSpinning={taskState.isSpinning}
                    selectedParticipant={taskState.selectedParticipant}
                    selectedTask={taskState.selectedTask}
                    onSpin={taskActions.spinTaskRoulette}
                    onSpinComplete={handleTaskSpinComplete}
                  />
                )}
              </RouletteSection>
            </motion.div>
          </MainContent>

          <SidePanel
            participants={
              settings.rouletteMode === 'participants' ? state.participants :
              settings.rouletteMode === 'prizes' ? prizeState.participants :
              taskState.participants
            }
            history={state.history}
            prizes={prizeState.prizes}
            prizeHistory={prizeState.prizeHistory}
            tasks={taskState.tasks}
            taskHistory={taskState.taskHistory}
            settings={settings}
            onAddParticipant={
              settings.rouletteMode === 'participants' ? actions.addParticipant :
              settings.rouletteMode === 'prizes' ? prizeActions.addParticipant :
              taskActions.addParticipant
            }
            onAddParticipantsBulk={
              settings.rouletteMode === 'participants' ? actions.addParticipantsBulk :
              settings.rouletteMode === 'prizes' ? prizeActions.addParticipantsBulk :
              taskActions.addParticipantsBulk
            }
            onRemoveParticipant={
              settings.rouletteMode === 'participants' ? actions.removeParticipant :
              settings.rouletteMode === 'prizes' ? prizeActions.removeParticipant :
              taskActions.removeParticipant
            }
            onClearParticipants={
              settings.rouletteMode === 'participants' ? actions.clearParticipants :
              settings.rouletteMode === 'prizes' ? prizeActions.clearParticipants :
              taskActions.clearParticipants
            }
            onRemoveFromRoulette={actions.removeFromRouletteAfterSpin}
            onClearHistory={actions.clearHistory}
            onAddPrize={prizeActions.addPrize}
            onAddPrizesBulk={prizeActions.addPrizesBulk}
            onRemovePrize={prizeActions.removePrize}
            onClearPrizes={prizeActions.clearPrizes}
            onClearPrizeHistory={prizeActions.clearPrizeHistory}
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
            prize={currentPrize}
            task={currentTask}
            specialResult={specialResult}
            autoCloseDuration={settings.winnerDisplayDuration}
            onClose={handleCloseWinnerModal}
            mode={settings.rouletteMode}
          />
          
          <Attribution>
            Uicons by <a href="https://www.flaticon.com/uicons" target="_blank" rel="noopener noreferrer">Flaticon</a>
          </Attribution>
        </Container>
      </AppContainer>
    </>
  );
}

export default App;