/**
 * @file npcsInitialState.ts
 * @description Initial state configuration for the NPCs feature in the incremental RPG
 * 
 * This file defines the starting state for all non-player characters in the game,
 * including their basic properties, interaction states, relationships with the player,
 * available dialogues, quests, and trading capabilities.
 */

/**
 * Interface for an item in a shop inventory
 */
interface ShopItem {
  /** Unique identifier for the item */
  itemId: string;
  /** Current quantity available for purchase */
  quantity: number;
  /** Price in gold for purchasing this item */
  price: number;
}

/**
 * Interface for an NPC's shop
 */
interface Shop {
  /** Whether the shop is currently available for trading */
  isOpen: boolean;
  /** Array of items available in the shop */
  inventory: ShopItem[];
  /** Rate at which the NPC will buy player items (percentage of value) */
  buyRate: number;
}

/**
 * Interface for NPC relationship data
 */
interface Relationship {
  /** Text descriptor of relationship status (hostile, neutral, friendly, etc.) */
  level: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'trusted' | 'allied';
  /** Numeric representation of relationship (0-100) */
  value: number;
}

/**
 * Interface for a quest associated with an NPC
 */
interface QuestInfo {
  /** Unique identifier for the quest */
  questId: string;
  /** Display name of the quest */
  title: string;
  /** Whether the quest is currently available to accept */
  available: boolean;
  /** Whether the quest has been completed */
  completed: boolean;
  /** Whether the quest reward has been claimed */
  rewarded: boolean;
}

/**
 * Interface for training skill offered by an NPC
 */
interface TrainingSkill {
  /** Unique identifier for the skill */
  skillId: string;
  /** Display name of the skill */
  name: string;
  /** Cost in gold to learn this skill */
  cost: number;
  /** Whether player meets requirements to learn this skill */
  requirementsMet: boolean;
}

/**
 * Interface for an NPC's training capabilities
 */
interface Training {
  /** Array of skills this NPC can teach */
  availableSkills: TrainingSkill[];
}

/**
 * Interface for crafting materials
 */
interface CraftingMaterial {
  /** Unique identifier for the material */
  itemId: string;
  /** Quantity of material required */
  quantity: number;
}

/**
 * Interface for a crafting recipe
 */
interface CraftingRecipe {
  /** Unique identifier for the recipe */
  recipeId: string;
  /** Display name of the item being crafted */
  name: string;
  /** Materials required to craft the item */
  materials: CraftingMaterial[];
  /** Gold cost to craft the item */
  cost: number;
  /** Whether the recipe is available to the player */
  unlocked: boolean;
}

/**
 * Interface for an NPC's crafting capabilities
 */
interface Crafting {
  /** Whether crafting is available with this NPC */
  available: boolean;
  /** Array of recipes this NPC can craft */
  recipes: CraftingRecipe[];
}

/**
 * Interface for equipment upgrading capabilities
 */
interface Upgrading {
  /** Whether upgrading is available with this NPC */
  available: boolean;
  /** Maximum upgrade level possible */
  maxUpgradeLevel: number;
  /** Cost multiplier for each upgrade level */
  costMultiplier: number;
}

/**
 * Interface representing dialogues an NPC can have
 */
interface DialogueOptions {
  /** Initial greeting dialogue */
  greeting: string;
  /** Farewell dialogue */
  farewell: string;
  /** Other dialogue types specific to the NPC */
  [key: string]: string;
}

/**
 * Interface representing an NPC in the game
 */
interface NPC {
  /** Unique identifier for the NPC */
  id: string;
  /** Display name of the NPC */
  name: string;
  /** Current level of the NPC */
  level: number;
  /** Description of the NPC */
  description: string;
  /** Location identifier where this NPC can be found */
  location: string;
  /** Whether this NPC is currently available for interaction */
  unlocked: boolean;
  /** Path to the NPC's portrait image */
  portrait: string;
  /** Shop data if this NPC is a merchant */
  shop?: Shop;
  /** Available dialogue options */
  dialogues: DialogueOptions;
  /** Relationship with the player */
  relationship: Relationship;
  /** Available quests if this NPC is a quest giver */
  quests?: QuestInfo[];
  /** Training data if this NPC is a trainer */
  training?: Training;
  /** Crafting data if this NPC is a craftsman */
  crafting?: Crafting;
  /** Upgrading data if this NPC offers equipment upgrading */
  upgrading?: Upgrading;
}

/**
 * Interface for NPC global state
 */
interface NPCGlobalState {
  /** Current time of day affecting NPC availability */
  dayNightCycle: 'day' | 'night' | 'dawn' | 'dusk';
  /** Special events that affect NPCs */
  activeEvents: string[];
  /** Player's reputation with different factions */
  reputationsByFaction: Record<string, number>;
  /** Story flags that affect NPC behavior */
  storyFlags?: string[];
}

/**
 * Interface for player's interaction state with NPCs
 */
interface PlayerInteractions {
  /** Currently active dialogue if any */
  activeDialogue: null | {
    npcId: string;
    dialogue: string;
    dialogueType: string;
  };
  /** ID of the last NPC the player interacted with */
  lastInteractedNpc: string | null;
  /** History of interactions with NPCs */
  interactionHistory: Record<string, {
    firstInteraction?: string;
    lastInteraction?: string;
    interactionCount: number;
  }>;
  /** IDs of NPCs the player has discovered */
  discoveredNpcs: string[];
  /** IDs of NPCs marked as favorites */
  favoriteNpcs?: string[];
  /** Dialogue options the player has seen */
  seenDialogues?: Record<string, string[]>;
  /** NPC-specific flags for story progression */
  npcFlags?: Record<string, string[]>;
}

/**
 * Interface for the complete NPC state
 */
interface NPCState {
  /** Map of all NPCs indexed by their ID */
  npcs: Record<string, NPC>;
  /** Global state affecting all NPCs */
  globalState: NPCGlobalState;
  /** Player's interaction state with NPCs */
  playerInteractions: PlayerInteractions;
}

/**
 * Initial state for all NPCs in the game
 */
const npcsInitialState: NPCState = {
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
    },
    storyFlags: []
  },
  
  // Player's interaction state with NPCs
  playerInteractions: {
    activeDialogue: null,
    lastInteractedNpc: null,
    interactionHistory: {},
    discoveredNpcs: ['merchant', 'elder'],
    favoriteNpcs: [],
    seenDialogues: {},
    npcFlags: {}
  }
};

export default npcsInitialState;

// Export interfaces for use in other files
export type { 
  NPCState, 
  NPC, 
  Shop, 
  ShopItem, 
  Relationship, 
  QuestInfo,
  Training,
  TrainingSkill,
  Crafting,
  CraftingRecipe,
  DialogueOptions,
  NPCGlobalState,
  PlayerInteractions
};
