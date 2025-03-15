/**
 * NPC Actions
 * ===========
 * 
 * This file contains all action creators related to NPCs (non-player characters) in the
 * incremental RPG. These actions handle NPC relationships, favors, dialogues, and
 * other NPC-specific state changes.
 * 
 * @module npcActions
 */

import { NPC_ACTIONS } from './actionTypes';

/**
 * Update relationship with an NPC
 * 
 * @param {string} npcId - ID of the NPC
 * @param {number} changeAmount - Amount to change the relationship by (positive or negative)
 * @param {string} [reason] - Reason for the relationship change
 * @returns {Object} The UPDATE_NPC_RELATIONSHIP action
 * 
 * @example
 * // Increase relationship with a merchant after a successful trade
 * updateNpcRelationship('merchant_sara', 5, 'Successful trade')
 */
export const updateNpcRelationship = (npcId: string, changeAmount: number, reason?: string) => ({
  type: NPC_ACTIONS.UPDATE_NPC_RELATIONSHIP,
  payload: { 
    npcId, 
    changeAmount, 
    reason,
    timestamp: Date.now()
  }
});

/**
 * Complete a favor for an NPC
 * 
 * @param {string} npcId - ID of the NPC
 * @param {string} favorId - ID of the favor being completed
 * @param {boolean} [success=true] - Whether the favor was completed successfully
 * @returns {Object} The COMPLETE_NPC_FAVOR action
 * 
 * @example
 * // Successfully complete a delivery favor
 * completeNpcFavor('farmer_john', 'deliver_seeds')
 * 
 * // Fail a combat-related favor
 * completeNpcFavor('guard_captain', 'defeat_bandits', false)
 */
export const completeNpcFavor = (npcId: string, favorId: string, success: boolean = true) => ({
  type: NPC_ACTIONS.COMPLETE_NPC_FAVOR,
  payload: {
    npcId,
    favorId,
    success,
    timestamp: Date.now()
  }
});

/**
 * Add a new favor to an NPC's available favors
 * 
 * @param {string} npcId - ID of the NPC
 * @param {Object} favor - The favor data
 * @returns {Object} The ADD_NPC_FAVOR action
 * 
 * @example
 * // Add a new delivery quest to an NPC
 * addNpcFavor('merchant_sara', {
 *   id: 'deliver_package',
 *   name: 'Urgent Delivery',
 *   description: 'Deliver this package to the blacksmith before nightfall',
 *   difficulty: 2,
 *   rewards: {
 *     essence: 10,
 *     items: [{ id: 'gold_coin', quantity: 50 }]
 *   }
 * })
 */
export const addNpcFavor = (npcId: string, favor: any) => ({
  type: NPC_ACTIONS.ADD_NPC_FAVOR,
  payload: {
    npcId,
    favor,
    timestamp: Date.now()
  }
});

/**
 * Decline to do a favor for an NPC
 * 
 * @param {string} npcId - ID of the NPC
 * @param {string} favorId - ID of the favor being declined
 * @returns {Object} The DECLINE_NPC_FAVOR action
 * 
 * @example
 * // Decline to help with a dangerous task
 * declineNpcFavor('villager_mike', 'clear_mine')
 */
export const declineNpcFavor = (npcId: string, favorId: string) => ({
  type: NPC_ACTIONS.DECLINE_NPC_FAVOR,
  payload: {
    npcId,
    favorId,
    timestamp: Date.now()
  }
});

/**
 * Add a new NPC to the game
 * 
 * @param {Object} npc - The NPC data
 * @returns {Object} The ADD_NPC action
 * 
 * @example
 * // Add a new shopkeeper NPC
 * addNpc({
 *   id: 'alchemist_eliza',
 *   name: 'Eliza the Alchemist',
 *   type: 'shopkeeper',
 *   location: 'market_district',
 *   relationship: 0,
 *   dialogue: {
 *     greeting: "Welcome to my shop! Need any potions today?"
 *   }
 * })
 */
export const addNpc = (npc: any) => ({
  type: NPC_ACTIONS.ADD_NPC,
  payload: npc
});

/**
 * Update an existing NPC's data
 * 
 * @param {string} npcId - ID of the NPC to update
 * @param {Object} updates - The fields to update
 * @returns {Object} The UPDATE_NPC action
 * 
 * @example
 * // Update an NPC's location and dialogue
 * updateNpc('guard_captain', {
 *   location: 'castle_gate',
 *   dialogue: {
 *     greeting: "The castle is on high alert today. State your business."
 *   }
 * })
 */
export const updateNpc = (npcId: string, updates: any) => ({
  type: NPC_ACTIONS.UPDATE_NPC,
  payload: {
    npcId,
    updates,
    timestamp: Date.now()
  }
});

/**
 * Remove an NPC from the game
 * 
 * @param {string} npcId - ID of the NPC to remove
 * @returns {Object} The REMOVE_NPC action
 * 
 * @example
 * // Remove an NPC after they've been defeated or completed their role
 * removeNpc('bandit_leader')
 */
export const removeNpc = (npcId: string) => ({
  type: NPC_ACTIONS.REMOVE_NPC,
  payload: {
    npcId,
    timestamp: Date.now()
  }
});
