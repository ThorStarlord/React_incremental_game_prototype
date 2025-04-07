import { ReactNode } from 'react';

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
export interface ThemeProviderProps {
  /** Child components that will have access to the theme */
  children: ReactNode;
}

/**
 * Default theme settings structure
 */
export interface ThemeSettings {
  /** Dark mode state */
  darkMode: boolean;
  
  /** Primary theme color */
  primaryColor: string;
  
  /** Secondary theme color */
  secondaryColor: string;
  
  /** Font size scale */
  fontSize: number;
}
