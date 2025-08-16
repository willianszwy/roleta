import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant, Task } from '../../types';
import { getContrastColor, selectRandomParticipant } from '../../utils/helpers';

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

const MainContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 4rem;
  width: 100%;
  max-width: 1400px;
  
  @media (max-width: 1024px) {
    gap: 3rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const RouletteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TasksSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  max-height: 600px;
  
  @media (max-width: 1024px) {
    width: 350px;
    max-height: 500px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    max-height: 450px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  width: ${props => Math.max(25, props.size * 0.08)}px;
  height: ${props => Math.max(25, props.size * 0.08)}px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  z-index: 10;
`;

const RoulettePointer = styled.div<{ size: number }>`
  position: absolute;
  top: ${props => Math.max(-10, -props.size * 0.025)}px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: ${props => Math.max(10, props.size * 0.025)}px solid transparent;
  border-right: ${props => Math.max(10, props.size * 0.025)}px solid transparent;
  border-top: ${props => Math.max(20, props.size * 0.05)}px solid #667eea;
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
    background: #667eea;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }
`;

const ParticipantText = styled.text<{ $textColor: string; $fontSize: number }>`
  fill: ${props => props.$textColor};
  font-size: ${props => props.$fontSize}px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

const TasksList = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 2rem;
  overflow-y: auto;
  max-height: 520px;
  
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

const CurrentTaskCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%);
  border: 2px solid rgba(79, 172, 254, 0.4);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(79, 172, 254, 0.1);
`;

const CurrentTaskLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CurrentTaskName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  margin-bottom: 0.75rem;
  line-height: 1.2;
`;

const CurrentTaskDescription = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  font-style: italic;
`;

const TaskItem = styled(motion.div)<{ completed?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: ${props => props.completed 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(255, 255, 255, 0.06)'
  };
  border: 1px solid ${props => props.completed 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
  opacity: ${props => props.completed ? 0.6 : 1};
  
  &::before {
    content: '';
    width: 3px;
    height: 100%;
    background: ${props => props.completed 
      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };
    border-radius: 1.5px;
    margin-right: 0.75rem;
  }
`;

const TaskItemContent = styled.div`
  flex: 1;
`;

const TaskItemName = styled.div<{ completed?: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.completed 
    ? 'rgba(255, 255, 255, 0.6)' 
    : 'rgba(255, 255, 255, 0.9)'
  };
  margin-bottom: 0.25rem;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskItemDescription = styled.div<{ completed?: boolean }>`
  font-size: 0.85rem;
  color: ${props => props.completed 
    ? 'rgba(255, 255, 255, 0.4)' 
    : 'rgba(255, 255, 255, 0.6)'
  };
  line-height: 1.3;
`;

const TaskStatus = styled.div<{ completed?: boolean }>`
  font-size: 1.2rem;
  margin-left: 0.5rem;
`;

const TasksCounter = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(79, 172, 254, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const SpinButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1.5rem;
  
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
  onSpin,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const wheelSize = 320;


  // Reset completed tasks when all tasks are done
  const resetTasks = () => {
    setCompletedTasks([]);
    setCurrentTask(tasks.length > 0 ? tasks[0] : null);
  };

  // Set current task when tasks change
  useEffect(() => {
    if (!currentTask) {
      const availableTasks = tasks.filter(task => !completedTasks.includes(task.id));
      const nextTask = availableTasks.length > 0 ? availableTasks[0] : null;
      setCurrentTask(nextTask);
    }
  }, [tasks, completedTasks, currentTask]);

  useEffect(() => {
    if (isSpinning && currentTask) {
      // Start spinning animation
      const duration = 3000;
      const finalRotation = Math.random() * 360 + 1440; // At least 4 full rotations
      
      setRotation(finalRotation);

      // After animation, determine winner and complete spin
      setTimeout(() => {
        if (participants.length > 0) {
          const selectedParticipant = selectRandomParticipant(participants);
          
          // Complete the current task
          setCompletedTasks(prev => [...prev, currentTask.id]);
          
          // Move to next task
          const remainingTasks = tasks.filter(task => !completedTasks.includes(task.id) && task.id !== currentTask.id);
          const nextTask = remainingTasks.length > 0 ? remainingTasks[0] : null;
          setCurrentTask(nextTask);
          
          onSpinComplete(selectedParticipant || undefined, currentTask);
        }
      }, duration);
    }
  }, [isSpinning, participants, currentTask, onSpinComplete, tasks, completedTasks]);

  const handleSpin = () => {
    if (!isSpinning && participants.length > 0 && currentTask) {
      onSpin();
    }
  };

  const renderWheel = () => {
    if (participants.length === 0) return null;

    const segmentAngle = 360 / participants.length;
    const radius = wheelSize / 2 - 20;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const fontSize = Math.max(10, Math.min(16, 120 / participants.length));

    return (
      <WheelSVG
        size={wheelSize}
        animate={{ rotate: rotation }}
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
              <ParticipantText
                x={textX}
                y={textY}
                $textColor={getContrastColor(participant.color || '#667eea')}
                $fontSize={fontSize}
                transform={`rotate(${midAngle}, ${textX}, ${textY})`}
              >
                {participant.name}
              </ParticipantText>
            </g>
          );
        })}
      </WheelSVG>
    );
  };

  const availableTasks = tasks.filter(task => !completedTasks.includes(task.id));
  const hasCompletedTasks = completedTasks.length > 0;

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
      <MainContent>
        <RouletteSection>
          <SectionTitle>👥 Quem vai fazer?</SectionTitle>
          <WheelContainer size={wheelSize}>
            {renderWheel()}
            <CenterCircle size={wheelSize} />
            <RoulettePointer size={wheelSize} />
          </WheelContainer>
          
          <SpinButton
            onClick={handleSpin}
            disabled={isSpinning || !currentTask}
            whileHover={{ scale: (isSpinning || !currentTask) ? 1 : 1.05 }}
            whileTap={{ scale: (isSpinning || !currentTask) ? 1 : 0.95 }}
          >
            {isSpinning ? 'Sorteando...' : currentTask ? 'Sortear Responsável' : 'Sem tarefas'}
          </SpinButton>
        </RouletteSection>

        <TasksSection>
          <SectionTitle>📋 Lista de Tarefas</SectionTitle>
          <TasksList>
            {currentTask && (
              <CurrentTaskCard
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CurrentTaskLabel>Próxima Tarefa</CurrentTaskLabel>
                <CurrentTaskName>{currentTask.name}</CurrentTaskName>
                {currentTask.description && (
                  <CurrentTaskDescription>{currentTask.description}</CurrentTaskDescription>
                )}
              </CurrentTaskCard>
            )}

            <TasksCounter>
              {availableTasks.length} pendente{availableTasks.length !== 1 ? 's' : ''} • {completedTasks.length} concluída{completedTasks.length !== 1 ? 's' : ''}
            </TasksCounter>

            <AnimatePresence>
              {tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id);
                const isCurrent = currentTask?.id === task.id;
                
                if (isCurrent) return null; // Don't show current task in the list
                
                return (
                  <TaskItem
                    key={task.id}
                    completed={isCompleted}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskItemContent>
                      <TaskItemName completed={isCompleted}>
                        {task.name}
                      </TaskItemName>
                      {task.description && (
                        <TaskItemDescription completed={isCompleted}>
                          {task.description}
                        </TaskItemDescription>
                      )}
                    </TaskItemContent>
                    <TaskStatus completed={isCompleted}>
                      {isCompleted ? '✅' : '⏳'}
                    </TaskStatus>
                  </TaskItem>
                );
              })}
            </AnimatePresence>

            {availableTasks.length === 0 && hasCompletedTasks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  🎉 Todas as tarefas foram concluídas!
                </div>
                <motion.button
                  onClick={resetTasks}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(102, 126, 234, 0.25)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Reiniciar Tarefas
                </motion.button>
              </motion.div>
            )}
          </TasksList>
        </TasksSection>
      </MainContent>
    </RouletteContainer>
  );
};