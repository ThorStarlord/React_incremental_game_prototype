/**
 * @file ThemeContext.tsx
 * @description Provides theme management functionality for the incremental RPG.
 * 
 * This file is maintained for backward compatibility.
 * For new code, import theme components directly from the theme directory.
 * 
 * @deprecated Import theme components from the theme directory instead:
 * import { ThemeProviderWrapper, useTheme } from './theme';
 */

// Re-export everything from the modularized files
export * from './types';
export { ThemeContext } from './context';
export { ThemeProviderWrapper } from './provider';
export { useTheme } from './hooks';
export { defaultTheme } from './defaults';
