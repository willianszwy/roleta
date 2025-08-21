import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AlertModal } from '../components/AlertModal';

interface AlertOptions {
  title: string;
  message: string;
  buttonText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

interface AlertContextType {
  alert: (options: AlertOptions) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | null>(null);

interface AlertState extends AlertOptions {
  isOpen: boolean;
  resolve?: () => void;
}

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [state, setState] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const alert = useCallback((options: AlertOptions): Promise<void> => {
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
    state.resolve?.();
  }, [state.resolve]);

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <AlertModal
        isOpen={state.isOpen}
        onClose={handleClose}
        title={state.title}
        message={state.message}
        buttonText={state.buttonText}
        variant={state.variant || 'info'}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};