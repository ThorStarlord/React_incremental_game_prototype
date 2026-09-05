import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  BondProfile,
  InitializeBondProfilePayload,
  RelationshipDimensionKey,
  RelationshipExperience,
  RelationshipMemory,
  RelationshipState,
  RelationshipStability,
} from './RelationshipTypes';
import { createDefaultBondProfile } from './RelationshipTypes';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const createInitialState = (): RelationshipState => ({
  shadowMode: true,
  experiencesById: {},
  experienceIdsByNpc: {},
  memoriesById: {},
  memoryIdsByNpc: {},
  bondProfilesByNpc: {},
  appliedUniqueKeys: {},
});

export const initialRelationshipState: RelationshipState = createInitialState();

const ensureBondProfile = (state: RelationshipState, npcId: string): BondProfile => {
  if (!state.bondProfilesByNpc[npcId]) {
    state.bondProfilesByNpc[npcId] = createDefaultBondProfile(npcId);
  }
  return state.bondProfilesByNpc[npcId];
};

const deriveStability = (profile: BondProfile): RelationshipStability => {
  const { affinity, trust, sharedMeaning, reciprocity } = profile.dimensions;

  if (trust <= 5 && affinity <= -60) return 'ruptured';
  if (affinity <= -35 || trust <= 15) return 'contested';
  if (affinity < 0 || trust < 30) return 'strained';
  if (trust >= 70 && sharedMeaning >= 60 && reciprocity >= 50) return 'reinforced';
  return 'stable';
};

/**
 * Temporary shadow-mode heuristic. This is intentionally simple and explainable.
 * It is not the final Essence formula and must not become a hidden balancing law.
 */
const deriveResonanceQuality = (profile: BondProfile): number => {
  const { trust, understanding, sharedMeaning, reciprocity } = profile.dimensions;
  return Math.round((trust + understanding + sharedMeaning + reciprocity) / 4);
};

const recalculateDerivedProfile = (profile: BondProfile) => {
  profile.resonanceQuality = deriveResonanceQuality(profile);
  profile.stability = deriveStability(profile);
};

const applyDimensionDelta = (
  profile: BondProfile,
  key: RelationshipDimensionKey,
  delta: number
) => {
  if (key === 'affinity') {
    profile.dimensions.affinity = clamp(profile.dimensions.affinity + delta, -100, 100);
    return;
  }

  profile.dimensions[key] = clamp(profile.dimensions[key] + delta, 0, 100);
};

const relationshipSlice = createSlice({
  name: 'relationships',
  initialState: initialRelationshipState,
  reducers: {
    resetRelationships: () => createInitialState(),

    initializeBondProfile: (
      state,
      action: PayloadAction<InitializeBondProfilePayload>
    ) => {
      const { npcId } = action.payload;
      state.bondProfilesByNpc[npcId] = createDefaultBondProfile(npcId, action.payload);
      recalculateDerivedProfile(state.bondProfilesByNpc[npcId]);
    },

    recordRelationshipExperience: (
      state,
      action: PayloadAction<RelationshipExperience>
    ) => {
      const experience = action.payload;

      if (state.experiencesById[experience.id]) return;
      if (experience.uniqueKey && state.appliedUniqueKeys[experience.uniqueKey]) return;

      state.experiencesById[experience.id] = experience;
      const npcExperienceIds = state.experienceIdsByNpc[experience.primaryTargetId] ?? [];
      npcExperienceIds.push(experience.id);
      state.experienceIdsByNpc[experience.primaryTargetId] = npcExperienceIds;

      if (experience.uniqueKey) {
        state.appliedUniqueKeys[experience.uniqueKey] = true;
      }

      const profile = ensureBondProfile(state, experience.primaryTargetId);

      for (const [key, rawDelta] of Object.entries(experience.relationshipEffects)) {
        if (typeof rawDelta !== 'number') continue;
        applyDimensionDelta(profile, key as RelationshipDimensionKey, rawDelta);
      }

      if (experience.customEffects) {
        for (const [key, delta] of Object.entries(experience.customEffects)) {
          if (typeof delta !== 'number') continue;
          const current = profile.dimensions.custom[key] ?? 0;
          profile.dimensions.custom[key] = clamp(current + delta, 0, 100);
        }
      }

      if (typeof experience.connectionProgressDelta === 'number') {
        profile.connectionProgress = Math.max(
          0,
          profile.connectionProgress + experience.connectionProgressDelta
        );
      }

      profile.recentExperienceIds = [
        ...profile.recentExperienceIds.filter(id => id !== experience.id),
        experience.id,
      ].slice(-20);

      recalculateDerivedProfile(profile);
    },

    formRelationshipMemory: (
      state,
      action: PayloadAction<RelationshipMemory>
    ) => {
      const memory = action.payload;

      if (state.memoriesById[memory.id]) return;
      if (!state.experiencesById[memory.originExperienceId]) return;

      state.memoriesById[memory.id] = memory;
      const npcMemoryIds = state.memoryIdsByNpc[memory.primaryTargetId] ?? [];
      npcMemoryIds.push(memory.id);
      state.memoryIdsByNpc[memory.primaryTargetId] = npcMemoryIds;

      const profile = ensureBondProfile(state, memory.primaryTargetId);
      if (!profile.activeMemoryIds.includes(memory.id)) {
        profile.activeMemoryIds.push(memory.id);
      }
      if (
        memory.bondContribution &&
        !profile.bondArchetypes.includes(memory.bondContribution)
      ) {
        profile.bondArchetypes.push(memory.bondContribution);
      }

      recalculateDerivedProfile(profile);
    },

    setShadowConnectionLevel: (
      state,
      action: PayloadAction<{ npcId: string; level: number }>
    ) => {
      const profile = ensureBondProfile(state, action.payload.npcId);
      profile.connectionLevel = clamp(Math.floor(action.payload.level), 0, 10);
      recalculateDerivedProfile(profile);
    },
  },
});

export const {
  resetRelationships,
  initializeBondProfile,
  recordRelationshipExperience,
  formRelationshipMemory,
  setShadowConnectionLevel,
} = relationshipSlice.actions;

export const relationshipActions = relationshipSlice.actions;
export default relationshipSlice.reducer;
