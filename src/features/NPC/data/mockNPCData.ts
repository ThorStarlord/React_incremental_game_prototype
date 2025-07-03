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
    affinity: 15,
    connectionDepth: 2,
    loyalty: 12,
    lastInteraction: Date.now() - 3600000,
    discoveredAt: Date.now() - 86400000,
    availableDialogues: ['intro-greeting', 'essence-wisdom', 'ancient-knowledge'],
    completedDialogues: ['first-meeting'],
    availableQuests: ['gather-essence-crystals', 'library-research'],
    completedQuests: [],
    availableTraits: ['EssenceAffinity', 'ScholarlyInsight', 'MentalFocus'],
    // FIXED: Renamed 'sharedTraits' to 'sharedTraitSlots' and changed the structure to an array of objects.
    sharedTraitSlots: [
      { id: 'elena_slot_0', index: 0, traitId: null, isUnlocked: true },
      { id: 'elena_slot_1', index: 1, traitId: null, isUnlocked: false, unlockRequirement: 20 },
    ],
  },

  'npc-002': {
    id: 'npc-002',
    name: 'Marcus the Bold',
    description: 'A seasoned warrior who values strength and courage above all else.',
    avatar: '/images/npcs/marcus.jpg',
    location: 'Training Grounds',
    status: 'available',
    isAvailable: true,
    affinity: 8,
    connectionDepth: 1,
    loyalty: 6,
    lastInteraction: Date.now() - 7200000,
    discoveredAt: Date.now() - 172800000,
    availableDialogues: ['warrior-greeting', 'combat-training', 'strength-philosophy'],
    completedDialogues: [],
    availableQuests: ['combat-trial', 'weapon-mastery-test'],
    completedQuests: [],
    availableTraits: ['BattleHardened', 'ResilientConstitution'],
    // FIXED: Renamed 'sharedTraits' to 'sharedTraitSlots' and updated structure.
    sharedTraitSlots: [
      { id: 'marcus_slot_0', index: 0, traitId: 'BattleHardened', isUnlocked: true }, // Example with an equipped trait
      { id: 'marcus_slot_1', index: 1, traitId: null, isUnlocked: false, unlockRequirement: 25 },
    ],
  },
  
  'npc-003': {
    id: 'npc-003',
    name: 'Lyra the Swift',
    description: 'An agile scout known for her incredible speed and stealth abilities.',
    avatar: '/images/npcs/lyra.jpg',
    location: 'Whispering Woods',
    status: 'available',
    isAvailable: true,
    affinity: 22,
    connectionDepth: 3,
    loyalty: 18,
    lastInteraction: Date.now() - 1800000,
    discoveredAt: Date.now() - 259200000,
    availableDialogues: ['scout-report', 'stealth-techniques', 'forest-wisdom'],
    completedDialogues: ['initial-contact', 'trust-building'],
    availableQuests: ['forest-patrol', 'stealth-mission', 'rare-herb-gathering'],
    completedQuests: ['introduction-task'],
    availableTraits: ['SwiftStrikes', 'ShadowWalker', 'ElementalAffinity'],
    // FIXED: Renamed 'sharedTraits' to 'sharedTraitSlots' and updated structure.
    sharedTraitSlots: [
        { id: 'lyra_slot_0', index: 0, traitId: null, isUnlocked: true },
        { id: 'lyra_slot_1', index: 1, traitId: null, isUnlocked: true },
        { id: 'lyra_slot_2', index: 2, traitId: null, isUnlocked: false, unlockRequirement: 40 },
    ]
  },

  // ... (You can apply the same fix for npc-004 and npc-005 if needed, or remove their sharedTraits property for now)
  'npc-004': {
    id: 'npc-004',
    name: 'Thorne the Merchant',
    description: 'A shrewd trader with connections across the realm and an eye for rare goods.',
    avatar: '/images/npcs/thorne.jpg',
    location: 'Market District',
    status: 'available',
    isAvailable: true,
    affinity: 12,
    connectionDepth: 2,
    loyalty: 10,
    lastInteraction: Date.now() - 5400000,
    discoveredAt: Date.now() - 345600000,
    availableDialogues: ['trade-offers', 'market-rumors', 'business-opportunities'],
    completedDialogues: ['first-transaction'],
    availableQuests: ['trade-route-security', 'rare-item-procurement'],
    completedQuests: [],
    availableTraits: ['BargainingMaster', 'MasterCraftsman', 'SilverTongue'],
    sharedTraitSlots: [] // Example with no slots initially
  },

  'npc-005': {
    id: 'npc-005',
    name: 'Zara the Mystic',
    description: 'A mysterious figure who speaks in riddles and wields powerful magical abilities.',
    avatar: '/images/npcs/zara.jpg',
    location: 'Crystal Sanctum',
    status: 'available',
    isAvailable: true,
    affinity: 5,
    connectionDepth: 1,
    loyalty: 3,
    lastInteraction: Date.now() - 10800000,
    discoveredAt: Date.now() - 432000000,
    availableDialogues: ['mystical-riddles', 'magical-theory', 'cosmic-insights'],
    completedDialogues: [],
    availableQuests: ['magical-trial', 'crystal-attunement'],
    completedQuests: [],
    availableTraits: ['ArcaneIntellect', 'WhispersOfTheVoid', 'ElementalAffinity'],
    sharedTraitSlots: []
  }
};

