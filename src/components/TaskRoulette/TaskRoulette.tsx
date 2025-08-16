import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant, Task } from '../../types';
import { calculateRouletteRotation, getContrastColor } from '../../utils/helpers';

interface TaskRouletteProps {
  participants: Participant[];
  tasks: Task[];
  isSpinning: boolean;
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
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const WheelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CurrentTaskDisplay = styled(motion.div)`
  text-align: center;
  padding: 1rem 2rem;
  background: rgba(79, 172, 254, 0.2);
  border: 2px solid rgba(79, 172, 254, 0.4);
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const CurrentTaskLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CurrentTaskName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
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

const TaskListSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;

const TaskCounter = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(79, 172, 254, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 2px;
  }
`;

const TaskItem = styled(motion.div)`
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    width: 3px;
    height: 100%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 1.5px;
    margin-right: 0.75rem;
  }
`;

const TaskName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const EmptyState = styled.div`
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

const CompletionMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 1rem;
  margin-top: 2rem;
`;

const CompletionTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 1rem;
`;

const ResetButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 6px;
  color: #a5b4fc;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.6);
  }
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

export const TaskRoulette: React.FC<TaskRouletteProps> = ({
  participants,
  tasks,
  isSpinning,
  onSpin,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(400);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Responsive wheel sizing
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const availableHeight = height - 180;
      const availableWidth = width - 60;
      
      const maxSize = Math.min(
        availableWidth * 0.9,
        availableHeight * 0.75,
        800
      );
      
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

  // Set current task when tasks change
  useEffect(() => {
    if (!currentTask) {
      const availableTasks = tasks.filter(task => !completedTasks.includes(task.id));
      const nextTask = availableTasks.length > 0 ? availableTasks[0] : null;
      setCurrentTask(nextTask);
    }
  }, [tasks, completedTasks, currentTask]);

  // Handle spinning logic
  useEffect(() => {
    if (isSpinning && currentTask && participants.length > 0) {
      // Select random participant
      const selectedParticipant = participants[Math.floor(Math.random() * participants.length)];
      const selectedIndex = participants.findIndex(p => p.id === selectedParticipant.id);
      
      const duration = 4.5;
      const extraRotations = 6;
      
      const rotationToAdd = calculateRouletteRotation(selectedIndex, participants.length, rotation, extraRotations);
      const newRotation = rotation + rotationToAdd;
      setRotation(newRotation);
      
      setTimeout(() => {
        // Complete the current task
        setCompletedTasks(prev => [...prev, currentTask.id]);
        
        // Move to next task
        const remainingTasks = tasks.filter(task => !completedTasks.includes(task.id) && task.id !== currentTask.id);
        const nextTask = remainingTasks.length > 0 ? remainingTasks[0] : null;
        setCurrentTask(nextTask);
        
        onSpinComplete(selectedParticipant, currentTask);
      }, duration * 1000);
    }
  }, [isSpinning, participants, currentTask, onSpinComplete, tasks, completedTasks, rotation]);

  const handleSpin = () => {
    if (!isSpinning && participants.length > 0 && currentTask) {
      onSpin();
    }
  };

  const resetTasks = () => {
    setCompletedTasks([]);
    setCurrentTask(tasks.length > 0 ? tasks[0] : null);
  };

  const availableTasks = tasks.filter(task => !completedTasks.includes(task.id));
  const allTasksCompleted = availableTasks.length === 0 && tasks.length > 0;

  if (participants.length === 0 || tasks.length === 0) {
    return (
      <RouletteContainer>
        <EmptyState>
          <EmptyStateIcon>●</EmptyStateIcon>
          <EmptyStateText>
            {participants.length === 0 && tasks.length === 0 
              ? "Adicione participantes e tarefas para começar o sorteio"
              : participants.length === 0
              ? "Adicione participantes para começar o sorteio"
              : "Adicione tarefas para começar o sorteio"
            }
          </EmptyStateText>
        </EmptyState>
      </RouletteContainer>
    );
  }

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

  const radius = wheelSize / 2 - 4;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const segmentAngle = (2 * Math.PI) / participants.length;
  const fontSize = Math.max(8, Math.min(16, (wheelSize * 0.8) / participants.length));

  return (
    <RouletteContainer>
      <WheelSection>
        {currentTask && (
          <CurrentTaskDisplay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <CurrentTaskLabel>Próxima Tarefa</CurrentTaskLabel>
            <CurrentTaskName>{currentTask.name}</CurrentTaskName>
          </CurrentTaskDisplay>
        )}

        <RouletteWrapper>
          <RoulettePointer size={wheelSize} />
          <WheelContainer size={wheelSize}>
            <WheelSVG
              size={wheelSize}
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              animate={{ rotate: rotation }}
              transition={{
                duration: isSpinning ? 4.5 : 0,
                ease: [0.2, 0, 0.2, 1],
              }}
            >
              {participants.map((participant, index) => {
                const startAngle = index * segmentAngle - Math.PI / 2;
                const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
                
                const textAngle = startAngle + segmentAngle / 2;
                const textRadius = radius * 0.45;
                const textX = centerX + textRadius * Math.cos(textAngle);
                const textY = centerY + textRadius * Math.sin(textAngle);
                
                const participantColor = participant.color || colors[index % colors.length];
                
                return (
                  <g key={participant.id}>
                    <path
                      d={createSegmentPath(centerX, centerY, radius, startAngle, endAngle)}
                      fill={participantColor}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                      style={{
                        filter: 'brightness(1.1)',
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

        <SpinButton
          disabled={isSpinning || !currentTask}
          onClick={handleSpin}
          whileHover={!(isSpinning || !currentTask) ? { scale: 1.02 } : {}}
          whileTap={!(isSpinning || !currentTask) ? { scale: 0.98 } : {}}
        >
          {isSpinning ? 'Sorteando...' : currentTask ? 'Sortear Responsável' : 'Sem tarefas'}
        </SpinButton>
      </WheelSection>

      <TaskListSection>
        <TaskCounter>
          {availableTasks.length} pendente{availableTasks.length !== 1 ? 's' : ''} • {completedTasks.length} concluída{completedTasks.length !== 1 ? 's' : ''}
        </TaskCounter>

        {availableTasks.length > 0 && (
          <TaskList>
            <AnimatePresence>
              {availableTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskName>{task.name}</TaskName>
                </TaskItem>
              ))}
            </AnimatePresence>
          </TaskList>
        )}

        {allTasksCompleted && (
          <CompletionMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CompletionTitle>Todas as tarefas foram concluídas!</CompletionTitle>
            <ResetButton
              onClick={resetTasks}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reiniciar Tarefas
            </ResetButton>
          </CompletionMessage>
        )}
      </TaskListSection>
    </RouletteContainer>
  );
};