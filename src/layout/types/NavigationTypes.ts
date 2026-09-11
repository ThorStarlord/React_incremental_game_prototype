/**
 * Core navigation type definitions for the tabbed layout system.
 *
 * The union intentionally retains historical/deferred IDs so persisted layout
 * state and old code references can be interpreted safely. Presence in TabId
 * does not mean a destination belongs to Campaign One / 1.0.
 */

export type TabId =
  | 'dashboard'     // Implemented 1.0 overview
  | 'character'     // Implemented 1.0 character state
  | 'traits'        // Implemented 1.0 capability authority
  | 'skills'        // Legacy ID; separate generic skill tree is CUT for 1.0
  | 'npcs'          // Implemented NPC / Relationship interaction
  | 'quests'        // Implemented quest surface
  | 'copies'        // Implemented Copy / delegation surface
  | 'essence'       // Implemented Essence / Resonance surface
  | 'inventory'     // Legacy ID; general inventory is DEFER_POST_1_0
  | 'settings'      // Implemented settings surface
  | 'saves'         // Legacy duplicate-save placeholder ID; CUT for 1.0
  | 'crafting'      // Legacy ID; generic crafting is CUT for Campaign One
  | 'save-load'     // Legacy duplicate-save route ID; main menu owns persistence UX
  | 'debug';        // Development-only tooling

export interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  route?: string;
  isImplemented: boolean;
  tooltip?: string;
  requiresCondition?: () => boolean;
  badge?: BadgeConfig;
  section?: string;
}

export interface BadgeConfig {
  count?: number | string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'standard' | 'dot';
  invisible?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface NavigationState {
  activeTab: TabId;
  previousTab?: TabId;
  history: TabId[];
  isTransitioning: boolean;
}

export interface NavigationConfig {
  defaultTab: TabId;
  maxHistoryLength: number;
  persistState: boolean;
  storageKey: string;
  enableTransitions: boolean;
  transitionDuration: number;
}

export interface NavigationEvents {
  onNavigate: (from: TabId, to: TabId) => void;
  onBeforeNavigate: (from: TabId, to: TabId) => boolean | Promise<boolean>;
  onAfterNavigate: (tab: TabId) => void;
}

export interface NavigationContextValue {
  state: NavigationState;
  navigateTo: (tab: TabId) => void;
  goBack: () => void;
  isActive: (tab: TabId) => boolean;
  canNavigate: (tab: TabId) => boolean;
  getNavItem: (tab: TabId) => NavItem | undefined;
  getSections: () => NavSection[];
}

export interface TabContentProps {
  tabId: TabId;
  isActive: boolean;
  onNavigate: (tab: TabId) => void;
  [key: string]: any;
}

export interface RouteNavItem extends NavItem {
  route: string;
  exact?: boolean;
  children?: RouteNavItem[];
}

export type NavigationMode = 'tabs' | 'routes' | 'mixed';

export interface UseNavigationReturn extends NavigationContextValue {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
