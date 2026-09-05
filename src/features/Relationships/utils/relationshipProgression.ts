import type {
  BondProfile,
  RelationshipProgressionDefinition,
  RelationshipStability,
  RelationshipTetherState,
} from '../state/RelationshipTypes';

const CONNECTION_BASE_RATES = [
  0,
  0.05,
  0.1,
  0.18,
  0.28,
  0.42,
  0.6,
  0.85,
  1.15,
  1.55,
  2.1,
];

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

export interface RelationshipEssenceContribution {
  npcId: string;
  enabled: boolean;
  baseRate: number;
  qualityBand: string;
  qualityMultiplier: number;
  tetherMultiplier: number;
  stabilityMultiplier: number;
  effectiveRate: number;
  explanation: string[];
}

/**
 * Pure relationship-derived Essence calculation. This module deliberately has
 * no Redux/store/selector imports so it is safe to use during store bootstrap.
 */
export const calculateRelationshipEssenceContribution = (
  profile: BondProfile,
  config?: RelationshipProgressionDefinition
): RelationshipEssenceContribution => {
  const enabled = Boolean(
    config?.connectionAuthority === 'relationships' && config.essence?.enabled
  );
  const baseRate =
    CONNECTION_BASE_RATES[Math.max(0, Math.min(10, profile.connectionLevel))] ?? 0;
  const quality = qualityBand(profile.resonanceQuality);
  const tetherMultiplier = TETHER_MULTIPLIERS[profile.tetherState] ?? 1;
  const stabilityMultiplier = STABILITY_MULTIPLIERS[profile.stability] ?? 1;
  const effectiveRate = enabled
    ? baseRate * quality.multiplier * tetherMultiplier * stabilityMultiplier
    : 0;

  return {
    npcId: profile.npcId,
    enabled,
    baseRate,
    qualityBand: quality.label,
    qualityMultiplier: quality.multiplier,
    tetherMultiplier,
    stabilityMultiplier,
    effectiveRate,
    explanation: enabled
      ? [
          `Connection L${profile.connectionLevel} base: ${baseRate.toFixed(2)}/sec`,
          `Resonance Quality ${quality.label}: ${quality.multiplier.toFixed(2)}x`,
          `Tether ${profile.tetherState}: ${tetherMultiplier.toFixed(2)}x`,
          `Stability ${profile.stability}: ${stabilityMultiplier.toFixed(2)}x`,
        ]
      : ['Relationship-derived Essence is not enabled for this NPC.'],
  };
};
