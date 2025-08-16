import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { PrizeHistory } from '../../types';
import { exportPrizeHistory } from '../../utils/exportHelpers';

interface PrizeHistoryProps {
  prizeHistory: PrizeHistory[];
  onClearHistory: () => void;
}

const HistoryContainer = styled.div`
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

const HistoryCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => 
    props.variant === 'danger' 
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : props.variant === 'secondary'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  border: 1px solid ${props => 
    props.variant === 'secondary' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'transparent'
  };
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => 
    props.variant === 'secondary' 
      ? 'none' 
      : props.variant === 'danger'
      ? '0 3px 12px rgba(239, 68, 68, 0.25)'
      : '0 3px 12px rgba(102, 126, 234, 0.25)'
  };
  backdrop-filter: blur(8px);
  white-space: nowrap;
  
  &:hover {
    background: ${props => 
      props.variant === 'danger' 
        ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
        : props.variant === 'secondary'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'linear-gradient(135deg, #7c8aed 0%, #8a5aa8 100%)'
    };
    box-shadow: ${props => 
      props.variant === 'secondary' 
        ? 'none' 
        : props.variant === 'danger'
        ? '0 4px 16px rgba(239, 68, 68, 0.35)'
        : '0 4px 16px rgba(102, 126, 234, 0.35)'
    };
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const HistoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const HistoryItem = styled(motion.div)`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ParticipantName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PrizeName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryDate = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 0.25rem;
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
  padding: 2rem 1rem;
  min-height: 120px;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  opacity: 0.6;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  color: #4b5563;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
`;

const ExportDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  min-width: 120px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  z-index: 1000;
  margin-top: 0.25rem;
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`;

export const PrizeHistory: React.FC<PrizeHistoryProps> = ({
  prizeHistory,
  onClearHistory,
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleClear = () => {
    if (window.confirm('Limpar todo o histórico de sorteios?')) {
      onClearHistory();
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportPrizeHistory(prizeHistory, format);
    setShowExportDropdown(false);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const totalSorted = prizeHistory.length;
  const uniqueWinners = new Set(prizeHistory.map(h => h.participantName)).size;

  return (
    <HistoryContainer>
      <Header>
        <Title>🏆 Histórico de Sorteios</Title>
        {prizeHistory.length > 0 && (
          <HistoryCount>{prizeHistory.length}</HistoryCount>
        )}
      </Header>

      {prizeHistory.length > 0 && (
        <StatsContainer>
          <StatItem>
            <StatValue>{totalSorted}</StatValue>
            <StatLabel>Prêmios Sorteados</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{uniqueWinners}</StatValue>
            <StatLabel>Ganhadores Únicos</StatLabel>
          </StatItem>
        </StatsContainer>
      )}

      <ActionButtons>
        <ExportDropdown>
          <ActionButton
            disabled={prizeHistory.length === 0}
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📊 Exportar
          </ActionButton>
          
          <AnimatePresence>
            {showExportDropdown && (
              <DropdownContent
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <DropdownItem
                  onClick={() => handleExport('csv')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📄 CSV
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleExport('json')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📋 JSON
                </DropdownItem>
              </DropdownContent>
            )}
          </AnimatePresence>
        </ExportDropdown>
        
        <ActionButton
          variant="danger"
          disabled={prizeHistory.length === 0}
          onClick={handleClear}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🗑️ Limpar
        </ActionButton>
      </ActionButtons>

      <HistoryList>
        <AnimatePresence>
          {prizeHistory.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎁</EmptyIcon>
              <EmptyText>
                Nenhum sorteio realizado ainda.
                <br />
                Faça um sorteio para ver o histórico aqui!
              </EmptyText>
            </EmptyState>
          ) : (
            prizeHistory.map((item, index) => (
              <HistoryItem
                key={item.id}
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <HistoryHeader>
                  <ParticipantName>
                    👤 {item.participantName}
                  </ParticipantName>
                </HistoryHeader>
                <PrizeName>
                  🎁 {item.prizeName}
                </PrizeName>
                <HistoryDate>
                  {formatDate(item.selectedAt)}
                </HistoryDate>
              </HistoryItem>
            ))
          )}
        </AnimatePresence>
      </HistoryList>

      {/* Close dropdown when clicking outside */}
      {showExportDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowExportDropdown(false)}
        />
      )}
    </HistoryContainer>
  );
};