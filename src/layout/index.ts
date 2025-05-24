// Modern layout system (Recommended)
export { GameLayout } from './components/GameLayout';
export { MainContentArea } from './components/MainContentArea';
export { VerticalNavBar } from './components/VerticalNavBar/VerticalNavBar';

// Layout state management
export { useLayoutState } from './hooks/useLayoutState';
export type { 
  UseLayoutStateOptions, 
  UseLayoutStateReturn,
  TabId 
} from './hooks/useLayoutState';

// Layout types and constants
export type { NavigationItem, NavigationSection } from './types/NavigationTypes';
export { NAVIGATION_ITEMS, NAVIGATION_SECTIONS } from './constants/NavigationConstants';

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