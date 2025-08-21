import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../types';
import { Button, Input as DSInput, TextArea, tokens } from '../../design-system';
import { useI18n } from '../../i18n';
import { useDropdown } from '../../context/useDropdown';
import { useConfirmation } from '../../design-system';

interface TaskManagerProps {
  tasks: Task[];
  onAdd: (name: string, description?: string, requiredParticipants?: number) => void;
  onAddBulk: (taskLines: string[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${tokens.spacing.lg};
`;

const Title = styled.h3`
  font-size: ${tokens.typography.sizes.lg};
  font-weight: ${tokens.typography.fontWeights.medium};
  background: ${tokens.colors.primaryGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.xl};
`;

const InputRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
`;

const FieldLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TasksList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.25rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const TaskCard = styled(motion.div)`
  position: relative;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
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

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`;

const TaskColor = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const TaskDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
`;

const TaskDescription = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
  margin-top: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMenuContainer = styled.div`
  position: relative;
`;

const ItemMenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.2rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 1);
  }
`;

const PortalDropdown = styled(motion.div)<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 0.5rem;
  min-width: 140px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  z-index: 999999;
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 1.5rem 1rem;
  min-height: 120px;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  opacity: 0.6;
`;

const EmptyText = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
`;

const TaskCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
`;

const BulkImportSection = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
`;

const BulkTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;


const BulkActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;


const BulkHint = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAdd,
  onAddBulk,
  onRemove,
  onClear,
}) => {
  const { t } = useI18n();
  const { confirm } = useConfirmation();
  const { activeDropdown, setActiveDropdown, closeAllDropdowns } = useDropdown();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [requiredParticipants, setRequiredParticipants] = useState(1);
  const [bulkValue, setBulkValue] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [itemMenuPosition, setItemMenuPosition] = useState({ top: 0, left: 0 });
  
  const MAIN_MENU_ID = 'tasks-main-menu';
  const getItemMenuId = (itemId: string) => `tasks-item-${itemId}`;
  
  const menuOpen = activeDropdown === MAIN_MENU_ID;
  const openItemMenu = activeDropdown?.startsWith('tasks-item-') ? activeDropdown : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAdd(taskName.trim(), taskDescription.trim() || undefined, requiredParticipants);
      setTaskName('');
      setTaskDescription('');
      setRequiredParticipants(1);
    }
  };

  const handleBulkImport = () => {
    if (!bulkValue.trim()) return;
    
    // Parse the text - split by lines
    const lines = bulkValue
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length > 0) {
      onAddBulk(lines);
      setBulkValue('');
      setShowBulkImport(false);
    }
  };

  const handleClearBulk = () => {
    setBulkValue('');
  };

  const handleRemove = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: t('modal.removeTask'),
      message: `${t('tasks.remove')} "${name}"?`,
      confirmText: t('modal.remove'),
      cancelText: t('modal.cancel'),
      variant: 'danger'
    });
    
    if (confirmed) {
      onRemove(id);
    }
    closeAllDropdowns();
  };

  const handleClear = async () => {
    const confirmed = await confirm({
      title: t('modal.clearTasks'),
      message: `${t('tasks.clear')}?`,
      confirmText: t('modal.clear'),
      cancelText: t('modal.cancel'),
      variant: 'warning'
    });
    
    if (confirmed) {
      onClear();
    }
    closeAllDropdowns();
  };

  const toggleBulkImport = () => {
    setShowBulkImport(!showBulkImport);
    if (showBulkImport) {
      setBulkValue('');
    }
  };

  const toggleItemMenu = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const dropdownId = getItemMenuId(itemId);
    
    if (activeDropdown === dropdownId) {
      closeAllDropdowns();
    } else {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setItemMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(10, rect.right - 140),
      });
      setActiveDropdown(dropdownId);
    }
  };

  const handleMainMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (activeDropdown === MAIN_MENU_ID) {
      closeAllDropdowns();
    } else {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: Math.max(10, rect.top - 70),
        left: Math.max(10, rect.right - 140),
      });
      setActiveDropdown(MAIN_MENU_ID);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown, closeAllDropdowns]);

  return (
    <>
      <Header>
        <Title>{t('tasks.title')}</Title>
        {tasks.length > 0 && (
          <TaskCount>{tasks.length}</TaskCount>
        )}
      </Header>
      
      <AddForm onSubmit={handleSubmit}>
        {/* Primeira linha: Nome */}
        <div style={{ marginBottom: '0.75rem' }}>
          <FieldLabel>{t('tasks.nameLabel')}</FieldLabel>
          <DSInput
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder={t('tasks.namePlaceholder')}
            maxLength={50}
            fullWidth
          />
        </div>
        
        {/* Segunda linha: Descrição e Pessoas */}
        <InputRow style={{ marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>{t('tasks.descriptionLabel')}</FieldLabel>
            <DSInput
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder={t('tasks.descriptionPlaceholder')}
              maxLength={100}
              fullWidth
            />
          </div>
          <div style={{ width: '140px' }}>
            <FieldLabel>{t('tasks.participantsLabel')}</FieldLabel>
            <DSInput
              type="number"
              value={requiredParticipants}
              onChange={(e) => setRequiredParticipants(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              placeholder="1-10"
              min={1}
              max={10}
              fullWidth
            />
          </div>
        </InputRow>
        
        {/* Terceira linha: Botão */}
        <Button
          type="submit"
          disabled={!taskName.trim()}
          variant="primary"
          style={{ width: '100%' }}
        >
          {t('tasks.add')}
        </Button>
      </AddForm>

      <BulkActions style={{ marginBottom: '1rem' }}>
        <Button
          variant="secondary"
          onClick={toggleBulkImport}
        >
          {showBulkImport ? t('action.cancel') : t('tasks.import')}
        </Button>
      </BulkActions>

      <AnimatePresence>
        {showBulkImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BulkImportSection>
              <BulkTitle>{t('tasks.import')}</BulkTitle>
              <TextArea
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder={t('tasks.bulkAddPlaceholder')}
                fullWidth
                rows={4}
              />
              <BulkHint>
                Use "Nome da tarefa | Descrição | Pessoas" (ex: "Revisar código | Fazer code review | 2")
              </BulkHint>
              <BulkActions>
                <Button
                  onClick={handleBulkImport}
                  disabled={!bulkValue.trim()}
                  variant="primary"
                >
                  {t('tasks.bulkAdd')} ({bulkValue.split('\n').filter(n => n.trim()).length} tarefas)
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClearBulk}
                  disabled={!bulkValue.trim()}
                >
                  {t('action.clear')}
                </Button>
              </BulkActions>
            </BulkImportSection>
          </motion.div>
        )}
      </AnimatePresence>

      <TasksList>
        <AnimatePresence>
          {tasks.length === 0 ? (
            <EmptyState>
              <EmptyIcon>·</EmptyIcon>
              <EmptyText>
                Adicione tarefas para começar o sorteio
              </EmptyText>
            </EmptyState>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                data-testid="task-item"
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <ItemContent>
                  <TaskInfo>
                    <TaskColor color={task.color || '#4facfe'} />
                    <TaskDetails>
                      <TaskName>{task.name}</TaskName>
                      {task.description && (
                        <TaskDescription>{task.description}</TaskDescription>
                      )}
                    </TaskDetails>
                  </TaskInfo>
                  
                  <ItemMenuContainer>
                    <ItemMenuButton
                      onClick={(e) => toggleItemMenu(task.id, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ⋮
                    </ItemMenuButton>
                  </ItemMenuContainer>
                </ItemContent>
              </TaskCard>
            ))
          )}
        </AnimatePresence>
      </TasksList>

      {tasks.length > 1 && (
        <MenuContainer>
          <MenuButton
            onClick={handleMainMenuClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
          >
            {t('action.options')}
          </MenuButton>
        </MenuContainer>
      )}

      {/* Portal Dropdowns */}
      {menuOpen && createPortal(
        <PortalDropdown
          $top={menuPosition.top}
          $left={menuPosition.left}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <MenuItem
            onClick={handleClear}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('action.clearAll')}
          </MenuItem>
        </PortalDropdown>,
        document.body
      )}

      {openItemMenu && createPortal(
        <PortalDropdown
          $top={itemMenuPosition.top}
          $left={itemMenuPosition.left}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <MenuItem
            onClick={() => {
              const itemId = openItemMenu?.replace('tasks-item-', '');
              const task = tasks.find(t => t.id === itemId);
              if (task) {
                handleRemove(task.id, task.name);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('tasks.remove')}
          </MenuItem>
        </PortalDropdown>,
        document.body
      )}
    </>
  );
};