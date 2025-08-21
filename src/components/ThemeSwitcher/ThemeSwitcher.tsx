import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeId } from '../../types/theme';
import { useI18n } from '../../i18n';

interface ThemeSwitcherProps {
  compact?: boolean;
  showPreview?: boolean;
}

const ThemeSwitcherContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const ThemeLabel = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const CompactSelector = styled.div`
  select {
    width: 100%;
    padding: 0.75rem;
    background: ${({ theme }) => theme.colors.glass.primary};
    border: 1px solid ${({ theme }) => theme.colors.glass.border};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};

    &:hover {
      background: ${({ theme }) => theme.colors.glass.hover};
      border-color: ${({ theme }) => theme.colors.interactive.primary};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.interactive.focus};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.interactive.focus}40;
    }

    option {
      background: ${({ theme }) => theme.colors.background.primary};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  width: 100%;
`;

const ThemeOption = styled(motion.div)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${({ theme, $isActive }) => 
    $isActive 
      ? theme.colors.interactive.primary 
      : theme.colors.glass.primary
  };
  border: 1px solid ${({ theme, $isActive }) => 
    $isActive 
      ? theme.colors.interactive.focus 
      : theme.colors.glass.border
  };
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};

  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive 
        ? theme.colors.interactive.primaryHover 
        : theme.colors.glass.hover
    };
    border-color: ${({ theme }) => theme.colors.interactive.primary};
    transform: translateY(-1px);
  }
`;

const ThemePreview = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const PreviewCircle = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ThemeName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
`;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  compact = false, 
  showPreview = true 
}) => {
  const { themes, themeId, setTheme } = useTheme();
  const { t } = useI18n();
  
  const themeOptions = Object.values(themes);

  if (compact) {
    return (
      <ThemeSwitcherContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ThemeLabel>{t('settings.appearance')}</ThemeLabel>
        <CompactSelector>
          <select 
            value={themeId} 
            onChange={(e) => setTheme(e.target.value as ThemeId)}
            aria-label={t('settings.selectTheme')}
          >
            {themeOptions.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </CompactSelector>
      </ThemeSwitcherContainer>
    );
  }

  return (
    <ThemeSwitcherContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ThemeLabel>{t('settings.appearance')}</ThemeLabel>
      
      <ThemeGrid>
        {themeOptions.map(theme => (
          <ThemeOption
            key={theme.id}
            $isActive={themeId === theme.id}
            onClick={() => setTheme(theme.id as ThemeId)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label={`${t('settings.selectTheme')}: ${theme.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTheme(theme.id as ThemeId);
              }
            }}
          >
            {showPreview && (
              <ThemePreview>
                <PreviewCircle $color={theme.colors.interactive.primary} />
                <PreviewCircle $color={theme.colors.status.success} />
                <PreviewCircle $color={theme.colors.status.warning} />
              </ThemePreview>
            )}
            <ThemeName>{theme.name}</ThemeName>
          </ThemeOption>
        ))}
      </ThemeGrid>
    </ThemeSwitcherContainer>
  );
};