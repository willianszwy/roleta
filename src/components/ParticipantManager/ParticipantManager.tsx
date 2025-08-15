import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Participant } from '../../types';

interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ManagerContainer = styled.div`
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
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
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #9ca3af;
    font-size: 0.8rem;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.12);
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

const ParticipantsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 220px;
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

const ParticipantCard = styled(motion.div)<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.6rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
`;

const ParticipantColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const ParticipantName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 154, 158, 0.25);
  
  &:hover {
    box-shadow: 0 3px 12px rgba(255, 154, 158, 0.35);
  }
`;

const ActionsContainer = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ClearButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(250, 112, 154, 0.25);
  
  &:hover {
    box-shadow: 0 4px 16px rgba(250, 112, 154, 0.35);
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

const ParticipantCount = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants,
  onAdd,
  onRemove,
  onClear,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleRemove = (id: string) => {
    onRemove(id);
  };

  const handleClear = () => {
    if (window.confirm('Remover todos os participantes?')) {
      onClear();
    }
  };

  return (
    <ManagerContainer>
      <Title>👥 Participantes</Title>
      
      {participants.length > 0 && (
        <ParticipantCount>
          {participants.length} {participants.length === 1 ? 'participante' : 'participantes'}
        </ParticipantCount>
      )}
      
      <AddForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nome..."
          maxLength={30}
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

      <ParticipantsList>
        <AnimatePresence>
          {participants.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎯</EmptyIcon>
              <EmptyText>
                Adicione participantes para começar o sorteio
              </EmptyText>
            </EmptyState>
          ) : (
            participants.map((participant, index) => (
              <ParticipantCard
                key={participant.id}
                color={participant.color || '#667eea'}
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <ParticipantInfo>
                  <ParticipantColor color={participant.color || '#667eea'} />
                  <ParticipantName>{participant.name}</ParticipantName>
                </ParticipantInfo>
                <RemoveButton
                  onClick={() => handleRemove(participant.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ×
                </RemoveButton>
              </ParticipantCard>
            ))
          )}
        </AnimatePresence>
      </ParticipantsList>

      {participants.length > 1 && (
        <ActionsContainer>
          <ClearButton
            onClick={handleClear}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Limpar Todos
          </ClearButton>
        </ActionsContainer>
      )}
    </ManagerContainer>
  );
};