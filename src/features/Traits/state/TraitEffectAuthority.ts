import type { Trait } from './TraitsTypes';

export type TraitEffectAuthority =
  | 'direct_player_stat'
  | 'named_runtime'
  | 'semantic_capability'
  | 'deferred_legacy';

const DIRECT_PLAYER_STATS = new Set([
  'health',
  'maxHealth',
  'mana',
  'maxMana',
  'attack',
  'defense',
  'speed',
  'healthRegen',
  'manaRegen',
  'criticalChance',
  'criticalDamage',
]);

// These keys have a concrete non-PlayerStats production consumer.
// They are live runtime metadata, but they do not automatically imply that
// making the Trait permanent on the Player has a durable Player-owned effect.
const NAMED_RUNTIME_EFFECTS = new Set([
  'essenceGenerationMultiplier',
]);

// These keys identify authored capability meaning. Their production authority
// comes from gameplay requirements/consumers, not the generic stat processor.
const SEMANTIC_CAPABILITY_EFFECTS = new Set([
  'learningSpeed',
  'knowledgeEssence',
  'constraintAnalysis',
  'adversarialCalibration',
]);

export const classifyTraitEffectAuthority = (effectName: string): TraitEffectAuthority => {
  if (DIRECT_PLAYER_STATS.has(effectName)) return 'direct_player_stat';
  if (NAMED_RUNTIME_EFFECTS.has(effectName)) return 'named_runtime';
  if (SEMANTIC_CAPABILITY_EFFECTS.has(effectName)) return 'semantic_capability';
  return 'deferred_legacy';
};

const getTraitEffectNames = (trait: Trait): string[] => {
  if (!trait.effects) return [];
  if (Array.isArray(trait.effects)) {
    return trait.effects
      .map(effect => effect.type)
      .filter((effectName): effectName is string => typeof effectName === 'string');
  }
  return Object.keys(trait.effects);
};

export interface TraitAuthoritySummary {
  effectNames: string[];
  authorities: TraitEffectAuthority[];
  hasDirectPlayerStatAuthority: boolean;
  hasNamedRuntimeAuthority: boolean;
  hasSemanticCapabilityAuthority: boolean;
  /** Any live runtime/capability authority is enough for durable assimilation. */
  hasStabilizableAuthority: boolean;
  /** @deprecated Compatibility alias for hasStabilizableAuthority. */
  hasPermanentPlayerAuthority: boolean;
  isDeferredOnly: boolean;
}

export const summarizeTraitAuthority = (trait: Trait): TraitAuthoritySummary => {
  const effectNames = getTraitEffectNames(trait);
  const authorities = Array.from(new Set(effectNames.map(classifyTraitEffectAuthority)));

  const hasDirectPlayerStatAuthority = authorities.includes('direct_player_stat');
  const hasNamedRuntimeAuthority = authorities.includes('named_runtime');
  const hasSemanticCapabilityAuthority = authorities.includes('semantic_capability');

  const hasStabilizableAuthority =
    hasDirectPlayerStatAuthority ||
    hasNamedRuntimeAuthority ||
    hasSemanticCapabilityAuthority;

  return {
    effectNames,
    authorities,
    hasDirectPlayerStatAuthority,
    hasNamedRuntimeAuthority,
    hasSemanticCapabilityAuthority,
    // Under the universal Trait ontology, stabilization means durable ownership
    // of a real pattern. The pattern does not have to be an always-active Player
    // stat: a live named runtime use (for example Copy sharing) is sufficient.
    hasStabilizableAuthority,
    hasPermanentPlayerAuthority: hasStabilizableAuthority,
    isDeferredOnly:
      effectNames.length === 0 ||
      authorities.every(authority => authority === 'deferred_legacy'),
  };
};

export const isTraitEffectExecutedGenerically = (effectName: string): boolean =>
  classifyTraitEffectAuthority(effectName) === 'direct_player_stat';
