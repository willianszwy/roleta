import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import confetti from 'canvas-confetti';
import type { Participant, Task } from '../../types';

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const Sparkle = styled.div<{ x: number; y: number; delay: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  font-size: 1.5rem;
  animation: ${sparkleAnimation} 2s infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
`;

interface WinnerModalProps {
  isOpen: boolean;
  winner: Participant | null;
  task?: Task | null;
  autoCloseDuration: number; // 0 = manual close
  onClose: () => void;
  mode?: 'participants' | 'tasks';
}

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
    <div data-testid="winner-modal" style={{
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
              <span data-testid="winner-name">{winner.name}</span>
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
                <div data-testid="task-name" style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>{task.name}</div>
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

