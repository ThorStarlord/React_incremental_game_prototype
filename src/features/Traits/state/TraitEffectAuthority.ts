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

export const isTraitEffectExecutedGenerically = (effectName: string): boolean =>
  classifyTraitEffectAuthority(effectName) === 'direct_player_stat';
