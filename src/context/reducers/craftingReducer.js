import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Crafting Reducer
 * 
 * Purpose: Manages the crafting system of the game
 * - Processes recipe discovery and unlocks
 * - Handles crafting attempts and resource consumption
 * - Manages crafting stations and their levels
 * - Tracks crafting stats and achievements
 * - Controls quality and crafting bonuses
 * 
 * Crafting allows players to create items from gathered resources,
 * encouraging exploration, resource collection, and progression
 * through better equipment and consumables.
 * 
 * Actions:
 * - DISCOVER_RECIPE: Unlocks a new craftable item
 * - CRAFT_ITEM: Attempts to create an item using a recipe
 * - UPGRADE_CRAFTING_STATION: Improves a crafting location
 * - SET_CRAFTING_FOCUS: Changes the active crafting specialty
 * - SALVAGE_ITEM: Breaks down an item into components
 */
export const craftingReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_RECIPE: {
      const { recipeId, source } = action.payload;
      
      // Check if recipe already discovered
      if (state.player.discoveredRecipes?.includes(recipeId)) {
        return state;
      }
      
      // Get recipe data to show meaningful notification
      const recipeData = state.gameData?.recipes?.[recipeId];
      
      return addNotification({
        ...state,
        player: {
          ...state.player,
          discoveredRecipes: [
            ...(state.player.discoveredRecipes || []),
            recipeId
          ],
          // Track discovery source and time
          recipeDiscoveries: [
            ...(state.player.recipeDiscoveries || []),
            {
              recipeId,
              discoveredAt: Date.now(),
              source: source || 'unknown'
            }
          ]
        },
        stats: {
          ...state.stats,
          recipesDiscovered: (state.stats?.recipesDiscovered || 0) + 1
        }
      }, {
        message: `Discovered new recipe: ${recipeData?.name || 'Unknown Recipe'}`,
        type: "discovery",
        duration: 4000
      });
    }
    
    case ACTION_TYPES.CRAFT_ITEM: {
      const { recipeId, quantity = 1, stationId } = action.payload;
      
      // Get recipe data
      const recipe = state.gameData?.recipes?.[recipeId];
      if (!recipe) {
        return addNotification(state, {
          message: "Invalid recipe.",
          type: "error"
        });
      }
      
      // Check if recipe is discovered
      if (!state.player.discoveredRecipes?.includes(recipeId) && recipe.requiresDiscovery !== false) {
        return addNotification(state, {
          message: "You haven't discovered this recipe yet.",
          type: "error"
        });
      }
      
      // Check for required crafting station
      if (recipe.requiredStation && (!stationId || stationId !== recipe.requiredStation)) {
        return addNotification(state, {
          message: `Requires a ${recipe.requiredStation} to craft.`,
          type: "error"
        });
      }
      
      // Check station level requirement
      const station = state.craftingStations?.find(s => s.id === stationId);
      if (recipe.requiredStationLevel && (!station || station.level < recipe.requiredStationLevel)) {
        return addNotification(state, {
          message: `Requires a level ${recipe.requiredStationLevel} ${recipe.requiredStation}.`,
          type: "error"
        });
      }
      
      // Check required skill level if applicable
      if (recipe.requiredSkill && recipe.requiredSkillLevel) {
        const skill = state.player.skills?.find(s => s.id === recipe.requiredSkill);
        if (!skill || skill.level < recipe.requiredSkillLevel) {
          return addNotification(state, {
            message: `Requires ${recipe.requiredSkill} skill level ${recipe.requiredSkillLevel}.`,
            type: "error"
          });
        }
      }
      
      // Check ingredients
      const missingIngredients = [];
      for (const ingredient of recipe.ingredients) {
        const playerItem = state.player.inventory.find(item => item.id === ingredient.id);
        
        if (!playerItem || playerItem.quantity < (ingredient.quantity * quantity)) {
          missingIngredients.push({
            id: ingredient.id,
            name: ingredient.name || state.gameData?.items?.[ingredient.id]?.name || 'Unknown Item',
            required: ingredient.quantity * quantity,
            available: playerItem?.quantity || 0
          });
        }
      }
      
      if (missingIngredients.length > 0) {
        const missingText = missingIngredients.map(i => 
          `${i.name} (${i.available}/${i.required})`
        ).join(', ');
        
        return addNotification(state, {
          message: `Missing ingredients: ${missingText}`,
          type: "warning"
        });
      }
      
      // Calculate craft quality and success chance
      const relevantSkillId = recipe.craftingSkill || 'crafting';
      const skillLevel = state.player.skills?.find(s => s.id === relevantSkillId)?.level || 0;
      const baseSuccessChance = recipe.baseSuccessChance || 0.95; // 95% default
      const skillBonus = Math.min(0.5, skillLevel * 0.01); // Up to +50% from skill
      
      const successChance = Math.min(1.0, baseSuccessChance + skillBonus);
      const craftSuccess = Math.random() <= successChance;
      
      // Consume ingredients regardless of outcome
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.map(item => {
            const ingredient = recipe.ingredients.find(ing => ing.id === item.id);
            if (ingredient) {
              return {
                ...item,
                quantity: item.quantity - (ingredient.quantity * quantity)
              };
            }
            return item;
          }).filter(item => item.quantity > 0)
        }
      };
      
      // Grant crafting XP to relevant skill
      if (recipe.craftingSkill) {
        const skillIndex = updatedState.player.skills?.findIndex(s => s.id === recipe.craftingSkill);
        if (skillIndex !== undefined && skillIndex !== -1) {
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
      
      // Update crafting stats
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
        return addNotification(updatedState, {
          message: `Failed to craft ${recipe.name}. Materials were lost.`,
          type: "error",
          duration: 4000
        });
      }
      
      // Handle critical success (better quality item)
      const criticalChance = Math.min(0.25, skillLevel * 0.005); // Up to 25% with max skill
      const isCritical = Math.random() <= criticalChance;
      
      // Add crafted item to inventory
      const craftedItem = {
        id: recipe.outputItem.id,
        name: recipe.outputItem.name || state.gameData?.items?.[recipe.outputItem.id]?.name,
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
        // Update existing item
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
        // Add as new item
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            inventory: [...updatedState.player.inventory, craftedItem]
          }
        };
      }
      
      // Return with success notification
      return addNotification(updatedState, {
        message: isCritical 
          ? `Crafted ${craftedItem.quantity}x ${recipe.name} with superior quality!` 
          : `Crafted ${craftedItem.quantity}x ${recipe.name}.`,
        type: isCritical ? "success" : "info",
        duration: 3000
      });
    }
    
    case ACTION_TYPES.UPGRADE_CRAFTING_STATION: {
      const { stationId } = action.payload;
      
      // Find station
      const stationIndex = state.craftingStations?.findIndex(s => s.id === stationId);
      if (stationIndex === -1 || stationIndex === undefined) {
        return addNotification(state, {
          message: "Invalid crafting station.",
          type: "error"
        });
      }
      
      const station = state.craftingStations[stationIndex];
      
      // Check if already max level
      const maxLevel = station.maxLevel || 5;
      if (station.level >= maxLevel) {
        return addNotification(state, {
          message: `${station.name} is already at maximum level.`,
          type: "warning"
        });
      }
      
      // Calculate upgrade cost
      const baseCost = station.upgradeCosts?.[station.level] || {
        essence: 100 * Math.pow(2, station.level),
        gold: 50 * Math.pow(2, station.level),
        materials: []
      };
      
      // Check if player has enough resources
      if (state.essence.amount < baseCost.essence) {
        return addNotification(state, {
          message: `Not enough essence for upgrade: ${state.essence.amount}/${baseCost.essence}`,
          type: "error"
        });
      }
      
      if (state.player.gold < baseCost.gold) {
        return addNotification(state, {
          message: `Not enough gold for upgrade: ${state.player.gold}/${baseCost.gold}`,
          type: "error"
        });
      }
      
      // Check material requirements
      for (const material of (baseCost.materials || [])) {
        const playerItem = state.player.inventory.find(item => item.id === material.id);
        if (!playerItem || playerItem.quantity < material.quantity) {
          return addNotification(state, {
            message: `Missing ${material.name || 'materials'} for upgrade.`,
            type: "error"
          });
        }
      }
      
      // Deduct costs
      let updatedState = {
        ...state,
        essence: {
          ...state.essence,
          amount: state.essence.amount - baseCost.essence
        },
        player: {
          ...state.player,
          gold: state.player.gold - baseCost.gold,
        }
      };
      
      // Deduct materials if any
      if (baseCost.materials && baseCost.materials.length > 0) {
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            inventory: updatedState.player.inventory.map(item => {
              const material = baseCost.materials.find(m => m.id === item.id);
              if (material) {
                return {
                  ...item,
                  quantity: item.quantity - material.quantity
                };
              }
              return item;
            }).filter(item => item.quantity > 0)
          }
        };
      }
      
      // Update station level
      updatedState = {
        ...updatedState,
        craftingStations: updatedState.craftingStations.map((s, idx) => 
          idx === stationIndex
            ? { 
                ...s, 
                level: s.level + 1,
                upgradedAt: Date.now()
              }
            : s
        )
      };
      
      return addNotification(updatedState, {
        message: `Upgraded ${station.name} to level ${station.level + 1}!`,
        type: "success",
        duration: 4000
      });
    }
    
    case ACTION_TYPES.SET_CRAFTING_FOCUS: {
      const { focusType } = action.payload;
      
      // Valid focus types
      const validFocusTypes = ['quality', 'quantity', 'speed', 'mastery'];
      if (!validFocusTypes.includes(focusType)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          craftingFocus: focusType,
          craftingFocusHistory: [
            ...(state.player.craftingFocusHistory || []),
            {
              focus: focusType,
              timestamp: Date.now()
            }
          ].slice(-5) // Keep only recent history
        }
      };
    }
    
    case ACTION_TYPES.SALVAGE_ITEM: {
      const { itemId, quantity = 1 } = action.payload;
      
      // Find item in inventory
      const itemIndex = state.player.inventory.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        return addNotification(state, {
          message: "Item not found in inventory.",
          type: "error"
        });
      }
      
      const item = state.player.inventory[itemIndex];
      
      // Check quantity
      if (item.quantity < quantity) {
        return addNotification(state, {
          message: "Not enough items to salvage.",
          type: "error"
        });
      }
      
      // Get salvage data
      const itemData = state.gameData?.items?.[itemId];
      if (!itemData || !itemData.salvageResults) {
        return addNotification(state, {
          message: "This item cannot be salvaged.",
          type: "error"
        });
      }
      
      // Calculate relevant skill bonus
      const salvagingSkillLevel = state.player.skills?.find(s => s.id === 'salvaging')?.level || 0;
      const salvagingBonus = salvagingSkillLevel * 0.01; // 1% per level
      
      // Determine salvage results
      const salvageComponents = [];
      
      itemData.salvageResults.forEach(result => {
        // Calculate quantity with skill bonus
        const baseQuantity = result.quantity || 1;
        const bonusQuantity = Math.floor(baseQuantity * salvagingBonus);
        const totalQuantity = (baseQuantity + bonusQuantity) * quantity;
        
        // Apply quality multiplier if item being salvaged is superior
        const qualityMultiplier = item.quality === 'superior' ? 1.5 : 1;
        const finalQuantity = Math.floor(totalQuantity * qualityMultiplier);
        
        // Random chance for rare components
        if (result.chance && Math.random() > result.chance) {
          return; // Skip this component due to bad luck
        }
        
        salvageComponents.push({
          id: result.id,
          name: result.name || state.gameData?.items?.[result.id]?.name || 'Component',
          quantity: finalQuantity
        });
      });
      
      // Remove original items from inventory
      let updatedState = {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.map((invItem, idx) => 
            idx === itemIndex
              ? { ...invItem, quantity: invItem.quantity - quantity }
              : invItem
          ).filter(invItem => invItem.quantity > 0)
        },
        stats: {
          ...state.stats,
          itemsSalvaged: (state.stats?.itemsSalvaged || 0) + quantity
        }
      };
      
      // Add salvaged components to inventory
      salvageComponents.forEach(component => {
        const existingComponentIndex = updatedState.player.inventory.findIndex(
          invItem => invItem.id === component.id
        );
        
        if (existingComponentIndex !== -1) {
          // Update existing component
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              inventory: updatedState.player.inventory.map((invItem, idx) => 
                idx === existingComponentIndex
                  ? { ...invItem, quantity: invItem.quantity + component.quantity }
                  : invItem
              )
            }
          };
        } else {
          // Add new component to inventory
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              inventory: [
                ...updatedState.player.inventory,
                {
                  id: component.id,
                  name: component.name,
                  quantity: component.quantity,
                  acquired: {
                    timestamp: Date.now(),
                    source: 'salvage',
                    originalItem: itemId
                  }
                }
              ]
            }
          };
        }
      });
      
      // Grant salvaging XP
      const salvagingXP = Math.floor(5 * quantity);
      const salvagingSkillIndex = updatedState.player.skills?.findIndex(s => s.id === 'salvaging');
      
      if (salvagingSkillIndex !== undefined && salvagingSkillIndex !== -1) {
        updatedState = {
          ...updatedState,
          player: {
            ...updatedState.player,
            skills: updatedState.player.skills.map((skill, idx) => 
              idx === salvagingSkillIndex
                ? { ...skill, experience: skill.experience + salvagingXP }
                : skill
            )
          }
        };
      }
      
      // Create result message
      const componentList = salvageComponents.map(c => `${c.quantity}x ${c.name}`).join(', ');
      
      return addNotification(updatedState, {
        message: componentList.length > 0
          ? `Salvaged ${quantity}x ${item.name} into: ${componentList}`
          : `Salvaged ${quantity}x ${item.name}, but got nothing useful.`,
        type: "info",
        duration: 4000
      });
    }
    
    case ACTION_TYPES.UNLOCK_CRAFTING_STATION: {
      const { stationId, locationId } = action.payload;
      
      // Check if station is already unlocked
      if (state.craftingStations?.some(s => s.id === stationId)) {
        return addNotification(state, {
          message: "This crafting station is already available.",
          type: "warning"
        });
      }
      
      // Get station data
      const stationData = state.gameData?.craftingStations?.[stationId];
      if (!stationData) {
        return addNotification(state, {
          message: "Invalid crafting station data.",
          type: "error"
        });
      }
      
      // Check unlock requirements (e.g., essence cost)
      if (stationData.unlockCost?.essence && 
          state.essence.amount < stationData.unlockCost.essence) {
        return addNotification(state, {
          message: `Not enough essence to unlock this station. Need ${stationData.unlockCost.essence}.`,
          type: "error"
        });
      }
      
      // Deduct unlock costs
      let updatedState = state;
      if (stationData.unlockCost?.essence) {
        updatedState = {
          ...updatedState,
          essence: {
            ...updatedState.essence,
            amount: updatedState.essence.amount - stationData.unlockCost.essence
          }
        };
      }
      
      // Add the new station
      updatedState = {
        ...updatedState,
        craftingStations: [
          ...(updatedState.craftingStations || []),
          {
            id: stationId,
            name: stationData.name,
            level: 1,
            unlocked: Date.now(),
            location: locationId || stationData.defaultLocation || 'workshop',
            recipes: stationData.defaultRecipes || []
          }
        ]
      };
      
      return addNotification(updatedState, {
        message: `Unlocked new crafting station: ${stationData.name}!`,
        type: "success",
        duration: 5000
      });
    }
    
    case ACTION_TYPES.LEARN_CRAFTING_RECIPE: {
      const { recipeId, teacherId } = action.payload;
      
      // Check if recipe is already learned
      if (state.player.discoveredRecipes?.includes(recipeId)) {
        return addNotification(state, {
          message: "You already know this recipe.",
          type: "info"
        });
      }
      
      // Get recipe data
      const recipeData = state.gameData?.recipes?.[recipeId];
      if (!recipeData) {
        return addNotification(state, {
          message: "Invalid recipe data.",
          type: "error"
        });
      }
      
      // Check learning cost (essence, gold, or items)
      let canLearn = true;
      let missingRequirements = [];
      
      if (recipeData.learningCost) {
        // Check essence cost
        if (recipeData.learningCost.essence && 
            state.essence.amount < recipeData.learningCost.essence) {
          canLearn = false;
          missingRequirements.push(`${recipeData.learningCost.essence} essence`);
        }
        
        // Check gold cost
        if (recipeData.learningCost.gold && 
            state.player.gold < recipeData.learningCost.gold) {
          canLearn = false;
          missingRequirements.push(`${recipeData.learningCost.gold} gold`);
        }
        
        // Check required items
        if (recipeData.learningCost.items) {
          for (const requiredItem of recipeData.learningCost.items) {
            const playerItem = state.player.inventory.find(item => 
              item.id === requiredItem.id && item.quantity >= requiredItem.quantity
            );
            
            if (!playerItem) {
              canLearn = false;
              const itemName = state.gameData?.items?.[requiredItem.id]?.name || "required item";
              missingRequirements.push(`${requiredItem.quantity}x ${itemName}`);
            }
          }
        }
      }
      
      // Check skill requirements
      if (recipeData.requiredSkill && recipeData.requiredSkillLevel) {
        const playerSkill = state.player.skills?.find(s => s.id === recipeData.requiredSkill);
        if (!playerSkill || playerSkill.level < recipeData.requiredSkillLevel) {
          canLearn = false;
          missingRequirements.push(`${recipeData.requiredSkill} skill level ${recipeData.requiredSkillLevel}`);
        }
      }
      
      if (!canLearn) {
        return addNotification(state, {
          message: `Cannot learn recipe. Missing: ${missingRequirements.join(', ')}`,
          type: "warning"
        });
      }
      
      // Apply costs
      let updatedState = state;
      
      if (recipeData.learningCost) {
        // Deduct essence
        if (recipeData.learningCost.essence) {
          updatedState = {
            ...updatedState,
            essence: {
              ...updatedState.essence,
              amount: updatedState.essence.amount - recipeData.learningCost.essence
            }
          };
        }
        
        // Deduct gold
        if (recipeData.learningCost.gold) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              gold: updatedState.player.gold - recipeData.learningCost.gold
            }
          };
        }
        
        // Deduct items
        if (recipeData.learningCost.items) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              inventory: updatedState.player.inventory.map(item => {
                const requiredItem = recipeData.learningCost.items.find(ri => ri.id === item.id);
                if (requiredItem) {
                  return {
                    ...item,
                    quantity: item.quantity - requiredItem.quantity
                  };
                }
                return item;
              }).filter(item => item.quantity > 0)
            }
          };
        }
      }
      
      // Add recipe to discovered recipes
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          discoveredRecipes: [
            ...(updatedState.player.discoveredRecipes || []),
            recipeId
          ],
          recipeDiscoveries: [
            ...(updatedState.player.recipeDiscoveries || []),
            {
              recipeId,
              discoveredAt: Date.now(),
              source: teacherId ? `teacher_${teacherId}` : 'learned'
            }
          ]
        },
        stats: {
          ...updatedState.stats,
          recipesLearned: (updatedState.stats?.recipesLearned || 0) + 1,
          totalRecipes: (updatedState.stats?.totalRecipes || 0) + 1
        }
      };
      
      return addNotification(updatedState, {
        message: `Learned new recipe: ${recipeData.name}!`,
        type: "discovery",
        duration: 4000
      });
    }
    
    default:
      return state;
  }
};
