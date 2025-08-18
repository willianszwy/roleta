import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../design-system';
import { useI18n } from '../../i18n';

const SkipLinksContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${tokens.zIndex.skipLinks || 9999};
  pointer-events: none;
`;

const SkipLink = styled.a`
  position: absolute;
  left: 6px;
  top: -100px;
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background: ${tokens.colors.glass.primary};
  backdrop-filter: blur(15px);
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.md};
  color: ${tokens.colors.text.primary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  text-decoration: none;
  box-shadow: ${tokens.shadows.lg};
  transition: all ${tokens.transitions.normal};
  pointer-events: auto;
  opacity: 0;
  visibility: hidden;
  
  &:focus {
    top: 6px;
    opacity: 1;
    visibility: visible;
    outline: 2px solid currentColor;
    outline-offset: 2px;
    transform: translateY(0);
  }
  
  &:hover:focus {
    background: ${tokens.colors.glass.hover};
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }
`;

const SecondSkipLink = styled(SkipLink)`
  left: 200px;
`;

export const SkipLinks: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <SkipLinksContainer>
      <SkipLink href="#main-content">
        {t('nav.skipToContent')}
      </SkipLink>
      <SecondSkipLink href="#main-navigation">
        {t('nav.skipToNavigation')}
      </SecondSkipLink>
    </SkipLinksContainer>
  );
};