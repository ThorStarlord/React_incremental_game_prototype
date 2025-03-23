/**
 * Interface defining the effects a trait can provide
 */
export interface TraitEffects {
  [effectName: string]: number;
}

/**
 * Interface defining a trait in the copyableTraits collection
 */
export interface CopyableTrait {
  /** Display name of the trait */
  name: string;
  /** Category type of the trait */
  type: string;
  /** Description of what the trait does */
  description: string;
  /** Cost in essence to acquire the trait */
  essenceCost: number;
  /** Effects provided by the trait */
  effects: TraitEffects;
  /** Unique identifier, only present in some traits */
  id?: string;
  /** Tier level of the trait */
  tier?: number;
  /** Rarity classification of the trait */
  rarity?: string;
  /** Icon identifier for UI display */
  icon?: string;
  /** NPC that provides this trait */
  sourceNpc?: string;
  /** Relationship points required with NPC to unlock */
  requiredRelationship?: number;
  /** Special effect identifier */
  effect?: string;
}

/**
 * Interface for all trait collections
 */
export interface TraitsCollection {
  copyableTraits: {
    [traitId: string]: CopyableTrait;
  };
}

/**
 * Collection of all traits in the game
 */
export const traits: TraitsCollection = {
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
      description: 'You gain 15% more skill experience from all sources.',
      essenceCost: 75,
      effects: {
        skillXpMultiplier: 0.15
      }
    },
    'MentorsInsight': {
      name: 'Mentor\'s Insight',
      type: 'Mental',
      description: 'Increases essence gained from all sources by 10%',
      essenceCost: 50,
      effects: {
        essenceGainMultiplier: 1.1
      },
      tier: 1,
      rarity: 'Uncommon',
      icon: 'school'
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
    },
    'GrowingAffinity': {
      id: 'GrowingAffinity',
      name: "Growing Affinity",
      description: "Automatically increases relationships with all NPCs by 1 point every minute",
      essenceCost: 20,
      type: "Social",
      effect: 'relationshipGrowth',
      effects: {} // Adding empty effects object for consistency
    },
    'WillowsWisdom': {
      name: "Willow's Wisdom",
      type: 'Knowledge',
      description: "Elder Willow's ancient knowledge increases your learning speed by 15%",
      essenceCost: 40,
      sourceNpc: 'npc1', // Elder Willow
      requiredRelationship: 50,
      effects: {
        learningSpeed: 0.15
      }
    },
    'ScholarlyInsight': {
      name: "Scholarly Insight",
      type: 'Knowledge',
      description: "Scholar Elara's teachings help you gain 10% more essence from knowledge-based activities",
      essenceCost: 30,
      sourceNpc: 'npc2', // Scholar Elara
      requiredRelationship: 40,
      effects: {
        knowledgeEssence: 0.1
      }
    }
  }
};

export default traits;
