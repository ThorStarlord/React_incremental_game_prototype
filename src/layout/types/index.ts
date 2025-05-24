/**
 * Layout types barrel export
 * Provides clean public API for layout type definitions
 */

// Navigation types
export type {
  TabId,
  NavItem,
  NavSection,
  NavigationState,
  NavigationConfig,
  NavigationEvents,
  NavigationContextValue,
  TabContentProps,
  RouteNavItem,
  NavigationMode,
  UseNavigationReturn
} from './NavigationTypes';

// Re-export commonly used types for convenience
export type { TabId as MainTabId } from './NavigationTypes';
