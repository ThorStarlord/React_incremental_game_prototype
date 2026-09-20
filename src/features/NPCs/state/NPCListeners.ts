/**
 * @file NPCListeners.ts
 * Listener middleware to keep NPC shared traits in sync with Player equipment/permanence.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { unequipTrait, equipTrait, addPermanentTrait } from '../../Player/state/PlayerSlice';
import { markDialogueCompleted, setNPCSharedTraitInSlot } from './NPCSlice';
import { recordRelationshipExperience } from '../../Relationships/state/RelationshipSlice';
import { unlockCampaignNpcsThunk } from './NPCThunks';
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


const GC03_CHAPTER_ONE_NPCS = [
  'npc_blacksmith_gronk',
  'npc_rogue_silas',
  'npc_captain_valerius',
] as const;
const GC03_CHAPTER_TWO_NPCS = ['npc_scholar_elara'] as const;
const GC03_CHAPTER_THREE_NPCS = ['npc_rival_lyra'] as const;

const GC03_FIRST_LESSON = 'willow_exp_first_lesson';
const GC03_CHAPTER_ONE_CONCLUSIONS = new Set([
  'valerius_m25_public_order_conclusion',
  'gronk_m25_quiet_network_conclusion',
]);
const GC03_ARCHIVE_CONCLUSION = 'elara_exp_independent_verification';

/**
 * Expand the visible Campaign One cast only when the prior authored unit has
 * produced its canonical completion evidence. These listeners unlock content;
 * they do not create chapter completion state.
 */
npcListeners.startListening({
  actionCreator: recordRelationshipExperience,
  effect: async (action, api) => {
    if (action.payload.id === GC03_FIRST_LESSON) {
      await api.dispatch(unlockCampaignNpcsThunk(GC03_CHAPTER_ONE_NPCS));
      return;
    }

    if (action.payload.id === GC03_ARCHIVE_CONCLUSION) {
      await api.dispatch(unlockCampaignNpcsThunk(GC03_CHAPTER_THREE_NPCS));
    }
  },
});

npcListeners.startListening({
  actionCreator: markDialogueCompleted,
  effect: async (action, api) => {
    if (!GC03_CHAPTER_ONE_CONCLUSIONS.has(action.payload.dialogueId)) return;
    await api.dispatch(unlockCampaignNpcsThunk(GC03_CHAPTER_TWO_NPCS));
  },
});
