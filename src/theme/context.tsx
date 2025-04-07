import { createContext } from 'react';
import { ThemeContextType } from './types';
import { defaultTheme } from './defaults';

/**
 * Context for theme customization throughout the application.
 * Provides dark/light mode, color customization, and font size adjustment.
 * This context is consumed by the useTheme() hook.
 * 
 * @see useTheme
 */
export const ThemeContext = createContext<ThemeContextType>({
  darkMode: defaultTheme.darkMode,
  setDarkMode: () => {},
  primaryColor: defaultTheme.primaryColor,
  setPrimaryColor: () => {},
  secondaryColor: defaultTheme.secondaryColor,
  setSecondaryColor: () => {},
  fontSize: defaultTheme.fontSize,
  setFontSize: () => {},
  resetTheme: () => {},
});
