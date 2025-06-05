/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { TraitSlotData, PlayerTraitsContainerProps } from '../../state/PlayerTypes';
import { 
  // selectTraitSlots, // This was incorrectly sourced from Traits
  selectAllTraits, 
  selectTraitLoading 
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

  const handleEquipTrait = useCallback((slotIndex: number, traitId: string) => {
    // TODO: Dispatch PlayerSlice.equipTrait({ slotIndex, traitId });
    console.log('PlayerTraitsContainer: Equipping trait:', traitId, 'to slot index:', slotIndex);
    onTraitChange?.('equip', traitId); // Corrected: 2 arguments
  }, [onTraitChange, dispatch]); // Added dispatch to dependency array if it were used

  const handleUnequipTrait = useCallback((slotId: string) => { 
    const slot = traitSlots.find(s => s.id === slotId);
    if (slot && slot.traitId) {
      // TODO: Dispatch PlayerSlice.unequipTrait({ slotIndex: slot.index });
      console.log('PlayerTraitsContainer: Unequipping trait from slot id:', slotId, 'index:', slot.index);
      onTraitChange?.('unequip', slot.traitId); // Corrected: 2 arguments, pass traitId
    } else {
      console.warn('PlayerTraitsContainer: Slot not found or no trait to unequip:', slotId);
    }
  }, [traitSlots, onTraitChange, dispatch]); // Added dispatch

  // handleMakePermanent is removed.

  const totalSlots = traitSlots.length;
  const unlockedSlots = traitSlots.filter(slot => slot.isUnlocked).length;
  const equippedCount = equippedTraits.length;
  const permanentCount = permanentTraits.length;

  return (
    <PlayerTraitsUI
      slots={traitSlots}
      equippedTraits={equippedTraits}
      permanentTraits={permanentTraits}
      onEquipTrait={handleEquipTrait}
      onUnequipTrait={handleUnequipTrait}
      // onMakePermanent prop removed
      showLoading={showLoading || isLoading}
      className={className}
      totalSlots={totalSlots}
      unlockedSlots={unlockedSlots}
      equippedCount={equippedCount}
      permanentCount={permanentCount}
    />
  );
};

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';
export default React.memo(PlayerTraitsContainer);
