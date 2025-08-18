/**
 * @file CopyListeners.ts
 * @description Listener middleware to keep Copy shared traits in sync with Player equipment.
 * When the player unequips a trait, automatically unshare it from all Copies that have it shared.
 */

import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { unequipTrait, equipTrait } from '../../Player/state/PlayerSlice';
import { unshareTraitFromCopy } from './CopySlice';
import { addNotification } from '../../../shared/state/NotificationSlice';

// Create a dedicated listener middleware instance for the Copy feature cross-slice sync.
export const copyListeners = createListenerMiddleware<RootState>();

// When unequipping a trait, unshare it from all copies that had it
copyListeners.startListening({
  actionCreator: unequipTrait,
  effect: async (action, api) => {
    // Read the traitId being unequipped from the original state BEFORE the reducer cleared it
    const originalState = api.getOriginalState();
    const slotIndex = action.payload.slotIndex;
    const traitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!traitId) return; // nothing to do

    const stateAfter = api.getState();
    const copies = Object.values(stateAfter.copy.copies);
    let unsharedCount = 0;

    for (const copy of copies) {
      const slots = copy.traitSlots ?? [];
      for (const slot of slots) {
        if (slot.traitId === traitId) {
          api.dispatch(unshareTraitFromCopy({ copyId: copy.id, slotIndex: slot.slotIndex }));
          unsharedCount++;
        }
      }
    }

    if (unsharedCount > 0) {
      api.dispatch(addNotification({ type: 'info', message: `Unshared trait from ${unsharedCount} Copy slot(s) due to unequip.` }));
    }
  },
});

// When equipping a new trait into a slot that previously had a different one,
// unshare the replaced (old) trait from all copies.
copyListeners.startListening({
  actionCreator: equipTrait,
  effect: async (action, api) => {
    const originalState = api.getOriginalState();
    const { slotIndex, traitId: newTraitId } = action.payload;
    const prevTraitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!prevTraitId || prevTraitId === newTraitId) return;

    const stateAfter = api.getState();
    const copies = Object.values(stateAfter.copy.copies);
    let unsharedCount = 0;
    for (const copy of copies) {
      const slots = copy.traitSlots ?? [];
      for (const slot of slots) {
        if (slot.traitId === prevTraitId) {
          api.dispatch(unshareTraitFromCopy({ copyId: copy.id, slotIndex: slot.slotIndex }));
          unsharedCount++;
        }
      }
    }
    if (unsharedCount > 0) {
      api.dispatch(addNotification({ type: 'info', message: `Unshared replaced trait from ${unsharedCount} Copy slot(s).` }));
    }
  },
});

export default copyListeners;
