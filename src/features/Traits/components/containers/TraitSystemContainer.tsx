import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Grid,
} from '@mui/material';
import {
  selectTraits,
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectTraitLoading,
  selectTraitError,
} from '../../state/TraitsSelectors';
import {
  selectEquippedTraits,
  selectPlayerTraitSlots,
  selectPermanentTraits as selectPermanentTraitIds,
} from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import {
  fetchTraitsThunk,
  acquireTraitWithEssenceThunk,
  discoverTraitThunk,
} from '../../state/TraitThunks';
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';
import TraitSystemErrorBoundary from '../layout/TraitSystemErrorBoundary';
// Update import path and name for the UI component
- import TraitSystemUI from '../ui/TraitSystemUI';
+ import TraitSystemTabs from '../ui/TraitSystemTabs';


// Define the props interface for TraitSystemContainer (formerly TraitFeatureView)
export interface TraitSystemContainerProps {
  // Props are now passed down to TraitSystemTabs, so this container
  // doesn't necessarily need props unless it receives configuration
  // from its parent (TraitsPage). Based on TraitsPage, it receives
  // the full set of data and handlers. Let's keep the interface
  // but acknowledge its role is primarily to fetch/handle and pass down.
  // The props interface is the same as TraitSystemTabsProps.
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
    message: string;
  };
}


// Rename the component from TraitFeatureView to TraitSystemContainer
- const TraitSystemContainer: React.FC<TraitFeatureViewProps> = React.memo(({
+ const TraitSystemContainer: React.FC<TraitSystemContainerProps> = React.memo(({
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
}) => {

  // This container component is responsible for fetching data and defining handlers.
  // It receives these as props from TraitsPage, which is also a container.
  // This structure is a bit redundant. Ideally, TraitsPage would just render
  // TraitSystemContainer, and TraitSystemContainer would fetch its OWN data
  // and define its OWN handlers, then pass them to the presentational TraitSystemTabs.
  // However, to match the current pattern where TraitsPage fetches/defines and passes,
  // we will keep receiving props here and pass them down to TraitSystemTabs.

  return (
    <TraitSystemErrorBoundary>
      {/* Render the presentational component and pass all props */}
      <TraitSystemTabs
        allTraits={allTraits}
        traitSlots={traitSlots}
        equippedTraits={equippedTraits}
        permanentTraits={permanentTraits}
        acquiredTraits={acquiredTraits}
        discoveredTraits={discoveredTraits}
        availableTraitsForEquip={availableTraitsForEquip}
        currentEssence={currentEssence}
        isInProximityToNPC={isInProximityToNPC}
        loading={loading}
        error={error}
        onEquipTrait={onEquipTrait}
        onUnequipTrait={onUnequipTrait}
        onAcquireTrait={onAcquireTrait}
        onDiscoverTrait={onDiscoverTrait}
        canAcquireTrait={canAcquireTrait}
        getTraitAffordability={getTraitAffordability}
      />
    </TraitSystemErrorBoundary>
  );
});

// Update displayName
- TraitSystemContainer.displayName = 'TraitFeatureView';
+ TraitSystemContainer.displayName = 'TraitSystemContainer';

// Update export
- export default TraitSystemContainer;
+ export default TraitSystemContainer;