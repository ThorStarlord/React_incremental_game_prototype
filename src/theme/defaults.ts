import { ThemeSettings } from './types';

/**
 * Default theme settings object
 * Used for initial state and theme reset functionality
 */
export const defaultTheme: ThemeSettings = {
  /** Default is light mode (false) */
  darkMode: false,
  
  /** Default primary color - Material UI blue */
  primaryColor: '#355c69',
  
  /** Default secondary color - Material UI pink */
  secondaryColor: '#a36c39',
  
  /** Default font size scale (1 = normal) */
  fontSize: 1,
};
