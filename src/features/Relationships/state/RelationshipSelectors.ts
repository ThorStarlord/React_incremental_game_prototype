import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  areLocationsDirectlyConnected,
  resolveCanonicalLocationId,
} from '../../Exploration/LocationDefinitions';
import { getNpcWorldLocationId } from '../../NPCs/state/NPCWorldLocationDefinitions';
import type {
  BondProfile,
  ConnectionQualificationRule,
  RelationshipDimensionKey,
  RelationshipState,
  RelationshipStability,
  RelationshipTetherState,
  TraitAssimilationState,
} from './RelationshipTypes';
import {
  createDefaultBondProfile,
  createDefaultTraitAssimilationState,
  traitAssimilationKey,
} from './RelationshipTypes';
import { initialRelationshipState } from './RelationshipSlice';

/**
 * Old imported saves may temporarily lack the additive relationship slice or
 * fields introduced by later migration phases. Keep selectors defensive until
 * formal save migration lands.
 */
const selectRawRelationshipState = (
  state: RootState
): Partial<RelationshipState> | undefined =>
  (state as RootState & { relationships?: Partial<RelationshipState> }).relationships;

export const selectRelationshipState = createSelector(
  [selectRawRelationshipState],
  (raw): RelationshipState => {
    if (!raw) return initialRelationshipState;
    return {
      ...initialRelationshipState,
      ...raw,
      experiencesById: raw.experiencesById ?? {},
      experienceIdsByNpc: raw.experienceIdsByNpc ?? {},
      memoriesById: raw.memoriesById ?? {},
      memoryIdsByNpc: raw.memoryIdsByNpc ?? {},
      bondProfilesByNpc: raw.bondProfilesByNpc ?? {},
      appliedUniqueKeys: raw.appliedUniqueKeys ?? {},
      progressionByNpc: raw.progressionByNpc ?? {},
      traitAssimilationByKey: raw.traitAssimilationByKey ?? {},
    };
  }
);

export const selectRelationshipShadowMode = createSelector(
  [selectRelationshipState],
  relationships => relationships.shadowMode
);

export const selectBondProfiles = createSelector(
  [selectRelationshipState],
  relationships => relationships.bondProfilesByNpc
);

export const selectBondProfileByNpcId = createSelector(
  [selectRelationshipState, (_state: RootState, npcId: string) => npcId],
  (relationships, npcId): BondProfile => {
    const existing = relationships.bondProfilesByNpc[npcId];
    const defaults = createDefaultBondProfile(npcId);
    if (!existing) return defaults;

    return {
      ...defaults,
      ...existing,
      dimensions: {
        ...defaults.dimensions,
        ...(existing.dimensions ?? {}),
        custom: {
          ...defaults.dimensions.custom,
          ...(existing.dimensions?.custom ?? {}),
        },
      },
      connectionQualificationEvidence:
        existing.connectionQualificationEvidence ?? {},
      bondArchetypes: existing.bondArchetypes ?? [],
      activeMemoryIds: existing.activeMemoryIds ?? [],
      unresolvedTensions: existing.unresolvedTensions ?? [],
      recentExperienceIds: existing.recentExperienceIds ?? [],
      tetherState: existing.tetherState ?? defaults.tetherState,
    };
  }
);

export const selectRelationshipProgressionDefinition = createSelector(
  [selectRelationshipState, (_state: RootState, npcId: string) => npcId],
  (relationships, npcId) => relationships.progressionByNpc[npcId]
);

export const selectUsesRelationshipConnectionAuthority = (state: RootState, npcId: string) =>
  selectRelationshipProgressionDefinition(state, npcId)?.connectionAuthority === 'relationships';

export const selectRelationshipExperiencesByNpcId = createSelector(
  [selectRelationshipState, (_state: RootState, npcId: string) => npcId],
  (relationships, npcId) =>
    (relationships.experienceIdsByNpc[npcId] ?? [])
      .map(id => relationships.experiencesById[id])
      .filter(Boolean)
);

export const selectRelationshipExperienceById = (state: RootState, experienceId: string) =>
  selectRelationshipState(state).experiencesById[experienceId];

export const selectRelationshipMemoriesByNpcId = createSelector(
  [selectRelationshipState, (_state: RootState, npcId: string) => npcId],
  (relationships, npcId) =>
    (relationships.memoryIdsByNpc[npcId] ?? [])
      .map(id => relationships.memoriesById[id])
      .filter(Boolean)
);

export const selectVisibleRelationshipMemoriesByNpcId = createSelector(
  [selectRelationshipMemoriesByNpcId],
  memories => memories.filter(memory => memory.playerVisible)
);

export const selectRelationshipMemoryById = (state: RootState, memoryId: string) =>
  selectRelationshipState(state).memoriesById[memoryId];

