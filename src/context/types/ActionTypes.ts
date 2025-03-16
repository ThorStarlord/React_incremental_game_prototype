/**
 * Action Types
 * 
 * Central location for all action type constants used in reducers
 */

// Player related actions
export const PLAYER_ACTIONS = {
  GAIN_EXPERIENCE: 'player/gainExperience' as const,
  LEVEL_UP: 'player/levelUp' as const,
  MODIFY_HEALTH: 'player/modifyHealth' as const,
  MODIFY_ENERGY: 'player/modifyEnergy' as const,
  ALLOCATE_ATTRIBUTE: 'player/allocateAttribute' as const,
  EQUIP_ITEM: 'player/equipItem' as const,
  UNEQUIP_ITEM: 'player/unequipItem' as const,
  REST: 'player/rest' as const,
  UPDATE_PLAYER: 'player/update' as const,
  SET_NAME: 'player/setName' as const,
  RESET_PLAYER: 'player/reset' as const,
  ACQUIRE_TRAIT: 'player/acquireTrait' as const,
  SWITCH_CHARACTER: 'player/switchCharacter' as const,
  SET_ACTIVE_CHARACTER: 'player/setActiveCharacter' as const,
  UPDATE_TOTAL_PLAYTIME: 'player/updateTotalPlayTime' as const
};

// Inventory related actions
export const INVENTORY_ACTIONS = {
  ADD_ITEM: 'inventory/addItem' as const,
  REMOVE_ITEM: 'inventory/removeItem' as const,
  USE_ITEM: 'inventory/useItem' as const,
  SORT_INVENTORY: 'inventory/sortInventory' as const,
  EXAMINE_ITEM: 'inventory/examineItem' as const
};

// Essence related actions
export const ESSENCE_ACTIONS = {
  GAIN_ESSENCE: 'essence/gainEssence' as const,
  SPEND_ESSENCE: 'essence/spendEssence' as const,
  UPGRADE_ESSENCE_RATE: 'essence/upgradeRate' as const
};

// Combat related actions
export const COMBAT_ACTIONS = {
  START_COMBAT: 'combat/start' as const,
  END_COMBAT: 'combat/end' as const,
  ATTACK_ACTION: 'combat/attack' as const,
  USE_COMBAT_SKILL: 'combat/useSkill' as const,
  FLEE_COMBAT: 'combat/flee' as const,
  COLLECT_LOOT: 'combat/collectLoot' as const,
  END_TURN: 'combat/endTurn' as const,
  PLAYER_ATTACK: 'combat/playerAttack' as const,
  ENEMY_ATTACK: 'combat/enemyAttack' as const
};

// Crafting related actions
export const CRAFTING_ACTIONS = {
  DISCOVER_RECIPE: 'crafting/discoverRecipe' as const,
  CRAFT_ITEM: 'crafting/craftItem' as const,
  UPGRADE_CRAFTING_STATION: 'crafting/upgradeStation' as const,
  SET_CRAFTING_FOCUS: 'crafting/setFocus' as const,
  SALVAGE_ITEM: 'crafting/salvageItem' as const
};

// Quest related actions
export const QUEST_ACTIONS = {
  DISCOVER_QUEST: 'quest/discover' as const,
  START_QUEST: 'quest/start' as const,
  UPDATE_QUEST_PROGRESS: 'quest/updateProgress' as const,
  UPDATE_QUEST_OBJECTIVE: 'quest/updateObjective' as const,
  COMPLETE_QUEST: 'quest/complete' as const,
  ABANDON_QUEST: 'quest/abandon' as const,
  FAIL_QUEST: 'quest/fail' as const
};

// Trait related actions
export const TRAIT_ACTIONS = {
  DISCOVER_TRAIT: 'traits/discover' as const,
  UNLOCK_TRAIT: 'traits/unlock' as const,
  EQUIP_TRAIT: 'traits/equip' as const,
  UNEQUIP_TRAIT: 'traits/unequip' as const,
  EVOLVE_TRAIT: 'traits/evolve' as const,
  INCREASE_TRAIT_AFFINITY: 'traits/increaseAffinity' as const
};

// Skill related actions
export const SKILL_ACTIONS = {
  GAIN_SKILL_XP: 'skills/gainXp' as const,
  UNLOCK_SKILL: 'skills/unlock' as const,
  USE_SKILL: 'skills/use' as const,
  LEARN_SKILL: 'skills/learn' as const,
  UPGRADE_SKILL: 'skills/upgrade' as const,
  GAIN_SKILL_EXPERIENCE: 'skills/gainExperience' as const,
  LEVEL_UP_SKILL: 'skills/levelUp' as const
};

// World related actions
export const WORLD_ACTIONS = {
  DISCOVER_LOCATION: 'world/discoverLocation' as const,
  UNLOCK_REGION: 'world/unlockRegion' as const,
  TRIGGER_WORLD_EVENT: 'world/triggerEvent' as const,
  UPDATE_TIME_CYCLE: 'world/updateTime' as const,
  CHANGE_ENVIRONMENT: 'world/changeEnvironment' as const,
  ESTABLISH_SETTLEMENT: 'world/establishSettlement' as const,
  DEPLETE_RESOURCE: 'world/depleteResource' as const,
  REGENERATE_RESOURCE: 'world/regenerateResource' as const,
  TRAVEL_TO_LOCATION: 'world/travelToLocation' as const
};

