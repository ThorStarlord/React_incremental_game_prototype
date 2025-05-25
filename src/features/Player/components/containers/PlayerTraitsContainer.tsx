/**
 * @file PlayerTraitsContainer.tsx
 * @description Container component connecting PlayerTraitsUI to trait state
 */

import React, { useCallback } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectEquippedTraits, selectPermanentTraits } from '../../../Traits/state/TraitsSelectors';
import { PlayerTraitsUI } from '../ui/PlayerTraitsUI';

/**
 * Container component that connects PlayerTraitsUI to Redux state
 */
export const PlayerTraitsContainer: React.FC = React.memo(() => {
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraits = useAppSelector(selectPermanentTraits);
  
  // Mock data for slots - this would come from player state in real implementation
  const availableSlots = 6; // This should come from player progression
  const usedSlots = equippedTraits.length;

  const handleManageTraits = useCallback(() => {
    // This would navigate to trait management or open a modal
    console.log('Navigate to trait management');
  }, []);

  return (
    <PlayerTraitsUI
      equippedTraits={equippedTraits}
      permanentTraits={permanentTraits}
      availableSlots={availableSlots}
      usedSlots={usedSlots}
      onManageTraits={handleManageTraits}
    />
  );
});

PlayerTraitsContainer.displayName = 'PlayerTraitsContainer';

export default PlayerTraitsContainer;
