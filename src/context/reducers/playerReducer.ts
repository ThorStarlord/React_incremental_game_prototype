import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState, PlayerAttributes } from '../types/GameStateTypes';
import { 
  createNotification, 
  addNotification 
} from '../utils/notificationUtils';

// List of valid attributes to check against
const VALID_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  'strength', 
  'intelligence', 
  'dexterity', 
  'vitality', 
  'luck',
  'constitution',
  'wisdom',
  'charisma',
  'perception', 
  'agility',
  'endurance'
];

// Maximum values for each attribute
const MAX_ATTRIBUTE_VALUE = 100;

export const playerReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  switch (action.type) {
    case ACTION_TYPES.MODIFY_HEALTH: {
      const { amount, reason } = action.payload;
      
      // Calculate constitution bonus for damage reduction (if taking damage)
      let modifiedAmount = amount;
      if (amount < 0) {
        const constitutionBonus = state.player.attributes.constitution * 0.01;
        modifiedAmount = Math.floor(amount * (1 - constitutionBonus));
      }
      
      // Calculate new health with bounds (never below zero)
      const newHealth = Math.max(0, Math.min(state.player.stats.maxHealth, state.player.stats.health + modifiedAmount));
      
      // Health change only - death handling removed
      return {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            health: newHealth
          }
        }
      };
    }
    
    case ACTION_TYPES.ALLOCATE_ATTRIBUTE: {
      const { attributeName, amount = 1 } = action.payload;
      
      // Check if player has enough attribute points
      if ((state.player.attributePoints || 0) < amount) {
        const notification = createNotification(
          "Not enough attribute points.",
          "error"
        );
        return addNotification(state, notification);
      }
      
      // Check if attribute is valid
      if (!VALID_ATTRIBUTES.includes(attributeName as keyof PlayerAttributes)) {
        const notification = createNotification(
          `"${attributeName}" is not a valid attribute.`,
          "error"
        );
        return addNotification(state, notification);
      }
      
      // Type assertion - attributeName is now verified to be a valid key
      const typedAttributeName = attributeName as keyof PlayerAttributes;
      
      // Get current attribute value with proper typing
      const currentValue = state.player.attributes[typedAttributeName] || 0;
      
      // Check if attribute is already at max
      if (currentValue >= MAX_ATTRIBUTE_VALUE) {
        const notification = createNotification(
          `${attributeName} is already at maximum (${MAX_ATTRIBUTE_VALUE}).`,
          "warning"
        );
        return addNotification(state, notification);
      }
      
      // Calculate new value, capped at max
      const newValue = Math.min(MAX_ATTRIBUTE_VALUE, currentValue + amount);
      
      return {
        ...state,
        player: {
          ...state.player,
          attributePoints: (state.player.attributePoints || 0) - amount,
          attributes: {
            ...state.player.attributes,
            [typedAttributeName]: newValue
          }
        }
      };
    }
    
    case ACTION_TYPES.ACQUIRE_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if already acquired
      if (state.player.acquiredTraits?.includes(traitId)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          acquiredTraits: [...(state.player.acquiredTraits || []), traitId]
        }
      };
    }
    
    case ACTION_TYPES.EQUIP_TRAIT: {
      const { traitId } = action.payload;
      
      // Check if player has this trait
      if (!state.player.acquiredTraits?.includes(traitId)) {
        const notification = createNotification(
          "You don't have this trait.",
          "error"
        );
        return addNotification(state, notification);
      }
      
      // Check if already equipped
      if (state.player.equippedTraits?.includes(traitId)) {
        return state;
      }
      
      // Check if reached max equipped traits
      const maxTraits = state.player.traitSlots || 3; // Use traitSlots from player state if available
      if ((state.player.equippedTraits?.length || 0) >= maxTraits) {
        const notification = createNotification(
          `You can only equip ${maxTraits} traits at once. Unequip one first.`,
          "warning"
        );
        return addNotification(state, notification);
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: [...(state.player.equippedTraits || []), traitId]
        }
      };
    }
    
    default:
      return state;
  }
};
