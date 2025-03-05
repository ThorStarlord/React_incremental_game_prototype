import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Crafting Reducer - Manages the crafting system of the game
 */

// Consolidated interfaces
interface GameState {
  player: {
    discoveredRecipes?: string[];
    recipeDiscoveries?: RecipeDiscovery[];
    inventory: InventoryItem[];
    skills?: Skill[];
    craftingFocus?: string;
    craftingFocusHistory?: {focus: string; timestamp: number}[];
    gold: number;
  };
  gameData?: {
    recipes?: Record<string, Recipe>;
    items?: Record<string, Item>;
    craftingStations?: Record<string, {name: string; defaultLocation?: string; defaultRecipes?: string[]; unlockCost?: {essence: number; [key: string]: any}}>;
  };
  craftingStations?: Array<{
    id: string;
    name: string;
    level: number;
    unlocked?: number;
    upgradedAt?: number;
    location?: string;
    recipes?: string[];
    maxLevel?: number;
    upgradeCosts?: Record<number, {essence: number; gold: number; materials?: {id: string; quantity: number; name?: string}[]}>;
  }>;
  essence: {amount: number};
  stats?: {
    recipesDiscovered?: number;
    itemsCrafted?: number;
    craftingAttempts?: number;
    craftingFailures?: number;
    itemsSalvaged?: number;
    recipesLearned?: number;
    totalRecipes?: number;
    itemsCraftedByRecipe?: Record<string, number>;
  };
}

// Simplified interfaces
interface Recipe {
  id: string;
  name: string;
  ingredients: Array<{id: string; name?: string; quantity: number}>;
  outputItem: {id: string; name?: string; quantity: number};
  craftingSkill?: string;
  craftingXP?: number;
  requiredStation?: string;
  requiredStationLevel?: number;
  requiresDiscovery?: boolean;
  requiredSkill?: string;
  requiredSkillLevel?: number;
  baseSuccessChance?: number;
  learningCost?: {essence?: number; gold?: number; items?: Array<{id: string; quantity: number; name?: string}>};
}

interface Item {
  id: string;
  name: string;
  salvageResults?: Array<{id: string; name?: string; quantity?: number; chance?: number}>;
  [key: string]: any;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  quality?: string;
  acquired?: {timestamp: number; source: string; recipe?: string; stationId?: string; originalItem?: string};
}

interface Skill {
  id: string;
  experience: number;
  level: number;
}

interface RecipeDiscovery {
  recipeId: string;
  discoveredAt: number;
  source: string;
}

// Helper functions
const findItem = (inventory: InventoryItem[], itemId: string) => 
  inventory.findIndex(item => item.id === itemId);

const createItemUpdateFn = (component: {id: string; quantity: number}, operation: 'add' | 'subtract') => 
  (item: InventoryItem) => item.id === component.id 
    ? { ...item, quantity: item.quantity + (operation === 'add' ? component.quantity : -component.quantity) }
    : item;

const withNotification = (state: GameState, message: string, type: string = "info", duration: number = 3000) =>
  addNotification(state, { message, type, duration });

