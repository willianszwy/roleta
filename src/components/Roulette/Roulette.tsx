import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant } from '../../types';
import { calculateRouletteRotation, getContrastColor } from '../../utils/helpers';

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
`;

const WheelSVG = styled(motion.svg)<{ size: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const CenterCircle = styled.div`
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

const ParticipantText = styled.text<{ textColor: string; fontSize: number }>`
  fill: ${props => props.textColor};
  font-size: ${props => props.fontSize}px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
  pointer-events: none;
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

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE',
  '#AED6F1', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB'
];

function createSegmentPath(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number): string {
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export const Roulette: React.FC<RouletteProps> = ({
  participants,
  isSpinning,
  selectedParticipant,
  onSpin,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(400);

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
      
      setTimeout(() => {
        onSpinComplete();
      }, 3000);
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
  const fontSize = Math.max(10, Math.min(16, wheelSize / participants.length / 3));

  return (
    <RouletteContainer>
      <RouletteWrapper>
        <RoulettePointer />
        <WheelContainer size={wheelSize}>
          <WheelSVG
            size={wheelSize}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            animate={{ rotate: rotation }}
            transition={{
              duration: isSpinning ? 3 : 0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Create segments */}
            {participants.map((participant, index) => {
              const startAngle = index * segmentAngle - Math.PI / 2; // Start from top
              const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
              const isSelected = selectedParticipant?.id === participant.id;
              
              // Calculate text position
              const textAngle = startAngle + segmentAngle / 2;
              const textRadius = radius * 0.65;
              const textX = centerX + textRadius * Math.cos(textAngle);
              const textY = centerY + textRadius * Math.sin(textAngle);
              
              // Get color for this participant
              const participantColor = participant.color || colors[index % colors.length];
              
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
                    textColor={getContrastColor(participantColor)}
                    fontSize={fontSize}
                    transform={`rotate(${(textAngle * 180) / Math.PI + 90}, ${textX}, ${textY})`}
                  >
                    {participant.name.length > 15 ? `${participant.name.slice(0, 15)}...` : participant.name}
                  </ParticipantText>
                </g>
              );
            })}
          </WheelSVG>
        </WheelContainer>
        <CenterCircle />
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