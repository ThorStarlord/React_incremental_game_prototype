import type { RootState } from '../../../app/store';
import type { BondProfile, RelationshipMemory, RelationshipState } from './RelationshipTypes';
import { createDefaultBondProfile } from './RelationshipTypes';
import { initialRelationshipState } from './RelationshipSlice';

/**
 * Old imported saves may temporarily lack the additive relationship slice.
 * Keep selectors defensive until save migration is formalized.
 */
export const selectRelationshipState = (state: RootState): RelationshipState =>
  (state as RootState & { relationships?: RelationshipState }).relationships ?? initialRelationshipState;

export const selectRelationshipShadowMode = (state: RootState) =>
  selectRelationshipState(state).shadowMode;

export const selectBondProfiles = (state: RootState) =>
  selectRelationshipState(state).bondProfilesByNpc;

export const selectBondProfileByNpcId = (
  state: RootState,
  npcId: string
): BondProfile =>
  selectRelationshipState(state).bondProfilesByNpc[npcId] ?? createDefaultBondProfile(npcId);

export const selectRelationshipExperiencesByNpcId = (state: RootState, npcId: string) => {
  const relationships = selectRelationshipState(state);
  return (relationships.experienceIdsByNpc[npcId] ?? [])
    .map(id => relationships.experiencesById[id])
    .filter(Boolean);
};

export const selectRelationshipExperienceById = (state: RootState, experienceId: string) =>
  selectRelationshipState(state).experiencesById[experienceId];

export const selectRelationshipMemoriesByNpcId = (state: RootState, npcId: string) => {
  const relationships = selectRelationshipState(state);
  return (relationships.memoryIdsByNpc[npcId] ?? [])
    .map(id => relationships.memoriesById[id])
    .filter(Boolean);
};

export const selectVisibleRelationshipMemoriesByNpcId = (
  state: RootState,
  npcId: string
): RelationshipMemory[] =>
  selectRelationshipMemoriesByNpcId(state, npcId).filter(memory => memory.playerVisible);

export const selectRelationshipMemoryById = (state: RootState, memoryId: string) =>
  selectRelationshipState(state).memoriesById[memoryId];

export const selectRelationshipMemoriesByResonanceTag = (
  state: RootState,
  npcId: string,
  tag: string
) =>
  selectRelationshipMemoriesByNpcId(state, npcId).filter(memory =>
    memory.resonanceTags.includes(tag)
  );

export const selectTraitRelevantMemories = (
  state: RootState,
  npcId: string,
  traitId: string
) =>
  selectRelationshipMemoriesByNpcId(state, npcId).filter(memory =>
    memory.traitRelevance?.includes(traitId)
  );

export const selectHasAppliedRelationshipUniqueKey = (
  state: RootState,
  uniqueKey: string
) => Boolean(selectRelationshipState(state).appliedUniqueKeys[uniqueKey]);
