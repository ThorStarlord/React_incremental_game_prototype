/**
 * @file mockNPCData.ts
 * @description Mock data for NPCs used in development and testing
 */

import { NPC } from '../state/NPCTypes';

export const mockNPCs: Record<string, NPC> = {
  'npc-001': {
    id: 'npc-001',
    name: 'Elena the Wise',
    description: 'A knowledgeable sage who has studied the ancient arts of essence manipulation.',
    avatar: '/images/npcs/elena.jpg',
    location: 'Ancient Library',
    status: 'available',
    isAvailable: true,
    relationshipValue: 15,
    connectionDepth: 2,
    loyalty: 12,
    lastInteraction: Date.now() - 3600000,
    discoveredAt: Date.now() - 86400000,
    // Added: Missing required properties for dialogue system
    availableDialogues: ['intro-greeting', 'essence-wisdom', 'ancient-knowledge'],
    completedDialogues: ['first-meeting'],
    // Added: Missing required properties for quest system
    availableQuests: ['gather-essence-crystals', 'library-research'],
    completedQuests: [],
    // Added: Missing required property for trait sharing
    teachableTraits: ['essence-affinity', 'scholarly-insight', 'mental-focus'],
    traits: {
      'essence-affinity': {
        id: 'essence-affinity',
        name: 'Essence Affinity',
        description: 'Natural connection to essence energy, improving generation and control.',
        category: 'social',
        rarity: 'rare',
        effects: { essenceGeneration: 1.2, essenceCapacity: 50 },
        requirements: { relationshipLevel: 10 },
        discovered: true,
        cost: 25
      }
    }
  },

  'npc-002': {
    id: 'npc-002',
    name: 'Marcus the Bold',
    description: 'A seasoned warrior who values strength and courage above all else.',
    avatar: '/images/npcs/marcus.jpg',
    location: 'Training Grounds',
    status: 'available',
    isAvailable: true,
    relationshipValue: 8,
    connectionDepth: 1,
    loyalty: 6,
    lastInteraction: Date.now() - 7200000,
    discoveredAt: Date.now() - 172800000,
    // Added: Missing required properties for dialogue system
    availableDialogues: ['warrior-greeting', 'combat-training', 'strength-philosophy'],
    completedDialogues: [],
    // Added: Missing required properties for quest system
    availableQuests: ['combat-trial', 'weapon-mastery-test'],
    completedQuests: [],
    // Added: Missing required property for trait sharing
    teachableTraits: ['combat-prowess', 'physical-endurance', 'warrior-spirit'],
    traits: {
      'combat-prowess': {
        id: 'combat-prowess',
        name: 'Combat Prowess',
        description: 'Enhanced combat abilities and weapon mastery.',
        category: 'combat',
        rarity: 'common',
        effects: { attack: 15, criticalChance: 0.05 },
        requirements: { relationshipLevel: 5 },
        discovered: false,
        cost: 15
      }
    }
  },

  'npc-003': {
    id: 'npc-003',
    name: 'Lyra the Swift',
    description: 'An agile scout known for her incredible speed and stealth abilities.',
    avatar: '/images/npcs/lyra.jpg',
    location: 'Whispering Woods',
    status: 'available',
    isAvailable: true,
    relationshipValue: 22,
    connectionDepth: 3,
    loyalty: 18,
    lastInteraction: Date.now() - 1800000,
    discoveredAt: Date.now() - 259200000,
    // Added: Missing required properties for dialogue system
    availableDialogues: ['scout-report', 'stealth-techniques', 'forest-wisdom'],
    completedDialogues: ['initial-contact', 'trust-building'],
    // Added: Missing required properties for quest system
    availableQuests: ['forest-patrol', 'stealth-mission', 'rare-herb-gathering'],
    completedQuests: ['introduction-task'],
    // Added: Missing required property for trait sharing
    teachableTraits: ['swift-movement', 'stealth-mastery', 'nature-connection'],
    traits: {
      'swift-movement': {
        id: 'swift-movement',
        name: 'Swift Movement',
        description: 'Incredible speed and agility for rapid traversal.',
        category: 'physical',
        rarity: 'rare',
        effects: { speed: 25, dodge: 10 },
        requirements: { relationshipLevel: 15 },
        discovered: true,
        cost: 30
      },
      'stealth-mastery': {
        id: 'stealth-mastery',
        name: 'Stealth Mastery',
        description: 'Expert concealment and silent movement abilities.',
        category: 'physical',
        rarity: 'epic',
        effects: { stealth: 40, criticalChance: 0.1 },
        requirements: { relationshipLevel: 20 },
        discovered: false,
        cost: 45
      }
    }
  },

  'npc-004': {
    id: 'npc-004',
    name: 'Thorne the Merchant',
    description: 'A shrewd trader with connections across the realm and an eye for rare goods.',
    avatar: '/images/npcs/thorne.jpg',
    location: 'Market District',
    status: 'available',
    isAvailable: true,
    relationshipValue: 12,
    connectionDepth: 2,
    loyalty: 10,
    lastInteraction: Date.now() - 5400000,
    discoveredAt: Date.now() - 345600000,
    // Added: Missing required properties for dialogue system
    availableDialogues: ['trade-offers', 'market-rumors', 'business-opportunities'],
    completedDialogues: ['first-transaction'],
    // Added: Missing required properties for quest system
    availableQuests: ['trade-route-security', 'rare-item-procurement'],
    completedQuests: [],
    // Added: Missing required property for trait sharing
    teachableTraits: ['merchant-savvy', 'negotiation-skills', 'wealth-attraction'],
    traits: {
      'merchant-savvy': {
        id: 'merchant-savvy',
        name: 'Merchant Savvy',
        description: 'Expert trading skills and market knowledge.',
        category: 'social',
        rarity: 'common',
        effects: { goldGeneration: 1.15, tradingBonus: 0.1 },
        requirements: { relationshipLevel: 8 },
        discovered: true,
        cost: 20
      }
    }
  },

  'npc-005': {
    id: 'npc-005',
    name: 'Zara the Mystic',
    description: 'A mysterious figure who speaks in riddles and wields powerful magical abilities.',
    avatar: '/images/npcs/zara.jpg',
    location: 'Crystal Sanctum',
    status: 'available',
    isAvailable: true,
    relationshipValue: 5,
    connectionDepth: 1,
    loyalty: 3,
    lastInteraction: Date.now() - 10800000,
    discoveredAt: Date.now() - 432000000,
    // Added: Missing required properties for dialogue system
    availableDialogues: ['mystical-riddles', 'magical-theory', 'cosmic-insights'],
    completedDialogues: [],
    // Added: Missing required properties for quest system
    availableQuests: ['magical-trial', 'crystal-attunement'],
    completedQuests: [],
    // Added: Missing required property for trait sharing
    teachableTraits: ['arcane-knowledge', 'mystical-insight', 'magical-resonance'],
    traits: {
      'arcane-knowledge': {
        id: 'arcane-knowledge',
        name: 'Arcane Knowledge',
        description: 'Deep understanding of magical principles and mystical forces.',
        category: 'social',
        rarity: 'legendary',
        effects: { mana: 50, spellPower: 20, mysticalInsight: 15 },
        requirements: { relationshipLevel: 25 },
        discovered: false,
        cost: 75
      }
    }
  }
};

