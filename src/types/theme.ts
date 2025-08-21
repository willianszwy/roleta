export interface Theme {
  id: string;
  name: string;
  colors: {
    // Background gradients
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      radial1: string;
      radial2: string;
      radial3: string;
    };
    
    // Glass morphism
    glass: {
      primary: string;
      secondary: string;
      border: string;
      hover: string;
      backdrop: string;
    };
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      muted: string;
      contrast: string;
    };
    
    // Status colors
    status: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    
    // Interactive elements
    interactive: {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
      disabled: string;
      focus: string;
    };
    
    // Roulette specific
    roulette: {
      segments: string[];
      pointer: string;
      center: string;
    };
  };
  
  // Typography & spacing (optional per theme)
  typography?: {
    fontFamily?: string;
    fontSizes?: Record<string, string>;
  };
  
  // Animations (optional per theme)
  animations?: {
    duration?: Record<string, string>;
    easing?: Record<string, string>;
  };
}

// Pre-defined themes
export type ThemeId = 'default' | 'github' | 'jira' | 'vscode' | 'slack' | 'notion' | 'linear';

export interface ThemeContextValue {
  currentTheme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  themes: Record<ThemeId, Theme>;
}