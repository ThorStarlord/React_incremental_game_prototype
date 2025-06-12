import React, { useState, useCallback } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { TabContainer, TabPanel } from '../../../../shared/components/Tabs';
import { TraitSlots } from './TraitSlots';
import { TraitManagement } from './TraitManagement';
import { TraitCodex } from './TraitCodex';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

export interface TraitSystemUIProps {
  allTraits: Record<string, Trait>;
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  permanentTraits: Trait[];
  acquiredTraits: Trait[];
  discoveredTraits: Trait[];
  availableTraitsForEquip: Trait[];
  currentEssence: number;
  isInProximityToNPC: boolean;
  loading: boolean;
  error: string | null;
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotIndex: number) => void;
  onAcquireTrait: (traitId: string) => void;
  onDiscoverTrait: (traitId: string) => void;
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait) => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
    message?: string;
  };
  className?: string;
  defaultTab?: string;
}

export const TraitSystemUI: React.FC<TraitSystemUIProps> = React.memo(({
  allTraits,
  traitSlots,
  equippedTraits,
  permanentTraits,
  acquiredTraits,
  discoveredTraits,
  availableTraitsForEquip,
  currentEssence,
  isInProximityToNPC,
  loading,
  error,
  onEquipTrait,
  onUnequipTrait,
  onAcquireTrait,
  onDiscoverTrait,
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
    return <Box className={className}><Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert></Box>;
  }

  if (loading && Object.keys(allTraits).length === 0) {
    return <Box className={className} display="flex" justifyContent="center" alignItems="center" minHeight={400}><CircularProgress /></Box>;
  }

  const tabs = [
    { id: 'slots', label: 'Equipped Traits' },
    { id: 'manage', label: 'Manage Traits' },
    { id: 'codex', label: 'Trait Codex' }
  ];

  return (
    <Box className={className}>
      <TabContainer tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}>
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
            currentEssence={currentEssence}
            onEquipTrait={onEquipTrait}
            onUnequipTrait={onUnequipTrait}
          />
        </TabPanel>
        <TabPanel tabId="codex" activeTab={activeTab}>
          {/* FIXED: Removed onMakeTraitPermanent and canMakePermanent props */}
          <TraitCodex
            allTraits={allTraits}
            discoveredTraits={discoveredTraits}
            acquiredTraitIds={acquiredTraits.map(t => t.id)}
            permanentTraitIds={permanentTraits.map(t => t.id)}
            currentEssence={currentEssence}
            onDiscoverTrait={onDiscoverTrait}
            onAcquireTrait={onAcquireTrait}
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