import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

/**
 * Known-person constellation. A node is an NPC the player has actually discovered.
 * Its connections are only visible Memories, recorded dialogue and player-known
 * relationship-derived Traits. No NPC position or invented social graph is inferred.
 */
export interface KnownRelationshipNode {
  npcId: string;
  name: string;
  visibleMemoryCount: number;
  recordedDialogueCount: number;
  latestMemoryTitle: string | null;
  traitPatterns: Array<{
    id: string;
    name: string;
    assimilated: boolean;
    expressed: boolean;
  }>;
}

export const selectKnownRelationshipConstellation = createSelector(
  [
    (state: RootState) => state.npcs.discoveredNPCs,
    (state: RootState) => state.npcs.npcs,
    (state: RootState) => state.relationships.memoriesById,
    (state: RootState) => state.relationships.experiencesById,
    (state: RootState) => state.traits.traits,
    (state: RootState) => state.traits.discoveredTraits,
    (state: RootState) => state.player.permanentTraits,
    (state: RootState) => state.player.traitSlots,
  ],
  (discoveredIds, npcs, memoriesById, experiencesById, traits, discoveredTraitIds, assimilatedIds, traitSlots): KnownRelationshipNode[] => {
    const visibleMemories = Object.values(memoriesById).filter(memory => memory.playerVisible);
    const recordedDialogue = Object.values(experiencesById).filter(experience => experience.sourceType === 'dialogue');
    const knownTraitIds = new Set([...discoveredTraitIds, ...assimilatedIds]);
    const ownedIds = new Set(assimilatedIds);
    const expressedIds = new Set(traitSlots.filter(slot => !slot.isLocked).map(slot => slot.traitId));
    return Array.from(new Set(discoveredIds))
      .filter(npcId => Boolean(npcs[npcId]))
      .map(npcId => {
        const personalMemories = visibleMemories
          .filter(memory => memory.primaryTargetId === npcId)
          .sort((a, b) => b.timestamp - a.timestamp);
        const traitPatterns = Object.values(traits)
          .filter(trait => {
            const sourceNpcId = trait.sourceNpc ?? (trait.source && npcs[trait.source] ? trait.source : undefined);
            return sourceNpcId === npcId && knownTraitIds.has(trait.id);
          })
          .map(trait => ({
            id: trait.id,
            name: trait.name,
            assimilated: ownedIds.has(trait.id),
            expressed: expressedIds.has(trait.id),
          }));
        return {
          npcId,
          name: npcs[npcId].name,
          visibleMemoryCount: personalMemories.length,
          recordedDialogueCount: recordedDialogue.filter(experience => experience.primaryTargetId === npcId).length,
          latestMemoryTitle: personalMemories[0]?.title ?? null,
          traitPatterns,
        };
      });
  }
);
