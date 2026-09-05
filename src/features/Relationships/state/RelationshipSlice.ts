import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  BondProfile,
  InitializeBondProfilePayload,
  LegacyBondProfileMigrationPayload,
  RelationshipDimensionKey,
  RelationshipExperience,
  RelationshipMemory,
  RelationshipProgressionDefinition,
  RelationshipState,
  RelationshipStability,
  RelationshipTetherState,
} from './RelationshipTypes';
import {
  createDefaultBondProfile,
  createDefaultTraitAssimilationState,
  traitAssimilationKey,
} from './RelationshipTypes';

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
  progressionByNpc: {},
  traitAssimilationByKey: {},
});

export const initialRelationshipState: RelationshipState = createInitialState();

const ensureM4Collections = (state: RelationshipState) => {
  if (!state.progressionByNpc) state.progressionByNpc = {};
  if (!state.traitAssimilationByKey) state.traitAssimilationByKey = {};
};

const ensureBondProfile = (state: RelationshipState, npcId: string): BondProfile => {
  if (!state.bondProfilesByNpc[npcId]) {
    state.bondProfilesByNpc[npcId] = createDefaultBondProfile(npcId);
  }

  const profile = state.bondProfilesByNpc[npcId];
  const defaults = createDefaultBondProfile(npcId);

  if (!profile.dimensions.custom) profile.dimensions.custom = {};
  if (!profile.connectionQualificationEvidence) profile.connectionQualificationEvidence = {};
  if (!profile.bondArchetypes) profile.bondArchetypes = [];
  if (!profile.activeMemoryIds) profile.activeMemoryIds = [];
  if (!profile.unresolvedTensions) profile.unresolvedTensions = [];
  if (!profile.recentExperienceIds) profile.recentExperienceIds = [];
  if (!profile.tetherState) profile.tetherState = defaults.tetherState;
  if (!profile.provenance) profile.provenance = { legacyDerived: false };

  return profile;
};

const deriveStability = (profile: BondProfile): RelationshipStability => {
  const { affinity, trust, sharedMeaning, reciprocity } = profile.dimensions;
  if (trust <= 5 && affinity <= -60) return 'ruptured';
  if (affinity <= -35 || trust <= 15) return 'contested';
  if (affinity < 0 || trust < 30) return 'strained';
  if (trust >= 70 && sharedMeaning >= 60 && reciprocity >= 50) return 'reinforced';
  return 'stable';
};

