import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

/**
 * @typedef {Object} ThemeContextType
 * @property {boolean} darkMode - Indicates if dark mode is enabled
 * @property {function} setDarkMode - Function to toggle dark mode
 * @property {string} primaryColor - Primary theme color
 * @property {function} setPrimaryColor - Function to set primary color
 * @property {string} secondaryColor - Secondary theme color
 * @property {function} setSecondaryColor - Function to set secondary color
 * @property {number} fontSize - Font size scale factor (0.8 to 1.2)
 * @property {function} setFontSize - Function to adjust font size scale
 * @property {function} resetTheme - Resets all theme settings to defaults
 */

/**
 * Context for theme customization throughout the application.
 * Provides dark/light mode, color customization, and font size adjustment.
 * @type {React.Context<ThemeContextType>}
 */
export const ThemeContext = createContext({
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
 * Default theme settings
 * @type {Object}
 */
const defaultTheme = {
  darkMode: false,
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  fontSize: 1,
};

/**
 * Provides theme context and MUI ThemeProvider to the application.
 * Manages theme state and persistence in localStorage.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the theme
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
 */
export const ThemeProviderWrapper = ({ children }) => {
  // Load theme settings from localStorage or use defaults
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || defaultTheme.primaryColor;
  });
  
  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem('secondaryColor') || defaultTheme.secondaryColor;
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return parseFloat(localStorage.getItem('fontSize')) || defaultTheme.fontSize;
  });

  // Persist theme settings in localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('fontSize', fontSize);
  }, [darkMode, primaryColor, secondaryColor, fontSize]);

  /**
   * Reset all theme settings to default values
   */
  const resetTheme = () => {
    setDarkMode(defaultTheme.darkMode);
    setPrimaryColor(defaultTheme.primaryColor);
    setSecondaryColor(defaultTheme.secondaryColor);
    setFontSize(defaultTheme.fontSize);
  };

  // Create the MUI theme based on current settings
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : primaryColor,
      },
      secondary: {
        main: darkMode ? '#f48fb1' : secondaryColor,
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
            backgroundImage: 'none',
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

/**
 * Custom hook to access and modify theme settings.
 * @returns {ThemeContextType} Theme context value
 * 
 * @example
 * // Inside a component:
 * import { useTheme } from '../context/ThemeContext';
 * 
 * function MyComponent() {
 *   const { darkMode, setDarkMode, fontSize, setFontSize } = useTheme();
 *   
 *   return (
 *     <div>
 *       <button onClick={() => setDarkMode(!darkMode)}>
 *         Toggle {darkMode ? 'Light' : 'Dark'} Mode
 *       </button>
 *       <button onClick={() => setFontSize(fontSize + 0.1)}>
 *         Increase Font Size
 *       </button>
 *     </div>
 *   );
 * }
 */
export const useTheme = () => useContext(ThemeContext);