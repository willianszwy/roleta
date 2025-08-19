import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { RouletteHistory } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useI18n } from '../../i18n';
import { useDropdown } from '../../context/useDropdown';

interface HistoryProps {
  history: RouletteHistory[];
  onRemoveFromRoulette: (participantId: string) => void;
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

const HistoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 300px;
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

const HistoryItem = styled.div<{ removed?: boolean }>`
  position: relative;
  padding: 0.5rem;
  background: ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.08)' 
    : 'rgba(255, 255, 255, 0.06)'
  };
  border: 1px solid ${props => props.removed 
    ? 'rgba(255, 154, 158, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
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
  gap: 0.5rem;
`;

const WinnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`;

const Trophy = styled.div`
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const WinnerDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const WinnerName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
`;

const DateTime = styled.div`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  margin-top: 0.05rem;
`;

const ItemMenuContainer = styled.div`
  position: relative;
`;

const ItemMenuButton = styled(motion.button)<{ removed?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.removed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)'};
  padding: 0.2rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: ${props => props.removed ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.removed ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.9);
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

const HistoryCount = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
`;

const MAX_ITEMS = 10;

export const History: React.FC<HistoryProps> = ({
  history,
  onRemoveFromRoulette,
  onClearHistory,
}) => {
  const { t } = useI18n();
  const { activeDropdown, setActiveDropdown, closeAllDropdowns } = useDropdown();
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [itemMenuPosition, setItemMenuPosition] = useState({ top: 0, left: 0 });
  
  const MAIN_MENU_ID = 'history-main-menu';
  const getItemMenuId = (itemId: string) => `history-item-${itemId}`;
  
  const menuOpen = activeDropdown === MAIN_MENU_ID;
  const openItemMenu = activeDropdown?.startsWith('history-item-') ? activeDropdown : null;

  // Limit items to improve performance
  const displayedHistory = useMemo(() => 
    history.slice(0, MAX_ITEMS), 
    [history]
  );

  const handleRemoveFromRoulette = (participantId: string, participantName: string) => {
    if (window.confirm(t('participants.remove') + ` "${participantName}"?`)) {
      onRemoveFromRoulette(participantId);
    }
    closeAllDropdowns();
  };

  const handleClearHistory = () => {
    if (window.confirm(t('history.clearConfirm'))) {
      onClearHistory();
    }
    closeAllDropdowns();
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
        <Title>{t('history.title')}</Title>
        {history.length > 0 && (
          <HistoryCount>{history.length}</HistoryCount>
        )}
      </Header>

      <HistoryList>
        {history.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📜</EmptyIcon>
            <EmptyText>{t('history.noDraws')}</EmptyText>
          </EmptyState>
        ) : (
          displayedHistory.map((item) => (
            <HistoryItem
              key={item.id}
              removed={item.removed}
            >
              <ItemContent>
                <WinnerInfo>
                  <Trophy>{item.removed ? '✗' : '✓'}</Trophy>
                  <WinnerDetails>
                    <WinnerName>{item.participantName}</WinnerName>
                    <DateTime>{formatDate(item.selectedAt)}</DateTime>
                  </WinnerDetails>
                </WinnerInfo>
                
                <ItemMenuContainer>
                  <ItemMenuButton
                    removed={item.removed}
                    disabled={item.removed}
                    onClick={(e) => toggleItemMenu(item.id, e)}
                    whileHover={!item.removed ? { scale: 1.1 } : {}}
                    whileTap={!item.removed ? { scale: 0.9 } : {}}
                  >
                    ⋮
                  </ItemMenuButton>
                </ItemMenuContainer>
              </ItemContent>
            </HistoryItem>
          ))
        )}
        
        {history.length > MAX_ITEMS && (
          <div style={{ 
            textAlign: 'center', 
            padding: '0.5rem', 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '0.5rem'
          }}>
            Mostrando {MAX_ITEMS} de {history.length} itens
          </div>
        )}
      </HistoryList>

      {history.length > 0 && (
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
            onClick={handleClearHistory}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('history.clear')}
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
              const itemId = openItemMenu?.replace('history-item-', '');
              const item = history.find(h => h.id === itemId);
              if (item) {
                handleRemoveFromRoulette(item.participantId, item.participantName);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('participants.remove')}
          </MenuItem>
        </PortalDropdown>,
        document.body
      )}
    </>
  );
};