export const craftingReducer = (state: GameState, action: {type: string; payload: any}): GameState => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_RECIPE: {
      const { recipeId, source } = action.payload;
      
      // Check if recipe already discovered
      if (state.player.discoveredRecipes?.includes(recipeId)) return state;
      
      const recipeName = state.gameData?.recipes?.[recipeId]?.name || 'Unknown Recipe';
      
      return withNotification(
        {
          ...state,
          player: {
            ...state.player,
            discoveredRecipes: [...(state.player.discoveredRecipes || []), recipeId],
            recipeDiscoveries: [...(state.player.recipeDiscoveries || []), {
              recipeId,
              discoveredAt: Date.now(),
              source: source || 'unknown'
            }]
          },
          stats: {
            ...state.stats,
            recipesDiscovered: (state.stats?.recipesDiscovered || 0) + 1
          }
        },
        `Discovered new recipe: ${recipeName}`,
        "discovery",
        4000
      );
    }
    
    case ACTION_TYPES.CRAFT_ITEM: {
      const { recipeId, quantity = 1, stationId } = action.payload;
      const recipe = state.gameData?.recipes?.[recipeId];
      
      if (!recipe) 
        return withNotification(state, "Invalid recipe.", "error");
      
      if (!state.player.discoveredRecipes?.includes(recipeId) && recipe.requiresDiscovery !== false)
        return withNotification(state, "You haven't discovered this recipe yet.", "error");
      
      if (recipe.requiredStation && (!stationId || stationId !== recipe.requiredStation))
        return withNotification(state, `Requires a ${recipe.requiredStation} to craft.`, "error");
      
      // Check station level requirement
      const station = state.craftingStations?.find(s => s.id === stationId);
      if (recipe.requiredStationLevel && (!station || station.level < recipe.requiredStationLevel))
        return withNotification(state, `Requires a level ${recipe.requiredStationLevel} ${recipe.requiredStation}.`, "error");
      
      // Check required skill level
      if (recipe.requiredSkill && recipe.requiredSkillLevel) {
        const skill = state.player.skills?.find(s => s.id === recipe.requiredSkill);
        if (!skill || skill.level < recipe.requiredSkillLevel)
          return withNotification(state, `Requires ${recipe.requiredSkill} skill level ${recipe.requiredSkillLevel}.`, "error");
      }
      
      // Check ingredients
      const missingIngredients = recipe.ingredients.filter(ingredient => {
        const playerItem = state.player.inventory.find(item => item.id === ingredient.id);
        return !playerItem || playerItem.quantity < (ingredient.quantity * quantity);
      }).map(i => ({
        id: i.id,
        name: i.name || state.gameData?.items?.[i.id]?.name || 'Unknown Item',
        required: i.quantity * quantity,
        available: state.player.inventory.find(item => item.id === i.id)?.quantity || 0
      }));
      
      if (missingIngredients.length > 0) {
        const missingText = missingIngredients.map(i => 
          `${i.name} (${i.available}/${i.required})`
        ).join(', ');
        
        return withNotification(state, `Missing ingredients: ${missingText}`, "warning");
      }
      
      // Calculate craft quality and success chance
      const relevantSkillId = recipe.craftingSkill || 'crafting';
      const skillLevel = state.player.skills?.find(s => s.id === relevantSkillId)?.level || 0;
      const baseSuccessChance = recipe.baseSuccessChance || 0.95;
      const skillBonus = Math.min(0.5, skillLevel * 0.01);
      
      const successChance = Math.min(1.0, baseSuccessChance + skillBonus);
      const craftSuccess = Math.random() <= successChance;
      
      // Consume ingredients
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory
            .map(item => {
              const ingredient = recipe.ingredients.find(ing => ing.id === item.id);
              return ingredient 
                ? { ...item, quantity: item.quantity - (ingredient.quantity * quantity) }
                : item;
            })
            .filter(item => item.quantity > 0)
        }
      };
      
      // Grant crafting XP
      if (recipe.craftingSkill) {
        const skillIndex = updatedState.player.skills?.findIndex(s => s.id === recipe.craftingSkill);
        if (skillIndex !== undefined && skillIndex !== -1 && updatedState.player.skills) {
          const craftingXP = recipe.craftingXP || 5;
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              skills: updatedState.player.skills.map((skill, idx) => 
                idx === skillIndex
                  ? { ...skill, experience: skill.experience + (craftingXP * quantity) }
                  : skill
              )
            }
          };
        }
      }
      
      // Update stats
      updatedState = {
        ...updatedState,
        stats: {
          ...updatedState.stats,
          itemsCrafted: (updatedState.stats?.itemsCrafted || 0) + (craftSuccess ? quantity : 0),
          craftingAttempts: (updatedState.stats?.craftingAttempts || 0) + quantity,
          craftingFailures: (updatedState.stats?.craftingFailures || 0) + (craftSuccess ? 0 : quantity),
          itemsCraftedByRecipe: {
            ...(updatedState.stats?.itemsCraftedByRecipe || {}),
            [recipeId]: ((updatedState.stats?.itemsCraftedByRecipe || {})[recipeId] || 0) + (craftSuccess ? quantity : 0)
          }
        }
      };
      
      // Handle crafting failure
      if (!craftSuccess) {
        return withNotification(updatedState, `Failed to craft ${recipe.name}. Materials were lost.`, "error", 4000);
      }
      
      // Handle critical success
      const criticalChance = Math.min(0.25, skillLevel * 0.005);
      const isCritical = Math.random() <= criticalChance;
      
      // Add crafted item to inventory
      const craftedItem: InventoryItem = {
        id: recipe.outputItem.id,
        name: recipe.outputItem.name || state.gameData?.items?.[recipe.outputItem.id]?.name || '',
        quantity: recipe.outputItem.quantity * quantity,
        quality: isCritical ? 'superior' : 'standard',
        acquired: {
          timestamp: Date.now(),
          source: 'crafting',
          recipe: recipeId,
          stationId
        }
      };
      
      // Check if item already exists in inventory
      const existingItemIndex = updatedState.player.inventory.findIndex(
        item => item.id === craftedItem.id && item.quality === craftedItem.quality
      );
      
      if (existingItemIndex !== -1) {
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            inventory: updatedState.player.inventory.map((item, idx) => 
              idx === existingItemIndex
                ? { ...item, quantity: item.quantity + craftedItem.quantity }
                : item
            )
          }
        };
      } else {
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            inventory: [...updatedState.player.inventory, craftedItem]
          }
        };
      }
      
      return withNotification(
        updatedState,
        isCritical 
          ? `Crafted ${craftedItem.quantity}x ${recipe.name} with superior quality!` 
          : `Crafted ${craftedItem.quantity}x ${recipe.name}.`,
        isCritical ? "success" : "info",
        3000
      );
    }
    
    // ... existing code for other action types ...
    
    default:
      return state;
  }
};
