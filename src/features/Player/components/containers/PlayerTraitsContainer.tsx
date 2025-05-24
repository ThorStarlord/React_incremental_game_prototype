import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { 
  selectTraitSlots,
  selectEquippedTraitObjects,
  selectAvailableTraitObjectsForEquip
} from '../../../Traits/state/TraitsSelectors';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';

/**
 * Container component for player traits management
 * 
 * Connects PlayerTraitsUI to Redux state and provides:
 * - Player trait slots from Traits state
 * - Currently equipped traits with full trait objects
 * - Available traits for equipping
 * - Integration with trait system actions
 * 
 * This container follows the Feature-Sliced Design pattern by:
 * - Using typed Redux hooks (useAppSelector)
 * - Cross-feature imports via barrel exports
 * - Separating data logic from UI presentation
 * - Providing efficient state subscriptions
 */
export const PlayerTraitsContainer: React.FC = React.memo(() => {
  const traitSlots = useAppSelector(selectTraitSlots);
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const availableTraits = useAppSelector(selectAvailableTraitObjectsForEquip);

  return (
    <PlayerTraitsUI 
      traitSlots={traitSlots}
      equippedTraits={equippedTraits}
      availableTraits={availableTraits}
    />
  );
});

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';

export default PlayerTraitsContainer;
