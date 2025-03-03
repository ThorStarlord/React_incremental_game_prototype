/**
 * @file relationshipUtils.ts
 * @description Utilities for managing NPC relationships in the incremental RPG.
 * 
 * This module provides functions to manipulate the relationship values between
 * the player and NPCs in the game. Relationships are numeric values from 0 to 100,
 * which are translated to tiers like "ENEMY", "NEUTRAL", "FRIEND", etc.
 * 
 * These utilities handle:
 * - Updating relationship values with NPCs
 * - Decaying relationships over time
 * - Determining relationship tiers based on numeric values
 * - Providing notifications for relationship changes
 * 
 * Relationship values directly impact gameplay by affecting:
 * - Available dialogue options
 * - Quest availability
 * - Shop prices and inventory
 * - NPC behavior and assistance
 * - Special events and interactions
 * 
 * @example
 * // Increase relationship with an NPC after completing a quest
 * const newState = updateRelationship(
 *   currentState, 
 *   { npcId: 'village_elder', amount: 10, notifyPlayer: true }
 * );
 */
import { GameState } from '../initialState';

/**
 * Interface for an NPC with relationship value
 */
interface NPC {
  id: string;
  name: string;
  relationship?: number;
  [key: string]: any;
}

/**
 * Interface for game state with NPCs and notifications
 */
interface GameStateWithNPCs extends GameState {
  npcs: NPC[];
  notifications?: Array<{
    id: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    duration: number;
  }>;
}

/**
 * Interface for relationship update payload
 */
interface UpdateRelationshipPayload {
  /** ID of the NPC whose relationship is being updated */
  npcId: string;
  
  /** 
   * Amount to change the relationship
   * - Positive values improve the relationship
   * - Negative values worsen the relationship
   */
  amount: number;
  
  /**
   * Whether to show a notification to the player about the change
   * @default false
   */
  notifyPlayer?: boolean;
  
  /**
   * Source of the relationship change (for tracking and side effects)
   * @example 'quest_completion', 'gift', 'conversation'
   */
  source?: string;
}

/**
 * Update relationship between player and an NPC
 * 
 * This function modifies the relationship value for a specific NPC and
 * optionally shows a notification to the player. The relationship value
 * is clamped between 0 and 100.
 * 
 * @param state Current game state
 * @param payload Information about relationship change
 * @returns Updated game state with modified NPC relationship
 * 
 * @example
 * // Improve relationship after completing a quest
 * dispatch({
 *   type: 'UPDATE_STATE',
 *   payload: updateRelationship(state, {
 *     npcId: 'merchant',
 *     amount: 15,
 *     notifyPlayer: true,
 *     source: 'quest_completion'
 *   })
 * });
 * 
 * @example
 * // Worsen relationship after stealing
 * const newState = updateRelationship(state, {
 *   npcId: 'guard',
 *   amount: -20,
 *   notifyPlayer: true,
 *   source: 'caught_stealing'
 * });
 */
export const updateRelationship = (
  state: GameStateWithNPCs, 
  payload: UpdateRelationshipPayload
): GameStateWithNPCs => {
  const { npcId, amount, notifyPlayer } = payload;
  
  // Update NPC relationship
  const newState = {
    ...state,
    npcs: state.npcs.map(npc => 
      npc.id === npcId
        ? { 
            ...npc,
            // Ensure relationship stays within 0-100 bounds
            relationship: Math.min(100, Math.max(0, (npc.relationship || 0) + amount))
          }
        : npc
    )
  };
  
  // Add notification if requested
  if (notifyPlayer) {
    const npc = newState.npcs.find(n => n.id === npcId);
    const message = amount > 0
      ? `Your relationship with ${npc?.name || npcId} has improved (+${amount})`
      : `Your relationship with ${npc?.name || npcId} has worsened (${amount})`;
      
    return {
      ...newState,
      notifications: [
        ...(newState.notifications || []),
        {
          id: Date.now(),
          message,
          type: amount > 0 ? 'success' : 'warning',
          duration: 3000
        }
      ]
    };
  }
  
  return newState;
};

/**
 * Decay all NPC relationships over time
 * 
 * This function gradually reduces positive relationships over time to simulate
 * the natural decay of relationships when the player doesn't interact with NPCs.
 * Typically called by a game timer at regular intervals.
 * 
 * Note: Only positive relationships above the neutral threshold (50) are decayed,
 * and they will never decay below neutral.
 * 
 * @param state Current game state
 * @param decayAmount Amount to decay relationships (defaults to 1)
 * @returns Updated game state with decayed relationships
 * 
 * @example
 * // In a game timer effect
 * useEffect(() => {
 *   const timer = setInterval(() => {
 *     dispatch({
 *       type: 'UPDATE_STATE',
 *       payload: decayRelationships(state)
 *     });
 *   }, 86400000); // Once per day
 *   
 *   return () => clearInterval(timer);
 * }, [state, dispatch]);
 */
