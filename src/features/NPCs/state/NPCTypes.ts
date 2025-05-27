/**
 * @file NPCTypes.ts
 * @description TypeScript interfaces and types for the NPC system
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
  discoveredAt: number; // Added: Timestamp when NPC was first discovered by the player
}

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
 * Trait information specific to NPCs including acquisition requirements
 */
export interface NPCTraitInfo {
  id: string;
  name?: string;
  description?: string; // Added: Description property for trait details
  category: 'physical' | 'combat' | 'social'; // Added: Category property for trait classification
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'; // Added: Rarity property for trait power level
  effects: Record<string, number>; // Added: Effects property for trait bonuses
  requirements: {
    relationshipLevel: number;
  }; // Added: Requirements structure for trait acquisition
  essenceCost?: number;
  prerequisites?: string[];
  isVisible?: boolean;
  discovered: boolean; // Added: Discovery tracking for trait visibility
  cost: number; // Added: Cost property for trait acquisition
  relationshipRequirement?: number; // Added: Relationship requirement for trait acquisition
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
  message?: string;
  rewards?: string[];
}

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
 * Dialogue entry in conversation history
 */
export interface DialogueEntry {
  id: string;
  npcId: string;
  timestamp: number;
  playerText: string;
  npcResponse: string;
  relationshipChange?: number;
}

/**
 * Record of relationship changes over time
 */
export interface RelationshipChangeEntry {
  id: string;
  npcId: string;
  timestamp: number;
  oldValue: number;
  newValue: number;
  reason: string;
}

/**
 * Current interaction session data
 */
export interface NPCInteraction {
  npcId: string;
  startTime: number;
  type: InteractionType;
  context?: Record<string, any>;
}

// ============================================================================
// ACTION PAYLOAD TYPES
// ============================================================================

/**
 * Payload for updating NPC relationship values
 */
export interface UpdateNPCRelationshipPayload {
  npcId: string;
  change: number;
  reason?: string;
}

/**
 * Payload for discovering new NPCs
 */
export interface DiscoverNPCPayload {
  npcId: string;
  location?: string;
  discoveryMethod?: string;
}

/**
 * Payload for starting interaction
 */
export interface StartInteractionPayload {
  npcId: string;
  type: InteractionType;
  context?: Record<string, any>;
}

/**
 * Payload for processing dialogue
 */
export interface ProcessDialoguePayload {
  npcId: string;
  choiceId: string;
  playerText: string;
}

/**
 * Payload for sharing traits with NPCs
 */
export interface ShareTraitPayload {
  npcId: string;
  traitId: string;
  slotIndex: number;
}

// ============================================================================
// STATE INTERFACES
// ============================================================================

/**
 * Enhanced NPC state for the Redux store
 */
export interface NPCState {
  npcs: Record<string, NPC>;
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null;
  dialogueHistory: DialogueEntry[];
  relationshipChanges: RelationshipChangeEntry[];
  loading: boolean;
  error: string | null;
}

/**
 * Default initial state for the NPC system
 * Exported as a value (not type) for use in Redux slice
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

// ============================================================================
// RELATIONSHIP CONSTANTS
// ============================================================================

export const RELATIONSHIP_THRESHOLDS = {
  HOSTILE: -50,
  SUSPICIOUS: -10,
  NEUTRAL: 0,
  ACQUAINTANCE: 10,
  FRIEND: 25,
  ALLY: 50,
  TRUSTED: 75,
  BELOVED: 90,
} as const;

/**
 * Get the relationship tier name based on the relationship value
 */
export function getRelationshipTier(value: number): string {
  if (value >= RELATIONSHIP_THRESHOLDS.BELOVED) return 'Beloved';
  if (value >= RELATIONSHIP_THRESHOLDS.TRUSTED) return 'Trusted';
  if (value >= RELATIONSHIP_THRESHOLDS.ALLY) return 'Ally';
  if (value >= RELATIONSHIP_THRESHOLDS.FRIEND) return 'Friend';
  if (value >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 'Acquaintance';
  if (value >= RELATIONSHIP_THRESHOLDS.NEUTRAL) return 'Neutral';
  if (value >= RELATIONSHIP_THRESHOLDS.SUSPICIOUS) return 'Suspicious';
  return 'Hostile';
}

// ============================================================================
// PLACEHOLDER TYPES (for future implementation)
// ============================================================================

export interface NPCInventory {
  items: any[];
  currency: number;
}

export interface NPCService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  isAvailable: boolean;
}

export interface NPCPersonality {
  traits: string[];
  preferences: Record<string, number>;
  dislikes: Record<string, number>;
}

export interface NPCSchedule {
  [timeSlot: string]: {
    location: string;
    availability: boolean;
    activities: string[];
  };
}
