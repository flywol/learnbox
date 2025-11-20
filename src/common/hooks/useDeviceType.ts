import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface UseDeviceTypeReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
}

const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
};

export const useDeviceType = (): UseDeviceTypeReturn => {
  // SSR-safe initial state
  const getInitialState = (): UseDeviceTypeReturn => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        deviceType: 'desktop',
      };
    }

    const isMobile = window.matchMedia(breakpoints.mobile).matches;
    const isTablet = window.matchMedia(breakpoints.tablet).matches;
    const isDesktop = window.matchMedia(breakpoints.desktop).matches;

    let deviceType: DeviceType = 'desktop';
    if (isMobile) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';

    return { isMobile, isTablet, isDesktop, deviceType };
  };

  const [state, setState] = useState<UseDeviceTypeReturn>(getInitialState);

  useEffect(() => {
    // Skip if window is not available
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia(breakpoints.mobile);
    const tabletQuery = window.matchMedia(breakpoints.tablet);
    const desktopQuery = window.matchMedia(breakpoints.desktop);

    const updateDeviceType = () => {
      const isMobile = mobileQuery.matches;
      const isTablet = tabletQuery.matches;
      const isDesktop = desktopQuery.matches;

      let deviceType: DeviceType = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      setState({ isMobile, isTablet, isDesktop, deviceType });
    };

    // Add listeners
    mobileQuery.addEventListener('change', updateDeviceType);
    tabletQuery.addEventListener('change', updateDeviceType);
    desktopQuery.addEventListener('change', updateDeviceType);

    // Initial check
    updateDeviceType();

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', updateDeviceType);
      tabletQuery.removeEventListener('change', updateDeviceType);
      desktopQuery.removeEventListener('change', updateDeviceType);
    };
  }, []);

  return state;
};
