/**
 * Core navigation type definitions for the tabbed layout system
 * Supports both current routing and future tabbed navigation patterns
 */

/** 
 * Unique identifier for navigation tabs
 * Using string literal types for type safety and autocomplete
 */
export type TabId = 
  | 'character'    // Character management (stats, attributes, equipment)
  | 'traits'       // Trait system (slots, management, codex)
  | 'npcs'         // NPC interactions and relationships
  | 'quests'       // Quest log and management
  | 'copies'       // Copy management (future implementation)
  | 'inventory'    // Item and equipment management (future)
  | 'crafting'     // Crafting system (future)
  | 'settings'     // Game settings and configuration
  | 'save-load';   // Save/load functionality

/**
 * Navigation item configuration
 * Defines the structure for each navigable section
 */
export interface NavItem {
  /** Unique identifier for the navigation item */
  id: TabId;
  
  /** Display label for the navigation item */
  label: string;
  
  /** Material-UI icon component for visual representation */
  icon: React.ComponentType<any>;
  
  /** Optional route path for React Router integration */
  route?: string;
  
  /** Whether this item is currently implemented */
  isImplemented: boolean;
  
  /** Optional tooltip text for additional context */
  tooltip?: string;
  
  /** Whether this item requires special permissions or conditions */
  requiresCondition?: () => boolean;
  
  /** Badge content for notifications or status indicators */
  badge?: BadgeConfig;
  
  /** Optional section identifier for grouping navigation items */
  section?: string;
}

/**
 * Badge configuration
 * Defines the structure for badge notifications on navigation items
 */
export interface BadgeConfig {
  /** Badge content, can be a number or string */
  count?: number | string;
  
  /** Badge color scheme */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  
  /** Badge variant style */
  variant?: 'standard' | 'dot';
  
  /** Whether the badge is invisible */
  invisible?: boolean;
}

/**
 * Navigation section grouping
 * Organizes navigation items into logical sections
 */
export interface NavSection {
  /** Section identifier */
  id: string;
  
  /** Section display title */
  title: string;
  
  /** Navigation items in this section */
  items: NavItem[];
  
  /** Whether this section can be collapsed */
  collapsible?: boolean;
  
  /** Default collapsed state */
  defaultCollapsed?: boolean;
}

/**
 * Navigation state management
 * Tracks current active tab and navigation history
 */
export interface NavigationState {
  /** Currently active tab */
  activeTab: TabId;
  
  /** Previous tab for back navigation */
  previousTab?: TabId;
  
  /** Navigation history stack */
  history: TabId[];
  
  /** Whether navigation is in transition */
  isTransitioning: boolean;
}

/**
 * Navigation configuration
 * Global navigation settings and behavior
 */
export interface NavigationConfig {
  /** Default tab to show on app start */
  defaultTab: TabId;
  
  /** Maximum history items to track */
  maxHistoryLength: number;
  
  /** Whether to persist navigation state */
  persistState: boolean;
  
  /** Local storage key for navigation state */
  storageKey: string;
  
  /** Whether to show transition animations */
  enableTransitions: boolean;
  
  /** Transition duration in milliseconds */
  transitionDuration: number;
}

/**
 * Navigation event types for custom hooks and event handling
 */
export interface NavigationEvents {
  /** Fired when navigation changes */
  onNavigate: (from: TabId, to: TabId) => void;
  
  /** Fired before navigation (can be prevented) */
  onBeforeNavigate: (from: TabId, to: TabId) => boolean | Promise<boolean>;
  
  /** Fired after navigation completes */
  onAfterNavigate: (tab: TabId) => void;
}

/**
 * Navigation context value
 * Provided by NavigationProvider for component consumption
 */
export interface NavigationContextValue {
  /** Current navigation state */
  state: NavigationState;
  
  /** Navigate to a specific tab */
  navigateTo: (tab: TabId) => void;
  
  /** Navigate back to previous tab */
  goBack: () => void;
  
  /** Check if a tab is currently active */
  isActive: (tab: TabId) => boolean;
  
  /** Check if navigation to a tab is possible */
  canNavigate: (tab: TabId) => boolean;
  
  /** Get navigation item configuration */
  getNavItem: (tab: TabId) => NavItem | undefined;
  
  /** Get all navigation sections */
  getSections: () => NavSection[];
}

/**
 * Tab content props
 * Standard props passed to tab content components
 */
export interface TabContentProps {
  /** The tab identifier */
  tabId: TabId;
  
  /** Whether this tab is currently active */
  isActive: boolean;
  
  /** Function to navigate to another tab */
  onNavigate: (tab: TabId) => void;
  
  /** Additional props passed from parent */
  [key: string]: any;
}

/**
 * Route integration types
 * For bridging navigation system with React Router
 */
export interface RouteNavItem extends NavItem {
  /** React Router route path (required for route integration) */
  route: string;
  
  /** Whether this route should exact match */
  exact?: boolean;
  
  /** Child routes for nested navigation */
  children?: RouteNavItem[];
}

export type NavigationMode = 'tabs' | 'routes' | 'mixed';

/**
 * Navigation hook return type
 * For useNavigation custom hook
 */
export interface UseNavigationReturn extends NavigationContextValue {
  /** Loading state for async navigation */
  isLoading: boolean;
  
  /** Error state for navigation failures */
  error: string | null;
  
  /** Clear any navigation errors */
  clearError: () => void;
}
