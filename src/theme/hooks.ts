import { useContext } from 'react';
import { ThemeContext } from './context';
import { ThemeContextType } from './types';

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
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProviderWrapper');
  }
  return context;
};
