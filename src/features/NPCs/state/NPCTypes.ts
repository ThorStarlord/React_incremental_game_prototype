/**
 * @file NPCTypes.ts
 * @description TypeScript interfaces and types for the NPC system
 * Provides comprehensive type definitions for NPCs, relationships, interactions,
 * and all related game mechanics including dialogue, trading, and quests.
 */

// ============================================================================
// CORE NPC INTERFACES
// ============================================================================

/**
 * Primary NPC entity representing a non-player character in the game
 */
export interface NPC {
  // Basic identification and presentation
  id: string;
  name: string;
  description?: string;
  location: string;
  avatar?: string;
  faction?: string;
  
  // Relationship and connection data
  relationshipValue: number;
  connectionDepth: number;
  loyalty: number;
  
  // Interaction tracking
  availableDialogues: string[];
  completedDialogues: string[];
  availableQuests: string[];
  completedQuests: string[];
  
  // Trait system integration
  traits?: Record<string, NPCTraitInfo>;
  teachableTraits: string[];
  sharedTraitSlots?: NPCSharedTraitSlot[];
  
  // Commerce and services
  inventory?: NPCInventory;
  services?: NPCService[];
  
  // Behavioral characteristics
  personality?: NPCPersonality;
  schedule?: NPCSchedule;
  
  // State management
  status: NPCStatus;
  lastInteraction?: number;
  isDiscovered?: boolean;
  isAvailable?: boolean;
}

/**
 * Trait information specific to NPCs including acquisition requirements
 */
export interface NPCTraitInfo {
  id: string;
  name?: string;
  relationshipRequirement: number;
  essenceCost?: number;
  prerequisites?: string[];
  isVisible?: boolean; // Added for discovery tracking
}

/**
 * Shared trait slot that allows player to share traits with NPCs
 */
export interface NPCSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null;
  isUnlocked: boolean;
  unlockRequirement?: number;
}

// ============================================================================
// COMMERCE AND SERVICES
// ============================================================================

/**
 * NPC inventory system for trading and commerce
 */
export interface NPCInventory {
  items: TradeItem[];
  currency: number;
}

/**
 * Individual item in NPC inventory with pricing and availability
 */
export interface TradeItem {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  basePrice: number;
  currentPrice: number;
  quantity: number;
  effects?: Record<string, number>;
}

/**
 * Services that NPCs can provide to the player
 */
export interface NPCService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  isAvailable: boolean;
  requirements?: Record<string, any>;
}

/**
 * Types of services NPCs can provide
 */
export type NPCServiceType = 
  | 'skill_training' 
  | 'trait_modification' 
  | 'information' 
  | 'crafting'
  | 'healing'
  | 'other';

// ============================================================================
// PERSONALITY AND BEHAVIOR
// ============================================================================

/**
 * NPC personality definition affecting interactions and dialogue
 */
export interface NPCPersonality {
  traits: string[];
  preferences: Record<string, number>;
  dislikes: Record<string, number>;
}

/**
 * Conversation style affecting dialogue presentation
 */
export type NPCConversationStyle = 
  | 'formal' 
  | 'casual' 
  | 'mysterious' 
  | 'friendly' 
  | 'hostile'
  | 'scholarly'
  | 'merchant'
  | 'warrior';

/**
 * NPC schedule defining availability and behavior patterns
 */
export interface NPCSchedule {
  [timeSlot: string]: NPCScheduleEntry;
}

/**
 * Individual schedule entry for specific time periods
 */
export interface NPCScheduleEntry {
  location: string;
  availability: boolean;
  activities: string[];
  mood?: string; // Added for time-based personality changes
}

// ============================================================================
// DIALOGUE SYSTEM
// ============================================================================

/**
 * Individual dialogue node in conversation trees
 */
export interface DialogueNode {
  id: string;
  text: string;
  speaker: DialogueSpeaker;
  options: DialogueOption[];
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
  metadata?: DialogueMetadata; // Added for dialogue management
}

/**
 * Speaker identification for dialogue attribution
 */
export type DialogueSpeaker = 'npc' | 'player' | 'narrator';

/**
 * Player response option in dialogue
 */
export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string;
  requirements?: DialogueRequirement[];
  effects?: DialogueEffect[];
  emotionalTone?: string; // Added for relationship impact
}

/**
 * Condition that must be met for dialogue availability
 */
export interface DialogueCondition {
  type: DialogueConditionType;
  target: string;
  operator: DialogueOperator;
  value: number | string | boolean;
  description?: string; // Added for UI display
}

/**
 * Types of conditions that can gate dialogue options
 */
export type DialogueConditionType = 
  | 'relationship' 
  | 'trait' 
  | 'quest' 
  | 'item' 
  | 'stat'
  | 'essence'
  | 'level'
  | 'faction';

/**
 * Comparison operators for dialogue conditions
 */
