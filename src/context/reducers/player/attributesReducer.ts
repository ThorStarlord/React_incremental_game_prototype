import { PlayerState, PlayerAttributes } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Calculate base stats from attributes
 */
export const calculateBaseStats = (attributes: PlayerAttributes) => {
  const strength = attributes.strength || 0;
  const dexterity = attributes.dexterity || 0;
  const intelligence = attributes.intelligence || 0;
  const vitality = attributes.vitality || 0;
  const wisdom = attributes.wisdom || 0;
  const charisma = attributes.charisma || 0;
  const luck = attributes.luck || 0;
  const perception = attributes.perception || 0;

  // Create a stats object with all number values (no undefined)
  return {
    health: 50 + (vitality * 10),
    maxHealth: 50 + (vitality * 10),
    mana: 30 + (intelligence * 5) + (wisdom * 3),
    maxMana: 30 + (intelligence * 5) + (wisdom * 3),
    healthRegen: 0.5 + (vitality * 0.1),
    manaRegen: 0.5 + (wisdom * 0.1),
    physicalDamage: 5 + (strength * 0.5),
    magicalDamage: 5 + (intelligence * 0.5),
    armor: 0 + (vitality * 0.2),
    magicResistance: 0 + (wisdom * 0.2),
    critChance: 0.05 + (luck * 0.005),
    critMultiplier: 1.5 + (luck * 0.01),
    evasion: 0.05 + (dexterity * 0.005),
    accuracy: 0.9 + (perception * 0.01),
    speed: 10 + (dexterity * 0.5),
    // Add attack and defense which are required in PlayerStats
    attack: 5 + (strength * 0.5),
    defense: 5 + (vitality * 0.3)
  };
};

/**
 * Attributes reducer - manages player character attributes
 * 
 * Responsible for:
 * - Attribute updates and allocations
 * - Attribute point management
 * - Recalculating stats when attributes change
 */
export const attributesReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_ATTRIBUTE:
      // Define expected payload shape
      type AttributePayload = { attribute: keyof PlayerAttributes; value: number };
      
      // Type guard
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_ATTRIBUTE)) {
        return state;
      }
      
      const payload = action.payload as AttributePayload;
      if (!payload || !payload.attribute || typeof payload.value !== 'number') {
        return state;
      }
      
      // Create a properly typed copy of attributes
      const updatedAttributes: PlayerAttributes = {
        ...state.attributes,
        [payload.attribute]: payload.value
      };
      
      // Recalculate stats based on new attributes
      const updatedStats = calculateBaseStats(updatedAttributes);
      
      // Return updated state with proper typing
      return {
        ...state,
        attributes: updatedAttributes,
        stats: updatedStats
      };

    case PLAYER_ACTIONS.UPDATE_ATTRIBUTES:
      if (!action.payload || typeof action.payload !== 'object') {
        return state;
      }
      
      // Create a properly typed copy of attributes with only valid numeric values
      const updatedMultiAttributes: PlayerAttributes = {
        ...state.attributes
      };
      
      // Only add valid numeric properties to ensure type safety
      Object.entries(action.payload).forEach(([key, value]) => {
        if (typeof value === 'number') {
          updatedMultiAttributes[key] = value;
        }
      });
      
      // Recalculate stats based on new attributes
      const updatedMultiStats = calculateBaseStats(updatedMultiAttributes);
      return {
        ...state,
        attributes: updatedMultiAttributes,
        stats: updatedMultiStats
      };

    case PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE:
      // First check if action is of the correct type
      if (!isActionOfType(action, PLAYER_ACTIONS.ALLOCATE_ATTRIBUTE)) {
        return state;
      }
      
      if (!action.payload || 
          typeof action.payload.attributeName !== 'string' || 
          typeof action.payload.amount !== 'number') {
        return state;
      }
      
      const { attributeName, amount } = action.payload;
      
      // Create properly typed attributes
      const allocatedAttributes: PlayerAttributes = {
        ...state.attributes
      };
      
      // Only update if the attribute exists or can be added as a new attribute
      if (attributeName in allocatedAttributes || typeof amount === 'number') {
        allocatedAttributes[attributeName] = (allocatedAttributes[attributeName] || 0) + amount;
      }
      
      // Recalculate stats based on new attributes
      const allocatedStats = calculateBaseStats(allocatedAttributes);
      
      return {
        ...state,
        attributes: allocatedAttributes,
        stats: allocatedStats
      };

    case PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS:
      // Type guard for ADD_ATTRIBUTE_POINTS action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_ATTRIBUTE_POINTS)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a number
      // Handle the case when attributePoints is undefined
      const currentPoints = state.attributePoints || 0;
      
      return {
        ...state,
        attributePoints: currentPoints + action.payload
      };

    case PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS:
      type AttributePointsPayload = { attribute: keyof PlayerAttributes; points: number };
      
      // Type guard
      if (!isActionOfType(action, PLAYER_ACTIONS.SPEND_ATTRIBUTE_POINTS)) {
        return state;
      }
      
      const pointsPayload = action.payload as AttributePointsPayload;
      
      // Validate payload
      if (!pointsPayload || 
          !pointsPayload.attribute || 
          typeof pointsPayload.points !== 'number' || 
          pointsPayload.points <= 0) {
        return state;
      }
      
      // Check if player has enough attribute points
      const spendCurrentPoints = state.attributePoints || 0;
      if (spendCurrentPoints < pointsPayload.points) {
        return state;
      }
      
      // Create properly typed attributes
      const spendUpdatedAttributes: PlayerAttributes = {
        ...state.attributes,
        [pointsPayload.attribute]: (state.attributes[pointsPayload.attribute] || 0) + pointsPayload.points
      };
      
      // Recalculate stats
      const spendUpdatedStats = calculateBaseStats(spendUpdatedAttributes);
      
      return {
        ...state,
        attributes: spendUpdatedAttributes,
        stats: spendUpdatedStats,
        attributePoints: spendCurrentPoints - pointsPayload.points
      };

    default:
      return state;
  }
};
