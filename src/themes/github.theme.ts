import type { Theme } from '../types/theme';

export const GITHUB_THEME: Theme = {
  id: 'github',
  name: 'GitHub',
  colors: {
    background: {
      primary: '#0d1117',
      secondary: 'linear-gradient(135deg, rgba(33, 38, 45, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(33, 38, 45, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(48, 54, 61, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(22, 27, 34, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(13, 17, 23, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(33, 38, 45, 0.8)',
      secondary: 'rgba(22, 27, 34, 0.6)',
      border: 'rgba(48, 54, 61, 0.8)',
      hover: 'rgba(48, 54, 61, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#f0f6fc',
      secondary: '#7d8590',
      muted: '#656d76',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(35, 134, 54, 0.4)',
      error: 'rgba(248, 81, 73, 0.4)',
      warning: 'rgba(187, 128, 9, 0.4)',
      info: 'rgba(31, 111, 235, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(35, 134, 54, 0.2)',
      primaryHover: 'rgba(46, 160, 67, 0.3)',
      secondary: 'rgba(31, 111, 235, 0.2)',
      secondaryHover: 'rgba(56, 139, 253, 0.3)',
      disabled: 'rgba(125, 133, 144, 0.2)',
      focus: 'rgba(31, 111, 235, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
        'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
        'linear-gradient(135deg, #bb800a 0%, #d4a72c 100%)',
        'linear-gradient(135deg, #cf222e 0%, #da3633 100%)',
        'linear-gradient(135deg, #8250df 0%, #a475f9 100%)',
        'linear-gradient(135deg, #bf8700 0%, #d4a72c 100%)',
        'linear-gradient(135deg, #0969da 0%, #218bff 100%)',
        'linear-gradient(135deg, #7d8590 0%, #8b949e 100%)'
      ],
      pointer: '#f0f6fc',
      center: 'linear-gradient(135deg, #21262d 0%, #30363d 100%)'
    }
  }
};