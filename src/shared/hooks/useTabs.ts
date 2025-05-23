import { useState, useCallback, useMemo } from 'react';
import { TabConfig } from '../components/Tabs/StandardTabs';

interface UseTabsProps {
  defaultTab?: string;
  tabs: TabConfig[];
  persistKey?: string; // For localStorage persistence
}

interface UseTabsReturn {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isTabActive: (tabId: string) => boolean;
  getNextTab: () => string | null;
  getPrevTab: () => string | null;
  switchToNextTab: () => void;
  switchToPrevTab: () => void;
}

/**
 * Custom hook for managing tab state with MUI tabs
 * Provides convenient methods for tab navigation and state management
 */
export const useTabs = ({ 
  defaultTab, 
  tabs, 
  persistKey 
}: UseTabsProps): UseTabsReturn => {
  // Initialize with persisted value or default
  const getInitialTab = useCallback((): string => {
    if (persistKey) {
      const persisted = localStorage.getItem(`tabs_${persistKey}`);
      if (persisted && tabs.some(tab => tab.id === persisted)) {
        return persisted;
      }
    }
    return defaultTab || tabs[0]?.id || '';
  }, [defaultTab, tabs, persistKey]);

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  const setActiveTab = useCallback((tabId: string) => {
    const validTab = tabs.find(tab => tab.id === tabId && !tab.disabled);
    if (validTab) {
      setActiveTabState(tabId);
      if (persistKey) {
        localStorage.setItem(`tabs_${persistKey}`, tabId);
      }
    }
  }, [tabs, persistKey]);

  const isTabActive = useCallback((tabId: string): boolean => {
    return activeTab === tabId;
  }, [activeTab]);

  const enabledTabs = useMemo(() => 
    tabs.filter(tab => !tab.disabled), 
    [tabs]
  );

  const getNextTab = useCallback((): string | null => {
    const currentIndex = enabledTabs.findIndex(tab => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % enabledTabs.length;
    return enabledTabs[nextIndex]?.id || null;
  }, [enabledTabs, activeTab]);

  const getPrevTab = useCallback((): string | null => {
    const currentIndex = enabledTabs.findIndex(tab => tab.id === activeTab);
    const prevIndex = currentIndex === 0 ? enabledTabs.length - 1 : currentIndex - 1;
    return enabledTabs[prevIndex]?.id || null;
  }, [enabledTabs, activeTab]);

  const switchToNextTab = useCallback(() => {
    const nextTab = getNextTab();
    if (nextTab) {
      setActiveTab(nextTab);
    }
  }, [getNextTab, setActiveTab]);

  const switchToPrevTab = useCallback(() => {
    const prevTab = getPrevTab();
    if (prevTab) {
      setActiveTab(prevTab);
    }
  }, [getPrevTab, setActiveTab]);

  return {
    activeTab,
    setActiveTab,
    isTabActive,
    getNextTab,
    getPrevTab,
    switchToNextTab,
    switchToPrevTab,
  };
};
