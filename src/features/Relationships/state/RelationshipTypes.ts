/**
 * @file RelationshipTypes.ts
 * @description Runtime types for relationship Experiences, Memories, Bond Profiles,
 * qualified Connection, relationship-derived Essence, and Trait assimilation.
 */

export type RelationshipDimensionKey =
  | 'affinity'
  | 'trust'
  | 'understanding'
  | 'sharedMeaning'
  | 'reliance'
  | 'vulnerability'
  | 'reciprocity';

export type RelationshipSignificance =
  | 'minor'
  | 'meaningful'
  | 'major'
  | 'defining';

export type RelationshipSourceType =
  | 'dialogue'
  | 'quest'
  | 'combat'
  | 'exploration'
  | 'system'
  | 'other';

export type RelationshipMemoryType =
  | 'shared'
  | 'target'
  | 'protagonist'
  | 'asymmetric';

export type RelationshipMemoryPersistence =
  | 'stable'
  | 'contested'
  | 'reinterpretable';

export type RelationshipStability =
  | 'ruptured'
  | 'contested'
  | 'strained'
  | 'stable'
  | 'reinforced';

export type RelationshipConnectionAuthority = 'legacy' | 'relationships';

export type RelationshipTetherState =
  | 'absent'
  | 'remote'
  | 'nearby'
  | 'present'
  | 'engaged'
  | 'deeplyEngaged';

export interface RelationshipDimensions {
  affinity: number;
  trust: number;
  understanding: number;
  sharedMeaning: number;
  reliance: number;
  vulnerability: number;
  reciprocity: number;
  custom: Record<string, number>;
}

export interface RelationshipTraitEffect {
  traitId: string;
  /** Reveal this Trait pattern to the player when the authored Experience occurs. */
  discover?: boolean;
  compatibilityDelta?: number;
  assimilationDelta?: number;
  note?: string;
}

export interface RelationshipExperience {
  id: string;
  uniqueKey?: string;
  title: string;
  timestamp: number;
  primaryTargetId: string;
  participantIds: string[];
  sourceType: RelationshipSourceType;
  sourceId?: string;
  significance: RelationshipSignificance;
  relationshipEffects: Partial<Record<RelationshipDimensionKey, number>>;
  customEffects?: Record<string, number>;
  connectionProgressDelta?: number;
  resonanceTags: string[];
  traitEffects?: RelationshipTraitEffect[];
  memoryCandidate: boolean;
  interpretation?: string;
  consequences?: string[];
  notes?: string;
}

export interface RelationshipMemory {
  id: string;
  originExperienceId: string;
  title: string;
  timestamp: number;
  primaryTargetId: string;
  participantIds: string[];
  memoryType: RelationshipMemoryType;
  significance: Exclude<RelationshipSignificance, 'minor'>;
  playerVisible: boolean;
  summary: string;
  protagonistView?: string;
  targetView?: string;
  resonanceTags: string[];
  bondContribution?: string;
  traitRelevance?: string[];
  persistence: RelationshipMemoryPersistence;
  currentInterpretation?: string;
  unlocks?: string[];
  notes?: string;
}

export interface BondProfile {
  npcId: string;
  dimensions: RelationshipDimensions;
  connectionLevel: number;
  connectionProgress: number;
  connectionQualificationEvidence: Record<string, string[]>;
  bondArchetypes: string[];
  activeMemoryIds: string[];
  unresolvedTensions: string[];
  recentExperienceIds: string[];
  resonanceQuality: number;
  stability: RelationshipStability;
  tetherState: RelationshipTetherState;
}

export interface TraitAssimilationState {
  traitId: string;
  sourceNpcId: string;
  progress: number;
  compatibility: number;
  lastUpdatedAt: number;
  qualifyingMemoryIds: string[];
}

export interface ConnectionQualificationRule {
  level: number;
  minimumProgress: number;
  minimumExperienceCount?: number;
  requiredExperienceIds?: string[];
  anyOfExperienceIds?: string[];
  requiredMemoryIds?: string[];
  requiredMemoryTags?: string[];
  minimumDimensions?: Partial<Record<RelationshipDimensionKey, number>>;
}

export interface RelationshipEssenceDefinition {
  enabled: boolean;
  startingTetherState?: RelationshipTetherState;
}

export interface RelationshipProgressionDefinition {
  npcId: string;
  connectionAuthority: RelationshipConnectionAuthority;
  startingProfile?: Omit<InitializeBondProfilePayload, 'npcId'>;
  qualificationRules?: ConnectionQualificationRule[];
  essence?: RelationshipEssenceDefinition;
}

export interface RelationshipState {
  /**
   * Broad migration marker. `true` means at least some NPCs are still legacy-authoritative.
   * Individual NPC authority is defined by progressionByNpc.
   */
  shadowMode: boolean;
  experiencesById: Record<string, RelationshipExperience>;
  experienceIdsByNpc: Record<string, string[]>;
  memoriesById: Record<string, RelationshipMemory>;
  memoryIdsByNpc: Record<string, string[]>;
  bondProfilesByNpc: Record<string, BondProfile>;
  appliedUniqueKeys: Record<string, true>;
  progressionByNpc: Record<string, RelationshipProgressionDefinition>;
  traitAssimilationByKey: Record<string, TraitAssimilationState>;
}

export interface InitializeBondProfilePayload {
  npcId: string;
  dimensions?: Partial<Omit<RelationshipDimensions, 'custom'>> & {
    custom?: Record<string, number>;
  };
  connectionLevel?: number;
  connectionProgress?: number;
  tetherState?: RelationshipTetherState;
}

export interface RelationshipExperienceDefinition
  extends Omit<RelationshipExperience, 'timestamp'> {
  memoryDefinitionId?: string;
}

export interface RelationshipMemoryDefinition
  extends Omit<RelationshipMemory, 'timestamp'> {}

export interface RelationshipDefinitionBundle {
  experiences: Record<string, RelationshipExperienceDefinition>;
  memories: Record<string, RelationshipMemoryDefinition>;
  progression?: Record<string, RelationshipProgressionDefinition>;
}

export const traitAssimilationKey = (npcId: string, traitId: string) =>
  `${npcId}::${traitId}`;

export const createDefaultTraitAssimilationState = (
  npcId: string,
  traitId: string
): TraitAssimilationState => ({
  traitId,
  sourceNpcId: npcId,
  progress: 0,
  compatibility: 0,
  lastUpdatedAt: 0,
  qualifyingMemoryIds: [],
});

export const createDefaultBondProfile = (
  npcId: string,
  seed?: Omit<InitializeBondProfilePayload, 'npcId'>
): BondProfile => ({
  npcId,
  dimensions: {
    affinity: seed?.dimensions?.affinity ?? 0,
    trust: seed?.dimensions?.trust ?? 0,
    understanding: seed?.dimensions?.understanding ?? 0,
    sharedMeaning: seed?.dimensions?.sharedMeaning ?? 0,
    reliance: seed?.dimensions?.reliance ?? 0,
    vulnerability: seed?.dimensions?.vulnerability ?? 0,
    reciprocity: seed?.dimensions?.reciprocity ?? 0,
    custom: { ...(seed?.dimensions?.custom ?? {}) },
  },
  connectionLevel: seed?.connectionLevel ?? 0,
  connectionProgress: seed?.connectionProgress ?? 0,
  connectionQualificationEvidence: {},
  bondArchetypes: [],
  activeMemoryIds: [],
  unresolvedTensions: [],
  recentExperienceIds: [],
  resonanceQuality: 0,
  stability: 'stable',
  tetherState: seed?.tetherState ?? 'present',
});
