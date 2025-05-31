import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTraits,
  selectPermanentTraitObjects,
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectTraitLoading,
  selectTraitError,
  selectEquippedTraitObjects // Added import for selectEquippedTraitObjects
} from '../../state/TraitsSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import {
  acquireTrait,
  makePermanent,
  discoverTrait
} from '../../state/TraitsSlice'; // Actions still in TraitsSlice
import {
  selectTraitSlots as selectPlayerTraitSlots, // Alias for player's trait slots
  selectEquippedTraitIds as selectPlayerEquippedTraitIds, // Alias for player's equipped trait IDs
  selectMaxTraitSlots as selectPlayerMaxTraitSlots // Import max slots
} from '../../../Player/state/PlayerSelectors'; // Import from PlayerSelectors
import { equipTrait, unequipTrait, unlockTraitSlot } from '../../../Player/state/PlayerSlice'; // Import actions from PlayerSlice
import { recalculateStatsThunk } from '../../../Player/state/PlayerThunks'; // Import recalculateStatsThunk
import { TraitSystemUI, type TraitSystemUIProps } from '../ui/TraitSystemUI';
import type { Trait } from '../../state/TraitsTypes';

/**
 * Props for the TraitSystemWrapper container component
 */
export interface TraitSystemWrapperProps {
  /** Additional class name */
  className?: string;
  /** Initial active tab */
  defaultTab?: string;
}

/**
 * Container component that manages trait system state and provides data to the UI layer
 * Handles all Redux interactions and business logic for the trait management system
 */
export const TraitSystemWrapper: React.FC<TraitSystemWrapperProps> = React.memo(({
  className,
  defaultTab = 'slots'
}) => {
  const dispatch = useAppDispatch();

  // Fetch all necessary data from Redux store
  const allTraits = useAppSelector(selectTraits);
  const playerTraitSlots = useAppSelector(selectPlayerTraitSlots); // Get player's trait slots
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects); // Corrected: This selector is from TraitsSelectors.ts
  const playerMaxTraitSlots = useAppSelector(selectPlayerMaxTraitSlots); // Get player's max trait slots
  const permanentTraits = useAppSelector(selectPermanentTraitObjects);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const currentEssence = useAppSelector(selectCurrentEssence);

  // Memoized data derivations for UI
  const equippedTraitIds = useAppSelector(selectPlayerEquippedTraitIds); // Get equipped trait IDs from PlayerSelectors

  const availableTraitsForEquip = useMemo(() => 
    acquiredTraits.filter(trait => 
      !equippedTraitIds.includes(trait.id) && !permanentTraits.some(p => p.id === trait.id)
    ),
    [acquiredTraits, equippedTraitIds, permanentTraits]
  );

  const permanentTraitIds = useMemo(() => 
    permanentTraits.map(trait => trait.id),
    [permanentTraits]
  );

  const discoveredTraitIds = useMemo(() => 
    discoveredTraits.map(trait => trait.id),
    [discoveredTraits]
  );

  const acquiredTraitIds = useMemo(() => 
    acquiredTraits.map(trait => trait.id),
    [acquiredTraits]
  );

  // Action handlers
  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    dispatch(equipTrait({ traitId, slotIndex }));
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  const handleUnequipTrait = useCallback((slotIndex: number) => {
    dispatch(unequipTrait({ slotIndex }));
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  const handleAcquireTrait = useCallback((traitId: string) => {
    dispatch(acquireTrait(traitId));
  }, [dispatch]);

  const handleMakeTraitPermanent = useCallback((traitId: string) => {
    dispatch(makePermanent(traitId));
    dispatch(recalculateStatsThunk()); // Dispatch recalculateStatsThunk after making trait permanent
  }, [dispatch]);

  const handleDiscoverTrait = useCallback((traitId: string) => {
    dispatch(discoverTrait(traitId));
  }, [dispatch]);

  // Check if a trait can be made permanent
  const canMakePermanent = useCallback((trait: Trait): boolean => {
    if (!trait.permanenceCost) return false;
    if (permanentTraitIds.includes(trait.id)) return false;
    if (!acquiredTraitIds.includes(trait.id)) return false;
    return currentEssence >= trait.permanenceCost;
  }, [permanentTraitIds, acquiredTraitIds, currentEssence]);

  // Check if a trait can be acquired
  const canAcquireTrait = useCallback((trait: Trait): boolean => {
    if (acquiredTraitIds.includes(trait.id)) return false;
    if (!discoveredTraitIds.includes(trait.id)) return false;
    if (!trait.essenceCost) return true;
    return currentEssence >= trait.essenceCost;
  }, [acquiredTraitIds, discoveredTraitIds, currentEssence]);

  // Get affordability information for a trait
  const getTraitAffordability = useCallback((trait: Trait, action: 'acquire' | 'permanent') => {
    const cost = action === 'acquire' ? trait.essenceCost : trait.permanenceCost;
    if (!cost) return { canAfford: true, cost: 0, currentEssence };
    
    return {
      canAfford: currentEssence >= cost,
      cost,
      currentEssence
    };
  }, [currentEssence]);

  // Props for the presentational component
  const uiProps: TraitSystemUIProps = {
    // Data
    allTraits,
    traitSlots: playerTraitSlots, // Pass player's trait slots
    equippedTraits: equippedTraitObjects, // Pass equipped trait objects
    permanentTraits,
    acquiredTraits,
    discoveredTraits,
    availableTraitsForEquip,
    currentEssence,
    playerMaxTraitSlots, // Pass player's max trait slots
    
    // Status
    loading,
    error,
    equippedTraitIds, // This is now from PlayerSelectors
    permanentTraitIds,
    discoveredTraitIds,
    acquiredTraitIds,
    
    // Actions
    onEquipTrait: handleEquipTrait,
    onUnequipTrait: handleUnequipTrait, // This now expects slotIndex: number
    onAcquireTrait: handleAcquireTrait,
    onMakeTraitPermanent: handleMakeTraitPermanent,
    onDiscoverTrait: handleDiscoverTrait,
    
    // Utilities
    canMakePermanent,
    canAcquireTrait,
    getTraitAffordability,
    
    // Configuration
    className,
    defaultTab
  };

  return <TraitSystemUI {...uiProps} />;
});

TraitSystemWrapper.displayName = 'TraitSystemWrapper';

export default TraitSystemWrapper;
