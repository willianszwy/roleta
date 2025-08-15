import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant } from '../../types';

interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ManagerContainer = styled.div`
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AddForm = styled.form`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
  white-space: nowrap;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
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
  gap: 0.75rem;
  max-height: 300px;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
  }
`;

const ParticipantCard = styled(motion.div)<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ParticipantColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const ParticipantName = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  flex: 1;
`;

const RemoveButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 154, 158, 0.3);
  
  &:hover {
    box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ClearButton = styled(motion.button)`
  flex: 1;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(250, 112, 154, 0.4);
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
    if (window.confirm('Tem certeza que deseja remover todos os participantes?')) {
      onClear();
    }
  };

  return (
    <ManagerContainer>
      <Title>👥 Participantes</Title>
      
      <AddForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite o nome do participante..."
          maxLength={50}
        />
        <AddButton
          type="submit"
          disabled={!inputValue.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Adicionar
        </AddButton>
      </AddForm>

      <ParticipantsList>
        <AnimatePresence>
          {participants.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🎯</EmptyIcon>
              <EmptyText>
                Nenhum participante adicionado ainda.
                <br />
                Adicione nomes para começar a roleta!
              </EmptyText>
            </EmptyState>
          ) : (
            participants.map((participant, index) => (
              <ParticipantCard
                key={participant.id}
                color={participant.color || '#667eea'}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
                  Remover
                </RemoveButton>
              </ParticipantCard>
            ))
          )}
        </AnimatePresence>
      </ParticipantsList>

      {participants.length > 0 && (
        <ActionsContainer>
          <ClearButton
            onClick={handleClear}
            disabled={participants.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Limpar Todos ({participants.length})
          </ClearButton>
        </ActionsContainer>
      )}
    </ManagerContainer>
  );
};