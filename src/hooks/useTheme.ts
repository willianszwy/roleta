import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextDefinition';
import type { ThemeContextValue } from '../types/theme';

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};