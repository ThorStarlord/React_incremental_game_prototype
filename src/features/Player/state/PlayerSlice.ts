/**
 * Redux slice for Player state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayerAttributes, TraitSlot, StatusEffect, PlayerBaseStats } from './PlayerTypes';
import { MAX_TRAIT_SLOTS, INITIAL_TRAIT_SLOTS } from '../../../constants/playerConstants';

/**
 * Helper function to create the initial array of trait slots.
 */
const createInitialTraitSlots = (): TraitSlot[] => {
  const slots: TraitSlot[] = [];
  for (let i = 0; i < MAX_TRAIT_SLOTS; i++) {
    slots.push({
      id: `player_trait_slot_${i}`,
      slotIndex: i,
      traitId: null,
      isLocked: i >= INITIAL_TRAIT_SLOTS,
      unlockRequirement: i >= INITIAL_TRAIT_SLOTS ? `Unlock at Resonance Level ${i + 1}` : undefined,
    });
  }
  return slots;
};
/**
 * Initial state for the Player system
 */
const initialState: PlayerState = {
  // Base stats are unmodified by traits or status effects
  baseStats: {
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
  },
  // Final, calculated stats including all bonuses
  stats: {
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
  },
  attributes: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    constitution: 10,
    wisdom: 10,
    charisma: 10,
  },
  availableAttributePoints: 0,
  availableSkillPoints: 0,
  resonanceLevel: 0,
  maxTraitSlots: 5,
  statusEffects: [],
  permanentTraits: [],
  traitSlots: createInitialTraitSlots(),
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
    // NEW: Reducer to apply the newly calculated stats from the thunk
    applyCalculatedStats: (state, action: PayloadAction<PlayerBaseStats>) => {
        state.stats = action.payload;
        // Ensure current health/mana don't exceed new max values
        state.stats.health = Math.min(state.stats.health, state.stats.maxHealth);
        state.stats.mana = Math.min(state.stats.mana, state.stats.maxMana);
    },
    updateHealth: (state, action: PayloadAction<number>) => {
      state.stats.health = Math.max(0, Math.min(state.stats.maxHealth, action.payload));
      if (state.stats.health <= 0) {
        state.isAlive = false;
      }
    },
    updateMana: (state, action: PayloadAction<number>) => {
      state.stats.mana = Math.max(0, Math.min(state.stats.maxMana, action.payload));
    },
    addAttributePoints: (state, action: PayloadAction<number>) => {
      state.availableAttributePoints += action.payload;
    },
    allocateAttributePoint: (state, action: PayloadAction<{ attribute: keyof PlayerAttributes }>) => {
      if (state.availableAttributePoints > 0) {
        state.attributes[action.payload.attribute]++;
        state.availableAttributePoints--;
      }
    },
    updatePlaytime: (state, action: PayloadAction<number>) => {
      state.totalPlaytime += action.payload;
    },
    resetPlayerState: (state) => {
      Object.assign(state, initialState);
    },
    addPermanentTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
      }
    },
    removePermanentTrait: (state, action: PayloadAction<string>) => {
        state.permanentTraits = state.permanentTraits.filter(id => id !== action.payload);
    },
    setResonanceLevel: (state, action: PayloadAction<number>) => {
      state.resonanceLevel = action.payload;
    },
    addAvailableAttributePoints: (state, action: PayloadAction<number>) => {
        state.availableAttributePoints += action.payload;
    },
    addAvailableSkillPoints: (state, action: PayloadAction<number>) => {
        state.availableSkillPoints += action.payload;
    },
    setIsAlive: (state, action: PayloadAction<boolean>) => {
      state.isAlive = action.payload;
    },
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      const existingIndex = state.statusEffects.findIndex(effect => effect.id === action.payload.id);
      if (existingIndex > -1) {
        state.statusEffects[existingIndex] = action.payload;
      } else {
        state.statusEffects.push(action.payload);
      }
    },
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      state.statusEffects = state.statusEffects.filter(effect => effect.id !== action.payload);
    },
    equipTrait: (state, action: PayloadAction<{ traitId: string; slotIndex: number }>) => {
      const { traitId, slotIndex } = action.payload;
      let targetIndex = slotIndex;

      if (targetIndex === -1) {
        targetIndex = state.traitSlots.findIndex(slot => !slot.isLocked && slot.traitId === null);
      }

      if (targetIndex !== -1 && state.traitSlots[targetIndex] && !state.traitSlots[targetIndex].isLocked) {
        state.traitSlots[targetIndex].traitId = traitId;
      }
    },
    unequipTrait: (state, action: PayloadAction<{ slotIndex: number }>) => {
      const { slotIndex } = action.payload;
      if (state.traitSlots[slotIndex]) {
        state.traitSlots[slotIndex].traitId = null;
      }
    },
    unlockTraitSlot: (state, action: PayloadAction<number>) => {
      const slot = state.traitSlots.find(s => s.slotIndex === action.payload);
      if (slot && slot.isLocked) {
        slot.isLocked = false;
      }
    },
  },
});

export const {
  applyCalculatedStats,
  updateHealth,
  updateMana,
  addAttributePoints,
  allocateAttributePoint,
  updatePlaytime,
  resetPlayerState,
  addPermanentTrait,
  removePermanentTrait,
  setResonanceLevel,
  addAvailableAttributePoints,
  addAvailableSkillPoints,
  setIsAlive,
  addStatusEffect,
  removeStatusEffect,
  equipTrait,
  unequipTrait,
  unlockTraitSlot,
} = playerSlice.actions;

export default playerSlice.reducer;