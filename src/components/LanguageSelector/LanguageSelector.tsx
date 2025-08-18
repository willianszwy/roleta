import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../design-system';
import { useI18n, type SupportedLocale } from '../../i18n';
import { getLocaleDisplayName } from '../../i18n/utils';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
`;

const Label = styled.label`
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${tokens.colors.text.secondary};
`;

const Select = styled.select`
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.lg};
  background: ${tokens.colors.glass.primary};
  backdrop-filter: blur(8px);
  color: ${tokens.colors.text.primary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.normal};
  cursor: pointer;
  transition: all ${tokens.transitions.normal};
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: ${tokens.shadows.glow};
    background: ${tokens.colors.glass.hover};
  }
  
  &:hover {
    background: ${tokens.colors.glass.hover};
    border-color: rgba(255, 255, 255, 0.25);
  }
  
  option {
    background: #1a1a2e;
    color: ${tokens.colors.text.primary};
    padding: ${tokens.spacing.sm};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  flex-wrap: wrap;
`;

const LanguageButton = styled.button<{ isActive: boolean }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border: 1px solid ${props => 
    props.isActive 
      ? 'rgba(102, 126, 234, 0.6)' 
      : tokens.colors.glass.border
  };
  border-radius: ${tokens.borderRadius.md};
  background: ${props => 
    props.isActive 
      ? 'rgba(102, 126, 234, 0.2)' 
      : tokens.colors.glass.primary
  };
  backdrop-filter: blur(8px);
  color: ${props => 
    props.isActive 
      ? '#a5b4fc' 
      : tokens.colors.text.secondary
  };
  font-size: ${tokens.typography.sizes.xs};
  font-weight: ${tokens.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${tokens.transitions.normal};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  
  &:hover:not(:disabled) {
    background: ${props => 
      props.isActive 
        ? 'rgba(102, 126, 234, 0.3)' 
        : tokens.colors.glass.hover
    };
    border-color: rgba(255, 255, 255, 0.25);
    color: ${tokens.colors.text.primary};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${tokens.shadows.glow};
  }
`;

const Flag = styled.span`
  font-size: 1.1em;
  line-height: 1;
`;

// Flag emojis for different locales
const localeFlags: Record<SupportedLocale, string> = {
  'pt-BR': '🇧🇷',
  'en-US': '🇺🇸',
  'es-ES': '🇪🇸',
  'fr-FR': '🇫🇷',
};

const supportedLocales: SupportedLocale[] = ['pt-BR', 'en-US', 'es-ES', 'fr-FR'];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className,
  variant = 'dropdown',
  showFlags = true,
}) => {
  const { locale, setLocale, t } = useI18n();

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
  };

  if (variant === 'buttons') {
    return (
      <SelectorContainer className={className}>
        <Label>{t('settings.language')}</Label>
        <ButtonGroup>
          {supportedLocales.map((localeOption) => (
            <LanguageButton
              key={localeOption}
              isActive={locale === localeOption}
              onClick={() => handleLocaleChange(localeOption)}
              aria-label={`${t('settings.language')}: ${getLocaleDisplayName(localeOption, locale)}`}
            >
              {showFlags && (
                <Flag role="img" aria-label={`${getLocaleDisplayName(localeOption, locale)} flag`}>
                  {localeFlags[localeOption]}
                </Flag>
              )}
              {getLocaleDisplayName(localeOption, locale)}
            </LanguageButton>
          ))}
        </ButtonGroup>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer className={className}>
      <Label htmlFor="language-select">{t('settings.language')}</Label>
      <Select
        id="language-select"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value as SupportedLocale)}
        aria-label={t('settings.language')}
      >
        {supportedLocales.map((localeOption) => (
          <option key={localeOption} value={localeOption}>
            {showFlags ? `${localeFlags[localeOption]} ` : ''}
            {getLocaleDisplayName(localeOption, locale)}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};