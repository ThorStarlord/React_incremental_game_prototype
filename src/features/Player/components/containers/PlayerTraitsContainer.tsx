/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useCallback } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { PlayerTraitsContainerProps, TraitSlotData } from '../../state/PlayerTypes';
import type { Trait } from '../../../Traits/state/TraitsTypes';

// Mock selectors - replace with actual selectors when available
const selectEquippedTraits = (state: any): Trait[] => [
  {
    id: 'trait-1',
    name: 'Enhanced Strength',
    description: 'Increases physical damage by 15%',
    category: 'Combat',
    rarity: 'common',
    effects: { attack: 5 },
  },
  {
    id: 'trait-2',
    name: 'Quick Recovery',
    description: 'Increases health regeneration rate',
    category: 'Physical',
    rarity: 'rare',
    effects: { healthRegen: 2 },
  },
];

const selectPermanentTraits = (state: any): Trait[] => [
  {
    id: 'trait-3',
    name: 'Iron Will',
    description: 'Permanent resistance to mental effects',
    category: 'Mental',
    rarity: 'epic',
    effects: { mentalResistance: 25 },
  },
];

const selectTraitSlots = (state: any): TraitSlotData[] => [
  { id: 'slot-0', index: 0, isUnlocked: true, traitId: 'trait-1' },
  { id: 'slot-1', index: 1, isUnlocked: true, traitId: 'trait-2' },
  { id: 'slot-2', index: 2, isUnlocked: true, traitId: null },
  { id: 'slot-3', index: 3, isUnlocked: false, traitId: null },
  { id: 'slot-4', index: 4, isUnlocked: false, traitId: null },
  { id: 'slot-5', index: 5, isUnlocked: false, traitId: null },
];

export const PlayerTraitsContainer: React.FC<PlayerTraitsContainerProps> = React.memo(({
  showLoading = false,
  onTraitChange,
  className,
}) => {
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraits = useAppSelector(selectPermanentTraits);
  const slots = useAppSelector(selectTraitSlots);

  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    console.log('Equipping trait:', traitId, 'to slot:', slotIndex);
    onTraitChange?.('equip', traitId);
    // TODO: Dispatch actual equip action
  }, [onTraitChange]);

  const handleUnequipTrait = useCallback((slotId: string) => {
    console.log('Unequipping trait from slot:', slotId);
    const slot = slots.find(s => s.id === slotId);
    if (slot?.traitId) {
      onTraitChange?.('unequip', slot.traitId);
    }
    // TODO: Dispatch actual unequip action
  }, [slots, onTraitChange]);

  const handleMakePermanent = useCallback((traitId: string) => {
    console.log('Making trait permanent:', traitId);
    onTraitChange?.('permanent', traitId);
    // TODO: Dispatch actual make permanent action
  }, [onTraitChange]);

  return (
    <PlayerTraitsUI
      slots={slots}
      equippedTraits={equippedTraits}
      permanentTraits={permanentTraits}
      onEquipTrait={handleEquipTrait}
      onUnequipTrait={handleUnequipTrait}
      onMakePermanent={handleMakePermanent}
      showLoading={showLoading}
      className={className}
    />
  );
});

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';

export default PlayerTraitsContainer;
