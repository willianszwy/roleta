import type { Theme } from '../types/theme';

export const SLACK_THEME: Theme = {
  id: 'slack',
  name: 'Slack',
  colors: {
    background: {
      primary: '#1a1d21',
      secondary: 'linear-gradient(135deg, rgba(34, 37, 41, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(34, 37, 41, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(44, 45, 48, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(26, 29, 33, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(22, 24, 27, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(34, 37, 41, 0.9)',
      secondary: 'rgba(26, 29, 33, 0.7)',
      border: 'rgba(44, 45, 48, 0.8)',
      hover: 'rgba(44, 45, 48, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#ababad',
      muted: '#868686',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(20, 133, 103, 0.4)',
      error: 'rgba(224, 30, 90, 0.4)',
      warning: 'rgba(255, 180, 0, 0.4)',
      info: 'rgba(74, 21, 75, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(74, 21, 75, 0.2)',
      primaryHover: 'rgba(97, 31, 105, 0.3)',
      secondary: 'rgba(0, 122, 90, 0.2)',
      secondaryHover: 'rgba(20, 133, 103, 0.3)',
      disabled: 'rgba(134, 134, 134, 0.2)',
      focus: 'rgba(74, 21, 75, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #4a154b 0%, #611f69 100%)',
        'linear-gradient(135deg, #007a5a 0%, #148567 100%)',
        'linear-gradient(135deg, #ffb400 0%, #ffcc33 100%)',
        'linear-gradient(135deg, #e01e5a 0%, #ff4081 100%)',
        'linear-gradient(135deg, #36c5f0 0%, #2eb5e0 100%)',
        'linear-gradient(135deg, #ecb22e 0%, #f4d03f 100%)',
        'linear-gradient(135deg, #2eb67d 0%, #36b37e 100%)',
        'linear-gradient(135deg, #868686 0%, #ababad 100%)'
      ],
      pointer: '#ffffff',
      center: 'linear-gradient(135deg, #222529 0%, #2c2d30 100%)'
    }
  }
};