export type DialogueOperator = 
  | 'gte' 
  | 'lte' 
  | 'eq' 
  | 'neq'
  | 'has' 
  | 'not_has'
  | 'contains';

/**
 * Requirement that must be met to select dialogue option
 */
export interface DialogueRequirement extends DialogueCondition {}

/**
 * Effect applied when dialogue option is selected
 */
export interface DialogueEffect {
  type: DialogueEffectType;
  target: string;
  operation: DialogueOperation;
  value: number | string;
  message?: string;
  isVisible?: boolean; // Added for hidden effects
}

/**
 * Types of effects that dialogue can trigger
 */
export type DialogueEffectType = 
  | 'relationship' 
  | 'essence' 
  | 'item' 
  | 'quest' 
  | 'trait'
  | 'stat'
  | 'reputation'
  | 'unlock';

/**
 * Operations that can be performed by dialogue effects
 */
export type DialogueOperation = 
  | 'add' 
  | 'subtract' 
  | 'set' 
  | 'multiply'
  | 'start' 
  | 'complete' 
  | 'unlock'
  | 'discover';

/**
 * Additional metadata for dialogue management
 */
export interface DialogueMetadata {
  category?: string;
  priority?: number;
  repeatable?: boolean;
  cooldown?: number;
  tags?: string[];
}

// ============================================================================
// INTERACTION SYSTEM
// ============================================================================

/**
 * Result of an NPC interaction
 */
export interface InteractionResult {
  success: boolean;
  relationshipChange?: number;
  essenceGained?: number;
  unlockRewards?: string[];
  message: string;
}

/**
 * Dialogue entry in conversation history
 */
export interface DialogueEntry {
  id: string;
  npcId: string;
  timestamp: number;
  playerChoice: string;
  npcResponse: string;
  relationshipChange: number;
}

/**
 * Record of relationship changes over time
 */
export interface RelationshipChangeEntry {
  id: string;
  npcId: string;
  timestamp: number;
  change: number;
  reason: string;
  newValue: number;
}

/**
 * Current interaction session data
 */
export interface NPCInteraction {
  npcId: string;
  startTime: number;
  interactionType: 'dialogue' | 'trade' | 'quest' | 'trait_sharing';
}

/**
 * Enhanced NPC state for the Redux store
 */
