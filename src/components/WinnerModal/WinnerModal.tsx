import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Participant, Task } from '../../types';


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
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  will-change: opacity;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    max-width: 90vw;
    margin: 0 auto;
  }
`;

const WinnerTitle = styled(motion.h1)`
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #8b5cf6 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  word-break: break-word;
  hyphens: auto;
`;

const WinnerName = styled(motion.div)`
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
  }
`;


const TaskDisplay = styled(motion.div)`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 0.75rem;
  backdrop-filter: blur(8px);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin: 0.75rem 0;
  }
`;


const TaskLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;


const TaskName = styled.div`
  font-size: clamp(1rem, 3vw, 1.3rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1.3;
  word-break: break-word;
  hyphens: auto;
  overflow-wrap: break-word;
`;

const TaskDescription = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  font-style: italic;
`;

const SpecialResult = styled(motion.div)<{ isGood: boolean }>`
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${props => props.isGood 
    ? 'rgba(34, 197, 94, 0.1)'
    : 'rgba(239, 68, 68, 0.1)'
  };
  border: 1px solid ${props => props.isGood 
    ? 'rgba(34, 197, 94, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'
  };
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin: 0.75rem 0;
  }
`;

const SpecialTitle = styled.div<{ isGood: boolean }>`
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 600;
  color: ${props => props.isGood 
    ? 'rgba(34, 197, 94, 0.9)' 
    : 'rgba(239, 68, 68, 0.9)'
  };
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  line-height: 1.3;
  word-break: break-word;
`;

const SpecialDescription = styled.div`
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  word-break: break-word;
  hyphens: auto;
  overflow-wrap: break-word;
`;

const CloseButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 0.75rem;
  color: #a5b4fc;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.6);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const Sparkle = styled.div.withConfig({
  shouldForwardProp: (prop) => !['delay', 'x', 'y'].includes(prop),
})<{ delay: number; x: number; y: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  animation: ${sparkleAnimation} 1.5s infinite;
  animation-delay: ${props => props.delay}s;
  will-change: transform, opacity;
`;

const AutoCloseIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    bottom: 0.5rem;
    gap: 0.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const CountdownBar = styled(motion.div)<{ duration: number }>`
  width: 50px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 480px) {
    width: 40px;
    height: 2px;
  }
  
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
  task?: Task | null;
  autoCloseDuration: number; // 0 = manual close
  onClose: () => void;
  mode?: 'participants' | 'tasks';
}

const goodResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Sortudo!", description: "A sorte está com você hoje!", emoji: "+" },
  { title: "Pessoa Sortuda!", description: "O destino sorriu para você!", emoji: "+" },
  { title: "Dia de Sorte!", description: "Você está em um dia de muita sorte!", emoji: "+" },
  { title: "Vencedor Sortudo!", description: "Venceu e ainda por cima é sortudo!", emoji: "+" },
  { title: "Estrela da Sorte!", description: "As estrelas estão alinhadas para você!", emoji: "+" }
];

const badResults: Omit<SpecialResultType, 'isGood'>[] = [
  { title: "Azarado!", description: "Não foi dessa vez... você deu azar!", emoji: "-" },
  { title: "Pessoa Azarada!", description: "O azar decidiu te visitar hoje!", emoji: "-" },
  { title: "Que Azar!", description: "Venceu mas o azar estava presente!", emoji: "-" },
  { title: "Sem Sorte!", description: "Desta vez a sorte não estava do seu lado!", emoji: "-" },
  { title: "Vencedor Azarado!", description: "Ganhou o sorteio mas perdeu na sorte!", emoji: "-" }
];

export function WinnerModal({ 
  isOpen, 
  winner, 
  task,
  autoCloseDuration, 
  onClose,
  mode = 'participants'
}: WinnerModalProps) {
  const [sparkles, setSparkles] = useState<Array<{x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    if (isOpen && winner) {
      // Trigger confetti with optimized performance
      const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fbbf24'];
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2,
        drift: 0,
        ticks: 300
      });

      // Generate sparkles for visual effect
      const newSparkles = Array.from({ length: 6 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5
      }));
      setSparkles(newSparkles);

      // Auto close timer
      if (autoCloseDuration > 0) {
        const timer = setTimeout(onClose, autoCloseDuration * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, winner, autoCloseDuration, onClose]);

  if (!winner) {
    return null;
  }

  // TEMP: Simplified modal without AnimatePresence for testing
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 15, 35, 0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '1rem',
        padding: '2rem 1.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
      }} onClick={(e) => e.stopPropagation()}>
            {sparkles.map((sparkle, index) => (
              <Sparkle
                key={index}
                x={sparkle.x}
                y={sparkle.y}
                delay={sparkle.delay}
              />
            ))}

            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              {mode === 'tasks' ? "TAREFA SORTEADA!" : "VENCEDOR!"}
            </h1>

            <div style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {winner.name}
            </div>


            {mode === 'tasks' && task && (
              <div style={{
                margin: '1rem 0',
                padding: '1rem',
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>vai fazer</div>
                <div style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>{task.name}</div>
                {task.description && (
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>{task.description}</div>
                )}
              </div>
            )}


            <button
              onClick={onClose}
              style={{
                background: 'rgba(102, 126, 234, 0.2)',
                border: '1px solid rgba(102, 126, 234, 0.4)',
                borderRadius: '0.75rem',
                color: '#a5b4fc',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Fechar
            </button>

            {autoCloseDuration > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px'
                }} />
                <span>Fechando...</span>
              </div>
            )}
      </div>
    </div>
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