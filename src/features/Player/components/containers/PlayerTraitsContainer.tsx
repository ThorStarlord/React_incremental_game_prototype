/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { TraitSlotData, PlayerTraitsContainerProps } from '../../state/PlayerTypes';
import { 
  selectTraits, // Changed from selectAllTraits to selectTraits
  selectTraitLoading,
  selectTraitError 
} from '../../../Traits/state/TraitsSelectors';

// Import player specific selectors directly
import { 
  selectPermanentTraits 
} from '../../state/PlayerSelectors';
import { 
  selectUnlockedSlotCount, 
  selectEquippedTraitObjects 
} from '../../../Traits/state/TraitsSelectors';
import { recalculateStatsThunk } from '../../state/PlayerThunks'; 


/**
 * Container component for player trait management
 */
export const PlayerTraitsContainer: React.FC<PlayerTraitsContainerProps> = ({
  showLoading = false,
  onTraitChange, 
  className,
}) => {
  const dispatch = useAppDispatch();
  
  const permanentTraitIds = useAppSelector(selectPermanentTraits); 
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const unlockedSlotCount = useAppSelector(selectUnlockedSlotCount);
  const allTraits = useAppSelector(selectTraits); // Updated variable name for clarity
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError); 

  const traitSlots: TraitSlotData[] = useMemo(() => {
    if (!Array.isArray(equippedTraits)) {
      return [];
    }
    return equippedTraits.map((slot, index) => ({
      id: slot?.id || `slot-${index}`, 
      index: slot?.index ?? index,
      isUnlocked: slot?.isUnlocked ?? false,
      traitId: slot?.traitId || null
    }));
  }, [equippedTraits]);

  const equippedTraitsList = useMemo(() => {
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
    // TODO: Implement trait equipping when the correct action is available
    console.log(`Equipping trait ${traitId} - functionality pending`);
    
    // When the correct action is available, it might look like:
    // dispatch(equipPlayerTrait({ traitId, slotIndex: availableSlotIndex }));
  }, []);

  // Adjusted signature to match PlayerTraitsUIProps: (slotIndex: number)
  const handleUnequipTrait = useCallback((slotIndex: number) => { 
    const slot = traitSlots.find(s => s.index === slotIndex); 
    if (slot && slot.traitId) {
      // TODO: Implement trait unequipping when the correct action is available
      console.log(`Unequipping trait ${slot.traitId} - functionality pending`);
      
      // When the correct action is available, it might look like:
      // dispatch(unequipPlayerTrait({ traitId }));
    } else {
      console.warn('PlayerTraitsContainer: Slot not found or no trait to unequip at index:', slotIndex);
    }
  }, [traitSlots]); 

  // handleMakePermanent is removed.

  const totalSlots = traitSlots.length;
  const unlockedSlots = traitSlots.filter(slot => slot.isUnlocked).length;
  const equippedCount = equippedTraitsList.length;
  const permanentCount = permanentTraits.length;

  return (
    <PlayerTraitsUI
      traitSlots={traitSlots}
      equippedTraits={equippedTraitsList} 
      permanentTraits={permanentTraits} 
      availableTraits={[]} 
      onEquipTrait={handleEquipTrait}
      onUnequipTrait={handleUnequipTrait}
      isLoading={showLoading || isLoading} 
      className={className}
      error={error} 
    />
  );
};

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';
export default React.memo(PlayerTraitsContainer);
