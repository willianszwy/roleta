import type { Theme } from '../types/theme';

export const NOTION_THEME: Theme = {
  id: 'notion',
  name: 'Notion',
  colors: {
    background: {
      primary: '#191919',
      secondary: 'linear-gradient(135deg, rgba(32, 32, 32, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(32, 32, 32, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(42, 42, 42, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(25, 25, 25, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(20, 20, 20, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(32, 32, 32, 0.9)',
      secondary: 'rgba(25, 25, 25, 0.7)',
      border: 'rgba(42, 42, 42, 0.8)',
      hover: 'rgba(42, 42, 42, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#9b9a97',
      muted: '#6f6e69',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(103, 174, 62, 0.4)',
      error: 'rgba(235, 87, 87, 0.4)',
      warning: 'rgba(217, 115, 13, 0.4)',
      info: 'rgba(35, 131, 226, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(35, 131, 226, 0.2)',
      primaryHover: 'rgba(26, 115, 232, 0.3)',
      secondary: 'rgba(217, 115, 13, 0.2)',
      secondaryHover: 'rgba(184, 98, 10, 0.3)',
      disabled: 'rgba(155, 154, 151, 0.2)',
      focus: 'rgba(35, 131, 226, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #2383e2 0%, #1a73e8 100%)',
        'linear-gradient(135deg, #d9730d 0%, #b8620a 100%)',
        'linear-gradient(135deg, #67ae3e 0%, #4a7c2c 100%)',
        'linear-gradient(135deg, #eb5757 0%, #d73030 100%)',
        'linear-gradient(135deg, #9065b0 0%, #7c4dff 100%)',
        'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        'linear-gradient(135deg, #6f6e69 0%, #9b9a97 100%)'
      ],
      pointer: '#ffffff',
      center: 'linear-gradient(135deg, #202020 0%, #2a2a2a 100%)'
    }
  }
};