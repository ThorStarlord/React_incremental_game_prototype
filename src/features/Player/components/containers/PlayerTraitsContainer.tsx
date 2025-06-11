/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { Trait, TraitSlot } from '../../../Traits/state/TraitsTypes';
import { 
  selectAllTraits,
  selectTraitsLoading,
  selectTraitsError,
  selectEquippedTraitObjects
} from '../../../Traits/state/TraitsSelectors';
import { 
  selectPermanentTraits,
  selectMaxTraitSlots
} from '../../state/PlayerSelectors';

/**
 * Container component props interface
 */
interface PlayerTraitsContainerProps {
  showLoading?: boolean;
  onTraitChange?: (traitId: string) => void;
  className?: string;
}

/**
 * Container component for player trait management
 */
export const PlayerTraitsContainer: React.FC<PlayerTraitsContainerProps> = ({
  showLoading = false,
  onTraitChange, 
  className,
}) => {
  const dispatch = useAppDispatch();
  
  // Use proper selectors for trait data
  const permanentTraitIds = useAppSelector(selectPermanentTraits); 
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const maxTraitSlots = useAppSelector(selectMaxTraitSlots);
  const allTraits = useAppSelector(selectAllTraits);
  const isLoading = useAppSelector(selectTraitsLoading);
  const error = useAppSelector(selectTraitsError); 

  // Create trait slots using proper TraitSlot interface
  const traitSlots: TraitSlot[] = useMemo(() => {
    const slots: TraitSlot[] = [];
    
    for (let i = 0; i < maxTraitSlots; i++) {
      const equippedTrait = equippedTraits.find(trait => trait && trait.slotIndex === i);
      
      slots.push({
        id: `slot-${i}`,
        slotIndex: i,
        traitId: equippedTrait?.id || null,
        isLocked: i >= 3, // First 3 slots unlocked by default
        unlockRequirement: i >= 3 ? 'Resonance Level ' + Math.ceil(i / 2) : undefined
      });
    }
    
    return slots;
  }, [maxTraitSlots, equippedTraits]);

  // Get permanent traits as Trait objects
  const permanentTraits = useMemo(() => {
    return permanentTraitIds
      .map((traitId: string) => allTraits[traitId]) 
      .filter(Boolean); 
  }, [permanentTraitIds, allTraits]);

  // Get available traits (for future trait selection)
  const availableTraits = useMemo(() => {
    return Object.values(allTraits);
  }, [allTraits]);

  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    // TODO: Implement trait equipping when the correct action is available
    console.log(`Equipping trait ${traitId} to slot ${slotIndex} - functionality pending`);
    onTraitChange?.(traitId);
  }, [onTraitChange]);

  const handleUnequipTrait = useCallback((slotIndex: number) => { 
    const slot = traitSlots.find(s => s.slotIndex === slotIndex); 
    if (slot && slot.traitId) {
      console.log(`Unequipping trait ${slot.traitId} from slot ${slotIndex} - functionality pending`);
      onTraitChange?.(slot.traitId);
    }
  }, [traitSlots, onTraitChange]); 

  const handleTraitSelect = useCallback((traitId: string) => {
    console.log(`Trait selected: ${traitId} - functionality pending`);
    onTraitChange?.(traitId);
  }, [onTraitChange]);

  return (
    <PlayerTraitsUI
      traitSlots={traitSlots}
      availableTraits={availableTraits}
      onEquipTrait={handleEquipTrait}
      onUnequipTrait={handleUnequipTrait}
      onTraitSelect={handleTraitSelect}
      isLoading={showLoading || isLoading}
      className={className}
      error={error}
    />
  );
};

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';
export default React.memo(PlayerTraitsContainer);
