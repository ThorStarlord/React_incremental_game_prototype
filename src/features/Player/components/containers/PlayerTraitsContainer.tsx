/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';
import type { Trait } from '../../../Traits/state/TraitsTypes';
import { expressTrait, suppressTrait } from '../../state/PlayerSlice';

import {
    selectAllTraits,
    selectTraitLoading,
    selectTraitError,
    selectDiscoveredTraitObjects,
} from '../../../Traits/state/TraitsSelectors';

import {
  selectAssimilatedTraitIds,
  selectPlayerTraitSlots,
  selectExpressedTraits,
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
  const assimilatedTraitIds = useAppSelector(selectAssimilatedTraitIds);
  const equippedTraits = useAppSelector(selectExpressedTraits);
  const allTraits = useAppSelector(selectAllTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  const acquiredTraits = useAppSelector(selectDiscoveredTraitObjects);

  const assimilatedTraits = useMemo(() => {
    return assimilatedTraitIds.map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [assimilatedTraitIds, allTraits]);

  const availableTraits = useMemo(() => {
    const equippedIds = new Set(equippedTraits.map(t => t.id));
    const candidateIds = new Set([
      ...acquiredTraits.map(trait => trait.id),
      ...assimilatedTraitIds,
    ]);
    return Array.from(candidateIds)
      .map(id => allTraits[id])
      .filter((trait): trait is Trait => Boolean(trait))
      .filter(trait => !equippedIds.has(trait.id));
  }, [acquiredTraits, assimilatedTraitIds, equippedTraits, allTraits]);


  const handleEquipTrait = useCallback((traitId: string, slotIndex: number) => {
    if (slotIndex < 0) return;
    dispatch(expressTrait({ traitId, slotIndex }));
    onTraitChange?.(traitId);
  }, [dispatch, onTraitChange]);

  const handleUnequipTrait = useCallback((slotIndex: number) => {
    const slot = traitSlots.find(s => s.slotIndex === slotIndex);
    if (slot && slot.traitId) {
      dispatch(suppressTrait({ slotIndex }));
      onTraitChange?.(slot.traitId);
    }
  }, [dispatch, traitSlots, onTraitChange]);

  const handleTraitSelect = useCallback((traitId: string) => {
    onTraitChange?.(traitId);
  }, [onTraitChange]);

  return (
    <PlayerTraitsUI
      traitSlots={traitSlots}
      assimilatedTraits={assimilatedTraits}
      availableTraits={availableTraits}
      allTraits={allTraits}
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
