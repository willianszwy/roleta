import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { tokens } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
  // Accessibility props
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  tabIndex?: number;
}

const getVariantStyles = (variant: 'glass' | 'solid' | 'outlined') => {
  switch (variant) {
    case 'glass':
      return css`
        background: ${tokens.colors.glass.primary};
        backdrop-filter: blur(15px);
        border: 1px solid ${tokens.colors.glass.border};
        box-shadow: ${tokens.shadows.lg};
      `;
    
    case 'solid':
      return css`
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: ${tokens.shadows.sm};
      `;
    
    case 'outlined':
      return css`
        background: transparent;
        border: 1px solid ${tokens.colors.glass.border};
        box-shadow: none;
      `;
    
    default:
      return css``;
  }
};

const getPaddingStyles = (padding: 'sm' | 'md' | 'lg') => {
  switch (padding) {
    case 'sm':
      return css`
        padding: ${tokens.spacing.lg};
      `;
    
    case 'md':
      return css`
        padding: ${tokens.spacing.xl};
      `;
    
    case 'lg':
      return css`
        padding: ${tokens.spacing['2xl']};
      `;
    
    default:
      return css``;
  }
};

const StyledCard = styled(motion.div)<{
  variant: 'glass' | 'solid' | 'outlined';
  padding: 'sm' | 'md' | 'lg';
  hoverable: boolean;
  clickable: boolean;
}>`
  border-radius: ${tokens.borderRadius['2xl']};
  transition: all ${tokens.transitions.normal};
  position: relative;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getPaddingStyles(props.padding)}
  
  ${props => props.clickable && css`
    cursor: pointer;
  `}
  
  ${props => props.hoverable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${tokens.shadows.md};
      
      ${props.variant === 'glass' && css`
        background: ${tokens.colors.glass.hover};
        border-color: rgba(255, 255, 255, 0.25);
      `}
      
      ${props.variant === 'solid' && css`
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      `}
      
      ${props.variant === 'outlined' && css`
        background: ${tokens.colors.glass.primary};
        border-color: ${tokens.colors.glass.border};
      `}
    }
  `}
  
  ${props => props.clickable && css`
    &:focus {
      outline: none;
      box-shadow: ${tokens.shadows.glow};
    }
    
    &:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  hoverable = false,
  className,
  onClick,
  role,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-selected': ariaSelected,
  tabIndex,
  ...props
}) => {
  const isClickable = !!onClick;
  const cardRole = role || (isClickable ? 'button' : undefined);
  const cardTabIndex = tabIndex !== undefined ? tabIndex : (isClickable ? 0 : undefined);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={isClickable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
      role={cardRole}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-selected={ariaSelected}
      tabIndex={cardTabIndex}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </StyledCard>
  );
};