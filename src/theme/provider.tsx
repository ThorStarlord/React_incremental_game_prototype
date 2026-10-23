import React, { useCallback, useMemo } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectSettingsState } from '../features/Settings/state/SettingsSelectors';
import { updateSetting, resetSettings } from '../features/Settings/state/SettingsSlice';
import { saveSettingsThunk } from '../features/Settings/state/SettingsThunks';
import { ThemeProviderProps } from './types';
import { ThemeContext } from './context';
import { defaultTheme } from './defaults';

/**
 * Single effective appearance authority: Redux Settings. The previous nested
 * providers and independent localStorage theme state could disagree with the
 * controls shown on SettingsPage. Legacy preferences are migrated at startup.
 */
export const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettingsState);
  const darkMode = settings.graphics.darkMode;
  const primaryColor = settings.ui.primaryColor || defaultTheme.primaryColor;
  const secondaryColor = settings.ui.secondaryColor || defaultTheme.secondaryColor;
  const fontSize = settings.ui.fontSize === 'large' ? 1.2 : settings.ui.fontSize === 'small' ? 0.85 : 1;

  const persistSetting = useCallback((category: 'graphics' | 'ui', setting: string, value: unknown) => {
    dispatch(updateSetting({ category, setting, value }));
    void dispatch(saveSettingsThunk());
  }, [dispatch]);

  const setDarkMode = useCallback((value: boolean) => persistSetting('graphics', 'darkMode', value), [persistSetting]);
  const setPrimaryColor = useCallback((value: string) => persistSetting('ui', 'primaryColor', value), [persistSetting]);
  const setSecondaryColor = useCallback((value: string) => persistSetting('ui', 'secondaryColor', value), [persistSetting]);
  const setFontSize = useCallback((value: number) => persistSetting(
    'ui', 'fontSize', value > 1.05 ? 'large' : value < 0.95 ? 'small' : 'medium'
  ), [persistSetting]);
  const resetTheme = useCallback(() => {
    dispatch(resetSettings());
    void dispatch(saveSettingsThunk());
  }, [dispatch]);

  const theme = useMemo<Theme>(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#90caf9' : primaryColor },
      secondary: { main: darkMode ? '#f48fb1' : secondaryColor },
      background: {
        default: darkMode ? '#20262d' : '#f5f7f9',
        paper: darkMode ? '#2c343e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: "'Segoe UI', 'Inter', system-ui, sans-serif",
      fontSize: 14 * fontSize,
    },
    shape: { borderRadius: 10 },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    },
  }), [darkMode, primaryColor, secondaryColor, fontSize]);

  const value = useMemo(() => ({
    darkMode, setDarkMode, primaryColor, setPrimaryColor, secondaryColor,
    setSecondaryColor, fontSize, setFontSize, resetTheme,
  }), [darkMode, setDarkMode, primaryColor, setPrimaryColor, secondaryColor,
    setSecondaryColor, fontSize, setFontSize, resetTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
