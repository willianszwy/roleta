import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { tokens } from '../tokens';

// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background: rgba(102, 126, 234, 0.2);
        border: 1px solid rgba(102, 126, 234, 0.4);
        color: ${tokens.colors.primary.light};
        
        &:hover:not(:disabled) {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.6);
        }
      `;
    
    case 'secondary':
      return css`
        background: ${tokens.colors.glass.primary};
        border: 1px solid ${tokens.colors.glass.border};
        color: ${tokens.colors.text.primary};
        
        &:hover:not(:disabled) {
          background: ${tokens.colors.glass.hover};
          border-color: rgba(255, 255, 255, 0.25);
        }
      `;
    
    case 'success':
      return css`
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: ${tokens.colors.success.light};
        
        &:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(34, 197, 94, 0.6);
        }
      `;
    
    case 'error':
      return css`
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;
        
        &:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.6);
        }
      `;
    
    case 'ghost':
      return css`
        background: transparent;
        border: 1px solid transparent;
        color: ${tokens.colors.text.secondary};
        
        &:hover:not(:disabled) {
          background: ${tokens.colors.glass.primary};
          border-color: ${tokens.colors.glass.border};
          color: ${tokens.colors.text.primary};
        }
      `;
    
    default:
      return css``;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${tokens.spacing.sm} ${tokens.spacing.md};
        font-size: ${tokens.typography.sizes.xs};
        border-radius: ${tokens.borderRadius.md};
      `;
    
    case 'md':
      return css`
        padding: ${tokens.spacing.md} ${tokens.spacing.lg};
        font-size: ${tokens.typography.sizes.sm};
        border-radius: ${tokens.borderRadius.md};
      `;
    
    case 'lg':
      return css`
        padding: ${tokens.spacing.lg} ${tokens.spacing.xl};
        font-size: ${tokens.typography.sizes.base};
        border-radius: ${tokens.borderRadius.lg};
      `;
    
    default:
      return css``;
  }
};

const StyledButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'loading'].includes(prop),
})<{ variant: ButtonVariant; size: ButtonSize; fullWidth: boolean; loading: boolean }>`
  font-family: ${tokens.typography.fontFamily};
  font-weight: ${tokens.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${tokens.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.sm};
  white-space: nowrap;
  position: relative;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    background: rgba(156, 163, 175, 0.2);
    border-color: rgba(156, 163, 175, 0.4);
    color: ${tokens.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: ${tokens.shadows.glow};
  }
  
  ${props => props.loading && css`
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  type = 'button',
  onClick,
  className,
  style,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      className={className}
      style={style}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      {children}
    </StyledButton>
  );
};