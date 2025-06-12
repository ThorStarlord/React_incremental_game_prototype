/**
 * Redux slice for Player state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayerAttributes } from './PlayerTypes';

/**
 * Initial state for the Player system
 */
const initialState: PlayerState = {
  // Direct stat properties
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 10,
  speed: 10,
  healthRegen: 1,
  manaRegen: 0.5,
  criticalChance: 0.05,
  criticalDamage: 1.5,

  // Attributes
  attributes: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    constitution: 10,
    wisdom: 10,
    charisma: 10,
  },

  // Progression
  availableAttributePoints: 0,
  availableSkillPoints: 0,
  resonanceLevel: 0,
  maxTraitSlots: 3,

  // Traits and effects
  statusEffects: [],
  permanentTraits: [],
  traitSlots: [],

  // Character state
  totalPlaytime: 0,
  isAlive: true,
};

/**
 * Player Redux slice
 */
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    /**
     * Update player health
     */
    updateHealth: (state, action: PayloadAction<number>) => {
      state.health = Math.max(0, Math.min(state.maxHealth, action.payload));
      if (state.health <= 0) {
        state.isAlive = false;
      }
    },

    /**
     * Update player mana
     */
    updateMana: (state, action: PayloadAction<number>) => {
      state.mana = Math.max(0, Math.min(state.maxMana, action.payload));
    },

    /**
     * Add attribute points
     */
    addAttributePoints: (state, action: PayloadAction<number>) => {
      state.availableAttributePoints += action.payload;
    },

    /**
     * Allocate attribute point
     */
    allocateAttributePoint: (state, action: PayloadAction<{ attribute: keyof PlayerAttributes }>) => {
      if (state.availableAttributePoints > 0) {
        state.attributes[action.payload.attribute]++;
        state.availableAttributePoints--;
      }
    },

    /**
     * Update playtime
     */
    updatePlaytime: (state, action: PayloadAction<number>) => {
      state.totalPlaytime += action.payload;
    },

    /**
     * Reset player state
     */
    resetPlayer: (state) => {
      Object.assign(state, initialState);
    },

    // --- START OF FIX ---
    /**
     * FIXED: Add the missing reducer for adding a permanent trait.
     */
    addPermanentTrait: (state, action: PayloadAction<{ traitId: string }>) => {
      const { traitId } = action.payload;
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
      }
    },

    /**
     * FIXED: Add the missing reducer for incrementing resonance level.
     */
    incrementResonanceLevel: (state) => {
      state.resonanceLevel += 1;
    },
    // --- END OF FIX ---
  },
});

export const {
  updateHealth,
  updateMana,
  addAttributePoints,
  allocateAttributePoint,
  updatePlaytime,
  resetPlayer,
  // FIXED: Ensure these newly defined actions are included in the export list.
  addPermanentTrait,
  incrementResonanceLevel,
} = playerSlice.actions;

export default playerSlice.reducer;