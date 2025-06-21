import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabId } from '../types/NavigationTypes';
import { getNavigationItem } from '../constants/navigationConfig';

// ... (interfaces remain the same) ...
export interface LayoutState {
  activeTab: TabId;
  sidebarCollapsed: boolean;
}
export interface LayoutActions {
  setActiveTab: (tabId: TabId) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}
export interface UseLayoutStateReturn extends LayoutState, LayoutActions {}
export interface UseLayoutStateOptions {
  defaultTab?: TabId;
  persistSidebar?: boolean;
  syncWithRouter?: boolean;
}


const STORAGE_KEYS = {
  sidebarCollapsed: 'layout_sidebar_collapsed',
} as const;

const DEFAULT_OPTIONS: Required<UseLayoutStateOptions> = {
  defaultTab: 'dashboard',
  persistSidebar: true,
  syncWithRouter: true,
};

const tabToRouteMap: Record<TabId, string> = {
  dashboard: '/game/dashboard',
  character: '/game/character',
  traits: '/game/traits',
  skills: '/game/skills',
  npcs: '/game/npcs',
  essence: '/game/essence',
  copies: '/game/copies',
  quests: '/game/quests',
  inventory: '/game/inventory',
  settings: '/game/settings',
  saves: '/game/saves',
  crafting: '/game/crafting',
  'save-load': '/game/save-load',
  debug: '/game/debug',
};

/**
 * Type guard to check if a given string is a valid TabId
 */
export const isTabId = (value: any): value is TabId => { // Added export
  try {
    return !!getNavigationItem(value);
  } catch (e) {
    return false;
  }
};

/**
 * Gets the active tab from the current URL path.
 */
const getTabFromRoute = (pathname: string, defaultTab: TabId): TabId => {
    const segments = pathname.split('/');
    const potentialTabId = segments[2]; 
    
    if (potentialTabId && isTabId(potentialTabId)) {
        return potentialTabId;
    }
    
    return defaultTab;
};


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
 * Custom hook for managing layout state including active tab and sidebar collapse
 */
export const useLayoutState = (options: UseLayoutStateOptions = {}): UseLayoutStateReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => 
    getInitialSidebarState(config.persistSidebar)
  );

  const [activeTab, setActiveTabState] = useState<TabId>(() => {
    if (config.syncWithRouter) {
      return getTabFromRoute(location.pathname, config.defaultTab);
    }
    return config.defaultTab;
  });

  useEffect(() => {
    if (config.syncWithRouter) {
      const tabFromRoute = getTabFromRoute(location.pathname, config.defaultTab);
      if (tabFromRoute !== activeTab) {
        setActiveTabState(tabFromRoute);
      }
    }
  }, [location.pathname, config.syncWithRouter, config.defaultTab, activeTab]);

  useEffect(() => {
    if (config.persistSidebar) {
      try {
        localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, JSON.stringify(sidebarCollapsed));
      } catch (error) {
        console.warn('Failed to persist sidebar state to localStorage:', error);
      }
    }
  }, [sidebarCollapsed, config.persistSidebar]);

  const setActiveTab = useCallback((tabId: TabId) => {
    if (!isTabId(tabId)) {
      console.warn(`Invalid tab ID: ${tabId}`);
      return;
    }

    setActiveTabState(tabId);

    if (config.syncWithRouter) {
      const targetRoute = tabToRouteMap[tabId];
      if (targetRoute && location.pathname.split('/')[2] !== tabId) {
        navigate(targetRoute);
      }
    }
  }, [config.syncWithRouter, location.pathname, navigate]);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState(prev => !prev);
  }, []);

  return {
    activeTab,
    sidebarCollapsed,
    setActiveTab,
    setSidebarCollapsed,
    toggleSidebar,
  };
};

export const getRouteForTab = (tabId: TabId): string => {
  return tabToRouteMap[tabId] || '/game/dashboard';
};