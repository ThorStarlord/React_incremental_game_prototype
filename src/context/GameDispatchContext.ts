/**
 * @file GameDispatchContext.ts
 * @description Defines the TypeScript types for game actions and creates a React context
 * for dispatching these actions throughout the application.
 * 
 * This module provides:
 * 1. Type definitions for all possible game actions
 * 2. A context for accessing the dispatch function with proper typing
 * 3. A custom hook for safely accessing the dispatch function
 * 4. Helper functions for creating common actions
 * 
 * The dispatch system follows the Redux pattern where each action has:
 * - A unique type identifier (from ACTION_TYPES constant)
 * - An optional payload containing data needed for the action
 * 
 * @example
 * // Basic usage in a component
 * function PlayerComponent() {
 *   const dispatch = useGameDispatch();
 *   
 *   // Dispatch an action to gain experience
 *   const handleDefeatEnemy = () => {
 *     dispatch({
 *       type: ACTION_TYPES.GAIN_EXPERIENCE,
 *       payload: { amount: 50 }
 *     });
 *   };
 *   
 *   return <button onClick={handleDefeatEnemy}>Defeat Enemy</button>;
 * }
 */

import { createContext, useContext, Dispatch } from 'react';
import { GameAction } from './actions/types';
import { ACTION_TYPES } from './actions/actionTypes';
import { GameState } from './initialState';

/**
 * Base Action interface
 * All game actions extend this interface
 */
interface BaseAction {
  type: string;
}

// ==========================================
// Game Initialization Actions
// ==========================================

/**
 * Initialize game data action
 * Used when loading a saved game or starting a new game
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.INITIALIZE_GAME_DATA,
 *   payload: savedGameState
 * });
 */
interface InitializeGameDataAction extends BaseAction {
  type: typeof ACTION_TYPES.INITIALIZE_GAME_DATA;
  payload: GameState;
}

/**
 * Reset game action
 * Used to reset the game to its initial state
 * 
 * @example
 * dispatch({ type: ACTION_TYPES.RESET_GAME });
 */
interface ResetGameAction extends BaseAction {
  type: typeof ACTION_TYPES.RESET_GAME;
}

// ==========================================
// Game Time Actions
// ==========================================

/**
 * Advance game time action
 * Used to progress the in-game time by a specified amount
 * 
 * @example
 * // Advance time by default amount
 * dispatch({ type: ACTION_TYPES.ADVANCE_TIME });
 * 
 * // Advance time by specific amount
 * dispatch({
 *   type: ACTION_TYPES.ADVANCE_TIME,
 *   payload: { amount: 5 }
 * });
 */
interface AdvanceTimeAction extends BaseAction {
  type: typeof ACTION_TYPES.ADVANCE_TIME;
  payload?: { amount?: number };
}

// ==========================================
// Player Actions
// ==========================================

/**
 * Update player action
 * Used to update any part of the player state
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.UPDATE_PLAYER,
 *   payload: { name: "New Name" }
 * });
 * 
 * dispatch({
 *   type: ACTION_TYPES.UPDATE_PLAYER,
 *   payload: {
 *     attributes: { strength: player.attributes.strength + 1 }
 *   }
 * });
 */
interface UpdatePlayerAction extends BaseAction {
  type: typeof ACTION_TYPES.UPDATE_PLAYER;
  payload: Partial<GameState['player']>;
}

/**
 * Gain experience action
 * Used when the player earns experience points
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.GAIN_EXPERIENCE,
 *   payload: { amount: 100 }
 * });
 */
interface GainExperienceAction extends BaseAction {
  type: typeof ACTION_TYPES.GAIN_EXPERIENCE;
  payload: { amount: number };
}

/**
 * Level up action
 * Used when the player has enough experience to level up
 * 
 * @example
 * dispatch({ type: ACTION_TYPES.LEVEL_UP });
 */
interface LevelUpAction extends BaseAction {
  type: typeof ACTION_TYPES.LEVEL_UP;
}

// ==========================================
// Resource Management Actions
// ==========================================

/**
 * Gain resource action
 * Used when the player acquires any type of resource
 * 
 * @example
 * // Gain gold
 * dispatch({
 *   type: ACTION_TYPES.GAIN_RESOURCE,
 *   payload: { resourceType: 'gold', amount: 50 }
 * });
 * 
 * // Gain materials
 * dispatch({
 *   type: ACTION_TYPES.GAIN_RESOURCE,
 *   payload: { resourceType: 'materials.wood', amount: 10 }
 * });
 */
interface GainResourceAction extends BaseAction {
  type: typeof ACTION_TYPES.GAIN_RESOURCE;
  payload: { 
    resourceType: keyof GameState['resources'] | string;
    amount: number;
  };
}

/**
 * Spend resource action
 * Used when the player spends any type of resource
 * 
 * @example
 * // Spend gold
 * dispatch({
 *   type: ACTION_TYPES.SPEND_RESOURCE,
 *   payload: { resourceType: 'gold', amount: 25 }
 * });
 */
