import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { TaskHistory as TaskHistoryType } from '../../types';
import { exportTaskHistory } from '../../utils/taskExportHelpers';
import { useI18n } from '../../i18n';
import { useConfirmation, useAlert } from '../../design-system';

interface TaskHistoryProps {
  taskHistory: TaskHistoryType[];
  onClearHistory: () => void;
}


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

const HistoryCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => 
    props.variant === 'danger' 
      ? 'rgba(239, 68, 68, 0.2)'
      : props.variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(102, 126, 234, 0.2)'
  };
  border: 1px solid ${props => 
    props.variant === 'danger' 
      ? 'rgba(239, 68, 68, 0.4)'
      : props.variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(102, 126, 234, 0.4)'
  };
  border-radius: 6px;
  color: ${props => 
    props.variant === 'danger' 
      ? '#fca5a5'
      : props.variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.9)'
      : '#a5b4fc'
  };
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => 
      props.variant === 'danger' 
        ? 'rgba(239, 68, 68, 0.3)'
        : props.variant === 'secondary'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(102, 126, 234, 0.3)'
    };
    border-color: ${props => 
      props.variant === 'danger' 
        ? 'rgba(239, 68, 68, 0.6)'
        : props.variant === 'secondary'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(102, 126, 234, 0.6)'
    };
  }
  
  &:disabled {
    background: rgba(156, 163, 175, 0.2);
    border-color: rgba(156, 163, 175, 0.4);
    color: rgba(156, 163, 175, 0.6);
    cursor: not-allowed;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  
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

const HistoryItem = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
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

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ParticipantName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const TaskName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.25rem;
`;

const TaskDescription = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const DateTime = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 0.85rem;
  margin: 0;
  font-style: italic;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
`;

const PaginationButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 6px;
  color: #a5b4fc;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.6);
  }
  
  &:disabled {
    background: rgba(156, 163, 175, 0.2);
    border-color: rgba(156, 163, 175, 0.4);
    color: rgba(156, 163, 175, 0.6);
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: 500;
  line-height: 1.3;
`;

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ITEMS_PER_PAGE = 20;

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  taskHistory,
  onClearHistory,
}) => {
  const { t } = useI18n();
  const { confirm } = useConfirmation();
  const { alert } = useAlert();
  const [currentPage, setCurrentPage] = useState(0);

  const handleClear = async () => {
    const confirmed = await confirm({
      title: t('modal.clearTaskHistory'),
      message: t('history.clearTaskConfirm'),
      confirmText: t('modal.clear'),
      cancelText: t('modal.cancel'),
      variant: 'warning'
    });
    
    if (confirmed) {
      onClearHistory();
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    await exportTaskHistory(taskHistory, format, async () => {
      await alert({ 
        title: t('modal.export'), 
        message: t('modal.noDataToExport'), 
        buttonText: t('modal.ok'),
        variant: 'warning' 
      });
    });
  };

  // Memoize calculations to avoid recalculating on every render
  const stats = useMemo(() => {
    const totalAssignments = taskHistory.length;
    const uniqueParticipants = new Set(
      taskHistory.flatMap(h => (h.participants || []).map(p => p.id))
    ).size;
    const uniqueTasks = new Set(taskHistory.map(h => h.taskId)).size;
    
    return { totalAssignments, uniqueParticipants, uniqueTasks };
  }, [taskHistory]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return taskHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [taskHistory, currentPage]);

  const totalPages = Math.ceil(taskHistory.length / ITEMS_PER_PAGE);
  const hasMorePages = totalPages > 1;

  if (taskHistory.length === 0) {
    return (
      <>
        <Header>
          <Title>{t('history.taskHistory')}</Title>
          <HistoryCount>0</HistoryCount>
        </Header>
        
        <EmptyState>
          <EmptyIcon>·</EmptyIcon>
          <EmptyText>{t('tasks.noneDrawn')}</EmptyText>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <Header>
        <Title>{t('history.taskHistory')}</Title>
        <HistoryCount>{stats.totalAssignments}</HistoryCount>
      </Header>

      <StatsContainer>
        <StatItem>
          <StatValue>{stats.totalAssignments}</StatValue>
          <StatLabel>{t('stats.assignments')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.uniqueParticipants}</StatValue>
          <StatLabel>{t('stats.people')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.uniqueTasks}</StatValue>
          <StatLabel>{t('tasks.title')}</StatLabel>
        </StatItem>
      </StatsContainer>

      <ActionsContainer>
        <ActionButton
          onClick={() => handleExport('csv')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('stats.exportCsv')}
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => handleExport('json')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('stats.exportJson')}
        </ActionButton>
        <ActionButton
          variant="danger"
          onClick={handleClear}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('history.clear')}
        </ActionButton>
      </ActionsContainer>

      {hasMorePages && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            ← {t('pagination.previous')}
          </PaginationButton>
          
          <PaginationInfo>
            {t('pagination.page', { current: currentPage + 1, total: totalPages })}
            <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>
              {t('pagination.items', { showing: paginatedItems.length, total: taskHistory.length })}
            </span>
          </PaginationInfo>
          
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            {t('pagination.next')} →
          </PaginationButton>
        </PaginationContainer>
      )}

      <HistoryList>
        {paginatedItems.map((item) => (
          <HistoryItem key={item.id}>
            <ItemHeader>
              <div>
                <ParticipantName>
                  {(item.participants || []).map(p => p.name).join(', ')}
                </ParticipantName>
                <TaskName>{item.taskName}</TaskName>
                {item.taskDescription && (
                  <TaskDescription>{item.taskDescription}</TaskDescription>
                )}
              </div>
              <DateTime>
                {formatDate(item.selectedAt)}
                <br />
                {formatTime(item.selectedAt)}
              </DateTime>
            </ItemHeader>
          </HistoryItem>
        ))}
      </HistoryList>
    </>
  );
};