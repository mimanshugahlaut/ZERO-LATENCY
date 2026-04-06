import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils/constants';

export function useResponsive() {
  const getFlags = () => ({
    isMobile:  window.innerWidth < BREAKPOINTS.mobile,
    isTablet:  window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.desktop,
    isDesktop: window.innerWidth >= BREAKPOINTS.desktop,
    isWide:    window.innerWidth >= BREAKPOINTS.wide,
    width:     window.innerWidth,
  });

  const [flags, setFlags] = useState(getFlags);

  useEffect(() => {
    const handler = () => setFlags(getFlags());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return flags;
}
