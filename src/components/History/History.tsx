import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { RouletteHistory } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';

interface HistoryProps {
  history: RouletteHistory[];
  onRemoveFromRoulette: (participantId: string) => void;
  onClearHistory: () => void;
}

const HistoryContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const HistoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 3px;
  }
`;

const HistoryItem = styled(motion.div)<{ removed?: boolean }>`
  position: relative;
  padding: 1.5rem;
  background: ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.3)' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.removed 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };
    border-radius: 0 2px 2px 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WinnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Trophy = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const WinnerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const Status = styled.span<{ removed?: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.removed 
    ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  };
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const DateTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Date = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const Time = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const RemoveButton = styled(motion.button)<{ removed?: boolean }>`
  background: ${props => props.removed 
    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: ${props => props.removed ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.removed 
    ? 'none'
    : '0 2px 10px rgba(250, 112, 154, 0.3)'
  };
  opacity: ${props => props.removed ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
  }
`;

const ActionsContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ClearButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
  gap: 1rem;
  color: #6b7280;
  text-align: center;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  font-weight: 500;
`;

export const History: React.FC<HistoryProps> = ({
  history,
  onRemoveFromRoulette,
  onClearHistory,
}) => {
  const handleRemoveFromRoulette = (participantId: string, participantName: string) => {
    if (window.confirm(`Remover "${participantName}" da roleta permanentemente?`)) {
      onRemoveFromRoulette(participantId);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      onClearHistory();
    }
  };

  return (
    <HistoryContainer>
      <Title>
        🏆 Histórico de Sorteios
      </Title>

      <HistoryList>
        <AnimatePresence>
          {history.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📜</EmptyIcon>
              <EmptyText>
                Nenhum sorteio realizado ainda.
                <br />
                O histórico dos sorteios aparecerá aqui!
              </EmptyText>
            </EmptyState>
          ) : (
            history.map((item, index) => (
              <HistoryItem
                key={item.id}
                removed={item.removed}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
                    <Date>{formatDate(item.selectedAt)}</Date>
                    <Time>{formatTime(item.selectedAt)}</Time>
                  </DateTime>
                  
                  <RemoveButton
                    removed={item.removed}
                    disabled={item.removed}
                    onClick={() => handleRemoveFromRoulette(item.participantId, item.participantName)}
                    whileHover={!item.removed ? { scale: 1.05 } : {}}
                    whileTap={!item.removed ? { scale: 0.95 } : {}}
                  >
                    {item.removed ? 'Removido' : 'Remover da Roleta'}
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
            Limpar Histórico ({history.length} {history.length === 1 ? 'item' : 'itens'})
          </ClearButton>
        </ActionsContainer>
      )}
    </HistoryContainer>
  );
};