// Additional helper data for development and testing
export const mockDialogues: Record<string, { id: string; title: string; npcResponse: string }> = {
  'intro-greeting': {
    id: 'intro-greeting',
    title: 'Greet Elena',
    npcResponse: 'Welcome, seeker. The ancient texts speak of one such as you...'
  },
  'warrior-greeting': {
    id: 'warrior-greeting', 
    title: 'Challenge Marcus',
    npcResponse: 'Ah, another warrior! Show me your stance and I will judge your worth.'
  },
  'scout-report': {
    id: 'scout-report',
    title: 'Ask for Scout Report',
    npcResponse: 'The forest whispers of strange movements to the north. Proceed with caution.'
  }
};

export const mockQuests: Record<string, { id: string; title: string; description: string; reward: string }> = {
  'gather-essence-crystals': {
    id: 'gather-essence-crystals',
    title: 'Gather Essence Crystals',
    description: 'Collect 5 essence crystals from the Crystal Caves for research.',
    reward: '50 Essence + Knowledge of Ancient Techniques'
  },
  'combat-trial': {
    id: 'combat-trial',
    title: 'Combat Trial',
    description: 'Prove your combat prowess in the Training Arena.',
    reward: 'Combat Trait + Warrior\'s Respect'
  },
  'forest-patrol': {
    id: 'forest-patrol',
    title: 'Forest Patrol',
    description: 'Help patrol the forest borders and report any unusual activity.',
    reward: 'Stealth Training + Forest Knowledge'
  }
};
