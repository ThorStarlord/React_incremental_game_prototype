import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectTraits,
  selectPermanentTraitObjects, 
  selectAcquiredTraitObjects,
  selectDiscoveredTraitObjects,
  selectTraitLoading,
  selectTraitError,
  selectEquippedTraitObjects 
} from '../../state/TraitsSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { selectIsInProximityToNPC } from '../../../Meta/state/MetaSlice';
import {
  acquireTrait, 
  discoverTrait
} from '../../state/TraitsSlice';
import {
  selectTraitSlots as selectPlayerTraitSlots,
  selectEquippedTraitIds as selectPlayerEquippedTraitIds,
  selectMaxTraitSlots as selectPlayerMaxTraitSlots
} from '../../../Player/state/PlayerSelectors';
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../../Player/state/PlayerThunks';
import { TraitSystemUI, type TraitSystemUIProps } from '../ui/TraitSystemUI';
import type { Trait } from '../../state/TraitsTypes';

export interface TraitSystemWrapperProps {
  className?: string;
  defaultTab?: string;
}

export const TraitSystemWrapper: React.FC<TraitSystemWrapperProps> = React.memo(({
  className,
  defaultTab = 'slots'
}) => {
  const dispatch = useAppDispatch();

  const allTraits = useAppSelector(selectTraits);
  const playerTraitSlots = useAppSelector(selectPlayerTraitSlots);
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects);
  const playerMaxTraitSlots = useAppSelector(selectPlayerMaxTraitSlots);
  const permanentTraits = useAppSelector(selectPermanentTraitObjects); 
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects); 
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const loading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);

  const equippedTraitIds = useAppSelector(selectPlayerEquippedTraitIds);

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

  const handleDiscoverTrait = useCallback((traitId: string) => {
    dispatch(discoverTrait(traitId));
  }, [dispatch]);

  // This function is deprecated as 'Resonate' now makes traits permanent.
  const canMakePermanent = useCallback((trait: Trait): boolean => {
    if (permanentTraitIds.includes(trait.id)) return false; 
    if (!acquiredTraitIds.includes(trait.id)) return false; 
    return false; 
  }, [permanentTraitIds, acquiredTraitIds]);

  const canAcquireTrait = useCallback((trait: Trait): boolean => {
    if (acquiredTraitIds.includes(trait.id) || permanentTraitIds.includes(trait.id)) return false; 
    if (!discoveredTraitIds.includes(trait.id) && !trait.sourceNpc) return false; 
    if (!trait.essenceCost) return true; 
    return currentEssence >= trait.essenceCost;
  }, [acquiredTraitIds, permanentTraitIds, discoveredTraitIds, currentEssence]);

  // Simplified: only handles 'acquire' action now.
  const getTraitAffordability = useCallback((trait: Trait /*, action: 'acquire' */) => {
    // 'permanent' action via this route is deprecated.
    // This function now effectively only considers 'acquire' based on essenceCost.
    const cost = trait.essenceCost; 
    
    if (!cost) return { canAfford: true, cost: 0, currentEssence };
    
    return {
      canAfford: currentEssence >= cost,
      cost,
      currentEssence
    };
  }, [currentEssence]);

  const uiProps: TraitSystemUIProps = {
    allTraits,
    traitSlots: playerTraitSlots,
    equippedTraits: equippedTraitObjects,
    permanentTraits, 
    acquiredTraits, 
    discoveredTraits,
    availableTraitsForEquip,
    currentEssence,
    playerMaxTraitSlots,
    isInProximityToNPC,
    loading,
    error,
    equippedTraitIds,
    permanentTraitIds, 
    discoveredTraitIds,
    acquiredTraitIds, 
    onEquipTrait: handleEquipTrait,
    onUnequipTrait: handleUnequipTrait,
    onAcquireTrait: handleAcquireTrait, 
    onMakeTraitPermanent: (traitId: string) => { 
        console.warn(`onMakeTraitPermanent called for ${traitId}, but this is deprecated. Use Resonate.`);
    },
    onDiscoverTrait: handleDiscoverTrait,
    canMakePermanent, 
    canAcquireTrait,
    // Ensure the signature passed matches what TraitSystemUIProps expects for getTraitAffordability
    // If TraitSystemUIProps still expects (trait, action: 'acquire' | 'permanent'), 
    // this might need adjustment or TraitSystemUIProps needs update.
    // For now, passing the simplified version.
    getTraitAffordability: (trait: Trait) => getTraitAffordability(trait /*, 'acquire' implicitly */),
    className,
    defaultTab
  };

  return <TraitSystemUI {...uiProps} />;
});

TraitSystemWrapper.displayName = 'TraitSystemWrapper';
export default TraitSystemWrapper;
