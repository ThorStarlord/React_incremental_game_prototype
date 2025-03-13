import { Item, ItemCategory, ItemRarity, BASE_ITEMS } from '../initialStates/itemsInitialState';
import { createReducer } from '../utils/reducerUtils';

/**
 * Interface for the items state in the game
 */
export interface ItemsState {
  // Dictionary of all available items in the game
  availableItems: Record<string, Item>;
  
  // Items that have been discovered by the player
  discoveredItems: Record<string, boolean>;
  
  // Items that are currently available in shops
  shopInventory: Record<string, ShopItem[]>;
  
  // Custom player-crafted items
  craftedItems: Item[];
  
  // Items that are currently being dropped with higher frequency (events, etc.)
  boostedDrops: Record<string, number>;
}

/**
 * Interface for shop items with additional shop-specific properties
 */
interface ShopItem {
  item: Item;
  quantity: number;
  discount: number;
  restockTime?: number;
}

/**
 * Initial items state
 */
export const initialItemsState: ItemsState = {
  availableItems: { ...BASE_ITEMS },
  discoveredItems: {},
  shopInventory: {
    village_shop: [],
    blacksmith: [],
    magic_vendor: [],
  },
  craftedItems: [],
  boostedDrops: {},
};

/**
 * All possible actions for the items reducer
 */
export type ItemsAction = 
  | { type: 'ADD_ITEM_TEMPLATE'; payload: Item }
  | { type: 'DISCOVER_ITEM'; payload: string }
  | { type: 'DISCOVER_MULTIPLE_ITEMS'; payload: string[] }
  | { type: 'MODIFY_ITEM_TEMPLATE'; payload: { itemId: string; changes: Partial<Item> } }
  | { type: 'RESTOCK_SHOP'; payload: { shopId: string; items: ShopItem[] } }
  | { type: 'ADD_TO_SHOP'; payload: { shopId: string; item: ShopItem } }
  | { type: 'REMOVE_FROM_SHOP'; payload: { shopId: string; itemId: string } }
  | { type: 'UPDATE_SHOP_ITEM'; payload: { shopId: string; itemId: string; changes: Partial<ShopItem> } }
  | { type: 'ADD_CRAFTED_ITEM'; payload: Item }
  | { type: 'REMOVE_CRAFTED_ITEM'; payload: string }
  | { type: 'SET_BOOSTED_DROP'; payload: { itemId: string; multiplier: number } }
  | { type: 'CLEAR_BOOSTED_DROPS' }
  | { type: 'GENERATE_RANDOM_ITEM'; payload: { baseItem: string; level: number; qualityModifier?: number } }
  | { type: 'IMPORT_ITEMS'; payload: Record<string, Item> }
  | { type: 'RESET_ITEMS_STATE' };

/**
 * Random item generation helper
 * 
 * @param baseItem - Base item template to modify
 * @param level - Target item level
 * @param qualityModifier - Optional quality modifier (0-1)
 * @returns Generated random item
 */