export interface NPCState {
  npcs: Record<string, NPC>;
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null;
  dialogueHistory: Record<string, DialogueEntry[]>;
  relationshipChanges: RelationshipChangeEntry[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// ACTION PAYLOAD TYPES
// ============================================================================

/**
 * Payload for updating NPC relationship values
 */
export interface UpdateRelationshipPayload {
  npcId: string;
  change: number;
  reason?: string;
}

/**
 * Payload for starting dialogue interaction
 */
export interface StartDialoguePayload {
  npcId: string;
  dialogueId: string;
  context?: Record<string, any>;
}

/**
 * Payload for completing dialogue interaction
 */
export interface CompleteDialoguePayload {
  npcId: string;
  dialogueId: string;
  effects?: DialogueEffect[];
  selectedOptions?: string[];
}

/**
 * Payload for discovering new NPCs
 */
export interface DiscoverNPCPayload {
  npcId: string;
  location: string;
  discoveryMethod?: string;
}

/**
 * Payload for trading with NPCs
 */
export interface TradeWithNPCPayload {
  npcId: string;
  items: TradeItem[];
  totalCost?: number;
  discountApplied?: number;
}

/**
 * Payload for sharing traits with NPCs
 */
export interface ShareTraitPayload {
  npcId: string;
  traitId: string;
  slotIndex: number;
}

/**
 * Payload for starting quests from NPCs
 */
export interface StartQuestPayload {
  npcId: string;
  questId: string;
  requirements?: Record<string, any>;
}

/**
 * Payload for completing quests for NPCs
 */
export interface CompleteQuestPayload {
  npcId: string;
  questId: string;
  rewards?: QuestReward[];
  experience?: number;
}

/**
 * Quest reward structure
 */
export interface QuestReward {
  type: 'item' | 'essence' | 'relationship' | 'trait' | 'unlock';
  id: string;
  quantity?: number;
  value?: number;
}

/**
 * Payload for NPC service usage
 */
export interface UseNPCServicePayload {
  npcId: string;
  serviceId: string;
  parameters?: Record<string, any>;
  cost?: number;
}

/**
 * Payload for updating NPC availability
 */
export interface SetNPCAvailabilityPayload {
  npcId: string;
  isAvailable: boolean;
  reason?: string;
  duration?: number;
}

/**
 * Payload for updating NPC status
 */
export interface SetNPCStatusPayload {
  npcId: string;
  status: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Relationship level enumeration for UI and logic
 */
export enum RelationshipLevel {
  HOSTILE = 0,
  SUSPICIOUS = 1,
  NEUTRAL = 2,
  FRIENDLY = 3,
  TRUSTED = 4,
  BELOVED = 5
}

/**
 * NPC availability status
 */
export enum NPCAvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  TRAVELING = 'traveling',
  SLEEPING = 'sleeping',
  HOSTILE = 'hostile',
  DEAD = 'dead'
}

/**
 * Helper type for partial NPC updates
 */
export type NPCUpdate = Partial<Omit<NPC, 'id'>>;

/**
 * Helper type for creating new NPCs
 */
export type CreateNPCPayload = Omit<NPC, 'lastInteraction' | 'completedDialogues' | 'completedQuests'> & {
  lastInteraction?: undefined;
  completedDialogues?: string[];
  completedQuests?: string[];
};

/**
 * Filter criteria for NPC queries
 */
export interface NPCFilterCriteria {
  searchQuery?: string; // Added missing property
  location?: string;
  faction?: string;
  minRelationship?: number;
  maxRelationship?: number;
  hasQuests?: boolean;
  hasTraits?: boolean;
  isAvailable?: boolean;
  tags?: string[];
}

/**
 * Sort options for NPC lists
 */
export interface NPCSortOptions {
  field: 'name' | 'relationshipValue' | 'location' | 'lastInteraction';
  direction: 'asc' | 'desc';
}

// ============================================================================
// STATE CONSTANTS
// ============================================================================

/**
 * Default initial state for the NPC system
 */
export const DEFAULT_NPC_STATE: NPCState = {
  npcs: {},
  discoveredNPCs: [],
  currentInteraction: null,
  dialogueHistory: [],
  relationshipChanges: [],
  loading: false,
  error: null
};

/**
 * Relationship thresholds for UI and gameplay logic
 */
export const RELATIONSHIP_THRESHOLDS = {
  HOSTILE: -50,
  SUSPICIOUS: -10,
  NEUTRAL: 0,
  ACQUAINTANCE: 10,
  FRIEND: 25,
  ALLY: 50,
  TRUSTED: 75,
  BELOVED: 90
} as const;

// ============================================================================
// ADDITIONAL MISSING TYPES
// ============================================================================

/**
 * NPC status enumeration
 */
export type NPCStatus = 
  | 'available'
  | 'busy' 
  | 'traveling'
  | 'sleeping'
  | 'hostile'
  | 'dead'
  | 'unknown';

/**
 * Types of interactions possible with NPCs
 */
export type InteractionType = 
  | 'dialogue'
  | 'trade'
  | 'quest'
  | 'trait_sharing'
  | 'gift'
  | 'challenge';

/**
 * Result of dialogue interaction
 */
export interface DialogueResult {
  success: boolean;
  npcResponse: string;
  relationshipChange?: number;
  rewards?: string[];
}

/**
 * Player dialogue choice
 */
export interface DialogueChoice {
  id: string;
  text: string;
  emotionalTone?: 'friendly' | 'neutral' | 'aggressive' | 'flirty' | 'formal';
  requirements?: DialogueRequirement[];
}

/**
 * Updated payload interfaces to match slice expectations
 */
export interface UpdateNPCRelationshipPayload {
  npcId: string;
  change: number;
  reason?: string;
}

export interface StartInteractionPayload {
  npcId: string;
  type: InteractionType;
  context?: Record<string, any>;
}

export interface ProcessDialoguePayload {
  npcId: string;
  choiceId: string;
  playerText: string;
}

// ============================================================================
// LEGACY TYPE COMPATIBILITY (Deprecated)
// ============================================================================

/**
 * @deprecated Use NPCState instead. This will be removed in a future version.
 */
export interface NpcsState {
  npcs: Record<string, NpcState>;
}

/**
 * @deprecated Use NPC instead. This will be removed in a future version.
 */
export interface NpcState {
  id: string;
  name: string;
  location: string;
  relationshipValue: number;
  connectionDepth?: number;
  loyalty?: number;
  status?: string;
  traits?: Record<string, NpcTraitInfo>;
  sharedTraitSlots?: NpcSharedTraitSlot[];
}

/**
 * @deprecated Use NPCTrait instead. This will be removed in a future version.
 */
export interface NpcTraitInfo {
  id: string;
  isVisible: boolean;
  relationshipRequirement?: number;
}

/**
 * @deprecated Use NPCSharedTraitSlot instead. This will be removed in a future version.
 */
export interface NpcSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null;
}

/**
 * @deprecated Use UpdateRelationshipPayload instead. This will be removed in a future version.
 */
export interface UpdateNpcRelationshipPayload {
  npcId: string;
  value: number;
}

/**
 * @deprecated Use SetNPCStatusPayload instead. This will be removed in a future version.
 */
export interface AddNpcTraitPayload {
  npcId: string;
  traitId: string;
  traitInfo: NpcTraitInfo;
}
