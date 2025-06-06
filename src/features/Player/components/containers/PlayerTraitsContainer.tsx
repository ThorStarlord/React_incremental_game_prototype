/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { TraitSlotData, PlayerTraitsContainerProps } from '../../state/PlayerTypes';
import { 
  selectAllTraits, 
  selectTraitLoading,
  selectTraitError 
} from '../../../Traits'; 

// Import player specific selectors directly
import { 
  selectTraitSlots as selectPlayerTraitSlotsFromPlayer, 
  selectPermanentTraits as selectPlayerPermanentTraitIds 
} from '../../state/PlayerSelectors';
// TODO: Import actual equipTrait/unequipTrait actions from PlayerSlice when ready
// import { equipTrait, unequipTrait } from '../../state/PlayerSlice';


/**
 * Container component for player trait management
 */
export const PlayerTraitsContainer: React.FC<PlayerTraitsContainerProps> = ({
  showLoading = false,
  onTraitChange, 
  className,
}) => {
  const dispatch = useAppDispatch();
  
  const rawTraitSlots = useAppSelector(selectPlayerTraitSlotsFromPlayer); 
  const permanentTraitIds = useAppSelector(selectPlayerPermanentTraitIds); 
  const allTraits = useAppSelector(selectAllTraits); 
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError); 

  const traitSlots: TraitSlotData[] = useMemo(() => {
    if (!Array.isArray(rawTraitSlots)) {
      return [];
    }
    return rawTraitSlots.map((slot, index) => ({
      id: slot?.id || `slot-${index}`, 
      index: slot?.index ?? index,
      isUnlocked: slot?.isUnlocked ?? false,
      traitId: slot?.traitId || null
    }));
  }, [rawTraitSlots]);

  const equippedTraits = useMemo(() => {
    return traitSlots
      .filter(slot => slot.traitId)
      .map(slot => allTraits[slot.traitId!]) 
      .filter(Boolean); 
  }, [traitSlots, allTraits]);

  const permanentTraits = useMemo(() => {
    return permanentTraitIds 
      .map((traitId: string) => allTraits[traitId]) 
      .filter(Boolean); 
  }, [permanentTraitIds, allTraits]);

  // Adjusted signature to match PlayerTraitsUIProps: (traitId: string, slotIndex: number)
  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    // TODO: Dispatch PlayerSlice.equipTrait({ slotIndex, traitId });
    console.log('PlayerTraitsContainer: Equipping trait:', traitId, 'to slot index:', slotIndex);
    onTraitChange?.('equip', traitId); 
  }, [onTraitChange, dispatch]); 

  // Adjusted signature to match PlayerTraitsUIProps: (slotIndex: number)
  const handleUnequipTrait = useCallback((slotIndex: number) => { 
    const slot = traitSlots.find(s => s.index === slotIndex); // Find by index
    if (slot && slot.traitId) {
      // TODO: Dispatch PlayerSlice.unequipTrait({ slotIndex });
      console.log('PlayerTraitsContainer: Unequipping trait from slot index:', slotIndex);
      onTraitChange?.('unequip', slot.traitId); 
    } else {
      console.warn('PlayerTraitsContainer: Slot not found or no trait to unequip at index:', slotIndex);
    }
  }, [onTraitChange, traitSlots, dispatch]); 

  // handleMakePermanent is removed.

  const totalSlots = traitSlots.length;
  const unlockedSlots = traitSlots.filter(slot => slot.isUnlocked).length;
  const equippedCount = equippedTraits.length;
  const permanentCount = permanentTraits.length;

  return (
    <PlayerTraitsUI
      traitSlots={traitSlots}
      equippedTraits={equippedTraits} 
      permanentTraits={permanentTraits} 
      availableTraits={[]} 
      onEquipTrait={handleEquipTrait}
      onUnequipTrait={handleUnequipTrait}
      isLoading={showLoading || isLoading} // Changed showLoading to isLoading
      className={className}
      error={error} 
    />
  );
};

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';
export default React.memo(PlayerTraitsContainer);
