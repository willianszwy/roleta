import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { tokens } from '../tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  helpText?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  helpText?: string;
}

const InputContainer = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

const Label = styled.label`
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${tokens.colors.text.secondary};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const baseInputStyles = css`
  font-family: ${tokens.typography.fontFamily};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.normal};
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.lg};
  background: ${tokens.colors.glass.primary};
  backdrop-filter: blur(8px);
  color: #1f2937;
  transition: all ${tokens.transitions.normal};
  width: 100%;
  
  &::placeholder {
    color: #6b7280;
    font-size: ${tokens.typography.sizes.xs};
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: ${tokens.shadows.glow};
    background: ${tokens.colors.glass.secondary};
    color: #111827;
  }
  
  &:disabled {
    background: rgba(156, 163, 175, 0.1);
    border-color: rgba(156, 163, 175, 0.3);
    color: ${tokens.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input<{ hasStartIcon: boolean; hasEndIcon: boolean; hasError: boolean }>`
  ${baseInputStyles}
  
  ${props => props.hasStartIcon && css`
    padding-left: calc(${tokens.spacing.lg} + 24px + ${tokens.spacing.sm});
  `}
  
  ${props => props.hasEndIcon && css`
    padding-right: calc(${tokens.spacing.lg} + 24px + ${tokens.spacing.sm});
  `}
  
  ${props => props.hasError && css`
    border-color: ${tokens.colors.error.main};
    
    &:focus {
      border-color: ${tokens.colors.error.main};
      box-shadow: 0 0 0 2px ${tokens.colors.error.background};
    }
  `}
`;

const StyledTextArea = styled.textarea<{ hasError: boolean }>`
  ${baseInputStyles}
  min-height: 80px;
  resize: vertical;
  
  ${props => props.hasError && css`
    border-color: ${tokens.colors.error.main};
    
    &:focus {
      border-color: ${tokens.colors.error.main};
      box-shadow: 0 0 0 2px ${tokens.colors.error.background};
    }
  `}
`;

const IconContainer = styled.div<{ position: 'start' | 'end' }>`
  position: absolute;
  ${props => props.position === 'start' ? 'left' : 'right'}: ${tokens.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${tokens.colors.text.muted};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const ErrorMessage = styled.span`
  font-size: ${tokens.typography.sizes.xs};
  color: ${tokens.colors.error.light};
  font-weight: ${tokens.typography.fontWeights.medium};
`;

const HelpText = styled.span`
  font-size: ${tokens.typography.sizes.xs};
  color: ${tokens.colors.text.muted};
  font-weight: ${tokens.typography.fontWeights.normal};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
  helpText,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}) => {
  const inputId = useId();
  const errorId = useId();
  const helpId = useId();
  
  // Build describedby string
  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {ariaRequired && <span aria-label="campo obrigatório"> *</span>}
        </Label>
      )}
      <InputWrapper>
        {startIcon && (
          <IconContainer position="start" aria-hidden="true">
            {startIcon}
          </IconContainer>
        )}
        <StyledInput
          id={inputId}
          hasStartIcon={!!startIcon}
          hasEndIcon={!!endIcon}
          hasError={!!error}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid ?? !!error}
          aria-required={ariaRequired}
          {...props}
        />
        {endIcon && (
          <IconContainer position="end" aria-hidden="true">
            {endIcon}
          </IconContainer>
        )}
      </InputWrapper>
      {helpText && (
        <HelpText id={helpId}>
          {helpText}
        </HelpText>
      )}
      {error && (
        <ErrorMessage id={errorId} role="alert" aria-live="polite">
          {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  helpText,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}) => {
  const textareaId = useId();
  const errorId = useId();
  const helpId = useId();
  
  // Build describedby string
  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
    ariaDescribedBy
  ].filter(Boolean).join(' ') || undefined;

  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={textareaId}>
          {label}
          {ariaRequired && <span aria-label="campo obrigatório"> *</span>}
        </Label>
      )}
      <StyledTextArea
        id={textareaId}
        hasError={!!error}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid ?? !!error}
        aria-required={ariaRequired}
        {...props}
      />
      {helpText && (
        <HelpText id={helpId}>
          {helpText}
        </HelpText>
      )}
      {error && (
        <ErrorMessage id={errorId} role="alert" aria-live="polite">
          {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
};