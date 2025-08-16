import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Participant, Prize } from '../../types';

const confettiAnimation = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(720deg); }
`;

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const WinnerTitle = styled(motion.h1)`
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 30%, #4facfe 70%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(240, 147, 251, 0.3);
`;

const WinnerName = styled(motion.div)`
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

const PrizeDisplay = styled(motion.div)`
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%);
  border: 2px solid rgba(240, 147, 251, 0.4);
  border-radius: 1rem;
  text-align: center;
`;

const PrizeLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const PrizeName = styled.div`
  font-size: clamp(1.2rem, 5vw, 2rem);
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const SpecialResult = styled(motion.div)<{ isGood: boolean }>`
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${props => props.isGood 
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 127, 0.2) 100%)'
  };
  border: 2px solid ${props => props.isGood 
    ? 'rgba(34, 197, 94, 0.4)'
    : 'rgba(239, 68, 68, 0.4)'
  };
`;

const SpecialTitle = styled.div<{ isGood: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.isGood ? '#4ade80' : '#f87171'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SpecialDescription = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Sparkle = styled.div<{ delay: number; x: number; y: number }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fbbf24;
  border-radius: 50%;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  animation: ${sparkleAnimation} 2s infinite;
  animation-delay: ${props => props.delay}s;
`;

const AutoCloseIndicator = styled(motion.div)`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountdownBar = styled(motion.div)<{ duration: number }>`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #fbbf24, #f87171);
    animation: countdown ${props => props.duration}s linear forwards;
  }
  
  @keyframes countdown {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

interface SpecialResultType {
  isGood: boolean;
  title: string;
  description: string;
  emoji: string;
}

interface WinnerModalProps {
  isOpen: boolean;
  winner: Participant | null;
  prize?: Prize | null;
  specialResult: SpecialResultType | null;
  autoCloseDuration: number; // 0 = manual close
  onClose: () => void;
  mode?: 'participants' | 'prizes';
}

const goodResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Sortudo!", description: "A sorte está com você hoje! 🎉", emoji: "🍀" },
  { title: "Pessoa Sortuda!", description: "O destino sorriu para você!", emoji: "✨" },
  { title: "Dia de Sorte!", description: "Você está em um dia de muita sorte!", emoji: "🌟" },
  { title: "Vencedor Sortudo!", description: "Venceu e ainda por cima é sortudo!", emoji: "👑" },
  { title: "Estrela da Sorte!", description: "As estrelas estão alinhadas para você!", emoji: "⭐" }
];

const badResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Azarado!", description: "Não foi dessa vez... você deu azar!", emoji: "😅" },
  { title: "Pessoa Azarada!", description: "O azar decidiu te visitar hoje!", emoji: "🎲" },
  { title: "Que Azar!", description: "Venceu mas o azar estava presente!", emoji: "🌪️" },
  { title: "Sem Sorte!", description: "Desta vez a sorte não estava do seu lado!", emoji: "⚖️" },
  { title: "Vencedor Azarado!", description: "Ganhou o sorteio mas perdeu na sorte!", emoji: "🎭" }
];

export function WinnerModal({ 
  isOpen, 
  winner, 
  prize,
  specialResult, 
  autoCloseDuration, 
  onClose,
  mode = 'participants'
}: WinnerModalProps) {
  const [sparkles, setSparkles] = useState<Array<{x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fbbf24'];
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.7 },
          colors: colors,
        });
      }, 300);

      // Generate sparkles
      const newSparkles = Array.from({ length: 12 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setSparkles(newSparkles);

      // Auto close
      if (autoCloseDuration > 0) {
        const timer = setTimeout(onClose, autoCloseDuration * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!winner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {sparkles.map((sparkle, index) => (
              <Sparkle
                key={index}
                x={sparkle.x}
                y={sparkle.y}
                delay={sparkle.delay}
              />
            ))}

            <WinnerTitle
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mode === 'prizes' 
                ? "🎁 PARABÉNS! 🎁"
                : specialResult?.isGood ? "🎉 VENCEDOR! 🎉" : "😈 QUE AZAR! 😈"
              }
            </WinnerTitle>

            <WinnerName
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", damping: 20 }}
            >
              {winner.name}
            </WinnerName>

            {mode === 'prizes' && prize && (
              <PrizeDisplay
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <PrizeLabel>ganhou</PrizeLabel>
                <PrizeName>🎁 {prize.name}</PrizeName>
              </PrizeDisplay>
            )}

            {mode === 'participants' && specialResult && (
              <SpecialResult
                isGood={specialResult.isGood}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <SpecialTitle isGood={specialResult.isGood}>
                  {specialResult.emoji} {specialResult.title}
                </SpecialTitle>
                <SpecialDescription>
                  {specialResult.description}
                </SpecialDescription>
              </SpecialResult>
            )}

            <CloseButton
              onClick={onClose}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === 'prizes' 
                ? "🎁 Incrível! 🎁"
                : specialResult?.isGood ? "✨ Fantástico! ✨" : "😏 Que Pena! 😏"
              }
            </CloseButton>

            {autoCloseDuration > 0 && (
              <AutoCloseIndicator
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <CountdownBar duration={autoCloseDuration} />
                Fechando automaticamente
              </AutoCloseIndicator>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

export function generateSpecialResult(): SpecialResultType {
  const isGood = Math.random() > 0.5;
  const results = isGood ? goodResults : badResults;
  const selected = results[Math.floor(Math.random() * results.length)];
  
  return {
    ...selected,
    isGood
  };
}

export type { SpecialResultType };