import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { ThemeProviderProps } from './types';
import { ThemeContext } from './context';
import { defaultTheme } from './defaults';

/**
 * Provides theme context and MUI ThemeProvider to the application.
 * Manages theme state and persistence in localStorage.
 * 
 * This component:
 * 1. Initializes theme state from localStorage or defaults
 * 2. Creates a Material UI theme based on current settings
 * 3. Persists theme changes to localStorage
 * 4. Provides theme state and setters via context
 * 
 * Wrap your root application component with this provider to enable
 * theme functionality throughout your application.
 * 
 * @component
 * @param {ThemeProviderProps} props - Component props
 * @returns {JSX.Element} ThemeProvider component
 * 
 * @example
 * // Wrap your app with ThemeProviderWrapper
 * import { ThemeProviderWrapper } from './theme';
 * 
 * function App() {
 *   return (
 *     <ThemeProviderWrapper>
 *       <YourAppComponent />
 *     </ThemeProviderWrapper>
 *   );
 * }
 */
export const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
  // Load theme settings from localStorage or use defaults
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || defaultTheme.primaryColor;
  });
  
  const [secondaryColor, setSecondaryColor] = useState<string>(() => {
    return localStorage.getItem('secondaryColor') || defaultTheme.secondaryColor;
  });
  
  const [fontSize, setFontSize] = useState<number>(() => {
    const storedSize = localStorage.getItem('fontSize');
    return storedSize ? parseFloat(storedSize) : defaultTheme.fontSize;
  });

  // Persist theme settings in localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('fontSize', fontSize.toString());
  }, [darkMode, primaryColor, secondaryColor, fontSize]);

  /**
   * Reset all theme settings to default values
   * This restores the original theme settings defined in defaultTheme
   */
  const resetTheme = (): void => {
    setDarkMode(defaultTheme.darkMode);
    setPrimaryColor(defaultTheme.primaryColor);
    setSecondaryColor(defaultTheme.secondaryColor);
    setFontSize(defaultTheme.fontSize);
  };

  // Create the MUI theme based on current settings
  const theme = useMemo<Theme>(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : primaryColor, // Lighter blue for dark mode
      },
      secondary: {
        main: darkMode ? '#f48fb1' : secondaryColor, // Lighter pink for dark mode
      },
      background: {
        default: darkMode ? '#303030' : '#ffffff',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
    typography: {
      fontSize: 14 * fontSize, // Base font size scaled by fontSize factor
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove default gradient
          },
        },
      },
    },
  }), [darkMode, primaryColor, secondaryColor, fontSize]);

  // Create context value with all theme setters
  const value = useMemo(() => ({
    darkMode,
    setDarkMode,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    fontSize,
    setFontSize,
    resetTheme,
  }), [darkMode, primaryColor, secondaryColor, fontSize]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
