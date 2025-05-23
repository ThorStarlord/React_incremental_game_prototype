import { useState, useCallback, useMemo } from 'react';
import { TabConfig } from '../components/Tabs/StandardTabs';

interface NestedTabConfig {
  primaryTabs: TabConfig[];
  secondaryTabsMap: Record<string, TabConfig[]>;
  defaultPrimaryTab?: string;
  defaultSecondaryTabs?: Record<string, string>;
  persistKey?: string;
}

interface NestedTabState {
  primaryTab: string;
  secondaryTab: string;
}

interface UseNestedTabsReturn {
  // Current state
  primaryTab: string;
  secondaryTab: string;
  
  // Tab change methods
  setPrimaryTab: (tabId: string) => void;
  setSecondaryTab: (tabId: string) => void;
  setNestedTab: (primaryTab: string, secondaryTab: string) => void;
  
  // Current tab configs
  getPrimaryTabConfig: () => TabConfig | undefined;
  getSecondaryTabConfig: () => TabConfig | undefined;
  getCurrentSecondaryTabs: () => TabConfig[];
  
  // Validation methods
  isPrimaryTabActive: (tabId: string) => boolean;
  isSecondaryTabActive: (tabId: string) => boolean;
  isValidSecondaryTab: (primaryTab: string, secondaryTab: string) => boolean;
  
  // Navigation methods
  goToNextPrimaryTab: () => void;
  goToPrevPrimaryTab: () => void;
  goToNextSecondaryTab: () => void;
  goToPrevSecondaryTab: () => void;
  
  // State persistence
  getTabState: () => NestedTabState;
  loadTabState: (state: NestedTabState) => void;
}

/**
 * Hook for managing nested tab navigation (primary + secondary tabs)
 * Useful for complex interfaces with main navigation and feature-specific sub-navigation
 */
