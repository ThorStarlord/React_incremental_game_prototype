import { createContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
});

export const ThemeProviderWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#303030' : '#ffffff',
        paper: darkMode ? '#424242' : '#ffffff',
      },
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
  }), [darkMode]);

  const value = useMemo(() => ({
    darkMode,
    setDarkMode,
  }), [darkMode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};