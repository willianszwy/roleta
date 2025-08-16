import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../types';

interface TaskManagerProps {
  tasks: Task[];
  onAdd: (name: string, description?: string) => void;
  onAddBulk: (taskLines: string[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ManagerContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 6px 25px rgba(31, 38, 135, 0.25);
  max-height: 400px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.12);
    color: #111827;
  }
`;

const DescriptionInput = styled(Input)`
  font-size: 0.8rem;
`;

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(79, 172, 254, 0.25);
  white-space: nowrap;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(79, 172, 254, 0.35);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const BulkToggle = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const BulkContainer = styled(motion.div)`
  margin-bottom: 1rem;
`;

const BulkTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: #1f2937;
  font-size: 0.8rem;
  font-weight: 500;
  resize: vertical;
  font-family: inherit;
  line-height: 1.4;
  
  &::placeholder {
    color: #6b7280;
    font-size: 0.75rem;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.12);
    color: #111827;
  }
`;

const BulkActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BulkButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(102, 126, 234, 0.3)'
  };
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => props.variant === 'secondary' 
    ? 'none' 
    : '0 3px 12px rgba(102, 126, 234, 0.25)'
  };
  backdrop-filter: blur(8px);
  
  &:hover {
    background: ${props => props.variant === 'secondary' 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'linear-gradient(135deg, #7c8aed 0%, #8a5aa8 100%)'
    };
    box-shadow: ${props => props.variant === 'secondary' 
      ? 'none' 
      : '0 4px 16px rgba(102, 126, 234, 0.35)'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TasksList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const TaskCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 0 1px 1px 0;
  }
`;

const TaskInfo = styled.div`
  flex: 1;
  margin-right: 0.75rem;
`;

const TaskName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const TaskDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  opacity: 0.8;
`;

const TaskColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  flex-shrink: 0;
  margin-right: 0.5rem;
  margin-top: 0.125rem;
`;

const RemoveButton = styled(motion.button)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
  }
`;

const EmptyText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 2rem 0;
  font-style: italic;
`;

const TaskCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #1f2937;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: #111827;
  }
`;

const PortalDropdown = styled(motion.div)<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(31, 38, 135, 0.37);
  z-index: 10000;
  min-width: 150px;
  overflow: hidden;
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1f2937;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAdd,
  onAddBulk,
  onRemove,
  onClear,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAdd(taskName.trim(), taskDescription.trim() || undefined);
      setTaskName('');
      setTaskDescription('');
    }
  };

  const handleBulkSubmit = () => {
    if (bulkText.trim()) {
      const lines = bulkText.split('\n').filter(line => line.trim());
      onAddBulk(lines);
      setBulkText('');
      setShowBulkAdd(false);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });
    setMenuOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <>
      <ManagerContainer>
        <Header>
          <Title>📋 Tarefas</Title>
          {tasks.length > 0 && (
            <TaskCount>{tasks.length}</TaskCount>
          )}
        </Header>
        
        <AddForm onSubmit={handleSubmit}>
          <InputRow>
            <Input
              type="text"
              placeholder="Nome da tarefa..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <AddButton
              type="submit"
              disabled={!taskName.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Adicionar
            </AddButton>
          </InputRow>
          <DescriptionInput
            type="text"
            placeholder="Descrição (opcional)..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </AddForm>

        <AnimatePresence>
          {showBulkAdd && (
            <BulkContainer
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <BulkTextarea
                placeholder="Cole suas tarefas aqui, uma por linha:&#10;Tarefa 1&#10;Tarefa 2 | Descrição opcional&#10;Tarefa 3"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
              <BulkActions>
                <BulkButton
                  onClick={handleBulkSubmit}
                  disabled={!bulkText.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Adicionar Todas
                </BulkButton>
                <BulkButton
                  variant="secondary"
                  onClick={() => setShowBulkAdd(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </BulkButton>
              </BulkActions>
            </BulkContainer>
          )}
        </AnimatePresence>

        <TasksList>
          {tasks.length === 0 ? (
            <EmptyText>Nenhuma tarefa adicionada ainda</EmptyText>
          ) : (
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <TaskColor color={task.color || '#667eea'} />
                  <TaskInfo>
                    <TaskName>{task.name}</TaskName>
                    {task.description && (
                      <TaskDescription>{task.description}</TaskDescription>
                    )}
                  </TaskInfo>
                  <RemoveButton
                    onClick={() => onRemove(task.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </RemoveButton>
                </TaskCard>
              ))}
            </AnimatePresence>
          )}
        </TasksList>

        {tasks.length > 0 && (
          <MenuContainer>
            <MenuButton
              onClick={handleMenuClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Opções ⋮
            </MenuButton>
          </MenuContainer>
        )}
      </ManagerContainer>

      {/* Portal Dropdowns */}
      {menuOpen && createPortal(
        <PortalDropdown
          $top={menuPosition.top}
          $left={menuPosition.left}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
        >
          <DropdownItem
            onClick={() => {
              setShowBulkAdd(true);
              setMenuOpen(false);
            }}
            whileHover={{ x: 4 }}
          >
            📝 Adicionar em Lote
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              onClear();
              setMenuOpen(false);
            }}
            whileHover={{ x: 4 }}
          >
            🗑️ Limpar Todas
          </DropdownItem>
        </PortalDropdown>,
        document.body
      )}
    </>
  );
};