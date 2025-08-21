import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';
import { LanguageSelector } from '../LanguageSelector';
import { ThemeSwitcher } from '../ThemeSwitcher';

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
  const { t } = useI18n();
  
  const updateConfig = (key: keyof SettingsConfig, value: SettingsConfig[keyof SettingsConfig]) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  return (
    <SettingsContainer>
      <SettingSection>
        <SectionTitle>
          {t('settings.language')}
        </SectionTitle>
        
        <SettingItem>
          <LanguageSelector variant="dropdown" showFlags={true} />
        </SettingItem>
      </SettingSection>

      <SettingSection>
        <SectionTitle>
          {t('settings.appearance')}
        </SectionTitle>
        
        <SettingItem>
          <ThemeSwitcher compact={false} showPreview={true} />
        </SettingItem>
      </SettingSection>

      <SettingSection>
        <SectionTitle>
          {t('settings.rouletteMode')}
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            {t('settings.rouletteMode')}
            <Select 
              value={config.rouletteMode}
              onChange={(e) => updateConfig('rouletteMode', e.target.value as 'participants' | 'tasks')}
            >
              <option value="participants">{t('roulette.participantMode')}</option>
              <option value="tasks">{t('roulette.taskMode')}</option>
            </Select>
          </SettingLabel>
          <SettingDescription>
            {config.rouletteMode === 'participants' 
              ? t('roulette.participantMode')
              : t('roulette.taskMode')
            }
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      <SettingSection>
        <SectionTitle>
          {t('winner.title')}
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            {t('settings.showWinnerModal')}
            <ToggleSwitch
              enabled={config.showWinnerModal}
              onClick={() => updateConfig('showWinnerModal', !config.showWinnerModal)}
              whileTap={{ scale: 0.95 }}
            />
          </SettingLabel>
          <SettingDescription>
            {t('settings.showWinnerModal')}
          </SettingDescription>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            {t('settings.displayDuration')}
            <Select 
              value={config.winnerDisplayDuration}
              onChange={(e) => updateConfig('winnerDisplayDuration', Number(e.target.value))}
            >
              <option value={3}>{t('settings.duration3s')}</option>
              <option value={5}>{t('settings.duration5s')}</option>
              <option value={8}>{t('settings.duration8s')}</option>
              <option value={0}>{t('settings.durationManual')}</option>
            </Select>
          </SettingLabel>
          <SettingDescription>
            {t('settings.displayDurationDescription')}
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      {config.rouletteMode === 'participants' && (
        <SettingSection>
          <SectionTitle>
            {t('settings.lotteryType')}
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>
              {config.sorteioBomRuim ? t('settings.luckyPerson') : t('settings.unluckyPerson')}
              <ToggleSwitch
                enabled={config.sorteioBomRuim}
                onClick={() => updateConfig('sorteioBomRuim', !config.sorteioBomRuim)}
                whileTap={{ scale: 0.95 }}
              />
            </SettingLabel>
            <SettingDescription>
              {t('settings.lotteryTypeDescription', { 
                type: config.sorteioBomRuim ? t('settings.luckyPerson').toLowerCase() : t('settings.unluckyPerson').toLowerCase(),
                winner: config.sorteioBomRuim ? t('settings.luckyPerson').toLowerCase() : t('settings.unluckyPerson').toLowerCase()
              })}
            </SettingDescription>
          </SettingItem>
        </SettingSection>
      )}

      <SettingSection>
        <SectionTitle>
          {t('settings.performance')}
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            {t('settings.autoRemoveWinner')}
            <ToggleSwitch
              enabled={config.autoRemoveWinner}
              onClick={() => updateConfig('autoRemoveWinner', !config.autoRemoveWinner)}
              whileTap={{ scale: 0.95 }}
            />
          </SettingLabel>
          <SettingDescription>
            {t('settings.autoRemoveWinner')}
          </SettingDescription>
        </SettingItem>
      </SettingSection>

      <ResetButton
        onClick={onResetSettings}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {t('settings.reset')}
      </ResetButton>
    </SettingsContainer>
  );
}

export type { SettingsConfig };