// Game time actions
export const TIME_ACTIONS = {
  ADVANCE_TIME: 'time/advance' as const,
  SET_TIME: 'time/set' as const,
  SKIP_TO_PERIOD: 'time/skipTo' as const,
  CHANGE_SEASON: 'time/changeSeason' as const,
  SET_WEATHER: 'time/setWeather' as const
};

// Discovery actions
export const DISCOVERY_ACTIONS = {
  DISCOVER_LOCATION: 'discovery/location' as const,
  DISCOVER_RESOURCE: 'discovery/resource' as const,
  DISCOVER_TECHNOLOGY: 'discovery/technology' as const,
  DISCOVER_RECIPE: 'discovery/recipe' as const,
  UPDATE_EXPLORATION_PROGRESS: 'discovery/updateExploration' as const,
  UNLOCK_ACHIEVEMENT: 'discovery/unlockAchievement' as const,
  COMPLETE_TUTORIAL_STEP: 'discovery/completeTutorial' as const,
  RESET_DISCOVERY: 'discovery/reset' as const
};

// Resource actions
export const RESOURCE_ACTIONS = {
  ADD_RESOURCES: 'resources/add' as const,
  SET_RESOURCE: 'resources/set' as const,
  UPDATE_PRODUCTION_RATE: 'resources/updateRate' as const,
  APPLY_PRODUCTION: 'resources/applyProduction' as const,
  RESET_RESOURCES: 'resources/reset' as const,
  GAIN_RESOURCE: 'resources/gain' as const,
  SPEND_RESOURCE: 'resources/spend' as const,
  GAIN_GOLD: 'resources/gainGold' as const
};

// Settings actions
export const SETTINGS_ACTIONS = {
  UPDATE_SETTINGS: 'settings/update' as const
};

// Game initialization actions
export const GAME_INIT_ACTIONS = {
  INITIALIZE_GAME_DATA: 'game/initializeData' as const,
  RESET_GAME: 'game/reset' as const
};

// Character management actions
export const CHARACTER_ACTIONS = {
  SET_CHARACTER_TAB: 'character/setTab' as const,
  ADD_CHARACTER: 'character/add' as const,
  UPDATE_CHARACTER: 'character/update' as const,
  REMOVE_CHARACTER: 'character/remove' as const,
  SET_ACTIVE_CHARACTER: 'character/setActive' as const,
  ALLOCATE_ATTRIBUTE_POINTS: 'character/allocateAttributePoints' as const,
  LEVEL_UP_CHARACTER_SKILL: 'character/levelUpSkill' as const
};

// NPC related actions
export const NPC_ACTIONS = {
  UPDATE_NPC_RELATIONSHIP: 'npc/updateRelationship' as const,
  COMPLETE_NPC_FAVOR: 'npc/completeFavor' as const,
  ADD_NPC_FAVOR: 'npc/addFavor' as const,
  DECLINE_NPC_FAVOR: 'npc/declineFavor' as const,
  ADD_NPC: 'npc/addNpc' as const,
  REMOVE_NPC: 'npc/removeNpc' as const,
  UPDATE_NPC: 'npc/updateNpc' as const,
  DECAY_RELATIONSHIPS: 'npc/decayRelationships' as const
};

// Notification actions
export const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'notification/add' as const,
  REMOVE_NOTIFICATION: 'notification/remove' as const,
  CLEAR_NOTIFICATIONS: 'notification/clear' as const,
  ADD_DIALOGUE: 'notification/addDialogue' as const
};

// Encounter actions
export const ENCOUNTER_ACTIONS = {
  START_ENCOUNTER: 'encounter/start' as const,
  END_ENCOUNTER: 'encounter/end' as const
};

// Combine all action types into a single export
export const ACTION_TYPES = {
  ...PLAYER_ACTIONS,
  ...INVENTORY_ACTIONS,
  ...ESSENCE_ACTIONS,
  ...COMBAT_ACTIONS,
  ...CRAFTING_ACTIONS,
  ...QUEST_ACTIONS,
  ...TRAIT_ACTIONS,
  ...SKILL_ACTIONS,
  ...WORLD_ACTIONS,
  ...TIME_ACTIONS,
  ...DISCOVERY_ACTIONS,
  ...RESOURCE_ACTIONS,
  ...SETTINGS_ACTIONS,
  ...GAME_INIT_ACTIONS,
  ...CHARACTER_ACTIONS,
  ...NPC_ACTIONS,
  ...NOTIFICATION_ACTIONS,
  ...ENCOUNTER_ACTIONS
};

// Create a union type of all action types
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

/**
 * Helper function to create an action creator for a specific action type
 * 
 * @param {string} type - The action type from ACTION_TYPES
 * @returns {function} Action creator function that accepts a payload
 * 
 * @example
 * const gainExp = createAction(ACTION_TYPES.GAIN_EXPERIENCE);
 * dispatch(gainExp({ amount: 100 }));
 */
export function createAction<P = any>(type: string) {
  return (payload?: P) => ({
    type,
    payload
  });
}

/**
 * Get all action types as an array of strings
 * Useful for debugging or dynamic action handling
 * 
 * @returns {string[]} Array of all action type strings
 */
export function getAllActionTypes(): string[] {
  return Object.values(ACTION_TYPES);
}

// Basic Action interface
export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
}

// Action with required payload
export interface ActionWithPayload<T = string, P = any> {
  type: T;
  payload: P;
}
