import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant } from '../../types';
import { calculateRouletteRotation, getContrastColor, getGradientColors } from '../../utils/helpers';

interface RouletteProps {
  participants: Participant[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  onSpin: () => Promise<Participant | null>;
  onSpinComplete: () => void;
}

const RouletteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const RouletteWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RouletteWheel = styled(motion.div)<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  position: relative;
  border: 8px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 0 50px rgba(102, 126, 234, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.1);
  background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    z-index: 10;
  }
`;

const RouletteSegment = styled.div<{ 
  angle: number; 
  rotation: number; 
  gradient: string;
  isSelected?: boolean;
}>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: right bottom;
  transform: rotate(${props => props.rotation}deg);
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
  background: ${props => props.gradient};
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  ${props => props.isSelected && `
    filter: brightness(1.2) saturate(1.3);
    z-index: 5;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.8;
  }
`;

const ParticipantName = styled.div<{ 
  angle: number; 
  rotation: number; 
  radius: number;
  textColor: string;
}>`
  position: absolute;
  width: ${props => props.radius * 0.7}px;
  transform-origin: right bottom;
  transform: rotate(${props => props.rotation + props.angle / 2}deg);
  left: 50%;
  bottom: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  font-size: ${props => Math.min(14, props.radius / 15)}px;
  font-weight: 600;
  color: ${props => props.textColor};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoulettePointer = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ff4757;
  z-index: 20;
  filter: drop-shadow(0 4px 8px rgba(255, 71, 87, 0.4));
  
  &::after {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: #ff4757;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 71, 87, 0.6);
  }
`;

const SpinButton = styled(motion.button)<{ disabled: boolean }>`
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 160px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ResultDisplay = styled(motion.div)`
  text-align: center;
  margin-top: 1rem;
`;

const WinnerText = styled.h2`
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const WinnerName = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(240, 147, 251, 0.3);
`;

export const Roulette: React.FC<RouletteProps> = ({
  participants,
  isSpinning,
  selectedParticipant,
  onSpin,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(400);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setWheelSize(280);
      } else if (width < 1024) {
        setWheelSize(350);
      } else {
        setWheelSize(400);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSpin = async () => {
    if (participants.length === 0 || isSpinning) return;

    const selected = await onSpin();
    
    if (selected) {
      const selectedIndex = participants.findIndex(p => p.id === selected.id);
      const newRotation = rotation + calculateRouletteRotation(selectedIndex, participants.length);
      setRotation(newRotation);
      
      // Complete spin after animation
      setTimeout(() => {
        onSpinComplete();
      }, 3000);
    }
  };

  if (participants.length === 0) {
    return (
      <RouletteContainer>
        <RouletteWrapper>
          <RouletteWheel 
            size={wheelSize}
            style={{
              background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '1.2rem',
              fontWeight: '600',
            }}
          >
            Adicione participantes para começar
          </RouletteWheel>
        </RouletteWrapper>
      </RouletteContainer>
    );
  }

  const segmentAngle = 360 / participants.length;
  const gradients = getGradientColors(participants.length);

  return (
    <RouletteContainer>
      <RouletteWrapper>
        <RoulettePointer />
        <RouletteWheel
          ref={wheelRef}
          size={wheelSize}
          animate={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
          }}
        >
          {participants.map((participant, index) => {
            const segmentRotation = index * segmentAngle;
            const isSelected = selectedParticipant?.id === participant.id;
            
            return (
              <React.Fragment key={participant.id}>
                <RouletteSegment
                  angle={segmentAngle}
                  rotation={segmentRotation}
                  gradient={gradients[index]}
                  isSelected={isSelected}
                />
                <ParticipantName
                  angle={segmentAngle}
                  rotation={segmentRotation}
                  radius={wheelSize / 2}
                  textColor={getContrastColor(participant.color || '#000000')}
                >
                  {participant.name}
                </ParticipantName>
              </React.Fragment>
            );
          })}
        </RouletteWheel>
      </RouletteWrapper>

      <SpinButton
        disabled={isSpinning || participants.length === 0}
        onClick={handleSpin}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSpinning ? 'Girando...' : 'Girar Roleta'}
      </SpinButton>

      <AnimatePresence>
        {selectedParticipant && !isSpinning && (
          <ResultDisplay
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <WinnerText>🎉 Vencedor 🎉</WinnerText>
            <WinnerName>{selectedParticipant.name}</WinnerName>
          </ResultDisplay>
        )}
      </AnimatePresence>
    </RouletteContainer>
  );
};