const generateRandomItem = (
  baseItem: Item,
  level: number,
  qualityModifier: number = Math.random()
): Item => {
  // Create a unique ID with timestamp
  const uniqueId = `${baseItem.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  
  // Determine rarity based on quality modifier
  let rarity: ItemRarity = 'common';
  if (qualityModifier > 0.98) rarity = 'legendary';
  else if (qualityModifier > 0.90) rarity = 'epic';
  else if (qualityModifier > 0.75) rarity = 'rare';
  else if (qualityModifier > 0.50) rarity = 'uncommon';
  
  // Scale stats based on level and quality
  const statMultiplier = (1 + (level - 1) * 0.2) * (1 + qualityModifier);
  
  // Copy and enhance stats
  const enhancedStats: Record<string, number> = {};
  if (baseItem.stats) {
    Object.entries(baseItem.stats).forEach(([statKey, statValue]) => {
      if (statValue !== undefined) {
        enhancedStats[statKey] = Math.round(statValue * statMultiplier * 10) / 10;
      }
    });
  }
  
  // Generate random affixes based on rarity
  const affixCount = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
  }[rarity];
  
  // Generate item name with prefixes/suffixes based on stats and rarity
  const itemNamePrefixes: Record<string, string[]> = {
    attack: ['Sharp', 'Fierce', 'Deadly', 'Savage'],
    defense: ['Sturdy', 'Reinforced', 'Protective', 'Impenetrable'],
    magic: ['Arcane', 'Mystical', 'Enchanted', 'Sorcerous'],
    health: ['Vital', 'Healthy', 'Vigorous', 'Robust'],
  };
  
  const itemNameSuffixes: Record<string, string[]> = {
    attack: ['of Striking', 'of Power', 'of Strength', 'of the Warrior'],
    defense: ['of Protection', 'of Shielding', 'of Safeguarding', 'of the Guardian'],
    magic: ['of Spellcraft', 'of Magic', 'of Wizardry', 'of the Mage'],
    health: ['of Vitality', 'of Wellness', 'of Flourishing', 'of the Titan'],
  };
  
  // Determine dominant stat
  let dominantStat = 'attack';
  let highestStatValue = 0;
  
  if (baseItem.stats) {
    Object.entries(baseItem.stats).forEach(([statKey, statValue]) => {
      if (statValue !== undefined && statValue > highestStatValue) {
        highestStatValue = statValue;
        dominantStat = statKey;
      }
    });
  }
  
  // Get available prefixes and suffixes
  const availablePrefixes = itemNamePrefixes[dominantStat as keyof typeof itemNamePrefixes] || 
                          itemNamePrefixes.attack;
  const availableSuffixes = itemNameSuffixes[dominantStat as keyof typeof itemNameSuffixes] || 
                          itemNameSuffixes.attack;
  
  // Select prefix/suffix based on quality
  const prefixIndex = Math.min(
    Math.floor(qualityModifier * availablePrefixes.length),
    availablePrefixes.length - 1
  );
  const suffixIndex = Math.min(
    Math.floor(qualityModifier * availableSuffixes.length),
    availableSuffixes.length - 1
  );
  
  // Create item name
  let itemName = baseItem.name;
  if (rarity !== 'common') {
    // Uncommon+ gets prefix
    itemName = `${availablePrefixes[prefixIndex]} ${itemName}`;
  }
  if (rarity !== 'common' && rarity !== 'uncommon') {
    // Rare+ gets suffix too
    itemName = `${itemName} ${availableSuffixes[suffixIndex]}`;
  }
  
  // Return the generated item
  return {
    ...baseItem,
    id: uniqueId,
    name: itemName,
    rarity,
    level,
    value: Math.round(baseItem.value * statMultiplier * (1 + (affixCount * 0.5))),
    stats: enhancedStats as typeof baseItem.stats,
  };
};

/**
 * Items reducer implementation using the createReducer utility
 */
export const itemsReducer = createReducer<ItemsState, ItemsAction>(
  initialItemsState,
  {
    ADD_ITEM_TEMPLATE: (state, action) => {
      const item = action.payload;
      return {
        ...state,
        availableItems: {
          ...state.availableItems,
          [item.id]: item
        }
      };
    },
    
    DISCOVER_ITEM: (state, action) => {
      const itemId = action.payload;
      return {
        ...state,
        discoveredItems: {
          ...state.discoveredItems,
          [itemId]: true
        }
      };
    },
    
    DISCOVER_MULTIPLE_ITEMS: (state, action) => {
      const itemIds = action.payload;
      const newDiscoveries = itemIds.reduce<Record<string, boolean>>((acc, itemId) => {
        acc[itemId] = true;
        return acc;
      }, {});
      
      return {
        ...state,
        discoveredItems: {
          ...state.discoveredItems,
          ...newDiscoveries
        }
      };
    },
    
    MODIFY_ITEM_TEMPLATE: (state, action) => {
      const { itemId, changes } = action.payload;
      const existingItem = state.availableItems[itemId];
      
      if (!existingItem) {
        return state;
      }
      
      return {
        ...state,
        availableItems: {
          ...state.availableItems,
          [itemId]: {
            ...existingItem,
            ...changes
          }
        }
      };
    },
    
    RESTOCK_SHOP: (state, action) => {
      const { shopId, items } = action.payload;
      
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          [shopId]: items
        }
      };
    },
    
    ADD_TO_SHOP: (state, action) => {
      const { shopId, item } = action.payload;
      const shopItems = state.shopInventory[shopId] || [];
      
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          [shopId]: [...shopItems, item]
        }
      };
    },
    
    REMOVE_FROM_SHOP: (state, action) => {
      const { shopId, itemId } = action.payload;
      const shopItems = state.shopInventory[shopId] || [];
      
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          [shopId]: shopItems.filter(shopItem => shopItem.item.id !== itemId)
        }
      };
    },
    
    UPDATE_SHOP_ITEM: (state, action) => {
      const { shopId, itemId, changes } = action.payload;
      const shopItems = state.shopInventory[shopId] || [];
      const itemIndex = shopItems.findIndex(shopItem => shopItem.item.id === itemId);
      
      if (itemIndex === -1) {
        return state;
      }
      
      const updatedItems = [
        ...shopItems.slice(0, itemIndex),
        {
          ...shopItems[itemIndex],
          ...changes
        },
        ...shopItems.slice(itemIndex + 1)
      ];
      
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          [shopId]: updatedItems
        }
      };
    },
    
    ADD_CRAFTED_ITEM: (state, action) => {
      const item = action.payload;
      
      return {
        ...state,
        craftedItems: [...state.craftedItems, item]
      };
    },
    
    REMOVE_CRAFTED_ITEM: (state, action) => {
      const itemId = action.payload;
      
      return {
        ...state,
        craftedItems: state.craftedItems.filter(item => item.id !== itemId)
      };
    },
    
    SET_BOOSTED_DROP: (state, action) => {
      const { itemId, multiplier } = action.payload;
      
      return {
        ...state,
        boostedDrops: {
          ...state.boostedDrops,
          [itemId]: multiplier
        }
      };
    },
    
    CLEAR_BOOSTED_DROPS: (state) => {
      return {
        ...state,
        boostedDrops: {}
      };
    },
    
    GENERATE_RANDOM_ITEM: (state, action) => {
      const { baseItem: baseItemId, level, qualityModifier } = action.payload;
      const baseItem = state.availableItems[baseItemId];
      
      if (!baseItem) {
        return state;
      }
      
      const randomItem = generateRandomItem(baseItem, level, qualityModifier);
      
      return {
        ...state,
        craftedItems: [...state.craftedItems, randomItem]
      };
    },
    
    IMPORT_ITEMS: (state, action) => {
      const newItems = action.payload;
      
      return {
        ...state,
        availableItems: {
          ...state.availableItems,
          ...newItems
        }
      };
    },
    
    RESET_ITEMS_STATE: () => {
      return initialItemsState;
    }
  }
);

export default itemsReducer;
