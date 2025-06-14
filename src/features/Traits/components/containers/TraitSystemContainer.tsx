import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  selectTraits,
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
import type { Trait } from '../../state/TraitsTypes';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';
import TraitSystemTabs from '../ui/TraitSystemTabs';

/**
 * TraitSystemContainer Component
 *
 * This is the primary "smart" component for the Traits feature. It is responsible for:
 * 1. Fetching all necessary data from the Redux store.
 * 2. Defining all action handlers that dispatch to Redux.
 * 3. Passing all the data and handlers down to the presentational TraitSystemTabs component.
 */
const TraitSystemContainer: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();

  // Fetch initial trait data when the view is mounted
  useEffect(() => {
    dispatch(fetchTraitsThunk());
  }, [dispatch]);

  // Select all necessary data from the Redux store
  const allTraits = useAppSelector(selectTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraitIds);
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const permanentTraits = useMemo(() => {
    return permanentTraitIds.map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [permanentTraitIds, allTraits]);

  const availableTraitsForEquip = useMemo(() => {
    const equippedIds = equippedTraits.map(t => t.id);
    return discoveredTraits.filter(trait => !equippedIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
  }, [discoveredTraits, equippedTraits, permanentTraitIds]);


  // Define action handlers
  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    dispatch(equipTrait({ traitId, slotIndex }));
  }, [dispatch]);

  const handleUnequipTrait = useCallback((slotIndex: number) => {
    dispatch(unequipTrait({ slotIndex }));
  }, [dispatch]);

  const handleAcquireTrait = useCallback((traitId: string) => {
    const trait = allTraits[traitId];
    if (trait) {
      dispatch(acquireTraitWithEssenceThunk({ traitId, essenceCost: trait.essenceCost || 0 }));
    }
  }, [dispatch, allTraits]);

  const handleDiscoverTrait = useCallback((traitId: string) => {
    dispatch(discoverTraitThunk(traitId));
  }, [dispatch]);

  // Define utility functions to pass as props
  const canAcquireTrait = useCallback((trait: Trait) => {
    // A trait can be "acquired" (made permanent) if it's discovered and not already permanent.
    const isDiscovered = discoveredTraits.some(t => t.id === trait.id);
    const isPermanent = permanentTraits.some(t => t.id === trait.id);
    return isDiscovered && !isPermanent;
  }, [discoveredTraits, permanentTraits]);

  const getTraitAffordability = useCallback((trait: Trait) => {
    const cost = trait.essenceCost || 0;
    const canAfford = currentEssence >= cost;
    return {
      canAfford,
      cost,
      currentEssence,
      message: canAfford ? 'Can afford' : `Requires ${cost} essence`,
    };
  }, [currentEssence]);

  // Construct the props object for TraitSystemTabs
  const traitSystemProps = {
    allTraits,
    traitSlots,
    equippedTraits,
    permanentTraits,
    acquiredTraits: discoveredTraits, // Pass discovered traits as the base for "acquired" logic
    discoveredTraits,
    availableTraitsForEquip,
    currentEssence,
    isInProximityToNPC: true, // Assuming default proximity or get from meta state
    loading,
    error,
    onEquipTrait: handleEquipTrait,
    onUnequipTrait: handleUnequipTrait,
    onAcquireTrait: handleAcquireTrait,
    onDiscoverTrait: handleDiscoverTrait,
    canAcquireTrait,
    getTraitAffordability,
  };

  return (
    <TraitSystemErrorBoundary>
      <TraitSystemTabs {...traitSystemProps} />
    </TraitSystemErrorBoundary>
  );
});

TraitSystemContainer.displayName = 'TraitSystemContainer';

export default TraitSystemContainer;