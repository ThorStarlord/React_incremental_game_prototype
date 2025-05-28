import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTraits,
  selectTraitSlots,
  selectEquippedTraitObjects,
  selectPermanentTraitObjects,
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import {
  equipTrait,
  unequipTrait,
  acquireTrait,
  makePermanent,
  discoverTrait
} from '../../state/TraitsSlice';
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
  const traitSlots = useAppSelector(selectTraitSlots);
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const permanentTraits = useAppSelector(selectPermanentTraitObjects);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const currentEssence = useAppSelector(selectCurrentEssence);

  // Memoized data derivations for UI
  const availableTraitsForEquip = useMemo(() => 
    acquiredTraits.filter(trait => 
      !equippedTraits.some(equipped => equipped.id === trait.id)
    ),
    [acquiredTraits, equippedTraits]
  );

  const equippedTraitIds = useMemo(() => 
    equippedTraits.map(trait => trait.id),
    [equippedTraits]
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
  }, [dispatch]);

  const handleUnequipTrait = useCallback((slotId: string) => {
    dispatch(unequipTrait(slotId));
  }, [dispatch]);

  const handleAcquireTrait = useCallback((traitId: string) => {
    dispatch(acquireTrait(traitId));
  }, [dispatch]);

  const handleMakeTraitPermanent = useCallback((traitId: string) => {
    dispatch(makePermanent(traitId));
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
    traitSlots,
    equippedTraits,
    permanentTraits,
    acquiredTraits,
    discoveredTraits,
    availableTraitsForEquip,
    currentEssence,
    
    // Status
    loading,
    error,
    equippedTraitIds,
    permanentTraitIds,
    discoveredTraitIds,
    acquiredTraitIds,
    
    // Actions
    onEquipTrait: handleEquipTrait,
    onUnequipTrait: handleUnequipTrait,
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
