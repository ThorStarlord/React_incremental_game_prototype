import { Item, ItemCategory, ItemStats } from '../itemsInitialState';

/**
 * Calculate the total weight of all items in the inventory
 * @param {Item[]} items - Array of inventory items
 * @returns {number} Total weight
 */
export const calculateTotalWeight = (items: Item[]): number => {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 0;
    const itemQuantity = item.quantity || 1;
    return total + (itemWeight * itemQuantity);
  }, 0);
};

/**
 * Check if an item can be added to the inventory
 * @param {Item[]} items - Current inventory items
 * @param {Item} newItem - Item to check if it can be added
 * @param {number} maxWeight - Maximum weight capacity
 * @param {number} maxSlots - Maximum inventory slots
 * @returns {boolean} Whether the item can be added
 */
export const canAddItem = (
  items: Item[], 
  newItem: Item, 
  maxWeight: number, 
  maxSlots: number
): boolean => {
  // Check if inventory is full
  if (!newItem.stackable && items.length >= maxSlots) {
    return false;
  }

  // Check if there's room for a stackable item
  if (newItem.stackable) {
    const existingItem = items.find(item => item.id === newItem.id);
    if (!existingItem && items.length >= maxSlots) {
      return false;
    }

    // Check if adding would exceed stack limit
    if (existingItem && existingItem.maxStack) {
      const currentQuantity = existingItem.quantity || 1;
      const newQuantity = newItem.quantity || 1;
      if (currentQuantity + newQuantity > existingItem.maxStack) {
        return false;
      }
    }
  }

  // Check weight limit
  const currentWeight = calculateTotalWeight(items);
  const newItemWeight = (newItem.weight || 0) * (newItem.quantity || 1);
  return currentWeight + newItemWeight <= maxWeight;
};

/**
 * Sort items by specified criteria
 * @param {Item[]} items - Array of items to sort
 * @param {string} sortBy - Sorting criteria ('name', 'value', 'weight', 'rarity', 'category')
 * @param {boolean} ascending - Whether to sort in ascending order
 * @returns {Item[]} Sorted array of items
 */
export const sortItems = (
  items: Item[], 
  sortBy: string = 'name', 
  ascending: boolean = true
): Item[] => {
  const sortFactor = ascending ? 1 : -1;

  const rarityValues: Record<string, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
  };
  
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return sortFactor * ((a.value || 0) - (b.value || 0));
      
      case 'weight':
        return sortFactor * ((a.weight || 0) - (b.weight || 0));
      
      case 'rarity':
        const aRarityValue = rarityValues[a.rarity] || 0;
        const bRarityValue = rarityValues[b.rarity] || 0;
        return sortFactor * (aRarityValue - bRarityValue);
      
      case 'category':
        return sortFactor * a.category.localeCompare(b.category);
      
      case 'name':
      default:
        return sortFactor * a.name.localeCompare(b.name);
    }
  });
};

/**
 * Filter items by category
 * @param {Item[]} items - Array of items to filter
 * @param {ItemCategory} category - Category to filter by
 * @returns {Item[]} Filtered array of items
 */
export const filterItemsByCategory = (
  items: Item[], 
  category: ItemCategory
): Item[] => {
  return items.filter(item => item.category === category);
};

/**
 * Check if an item can be equipped
 * @param {Item} item - Item to check
 * @param {number} playerLevel - Player's level
 * @returns {boolean} Whether the item can be equipped
 */
export const canEquip = (item: Item, playerLevel: number): boolean => {
  // Check if item is equippable
  const equippableCategories: ItemCategory[] = ['weapon', 'armor'];
  if (!equippableCategories.includes(item.category)) {
    return false;
  }

  // Check level requirement
  if (item.level && item.level > playerLevel) {
    return false;
  }

  return true;
};

/**
 * Calculate the stats difference when equipping a new item
 * @param {Item | null} currentItem - Currently equipped item
 * @param {Item} newItem - New item to compare against
 * @returns {Record<string, number>} Stat differences (positive means improvement)
 */
export const calculateStatsDifference = (
  currentItem: Item | null, 
  newItem: Item
): Record<string, number> => {
  const statDiffs: Record<string, number> = {};
  
  // All possible stats to compare
  const allStats = [
    'attack', 'defense', 'health', 'speed', 
    'magic', 'critChance', 'critDamage'
  ];
  
  allStats.forEach(stat => {
    const currentValue = currentItem?.stats?.[stat] || 0;
    const newValue = newItem.stats?.[stat] || 0;
    statDiffs[stat] = newValue - currentValue;
  });
  
  return statDiffs;
};

/**
 * Get display text for item rarity with appropriate coloring
 * @param {Item} item - The item to get rarity display for
 * @returns {Object} Display text and color
 */
export const getItemRarityDisplay = (
  item: Item
): { text: string; color: string } => {
  switch (item.rarity) {
    case 'legendary':
      return { text: 'Legendary', color: '#ff8000' };
    case 'epic':
      return { text: 'Epic', color: '#a335ee' };
    case 'rare':
      return { text: 'Rare', color: '#0070dd' };
    case 'uncommon':
      return { text: 'Uncommon', color: '#1eff00' };
    case 'common':
    default:
      return { text: 'Common', color: '#ffffff' };
  }
};