interface SpendResourceAction extends BaseAction {
  type: typeof ACTION_TYPES.SPEND_RESOURCE;
  payload: { 
    resourceType: keyof GameState['resources'] | string;
    amount: number;
  };
}

// ==========================================
// Essence Management Actions
// ==========================================

/**
 * Gain essence action
 * Used when the player gains essence (a special resource)
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.GAIN_ESSENCE,
 *   payload: { amount: 5 }
 * });
 */
interface GainEssenceAction extends BaseAction {
  type: typeof ACTION_TYPES.GAIN_ESSENCE;
  payload: { amount: number };
}

/**
 * Spend essence action
 * Used when the player spends essence on upgrades or abilities
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.SPEND_ESSENCE,
 *   payload: { amount: 10 }
 * });
 */
interface SpendEssenceAction extends BaseAction {
  type: typeof ACTION_TYPES.SPEND_ESSENCE;
  payload: { amount: number };
}

// ==========================================
// Inventory Actions
// ==========================================

/**
 * Add item action
 * Used when the player acquires an item
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.ADD_ITEM,
 *   payload: {
 *     item: {
 *       id: 'iron_sword',
 *       name: 'Iron Sword',
 *       type: 'weapon',
 *       stats: { physicalDamage: 5 },
 *       quantity: 1,
 *       value: 50
 *     }
 *   }
 * });
 */
interface AddItemAction extends BaseAction {
  type: typeof ACTION_TYPES.ADD_ITEM;
  payload: { item: GameState['inventory']['items'][0] };
}

/**
 * Remove item action
 * Used when an item is removed from inventory (used, sold, destroyed)
 * 
 * @example
 * // Remove a single item
 * dispatch({
 *   type: ACTION_TYPES.REMOVE_ITEM,
 *   payload: { itemId: 'health_potion_1' }
 * });
 * 
 * // Remove multiple of the same item
 * dispatch({
 *   type: ACTION_TYPES.REMOVE_ITEM,
 *   payload: { itemId: 'health_potion_1', quantity: 3 }
 * });
 */
interface RemoveItemAction extends BaseAction {
  type: typeof ACTION_TYPES.REMOVE_ITEM;
  payload: { itemId: string; quantity?: number };
}

/**
 * Use item action
 * Used when the player uses a consumable item
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.USE_ITEM,
 *   payload: { itemId: 'health_potion_1' }
 * });
 */
interface UseItemAction extends BaseAction {
  type: typeof ACTION_TYPES.USE_ITEM;
  payload: { itemId: string };
}

/**
 * Equip item action
 * Used when the player equips an item to a specific slot
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.EQUIP_ITEM,
 *   payload: { itemId: 'iron_sword', slot: 'weapon' }
 * });
 */
interface EquipItemAction extends BaseAction {
  type: typeof ACTION_TYPES.EQUIP_ITEM;
  payload: { 
    itemId: string;
    slot: keyof GameState['equipment'];
  };
}

/**
 * Unequip item action
 * Used when the player removes an item from an equipment slot
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.UNEQUIP_ITEM,
 *   payload: { slot: 'weapon' }
 * });
 */
interface UnequipItemAction extends BaseAction {
  type: typeof ACTION_TYPES.UNEQUIP_ITEM;
  payload: { slot: keyof GameState['equipment'] };
}

// ==========================================
// Quest Actions
// ==========================================

/**
 * Start quest action
 * Used when the player accepts a new quest
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.START_QUEST,
 *   payload: { questId: 'village_rats' }
 * });
 */
interface StartQuestAction extends BaseAction {
  type: typeof ACTION_TYPES.START_QUEST;
  payload: { questId: string };
}

/**
 * Complete quest action
 * Used when the player successfully completes a quest
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.COMPLETE_QUEST,
 *   payload: { questId: 'village_rats' }
 * });
 */
interface CompleteQuestAction extends BaseAction {
  type: typeof ACTION_TYPES.COMPLETE_QUEST;
  payload: { questId: string };
}

/**
 * Fail quest action
 * Used when the player fails a quest or it expires
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.FAIL_QUEST,
 *   payload: { questId: 'escort_merchant' }
 * });
 */
interface FailQuestAction extends BaseAction {
  type: typeof ACTION_TYPES.FAIL_QUEST;
  payload: { questId: string };
}

/**
 * Update quest progress action
 * Used to update progress on an active quest
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.UPDATE_QUEST_PROGRESS,
 *   payload: {
 *     questId: 'collect_herbs',
 *     progress: { herbsCollected: 5, totalRequired: 10 }
 *   }
 * });
 */
interface UpdateQuestProgressAction extends BaseAction {
  type: typeof ACTION_TYPES.UPDATE_QUEST_PROGRESS;
  payload: { 
    questId: string;
    progress: any; // This would be more specific based on quest structure
  };
}

// ==========================================
// Location Actions
// ==========================================

/**
 * Discover location action
 * Used when the player discovers a new location on the map
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.DISCOVER_LOCATION,
 *   payload: { locationId: 'ancient_ruins' }
 * });
 */
