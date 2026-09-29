import React, { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  selectTraits,
  selectDiscoveredTraitObjects,
  selectTraitLoading,
  selectTraitError,
} from '../../state/TraitsSelectors';
import {
  selectAssimilatedTraitIds,
  selectExpressedTraits,
  selectPlayerTraitSlots,
} from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import {
  fetchTraitsThunk,
  stabilizeTraitWithEssenceThunk,
  discoverTraitThunk,
} from '../../state/TraitThunks';
import { expressTrait, suppressTrait } from '../../../Player/state/PlayerSlice';
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
  const expressedTraits = useAppSelector(selectExpressedTraits);
  const assimilatedTraitIds = useAppSelector(selectAssimilatedTraitIds);
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const assimilatedTraits = useMemo(() => {
    return assimilatedTraitIds.map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [assimilatedTraitIds, allTraits]);

  const availableTraitsForEquip = useMemo(() => {
    const expressedIds = new Set(expressedTraits.map(t => t.id));
    const candidateIds = new Set([
      ...discoveredTraits.map(trait => trait.id),
      ...assimilatedTraitIds,
    ]);
    return Array.from(candidateIds)
      .map(traitId => allTraits[traitId])
      .filter((trait): trait is Trait => Boolean(trait))
      .filter(trait => !expressedIds.has(trait.id));
  }, [allTraits, discoveredTraits, expressedTraits, assimilatedTraitIds]);


  // Define action handlers
  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    dispatch(expressTrait({ traitId, slotIndex }));
  }, [dispatch]);

  const handleUnequipTrait = useCallback((slotIndex: number) => {
    dispatch(suppressTrait({ slotIndex }));
  }, [dispatch]);

  const handleAcquireTrait = useCallback((traitId: string) => {
    const trait = allTraits[traitId];
    if (trait) {
      dispatch(stabilizeTraitWithEssenceThunk({ traitId }));
    }
  }, [dispatch, allTraits]);

  const handleDiscoverTrait = useCallback((traitId: string) => {
    dispatch(discoverTraitThunk(traitId));
  }, [dispatch]);

  // Define utility functions to pass as props
  const canAcquireTrait = useCallback((trait: Trait) => {
    // Stabilization makes a discovered pattern permanently available in the assimilated library.
    const isDiscovered = discoveredTraits.some(t => t.id === trait.id);
    const isAssimilated = assimilatedTraits.some(t => t.id === trait.id);
    return isDiscovered && !isAssimilated;
  }, [discoveredTraits, assimilatedTraits]);

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
    // TraitSystemTabs retains compatibility prop names at its presentational boundary.
    equippedTraits: expressedTraits,
    permanentTraits: assimilatedTraits,
    acquiredTraits: discoveredTraits, // Pass discovered traits as the base for "acquired" logic
    discoveredTraits,
    availableTraitsForEquip,
    currentEssence,
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
