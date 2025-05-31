import React, { useState, useCallback } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { TabContainer, StandardTabs, TabPanel } from '../../../../shared/components/Tabs';
import { TraitSlots } from './TraitSlots';
import { TraitManagement } from './TraitManagement';
import { TraitCodex } from './TraitCodex';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

/**
 * Props for the TraitSystemUI component
 */
export interface TraitSystemUIProps {
  // Data
  allTraits: Record<string, Trait>;
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  permanentTraits: Trait[];
  acquiredTraits: Trait[];
  discoveredTraits: Trait[];
  availableTraitsForEquip: Trait[];
  currentEssence: number;
  playerMaxTraitSlots?: number; // Added playerMaxTraitSlots
  isInProximityToNPC: boolean; // Added for proximity-based trait management
  
  // Status
  loading: boolean;
  error: string | null;
  equippedTraitIds: string[];
  permanentTraitIds: string[];
  discoveredTraitIds: string[];
  acquiredTraitIds: string[];
  
  // Actions
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotIndex: number) => void; // Changed from slotId: string
  onAcquireTrait: (traitId: string) => void;
  onMakeTraitPermanent: (traitId: string) => void;
  onDiscoverTrait: (traitId: string) => void;
  
  // Utilities
  canMakePermanent: (trait: Trait) => boolean;
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait, action: 'acquire' | 'permanent') => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
  };
  
  // Configuration
  className?: string;
  defaultTab?: string;
}

/**
 * Presentational component for the trait management system
 * Provides tabbed interface for trait slots, management, and codex
 */
export const TraitSystemUI: React.FC<TraitSystemUIProps> = React.memo(({
  // Data
  allTraits,
  traitSlots,
  equippedTraits,
  permanentTraits,
  acquiredTraits,
  discoveredTraits,
  availableTraitsForEquip,
  currentEssence,
  isInProximityToNPC, // Destructure new prop
  
  // Status
  loading,
  error,
  equippedTraitIds,
  permanentTraitIds,
  discoveredTraitIds,
  acquiredTraitIds,
  
  // Actions
  onEquipTrait,
  onUnequipTrait,
  onAcquireTrait,
  onMakeTraitPermanent,
  onDiscoverTrait,
  
  // Utilities
  canMakePermanent,
  canAcquireTrait,
  getTraitAffordability,
  
  // Configuration
  className,
  defaultTab = 'slots'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  // Error state
  if (error) {
    return (
      <Box className={className}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading traits: {error}
        </Alert>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box 
        className={className}
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  const tabs = [
    {
      id: 'slots',
      label: 'Equipped Traits',
      disabled: false
    },
    {
      id: 'manage',
      label: 'Manage Traits',
      disabled: false
    },
    {
      id: 'codex',
      label: 'Trait Codex',
      disabled: false
    }
  ];

  return (
    <Box className={className}>
      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        // variant="standard" is default in TabContainer
      >
        {/* StandardTabs is rendered by TabContainer itself. Children should be TabPanels. */}
        <TabPanel tabId="slots" activeTab={activeTab}>
          <TraitSlots
            traitSlots={traitSlots}
            equippedTraits={equippedTraits}
            availableTraits={availableTraitsForEquip}
            onEquipTrait={onEquipTrait}
            onUnequipTrait={onUnequipTrait}
            isInProximityToNPC={isInProximityToNPC} // Pass new prop
          />
        </TabPanel>
        
        <TabPanel tabId="manage" activeTab={activeTab}>
          <TraitManagement
            acquiredTraits={acquiredTraits}
            permanentTraits={permanentTraits}
            currentEssence={currentEssence}
            equippedTraitIds={equippedTraitIds}
            permanentTraitIds={permanentTraitIds}
            onAcquireTrait={onAcquireTrait}
            onMakeTraitPermanent={onMakeTraitPermanent}
            canMakePermanent={canMakePermanent}
            getTraitAffordability={getTraitAffordability}
            isInProximityToNPC={isInProximityToNPC} // Pass new prop
          />
        </TabPanel>
        
        <TabPanel tabId="codex" activeTab={activeTab}>
          <TraitCodex
            allTraits={allTraits}
            discoveredTraits={discoveredTraits}
            acquiredTraitIds={acquiredTraitIds}
            permanentTraitIds={permanentTraitIds}
            currentEssence={currentEssence}
            onDiscoverTrait={onDiscoverTrait}
            onAcquireTrait={onAcquireTrait}
            onMakeTraitPermanent={onMakeTraitPermanent} // Pass down
            canMakePermanent={canMakePermanent} // Pass down
            canAcquireTrait={canAcquireTrait}
            getTraitAffordability={getTraitAffordability}
          />
        </TabPanel>
      </TabContainer>
    </Box>
  );
});

TraitSystemUI.displayName = 'TraitSystemUI';

export default TraitSystemUI;
