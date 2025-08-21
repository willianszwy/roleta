import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

interface ConfirmationProviderProps {
  children: ReactNode;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    state.resolve?.(false);
  }, [state.resolve]);

  const handleConfirm = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    state.resolve?.(true);
  }, [state.resolve]);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        isOpen={state.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant || 'info'}
      />
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};