/**
 * Types for the NPCs slice of the Redux store
 */

/**
 * Interface for an item in a shop inventory
 */
export interface ShopItem {
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
export interface Shop {
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
export interface Relationship {
  /** Text descriptor of relationship status (hostile, neutral, friendly, etc.) */
  level: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'trusted' | 'allied';
  /** Numeric representation of relationship (0-100) */
  value: number;
}

/**
 * Interface for a quest associated with an NPC
 */
export interface QuestInfo {
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
export interface TrainingSkill {
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
export interface Training {
  /** Array of skills this NPC can teach */
  availableSkills: TrainingSkill[];
}

/**
 * Interface for crafting materials
 */
export interface CraftingMaterial {
  /** Unique identifier for the material */
  itemId: string;
  /** Quantity of material required */
  quantity: number;
}

/**
 * Interface for a crafting recipe
 */
export interface CraftingRecipe {
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
export interface Crafting {
  /** Whether crafting is available with this NPC */
  available: boolean;
  /** Array of recipes this NPC can craft */
  recipes: CraftingRecipe[];
}

/**
 * Interface for equipment upgrading capabilities
 */
export interface Upgrading {
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
export interface DialogueOptions {
  /** Initial greeting dialogue */
  greeting: string;
  /** Farewell dialogue */
  farewell: string;
  /** Other dialogue types specific to the NPC */
  [key: string]: string;
}

/**
 * Interface for dialogue structure
 */
export interface Dialogue {
  /** Unique identifier for the dialogue */
  id?: string;
  /** Main dialogue text */
  text: string;
  /** Available dialogue options */
  options: DialogueOption[];
}

/**
 * Interface for dialogue option
 */
export interface DialogueOption {
  /** The text of this option */
  text: string;
  /** ID of the dialogue this option leads to */
  nextDialogue?: string;
  /** How much relationship changes if this option is chosen */
  relationshipChange?: number;
  /** Special action triggered by this option */
  action?: string;
  /** Trait associated with this option */
  traitId?: string;
  /** Essence cost to select this option */
  essenceCost?: number;
  /** Minimum relationship required for this option */
  relationshipRequirement?: number;
}

/**
 * Interface for NPC dialogue collection
 */
export interface NPCDialogue {
  /** First meeting dialogue */
  firstMeeting?: Dialogue;
  /** Initial greeting dialogue */
  initial: Dialogue;
  /** Other dialogue states */
  [key: string]: Dialogue | undefined;
}

/**
 * Interface representing an NPC in the game
 */
export interface NPC {
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
  /** Full structured dialogue for NPC */
  dialogue?: NPCDialogue;
  /** Title or profession of the NPC */
  title?: string;
  /** Path to the NPC's image */
  image?: string;
  /** Tags describing the NPC */
  tags?: string[];
  /** Services offered by the NPC */
  services?: string[];
  /** Faction the NPC belongs to */
  faction?: string;
  /** Whether this NPC can trade with player */
  canTrade?: boolean;
  /** Whether this NPC can offer quests */
  hasQuests?: boolean;
  /** Traits of this NPC */
  traits?: string[];
}

/**
 * Interface for NPC global state
 */
export interface NPCGlobalState {
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
export interface PlayerInteractions {
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
export interface NPCsState {
  /** Map of all NPCs indexed by their ID */
  npcs: Record<string, NPC>;
  /** Global state affecting all NPCs */
  globalState: NPCGlobalState;
  /** Player's interaction state with NPCs */
  playerInteractions: PlayerInteractions;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Currently selected NPC ID */
  selectedNpcId: string | null;
}

/**
 * Payload for updating NPC relationship
 */
export interface UpdateRelationshipPayload {
  /** ID of the NPC to update */
  npcId: string;
  /** Amount to change relationship (positive or negative) */
  amount: number;
  /** Whether to show a notification to the player */
  notifyPlayer?: boolean;
  /** Source of the relationship change */
  source?: string;
}

/**
 * Payload for starting a dialogue
 */
export interface StartDialoguePayload {
  /** ID of the NPC to talk to */
  npcId: string;
  /** Type of dialogue to start */
  dialogueType?: string;
}

/**
 * Payload for purchasing an item
 */
export interface PurchaseItemPayload {
  /** ID of the NPC to purchase from */
  npcId: string;
  /** Index of the item in the NPC's inventory */
  itemIndex: number;
  /** Quantity to purchase */
  quantity?: number;
}

/**
 * Payload for selling an item
 */
export interface SellItemPayload {
  /** ID of the NPC to sell to */
  npcId: string;
  /** ID of the item to sell */
  itemId: string;
  /** Quantity to sell */
  quantity: number;
}

/**
 * Payload for completing a quest
 */
export interface CompleteQuestPayload {
  /** ID of the NPC who gave the quest */
  npcId: string;
  /** ID of the quest */
  questId: string;
}

/**
 * Payload for unlocking an NPC
 */
export interface UnlockNpcPayload {
  /** ID of the NPC to unlock */
  npcId: string;
}

/**
 * Payload for updating a faction's reputation
 */
export interface UpdateFactionReputationPayload {
  /** ID of the faction */
  faction: string;
  /** Amount to change reputation (positive or negative) */
  amount: number;
}

/**
 * Payload for updating NPC location
 */
export interface UpdateNpcLocationPayload {
  /** ID of the NPC */
  npcId: string;
  /** New location ID */
  location: string;
}

/**
 * Payload for restocking NPC inventory
 */
export interface RestockNpcInventoryPayload {
  /** ID of the NPC to restock */
  npcId: string;
  /** New inventory items */
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Payload for updating time of day
 */
export interface UpdateTimeOfDayPayload {
  /** New time of day */
  timeOfDay: NPCGlobalState['dayNightCycle'];
}

/**
 * Payload for adding an NPC to discovered list
 */
export interface DiscoverNpcPayload {
  /** ID of the NPC discovered */
  npcId: string;
}

/**
 * Payload for toggling an NPC as favorite
 */
export interface ToggleFavoriteNpcPayload {
  /** ID of the NPC */
  npcId: string;
}

/**
 * Response for purchasing an item
 */
export interface PurchaseResponse {
  /** Whether purchase was successful */
  success: boolean;
  /** Item purchased */
  item?: {
    id: string;
    name: string;
    quantity: number;
  };
  /** Cost of the purchase */
  cost?: number;
  /** Error message if purchase failed */
  error?: string;
}

/**
 * Response for selling an item
 */
export interface SellResponse {
  /** Whether sale was successful */
  success: boolean;
  /** Amount of gold received */
  goldReceived?: number;
  /** Error message if sale failed */
  error?: string;
}

/**
 * Response for completing a quest
 */
export interface QuestCompletionResponse {
  /** Whether quest was completed successfully */
  success: boolean;
  /** Rewards received */
  rewards?: any;
  /** Error message if completion failed */
  error?: string;
}
