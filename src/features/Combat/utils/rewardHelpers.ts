/**
 * Reward Helpers Module
 * 
 * Provides utilities for handling combat rewards and converting between
 * different item representations used in the game systems.
 */

import { Rewards, RewardItem } from '../../../context/types/combat/combatTypes';
import { CombatRewards, LootItem } from '../../../context/types/combat/rewards';
import { GameItem, ItemType, ItemRarity } from '../../../context/types/gameStates/ItemsGameStateTypes';

/**
 * Ensures a reward item has all required properties for display and processing
 * 
 * @param item The original reward item
 * @returns A standardized reward item with all required fields
 */
export const standardizeRewardItem = (item: RewardItem): RewardItem => {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity || 1,
    // Add optional properties with defaults if they're missing
    rarity: item.rarity || 'common',
    type: item.type || 'misc',
    value: item.value || 1,
    description: item.description || `A ${item.name} obtained from combat.`
  };
};

/**
 * Converts a RewardItem to a LootItem format
 * 
 * @param item The reward item to convert
 * @returns A properly formatted LootItem
 */
export const convertToLootItem = (item: RewardItem): LootItem => {
  // Create a properly formatted LootItem with required properties
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    dropChance: 1.0 // Already dropped, so 100% chance
  };
};

/**
 * Converts a RewardItem to a GameItem for inventory system
 * 
 * @param item The reward item to convert
 * @returns A GameItem compatible with the inventory system
 */
export const convertToGameItem = (item: RewardItem): GameItem => {
  const standardized = standardizeRewardItem(item);
  
  // Ensure type and rarity are valid enum values
  const itemType = mapStringToItemType(standardized.type);
  const itemRarity = mapStringToItemRarity(standardized.rarity);
  
  return {
    id: standardized.id,
    name: standardized.name,
    type: itemType,
    description: standardized.description || '',
    value: standardized.value || 0,
    rarity: itemRarity,
    quantity: standardized.quantity,
    // Add required GameItem properties
    stackable: true,
    sellable: true,
    tradeable: true
  };
};

/**
 * Map string type to ItemType enum
 */
function mapStringToItemType(type: string | undefined): ItemType {
  if (!type) {
    // Use a safe default value
    return ItemType.Consumable;
  }
  
  // Map common string types to ItemType enum values
  switch (type.toLowerCase()) {
    case 'weapon': return ItemType.Weapon;
    case 'armor': return ItemType.Armor;
    case 'consumable': return ItemType.Consumable;
    case 'material': return ItemType.Material;
    case 'quest': return ItemType.Quest;
    default: return ItemType.Consumable; // Safe default
  }
}

/**
 * Map string rarity to ItemRarity enum
 */
function mapStringToItemRarity(rarity: string | undefined): ItemRarity {
  if (!rarity) return ItemRarity.Common;
  
  // Map common string rarities to ItemRarity enum values
  switch (rarity.toLowerCase()) {
    case 'uncommon': return ItemRarity.Uncommon;
    case 'rare': return ItemRarity.Rare;
    case 'epic': return ItemRarity.Epic;
    case 'legendary': return ItemRarity.Legendary;
    default: return ItemRarity.Common;
  }
}

/**
 * Converts standard Rewards format to CombatRewards format
 * 
 * @param rewards The standard rewards object
 * @returns CombatRewards compatible with the combat system
 */
export const convertToCombatRewards = (rewards: Rewards): CombatRewards => {
  return {
    experience: rewards.experience,
    gold: rewards.gold,
    items: rewards.items.map(convertToGameItem),
    bonusLoot: [] // No bonus loot by default
  };
};

// Add alias for backward compatibility with existing code
export const adaptRewards = convertToCombatRewards;

/**
 * Creates a complete Rewards object with default values for missing properties
 * 
 * @param partialRewards Partial rewards data
 * @returns Complete Rewards object with defaults for missing values
 */
export const createCompleteRewards = (partialRewards: Partial<Rewards>): Rewards => {
  return {
    experience: partialRewards.experience ?? 0,
    gold: partialRewards.gold ?? 0,
    items: (partialRewards.items ?? []).map(standardizeRewardItem)
  };
};

/**
 * Helper for components to get CombatRewards from standard Rewards
 * 
 * @param rewards Standard rewards format or partial rewards
 * @returns CombatRewards ready for display and processing
 */
export const getDisplayableRewards = (rewards: Rewards | Partial<Rewards>): CombatRewards => {
  // Ensure we have a complete rewards object first
  const complete = 'experience' in rewards 
    ? rewards as Rewards 
    : createCompleteRewards(rewards);
    
  // Then convert to combat rewards format
  return convertToCombatRewards(complete);
};