export const useNestedTabs = ({
  primaryTabs,
  secondaryTabsMap,
  defaultPrimaryTab,
  defaultSecondaryTabs = {},
  persistKey,
}: NestedTabConfig): UseNestedTabsReturn => {
  
  // Initialize primary tab
  const getInitialPrimaryTab = useCallback((): string => {
    if (persistKey) {
      const persisted = localStorage.getItem(`nested_tabs_${persistKey}_primary`);
      if (persisted && primaryTabs.some(tab => tab.id === persisted && !tab.disabled)) {
        return persisted;
      }
    }
    return defaultPrimaryTab || primaryTabs.find(tab => !tab.disabled)?.id || '';
  }, [defaultPrimaryTab, primaryTabs, persistKey]);

  // Initialize secondary tab for given primary tab
  const getInitialSecondaryTab = useCallback((primaryTabId: string): string => {
    const secondaryTabs = secondaryTabsMap[primaryTabId] || [];
    
    if (persistKey) {
      const persisted = localStorage.getItem(`nested_tabs_${persistKey}_secondary_${primaryTabId}`);
      if (persisted && secondaryTabs.some(tab => tab.id === persisted && !tab.disabled)) {
        return persisted;
      }
    }
    
    return defaultSecondaryTabs[primaryTabId] || secondaryTabs.find(tab => !tab.disabled)?.id || '';
  }, [secondaryTabsMap, defaultSecondaryTabs, persistKey]);

  const [primaryTab, setPrimaryTabState] = useState<string>(getInitialPrimaryTab);
  const [secondaryTabMap, setSecondaryTabMap] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    primaryTabs.forEach(tab => {
      if (!tab.disabled) {
        initialMap[tab.id] = getInitialSecondaryTab(tab.id);
      }
    });
    return initialMap;
  });

  const secondaryTab = useMemo(() => {
    return secondaryTabMap[primaryTab] || '';
  }, [secondaryTabMap, primaryTab]);

  // Primary tab change
  const setPrimaryTab = useCallback((tabId: string) => {
    const targetTab = primaryTabs.find(tab => tab.id === tabId);
    if (!targetTab || targetTab.disabled) {
      return;
    }

    setPrimaryTabState(tabId);
    
    // Ensure secondary tab is set for this primary tab
    if (!secondaryTabMap[tabId]) {
      const initialSecondary = getInitialSecondaryTab(tabId);
      if (initialSecondary) {
        setSecondaryTabMap(prev => ({
          ...prev,
          [tabId]: initialSecondary,
        }));
      }
    }

    // Persist primary tab
    if (persistKey) {
      localStorage.setItem(`nested_tabs_${persistKey}_primary`, tabId);
    }
  }, [primaryTabs, secondaryTabMap, getInitialSecondaryTab, persistKey]);

  // Secondary tab change
  const setSecondaryTab = useCallback((tabId: string) => {
    const secondaryTabs = secondaryTabsMap[primaryTab] || [];
    const targetTab = secondaryTabs.find(tab => tab.id === tabId);
    
    if (!targetTab || targetTab.disabled) {
      return;
    }

    setSecondaryTabMap(prev => ({
      ...prev,
      [primaryTab]: tabId,
    }));

    // Persist secondary tab for current primary tab
    if (persistKey) {
      localStorage.setItem(`nested_tabs_${persistKey}_secondary_${primaryTab}`, tabId);
    }
  }, [primaryTab, secondaryTabsMap, persistKey]);

  // Set both tabs at once
  const setNestedTab = useCallback((newPrimaryTab: string, newSecondaryTab: string) => {
    if (isValidSecondaryTab(newPrimaryTab, newSecondaryTab)) {
      setPrimaryTabState(newPrimaryTab);
      setSecondaryTabMap(prev => ({
        ...prev,
        [newPrimaryTab]: newSecondaryTab,
      }));

      if (persistKey) {
        localStorage.setItem(`nested_tabs_${persistKey}_primary`, newPrimaryTab);
        localStorage.setItem(`nested_tabs_${persistKey}_secondary_${newPrimaryTab}`, newSecondaryTab);
      }
    }
  }, [persistKey]);

  // Get current tab configs
  const getPrimaryTabConfig = useCallback(() => {
    return primaryTabs.find(tab => tab.id === primaryTab);
  }, [primaryTabs, primaryTab]);

  const getSecondaryTabConfig = useCallback(() => {
    const secondaryTabs = secondaryTabsMap[primaryTab] || [];
    return secondaryTabs.find(tab => tab.id === secondaryTab);
  }, [secondaryTabsMap, primaryTab, secondaryTab]);

  const getCurrentSecondaryTabs = useCallback(() => {
    return secondaryTabsMap[primaryTab] || [];
  }, [secondaryTabsMap, primaryTab]);

  // Validation methods
  const isPrimaryTabActive = useCallback((tabId: string) => primaryTab === tabId, [primaryTab]);
  
  const isSecondaryTabActive = useCallback((tabId: string) => secondaryTab === tabId, [secondaryTab]);
  
  const isValidSecondaryTab = useCallback((primaryTabId: string, secondaryTabId: string) => {
    const secondaryTabs = secondaryTabsMap[primaryTabId] || [];
    return secondaryTabs.some(tab => tab.id === secondaryTabId && !tab.disabled);
  }, [secondaryTabsMap]);

  // Navigation methods
  const enabledPrimaryTabs = useMemo(() => {
    return primaryTabs.filter(tab => !tab.disabled);
  }, [primaryTabs]);

  const enabledSecondaryTabs = useMemo(() => {
    return (secondaryTabsMap[primaryTab] || []).filter(tab => !tab.disabled);
  }, [secondaryTabsMap, primaryTab]);

  const goToNextPrimaryTab = useCallback(() => {
    const currentIndex = enabledPrimaryTabs.findIndex(tab => tab.id === primaryTab);
    if (currentIndex >= 0 && currentIndex < enabledPrimaryTabs.length - 1) {
      setPrimaryTab(enabledPrimaryTabs[currentIndex + 1].id);
    }
  }, [enabledPrimaryTabs, primaryTab, setPrimaryTab]);

  const goToPrevPrimaryTab = useCallback(() => {
    const currentIndex = enabledPrimaryTabs.findIndex(tab => tab.id === primaryTab);
    if (currentIndex > 0) {
      setPrimaryTab(enabledPrimaryTabs[currentIndex - 1].id);
    }
  }, [enabledPrimaryTabs, primaryTab, setPrimaryTab]);

  const goToNextSecondaryTab = useCallback(() => {
    const currentIndex = enabledSecondaryTabs.findIndex(tab => tab.id === secondaryTab);
    if (currentIndex >= 0 && currentIndex < enabledSecondaryTabs.length - 1) {
      setSecondaryTab(enabledSecondaryTabs[currentIndex + 1].id);
    }
  }, [enabledSecondaryTabs, secondaryTab, setSecondaryTab]);

  const goToPrevSecondaryTab = useCallback(() => {
    const currentIndex = enabledSecondaryTabs.findIndex(tab => tab.id === secondaryTab);
    if (currentIndex > 0) {
      setSecondaryTab(enabledSecondaryTabs[currentIndex - 1].id);
    }
  }, [enabledSecondaryTabs, secondaryTab, setSecondaryTab]);

  // State management
  const getTabState = useCallback((): NestedTabState => ({
    primaryTab,
    secondaryTab,
  }), [primaryTab, secondaryTab]);

  const loadTabState = useCallback((state: NestedTabState) => {
    if (isValidSecondaryTab(state.primaryTab, state.secondaryTab)) {
      setNestedTab(state.primaryTab, state.secondaryTab);
    }
  }, [setNestedTab, isValidSecondaryTab]);

  return {
    primaryTab,
    secondaryTab,
    setPrimaryTab,
    setSecondaryTab,
    setNestedTab,
    getPrimaryTabConfig,
    getSecondaryTabConfig,
    getCurrentSecondaryTabs,
    isPrimaryTabActive,
    isSecondaryTabActive,
    isValidSecondaryTab,
    goToNextPrimaryTab,
    goToPrevPrimaryTab,
    goToNextSecondaryTab,
    goToPrevSecondaryTab,
    getTabState,
    loadTabState,
  };
};
