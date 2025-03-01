import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

// Initial state for the player
const initialPlayerState = {
  name: 'Player',
  level: 1,
  experience: 0,
  controlledCharacters: [],
  acquiredTraits: [],
  equippedTraits: [], 
  statistics: {
    battlesWon: 0,
    traitsDiscovered: 0,
    npcsRecruited: 0
  }
};

/**
 * Player Reducer
 * 
 * Purpose: Manages the core player state in the game
 * - Handles character progression (XP gain, level ups)
 * - Manages player attributes and derived stats
 * - Processes trait acquisition and management
 * - Handles health, energy, and resource regeneration
 * - Controls character roster and character switching
 * 
 * The player reducer is central to character growth and progression,
 * turning player actions into meaningful advancement in the game.
 * 
 * Actions:
 * - GAIN_EXPERIENCE: Awards XP and handles level ups
 * - MODIFY_HEALTH: Adjusts player health (damage/healing)
 * - MODIFY_ENERGY: Adjusts player energy (consumption/recovery)
 * - ACQUIRE_TRAIT: Adds new traits to the player
 * - EQUIP_TRAIT: Places traits in active slots
 * - ADD_CHARACTER: Adds new character to player roster
 * - SWITCH_CHARACTER: Changes active character
 * - ALLOCATE_ATTRIBUTE: Assigns attribute points
 * - REST: Recovers resources over time
 */
export const playerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_EXPERIENCE: {
      const { amount, source } = action.payload;
      const currentXP = state.player.experience + amount;
      
      // XP required for next level - simple formula, can be adjusted
      const requiredXP = state.player.level * 100;
      
      // Check if player should level up
      if (currentXP >= requiredXP) {
        // Calculate new level and remaining XP
        const newLevel = state.player.level + 1;
        const remainingXP = currentXP - requiredXP;
        
        // Calculate attribute points to award
        const attributePointsGained = 3; // Standard points per level
        
        // Create level up state with notifications
        const levelUpState = addNotification({
          ...state,
          player: {
            ...state.player,
            level: newLevel,
            experience: remainingXP,
            attributePoints: (state.player.attributePoints || 0) + attributePointsGained,
            // Increase base health and energy with level
            maxHealth: state.player.maxHealth + 10,
            maxEnergy: state.player.maxEnergy + 5,
            // Restore health and energy on level up
            health: state.player.maxHealth + 10,
            energy: state.player.maxEnergy + 5,
            // Track level up history
            levelHistory: [
              ...(state.player.levelHistory || []),
              {
                level: newLevel,
                timestamp: Date.now(),
                attributesGained: attributePointsGained
              }
            ]
          }
        }, {
          message: `Level Up! You are now level ${newLevel}.`,
          type: "achievement",
          duration: 6000
        });
        
        return levelUpState;
      }
      
      // No level up, just add XP
      return {
        ...state,
        player: {
          ...state.player,
          experience: currentXP
        }
      };
    }
    
    case ACTION_TYPES.MODIFY_HEALTH: {
      const { amount, source } = action.payload;
      const newHealth = Math.max(0, Math.min(
        state.player.health + amount,
        state.player.maxHealth
      ));
      
      // Check if player died
      if (newHealth === 0 && state.player.health > 0) {
        return addNotification({
          ...state,
          player: {
            ...state.player,
            health: newHealth,
            deathCount: (state.player.deathCount || 0) + 1,
            lastDeath: {
              timestamp: Date.now(),
              source: source || 'unknown'
            }
          }
        }, {
          message: "You have been defeated!",
          type: "danger",
          duration: 5000
        });
      }
      
      // Regular health change
      return {
        ...state,
        player: {
          ...state.player,
          health: newHealth
        }
      };
    }
    
    case ACTION_TYPES.MODIFY_ENERGY: {
      const { amount } = action.payload;
      const newEnergy = Math.max(0, Math.min(
        state.player.energy + amount,
        state.player.maxEnergy
      ));
      
      return {
        ...state,
        player: {
          ...state.player,
          energy: newEnergy
        }
      };
    }
    
    case ACTION_TYPES.ACQUIRE_TRAIT: {
      const { trait } = action.payload;
      
      // Check if player already has this trait
      if (state.player.acquiredTraits.some(t => t.id === trait.id)) {
        return addNotification(state, {
          message: `You already possess the ${trait.name} trait.`,
          type: "warning"
        });
      }
      
      return addNotification({
        ...state,
        player: {
          ...state.player,
          acquiredTraits: [
            ...state.player.acquiredTraits,
            {
              id: trait.id,
              name: trait.name,
              description: trait.description,
              acquired: Date.now()
            }
          ]
        }
      }, {
        message: `Acquired new trait: ${trait.name}`,
        type: "achievement"
      });
    }
    
    case ACTION_TYPES.EQUIP_TRAIT: {
      const { traitId, slot } = action.payload;
      
      // Verify player has the trait
      if (!state.player.acquiredTraits.some(t => t.id === traitId)) {
        return addNotification(state, {
          message: "You don't possess this trait.",
          type: "error"
        });
      }
      
      // Update equipped traits
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: {
            ...state.player.equippedTraits,
            [slot]: traitId
          }
        }
      };
    }
    
    case ACTION_TYPES.ADD_CHARACTER: {
      const { character } = action.payload;
      
      // Check if character already exists
      if (state.player.controlledCharacters.some(c => c.id === character.id)) {
        return state;
      }
      
      return addNotification({
        ...state,
        player: {
          ...state.player,
          controlledCharacters: [
            ...state.player.controlledCharacters,
            character
          ]
        }
      }, {
        message: `${character.name} has joined your party!`,
        type: "achievement"
      });
    }
    
    case ACTION_TYPES.SWITCH_CHARACTER: {
      const { characterId } = action.payload;
      
      // Verify character exists
      const targetCharacter = state.player.controlledCharacters.find(c => c.id === characterId);
      if (!targetCharacter) {
        return addNotification(state, {
          message: "Character not found in your roster.",
          type: "error"
        });
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          activeCharacterId: characterId
        }
      };
    }
    
    case ACTION_TYPES.ALLOCATE_ATTRIBUTE: {
      const { attribute, amount = 1 } = action.payload;
      
      // Validate available points
      if ((state.player.attributePoints || 0) < amount) {
        return addNotification(state, {
          message: "Not enough attribute points available.",
          type: "error"
        });
      }
      
      // Valid attributes
      const validAttributes = ["strength", "intelligence", "dexterity", "constitution", "wisdom", "charisma"];
      if (!validAttributes.includes(attribute)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          attributePoints: state.player.attributePoints - amount,
          attributes: {
            ...(state.player.attributes || {}),
            [attribute]: ((state.player.attributes || {})[attribute] || 0) + amount
          }
        }
      };
    }
    
    case ACTION_TYPES.REST: {
      const { duration } = action.payload;
      const healthRecovery = Math.floor(duration * 0.1); // 10% per rest unit
      const energyRecovery = Math.floor(duration * 0.2); // 20% per rest unit
      
      // Calculate new values with caps
      const newHealth = Math.min(
        state.player.health + healthRecovery,
        state.player.maxHealth
      );
      
      const newEnergy = Math.min(
        state.player.energy + energyRecovery,
        state.player.maxEnergy
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          health: newHealth,
          energy: newEnergy,
          lastRested: Date.now()
        }
      };
    }
    
    default:
      return state;
  }
};