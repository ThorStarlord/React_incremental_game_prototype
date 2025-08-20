/**
 * @file NPCListeners.ts
 * Listener middleware to keep NPC shared traits in sync with Player equipment/permanence.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { unequipTrait, equipTrait, addPermanentTrait } from '../../Player/state/PlayerSlice';
import { setNPCSharedTraitInSlot } from './NPCSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';

export const npcListeners = createListenerMiddleware<RootState>();

// Helper to unshare a specific traitId from all NPC shared slots; returns total cleared count
const unshareTraitFromAllNPCs = (traitId: string, api: any): number => {
  const state: RootState = api.getState();
  const npcs = state.npcs.npcs || {};
  let cleared = 0;
  for (const npc of Object.values(npcs)) {
    const slots = npc.sharedTraitSlots || [];
    for (const slot of slots) {
      if (slot.traitId === traitId) {
        api.dispatch(
          setNPCSharedTraitInSlot({ npcId: npc.id, slotIndex: slot.index, traitId: null })
        );
        cleared++;
      }
    }
  }
  return cleared;
};

// Unequip: clear that trait from all NPC slots
npcListeners.startListening({
  actionCreator: unequipTrait,
  effect: async (action, api) => {
    const originalState = api.getOriginalState() as RootState;
    const slotIndex = action.payload.slotIndex;
    const traitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!traitId) return;
    const cleared = unshareTraitFromAllNPCs(traitId, api);
    if (cleared > 0) {
      api.dispatch(
        addNotification({ type: 'info', message: `Unshared trait from ${cleared} NPC slot(s) due to unequip.` })
      );
    }
  },
});

// Equip: if replacing an old trait, clear the old one from NPC slots
npcListeners.startListening({
  actionCreator: equipTrait,
  effect: async (action, api) => {
    const originalState = api.getOriginalState() as RootState;
    const { slotIndex, traitId: newTraitId } = action.payload;
    const prevTraitId = originalState.player.traitSlots[slotIndex]?.traitId;
    if (!prevTraitId || prevTraitId === newTraitId) return;
    const cleared = unshareTraitFromAllNPCs(prevTraitId, api);
    if (cleared > 0) {
      api.dispatch(
        addNotification({ type: 'info', message: `Unshared replaced trait from ${cleared} NPC slot(s).` })
      );
    }
  },
});

// Permanence: clear trait from all NPC slots because it’s no longer shared
npcListeners.startListening({
  actionCreator: addPermanentTrait,
  effect: async (action, api) => {
    const traitId = action.payload as string;
    if (!traitId) return;
    const cleared = unshareTraitFromAllNPCs(traitId, api);
    if (cleared > 0) {
      api.dispatch(
        addNotification({ type: 'info', message: `Unshared trait from ${cleared} NPC slot(s) due to permanence.` })
      );
    }
  },
});

export default npcListeners;
