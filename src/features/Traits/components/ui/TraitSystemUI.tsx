import React, { useState, useCallback } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { TabContainer, /* StandardTabs, */ TabPanel } from '../../../../shared/components/Tabs'; // StandardTabs is part of TabContainer
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
  permanentTraits: Trait[]; // Player's permanent traits (Trait objects)
  acquiredTraits: Trait[];  // TraitsSlice.acquiredTraits (Trait objects)
  discoveredTraits: Trait[];// TraitsSlice.discoveredTraits (Trait objects)
  availableTraitsForEquip: Trait[];
  currentEssence: number;
  playerMaxTraitSlots?: number;
  isInProximityToNPC: boolean;
  
  // Status
  loading: boolean;
  error: string | null;
  equippedTraitIds: string[]; // Player's equipped trait IDs
  permanentTraitIds: string[]; // Player's permanent trait IDs
  discoveredTraitIds: string[];// TraitsSlice.discoveredTrait IDs
  acquiredTraitIds: string[];  // TraitsSlice.acquiredTrait IDs
  
  // Actions
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotIndex: number) => void;
  onAcquireTrait: (traitId: string) => void; // For general acquisition if needed
  onMakeTraitPermanent: (traitId: string) => void; // Deprecated, passed as dummy from wrapper
  onDiscoverTrait: (traitId: string) => void;
  
  // Utilities
  canMakePermanent: (trait: Trait) => boolean; // Deprecated
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait) => { 
    canAfford: boolean;
    cost: number;
    currentEssence: number;
    message?: string; 
  };
  
  // Configuration
  className?: string;
  defaultTab?: string;
}

export const TraitSystemUI: React.FC<TraitSystemUIProps> = React.memo(({
  allTraits,
  traitSlots,
  equippedTraits,
  permanentTraits, // Player's permanent Trait objects
  acquiredTraits,  // TraitsSlice.acquiredTraits (general pool of known traits)
  discoveredTraits,
  availableTraitsForEquip,
  currentEssence,
  isInProximityToNPC,
  loading,
  error,
  equippedTraitIds, // Player's equipped trait IDs
  permanentTraitIds, // Player's permanent trait IDs
  // discoveredTraitIds, // Not directly used by TraitSystemUI itself
  // acquiredTraitIds,   // Not directly used by TraitSystemUI itself
  onEquipTrait,
  onUnequipTrait,
  onAcquireTrait,
  onMakeTraitPermanent,
  onDiscoverTrait,
  canMakePermanent,
  canAcquireTrait,
  getTraitAffordability,
  className,
  defaultTab = 'slots'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  if (error) {
    return (
      <Box className={className}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading traits: {error}
        </Alert>
      </Box>
    );
  }

  if (loading && Object.keys(allTraits).length === 0) { 
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
    { id: 'slots', label: 'Equipped Traits', disabled: false },
    { id: 'manage', label: 'Manage Traits', disabled: false },
    { id: 'codex', label: 'Trait Codex', disabled: false }
  ];

  return (
    <Box className={className}>
      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <TabPanel tabId="slots" activeTab={activeTab}>
          <TraitSlots
            traitSlots={traitSlots}
            equippedTraits={equippedTraits} 
            availableTraits={availableTraitsForEquip} 
            onEquipTrait={onEquipTrait}
            onUnequipTrait={onUnequipTrait}
            isInProximityToNPC={isInProximityToNPC}
          />
        </TabPanel>
        
        <TabPanel tabId="manage" activeTab={activeTab}>
          <TraitManagement
            acquiredTraits={acquiredTraits.map(trait => trait.id)} // Convert to string[]
            permanentTraits={permanentTraits.map(trait => trait.id)} // Convert to string[]
            currentEssence={currentEssence}
            // Removed deprecated props that TraitManagement no longer accepts:
            // - equippedTraitIds
            // - permanentTraitIds  
            // - onAcquireTrait
            // - onMakeTraitPermanent
            // - canMakePermanent
            // - getTraitAffordability
            // - isInProximityToNPC
          />
        </TabPanel>
        
        <TabPanel tabId="codex" activeTab={activeTab}>
          <TraitCodex
            allTraits={allTraits} 
            discoveredTraits={discoveredTraits} 
            acquiredTraitIds={acquiredTraits.map(t => t.id)} 
            permanentTraitIds={permanentTraits.map(t => t.id)} 
            currentEssence={currentEssence}
            onDiscoverTrait={onDiscoverTrait}
            onAcquireTrait={onAcquireTrait} 
            onMakeTraitPermanent={onMakeTraitPermanent} 
            canMakePermanent={canMakePermanent} 
            canAcquireTrait={canAcquireTrait}
            getTraitAffordability={(trait) => getTraitAffordability(trait)} 
          />
        </TabPanel>
      </TabContainer>
    </Box>
  );
});

TraitSystemUI.displayName = 'TraitSystemUI';
export default TraitSystemUI;
