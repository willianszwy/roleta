import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SettingsContainer = styled.div`
  padding: 0.5rem 0;
`;

const SettingSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  margin-bottom: 1.5rem;
`;

const SettingLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const SettingDescription = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const ToggleSwitch = styled(motion.div)<{ enabled: boolean }>`
  width: 44px;
  height: 24px;
  background: ${props => props.enabled ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  font-size: 0.875rem;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #1e293b;
    color: white;
  }
`;

const ResetButton = styled(motion.button)`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 6px;
  color: #fca5a5;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.6);
  }
`;

interface SettingsConfig {
  showWinnerModal: boolean;
  sorteioBomRuim: boolean;
  autoRemoveWinner: boolean;
  winnerDisplayDuration: number;
  rouletteMode: 'participants' | 'tasks';
}

interface SettingsProps {
  config: SettingsConfig;
  onConfigChange: (config: SettingsConfig) => void;
  onResetSettings: () => void;
}

export function Settings({ config, onConfigChange, onResetSettings }: SettingsProps) {
  const updateConfig = (key: keyof SettingsConfig, value: any) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  return (
    <SettingsContainer>
      <SettingSection>
        <SectionTitle>
          🎯 Modalidade de Sorteio
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            Modalidade de Sorteio
            <Select 
              value={config.rouletteMode}
              onChange={(e) => updateConfig('rouletteMode', e.target.value as 'participants' | 'tasks')}
            >
              <option value="participants">Sorteio de Pessoas</option>
              <option value="tasks">Sorteio de Tarefas</option>
            </Select>
          </SettingLabel>
          <SettingDescription>
            {config.rouletteMode === 'participants' 
              ? "Modo tradicional: sorteia uma pessoa da lista de participantes"
              : "Modo tarefas: sorteia uma pessoa para executar uma tarefa específica da lista"
            }
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      <SettingSection>
        <SectionTitle>
          🎉 Exibição do Vencedor
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            Mostrar modal do vencedor
            <ToggleSwitch
              enabled={config.showWinnerModal}
              onClick={() => updateConfig('showWinnerModal', !config.showWinnerModal)}
              whileTap={{ scale: 0.95 }}
            />
          </SettingLabel>
          <SettingDescription>
            Exibe um modal especial com animações quando alguém vence
          </SettingDescription>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Tempo de exibição
            <Select 
              value={config.winnerDisplayDuration}
              onChange={(e) => updateConfig('winnerDisplayDuration', Number(e.target.value))}
            >
              <option value={3}>3 segundos</option>
              <option value={5}>5 segundos</option>
              <option value={8}>8 segundos</option>
              <option value={0}>Manual</option>
            </Select>
          </SettingLabel>
          <SettingDescription>
            Tempo que o modal permanece aberto (0 = fechar manualmente)
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      {config.rouletteMode === 'participants' && (
        <SettingSection>
          <SectionTitle>
            🎲 Sorteio de Sorte
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>
              {config.sorteioBomRuim ? "Sorteio de Sortudo" : "Sorteio de Azarado"}
              <ToggleSwitch
                enabled={config.sorteioBomRuim}
                onClick={() => updateConfig('sorteioBomRuim', !config.sorteioBomRuim)}
                whileTap={{ scale: 0.95 }}
              />
            </SettingLabel>
            <SettingDescription>
              Define o tipo do sorteio: {config.sorteioBomRuim ? "encontrar uma pessoa sortuda 🍀" : "encontrar uma pessoa azarada 😅"}. O vencedor sempre será mostrado como {config.sorteioBomRuim ? "sortudo" : "azarado"}.
            </SettingDescription>
          </SettingItem>
        </SettingSection>
      )}

      <SettingSection>
        <SectionTitle>
          ⚡ Automação
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            Remover vencedor automaticamente
            <ToggleSwitch
              enabled={config.autoRemoveWinner}
              onClick={() => updateConfig('autoRemoveWinner', !config.autoRemoveWinner)}
              whileTap={{ scale: 0.95 }}
            />
          </SettingLabel>
          <SettingDescription>
            Remove automaticamente o vencedor da roleta após o sorteio
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      <ResetButton
        onClick={onResetSettings}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Restaurar Padrões
      </ResetButton>
    </SettingsContainer>
  );
}

export type { SettingsConfig };