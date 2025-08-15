import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GlobalStyles, Container } from './styles/GlobalStyles';
import { Roulette } from './components/Roulette/Roulette';
import { ParticipantManager } from './components/ParticipantManager/ParticipantManager';
import { History } from './components/History/History';
import { useRoulette } from './hooks/useRoulette';

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
  margin-bottom: 3rem;
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
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
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    
    > :last-child {
      grid-column: 1 / -1;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const RouletteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

function App() {
  const { state, actions } = useRoulette();

  const handleSpinComplete = () => {
    actions.finishSpin();
    
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
            <MainTitle>🎰 Roleta Premium</MainTitle>
            <Subtitle>
              Sorteios justos e divertidos com a mais moderna interface.
              Adicione participantes, gire a roleta e descubra o vencedor!
            </Subtitle>
          </Header>

          <MainContent>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ParticipantManager
                participants={state.participants}
                onAdd={actions.addParticipant}
                onRemove={actions.removeParticipant}
                onClear={actions.clearParticipants}
              />
            </motion.div>

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

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <History
                history={state.history}
                onRemoveFromRoulette={actions.removeFromRouletteAfterSpin}
                onClearHistory={actions.clearHistory}
              />
            </motion.div>
          </MainContent>
        </Container>
      </AppContainer>
    </>
  );
}

export default App;