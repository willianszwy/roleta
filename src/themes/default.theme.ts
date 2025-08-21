import type { Theme } from '../types/theme';

export const DEFAULT_THEME: Theme = {
  id: 'default',
  name: 'TaskRoulette Original',
  colors: {
    background: {
      primary: '#0f0f23',
      secondary: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(120, 119, 198, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(75, 0, 130, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(30, 144, 255, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(255, 255, 255, 0.08)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.15)',
      hover: 'rgba(255, 255, 255, 0.12)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.6)',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(34, 197, 94, 0.3)',
      error: 'rgba(239, 68, 68, 0.3)',
      warning: 'rgba(251, 191, 36, 0.3)',
      info: 'rgba(59, 130, 246, 0.3)'
    },
    
    interactive: {
      primary: 'rgba(102, 126, 234, 0.2)',
      primaryHover: 'rgba(102, 126, 234, 0.3)',
      secondary: 'rgba(75, 192, 255, 0.2)',
      secondaryHover: 'rgba(75, 192, 255, 0.3)',
      disabled: 'rgba(156, 163, 175, 0.2)',
      focus: 'rgba(102, 126, 234, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
      ],
      pointer: '#ffffff',
      center: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }
};