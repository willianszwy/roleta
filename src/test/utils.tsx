import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

// Mock theme provider se necessário
const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Custom render que inclui providers necessários
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <MockThemeProvider>{children}</MockThemeProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock data generators
export const createMockParticipant = (overrides = {}) => ({
  id: 'test-id',
  name: 'Test Participant',
  color: '#ff5722',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockTask = (overrides = {}) => ({
  id: 'test-task-id',
  name: 'Test Task',
  description: 'Test Description',
  color: '#2196f3',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockHistory = (overrides = {}) => ({
  id: 'test-history-id',
  participantId: 'test-participant-id',
  participantName: 'Test Participant',
  selectedAt: new Date('2024-01-01'),
  removed: false,
  ...overrides,
});

// Test utilities
export const waitForAnimation = () => 
  new Promise(resolve => setTimeout(resolve, 100));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return { ...store };
    },
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };