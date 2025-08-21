import type { Theme } from '../types/theme';

export const LINEAR_THEME: Theme = {
  id: 'linear',
  name: 'Linear',
  colors: {
    background: {
      primary: '#0c0c0f',
      secondary: 'linear-gradient(135deg, rgba(28, 28, 35, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(28, 28, 35, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(35, 35, 42, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(18, 18, 22, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(12, 12, 15, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(28, 28, 35, 0.9)',
      secondary: 'rgba(18, 18, 22, 0.7)',
      border: 'rgba(35, 35, 42, 0.8)',
      hover: 'rgba(35, 35, 42, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      muted: '#6b7280',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(16, 185, 129, 0.4)',
      error: 'rgba(239, 68, 68, 0.4)',
      warning: 'rgba(245, 158, 11, 0.4)',
      info: 'rgba(99, 102, 241, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(99, 102, 241, 0.2)',
      primaryHover: 'rgba(79, 70, 229, 0.3)',
      secondary: 'rgba(139, 92, 246, 0.2)',
      secondaryHover: 'rgba(124, 58, 237, 0.3)',
      disabled: 'rgba(156, 163, 175, 0.2)',
      focus: 'rgba(99, 102, 241, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
      ],
      pointer: '#ffffff',
      center: 'linear-gradient(135deg, #1c1c23 0%, #23232a 100%)'
    }
  }
};