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
  REST: 'player/rest' as const
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
  COLLECT_LOOT: 'combat/collectLoot' as const
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
  ABANDON_QUEST: 'quest/abandon' as const
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
  USE_SKILL: 'skills/use' as const
};

// World related actions
export const WORLD_ACTIONS = {
  DISCOVER_LOCATION: 'world/discoverLocation' as const,
  UNLOCK_REGION: 'world/unlockRegion' as const,
  TRIGGER_WORLD_EVENT: 'world/triggerEvent' as const,
  UPDATE_TIME_CYCLE: 'world/updateTime' as const,
  CHANGE_ENVIRONMENT: 'world/changeEnvironment' as const
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
  DISCOVER_RESOURCE: 'discovery/resource' as const,
  DISCOVER_TECHNOLOGY: 'discovery/technology' as const,
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
  RESET_RESOURCES: 'resources/reset' as const
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
  ...RESOURCE_ACTIONS
};

// Create a union type of all action types
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];