const deriveResonanceQuality = (profile: BondProfile): number => {
  const { trust, understanding, sharedMeaning, reciprocity } = profile.dimensions;
  const dimensionScore = (trust + understanding + sharedMeaning + reciprocity) / 4;
  const memoryEvidenceBonus = Math.min(10, profile.activeMemoryIds.length * 5);
  return clamp(Math.round(dimensionScore + memoryEvidenceBonus), 0, 100);
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

    registerRelationshipProgressionDefinitions: (
      state,
      action: PayloadAction<Record<string, RelationshipProgressionDefinition>>
    ) => {
      ensureM4Collections(state);
      state.progressionByNpc = {
        ...state.progressionByNpc,
        ...action.payload,
      };
    },

    initializeBondProfile: (
      state,
      action: PayloadAction<InitializeBondProfilePayload>
    ) => {
      ensureM4Collections(state);
      const { npcId } = action.payload;
      state.bondProfilesByNpc[npcId] = createDefaultBondProfile(npcId, action.payload);
      recalculateDerivedProfile(state.bondProfilesByNpc[npcId]);
    },

    migrateLegacyBondProfile: (
      state,
      action: PayloadAction<LegacyBondProfileMigrationPayload>
    ) => {
      ensureM4Collections(state);
      const {
        npcId,
        affinity,
        legacyConnectionDepth,
        mappedConnectionLevel,
        tetherState,
      } = action.payload;

      // A real modern profile is authoritative. Migration is only allowed to fill
      // an absent Relationship representation; it must never rewrite authored
      // Experience/Memory history or a profile already built from that history.
      if (state.bondProfilesByNpc[npcId]) return;

      const profile = createDefaultBondProfile(npcId, {
        dimensions: { affinity: clamp(affinity, -100, 100) },
        connectionLevel: clamp(Math.floor(mappedConnectionLevel), 0, 10),
        connectionProgress: 0,
        tetherState: tetherState ?? 'present',
        provenance: {
          legacyDerived: true,
          legacyConnectionDepth: Math.max(0, legacyConnectionDepth),
        },
      });

      // Intentionally leave Experience, Memory, qualification evidence, and all
      // semantic dimensions except Affinity empty/neutral. Preserving a level is
      // compatibility; it is not permission to fabricate why that level existed.
      recalculateDerivedProfile(profile);
      state.bondProfilesByNpc[npcId] = profile;
    },

    recordRelationshipExperience: (
      state,
      action: PayloadAction<RelationshipExperience>
    ) => {
      ensureM4Collections(state);
      const experience = action.payload;

      if (state.experiencesById[experience.id]) return;
      if (experience.uniqueKey && state.appliedUniqueKeys[experience.uniqueKey]) return;

      state.experiencesById[experience.id] = experience;
      const npcExperienceIds = state.experienceIdsByNpc[experience.primaryTargetId] ?? [];
      npcExperienceIds.push(experience.id);
      state.experienceIdsByNpc[experience.primaryTargetId] = npcExperienceIds;

      if (experience.uniqueKey) state.appliedUniqueKeys[experience.uniqueKey] = true;

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

      if (experience.traitEffects) {
        for (const traitEffect of experience.traitEffects) {
          const key = traitAssimilationKey(experience.primaryTargetId, traitEffect.traitId);
          const assimilation =
            state.traitAssimilationByKey[key] ??
            createDefaultTraitAssimilationState(experience.primaryTargetId, traitEffect.traitId);

          if (typeof traitEffect.compatibilityDelta === 'number') {
            assimilation.compatibility = clamp(
              assimilation.compatibility + traitEffect.compatibilityDelta,
              0,
              100
            );
          }
          if (typeof traitEffect.assimilationDelta === 'number') {
            assimilation.progress = clamp(
              assimilation.progress + traitEffect.assimilationDelta,
              0,
              100
            );
          }
          assimilation.lastUpdatedAt = experience.timestamp;
          state.traitAssimilationByKey[key] = assimilation;
        }
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
      ensureM4Collections(state);
      const memory = action.payload;

      if (state.memoriesById[memory.id]) return;
      if (!state.experiencesById[memory.originExperienceId]) return;

      state.memoriesById[memory.id] = memory;
      const npcMemoryIds = state.memoryIdsByNpc[memory.primaryTargetId] ?? [];
      npcMemoryIds.push(memory.id);
      state.memoryIdsByNpc[memory.primaryTargetId] = npcMemoryIds;

      const profile = ensureBondProfile(state, memory.primaryTargetId);
      if (!profile.activeMemoryIds.includes(memory.id)) profile.activeMemoryIds.push(memory.id);
      if (memory.bondContribution && !profile.bondArchetypes.includes(memory.bondContribution)) {
        profile.bondArchetypes.push(memory.bondContribution);
      }

      for (const traitId of memory.traitRelevance ?? []) {
        const key = traitAssimilationKey(memory.primaryTargetId, traitId);
        const assimilation =
          state.traitAssimilationByKey[key] ??
          createDefaultTraitAssimilationState(memory.primaryTargetId, traitId);
        if (!assimilation.qualifyingMemoryIds.includes(memory.id)) {
          assimilation.qualifyingMemoryIds.push(memory.id);
        }
        assimilation.lastUpdatedAt = Math.max(assimilation.lastUpdatedAt, memory.timestamp);
        state.traitAssimilationByKey[key] = assimilation;
      }

      recalculateDerivedProfile(profile);
    },

    recordConnectionQualification: (
      state,
      action: PayloadAction<{ npcId: string; level: number; evidenceIds: string[] }>
    ) => {
      ensureM4Collections(state);
      const { npcId, level, evidenceIds } = action.payload;
      const profile = ensureBondProfile(state, npcId);
      const normalizedLevel = clamp(Math.floor(level), 0, 10);
      if (normalizedLevel <= profile.connectionLevel) return;
      profile.connectionLevel = normalizedLevel;
      profile.connectionQualificationEvidence[String(normalizedLevel)] = Array.from(
        new Set(evidenceIds)
      );
      recalculateDerivedProfile(profile);
    },

    setRelationshipTetherState: (
      state,
      action: PayloadAction<{ npcId: string; tetherState: RelationshipTetherState }>
    ) => {
      ensureM4Collections(state);
      const profile = ensureBondProfile(state, action.payload.npcId);
      profile.tetherState = action.payload.tetherState;
      recalculateDerivedProfile(profile);
    },

    setShadowConnectionLevel: (
      state,
      action: PayloadAction<{ npcId: string; level: number }>
    ) => {
      ensureM4Collections(state);
      const profile = ensureBondProfile(state, action.payload.npcId);
      profile.connectionLevel = clamp(Math.floor(action.payload.level), 0, 10);
      recalculateDerivedProfile(profile);
    },
  },
});

export const {
  resetRelationships,
  registerRelationshipProgressionDefinitions,
  initializeBondProfile,
  migrateLegacyBondProfile,
  recordRelationshipExperience,
  formRelationshipMemory,
  recordConnectionQualification,
  setRelationshipTetherState,
  setShadowConnectionLevel,
} = relationshipSlice.actions;

export const relationshipActions = relationshipSlice.actions;
export default relationshipSlice.reducer;
