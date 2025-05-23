import { useState, useCallback, useMemo, useEffect } from 'react';
import { TabConfig } from '../components/Tabs/StandardTabs';

interface UseAdvancedTabsProps {
  tabs: TabConfig[];
  defaultTab?: string;
  persistKey?: string;
  onTabChange?: (tabId: string, previousTab: string) => void;
  validateTabChange?: (newTab: string, currentTab: string) => boolean;
}

interface TabHistory {
  tabId: string;
  timestamp: number;
}

interface UseAdvancedTabsReturn {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isTabActive: (tabId: string) => boolean;
  isTabDisabled: (tabId: string) => boolean;
  getActiveTabConfig: () => TabConfig | undefined;
  getTabIndex: (tabId: string) => number;
  
  // Navigation methods
  goToNextTab: () => void;
  goToPrevTab: () => void;
  goToFirstTab: () => void;
  goToLastTab: () => void;
  
  // History methods
  goBack: () => void;
  canGoBack: boolean;
  getTabHistory: () => TabHistory[];
  clearHistory: () => void;
  
  // Utility methods
  getEnabledTabs: () => TabConfig[];
  getDisabledTabs: () => TabConfig[];
  findTabById: (tabId: string) => TabConfig | undefined;
  
  // Keyboard navigation
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * Advanced tab hook with history, validation, and enhanced navigation
 * Provides comprehensive tab state management for complex interfaces
 */
export const useAdvancedTabs = ({
  tabs,
  defaultTab,
  persistKey,
  onTabChange,
  validateTabChange,
}: UseAdvancedTabsProps): UseAdvancedTabsReturn => {
  
  // Initialize with persisted value or default
  const getInitialTab = useCallback((): string => {
    if (persistKey) {
      const persisted = localStorage.getItem(`tabs_${persistKey}`);
      if (persisted && tabs.some(tab => tab.id === persisted && !tab.disabled)) {
        return persisted;
      }
    }
    
    const defaultTabToUse = defaultTab || tabs.find(tab => !tab.disabled)?.id || '';
    return defaultTabToUse;
  }, [defaultTab, tabs, persistKey]);

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [tabHistory, setTabHistory] = useState<TabHistory[]>([]);

  // Update active tab with validation and history tracking
  const setActiveTab = useCallback((tabId: string) => {
    const targetTab = tabs.find(tab => tab.id === tabId);
    
    // Validate tab exists and is not disabled
    if (!targetTab || targetTab.disabled) {
      return;
    }
    
    // Custom validation
    if (validateTabChange && !validateTabChange(tabId, activeTab)) {
      return;
    }
    
    const previousTab = activeTab;
    
    // Update history
    setTabHistory(prev => {
      const newHistory = prev.filter(item => item.tabId !== activeTab);
      if (activeTab) {
        newHistory.push({ tabId: activeTab, timestamp: Date.now() });
      }
      // Keep only last 10 items
      return newHistory.slice(-10);
    });
    
    setActiveTabState(tabId);
    
    // Persist to localStorage
    if (persistKey) {
      localStorage.setItem(`tabs_${persistKey}`, tabId);
    }
    
    // Call change callback
    onTabChange?.(tabId, previousTab);
  }, [tabs, activeTab, validateTabChange, persistKey, onTabChange]);

  // Initialize active tab on mount
  useEffect(() => {
    if (!activeTab || !tabs.some(tab => tab.id === activeTab && !tab.disabled)) {
      const initialTab = getInitialTab();
      if (initialTab && initialTab !== activeTab) {
        setActiveTabState(initialTab);
      }
    }
  }, [tabs, activeTab, getInitialTab]);

  // Utility methods
  const isTabActive = useCallback((tabId: string) => activeTab === tabId, [activeTab]);
  
  const isTabDisabled = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab?.disabled ?? false;
  }, [tabs]);
  
  const getActiveTabConfig = useCallback(() => {
    return tabs.find(tab => tab.id === activeTab);
  }, [tabs, activeTab]);
  
  const getTabIndex = useCallback((tabId: string) => {
    return tabs.findIndex(tab => tab.id === tabId);
  }, [tabs]);
  
  const getEnabledTabs = useCallback(() => {
    return tabs.filter(tab => !tab.disabled);
  }, [tabs]);
  
  const getDisabledTabs = useCallback(() => {
    return tabs.filter(tab => tab.disabled);
  }, [tabs]);
  
  const findTabById = useCallback((tabId: string) => {
    return tabs.find(tab => tab.id === tabId);
  }, [tabs]);

  // Navigation methods
  const enabledTabs = useMemo(() => getEnabledTabs(), [getEnabledTabs]);
  const currentEnabledIndex = useMemo(() => {
    return enabledTabs.findIndex(tab => tab.id === activeTab);
  }, [enabledTabs, activeTab]);

  const goToNextTab = useCallback(() => {
    if (currentEnabledIndex < enabledTabs.length - 1) {
      setActiveTab(enabledTabs[currentEnabledIndex + 1].id);
    }
  }, [currentEnabledIndex, enabledTabs, setActiveTab]);

  const goToPrevTab = useCallback(() => {
    if (currentEnabledIndex > 0) {
      setActiveTab(enabledTabs[currentEnabledIndex - 1].id);
    }
  }, [currentEnabledIndex, enabledTabs, setActiveTab]);

  const goToFirstTab = useCallback(() => {
    if (enabledTabs.length > 0) {
      setActiveTab(enabledTabs[0].id);
    }
  }, [enabledTabs, setActiveTab]);

  const goToLastTab = useCallback(() => {
    if (enabledTabs.length > 0) {
      setActiveTab(enabledTabs[enabledTabs.length - 1].id);
    }
  }, [enabledTabs, setActiveTab]);

  // History methods
  const canGoBack = useMemo(() => tabHistory.length > 0, [tabHistory]);
  
  const goBack = useCallback(() => {
    if (tabHistory.length > 0) {
      const lastTab = tabHistory[tabHistory.length - 1];
      const targetTab = tabs.find(tab => tab.id === lastTab.tabId && !tab.disabled);
      
      if (targetTab) {
        setTabHistory(prev => prev.slice(0, -1));
        setActiveTabState(targetTab.id);
        
        if (persistKey) {
          localStorage.setItem(`tabs_${persistKey}`, targetTab.id);
        }
      }
    }
  }, [tabHistory, tabs, persistKey]);

  const getTabHistory = useCallback(() => [...tabHistory], [tabHistory]);
  
  const clearHistory = useCallback(() => {
    setTabHistory([]);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevTab();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextTab();
          break;
        case 'Home':
          event.preventDefault();
          goToFirstTab();
          break;
        case 'End':
          event.preventDefault();
          goToLastTab();
          break;
        case 'z':
          if (canGoBack) {
            event.preventDefault();
            goBack();
          }
          break;
      }
    }
  }, [goToPrevTab, goToNextTab, goToFirstTab, goToLastTab, canGoBack, goBack]);

  return {
    activeTab,
    setActiveTab,
    isTabActive,
    isTabDisabled,
    getActiveTabConfig,
    getTabIndex,
    goToNextTab,
    goToPrevTab,
    goToFirstTab,
    goToLastTab,
    goBack,
    canGoBack,
    getTabHistory,
    clearHistory,
    getEnabledTabs,
    getDisabledTabs,
    findTabById,
    handleKeyDown,
  };
};
