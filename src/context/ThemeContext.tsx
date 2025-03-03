/**
 * @file ThemeContext.tsx
 * @description Provides theme management functionality for the incremental RPG.
 * 
 * This module implements a comprehensive theme system that handles:
 * - Dark/light mode toggle
 * - Primary and secondary color customization
 * - Font size scaling for accessibility
 * - Theme persistence between sessions
 * - Material UI theme integration
 * 
 * The theme system uses React Context to make theme settings and controls
 * available throughout the application without prop drilling.
 * 
 * @example
 * // In your main app component:
 * import { ThemeProviderWrapper } from './context/ThemeContext';
 * 
 * function App() {
 *   return (
 *     <ThemeProviderWrapper>
 *       <YourAppContent />
 *     </ThemeProviderWrapper>
 *   );
 * }
 */

import React, { createContext, useState, useEffect, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';

/**
 * Type definition for the theme context
 * Contains all theme-related state and functions
 * 
 * @interface ThemeContextType
 * @property {boolean} darkMode - Whether dark mode is currently enabled
 * @property {function} setDarkMode - Function to enable or disable dark mode
 * @property {string} primaryColor - Hex color code for primary theme color
 * @property {function} setPrimaryColor - Function to update primary color
 * @property {string} secondaryColor - Hex color code for secondary theme color
 * @property {function} setSecondaryColor - Function to update secondary color
 * @property {number} fontSize - Scale factor for application font size (0.8 to 1.2)
 * @property {function} setFontSize - Function to adjust font scaling
 * @property {function} resetTheme - Resets all theme settings to default values
 */
export interface ThemeContextType {
  /** Indicates if dark mode is enabled */
  darkMode: boolean;
  
  /** 
   * Function to toggle dark mode 
   * @param {boolean} darkMode - New dark mode state
   */
  setDarkMode: (darkMode: boolean) => void;
  
  /** Primary theme color (hex code) */
  primaryColor: string;
  
  /**
   * Function to set primary color
   * @param {string} color - Hex color code (e.g., '#1976d2')
   */
  setPrimaryColor: (color: string) => void;
  
  /** Secondary theme color (hex code) */
  secondaryColor: string;
  
  /**
   * Function to set secondary color
   * @param {string} color - Hex color code (e.g., '#dc004e')
   */
  setSecondaryColor: (color: string) => void;
  
  /** 
   * Font size scale factor (0.8 to 1.2)
   * - Values below 1.0 reduce font size
   * - Values above 1.0 increase font size
   * - 1.0 is the default size
   */
  fontSize: number;
  
  /**
   * Function to adjust font size scale
   * @param {number} size - New font scale factor (typically between 0.8 and 1.2)
   */
  setFontSize: (size: number) => void;
  
  /** Resets all theme settings to defaults */
  resetTheme: () => void;
}

/**
 * Props for the ThemeProviderWrapper component
 * 
 * @interface ThemeProviderProps
 * @property {ReactNode} children - Child components that will receive theme context
 */
interface ThemeProviderProps {
  /** Child components that will have access to the theme */
  children: ReactNode;
}

/**
 * Default theme settings object
 * Used for initial state and theme reset functionality
 */
const defaultTheme = {
  /** Default is light mode (false) */
  darkMode: false,
  
  /** Default primary color - Material UI blue */
  primaryColor: '#1976d2',
  
  /** Default secondary color - Material UI pink */
  secondaryColor: '#dc004e',
  
  /** Default font size scale (1 = normal) */
  fontSize: 1,
};

/**
 * Context for theme customization throughout the application.
 * Provides dark/light mode, color customization, and font size adjustment.
 * This context is consumed by the useTheme() hook.
 * 
 * @see useTheme
 */
export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  primaryColor: '#1976d2',
  setPrimaryColor: () => {},
  secondaryColor: '#dc004e',
  setSecondaryColor: () => {},
  fontSize: 1,
  setFontSize: () => {},
  resetTheme: () => {},
});

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
 * import { ThemeProviderWrapper } from './context/ThemeContext';
 * 
 * function App() {
 *   return (
 *     <ThemeProviderWrapper>
 *       <YourAppComponent />
 *     </ThemeProviderWrapper>
 *   );
 * }
 * 
 * @example
 * // Using with React Router
 * import { ThemeProviderWrapper } from './context/ThemeContext';
 * import { BrowserRouter } from 'react-router-dom';
 * 
 * function App() {
 *   return (
 *     <ThemeProviderWrapper>
 *       <BrowserRouter>
 *         <AppRoutes />
 *       </BrowserRouter>
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
  const value = useMemo<ThemeContextType>(() => ({
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

/**
 * Custom hook to access and modify theme settings.
 * This is the recommended way to interact with the theme.
 * 
 * @returns {ThemeContextType} Theme context value with state and setter functions
 * @throws {Error} If used outside a ThemeProviderWrapper
 * 
 * @example
 * // Toggle dark mode
 * function DarkModeToggle() {
 *   const { darkMode, setDarkMode } = useTheme();
 *   
 *   return (
 *     <Button 
 *       onClick={() => setDarkMode(!darkMode)}
 *       startIcon={darkMode ? <LightModeIcon /> : <DarkModeIcon />}
 *     >
 *       {darkMode ? 'Light Mode' : 'Dark Mode'}
 *     </Button>
 *   );
 * }
 * 
 * @example
 * // Color picker for theme customization
 * function ColorCustomizer() {
 *   const { primaryColor, setPrimaryColor } = useTheme();
 *   
 *   return (
 *     <div>
 *       <label htmlFor="colorPicker">Theme Color:</label>
 *       <input 
 *         id="colorPicker"
 *         type="color" 
 *         value={primaryColor} 
 *         onChange={(e) => setPrimaryColor(e.target.value)}
 *       />
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Font size accessibility control
 * function FontSizeControl() {
 *   const { fontSize, setFontSize } = useTheme();
 *   
 *   const increaseFontSize = () => {
 *     setFontSize(Math.min(fontSize + 0.1, 1.5));
 *   };
 *   
 *   const decreaseFontSize = () => {
 *     setFontSize(Math.max(fontSize - 0.1, 0.7));
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={decreaseFontSize}>A-</button>
 *       <span>Font Size: {Math.round(fontSize * 100)}%</span>
 *       <button onClick={increaseFontSize}>A+</button>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Reset theme to defaults
 * function ResetThemeButton() {
 *   const { resetTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={resetTheme}>
 *       Reset to Default Theme
 *     </button>
 *   );
 * }
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProviderWrapper');
  }
  return context;
};
