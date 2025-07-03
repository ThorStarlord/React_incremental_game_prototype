/**
 * @file NPCTypes.ts
 * @description TypeScript interfaces and types for the NPC system
 */

/**
 * Type definitions for the NPCs system
 */

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
 * Interaction type enumeration
 */
export type InteractionType =
  | 'dialogue'
  | 'trade'
  | 'quest'
  | 'trait_sharing'
  | 'gift'
  | 'challenge';

/**
 * Core NPC interface
 */
export interface NPC {
  id: string;
  name: string;
  description?: string;
  location: string;
  avatar?: string;
  faction?: string;
  affinity: number;
  connectionDepth: number;
  loyalty: number;
  availableDialogues: string[];
  completedDialogues: string[];
  availableQuests: string[];
  completedQuests: string[];
  traits?: Record<string, NPCTraitInfo>;
  availableTraits: string[];
  innateTraits?: string[];
  sharedTraitSlots?: NPCSharedTraitSlot[];
  inventory?: NPCInventory;
  services?: NPCService[];
  personality?: NPCPersonality;
  schedule?: NPCSchedule;
  status: NPCStatus;
  lastInteraction?: number;
  isDiscovered?: boolean;
  isAvailable?: boolean;
  discoveredAt: number;
}

/**
 * NPC trait information interface
 */
export interface NPCTraitInfo {
  id: string;
  name?: string;
  description?: string;
  category: 'physical' | 'combat' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effects: Record<string, number>;
  requirements: {
    relationshipLevel: number;
  };
  essenceCost?: number;
  prerequisites?: string[];
  isVisible?: boolean;
  discovered: boolean;
  cost: number;
  relationshipRequirement?: number;
}

/**
 * NPC shared trait slot interface
 */
export interface NPCSharedTraitSlot {
  id: string;
  index: number;
  traitId?: string | null;
  isUnlocked: boolean;
  unlockRequirement?: number;
}

/**
 * NPC personality interface (placeholder)
 */
export interface NPCPersonality {
  traits: string[];
  preferences: Record<string, number>;
  dislikes: Record<string, number>;
}

/**
 * NPC inventory interface (placeholder)
 */
export interface NPCInventory {
  items: any[];
  currency: number;
}

/**
 * NPC service interface (placeholder)
 */
export interface NPCService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  isAvailable: boolean;
}

/**
 * NPC schedule interface (placeholder)
 */
export interface NPCSchedule {
  [timeSlot: string]: {
    location: string;
    availability: boolean;
    activities: string[];
  };
}

/**
 * Current interaction session interface
 */
export interface NPCInteraction {
  npcId: string;
  startTime: number;
  type: InteractionType;
  context?: Record<string, any>;
}

/**
 * Interaction result interface
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
 * Dialogue entry interface
 */
export interface DialogueEntry {
  id: string;
  npcId: string;
  timestamp: number;
  speaker: 'player' | 'npc' | 'system';
  playerText: string;
  npcResponse: string;
  relationshipChange?: number;
}

/**
 * Relationship change entry interface
 */
export interface RelationshipChangeEntry {
  id: string;
  npcId: string;
  timestamp: number;
  oldValue: number;
  newAffinity: number;
  reason: string;
}

/**
 * Core NPCs state interface
 * FIXED: Renamed relationshipChanges to relationshipHistory to match the slice logic.
 */
export interface NPCState {
  npcs: Record<string, NPC>;
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null;
  dialogueHistory: DialogueEntry[];
  relationshipHistory: RelationshipChangeEntry[]; // FIXED: This property was missing/mismatched.
  loading: boolean;
  error: string | null;
  selectedNPCId: string | null;
}