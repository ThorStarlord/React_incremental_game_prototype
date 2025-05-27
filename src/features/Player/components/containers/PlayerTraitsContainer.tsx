/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { TraitSlotData, PlayerTraitsContainerProps } from '../../state/PlayerTypes';
import { 
  selectTraitSlots,
  selectPermanentTraits,
  selectAllTraits,
  selectTraitLoading 
} from '../../../Traits';

/**
 * Container component for player trait management
 * Provides Redux state integration and trait management logic
 */
export const PlayerTraitsContainer: React.FC<PlayerTraitsContainerProps> = ({
  showLoading = false,
  onTraitChange,
  className,
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const rawTraitSlots = useAppSelector(selectTraitSlots);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const allTraits = useAppSelector(selectAllTraits);
  const isLoading = useAppSelector(selectTraitLoading);

  // Transform raw slot data to TraitSlotData format
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

  // Convert trait IDs to trait objects for equipped traits
  const equippedTraits = useMemo(() => {
    return traitSlots
      .filter(slot => slot.traitId)
      .map(slot => allTraits[slot.traitId!])
      .filter(Boolean);
  }, [traitSlots, allTraits]);

  // Convert permanent trait IDs to trait objects
  const permanentTraits = useMemo(() => {
    return permanentTraitIds
      .map(traitId => allTraits[traitId])
      .filter(Boolean);
  }, [permanentTraitIds, allTraits]);

  // Event handlers with proper error handling and validation
  const handleEquipTrait = useCallback((slotIndex: number, traitId: string) => {
    try {
      // Validate slot index
      if (slotIndex < 0 || slotIndex >= traitSlots.length) {
        console.error('Invalid slot index:', slotIndex);
        return;
      }

      // Check if slot is unlocked
      const targetSlot = traitSlots[slotIndex];
      if (!targetSlot?.isUnlocked) {
        console.warn('Attempted to equip trait to locked slot:', slotIndex);
        return;
      }

      // Check if trait exists
      if (!allTraits[traitId]) {
        console.error('Trait not found:', traitId);
        return;
      }

      console.log('Equipping trait:', traitId, 'to slot:', slotIndex);
      onTraitChange?.('equip', traitId);
      
      // TODO: Dispatch actual Redux action when trait system backend is ready
      // dispatch(equipTrait({ slotIndex, traitId }));
    } catch (error) {
      console.error('Error equipping trait:', error);
    }
  }, [traitSlots, allTraits, onTraitChange]);

  const handleUnequipTrait = useCallback((slotId: string) => {
    try {
      // Find the slot by ID
      const slot = traitSlots.find(s => s.id === slotId);
      if (!slot || !slot.traitId) {
        console.warn('No trait equipped in slot:', slotId);
        return;
      }

      console.log('Unequipping trait from slot:', slotId);
      onTraitChange?.('unequip', slotId);
      
      // TODO: Dispatch actual Redux action when trait system backend is ready
      // dispatch(unequipTrait({ slotId }));
    } catch (error) {
      console.error('Error unequipping trait:', error);
    }
  }, [traitSlots, onTraitChange]);

  const handleMakePermanent = useCallback((traitId: string) => {
    try {
      // Validate trait exists
      if (!allTraits[traitId]) {
        console.error('Trait not found for permanence:', traitId);
        return;
      }

      // Check if trait is already permanent
      if (permanentTraitIds.includes(traitId)) {
        console.warn('Trait is already permanent:', traitId);
        return;
      }

      console.log('Making trait permanent:', traitId);
      onTraitChange?.('permanent', traitId);
      
      // TODO: Dispatch actual Redux action when trait system backend is ready
      // dispatch(makeTraitPermanent({ traitId }));
    } catch (error) {
      console.error('Error making trait permanent:', error);
    }
  }, [allTraits, permanentTraitIds, onTraitChange]);

  // Additional computed values for UI
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
      onMakePermanent={handleMakePermanent}
      showLoading={showLoading || isLoading}
      className={className}
      totalSlots={totalSlots}
      unlockedSlots={unlockedSlots}
      equippedCount={equippedCount}
      permanentCount={permanentCount}
    />
  );
};

// Display name for debugging
PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';

export default React.memo(PlayerTraitsContainer);
