/**
 * Module declarations for JavaScript imports without TypeScript declarations
 */

// Declare JavaScript module imports
declare module '*.js';

// Declare CSS module imports
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Game feature module declarations - without file extensions to match imports
declare module '../../features/Inventory/components/containers/InventoryList' {
  import React from 'react';
  const InventoryList: React.FC<any>;
  export default InventoryList;
}

declare module '../../features/Essence/components/ui/EssenceDisplay' {
  import React from 'react';
  const EssenceDisplay: React.FC<any>;
  export default EssenceDisplay;
}

declare module '../../features/Traits/components/containers/TraitSystemWrapper' {
  import React from 'react';
  const TraitSystemWrapper: React.FC<any>;
  export default TraitSystemWrapper;
}

declare module '../../features/NPCs/components/RelationshipNotification' {
  import React from 'react';
  const RelationshipNotification: React.FC<any>;
  export default RelationshipNotification;
}

declare module '../../features/Traits/components/containers/TraitEffectNotification' {
  import React from 'react';
  const TraitEffectNotification: React.FC<any>;
  export default TraitEffectNotification;
}

declare module '../../features/Traits/components/containers/CompactTraitPanel' {
  import React from 'react';
  const CompactTraitPanel: React.FC<{onExpandView?: () => void}>;
  export default CompactTraitPanel;
}

declare module '../../features/Minions/components/ui/CompactCharacterPanel' {
  import React from 'react';
  const CompactCharacterPanel: React.FC<{onExpandView?: () => void}>;
  export default CompactCharacterPanel;
}

// Shared component declarations
declare module '../../shared/components/layout/Panel' {
  import React from 'react';
  interface PanelProps {
    title?: React.ReactNode;
    children?: React.ReactNode;
    action?: React.ReactNode;
    defaultExpanded?: boolean;
    icon?: React.ReactNode;
    sx?: any;
  }
  const Panel: React.FC<PanelProps>;
  export default Panel;
}

declare module '../../shared/components/ui/BreadcrumbNav' {
  import React from 'react';
  interface BreadcrumbNavProps {
    testMode?: boolean;
  }
  const BreadcrumbNav: React.FC<BreadcrumbNavProps>;
  export default BreadcrumbNav;
}

declare module '../../shared/components/ui/CharacterTabBar' {
  import React from 'react';
  interface CharacterTabBarProps {
    defaultTab?: string;
    onTabChange?: (tab: string) => void;
    notifications?: Record<string, number>;
    disabledTabs?: string[];
    showLabels?: boolean;
    showLoadingIndicators?: boolean;
    testMode?: boolean;
    customTabs?: any[];
  }
  const CharacterTabBar: React.FC<CharacterTabBarProps>;
  export default CharacterTabBar;
}

declare module '../../shared/components/ui/CharacterManagementDrawer' {
  import React from 'react';
  interface CharacterManagementDrawerProps {
    open?: boolean;
    onClose?: () => void;
    initialTab?: string;
  }
  const CharacterManagementDrawer: React.FC<CharacterManagementDrawerProps>;
  export default CharacterManagementDrawer;
}

// Hook declarations
declare module '../../shared/hooks/useEssenceGeneration' {
  interface EssenceGenerationData {
    baseRate: number;
    totalRate: number;
    npcContributions: any[];
    modifiers: Record<string, number>;
  }
  
  function useEssenceGeneration(): EssenceGenerationData;
  export default useEssenceGeneration;
}

declare module '../../shared/hooks/useTraitNotifications' {
  function useTraitNotifications(): void;
  export default useTraitNotifications;
}

declare module '../../shared/hooks/useMinionSimulation' {
  interface MinionSimulationResult {
    results: any[];
    isRunning: boolean;
    startSimulation: () => void;
    stopSimulation: () => void;
    forceSimulation: () => any[];
  }
  
  function useMinionSimulation(settings?: {interval?: number}): MinionSimulationResult;
  export default useMinionSimulation;
}

// GameState context extension
declare module '../../context/GameStateContext' {
  import { GameState } from '../../context/initialState';
  
  interface GameStateContextType extends GameState {
    world: {
      regions?: Record<string, any>;
      currentArea?: {
        id: string;
        name: string;
        description: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    npcs?: Array<{
      id: string;
      name: string;
      relationship: number;
      [key: string]: any;
    }>;
    [key: string]: any;
  }
  
  const GameStateContext: React.Context<GameStateContextType>;
  export default GameStateContext;
  
  // Helper hook
  export function useGameState(): GameStateContextType;
}
