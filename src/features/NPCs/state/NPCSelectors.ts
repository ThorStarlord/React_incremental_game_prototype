/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for NPC state management with performance optimization
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPCState } from './NPCTypes';
import type { Trait } from '../../Traits/state/TraitsTypes';
import { selectTraits } from '../../Traits/state/TraitsSelectors';
import { selectAllQuests } from '../../Quest/state/QuestSelectors';
import { evaluateDialogueAvailabilityPresentation } from './DialogueAvailabilityPresentation';
import type { DialogueNode } from './NPCTypes';
import { selectActiveDoctrineIds } from '../../Traits/state/DoctrineSelectors';

const EMPTY_QUESTS = [] as const;
const EMPTY_DIALOGUE_CHOICES: readonly NPCDialogueChoice[] = [];

export interface NPCDialogueChoice {
  id: string;
  title: string;
  responses: Array<{ id: string; label: string }>;
  availabilityReasons: string[];
}

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

export const selectNPCAvailableQuestsById = createSelector(
  [selectNPCById, selectAllQuests],
  (npc, quests) => {
    if (!npc?.availableQuests || npc.availableQuests.length === 0) return EMPTY_QUESTS;
    return npc.availableQuests
      .map(questId => quests[questId])
      .filter(quest => quest !== undefined);
  }
);

/**
 * Deep NPC-facing projection for dialogue surfaces. Callers do not need to
 * know which domain owns prerequisite evidence; that composition is kept at
 * the NPC selector seam.
 */
export const selectAvailableNPCDialogueChoices = createSelector(
  [
    selectNPCById,
    (state: RootState) => state.npcs.dialogueNodes ?? {},
    (state: RootState) => state.relationships?.experiencesById ?? {},
    (state: RootState) => state.player.routineFamiliarity ?? {},
    (state: RootState, _npcId: string) => state.knowledge?.factIdsByNpcId ?? {},
    (state: RootState) => state.factions?.reputationByFactionId ?? {},
    (state: RootState) => state.worldState?.regions ?? {},
    (state: RootState) => state.player.permanentTraits,
    selectActiveDoctrineIds,
  ],
  (
    npc,
    dialogueNodes,
    recordedExperiences,
    routineFamiliarity,
    factIdsByNpcId,
    factionReputationByFactionId,
    worldStateRegions,
    permanentTraitIds,
    activeDoctrineIds,
  ): readonly NPCDialogueChoice[] => {
    if (!npc?.availableDialogues?.length) return EMPTY_DIALOGUE_CHOICES;

    const knownFactIds = factIdsByNpcId[npc.id] ?? [];
    return npc.availableDialogues
      .map(dialogueId => {
        const node = (dialogueNodes as Record<string, DialogueNode>)[dialogueId];
        if (!node) return null;

        const availability = evaluateDialogueAvailabilityPresentation(node, {
          completedDialogueIds: npc.completedDialogues ?? [],
          recordedExperiences,
          routineFamiliarity,
          knownFactIds,
          factionReputationByFactionId,
          worldStateRegions,
          permanentTraitIds,
          activeDoctrineIds,
        });
        if (!availability.available) return null;

        return {
          id: node.id,
          title: node.title || node.text || node.id,
          responses: Object.entries(node.responses || {}).map(([id, label]) => ({
            id,
            label: String(label),
          })),
          availabilityReasons: availability.availabilityReasons,
        };
      })
      .filter((choice): choice is NPCDialogueChoice => choice !== null);
  },
);
