import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant, Task } from '../../types';
import { calculateRouletteRotation, getContrastColor, selectRandomParticipant } from '../../utils/helpers';

interface TaskRouletteProps {
  participants: Participant[];
  tasks: Task[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  selectedTask?: Task;
  onSpin: () => void;
  onSpinComplete: (participant?: Participant, task?: Task) => void;
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
`;

const DualRouletteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const WheelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const WheelTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
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
  border: 6px solid rgba(255, 255, 255, 0.2);
`;

const TaskWheelContainer = styled(WheelContainer)`
  box-shadow: 
    0 0 50px rgba(79, 172, 254, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.1);
`;

const WheelSVG = styled(motion.svg)<{ size: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const CenterCircle = styled.div<{ size: number; variant: 'participant' | 'task' }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => Math.max(25, props.size * 0.08)}px;
  height: ${props => Math.max(25, props.size * 0.08)}px;
  background: ${props => props.variant === 'participant' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  };
  border-radius: 50%;
  box-shadow: ${props => props.variant === 'participant'
    ? '0 4px 20px rgba(102, 126, 234, 0.4)'
    : '0 4px 20px rgba(79, 172, 254, 0.4)'
  };
  z-index: 10;
`;

const RoulettePointer = styled.div<{ size: number; variant: 'participant' | 'task' }>`
  position: absolute;
  top: ${props => Math.max(-10, -props.size * 0.025)}px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: ${props => Math.max(10, props.size * 0.025)}px solid transparent;
  border-right: ${props => Math.max(10, props.size * 0.025)}px solid transparent;
  border-top: ${props => Math.max(20, props.size * 0.05)}px solid ${props => props.variant === 'participant' ? '#667eea' : '#4facfe'};
  z-index: 20;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  
  &::after {
    content: '';
    position: absolute;
    top: ${props => -Math.max(20, props.size * 0.05)}px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => Math.max(8, props.size * 0.02)}px;
    height: ${props => Math.max(8, props.size * 0.02)}px;
    background: ${props => props.variant === 'participant' ? '#667eea' : '#4facfe'};
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }
`;

const ItemText = styled.text<{ $textColor: string; $fontSize: number }>`
  fill: ${props => props.$textColor};
  font-size: ${props => props.$fontSize}px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const SpinButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(102, 126, 234, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ResultContainer = styled(motion.div)`
  text-align: center;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  max-width: 500px;
`;

const ResultTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ResultText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0;
  line-height: 1.5;
`;

const ParticipantName = styled.span`
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TaskName = styled.span`
  font-weight: 700;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

export const TaskRoulette: React.FC<TaskRouletteProps> = ({
  participants,
  tasks,
  isSpinning,
  selectedParticipant,
  selectedTask,
  onSpin,
  onSpinComplete,
}) => {
  const [participantRotation, setParticipantRotation] = useState(0);
  const [taskRotation, setTaskRotation] = useState(0);
  const wheelSize = 200;

  useEffect(() => {
    if (isSpinning) {
      // Start spinning animation
      const duration = 3000;
      const participantFinalRotation = Math.random() * 360 + 1440; // At least 4 full rotations
      const taskFinalRotation = Math.random() * 360 + 1440;
      
      setParticipantRotation(participantFinalRotation);
      setTaskRotation(taskFinalRotation);

      // After animation, determine winners and complete spin
      setTimeout(() => {
        if (participants.length > 0 && tasks.length > 0) {
          const selectedParticipant = selectRandomParticipant(participants);
          const selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
          onSpinComplete(selectedParticipant, selectedTask);
        }
      }, duration);
    }
  }, [isSpinning, participants, tasks, onSpinComplete]);

  const handleSpin = () => {
    if (!isSpinning && participants.length > 0 && tasks.length > 0) {
      onSpin();
    }
  };

  const renderParticipantWheel = () => {
    if (participants.length === 0) return null;

    const segmentAngle = 360 / participants.length;
    const radius = wheelSize / 2 - 20;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const fontSize = Math.max(10, Math.min(16, 120 / participants.length));

    return (
      <WheelSVG
        size={wheelSize}
        animate={{ rotate: participantRotation }}
        transition={{ duration: isSpinning ? 3 : 0, ease: "easeOut" }}
      >
        {participants.map((participant, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const midAngle = (startAngle + endAngle) / 2;
          
          const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const textX = centerX + (radius * 0.7) * Math.cos((midAngle - 90) * Math.PI / 180);
          const textY = centerY + (radius * 0.7) * Math.sin((midAngle - 90) * Math.PI / 180);
          
          const largeArcFlag = segmentAngle > 180 ? 1 : 0;
          const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          return (
            <g key={participant.id}>
              <path
                d={pathData}
                fill={participant.color || '#667eea'}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              <ItemText
                x={textX}
                y={textY}
                $textColor={getContrastColor(participant.color || '#667eea')}
                $fontSize={fontSize}
                transform={`rotate(${midAngle}, ${textX}, ${textY})`}
              >
                {participant.name}
              </ItemText>
            </g>
          );
        })}
      </WheelSVG>
    );
  };

  const renderTaskWheel = () => {
    if (tasks.length === 0) return null;

    const segmentAngle = 360 / tasks.length;
    const radius = wheelSize / 2 - 20;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const fontSize = Math.max(10, Math.min(16, 120 / tasks.length));

    return (
      <WheelSVG
        size={wheelSize}
        animate={{ rotate: taskRotation }}
        transition={{ duration: isSpinning ? 3 : 0, ease: "easeOut" }}
      >
        {tasks.map((task, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const midAngle = (startAngle + endAngle) / 2;
          
          const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const textX = centerX + (radius * 0.7) * Math.cos((midAngle - 90) * Math.PI / 180);
          const textY = centerY + (radius * 0.7) * Math.sin((midAngle - 90) * Math.PI / 180);
          
          const largeArcFlag = segmentAngle > 180 ? 1 : 0;
          const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          return (
            <g key={task.id}>
              <path
                d={pathData}
                fill={task.color || '#4facfe'}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              <ItemText
                x={textX}
                y={textY}
                $textColor={getContrastColor(task.color || '#4facfe')}
                $fontSize={fontSize}
                transform={`rotate(${midAngle}, ${textX}, ${textY})`}
              >
                {task.name}
              </ItemText>
            </g>
          );
        })}
      </WheelSVG>
    );
  };

  if (participants.length === 0 || tasks.length === 0) {
    return (
      <RouletteContainer>
        <EmptyStateContainer>
          <EmptyStateIcon>🎯</EmptyStateIcon>
          <EmptyStateText>
            {participants.length === 0 && tasks.length === 0 
              ? "Adicione participantes e tarefas para começar o sorteio"
              : participants.length === 0
              ? "Adicione participantes para começar o sorteio"
              : "Adicione tarefas para começar o sorteio"
            }
          </EmptyStateText>
        </EmptyStateContainer>
      </RouletteContainer>
    );
  }

  return (
    <RouletteContainer>
      <DualRouletteWrapper>
        <WheelSection>
          <WheelTitle>👥 Quem vai fazer?</WheelTitle>
          <WheelContainer size={wheelSize}>
            {renderParticipantWheel()}
            <CenterCircle size={wheelSize} variant="participant" />
            <RoulettePointer size={wheelSize} variant="participant" />
          </WheelContainer>
        </WheelSection>

        <WheelSection>
          <WheelTitle>📋 Qual tarefa?</WheelTitle>
          <TaskWheelContainer size={wheelSize}>
            {renderTaskWheel()}
            <CenterCircle size={wheelSize} variant="task" />
            <RoulettePointer size={wheelSize} variant="task" />
          </TaskWheelContainer>
        </WheelSection>
      </DualRouletteWrapper>

      <SpinButton
        onClick={handleSpin}
        disabled={isSpinning}
        whileHover={{ scale: isSpinning ? 1 : 1.05 }}
        whileTap={{ scale: isSpinning ? 1 : 0.95 }}
      >
        {isSpinning ? 'Sorteando...' : 'Sortear Tarefa'}
      </SpinButton>

      <AnimatePresence>
        {selectedParticipant && selectedTask && !isSpinning && (
          <ResultContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ResultTitle>🎯 Resultado do Sorteio</ResultTitle>
            <ResultText>
              <ParticipantName>{selectedParticipant.name}</ParticipantName> vai fazer:
            </ResultText>
            <ResultText>
              <TaskName>{selectedTask.name}</TaskName>
            </ResultText>
            {selectedTask.description && (
              <ResultText style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {selectedTask.description}
              </ResultText>
            )}
          </ResultContainer>
        )}
      </AnimatePresence>
    </RouletteContainer>
  );
};