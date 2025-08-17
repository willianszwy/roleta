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
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  hoverable = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={!!onClick}
      onClick={onClick}
      className={className}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </StyledCard>
  );
};