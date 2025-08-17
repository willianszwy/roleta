import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { tokens } from '../tokens';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${tokens.colors.background.overlay};
  backdrop-filter: blur(8px);
  z-index: ${tokens.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing.lg};
`;

const ModalContent = styled(motion.div)<{ maxWidth: string }>`
  background: ${tokens.colors.glass.primary};
  backdrop-filter: blur(15px);
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius['2xl']};
  box-shadow: ${tokens.shadows.lg};
  width: 100%;
  max-width: ${props => props.maxWidth};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.secondaryGradient};
    border-radius: 3px;
  }
`;

const ModalHeader = styled.div`
  padding: ${tokens.spacing['2xl']} ${tokens.spacing['2xl']} ${tokens.spacing.lg};
  border-bottom: 1px solid ${tokens.colors.glass.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.fontWeights.bold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  background: ${tokens.colors.glass.primary};
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.xl};
  color: ${tokens.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all ${tokens.transitions.normal};
  
  &:hover {
    background: ${tokens.colors.glass.hover};
    border-color: rgba(255, 255, 255, 0.25);
    color: ${tokens.colors.text.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &::before {
    content: '✕';
    font-size: 0.9rem;
    line-height: 1;
  }
`;

const ModalBody = styled.div`
  padding: ${tokens.spacing.lg} ${tokens.spacing['2xl']} ${tokens.spacing['2xl']};
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50
  }
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '480px',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <ModalContent
            maxWidth={maxWidth}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                <CloseButton onClick={onClose} />
              </ModalHeader>
            )}
            
            <ModalBody>
              {children}
            </ModalBody>
            
            {!title && (
              <CloseButton 
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: tokens.spacing.lg,
                  right: tokens.spacing.lg,
                }}
              />
            )}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  );
};