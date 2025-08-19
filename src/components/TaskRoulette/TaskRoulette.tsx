import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant, Task, TaskHistory } from '../../types';
import { calculateRouletteRotation, getContrastColor, getRouletteColors } from '../../utils/helpers';
import { useI18n } from '../../i18n';

interface TaskRouletteProps {
  participants: Participant[];
  tasks: Task[];
  taskHistory: TaskHistory[];
  isSpinning: boolean;
  selectedParticipant?: Participant;
  currentTask?: Task;
  onSpin: () => Promise<{ participants: Participant[]; task: Task } | null>;
  onSpinComplete: (participants?: Participant[], task?: Task) => void;
}

const RouletteContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 350px;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

const RouletteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
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

const TaskSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  height: fit-content;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TaskSidebarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TaskCounter = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(79, 172, 254, 0.1);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  
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

const NextTaskBadge = styled.div`
  position: absolute;
  top: -2px;
  right: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
`;

const TaskItem = styled(motion.div)<{ isCompleted?: boolean; isNext?: boolean }>`
  padding: 0.5rem 0.75rem;
  background: ${props => 
    props.isCompleted 
      ? 'rgba(34, 197, 94, 0.1)' 
      : props.isNext 
      ? 'rgba(102, 126, 234, 0.15)'
      : 'rgba(255, 255, 255, 0.06)'
  };
  border: 1px solid ${props => 
    props.isCompleted 
      ? 'rgba(34, 197, 94, 0.3)' 
      : props.isNext
      ? 'rgba(102, 126, 234, 0.4)'
      : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  opacity: ${props => props.isCompleted ? 0.7 : 1};
  position: relative;
  
  ${props => props.isNext && !props.isCompleted && `
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  `}
  
  &::before {
    content: '${props => 
      props.isCompleted ? '✓' : 
      props.isNext ? '▶' : '○'
    }';
    margin-right: 0.5rem;
    font-size: 0.75rem;
    color: ${props => 
      props.isCompleted 
        ? 'rgba(34, 197, 94, 0.8)' 
        : props.isNext
        ? 'rgba(102, 126, 234, 0.9)'
        : 'rgba(255, 255, 255, 0.6)'
    };
  }
`;

const TaskName = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCompleted',
})<{ isCompleted?: boolean }>`
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: ${props => props.isCompleted ? 'line-through' : 'none'};
  flex: 1;
`;

