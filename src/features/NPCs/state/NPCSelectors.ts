/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for NPC state management with performance optimization
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, NPCState, NPCSharedTraitSlot } from './NPCTypes';
import { selectTraits } from '../../Traits/state/TraitsSelectors'; // We need this to get full trait objects
import { Trait } from '../../Traits/state/TraitsTypes';

// Base selectors
export const selectNPCState = (state: RootState): NPCState => state.npcs;

export const selectNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.npcs
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

export const selectSelectedNPCId = createSelector(
  [selectNPCState],
  (npcState) => npcState.selectedNPCId
);

export const selectInteractionHistory = createSelector(
  [selectDialogueHistory],
  (dialogueHistory) => dialogueHistory.map(entry => ({
    id: entry.id,
    npcId: entry.npcId,
    timestamp: entry.timestamp,
    type: 'dialogue' as const,
    content: `Player: ${entry.playerText}\nNPC: ${entry.npcResponse}`
  }))
);

// Parameterized selectors
export const selectNPCById = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId] || null
);

export const selectNPCRelationshipValue = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId]?.relationshipValue || 0
);

export const selectNPCsByLocation = createSelector(
  [selectNPCs],
  (npcs) => (location: string) => Object.values(npcs).filter(npc => npc.location === location)
);

export const selectNPCsByStatus = createSelector(
  [selectNPCs],
  (npcs) => (status: string) => Object.values(npcs).filter(npc => npc.status === status)
);

// Computed selectors
export const selectAllNPCs = createSelector(
  [selectNPCs],
  (npcs) => npcs
);

export const selectDiscoveredNPCsList = createSelector(
  [selectNPCs, selectDiscoveredNPCs],
  (npcs, discoveredIds) => discoveredIds.map(id => npcs[id]).filter(Boolean) as NPC[]
);

export const selectAvailableNPCs = createSelector(
  [selectDiscoveredNPCsList],
  (discoveredNPCs) => discoveredNPCs.filter(npc => npc.isAvailable)
);

export const selectOnlineNPCs = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.status === 'available' || npc.status === 'busy')
);

export const selectNPCDialogueHistory = createSelector(
  [selectDialogueHistory, (_state: RootState, npcId: string) => npcId],
  (dialogueHistory, npcId) =>
    dialogueHistory.filter(entry => entry.npcId === npcId)
);

export const selectNPCRelationshipHistory = createSelector(
  [selectRelationshipHistory, (_state: RootState, npcId: string) => npcId],
  (relationshipHistory, npcId) =>
    relationshipHistory.filter(entry => entry.npcId === npcId)
);

// --- START OF FIXES ---

// FIXED: This selector now correctly processes the `sharedTraitSlots` array
// to return full trait objects.
export const selectNPCSharedTraits = createSelector(
  [selectNPCById, selectTraits],
  (npc, allTraits) => {
    if (!npc || !npc.sharedTraitSlots) {
      return [];
    }
    return npc.sharedTraitSlots
      .map(slot => slot.traitId ? allTraits[slot.traitId] : null)
      .filter(Boolean) as Trait[];
  }
);

// FIXED: This selector now correctly gets IDs from the `sharedTraitSlots` array.
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

// FIXED: This selector now correctly checks the `sharedTraitSlots` array.
export const selectNPCsWithSharedTraits = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc =>
    npc.sharedTraitSlots && npc.sharedTraitSlots.some(slot => !!slot.traitId)
  )
);

// --- END OF FIXES ---

// Utility selectors
export const selectNPCLocations = createSelector(
  [selectAllNPCs],
  (npcs) => Array.from(new Set(Object.values(npcs).map(npc => npc.location)))
);

export const selectNPCStatistics = createSelector(
  [selectNPCs, selectDiscoveredNPCs],
  (npcs, discoveredIds) => {
    const allNPCsArray = Object.values(npcs);
    const discoveredNPCs = discoveredIds.map(id => npcs[id]).filter(Boolean) as NPC[];

    return {
      totalNPCs: allNPCsArray.length,
      discoveredCount: discoveredNPCs.length,
      availableCount: discoveredNPCs.filter(npc => npc.isAvailable).length,
      onlineCount: discoveredNPCs.filter(npc => npc.status === 'available' || npc.status === 'busy').length,
      averageRelationship: discoveredNPCs.length > 0
        ? discoveredNPCs.reduce((sum, npc) => sum + npc.relationshipValue, 0) / discoveredNPCs.length
        : 0,
      maxRelationship: discoveredNPCs.length > 0
        ? Math.max(...discoveredNPCs.map(npc => npc.relationshipValue))
        : 0,
      highRelationshipCount: discoveredNPCs.filter(npc => npc.relationshipValue >= 25).length
    };
  }
);