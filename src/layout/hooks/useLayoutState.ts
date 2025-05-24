import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabId } from '../types/NavigationTypes';
import { navigationItems } from '../constants/navigationItems';

/**
 * Interface for layout state management
 */
export interface LayoutState {
  activeTab: TabId;
  sidebarCollapsed: boolean;
}

/**
 * Interface for layout state actions
 */
export interface LayoutActions {
  setActiveTab: (tabId: TabId) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * Combined interface for layout state hook return value
 */
export interface UseLayoutStateReturn extends LayoutState, LayoutActions {}

/**
 * Configuration options for the layout state hook
 */
export interface UseLayoutStateOptions {
  /** Default tab to show when no route matches */
  defaultTab?: TabId;
  /** Whether to persist sidebar state in localStorage */
  persistSidebar?: boolean;
  /** Whether to sync active tab with React Router location */
  syncWithRouter?: boolean;
}

/**
 * Storage keys for persistence
 */
const STORAGE_KEYS = {
  sidebarCollapsed: 'layout_sidebar_collapsed',
} as const;

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS: Required<UseLayoutStateOptions> = {
  defaultTab: 'dashboard',
  persistSidebar: true,
  syncWithRouter: true,
};

/**
 * Maps route paths to TabId values for React Router integration
 */
const routeToTabMap: Record<string, TabId> = {
  '/game': 'dashboard',
  '/game/dashboard': 'dashboard',
  '/game/traits': 'traits',
  '/game/npcs': 'npcs',
  '/game/character': 'player',
  '/game/player': 'player',
  '/game/essence': 'essence',
  '/game/copies': 'copies',
  '/game/quests': 'quests',
  '/game/inventory': 'inventory',
  '/game/settings': 'settings',
  '/game/save-load': 'save-load',
  '/game/debug': 'debug',
};

/**
 * Maps TabId values to route paths for navigation
 */
const tabToRouteMap: Record<TabId, string> = {
  dashboard: '/game',
  traits: '/game/traits',
  npcs: '/game/npcs',
  player: '/game/character',
  essence: '/game/essence',
  copies: '/game/copies',
  quests: '/game/quests',
  inventory: '/game/inventory',
  settings: '/game/settings',
  'save-load': '/game/save-load',
  debug: '/game/debug',
};

/**
 * Validates if a given string is a valid TabId
 */
const isValidTabId = (tabId: string): tabId is TabId => {
  return navigationItems.some(item => item.id === tabId);
};

/**
 * Gets the initial sidebar collapsed state from localStorage or default
 */
const getInitialSidebarState = (persistSidebar: boolean): boolean => {
  if (!persistSidebar) return false;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed);
    return stored ? JSON.parse(stored) : false;
  } catch (error) {
    console.warn('Failed to load sidebar state from localStorage:', error);
    return false;
  }
};

/**
 * Gets the active tab from current route
 */
const getTabFromRoute = (pathname: string, defaultTab: TabId): TabId => {
  // Direct match first
  if (routeToTabMap[pathname]) {
    return routeToTabMap[pathname];
  }
  
  // Check for partial matches (e.g., /game/traits/slots -> traits)
  for (const [route, tabId] of Object.entries(routeToTabMap)) {
    if (pathname.startsWith(route) && route !== '/game') {
      return tabId;
    }
  }
  
  return defaultTab;
};

/**
 * Custom hook for managing layout state including active tab and sidebar collapse
 * 
 * @param options Configuration options for the hook
 * @returns Layout state and actions for managing the layout
 */
export const useLayoutState = (options: UseLayoutStateOptions = {}): UseLayoutStateReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => 
    getInitialSidebarState(config.persistSidebar)
  );

  const [activeTab, setActiveTabState] = useState<TabId>(() => {
    if (config.syncWithRouter) {
      return getTabFromRoute(location.pathname, config.defaultTab);
    }
    return config.defaultTab;
  });

  // Sync active tab with router location
  useEffect(() => {
    if (config.syncWithRouter) {
      const tabFromRoute = getTabFromRoute(location.pathname, config.defaultTab);
      if (tabFromRoute !== activeTab) {
        setActiveTabState(tabFromRoute);
      }
    }
  }, [location.pathname, config.syncWithRouter, config.defaultTab, activeTab]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (config.persistSidebar) {
      try {
        localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, JSON.stringify(sidebarCollapsed));
      } catch (error) {
        console.warn('Failed to persist sidebar state to localStorage:', error);
      }
    }
  }, [sidebarCollapsed, config.persistSidebar]);

  // Action to set active tab and optionally navigate
  const setActiveTab = useCallback((tabId: TabId) => {
    if (!isValidTabId(tabId)) {
      console.warn(`Invalid tab ID: ${tabId}`);
      return;
    }

    setActiveTabState(tabId);

    // Navigate to corresponding route if router sync is enabled
    if (config.syncWithRouter) {
      const targetRoute = tabToRouteMap[tabId];
      if (targetRoute && targetRoute !== location.pathname) {
        navigate(targetRoute);
      }
    }
  }, [config.syncWithRouter, location.pathname, navigate]);

  // Action to set sidebar collapsed state
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
  }, []);

  // Action to toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState(prev => !prev);
  }, []);

  return {
    // State
    activeTab,
    sidebarCollapsed,
    
    // Actions
    setActiveTab,
    setSidebarCollapsed,
    toggleSidebar,
  };
};

/**
 * Type guard to check if a value is a valid TabId
 */
export const isTabId = (value: unknown): value is TabId => {
  return typeof value === 'string' && isValidTabId(value);
};

/**
 * Utility function to get the route for a given tab
 */
export const getRouteForTab = (tabId: TabId): string => {
  return tabToRouteMap[tabId] || '/game';
};

/**
 * Utility function to get the tab for a given route
 */
export const getTabForRoute = (pathname: string, defaultTab: TabId = 'dashboard'): TabId => {
  return getTabFromRoute(pathname, defaultTab);
};