// ... (the rest of the file can remain the same)
// Additional helper data for development and testing
export const mockDialogues: Record<string, { id: string; title: string; responses: Record<string, string> }> = {
  'intro-greeting': {
    id: 'intro-greeting',
    title: 'Greet Elena',
    responses: {
      'NEUTRAL': 'Welcome, seeker. The ancient texts speak of one such as you...',
      'ACQUAINTANCE': 'Ah, it is you again. What brings you to the library today?',
      'FRIEND': 'Elena smiles warmly. "A pleasure to see you, friend. How may I assist you?"',
      'ALLY': 'Elena bows slightly. "Your presence is a comfort, ally. What wisdom do you seek?"',
      'TRUSTED': 'Elena\'s eyes sparkle. "Come, sit. Let us share knowledge as trusted companions."',
      'BELOVED': 'Elena embraces you. "My dearest friend, your presence brightens even the oldest halls."'
    }
  },
  'warrior-greeting': {
    id: 'warrior-greeting', 
    title: 'Challenge Marcus',
    responses: {
      'NEUTRAL': 'Ah, another warrior! Show me your stance and I will judge your worth.',
      'ACQUAINTANCE': 'Ready for another spar, eh? Let\'s see how much you\'ve improved.',
      'FRIEND': 'Marcus grins. "Always a pleasure to train with a comrade like you!"',
      'ALLY': 'Marcus claps your shoulder. "Together, we are unstoppable. What challenge do you face?"',
      'TRUSTED': 'Marcus nods respectfully. "Your strength is undeniable. What wisdom do you seek from a veteran?"',
      'BELOVED': 'Marcus laughs heartily. "My brother/sister in arms! Let us forge our legends together!"'
    }
  },
  'scout-report': {
    id: 'scout-report',
    title: 'Ask for Scout Report',
    responses: {
      'NEUTRAL': 'The forest whispers of strange movements to the north. Proceed with caution.',
      'ACQUAINTANCE': 'My latest patrol revealed nothing unusual, but the woods are always full of secrets.',
      'FRIEND': 'Lyra shares a detailed map. "I\'ve marked a new path, safer than the old one."',
      'ALLY': 'Lyra points to a distant peak. "I\'ve found a hidden grove, perfect for quiet contemplation."',
      'TRUSTED': 'Lyra whispers a secret. "The ancient spirits are restless near the old ruins. Be wary."',
      'BELOVED': 'Lyra takes your hand. "The forest itself sings when you are near. What do you wish to know?"'
    }
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