export const decayRelationships = (
  state: GameStateWithNPCs,
  decayAmount: number = 1
): GameStateWithNPCs => {
  // Skip decay if feature is disabled
  if (state.settings?.gameplay?.relationshipDecayDisabled) {
    return state;
  }
  
  return {
    ...state,
    npcs: state.npcs.map(npc => ({
      ...npc,
      // Only decay positive relationships, and ensure they don't go below neutral
      relationship: npc.relationship && npc.relationship > 50
        ? Math.max(50, npc.relationship - decayAmount)
        : npc.relationship || 0
    }))
  };
};

/**
 * Get the current relationship tier with an NPC
 * 
 * Translates the numeric relationship value (0-100) to a named tier that
 * can be used for gameplay decisions and UI display.
 * 
 * @param state Current game state
 * @param npcId ID of the NPC
 * @returns Relationship tier string or undefined if NPC not found
 * 
 * @example
 * // Check if an NPC will offer special quests
 * const npcRelationship = getRelationshipTier(state, 'elder');
 * if (npcRelationship === 'FRIEND' || npcRelationship === 'ALLY') {
 *   // Show special quest options
 * }
 * 
 * @example
 * // Determine shop prices based on relationship
 * const relationship = getRelationshipTier(state, 'merchant');
 * let discount = 0;
 * 
 * switch(relationship) {
 *   case 'FRIEND': discount = 0.05; break;
 *   case 'ALLY': discount = 0.10; break;
 *   case 'TRUSTED': discount = 0.15; break;
 *   case 'BELOVED': discount = 0.20; break;
 * }
 */
export const getRelationshipTier = (
  state: GameStateWithNPCs,
  npcId: string
): string | undefined => {
  const npc = state.npcs.find(n => n.id === npcId);
  if (!npc) return undefined;
  
  const relationship = npc.relationship || 0;
  
  // Return appropriate tier based on relationship value
  if (relationship >= 90) return 'BELOVED';
  if (relationship >= 75) return 'TRUSTED';
  if (relationship >= 60) return 'ALLY';
  if (relationship >= 50) return 'FRIEND';
  if (relationship >= 40) return 'ACQUAINTANCE';
  if (relationship >= 25) return 'NEUTRAL';
  if (relationship >= 10) return 'SUSPICIOUS';
  if (relationship >= 1) return 'UNFRIENDLY';
  return 'ENEMY';
};

/**
 * Get relationship color for UI representation
 * 
 * Returns a color code corresponding to the relationship tier for use in UI elements.
 * 
 * @param tier Relationship tier string
 * @returns CSS color string
 * 
 * @example
 * const relationshipTier = getRelationshipTier(state, 'village_elder');
 * const colorCode = getRelationshipColor(relationshipTier);
 * 
 * return <span style={{ color: colorCode }}>{npc.name}</span>;
 */
export const getRelationshipColor = (tier: string): string => {
  switch (tier) {
    case 'BELOVED': return '#9c27b0'; // Purple
    case 'TRUSTED': return '#3f51b5'; // Indigo
    case 'ALLY': return '#2196f3';    // Blue
    case 'FRIEND': return '#4caf50';  // Green
    case 'ACQUAINTANCE': return '#8bc34a'; // Light Green
    case 'NEUTRAL': return '#9e9e9e'; // Gray
    case 'SUSPICIOUS': return '#ff9800'; // Orange
    case 'UNFRIENDLY': return '#ff5722'; // Deep Orange
    case 'ENEMY': return '#f44336';   // Red
    default: return '#9e9e9e';        // Gray (default)
  }
};

/**
 * Update relationship with multiple NPCs at once
 * 
 * Useful for faction-wide relationship changes or group events.
 * 
 * @param state Current game state
 * @param npcIds Array of NPC IDs to update
 * @param amount Change amount for each NPC
 * @param notifyPlayer Whether to show notifications (only one summary notification will show)
 * @returns Updated game state
 * 
 * @example
 * // After helping a village, improve relationship with all villagers
 * const villagerNpcs = state.npcs
 *   .filter(npc => npc.faction === 'village')
 *   .map(npc => npc.id);
 * 
 * const newState = updateGroupRelationship(
 *   state,
 *   villagerNpcs,
 *   5,
 *   true
 * );
 */
export const updateGroupRelationship = (
  state: GameStateWithNPCs,
  npcIds: string[],
  amount: number,
  notifyPlayer: boolean = false
): GameStateWithNPCs => {
  // First update all relationships
  let newState = { ...state };
  
  npcIds.forEach(id => {
    newState = updateRelationship(newState, { 
      npcId: id, 
      amount, 
      notifyPlayer: false // Don't notify for each individual update
    });
  });
  
  // Add a single summary notification if requested
  if (notifyPlayer && npcIds.length > 0) {
    const message = amount > 0
      ? `Your relationship with ${npcIds.length} NPCs has improved (+${amount})`
      : `Your relationship with ${npcIds.length} NPCs has worsened (${amount})`;
      
    return {
      ...newState,
      notifications: [
        ...(newState.notifications || []),
        {
          id: Date.now(),
          message,
          type: amount > 0 ? 'success' : 'warning',
          duration: 3000
        }
      ]
    };
  }
  
  return newState;
};
