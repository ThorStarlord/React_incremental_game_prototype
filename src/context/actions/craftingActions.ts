/**
 * Crafting-related action types
 */

export const CRAFTING_ACTIONS = {
  DISCOVER_RECIPE: 'crafting/discoverRecipe' as const,
  CRAFT_ITEM: 'crafting/craftItem' as const,
  UPGRADE_CRAFTING_STATION: 'crafting/upgradeStation' as const,
  SET_CRAFTING_FOCUS: 'crafting/setFocus' as const,
  SALVAGE_ITEM: 'crafting/salvageItem' as const
};
