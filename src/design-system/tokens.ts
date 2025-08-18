// Design tokens for TaskRoulette application
export const tokens = {
  // Color palette
  colors: {
    // Primary gradients
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondaryGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    
    // Base colors
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#4facfe',
      light: '#7dd3fc',
      dark: '#0ea5e9',
    },
    
    // Status colors
    success: {
      main: '#22c55e',
      light: '#4ade80',
      background: 'rgba(34, 197, 94, 0.3)',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      background: 'rgba(239, 68, 68, 0.3)',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      background: 'rgba(251, 191, 36, 0.3)',
    },
    
    // Glass morphism colors
    glass: {
      primary: 'rgba(255, 255, 255, 0.08)',
      secondary: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.15)',
      hover: 'rgba(255, 255, 255, 0.12)',
      active: 'rgba(255, 255, 255, 0.2)',
    },
    
    // Text colors
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(156, 163, 175, 0.6)',
    },
    
    // Background
    background: {
      body: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      overlay: 'rgba(15, 15, 35, 0.9)',
    },
  },
  
  // Typography
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeights: {
      normal: 500,
      medium: 600,
      bold: 700,
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    lineHeights: {
      tight: 1.1,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    '4xl': '2.5rem', // 40px
    '5xl': '3rem',   // 48px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(31, 38, 135, 0.37)',
    glow: '0 0 0 2px rgba(102, 126, 234, 0.1)',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
    skipLinks: 9999,
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
} as const;

export type Tokens = typeof tokens;