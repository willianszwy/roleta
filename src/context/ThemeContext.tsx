import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { Theme, ThemeId, ThemeContextValue } from '../types/theme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_THEME } from '../themes/default.theme';
import { GITHUB_THEME } from '../themes/github.theme';
import { JIRA_THEME } from '../themes/jira.theme';
import { VSCODE_THEME } from '../themes/vscode.theme';
import { SLACK_THEME } from '../themes/slack.theme';
import { NOTION_THEME } from '../themes/notion.theme';
import { LINEAR_THEME } from '../themes/linear.theme';
import { ThemeContext } from './ThemeContextDefinition';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useLocalStorage<ThemeId>('taskroulette-theme', 'default');
  
  const themes: Record<ThemeId, Theme> = {
    default: DEFAULT_THEME,
    github: GITHUB_THEME,
    jira: JIRA_THEME,
    vscode: VSCODE_THEME,
    slack: SLACK_THEME,
    notion: NOTION_THEME,
    linear: LINEAR_THEME
  };
  
  const currentTheme = themes[themeId];
  
  const contextValue: ThemeContextValue = {
    currentTheme,
    themeId,
    setTheme: setThemeId,
    themes
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

