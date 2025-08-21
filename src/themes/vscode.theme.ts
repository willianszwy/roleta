import type { Theme } from '../types/theme';

export const VSCODE_THEME: Theme = {
  id: 'vscode',
  name: 'VS Code Dark',
  colors: {
    background: {
      primary: '#1e1e1e',
      secondary: 'linear-gradient(135deg, rgba(37, 37, 38, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(37, 37, 38, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(45, 45, 48, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(30, 30, 30, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(25, 25, 25, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(37, 37, 38, 0.9)',
      secondary: 'rgba(30, 30, 30, 0.7)',
      border: 'rgba(45, 45, 48, 0.8)',
      hover: 'rgba(45, 45, 48, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#cccccc',
      secondary: '#a6a6a6',
      muted: '#858585',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(115, 201, 144, 0.4)',
      error: 'rgba(240, 65, 36, 0.4)',
      warning: 'rgba(255, 204, 0, 0.4)',
      info: 'rgba(100, 148, 237, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(14, 99, 156, 0.2)',
      primaryHover: 'rgba(17, 119, 187, 0.3)',
      secondary: 'rgba(9, 71, 113, 0.2)',
      secondaryHover: 'rgba(14, 99, 156, 0.3)',
      disabled: 'rgba(166, 166, 166, 0.2)',
      focus: 'rgba(14, 99, 156, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #0e639c 0%, #1177bb 100%)',
        'linear-gradient(135deg, #73c990 0%, #5cb85c 100%)',
        'linear-gradient(135deg, #ffcc00 0%, #ffad00 100%)',
        'linear-gradient(135deg, #f04124 0%, #d42c20 100%)',
        'linear-gradient(135deg, #6494ed 0%, #4f94cd 100%)',
        'linear-gradient(135deg, #9966cc 0%, #8a2be2 100%)',
        'linear-gradient(135deg, #ff6347 0%, #ff4500 100%)',
        'linear-gradient(135deg, #858585 0%, #a6a6a6 100%)'
      ],
      pointer: '#cccccc',
      center: 'linear-gradient(135deg, #252526 0%, #2d2d30 100%)'
    }
  }
};