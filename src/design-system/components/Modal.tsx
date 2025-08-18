import React, { useEffect, useRef, useId } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { tokens } from '../tokens';
import { useFocusTrap } from '../../hooks/useA11y';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  role?: string;
  initialFocus?: React.RefObject<HTMLElement>;
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
  
  &:focus {
    outline: none;
    box-shadow: ${tokens.shadows.glow};
  }
  
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
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
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  role = 'dialog',
  initialFocus,
}) => {
  const modalRef = useFocusTrap(isOpen);
  const titleId = useId();
  const descriptionId = useId();
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
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
      // Save current focus and manage body scroll
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus management
      setTimeout(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          firstFocusable?.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
      
      // Restore previous focus
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialFocus, modalRef]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnOverlayClick ? onClose : undefined}
          role="presentation"
        >
          <ModalContent
            ref={modalRef as any}
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
            role={role}
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={title ? (ariaLabelledBy || titleId) : ariaLabelledBy}
            aria-describedby={ariaDescribedBy || descriptionId}
            tabIndex={-1}
          >
            {title && (
              <ModalHeader>
                <ModalTitle id={titleId}>{title}</ModalTitle>
                <CloseButton 
                  onClick={onClose}
                  aria-label="Fechar modal"
                  type="button"
                />
              </ModalHeader>
            )}
            
            <ModalBody id={descriptionId}>
              {children}
            </ModalBody>
            
            {!title && (
              <CloseButton 
                onClick={onClose}
                aria-label="Fechar modal"
                type="button"
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