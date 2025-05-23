/**
 * @file NPCTypes.ts
 * @description TypeScript interfaces and types for the NPC system
 */

export interface NPC {
  id: string;
  name: string;
  description: string;
  location: string;
  avatar?: string;
  faction?: string;
  
  // Relationship data
  relationshipValue: number;
  connectionDepth: number;
  loyaltyLevel: number;
  
  // Interaction data
  availableDialogues: string[];
  completedDialogues: string[];
  availableQuests: string[];
  completedQuests: string[];
  
  // Traits and abilities
  traits: Record<string, NPCTrait>;
  teachableTraits: string[];
  sharedTraitSlots: number;
  
  // Trading and services
  inventory?: NPCInventory;
  services?: NPCService[];
  
  // Behavioral data
  personality: NPCPersonality;
  schedule?: NPCSchedule;
  
  // State tracking
  lastInteraction?: Date;
  isDiscovered: boolean;
  isAvailable: boolean;
}

export interface NPCTrait {
  id: string;
  name: string;
  relationshipRequirement: number;
  essenceCost: number;
  prerequisites?: string[];
}

export interface NPCInventory {
  items: NPCInventoryItem[];
  currency: number;
  restockInterval: number;
  lastRestock?: Date;
}

export interface NPCInventoryItem {
  id: string;
  quantity: number;
  price: number;
  relationshipDiscount?: number;
}

export interface NPCService {
  id: string;
  name: string;
  description: string;
  cost: number;
  relationshipRequirement: number;
  type: 'skill_training' | 'trait_modification' | 'information' | 'other';
}

export interface NPCPersonality {
  traits: string[];
  likes: string[];
  dislikes: string[];
  conversationStyle: 'formal' | 'casual' | 'mysterious' | 'friendly' | 'hostile';
}

export interface NPCSchedule {
  [timeSlot: string]: {
    location: string;
    availability: boolean;
    activities: string[];
  };
}

export interface DialogueNode {
  id: string;
  text: string;
  speaker: 'npc' | 'player';
  options: DialogueOption[];
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
}

export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string;
  requirements?: DialogueRequirement[];
  effects?: DialogueEffect[];
}

export interface DialogueCondition {
  type: 'relationship' | 'trait' | 'quest' | 'item' | 'stat';
  target: string;
  operator: 'gte' | 'lte' | 'eq' | 'has' | 'not_has';
  value: number | string | boolean;
}

export interface DialogueRequirement extends DialogueCondition {}

export interface DialogueEffect {
  type: 'relationship' | 'essence' | 'item' | 'quest' | 'trait';
  target: string;
  operation: 'add' | 'subtract' | 'set' | 'start' | 'complete';
  value: number | string;
  message?: string;
}

export interface NPCInteraction {
  npcId: string;
  type: 'dialogue' | 'trade' | 'quest' | 'service' | 'gift';
  timestamp: Date;
  data: any;
  relationshipChange?: number;
}

// State interfaces
export interface NPCState {
  npcs: Record<string, NPC>;
  discoveredNPCs: string[];
  currentInteraction: NPCInteraction | null;
  dialogueHistory: Record<string, string[]>; // npcId -> completed dialogue IDs
  relationshipChanges: NPCRelationshipChange[];
  loading: boolean;
  error: string | null;
}

export interface NPCRelationshipChange {
  npcId: string;
  oldValue: number;
  newValue: number;
  reason: string;
  timestamp: Date;
}

// Action payload types
export interface UpdateRelationshipPayload {
  npcId: string;
  change: number;
  reason: string;
}

export interface StartDialoguePayload {
  npcId: string;
  dialogueId: string;
}

export interface CompleteDialoguePayload {
  npcId: string;
  dialogueId: string;
  effects?: DialogueEffect[];
}

export interface DiscoverNPCPayload {
  npcId: string;
  location: string;
}

export interface TradeWithNPCPayload {
  npcId: string;
  items: { itemId: string; quantity: number; price: number }[];
}

export interface ShareTraitPayload {
  npcId: string;
  traitId: string;
  slotIndex: number;
}