const TaskAssignee = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin-left: 0.5rem;
  font-style: italic;
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
  taskHistory,
  isSpinning,
  selectedParticipant,
  currentTask,
  onSpin,
  onSpinComplete,
}) => {
  const { t } = useI18n();
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(400);
  const [spinState, setSpinState] = useState<'idle' | 'spinning' | 'completed'>('idle');
  const selectedResultRef = useRef<{ participants: Participant[]; task: Task } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate size for grid layout - smaller than single column
      const availableHeight = height - 180;
      const availableWidth = (width * 0.6) - 60; // 60% of screen width minus padding
      
      const maxSize = Math.min(
        availableWidth * 0.9,
        availableHeight * 0.8,
        500 // Reduced max size for two-column layout
      );
      
      let minSize;
      if (width < 480) {
        minSize = 280;
      } else if (width < 768) {
        minSize = 320;
      } else if (width < 1024) {
        minSize = 350;
      } else {
        minSize = 400;
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
      selectedResultRef.current = null;
    }
  }, [isSpinning, spinState]);

  // Handle completed state
  useEffect(() => {
    if (spinState === 'completed' && selectedResultRef.current) {
      const result = selectedResultRef.current;
      selectedResultRef.current = null;
      setSpinState('idle');
      onSpinComplete(result.participants, result.task);
    }
  }, [spinState, onSpinComplete]);

  const handleSpin = async () => {
    if (participants.length === 0 || !currentTask || spinState !== 'idle') return;

    // Transition to spinning state
    setSpinState('spinning');

    const result = await onSpin();
    
    if (result) {
      selectedResultRef.current = result;
      
      const selectedIndex = participants.findIndex(p => p.id === result.participants[0].id);
      const extraRotations = 6;
      
      const rotationToAdd = calculateRouletteRotation(selectedIndex, participants.length, rotation, extraRotations);
      const newRotation = rotation + rotationToAdd;
      setRotation(newRotation);
      
      // onSpinComplete will be called by onAnimationComplete
    }
  };

  if (participants.length === 0 || tasks.length === 0) {
    return (
      <RouletteContainer>
        <RouletteSection>
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
        </RouletteSection>
        
        <TaskSidebar>
          <TaskSidebarTitle>{t('tasks.title')}</TaskSidebarTitle>
          <TaskCounter>{t('tasks.pendingCount', { count: 0, plural: 's' })} • {t('tasks.completedCount', { count: 0, plural: 's' })}</TaskCounter>
          <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            {t('tasks.empty')}
          </div>
        </TaskSidebar>
      </RouletteContainer>
    );
  }

  const radius = wheelSize / 2 - 4;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const segmentAngle = (2 * Math.PI) / participants.length;
  const fontSize = Math.max(8, Math.min(16, (wheelSize * 0.8) / participants.length));
  
  // Get optimally distributed colors for all participants
  const rouletteColors = getRouletteColors(participants.length);

  // Calculate completed tasks from the taskHistory
  const completedTaskIds = new Set(taskHistory.map(history => history.taskId));
  const pendingTasks = tasks.filter(task => !completedTaskIds.has(task.id));
  const completedTasks = tasks.filter(task => completedTaskIds.has(task.id));

  return (
    <RouletteContainer>
      <RouletteSection>

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
              {participants.map((participant, index) => {
                const startAngle = index * segmentAngle - Math.PI / 2;
                const endAngle = (index + 1) * segmentAngle - Math.PI / 2;
                const isSelected = selectedParticipant?.id === participant.id && !isSpinning;
                
                const textAngle = startAngle + segmentAngle / 2;
                const textRadius = radius * 0.45;
                const textX = centerX + textRadius * Math.cos(textAngle);
                const textY = centerY + textRadius * Math.sin(textAngle);
                
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

        <SpinButton
          disabled={isSpinning || !currentTask}
          onClick={handleSpin}
          whileHover={!(isSpinning || !currentTask) ? { scale: 1.02 } : {}}
          whileTap={!(isSpinning || !currentTask) ? { scale: 0.98 } : {}}
        >
          {isSpinning ? t('tasks.drawing') : currentTask ? t('tasks.drawResponsible') : t('tasks.noTasks')}
        </SpinButton>

      </RouletteSection>

      <TaskSidebar>
        <TaskSidebarTitle>{t('tasks.title')}</TaskSidebarTitle>
        
        <TaskCounter>
          {t('tasks.pendingCount', { count: pendingTasks.length, plural: pendingTasks.length !== 1 ? 's' : '' })} • {t('tasks.completedCount', { count: completedTasks.length, plural: completedTasks.length !== 1 ? 's' : '' })}
        </TaskCounter>

        <TaskList>
          <AnimatePresence>
            {pendingTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                isCompleted={false}
                isNext={index === 0}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskName isCompleted={false}>{task.name}</TaskName>
                {index === 0 && <NextTaskBadge>{t('tasks.nextLabel')}</NextTaskBadge>}
              </TaskItem>
            ))}
            {completedTasks.map((task, index) => {
              const assignee = taskHistory.find(history => history.taskId === task.id);
              return (
                <TaskItem
                  key={`completed-${task.id}`}
                  isCompleted={true}
                  isNext={false}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: (pendingTasks.length + index) * 0.05 }}
                >
                  <TaskName isCompleted={true}>{task.name}</TaskName>
                  {assignee && assignee.participants && <TaskAssignee>→ {assignee.participants.map(p => p.name).join(', ')}</TaskAssignee>}
                </TaskItem>
              );
            })}
          </AnimatePresence>
        </TaskList>
      </TaskSidebar>
    </RouletteContainer>
  );
};