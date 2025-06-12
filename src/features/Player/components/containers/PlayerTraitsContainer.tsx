/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { Trait, TraitSlot } from '../../../Traits/state/TraitsTypes';

// FIXED: Importing Trait-specific selectors from the Traits feature
import {
  selectAllTraits,
  selectTraitLoading,
  selectTraitError,
} from '../../../Traits/state/TraitsSelectors';

// FIXED: Importing Player-specific selectors from the Player feature
import {
  selectPermanentTraits,
  selectMaxTraitSlots,
  selectPlayerTraitSlots, // Use the correct selector for slots
  selectEquippedTraits,     // Use the correct selector for equipped objects
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

  // Use proper selectors from their correct locations
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const maxTraitSlots = useAppSelector(selectMaxTraitSlots);
  const allTraits = useAppSelector(selectAllTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);

  // Get available traits (all known traits that aren't equipped or permanent)
  const availableTraits = useMemo(() => {
    const equippedIds = equippedTraits.map(t => t.id);
    const permanentIds = permanentTraitIds;
    const allAcquiredTraits = Object.values(allTraits); // Assuming all traits in store are "acquired" for this context
    return allAcquiredTraits.filter(trait => !equippedIds.includes(trait.id) && !permanentIds.includes(trait.id));
  }, [allTraits, equippedTraits, permanentTraitIds]);


  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
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