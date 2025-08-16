import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prize } from '../../types';

interface PrizeManagerProps {
  prizes: Prize[];
  onAdd: (name: string, description?: string) => void;
  onAddBulk: (names: string[]) => void;
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
  gap: 0.5rem;
  margin-bottom: 1.25rem;
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

const BulkTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  resize: vertical;
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

const BulkActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const BulkButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'transparent'
  };
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
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
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const BulkHint = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const PrizesList = styled.div`
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

const PrizeCard = styled(motion.div)`
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

const PrizeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`;

const PrizeColor = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const PrizeDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const PrizeName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
`;

const ItemMenuContainer = styled.div`
  position: relative;
`;

const ItemMenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: #4b5563;
  padding: 0.2rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #1f2937;
  }
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
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #111827;
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
  color: #4b5563;
`;

const PrizeCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
`;

export const PrizeManager: React.FC<PrizeManagerProps> = ({
  prizes,
  onAdd,
  onAddBulk,
  onRemove,
  onClear,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItemMenu, setOpenItemMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [itemMenuPosition, setItemMenuPosition] = useState({ top: 0, left: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleBulkImport = () => {
    if (!bulkValue.trim()) return;
    
    // Parse the text - split by lines and commas
    const names = bulkValue
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (names.length > 0) {
      onAddBulk(names);
      setBulkValue('');
      setShowBulkImport(false);
    }
  };

  const handleClearBulk = () => {
    setBulkValue('');
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Remover "${name}" dos prêmios?`)) {
      onRemove(id);
    }
    setOpenItemMenu(null);
  };

  const handleClear = () => {
    if (window.confirm('Remover todos os prêmios?')) {
      onClear();
    }
    setMenuOpen(false);
  };

  const toggleBulkImport = () => {
    setShowBulkImport(!showBulkImport);
    if (showBulkImport) {
      setBulkValue('');
    }
  };

  const toggleItemMenu = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (openItemMenu === itemId) {
      setOpenItemMenu(null);
    } else {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setItemMenuPosition({
        top: rect.bottom + 4,
        left: Math.max(10, rect.right - 140),
      });
      setOpenItemMenu(itemId);
    }
  };

  const handleMainMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: Math.max(10, rect.top - 70),
        left: Math.max(10, rect.right - 140),
      });
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
      setOpenItemMenu(null);
    };

    if (menuOpen || openItemMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen, openItemMenu]);

  return (
    <>
      <ManagerContainer>
        <Header>
          <Title>🎁 Prêmios</Title>
          {prizes.length > 0 && (
            <PrizeCount>{prizes.length}</PrizeCount>
          )}
        </Header>
        
        <AddForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nome do prêmio..."
            maxLength={50}
          />
          <AddButton
            type="submit"
            disabled={!inputValue.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            +
          </AddButton>
        </AddForm>

        <BulkActions style={{ marginBottom: '1rem' }}>
          <BulkButton
            variant="secondary"
            onClick={toggleBulkImport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📋 {showBulkImport ? 'Fechar' : 'Importar Lista'}
          </BulkButton>
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
                <BulkTitle>🎁 Importar Prêmios</BulkTitle>
                <BulkTextarea
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder="Digite os prêmios separados por linha ou vírgula:&#10;Smartphone&#10;Tablet&#10;Fone Bluetooth, Smartwatch"
                />
                <BulkHint>
                  💡 Prêmios duplicados receberão números automaticamente (ex: Prêmio A, Prêmio A (2), Prêmio A (3))
                </BulkHint>
                <BulkActions>
                  <BulkButton
                    onClick={handleBulkImport}
                    disabled={!bulkValue.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✅ Adicionar ({bulkValue.split(/[\n,]/).filter(n => n.trim()).length} prêmios)
                  </BulkButton>
                  <BulkButton
                    variant="secondary"
                    onClick={handleClearBulk}
                    disabled={!bulkValue.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗑️ Limpar
                  </BulkButton>
                </BulkActions>
              </BulkImportSection>
            </motion.div>
          )}
        </AnimatePresence>

        <PrizesList>
          <AnimatePresence>
            {prizes.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🎁</EmptyIcon>
                <EmptyText>
                  Adicione prêmios para começar o sorteio
                </EmptyText>
              </EmptyState>
            ) : (
              prizes.map((prize, index) => (
                <PrizeCard
                  key={prize.id}
                  initial={{ opacity: 0, x: -15, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 15, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                >
                  <ItemContent>
                    <PrizeInfo>
                      <PrizeColor color={prize.color || '#f093fb'} />
                      <PrizeDetails>
                        <PrizeName>{prize.name}</PrizeName>
                      </PrizeDetails>
                    </PrizeInfo>
                    
                    <ItemMenuContainer>
                      <ItemMenuButton
                        onClick={(e) => toggleItemMenu(prize.id, e)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ⋮
                      </ItemMenuButton>
                    </ItemMenuContainer>
                  </ItemContent>
                </PrizeCard>
              ))
            )}
          </AnimatePresence>
        </PrizesList>

        {prizes.length > 1 && (
          <MenuContainer>
            <MenuButton
              onClick={handleMainMenuClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
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
            Limpar todos
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
              const prize = prizes.find(p => p.id === openItemMenu);
              if (prize) {
                handleRemove(prize.id, prize.name);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Remover prêmio
          </MenuItem>
        </PortalDropdown>,
        document.body
      )}
    </>
  );
};