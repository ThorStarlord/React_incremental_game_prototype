import React, { createContext, useContext, ReactNode } from 'react';
import { useNestedTabs } from '../../hooks/useNestedTabs';
import { 
  createPrimaryNavigationTabs,
  createTraitSystemTabs,
  createEssenceSystemTabs,
  createNPCSystemTabs,
  createCopySystemTabs,
  createQuestSystemTabs,
  createSettingsTabs,
} from './TabUtils';
import { TabConfig } from './StandardTabs';

interface TabContextValue {
  // Current active tabs
  primaryTab: string;
  secondaryTab: string;
  
  // Tab configurations
  primaryTabs: TabConfig[];
  secondaryTabsMap: Record<string, TabConfig[]>;
  
  // Tab change methods
  setPrimaryTab: (tabId: string) => void;
  setSecondaryTab: (tabId: string) => void;
  setNestedTab: (primaryTab: string, secondaryTab: string) => void;
  
  // Current tab information
  getCurrentSecondaryTabs: () => TabConfig[];
  isPrimaryTabActive: (tabId: string) => boolean;
  isSecondaryTabActive: (tabId: string) => boolean;
  
  // Navigation methods
  goToNextPrimaryTab: () => void;
  goToPrevPrimaryTab: () => void;
  goToNextSecondaryTab: () => void;
  goToPrevSecondaryTab: () => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
  persistKey?: string;
  defaultPrimaryTab?: string;
  customPrimaryTabs?: TabConfig[];
  customSecondaryTabsMap?: Record<string, TabConfig[]>;
}

/**
 * Tab context provider for managing global application tab state
 * Provides centralized tab management across the entire application
 */
export const TabProvider: React.FC<TabProviderProps> = ({
  children,
  persistKey = 'app',
  defaultPrimaryTab = 'game',
  customPrimaryTabs,
  customSecondaryTabsMap,
}) => {
  // Default tab configurations
  const defaultPrimaryTabs = customPrimaryTabs || createPrimaryNavigationTabs();
  
  const defaultSecondaryTabsMap = customSecondaryTabsMap || {
    game: [
      { id: 'overview', label: 'Overview' },
      { id: 'world', label: 'World' },
      { id: 'combat', label: 'Combat' },
    ],
    traits: createTraitSystemTabs(),
    essence: createEssenceSystemTabs(),
    npcs: createNPCSystemTabs(),
    copies: createCopySystemTabs(),
    quests: createQuestSystemTabs(),
    settings: createSettingsTabs(),
  };

  const defaultSecondaryTabs = Object.keys(defaultSecondaryTabsMap).reduce(
    (acc, key) => {
      const tabs = defaultSecondaryTabsMap[key];
      acc[key] = tabs.find(tab => !tab.disabled)?.id || tabs[0]?.id || '';
      return acc;
    },
    {} as Record<string, string>
  );

  const nestedTabsHook = useNestedTabs({
    primaryTabs: defaultPrimaryTabs,
    secondaryTabsMap: defaultSecondaryTabsMap,
    defaultPrimaryTab,
    defaultSecondaryTabs,
    persistKey,
  });

  const contextValue: TabContextValue = {
    primaryTab: nestedTabsHook.primaryTab,
    secondaryTab: nestedTabsHook.secondaryTab,
    primaryTabs: defaultPrimaryTabs,
    secondaryTabsMap: defaultSecondaryTabsMap,
    setPrimaryTab: nestedTabsHook.setPrimaryTab,
    setSecondaryTab: nestedTabsHook.setSecondaryTab,
    setNestedTab: nestedTabsHook.setNestedTab,
    getCurrentSecondaryTabs: nestedTabsHook.getCurrentSecondaryTabs,
    isPrimaryTabActive: nestedTabsHook.isPrimaryTabActive,
    isSecondaryTabActive: nestedTabsHook.isSecondaryTabActive,
    goToNextPrimaryTab: nestedTabsHook.goToNextPrimaryTab,
    goToPrevPrimaryTab: nestedTabsHook.goToPrevPrimaryTab,
    goToNextSecondaryTab: nestedTabsHook.goToNextSecondaryTab,
    goToPrevSecondaryTab: nestedTabsHook.goToPrevSecondaryTab,
  };

  return (
    <TabContext.Provider value={contextValue}>
      {children}
    </TabContext.Provider>
  );
};

/**
 * Hook to access the tab context
 * Must be used within a TabProvider
 */
export const useTabContext = (): TabContextValue => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

/**
 * HOC to provide tab context to a component
 */
export const withTabContext = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { tabProviderProps?: Partial<TabProviderProps> }> => {
  return ({ tabProviderProps, ...props }) => (
    <TabProvider {...tabProviderProps}>
      <Component {...(props as P)} />
    </TabProvider>
  );
};
