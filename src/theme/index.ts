/**
 * @file index.ts
 * @description Theme module barrel file that exports all theme-related functionality.
 * 
 * This file centralizes all theme exports, making it easier to import theme components
 * and utilities from a single location.
 */

// Export types and interfaces
export * from './types';

// Export theme context
export { ThemeContext } from './context';

// Export the provider component
export { ThemeProviderWrapper } from './provider';

// Export hooks
export { useTheme } from './hooks';

// Export default theme settings
export { defaultTheme } from './defaults';
