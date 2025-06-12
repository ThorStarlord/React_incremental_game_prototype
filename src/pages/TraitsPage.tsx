import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { TraitSystemUI } from '../features/Traits';

// Import all necessary selectors
import {
  selectTraits,
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectEquippedTraits,
  selectTraitLoading,
  selectTraitError,
} from '../features/Traits/state/TraitsSelectors';
import {
  selectPlayerTraitSlots,
  selectPermanentTraits as selectPermanentTraitIds,
} from '../features/Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../features/Essence/state/EssenceSelectors';

// Import all necessary actions and thunks
import {
  fetchTraitsThunk,
  acquireTraitWithEssenceThunk,
  discoverTraitThunk,
} from '../features/Traits/state/TraitThunks';
import {
  equipTrait,
  unequipTrait,
} from '../features/Player/state/PlayerSlice';
import type { Trait } from '../features/Traits/state/TraitsTypes';

const TraitsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Fetch initial trait data if needed
  useEffect(() => {
    dispatch(fetchTraitsThunk());
  }, [dispatch]);

  // Select all necessary data from the Redux store
  const allTraits = useAppSelector(selectTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraitIds);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const permanentTraits = React.useMemo(() => {
      return permanentTraitIds.map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [permanentTraitIds, allTraits]);

  const availableTraitsForEquip = React.useMemo(() => {
      const equippedIds = equippedTraits.map(t => t.id);
      return acquiredTraits.filter(trait => !equippedIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
  }, [acquiredTraits, equippedTraits, permanentTraitIds]);


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
    const isAcquired = acquiredTraits.some(t => t.id === trait.id);
    return !isAcquired;
  }, [acquiredTraits]);

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

  // Construct the props object for TraitSystemUI
  const traitSystemProps = {
    allTraits,
    traitSlots,
    equippedTraits,
    permanentTraits,
    acquiredTraits,
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

  return <TraitSystemUI {...traitSystemProps} />;
};

export default TraitsPage;