import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant } from '../../types';
import { calculateRouletteRotation, getContrastColor, getRouletteColors } from '../../utils/helpers';

interface RouletteProps {
  participants: Participant[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  onSpin: () => Promise<Participant | null>;
  onSpinComplete: (selected?: Participant) => void;
}

const RouletteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RouletteWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 0 50px rgba(102, 126, 234, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.1);
  border: 8px solid rgba(255, 255, 255, 0.2);
  margin: 1rem;
`;

const WheelSVG = styled(motion.svg)<{ size: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const CenterCircle = styled.div<{ size: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => Math.max(30, props.size * 0.08)}px;
  height: ${props => Math.max(30, props.size * 0.08)}px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  z-index: 10;
`;

const RoulettePointer = styled.div<{ size: number }>`
  position: absolute;
  top: ${props => Math.max(-12, -props.size * 0.03)}px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: ${props => Math.max(12, props.size * 0.03)}px solid transparent;
  border-right: ${props => Math.max(12, props.size * 0.03)}px solid transparent;
  border-top: ${props => Math.max(24, props.size * 0.06)}px solid #ff4757;
  z-index: 20;
  filter: drop-shadow(0 4px 8px rgba(255, 71, 87, 0.4));
  
  &::after {
    content: '';
    position: absolute;
    top: ${props => -Math.max(24, props.size * 0.06)}px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => Math.max(10, props.size * 0.025)}px;
    height: ${props => Math.max(10, props.size * 0.025)}px;
    background: #ff4757;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 71, 87, 0.6);
  }
`;

const ParticipantText = styled.text<{ $textColor: string; $fontSize: number }>`
  fill: ${props => props.$textColor};
  font-size: ${props => props.$fontSize}px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
  pointer-events: none;
`;

const SpinButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
`;


const SpinButton = styled(motion.button)<{ disabled: boolean }>`
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 180px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 1.125rem;
    min-width: 160px;
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

const EmptyWheel = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;


function createSegmentPath(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number): string {
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export const Roulette: React.FC<RouletteProps> = React.memo(({
  participants,
  isSpinning,
  selectedParticipant,
  onSpin,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(400);
  const [spinState, setSpinState] = useState<'idle' | 'spinning' | 'completed'>('idle');
  const selectedParticipantRef = useRef<Participant | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Use almost full screen, just reserve space for header and some padding
      const availableHeight = height - 180; // Minimal space for header
      const availableWidth = width - 60; // Minimal margins (30px each side)
      
      // Calculate optimal size to use most of the screen
      const maxSize = Math.min(
        availableWidth * 0.9,   // 90% of available width
        availableHeight * 0.75, // 75% of available height
        800 // Maximum size limit increased
      );
      
      // Set minimum sizes based on screen size
      let minSize;
      if (width < 480) {
        minSize = 300;
      } else if (width < 768) {
        minSize = 350;
      } else if (width < 1024) {
        minSize = 420;
      } else {
        minSize = 480;
      }
      
      setWheelSize(Math.max(minSize, maxSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // State machine logic
  useEffect(() => {
    if (!isSpinning && spinState === 'spinning') {
      // External spin stopped, reset state
      setSpinState('idle');
      selectedParticipantRef.current = null;
    }
  }, [isSpinning, spinState]);

  // Handle completed state
  useEffect(() => {
    if (spinState === 'completed' && selectedParticipantRef.current) {
      const winner = selectedParticipantRef.current;
      selectedParticipantRef.current = null;
      setSpinState('idle');
      onSpinComplete(winner);
    }
  }, [spinState, onSpinComplete]);

  const handleSpin = async () => {
    if (participants.length === 0 || spinState !== 'idle') return;

    // Transition to spinning state
    setSpinState('spinning');

    // Get the selected participant
    const selected = await onSpin();
    
    if (selected) {
      selectedParticipantRef.current = selected;
      
      const selectedIndex = participants.findIndex(p => p.id === selected.id);
      const extraRotations = 6;
      
      const rotationToAdd = calculateRouletteRotation(selectedIndex, participants.length, rotation, extraRotations);
      const newRotation = rotation + rotationToAdd;
      setRotation(newRotation);
    }
  };


  if (participants.length === 0) {
    return (
      <RouletteContainer>
        <RouletteWrapper>
          <EmptyWheel size={wheelSize}>
            Adicione participantes para começar
          </EmptyWheel>
        </RouletteWrapper>
      </RouletteContainer>
    );
  }

  const radius = wheelSize / 2 - 4; // Account for border
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const segmentAngle = (2 * Math.PI) / participants.length;
  
  // Calculate appropriate font size based on wheel size and number of participants
  const fontSize = Math.max(8, Math.min(16, (wheelSize * 0.8) / participants.length));
  
  // Get optimally distributed colors for all participants
  const rouletteColors = getRouletteColors(participants.length);

  return (
    <RouletteContainer>
      <RouletteWrapper>
        <RoulettePointer size={wheelSize} />
        <WheelContainer size={wheelSize}>
          <WheelSVG
            size={wheelSize}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            animate={{ rotate: rotation }}
            transition={{
              duration: spinState === 'spinning' ? 4.5 : 0,
              ease: [0.2, 0, 0.2, 1],
            }}
            onAnimationComplete={() => {
              if (spinState === 'spinning') {
                setSpinState('completed');
              }
            }}
          >
            {/* Create segments */}
            {participants.map((participant, index) => {
              const startAngle = index * segmentAngle - Math.PI / 2; // Start from top (-90 degrees)
              const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
              const isSelected = selectedParticipant?.id === participant.id && !isSpinning;
              
              // Calculate text position
              const textAngle = startAngle + segmentAngle / 2;
              const textRadius = radius * 0.45; // Closer to center for better visibility
              const textX = centerX + textRadius * Math.cos(textAngle);
              const textY = centerY + textRadius * Math.sin(textAngle);
              
              // Get color for this participant - use predefined color or optimally distributed color
              const participantColor = participant.color || rouletteColors[index];
              
              return (
                <g key={participant.id}>
                  <path
                    d={createSegmentPath(centerX, centerY, radius, startAngle, endAngle)}
                    fill={participantColor}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    style={{
                      filter: isSelected ? 'brightness(1.3) saturate(1.4)' : 'brightness(1.1)',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                  <ParticipantText
                    x={textX}
                    y={textY}
                    $textColor={getContrastColor(participantColor)}
                    $fontSize={fontSize}
                    transform={`rotate(${(textAngle * 180) / Math.PI}, ${textX}, ${textY})`}
                  >
                    {participant.name}
                  </ParticipantText>
                </g>
              );
            })}
          </WheelSVG>
        </WheelContainer>
        <CenterCircle size={wheelSize} />
      </RouletteWrapper>

      <SpinButtonContainer>
        <SpinButton
          disabled={isSpinning || participants.length === 0}
          onClick={handleSpin}
          whileHover={!(isSpinning || participants.length === 0) ? { scale: 1.02 } : {}}
          whileTap={!(isSpinning || participants.length === 0) ? { scale: 0.98 } : {}}
        >
          {isSpinning ? 'Girando...' : '🎰 Girar Roleta'}
        </SpinButton>
      </SpinButtonContainer>

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
});