export const selectRelationshipMemoriesByResonanceTag = createSelector(
  [
    selectRelationshipMemoriesByNpcId,
    (_state: RootState, _npcId: string, tag: string) => tag,
  ],
  (memories, tag) => memories.filter(memory => memory.resonanceTags.includes(tag))
);

export const selectTraitRelevantMemories = createSelector(
  [
    selectRelationshipMemoriesByNpcId,
    (_state: RootState, _npcId: string, traitId: string) => traitId,
  ],
  (memories, traitId) => memories.filter(memory => memory.traitRelevance?.includes(traitId))
);

export const selectHasAppliedRelationshipUniqueKey = (
  state: RootState,
  uniqueKey: string
) => Boolean(selectRelationshipState(state).appliedUniqueKeys[uniqueKey]);

export const selectTraitAssimilationState = createSelector(
  [
    selectRelationshipState,
    (_state: RootState, sourceNpcId: string) => sourceNpcId,
    (_state: RootState, _sourceNpcId: string, traitId: string) => traitId,
  ],
  (relationships, sourceNpcId, traitId): TraitAssimilationState => {
    const existing = relationships.traitAssimilationByKey[
      traitAssimilationKey(sourceNpcId, traitId)
    ];
    return existing ?? createDefaultTraitAssimilationState(sourceNpcId, traitId);
  }
);

export interface ConnectionQualificationCheck {
  passed: boolean;
  evidenceIds: string[];
  missing: string[];
}

export const checkConnectionQualificationRule = (
  state: RootState,
  npcId: string,
  rule: ConnectionQualificationRule
): ConnectionQualificationCheck => {
  const profile = selectBondProfileByNpcId(state, npcId);
  const experiences = selectRelationshipExperiencesByNpcId(state, npcId);
  const memories = selectRelationshipMemoriesByNpcId(state, npcId);
  const experienceIds = new Set(experiences.map(experience => experience.id));
  const memoryIds = new Set(memories.map(memory => memory.id));
  const evidenceIds: string[] = [];
  const missing: string[] = [];

  if (profile.connectionProgress < rule.minimumProgress) {
    missing.push(`Connection Progress ${rule.minimumProgress}`);
  }

  if (
    typeof rule.minimumExperienceCount === 'number' &&
    experiences.filter(experience => experience.significance !== 'minor').length <
      rule.minimumExperienceCount
  ) {
    missing.push(`${rule.minimumExperienceCount} meaningful Experiences`);
  }

  for (const id of rule.requiredExperienceIds ?? []) {
    if (experienceIds.has(id)) evidenceIds.push(id);
    else missing.push(`Experience ${id}`);
  }

  if (rule.anyOfExperienceIds && rule.anyOfExperienceIds.length > 0) {
    const matched = rule.anyOfExperienceIds.find(id => experienceIds.has(id));
    if (matched) evidenceIds.push(matched);
    else missing.push(`one of Experiences: ${rule.anyOfExperienceIds.join(', ')}`);
  }

  for (const id of rule.requiredMemoryIds ?? []) {
    if (memoryIds.has(id)) evidenceIds.push(id);
    else missing.push(`Memory ${id}`);
  }

  for (const tag of rule.requiredMemoryTags ?? []) {
    const matched = memories.find(memory => memory.resonanceTags.includes(tag));
    if (matched) evidenceIds.push(matched.id);
    else missing.push(`Memory tag ${tag}`);
  }

  for (const [key, minimum] of Object.entries(rule.minimumDimensions ?? {})) {
    if (typeof minimum !== 'number') continue;
    const current = profile.dimensions[key as RelationshipDimensionKey] ?? 0;
    if (current < minimum) {
      missing.push(`${key} ${minimum}`);
    }
  }

  return {
    passed: missing.length === 0,
    evidenceIds: Array.from(new Set(evidenceIds)),
    missing,
  };
};

const CONNECTION_BASE_RATES = [0, 0.05, 0.1, 0.18, 0.28, 0.42, 0.6, 0.85, 1.15, 1.55, 2.1];

const TETHER_MULTIPLIERS: Record<RelationshipTetherState, number> = {
  absent: 0.2,
  remote: 0.4,
  nearby: 0.75,
  present: 1,
  engaged: 1.25,
  deeplyEngaged: 1.5,
};

const STABILITY_MULTIPLIERS: Record<RelationshipStability, number> = {
  ruptured: 0.25,
  contested: 0.65,
  strained: 0.85,
  stable: 1,
  reinforced: 1.1,
};

const qualityBand = (quality: number) => {
  if (quality >= 85) return { label: 'Exceptional', multiplier: 2 };
  if (quality >= 70) return { label: 'Deep', multiplier: 1.5 };
  if (quality >= 50) return { label: 'Strong', multiplier: 1.25 };
  if (quality >= 25) return { label: 'Stable', multiplier: 1 };
  return { label: 'Weak', multiplier: 0.6 };
};

