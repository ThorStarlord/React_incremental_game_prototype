import { useTheme, alpha } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useCallback, useMemo } from 'react';

/**
 * Interface for the return value of the useThemeUtils hook
 */
interface UseThemeUtilsReturn {
  isDarkMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  getContrastText: (backgroundColor: string) => string;
  getAlphaColor: (color: string, opacity: number) => string;
  getElevationBackground: (elevation: number) => string;
  getResponsiveValue: <T>(
    options: {
      mobile: T;
      tablet?: T;
      desktop?: T;
    }
  ) => T;
}

/**
 * A custom hook that provides utility functions for working with Material-UI theme
 * 
 * @returns {UseThemeUtilsReturn} Theme utility functions and responsive breakpoints
 */
const useThemeUtils = (): UseThemeUtilsReturn => {
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Determine if dark mode is active
  const isDarkMode = theme.palette.mode === 'dark';
  
  /**
   * Get a text color with proper contrast for the given background color
   * 
   * @param {string} backgroundColor - The background color to contrast against
   * @returns {string} A text color with sufficient contrast
   */
  const getContrastText = useCallback((backgroundColor: string): string => {
    return theme.palette.getContrastText(backgroundColor);
  }, [theme]);
  
  /**
   * Apply an alpha/opacity value to a color
   * 
   * @param {string} color - The base color to apply opacity to
   * @param {number} opacity - The opacity value between 0 and 1
   * @returns {string} The color with applied opacity
   */
  const getAlphaColor = useCallback((color: string, opacity: number): string => {
    return alpha(color, opacity);
  }, []);
  
  /**
   * Get background color for a specific elevation in the current theme
   * 
   * @param {number} elevation - The elevation value (0-24)
   * @returns {string} The background color for the elevation
   */
  const getElevationBackground = useCallback((elevation: number): string => {
    if (elevation < 0 || elevation > 24) {
      console.warn('Elevation should be between 0 and 24');
      elevation = Math.max(0, Math.min(24, elevation));
    }
    
    const elevationColor = isDarkMode
      ? theme.palette.background.default
      : theme.palette.background.paper;
      
    // Add slight opacity based on elevation
    return alpha(elevationColor, 1 + (elevation * 0.01));
  }, [theme, isDarkMode]);
  
  /**
   * Get a value based on current responsive breakpoint
   * 
   * @template T - The type of the value to return
   * @param {Object} options - Object containing values for different breakpoints
   * @param {T} options.mobile - Value for mobile breakpoint
   * @param {T} [options.tablet] - Value for tablet breakpoint, falls back to mobile
   * @param {T} [options.desktop] - Value for desktop breakpoint, falls back to tablet
   * @returns {T} The appropriate value for the current breakpoint
   */
  const getResponsiveValue = useCallback(<T>(
    options: {
      mobile: T;
      tablet?: T;
      desktop?: T;
    }
  ): T => {
    if (isDesktop) {
      return options.desktop || options.tablet || options.mobile;
    }
    
    if (isTablet) {
      return options.tablet || options.mobile;
    }
    
    return options.mobile;
  }, [isDesktop, isTablet]);

  return {
    isDarkMode,
    isMobile,
    isTablet,
    isDesktop,
    getContrastText,
    getAlphaColor,
    getElevationBackground,
    getResponsiveValue
  };
};

export default useThemeUtils;