interface DiscoverLocationAction extends BaseAction {
  type: typeof ACTION_TYPES.DISCOVER_LOCATION;
  payload: { locationId: string };
}

/**
 * Travel to location action
 * Used when the player travels to a location
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.TRAVEL_TO_LOCATION,
 *   payload: { locationId: 'mountain_village' }
 * });
 */
interface TravelToLocationAction extends BaseAction {
  type: typeof ACTION_TYPES.TRAVEL_TO_LOCATION;
  payload: { locationId: string };
}

// ==========================================
// Combat Actions
// ==========================================

/**
 * Start combat action
 * Used when the player enters combat with an enemy
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.START_COMBAT,
 *   payload: {
 *     enemy: {
 *       id: 'forest_wolf',
 *       name: 'Forest Wolf',
 *       level: 2,
 *       health: 50,
 *       // other enemy properties...
 *     }
 *   }
 * });
 */
interface StartCombatAction extends BaseAction {
  type: typeof ACTION_TYPES.START_COMBAT;
  payload: { enemy: any }; // Would be typed with a specific Enemy interface
}

/**
 * End combat action
 * Used when combat concludes (victory, defeat, or escape)
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.END_COMBAT,
 *   payload: {
 *     result: 'victory',
 *     rewards: {
 *       experience: 100,
 *       gold: 25,
 *       items: [{ id: 'wolf_pelt', name: 'Wolf Pelt', quantity: 1 }]
 *     }
 *   }
 * });
 */
interface EndCombatAction extends BaseAction {
  type: typeof ACTION_TYPES.END_COMBAT;
  payload: { 
    result: 'victory' | 'defeat' | 'escape';
    rewards?: any; // Would be typed more specifically
  };
}

/**
 * Player attack action
 * Used when the player performs an attack during combat
 * 
 * @example
 * // Basic attack
 * dispatch({ type: ACTION_TYPES.PLAYER_ATTACK });
 * 
 * // Special attack
 * dispatch({
 *   type: ACTION_TYPES.PLAYER_ATTACK,
 *   payload: { attackType: 'fireball' }
 * });
 */
interface PlayerAttackAction extends BaseAction {
  type: typeof ACTION_TYPES.PLAYER_ATTACK;
  payload?: { attackType?: string };
}

/**
 * Enemy attack action
 * Used when an enemy performs an attack during combat
 * 
 * @example
 * dispatch({ type: ACTION_TYPES.ENEMY_ATTACK });
 */
interface EnemyAttackAction extends BaseAction {
  type: typeof ACTION_TYPES.ENEMY_ATTACK;
}

// ==========================================
// Settings Actions
// ==========================================

/**
 * Update settings action
 * Used to update game settings
 * 
 * @example
 * dispatch({
 *   type: ACTION_TYPES.UPDATE_SETTINGS,
 *   payload: {
 *     audio: { musicVolume: 0.8 },
 *     gameplay: { difficultyLevel: 'hard' }
 *   }
 * });
 */
interface UpdateSettingsAction extends BaseAction {
  type: typeof ACTION_TYPES.UPDATE_SETTINGS;
  payload: Partial<GameState['settings']>;
}

/**
 * Context for accessing the dispatch function throughout the application
 * The null default value is overridden by GameProvider component
 */
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

// Export these hooks and functions
export const useGameDispatch = (): Dispatch<GameAction> => {
  const dispatch = useContext(GameDispatchContext);
  if (dispatch === null) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return dispatch;
};

/**
 * Collection of action creator functions for common game actions
 * These provide a cleaner way to create properly typed actions
 */
export const GameActions = {
  /**
   * Create an action to gain a resource
   * @param {string} resourceType - Type of resource to gain
   * @param {number} amount - Amount to gain
   * @returns {GainResourceAction} The formatted action object
   * 
   * @example
   * dispatch(GameActions.gainResource('gold', 50));
   */
  gainResource: (resourceType: string, amount: number): GainResourceAction => ({
    type: ACTION_TYPES.GAIN_RESOURCE,
    payload: { resourceType, amount }
  }),
  
  /**
   * Create an action to gain experience
   * @param {number} amount - Amount of experience to gain
   * @returns {GainExperienceAction} The formatted action object
   * 
   * @example
   * dispatch(GameActions.gainExperience(100));
   */
  gainExperience: (amount: number): GainExperienceAction => ({
    type: ACTION_TYPES.GAIN_EXPERIENCE,
    payload: { amount }
  }),
  
  /**
   * Create an action to add an item to inventory
   * @param {GameState['inventory']['items'][0]} item - Item to add
   * @returns {AddItemAction} The formatted action object
   * 
   * @example
   * dispatch(GameActions.addItem({
   *   id: 'health_potion',
   *   name: 'Health Potion',
   *   type: 'consumable',
   *   effect: { health: 50 },
   *   quantity: 1,
   *   value: 25
   * }));
   */
  addItem: (item: GameState['inventory']['items'][0]): AddItemAction => ({
    type: ACTION_TYPES.ADD_ITEM,
    payload: { item }
  })
};

// Export only once - as default
export default GameDispatchContext;
