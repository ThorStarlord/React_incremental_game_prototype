/**
 * NPC-related action type definitions
 * 
 * This module defines the types and interfaces for NPC actions
 * in the game.
 * 
 * @module npcActionTypes
 */

/**
 * NPC action type constants
 */
export const NPC_ACTIONS = {
  UPDATE_NPC_RELATIONSHIP: 'npc/updateRelationship' as const,
  COMPLETE_NPC_FAVOR: 'npc/completeFavor' as const,
  ADD_NPC_FAVOR: 'npc/addFavor' as const,
  TRIGGER_NPC_DIALOGUE: 'npc/triggerDialogue' as const,
  UPDATE_NPC_POSITION: 'npc/updatePosition' as const,
  UPDATE_NPC_SCHEDULE: 'npc/updateSchedule' as const,
  DECLINE_NPC_FAVOR: 'npc/declineFavor' as const,
  ADD_NPC: 'npc/addNpc' as const,
  UPDATE_NPC: 'npc/updateNpc' as const,
  REMOVE_NPC: 'npc/removeNpc' as const,
  
  /**
   * Natural decay of NPC relationships over time
   */
  DECAY_RELATIONSHIPS: 'npc/decayRelationships' as const,
};

// Create a union type of all NPC action types
export type NpcActionType = typeof NPC_ACTIONS[keyof typeof NPC_ACTIONS];

/**
 * Base NPC action interface
 */
export interface NpcAction {
  type: NpcActionType;
  payload?: any;
}

/**
 * Update NPC relationship payload
 */
export interface UpdateNpcRelationshipPayload {
  npcId: string;
  changeAmount: number;
  reason?: string;
  timestamp?: number;
}

/**
 * Complete NPC favor payload
 */
export interface CompleteNpcFavorPayload {
  npcId: string;
  favorId: string;
  success: boolean;
  timestamp?: number;
}

/**
 * Add NPC favor payload
 */
export interface AddNpcFavorPayload {
  npcId: string;
  favor: {
    id: string;
    name: string;
    description: string;
    difficulty?: number;
    rewards?: Record<string, any>;
    [key: string]: any;
  };
}

/**
 * Trigger NPC dialogue payload
 */
export interface TriggerNpcDialoguePayload {
  npcId: string;
  dialogueId: string;
  options?: Record<string, any>;
}

/**
 * Interface for NPC action payload with an NPC ID
 */
export interface NpcIdPayload {
  npcId: string;
  timestamp?: number;
}

/**
 * Interface for NPC relationship update payload
 */
export interface NpcRelationshipPayload extends NpcIdPayload {
  changeAmount: number;
  reason?: string;
}

/**
 * Interface for NPC favor completion payload
 */
export interface NpcFavorPayload extends NpcIdPayload {
  favorId: string;
  success?: boolean;
}

/**
 * Interface for NPC dialogue trigger payload
 */
export interface NpcDialoguePayload extends NpcIdPayload {
  dialogueId: string;
  playerChoices?: string[];
}
