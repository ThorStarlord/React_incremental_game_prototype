import type { RootState } from '../../../app/store';
import { COPY_SYSTEM, ESSENCE_GENERATION } from '../../../constants/gameConstants';
import { calculateCopyEssenceGeneration } from '../../Copy/utils/copyUtils';
import {
  createDefaultBondProfile,
  type BondProfile,
} from '../../Relationships/state/RelationshipTypes';
import {
  calculateRelationshipEssenceContribution,
  type RelationshipEssenceContribution,
} from '../../Relationships/utils/relationshipProgression';

export interface EssenceRateCalculation {
  newRate: number;
  relationshipRate: number;
  copyRate: number;
  relationshipContributions: RelationshipEssenceContribution[];
}

const normalizeBondProfile = (
  raw: Partial<BondProfile> | undefined,
  npcId: string
): BondProfile => {
  const defaults = createDefaultBondProfile(npcId);
  if (!raw) return defaults;
  return {
    ...defaults,
    ...raw,
    dimensions: {
      ...defaults.dimensions,
      ...(raw.dimensions ?? {}),
      custom: {
        ...defaults.dimensions.custom,
        ...(raw.dimensions?.custom ?? {}),
      },
    },
    connectionQualificationEvidence: raw.connectionQualificationEvidence ?? {},
    bondArchetypes: raw.bondArchetypes ?? [],
    activeMemoryIds: raw.activeMemoryIds ?? [],
    unresolvedTensions: raw.unresolvedTensions ?? [],
    recentExperienceIds: raw.recentExperienceIds ?? [],
    tetherState: raw.tetherState ?? defaults.tetherState,
  };
};

/** Selector-free passive Essence rate calculation over raw Redux state. */
export const calculateEssenceGenerationRateRaw = (
  state: RootState
): EssenceRateCalculation => {
  const allTraits = state.traits.traits;
  let totalRate = ESSENCE_GENERATION.BASE_RATE_PER_SECOND;

  const relationshipContributions: RelationshipEssenceContribution[] = [];
  const relationshipState = state.relationships;
  for (const npcId of Object.keys(relationshipState?.progressionByNpc ?? {})) {
    const config = relationshipState?.progressionByNpc?.[npcId];
    const profile = normalizeBondProfile(
      relationshipState?.bondProfilesByNpc?.[npcId],
      npcId
    );
    const contribution = calculateRelationshipEssenceContribution(profile, config);
    if (contribution.enabled && contribution.effectiveRate > 0) {
      relationshipContributions.push(contribution);
    }
  }

  const relationshipRate = relationshipContributions.reduce(
    (total, contribution) => total + contribution.effectiveRate,
    0
  );
  totalRate += relationshipRate;

  let copyRate = 0;
  for (const copy of Object.values(state.copy.copies)) {
    if (copy.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD) {
      copyRate += calculateCopyEssenceGeneration(copy, allTraits);
    }
  }
  totalRate += copyRate;

  return {
    newRate: totalRate,
    relationshipRate,
    copyRate,
    relationshipContributions,
  };
};
