/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for NPC state management with performance optimization
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, NPCState } from './NPCTypes';
import type { Trait } from '../../Traits/state/TraitsTypes';
import { selectTraits } from '../../Traits/state/TraitsSelectors';

// Base selectors
export const selectNPCState = (state: RootState): NPCState => state.npcs;

export const selectNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.npcs
);

export const selectAllNPCs = selectNPCs; // Alias

export const selectNPCById = createSelector(
  [selectNPCs, (state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId] || null
);

export const selectNPCSharedTraits = createSelector(
  [selectNPCById, selectTraits],
  (npc, allTraits) => {
    if (!npc || !npc.sharedTraitSlots) {
      return [];
    }
    return npc.sharedTraitSlots
      .map(slot => slot.traitId ? allTraits[slot.traitId] : null)
      .filter((trait): trait is Trait => !!trait);
  }
);

export const selectDiscoveredNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.discoveredNPCs
);

export const selectNPCLoading = createSelector(
  [selectNPCState],
  (npcState) => npcState.loading
);

export const selectNPCError = createSelector(
  [selectNPCState],
  (npcState) => npcState.error
);

export const selectCurrentInteraction = createSelector(
  [selectNPCState],
  (npcState) => npcState.currentInteraction
);

export const selectDialogueHistory = createSelector(
  [selectNPCState],
  (npcState) => npcState.dialogueHistory || []
);

export const selectRelationshipHistory = createSelector(
  [selectNPCState],
  (npcState) => npcState.relationshipHistory || []
);

export const selectSelectedNPCId = (state: RootState) => state.npcs.selectedNPCId;

/**
 * NEW: Selects the full object for the currently selected NPC.
 * This is a memoized selector that will only recompute when the underlying data changes.
 */
export const selectCurrentNPC = createSelector(
  [selectAllNPCs, selectSelectedNPCId],
  (npcs, selectedId) => {
    if (!selectedId) {
      return undefined;
    }
    // Find the NPC in the array by its ID
    return Object.values(npcs).find(npc => npc.id === selectedId);
  }
);

export const selectNPCDialogueHistory = createSelector(
  [selectDialogueHistory, (_state: RootState, npcId: string) => npcId],
  (dialogueHistory, npcId) =>
    dialogueHistory.filter(entry => entry.npcId === npcId)
);

export const selectNPCSharedTraitIds = createSelector(
    [selectNPCById],
    (npc) => {
      if (!npc || !npc.sharedTraitSlots) {
        return [];
      }
      return npc.sharedTraitSlots
        .map(slot => slot.traitId)
        .filter(Boolean) as string[];
    }
);

export const selectNPCsWithSharedTraits = createSelector(
    [selectAllNPCs],
    (npcs) => Object.values(npcs).filter(npc =>
      npc.sharedTraitSlots && npc.sharedTraitSlots.some(slot => !!slot.traitId)
    )
);

// NEW SELECTOR
export const selectActiveConnectionCount = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.connectionDepth > 0).length
);