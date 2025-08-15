import React, { useState } from 'react';
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #374151;
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
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.6rem;
  padding: 0.5rem;
  min-width: 140px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  color: #374151;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #1f2937;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HistoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 280px;
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
  padding: 0.7rem;
  background: ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.08)' 
    : 'rgba(255, 255, 255, 0.06)'
  };
  border: 1px solid ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 0.5rem;
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
    width: 3px;
    background: ${props => props.removed 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };
    border-radius: 0 1px 1px 0;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const WinnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const Trophy = styled.div`
  font-size: 1rem;
  flex-shrink: 0;
`;

const WinnerDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const WinnerName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const DateTime = styled.div`
  font-size: 0.65rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.1rem;
`;

const ItemMenuContainer = styled.div`
  position: relative;
`;

const ItemMenuButton = styled(motion.button)<{ removed?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.removed ? '#9ca3af' : '#6b7280'};
  padding: 0.2rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  cursor: ${props => props.removed ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.removed ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: #374151;
  }
`;

const ItemMenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.4rem;
  padding: 0.25rem;
  min-width: 100px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
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
  padding: 0.2rem 0.5rem;
  border-radius: 0.8rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
`;

export const History: React.FC<HistoryProps> = ({
  history,
  onRemoveFromRoulette,
  onClearHistory,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItemMenu, setOpenItemMenu] = useState<string | null>(null);

  const handleRemoveFromRoulette = (participantId: string, participantName: string) => {
    if (window.confirm(`Remover "${participantName}" da roleta?`)) {
      onRemoveFromRoulette(participantId);
    }
    setOpenItemMenu(null);
  };

  const handleClearHistory = () => {
    if (window.confirm('Limpar todo o histórico?')) {
      onClearHistory();
    }
    setMenuOpen(false);
  };

  const toggleItemMenu = (itemId: string) => {
    setOpenItemMenu(openItemMenu === itemId ? null : itemId);
  };

  return (
    <HistoryContainer>
      <Header>
        <Title>
          🏆 Histórico
        </Title>
        
        {history.length > 0 && (
          <MenuContainer>
            <HistoryCount>
              {history.length}
            </HistoryCount>
          </MenuContainer>
        )}
      </Header>

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
            history.slice(0, 15).map((item, index) => (
              <HistoryItem
                key={item.id}
                removed={item.removed}
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <ItemContent>
                  <WinnerInfo>
                    <Trophy>{item.removed ? '❌' : '🏆'}</Trophy>
                    <WinnerDetails>
                      <WinnerName>{item.participantName}</WinnerName>
                      <DateTime>{formatTime(item.selectedAt)}</DateTime>
                    </WinnerDetails>
                  </WinnerInfo>
                  
                  <ItemMenuContainer>
                    <ItemMenuButton
                      removed={item.removed}
                      disabled={item.removed}
                      onClick={() => toggleItemMenu(item.id)}
                      whileHover={!item.removed ? { scale: 1.1 } : {}}
                      whileTap={!item.removed ? { scale: 0.9 } : {}}
                    >
                      ⋮
                    </ItemMenuButton>
                    
                    <AnimatePresence>
                      {openItemMenu === item.id && !item.removed && (
                        <ItemMenuDropdown
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          <MenuItem
                            onClick={() => handleRemoveFromRoulette(item.participantId, item.participantName)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Remover da roleta
                          </MenuItem>
                        </ItemMenuDropdown>
                      )}
                    </AnimatePresence>
                  </ItemMenuContainer>
                </ItemContent>
              </HistoryItem>
            ))
          )}
        </AnimatePresence>
      </HistoryList>

      {history.length > 0 && (
        <MenuContainer>
          <MenuButton
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
          >
            Opções ⋮
          </MenuButton>
          
          <AnimatePresence>
            {menuOpen && (
              <MenuDropdown
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <MenuItem
                  onClick={handleClearHistory}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Limpar histórico
                </MenuItem>
              </MenuDropdown>
            )}
          </AnimatePresence>
        </MenuContainer>
      )}
    </HistoryContainer>
  );
};