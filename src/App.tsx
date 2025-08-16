import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GlobalStyles, Container } from './styles/GlobalStyles';
import { Roulette } from './components/Roulette/Roulette';
import { SidePanel } from './components/SidePanel/SidePanel';
import { useRoulette } from './hooks/useRoulette';
import type { Participant } from './types';

const AppContainer = styled.div`
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(79, 172, 254, 0.1) 0%, transparent 50%);
  background-attachment: fixed;
  padding: 2rem 0;
`;

const Header = styled(motion.header)`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const MainTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
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

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 1rem;
  width: 100vw;
  
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

function App() {
  const { state, actions } = useRoulette();

  const handleSpinComplete = (selected?: Participant) => {
    actions.finishSpin(selected);
    
    // Trigger confetti animation
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
    
    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: colors,
      });
    }, 300);
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
                <Roulette
                  participants={state.participants}
                  isSpinning={state.isSpinning}
                  selectedParticipant={state.selectedParticipant}
                  onSpin={actions.spinRoulette}
                  onSpinComplete={handleSpinComplete}
                />
              </RouletteSection>
            </motion.div>
          </MainContent>

          <SidePanel
            participants={state.participants}
            history={state.history}
            onAddParticipant={actions.addParticipant}
            onRemoveParticipant={actions.removeParticipant}
            onClearParticipants={actions.clearParticipants}
            onRemoveFromRoulette={actions.removeFromRouletteAfterSpin}
            onClearHistory={actions.clearHistory}
          />
        </Container>
      </AppContainer>
    </>
  );
}

export default App;