import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Button } from './Button';
import { tokens } from '../tokens';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

const Message = styled.p`
  color: ${tokens.colors.text.primary};
  margin: 0 0 ${tokens.spacing.xl} 0;
  font-size: ${tokens.typography.sizes.base};
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const variantStyles = {
  danger: {
    color: 'rgba(239, 68, 68, 0.9)',
    background: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  warning: {
    color: 'rgba(251, 191, 36, 0.9)',
    background: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  info: {
    color: 'rgba(59, 130, 246, 0.9)',
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  success: {
    color: 'rgba(34, 197, 94, 0.9)',
    background: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
};

const AlertButton = styled(Button)<{ variant: 'danger' | 'warning' | 'info' | 'success' }>`
  background: ${props => variantStyles[props.variant].background};
  border-color: ${props => variantStyles[props.variant].borderColor};
  color: ${props => variantStyles[props.variant].color};
  
  &:hover {
    background: ${props => variantStyles[props.variant].background.replace('0.1', '0.2')};
    border-color: ${props => variantStyles[props.variant].borderColor.replace('0.3', '0.5')};
  }
`;

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  variant = 'info',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="380px"
      closeOnOverlayClick={false}
      aria-describedby="alert-message"
      role="alertdialog"
    >
      <Message id="alert-message">
        {message}
      </Message>
      
      <Actions>
        <AlertButton
          variant={variant}
          onClick={onClose}
        >
          {buttonText}
        </AlertButton>
      </Actions>
    </Modal>
  );
};