import type { Theme } from '../types/theme';

export const JIRA_THEME: Theme = {
  id: 'jira',
  name: 'Jira',
  colors: {
    background: {
      primary: '#1d2125',
      secondary: 'linear-gradient(135deg, rgba(34, 39, 43, 0.05) 0%, transparent 30%)',
      tertiary: 'radial-gradient(ellipse 150vw 80vh at 20% 30%, rgba(34, 39, 43, 0.08) 0%, transparent 70%)',
      radial1: 'radial-gradient(ellipse 80vw 60vh at 80% 20%, rgba(44, 51, 58, 0.05) 0%, transparent 60%)',
      radial2: 'radial-gradient(ellipse 120vw 100vh at 50% 80%, rgba(29, 33, 37, 0.03) 0%, transparent 50%)',
      radial3: 'radial-gradient(ellipse 100vw 80vh at 10% 60%, rgba(22, 25, 28, 0.04) 0%, transparent 70%)'
    },
    
    glass: {
      primary: 'rgba(34, 39, 43, 0.9)',
      secondary: 'rgba(29, 33, 37, 0.7)',
      border: 'rgba(44, 51, 58, 0.8)',
      hover: 'rgba(44, 51, 58, 0.9)',
      backdrop: 'blur(15px)'
    },
    
    text: {
      primary: '#b3bac5',
      secondary: '#9fadbc',
      muted: '#8590a2',
      contrast: '#ffffff'
    },
    
    status: {
      success: 'rgba(0, 163, 191, 0.4)',
      error: 'rgba(222, 53, 11, 0.4)',
      warning: 'rgba(255, 171, 0, 0.4)',
      info: 'rgba(0, 82, 204, 0.4)'
    },
    
    interactive: {
      primary: 'rgba(0, 82, 204, 0.2)',
      primaryHover: 'rgba(0, 101, 255, 0.3)',
      secondary: 'rgba(0, 163, 191, 0.2)',
      secondaryHover: 'rgba(0, 184, 217, 0.3)',
      disabled: 'rgba(159, 173, 188, 0.2)',
      focus: 'rgba(0, 82, 204, 0.5)'
    },
    
    roulette: {
      segments: [
        'linear-gradient(135deg, #0052cc 0%, #0065ff 100%)',
        'linear-gradient(135deg, #00a3bf 0%, #00b8d9 100%)',
        'linear-gradient(135deg, #ffab00 0%, #ffc400 100%)',
        'linear-gradient(135deg, #de350b 0%, #ff5630 100%)',
        'linear-gradient(135deg, #5243aa 0%, #8777d9 100%)',
        'linear-gradient(135deg, #00875a 0%, #36b37e 100%)',
        'linear-gradient(135deg, #6554c0 0%, #998dd9 100%)',
        'linear-gradient(135deg, #8590a2 0%, #9fadbc 100%)'
      ],
      pointer: '#b3bac5',
      center: 'linear-gradient(135deg, #22272b 0%, #2c333a 100%)'
    }
  }
};