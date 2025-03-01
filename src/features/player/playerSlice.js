import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial player state containing all relevant player information
 * @typedef {Object} PlayerState
 * @property {string} name - Player's character name
 * @property {number} level - Current player level
 * @property {number} experience - Current experience points
 * @property {number} experienceToNextLevel - Experience required for next level
 * @property {Object} stats - Character statistics
 * @property {number} stats.strength - Physical power (affects damage)
 * @property {number} stats.dexterity - Agility and precision
 * @property {number} stats.intelligence - Magic power and learning
 * @property {number} stats.vitality - Health and stamina
 * @property {Object} attributes - Derived attributes
 * @property {number} attributes.maxHealth - Maximum health points
 * @property {number} attributes.currentHealth - Current health points
 * @property {number} attributes.attackPower - Base attack power
 * @property {number} attributes.defense - Damage reduction
 * @property {Object} resources - Player resources
 * @property {number} resources.gold - In-game currency
 * @property {number} resources.gems - Premium currency
 * @property {Array} inventory - Items the player owns
 * @property {Object} equipment - Currently equipped items
 * @property {Array} skills - Unlocked skills
 * @property {number} statPoints - Available points to allocate to stats
 * @property {number} skillPoints - Available points to learn skills
 */

const initialState = {
  name: 'Hero',
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  stats: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    vitality: 10
  },
  attributes: {
    maxHealth: 100,
    currentHealth: 100,
    attackPower: 5,
    defense: 3
  },
  resources: {
    gold: 50,
    gems: 0
  },
  inventory: [],
  equipment: {
    weapon: null,
    armor: null,
    helmet: null,
    accessory: null
  },
  skills: [],
  statPoints: 0,
  skillPoints: 0
};

/**
 * Calculates experience needed for a given level
 * @param {number} level - The level to calculate experience for
 * @returns {number} Experience points needed
 */
const calculateExperienceForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Recalculates derived attributes based on stats and equipment
 * @param {Object} state - The current player state
 * @returns {Object} Updated attributes
 */
const recalculateAttributes = (state) => {
  const { stats, equipment } = state;
  
  // Base calculations from stats
  const maxHealth = stats.vitality * 10;
  const attackPower = stats.strength * 0.5;
  const defense = stats.dexterity * 0.3;
  
  // Add equipment bonuses (simplified implementation)
  // In a real game, we'd iterate through equipped items and apply their bonuses
  
  return {
    maxHealth,
    currentHealth: Math.min(state.attributes.currentHealth, maxHealth), // Don't exceed new max
    attackPower,
    defense
  };
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    /**
     * Sets or changes the player's name
     */
    setName: (state, action) => {
      state.name = action.payload;
    },
    
    /**
     * Adds experience points and handles leveling up when threshold is reached
     */
    gainExperience: (state, action) => {
      state.experience += action.payload;
      
      // Check for level up
      while (state.experience >= state.experienceToNextLevel) {
        state.experience -= state.experienceToNextLevel;
        state.level += 1;
        state.experienceToNextLevel = calculateExperienceForLevel(state.level);
        state.statPoints += 5;
        state.skillPoints += 1;
      }
    },
    
    /**
     * Increases a specific stat if stat points are available
     */
    increaseStat: (state, action) => {
      const statName = action.payload;
      if (state.statPoints > 0 && state.stats[statName] !== undefined) {
        state.stats[statName] += 1;
        state.statPoints -= 1;
        
        // Recalculate attributes after stat change
        state.attributes = recalculateAttributes(state);
      }
    },
    
    /**
     * Modifies player's health (damage or healing)
     */
    modifyHealth: (state, action) => {
      state.attributes.currentHealth = Math.max(
        0, 
        Math.min(
          state.attributes.currentHealth + action.payload,
          state.attributes.maxHealth
        )
      );
    },
    
    /**
     * Adds or removes gold from the player
     */
    modifyGold: (state, action) => {
      state.resources.gold = Math.max(0, state.resources.gold + action.payload);
    },
    
    /**
     * Adds or removes gems from the player
     */
    modifyGems: (state, action) => {
      state.resources.gems = Math.max(0, state.resources.gems + action.payload);
    },
    
    /**
     * Adds an item to the player's inventory
     */
    addToInventory: (state, action) => {
      state.inventory.push(action.payload);
    },
    
    /**
     * Removes an item from inventory by its ID
     */
    removeFromInventory: (state, action) => {
      const itemId = action.payload;
      state.inventory = state.inventory.filter(item => item.id !== itemId);
    },
    
    /**
     * Equips an item from inventory to the appropriate equipment slot
     */
    equipItem: (state, action) => {
      const { itemId, slot } = action.payload;
      const item = state.inventory.find(i => i.id === itemId);
      
      if (item && state.equipment[slot] !== undefined) {
        // If something is already equipped, put it back in inventory
        if (state.equipment[slot]) {
          state.inventory.push(state.equipment[slot]);
        }
        
        // Remove from inventory and equip
        state.inventory = state.inventory.filter(i => i.id !== itemId);
        state.equipment[slot] = item;
        
        // Recalculate attributes after equipment change
        state.attributes = recalculateAttributes(state);
      }
    },
    
    /**
     * Unequips an item and returns it to inventory
     */
    unequipItem: (state, action) => {
      const slot = action.payload;
      
      if (state.equipment[slot]) {
        state.inventory.push(state.equipment[slot]);
        state.equipment[slot] = null;
        
        // Recalculate attributes after equipment change
        state.attributes = recalculateAttributes(state);
      }
    },
    
    /**
     * Learns a new skill if skill points are available
     */
    learnSkill: (state, action) => {
      const skill = action.payload;
      
      if (state.skillPoints > 0 && !state.skills.some(s => s.id === skill.id)) {
        state.skills.push(skill);
        state.skillPoints -= 1;
      }
    },
    
    /**
     * Resets player state to initial values (for testing or game restart)
     */
    resetPlayer: () => initialState
  }
});

// Export actions for use in components
export const { 
  setName, 
  gainExperience, 
  increaseStat, 
  modifyHealth,
  modifyGold,
  modifyGems,
  addToInventory,
  removeFromInventory,
  equipItem,
  unequipItem,
  learnSkill,
  resetPlayer
} = playerSlice.actions;

/**
 * Selectors for accessing player state from components
 */
export const selectPlayer = state => state.player;
export const selectPlayerLevel = state => state.player.level;
export const selectPlayerExperience = state => ({
  current: state.player.experience,
  next: state.player.experienceToNextLevel
});
export const selectPlayerResources = state => state.player.resources;
export const selectPlayerHealth = state => ({
  current: state.player.attributes.currentHealth,
  max: state.player.attributes.maxHealth
});
export const selectPlayerStats = state => state.player.stats;

export default playerSlice.reducer;
