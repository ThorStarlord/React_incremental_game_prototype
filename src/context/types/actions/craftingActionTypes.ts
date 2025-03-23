/**
 * Crafting Action Types
 * ====================
 * 
 * This file defines action types related to the crafting system,
 * including recipe discovery, item crafting, and crafting station management.
 * 
 * @module craftingActionTypes
 */

/**
 * Action types for crafting operations
 */
export const CRAFTING_ACTIONS = {
  /**
   * Discover a new recipe
   */
  DISCOVER_RECIPE: 'crafting/discoverRecipe',

  /**
   * Craft an item from a recipe
   */
  CRAFT_ITEM: 'crafting/craftItem',

  /**
   * Salvage an item to recover materials
   */
  SALVAGE_ITEM: 'crafting/salvageItem',

  /**
   * Unlock a crafting station
   */
  UNLOCK_CRAFTING_STATION: 'crafting/unlockStation',

  /**
   * Upgrade a crafting station
   */
  UPGRADE_CRAFTING_STATION: 'crafting/upgradeStation',

  /**
   * Learn a recipe directly (without discovery)
   */
  LEARN_RECIPE: 'crafting/learnRecipe',

  /**
   * Set the player's crafting focus
   */
  SET_CRAFTING_FOCUS: 'crafting/setFocus'
};

/**
 * Crafting action payload interfaces
 */
export interface RecipePayload {
  recipeId: string;
  source?: string;
}

export interface CraftItemPayload {
  recipeId: string;
  quantity?: number;
  stationId?: string;
}

export interface SalvageItemPayload {
  itemId: string;
  quantity?: number;
}

export interface CraftingStationPayload {
  stationId: string;
  level?: number;
  location?: string;
}

/**
 * Crafting action interface
 */
export interface CraftingAction {
  type: keyof typeof CRAFTING_ACTIONS;
  payload: RecipePayload | CraftItemPayload | SalvageItemPayload | CraftingStationPayload;
}

/**
 * Crafting action type union
 */
export type CraftingActionType = typeof CRAFTING_ACTIONS[keyof typeof CRAFTING_ACTIONS];