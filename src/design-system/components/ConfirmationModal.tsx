import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Button } from './Button';
import { tokens } from '../tokens';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const Message = styled.p`
  color: ${tokens.colors.text.primary};
  margin: 0 0 ${tokens.spacing.xl} 0;
  font-size: ${tokens.typography.sizes.base};
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
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
};

const ConfirmButton = styled(Button)<{ variant: 'danger' | 'warning' | 'info' }>`
  background: ${props => variantStyles[props.variant].background};
  border-color: ${props => variantStyles[props.variant].borderColor};
  color: ${props => variantStyles[props.variant].color};
  
  &:hover {
    background: ${props => variantStyles[props.variant].background.replace('0.1', '0.2')};
    border-color: ${props => variantStyles[props.variant].borderColor.replace('0.3', '0.5')};
  }
`;

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="420px"
      closeOnOverlayClick={false}
      aria-describedby="confirmation-message"
      role="alertdialog"
    >
      <Message id="confirmation-message">
        {message}
      </Message>
      
      <Actions>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        
        <ConfirmButton
          variant={variant}
          onClick={handleConfirm}
        >
          {confirmText}
        </ConfirmButton>
      </Actions>
    </Modal>
  );
};