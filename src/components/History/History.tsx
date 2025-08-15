import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { RouletteHistory } from '../../types';
import { formatTime } from '../../utils/helpers';

interface HistoryProps {
  history: RouletteHistory[];
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
}

const HistoryContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 6px 25px rgba(31, 38, 135, 0.25);
  max-height: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

const HistoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 250px;
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
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 2px;
  }
`;

const HistoryItem = styled(motion.div)<{ removed?: boolean }>`
  position: relative;
  padding: 0.8rem;
  background: ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.08)' 
    : 'rgba(255, 255, 255, 0.06)'
  };
  border: 1px solid ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 0.6rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.removed 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };
    border-radius: 0 1px 1px 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const WinnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const Trophy = styled.div`
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const WinnerName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Status = styled.span<{ removed?: boolean }>`
  padding: 0.15rem 0.5rem;
  border-radius: 0.8rem;
  font-size: 0.65rem;
  font-weight: 600;
  background: ${props => props.removed 
    ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  };
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const DateTime = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 500;
`;

const RemoveButton = styled(motion.button)<{ removed?: boolean }>`
  background: ${props => props.removed 
    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.65rem;
  font-weight: 500;
  cursor: ${props => props.removed ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.removed 
    ? 'none'
    : '0 2px 8px rgba(250, 112, 154, 0.25)'
  };
  opacity: ${props => props.removed ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    box-shadow: 0 3px 12px rgba(250, 112, 154, 0.35);
  }
`;

const ActionsContainer = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ClearButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.25);
  
  &:hover {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #6b7280;
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
`;

const HistoryCount = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const History: React.FC<HistoryProps> = ({
  history,
  onRemoveFromRoulette,
  onClearHistory,
}) => {
  const handleRemoveFromRoulette = (participantId: string, participantName: string) => {
    if (window.confirm(`Remover "${participantName}" da roleta?`)) {
      onRemoveFromRoulette(participantId);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Limpar todo o histórico?')) {
      onClearHistory();
    }
  };

  return (
    <HistoryContainer>
      <Title>
        🏆 Histórico
      </Title>

      {history.length > 0 && (
        <HistoryCount>
          {history.length} {history.length === 1 ? 'sorteio' : 'sorteios'}
        </HistoryCount>
      )}

      <HistoryList>
        <AnimatePresence>
          {history.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📜</EmptyIcon>
              <EmptyText>
                Nenhum sorteio realizado ainda
              </EmptyText>
            </EmptyState>
          ) : (
            history.slice(0, 10).map((item, index) => (
              <HistoryItem
                key={item.id}
                removed={item.removed}
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <ItemHeader>
                  <WinnerInfo>
                    <Trophy>{item.removed ? '❌' : '🏆'}</Trophy>
                    <WinnerName>{item.participantName}</WinnerName>
                  </WinnerInfo>
                  <Status removed={item.removed}>
                    {item.removed ? 'Removido' : 'Ativo'}
                  </Status>
                </ItemHeader>

                <ItemMeta>
                  <DateTime>
                    {formatTime(item.selectedAt)}
                  </DateTime>
                  
                  <RemoveButton
                    removed={item.removed}
                    disabled={item.removed}
                    onClick={() => handleRemoveFromRoulette(item.participantId, item.participantName)}
                    whileHover={!item.removed ? { scale: 1.05 } : {}}
                    whileTap={!item.removed ? { scale: 0.95 } : {}}
                  >
                    {item.removed ? 'Removido' : 'Remover'}
                  </RemoveButton>
                </ItemMeta>
              </HistoryItem>
            ))
          )}
        </AnimatePresence>
      </HistoryList>

      {history.length > 0 && (
        <ActionsContainer>
          <ClearButton
            onClick={handleClearHistory}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Limpar ({history.length})
          </ClearButton>
        </ActionsContainer>
      )}
    </HistoryContainer>
  );
};