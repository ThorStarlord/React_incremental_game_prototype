/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for NPC state management with performance optimization
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, NPCState } from './NPCTypes';
import type { Trait } from '../../Traits/state/TraitsTypes'; // FIXED: Importing Trait from the correct location
import { selectTraits } from '../../Traits/state/TraitsSelectors';

// Base selectors
export const selectNPCState = (state: RootState): NPCState => state.npcs;

export const selectNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.npcs
);

export const selectAllNPCs = selectNPCs; // Alias

// ... other selectors from your file should be here ...

export const selectNPCById = createSelector(
  [selectNPCs, (state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId] || null
);

// FIXED: This selector now correctly gets its dependencies
export const selectNPCSharedTraits = createSelector(
  [selectNPCById, selectTraits], // Depends on a local selector and one from Traits
  (npc, allTraits) => {
    if (!npc || !npc.sharedTraitSlots) {
      return [];
    }
    return npc.sharedTraitSlots
      .map(slot => slot.traitId ? allTraits[slot.traitId] : null)
      .filter((trait): trait is Trait => !!trait);
  }
);

// ... (The rest of your selectors from the file)
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

export const selectSelectedNPCId = createSelector(
  [selectNPCState],
  (npcState) => npcState.selectedNPCId
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