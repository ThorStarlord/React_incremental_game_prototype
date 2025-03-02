/**
 * @file npcsInitialState.js
 * @description Initial state configuration for the NPCs feature in the incremental RPG
 * 
 * This file defines the starting state for all non-player characters in the game,
 * including their basic properties, interaction states, relationships with the player,
 * available dialogues, quests, and trading capabilities.
 */

const npcsInitialState = {
  // List of all NPCs in the game with their properties
  npcs: {
    // Merchant NPC
    'merchant': {
      id: 'merchant',
      name: 'Marcus the Merchant',
      level: 5,
      description: 'A well-traveled merchant who sells various goods and equipment.',
      location: 'town_square',
      unlocked: true,
      portrait: 'merchant_portrait.png',
      
      // Trading-related properties
      shop: {
        isOpen: true,
        inventory: [
          { itemId: 'health_potion', quantity: 10, price: 50 },
          { itemId: 'mana_potion', quantity: 8, price: 75 },
          { itemId: 'bronze_sword', quantity: 1, price: 200 },
          { itemId: 'leather_armor', quantity: 1, price: 150 },
        ],
        buyRate: 0.5, // How much the merchant pays for player items (50% of value)
      },
      
      // Dialogue options
      dialogues: {
        greeting: "Welcome to my shop, adventurer! Looking for supplies?",
        farewell: "Safe travels! Come back when you need supplies.",
        lowGold: "Sorry, you don't have enough gold for that.",
        successfulPurchase: "An excellent choice! Anything else you need?",
        successfulSale: "Thank you for your business!",
      },
      
      // Relationship with player
      relationship: {
        level: 'neutral', // can be hostile, unfriendly, neutral, friendly, trusted, allied
        value: 50, // 0-100 numeric representation of relationship
      }
    },
    
    // Quest giver NPC
    'elder': {
      id: 'elder',
      name: 'Elder Thorne',
      level: 10,
      description: 'The wise elder of the village who knows many secrets about the region.',
      location: 'village_hall',
      unlocked: true,
      portrait: 'elder_portrait.png',
      
      // Quest-related properties
      quests: [
        {
          questId: 'rats_in_cellar',
          title: 'Rats in the Cellar',
          available: true,
          completed: false,
          rewarded: false,
        },
        {
          questId: 'missing_artifact',
          title: 'The Missing Artifact',
          available: false, // Unlocks after completing 'rats_in_cellar'
          completed: false,
          rewarded: false,
        }
      ],
      
      // Dialogue options
      dialogues: {
        greeting: "Greetings, young one. Do you seek knowledge or perhaps assistance with a task?",
        farewell: "May wisdom guide your path.",
        questOffer: "The village needs your help. Would you be willing to assist us?",
        questComplete: "You have done well. The village is in your debt.",
      },
      
      // Relationship with player
      relationship: {
        level: 'neutral',
        value: 40,
      }
    },
    
    // Trainer NPC
    'trainer': {
      id: 'trainer',
      name: 'Sergeant Steelheart',
      level: 15,
      description: 'A battle-hardened veteran who can teach combat skills.',
      location: 'training_grounds',
      unlocked: false, // Needs to be unlocked through story progression
      portrait: 'trainer_portrait.png',
      
      // Training-related properties
      training: {
        availableSkills: [
          {
            skillId: 'basic_swordsmanship',
            name: 'Basic Swordsmanship',
            cost: 100,
            requirementsMet: true,
          },
          {
            skillId: 'shield_block',
            name: 'Shield Block',
            cost: 250,
            requirementsMet: false, // Requires level 5 player
          }
        ],
      },
      
      // Dialogue options
      dialogues: {
        greeting: "Stand straight, recruit! Ready to toughen up?",
        farewell: "Practice makes perfect. Come back when you're ready for more.",
        trainingSuccess: "Good work! Keep practicing that technique.",
        trainingFailed: "You lack the requirements. Train more and return.",
      },
      
      // Relationship with player
      relationship: {
        level: 'unfriendly', // Starts a bit rough
        value: 25,
      }
    },
    
    // Blacksmith NPC
    'blacksmith': {
      id: 'blacksmith',
      name: 'Grimhammer the Smith',
      level: 8,
      description: 'A skilled blacksmith who can forge and upgrade equipment.',
      location: 'forge',
      unlocked: false, // Unlocked after reaching the village
      portrait: 'blacksmith_portrait.png',
      
      // Crafting-related properties
      crafting: {
        available: true,
        recipes: [
          {
            recipeId: 'iron_sword',
            name: 'Iron Sword',
            materials: [
              { itemId: 'iron_ingot', quantity: 3 },
              { itemId: 'leather_strip', quantity: 1 },
            ],
            cost: 150,
            unlocked: true,
          },
          {
            recipeId: 'steel_armor',
            name: 'Steel Armor',
            materials: [
              { itemId: 'steel_ingot', quantity: 5 },
              { itemId: 'leather_strip', quantity: 2 },
            ],
            cost: 350,
            unlocked: false, // Requires player level 10
          }
        ],
      },
      
      // Upgrade service
      upgrading: {
        available: true,
        maxUpgradeLevel: 3,
        costMultiplier: 1.5, // Each level costs 1.5x more
      },
      
      // Dialogue options
      dialogues: {
        greeting: "The forge is hot and ready. What can I make for you?",
        farewell: "Wear that armor with pride!",
        craftingSuccess: "There you go, finest work if I do say so myself.",
        insufficientMaterials: "You don't have the materials I need for that.",
      },
      
      // Relationship with player
      relationship: {
        level: 'neutral',
        value: 45,
      }
    },
  },
  
  // Global NPC system states
  globalState: {
    dayNightCycle: 'day', // affects NPC availability
    activeEvents: [], // special NPC events currently active
    reputationsByFaction: {
      'village': 50,
      'merchants_guild': 30,
      'adventurers_guild': 0,
    }
  },
  
  // Player's interaction state with NPCs
  playerInteractions: {
    activeDialogue: null,
    lastInteractedNpc: null,
    interactionHistory: {},
    discoveredNpcs: ['merchant', 'elder'],
  }
};

export default npcsInitialState;
