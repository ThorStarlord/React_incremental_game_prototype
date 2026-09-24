import type { PlayerStats } from '../../Player/state/PlayerTypes';

export type TraitEffectRuntimeAuthority =
  | 'player_stat'
  | 'copy_essence'
  | 'semantic_capability'
  | 'deferred_1_0'
  | 'removed_1_0';

export interface TraitEffectContractEntry {
  authority: TraitEffectRuntimeAuthority;
  note: string;
}

const PLAYER_STAT_KEYS = new Set<keyof PlayerStats>([
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

const SPECIAL_EFFECT_CONTRACT: Record<string, TraitEffectContractEntry> = {
  essenceGenerationMultiplier: {
    authority: 'copy_essence',
    note: 'Additive fractional bonus consumed by Copy essence generation; 0.15 means +15%.',
  },
  learningSpeed: {
    authority: 'semantic_capability',
    note: 'Legacy numeric tag retained on Willow\'s Wisdom; gameplay authority is the Trait identity and authored capability gates.',
  },
  knowledgeEssence: {
    authority: 'semantic_capability',
    note: 'Legacy numeric tag retained on Scholarly Insight; gameplay authority is the Trait identity and authored capability gates.',
  },
  constraintAnalysis: {
    authority: 'semantic_capability',
    note: 'Constraint Sense is consumed through explicit capability/doctrine gates, not a generic numeric processor.',
  },
  adversarialCalibration: {
    authority: 'semantic_capability',
    note: 'Adversarial Calibration is consumed through explicit capability/doctrine gates, not a generic numeric processor.',
  },
  skillXpMultiplier: {
    authority: 'removed_1_0',
    note: 'Generic Skills are cut from Campaign One.',
  },
  craftingQualityBonus: {
    authority: 'removed_1_0',
    note: 'Generic Crafting is cut from Campaign One.',
  },
  shopDiscount: { authority: 'deferred_1_0', note: 'No Campaign One runtime consumer is currently authoritative.' },
  essenceGainMultiplier: { authority: 'deferred_1_0', note: 'No player-wide Essence gain multiplier consumer is currently authoritative.' },
  essenceSiphonChance: { authority: 'deferred_1_0', note: 'Combat does not currently consume generic Essence siphon effects.' },
  essenceSiphonAmount: { authority: 'deferred_1_0', note: 'Combat does not currently consume generic Essence siphon effects.' },
  relationshipGainMultiplier: { authority: 'deferred_1_0', note: 'Authored Relationship effects are authoritative; no generic multiplier is qualified.' },
  dodgeChance: { authority: 'deferred_1_0', note: 'Current Combat MVP does not consume a generic dodge stat.' },
  passiveRelationshipGrowth: { authority: 'deferred_1_0', note: 'Passive Relationship growth is not part of the qualified authored Relationship model.' },
  charismaBonus: { authority: 'deferred_1_0', note: 'Trait attribute mutation is not a qualified Campaign One authority.' },
  stealthEffectiveness: { authority: 'deferred_1_0', note: 'No Campaign One stealth runtime consumer is qualified.' },
  magicDamageBonus: { authority: 'deferred_1_0', note: 'No generic magic-damage system is qualified for Campaign One.' },
  essenceGeneration: { authority: 'deferred_1_0', note: 'Player Essence generation is derived from Relationship and Copy authorities, not this legacy field.' },
  essenceCapacity: { authority: 'deferred_1_0', note: 'No Essence-capacity authority exists in Campaign One.' },
  intelligence: { authority: 'deferred_1_0', note: 'Attributes are separate canonical state; generic Trait mutation of attributes is not qualified.' },
};

export const getTraitEffectContract = (
  effectName: string
): TraitEffectContractEntry | undefined => {
  if (PLAYER_STAT_KEYS.has(effectName as keyof PlayerStats)) {
    return {
      authority: 'player_stat',
      note: 'Applied to the final PlayerStats projection while the Trait is active or permanent.',
    };
  }

  if (effectName.endsWith('PercentBonus')) {
    const base = effectName.replace('PercentBonus', '');
    if (PLAYER_STAT_KEYS.has(base as keyof PlayerStats)) {
      return {
        authority: 'player_stat',
        note: 'Percentage PlayerStats modifier applied by the generic Trait stat processor.',
      };
    }
  }

  if (effectName.endsWith('Multiplier')) {
    const base = effectName.replace('Multiplier', '');
    if (PLAYER_STAT_KEYS.has(base as keyof PlayerStats)) {
      return {
        authority: 'player_stat',
        note: 'Multiplicative PlayerStats modifier applied by the generic Trait stat processor.',
      };
    }
  }

  return SPECIAL_EFFECT_CONTRACT[effectName];
};

export const isPlayerStatTraitEffect = (effectName: string): boolean =>
  getTraitEffectContract(effectName)?.authority === 'player_stat';

export const isKnownTraitEffect = (effectName: string): boolean =>
  Boolean(getTraitEffectContract(effectName));
