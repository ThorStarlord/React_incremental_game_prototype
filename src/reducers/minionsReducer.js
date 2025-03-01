/**
 * @file Reducer to handle minion-related actions in the incremental RPG game
 * @module minionsReducer
 */

/**
 * Action Types for minion-related operations
 * @constant {Object}
 */
export const MINION_ACTIONS = {
  BUY_MINION: 'minions/buyMinion',
  UPGRADE_MINION: 'minions/upgradeMinion',
  COLLECT_RESOURCES: 'minions/collectResources',
  UNLOCK_MINION_TYPE: 'minions/unlockMinionType',
  RESET_MINIONS: 'minions/resetMinions',
};

/**
 * Initial state for the minions reducer
 * @type {Object}
 */
const initialState = {
  minions: [
    {
      id: 'worker',
      name: 'Worker',
      description: 'A basic worker that generates 1 gold per second',
      quantity: 0,
      level: 1,
      baseCost: 10,
      costMultiplier: 1.15,
      baseProduction: 1,
      productionMultiplier: 1.1,
      unlocked: true,
      resource: 'gold',
      lastCollected: Date.now(),
    },
    {
      id: 'miner',
      name: 'Miner',
      description: 'Extracts ore from the mines',
      quantity: 0,
      level: 1,
      baseCost: 100,
      costMultiplier: 1.20,
      baseProduction: 5,
      productionMultiplier: 1.15,
      unlocked: false,
      resource: 'ore',
      lastCollected: Date.now(),
      requiredResources: { gold: 200 }
    }
    // More minion types can be added here
  ],
  totalProduction: {
    gold: 0,
    ore: 0,
  }
};

/**
 * Calculate the current cost of buying a minion
 * @param {Object} minion - The minion object
 * @returns {number} The current cost
 */
export const calculateMinionCost = (minion) => {
  return Math.floor(minion.baseCost * Math.pow(minion.costMultiplier, minion.quantity));
};

/**
 * Calculate the current production of a minion type
 * @param {Object} minion - The minion object
 * @returns {number} The current production rate per second
 */
export const calculateMinionProduction = (minion) => {
  return minion.baseProduction * 
         minion.quantity * 
         Math.pow(minion.productionMultiplier, minion.level - 1);
};

/**
 * Calculate resources generated since last collection
 * @param {Object} minion - The minion object
 * @param {number} currentTime - Current timestamp
 * @returns {number} Resources generated
 */
export const calculateGeneratedResources = (minion, currentTime) => {
  if (minion.quantity === 0) return 0;
  
  const elapsedSeconds = (currentTime - minion.lastCollected) / 1000;
  return Math.floor(calculateMinionProduction(minion) * elapsedSeconds);
};

/**
 * Minions reducer function
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} New state
 */
const minionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case MINION_ACTIONS.BUY_MINION: {
      const { minionId, amount = 1 } = action.payload;
      
      return {
        ...state,
        minions: state.minions.map(minion => 
          minion.id === minionId
            ? { ...minion, quantity: minion.quantity + amount }
            : minion
        ),
        totalProduction: recalculateTotalProduction(state.minions.map(minion => 
          minion.id === minionId
            ? { ...minion, quantity: minion.quantity + amount }
            : minion
        ))
      };
    }
    
    case MINION_ACTIONS.UPGRADE_MINION: {
      const { minionId } = action.payload;
      
      return {
        ...state,
        minions: state.minions.map(minion => 
          minion.id === minionId
            ? { ...minion, level: minion.level + 1 }
            : minion
        ),
        totalProduction: recalculateTotalProduction(state.minions.map(minion => 
          minion.id === minionId
            ? { ...minion, level: minion.level + 1 }
            : minion
        ))
      };
    }
    
    case MINION_ACTIONS.COLLECT_RESOURCES: {
      const currentTime = action.payload?.timestamp || Date.now();
      
      return {
        ...state,
        minions: state.minions.map(minion => ({
          ...minion,
          lastCollected: currentTime
        }))
      };
    }
    
    case MINION_ACTIONS.UNLOCK_MINION_TYPE: {
      const { minionId } = action.payload;
      
      return {
        ...state,
        minions: state.minions.map(minion => 
          minion.id === minionId
            ? { ...minion, unlocked: true }
            : minion
        )
      };
    }
    
    case MINION_ACTIONS.RESET_MINIONS:
      return initialState;
      
    default:
      return state;
  }
};

/**
 * Recalculate total production for all resources
 * @param {Array} minions - Array of minion objects
 * @returns {Object} Total production by resource type
 */
function recalculateTotalProduction(minions) {
  const production = {};
  
  minions.forEach(minion => {
    if (minion.quantity > 0) {
      const resourceType = minion.resource;
      const productionRate = calculateMinionProduction(minion);
      
      production[resourceType] = (production[resourceType] || 0) + productionRate;
    }
  });
  
  return production;
}

export default minionsReducer;