export type RelationshipTetherSource = 'authored' | 'spatial';

export interface EffectiveRelationshipTether {
  tetherState: RelationshipTetherState;
  source: RelationshipTetherSource;
  playerLocationId?: string;
  npcLocationId?: string;
}

/**
 * Pure M19 spatial projection for a qualified anchored NPC at an arbitrary
 * Player location. Undefined means no qualified spatial projection is available
 * and callers should preserve their authored/static fallback semantics.
 */
export const deriveSpatialRelationshipTether = (
  npcId: string,
  playerLocationValue: string
): EffectiveRelationshipTether | undefined => {
  const npcAnchor = getNpcWorldLocationId(npcId);
  if (!npcAnchor) return undefined;

  const playerLocationId = resolveCanonicalLocationId(playerLocationValue);
  const npcLocationId = resolveCanonicalLocationId(npcAnchor);
  if (!playerLocationId || !npcLocationId) return undefined;

  if (playerLocationId === npcLocationId) {
    return { tetherState: 'present', source: 'spatial', playerLocationId, npcLocationId };
  }

  if (areLocationsDirectlyConnected(playerLocationId, npcLocationId)) {
    return { tetherState: 'nearby', source: 'spatial', playerLocationId, npcLocationId };
  }

  return { tetherState: 'remote', source: 'spatial', playerLocationId, npcLocationId };
};

/**
 * M19 spatial presence is a current-world projection, not Relationship history.
 * When either side lacks a canonical M18 location, preserve the authored/static
 * BondProfile tether rather than guessing a world position.
 */
export const selectEffectiveRelationshipTether = createSelector(
  [
    selectBondProfileByNpcId,
    (state: RootState, _npcId: string) => state.player.location,
    (_state: RootState, npcId: string) => npcId,
  ],
  (profile, playerLocation, npcId): EffectiveRelationshipTether => {
    const authoredFallback: EffectiveRelationshipTether = {
      tetherState: profile.tetherState,
      source: 'authored',
    };

    return deriveSpatialRelationshipTether(npcId, playerLocation) ?? authoredFallback;
  }
);

export interface RelationshipEssenceContribution {
  npcId: string;
  enabled: boolean;
  baseRate: number;
  qualityBand: string;
  qualityMultiplier: number;
  tetherState: RelationshipTetherState;
  tetherSource: RelationshipTetherSource;
  tetherMultiplier: number;
  stabilityMultiplier: number;
  effectiveRate: number;
  explanation: string[];
}

export const selectRelationshipEssenceContributionByNpcId = createSelector(
  [
    selectRelationshipProgressionDefinition,
    selectBondProfileByNpcId,
    selectEffectiveRelationshipTether,
    (_state: RootState, npcId: string) => npcId,
  ],
  (config, profile, effectiveTether, npcId): RelationshipEssenceContribution => {
    const enabled = Boolean(
      config?.connectionAuthority === 'relationships' && config.essence?.enabled
    );
    const baseRate = CONNECTION_BASE_RATES[Math.max(0, Math.min(10, profile.connectionLevel))] ?? 0;
    const quality = qualityBand(profile.resonanceQuality);
    const tetherMultiplier = TETHER_MULTIPLIERS[effectiveTether.tetherState] ?? 1;
    const stabilityMultiplier = STABILITY_MULTIPLIERS[profile.stability] ?? 1;
    const effectiveRate = enabled
      ? baseRate * quality.multiplier * tetherMultiplier * stabilityMultiplier
      : 0;

    return {
      npcId,
      enabled,
      baseRate,
      qualityBand: quality.label,
      qualityMultiplier: quality.multiplier,
      tetherState: effectiveTether.tetherState,
      tetherSource: effectiveTether.source,
      tetherMultiplier,
      stabilityMultiplier,
      effectiveRate,
      explanation: enabled
        ? [
            `Connection L${profile.connectionLevel} base: ${baseRate.toFixed(2)}/sec`,
            `Resonance Quality ${quality.label}: ${quality.multiplier.toFixed(2)}x`,
            `Tether ${effectiveTether.tetherState} (${effectiveTether.source}): ${tetherMultiplier.toFixed(2)}x`,
            `Stability ${profile.stability}: ${stabilityMultiplier.toFixed(2)}x`,
          ]
        : ['Relationship-derived Essence is not enabled for this NPC.'],
    };
  }
);

export const selectAllRelationshipEssenceContributions = createSelector(
  [selectRelationshipState, (state: RootState) => state.player.location],
  (relationships, playerLocation) => Object.keys(relationships.progressionByNpc)
    .map(npcId => selectRelationshipEssenceContributionByNpcId(
      { relationships, player: { location: playerLocation } } as RootState,
      npcId
    ))
    .filter(contribution => contribution.enabled && contribution.effectiveRate > 0)
);
