export const traits = {
  copyableTraits: {
    'BargainingMaster': {
      name: 'Bargaining Master',
      type: 'Knowledge',
      description: 'Your keen business sense allows you to get better deals from merchants.',
      essenceCost: 50,
      effects: {
        shopDiscount: 0.05
      }
    },
    'QuickLearner': {
      name: 'Quick Learner',
      type: 'Knowledge',
      description: 'You gain 10% more experience from all sources.',
      essenceCost: 75,
      effects: {
        xpMultiplier: 0.1
      }
    },
    'MentorsInsight': {
      name: 'Mentor\'s Insight',
      type: 'Knowledge',
      description: 'Gain an additional stat point when leveling up.',
      essenceCost: 100,
      effects: {
        statPointBonus: 1
      }
    },
    'BattleHardened': {
      name: 'Battle Hardened',
      type: 'Combat',
      description: 'Your combat experience grants you increased attack and defense capabilities.',
      essenceCost: 80,
      effects: {
        attackBonus: 0.10,
        defenseBonus: 0.05
      }
    },
    'EssenceSiphon': {
      name: 'Essence Siphon',
      type: 'Combat',
      description: 'You have a chance to gain essence when landing hits in combat.',
      essenceCost: 120,
      effects: {
        essenceSiphonChance: 0.05
      }
    },
    'RelationshipSage': {
      name: 'Relationship Sage',
      type: 'Social',
      description: 'Your actions have a greater impact on NPC relationships.',
      essenceCost: 90,
      effects: {
        relationshipGainMultiplier: 1.2
      }
    },
    'EssenceFlow': {
      name: 'Essence Flow',
      type: 'Knowledge',
      description: 'Increases your essence generation rate from all sources.',
      essenceCost: 150,
      effects: {
        essenceGenerationMultiplier: 1.15
      }
    },
    'CombatReflexes': {
      name: 'Combat Reflexes',
      type: 'Combat',
      description: 'Increases your chance to dodge enemy attacks.',
      essenceCost: 100,
      effects: {
        dodgeChance: 0.1
      }
    }
  }
};