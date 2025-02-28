export const TRAITS = {
  'NaturalHealing': {
    name: 'Natural Healing',
    type: 'Survival',
    description: 'Willow\'s teachings allow your body to naturally recover health over time.',
    essenceCost: 40,
    sourceNpc: 'npc3',
    requiredRelationship: 20,
    effects: {
      healthRegeneration: 1 // 1 health per minute
    },
    tier: 1,
    rarity: 'Common',
    icon: 'eco'
  },
  'HerbalExpertise': {
    name: 'Herbal Expertise',
    type: 'Crafting',
    description: 'Your knowledge of herbs increases the potency of crafted potions by 25%.',
    essenceCost: 65,
    sourceNpc: 'npc3',
    requiredRelationship: 50,
    effects: {
      potionEfficiency: 1.25
    },
    tier: 2,
    rarity: 'Uncommon',
    icon: 'spa'
  },
  'VitalityBoost': {
    name: 'Vitality Boost',
    type: 'Survival',
    description: 'Willow\'s master techniques permanently increase your maximum health by 20%.',
    essenceCost: 120,
    sourceNpc: 'npc3',
    requiredRelationship: 80,
    effects: {
      maxHealthMultiplier: 1.2
    },
    tier: 3,
    rarity: 'Rare',
    icon: 'favorite'
  },
  // Add other traits here
}