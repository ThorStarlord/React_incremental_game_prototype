// Modern layout system (Recommended)
export { GameLayout } from './components/GameLayout';
export { MainContentArea } from './components/MainContentArea';
export { VerticalNavBar } from './components/VerticalNavBar/VerticalNavBar';

// Layout state management
export { useLayoutState } from './hooks/useLayoutState';
export type { 
  UseLayoutStateOptions, 
  UseLayoutStateReturn
  // TabId is exported from ./types/NavigationTypes below
} from './hooks/useLayoutState';

// Layout types and constants
import type { NavItem as NavItemType, NavSection as NavSectionType, TabId as TabIdType } from './types/NavigationTypes'; // Import with alias

export type NavItem = NavItemType;
export type NavSection = NavSectionType;
export type TabId = TabIdType; // Re-export TabId as well for consistency here

export { NAVIGATION_ITEMS, NAVIGATION_SECTIONS } from './constants/navigationConfig'; // Corrected path

// Legacy components (Deprecated - will be removed)
/**
 * @deprecated Legacy layout components are deprecated
 * 
 * GameContainer and 3-column layout components (LeftColumn, MiddleColumn, RightColumn)
 * have been replaced by GameLayout with better performance and maintainability.
 * 
 * Please migrate to:
 * - GameLayout: Unified layout component
 * - VerticalNavBar: Responsive navigation
 * - MainContentArea: Dynamic content management
 * - useLayoutState: Centralized layout state management
 */
export { 
  GameContainer,
  LeftColumn, 
  MiddleColumn, 
  RightColumn 
} from './components';

// Hooks
export * from './hooks';
