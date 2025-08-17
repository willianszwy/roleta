import { useState, useEffect } from 'react';
import { tokens } from '../tokens';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

const breakpointValues = {
  mobile: parseInt(tokens.breakpoints.mobile),
  tablet: parseInt(tokens.breakpoints.tablet),
  desktop: parseInt(tokens.breakpoints.desktop),
  wide: parseInt(tokens.breakpoints.wide),
};

export function useBreakpoint(): {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
} {
  const [width, setWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current: Breakpoint = 
    width >= breakpointValues.wide ? 'wide' :
    width >= breakpointValues.desktop ? 'desktop' :
    width >= breakpointValues.tablet ? 'tablet' : 'mobile';

  return {
    current,
    isMobile: current === 'mobile',
    isTablet: current === 'tablet',
    isDesktop: current === 'desktop',
    isWide: current === 'wide',
    width,
  };
}