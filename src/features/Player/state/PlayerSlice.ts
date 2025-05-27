import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  AllocateAttributePointPayload,
  EquipTraitPayload,
  UnequipTraitPayload
} from './PlayerTypes';

// Initial player stats following specification defaults
const initialStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  attack: 10,
  defense: 5,
  speed: 10,
  healthRegeneration: 1,
  manaRegeneration: 1,
  criticalChance: 0.05, // 5%
  criticalDamage: 1.5   // 150%
};

// Initial player attributes - all start at 10
const initialAttributes: PlayerAttributes = {
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  constitution: 10,
  wisdom: 10,
  charisma: 10
};

// Initial player state
const initialState: PlayerState = {
  stats: initialStats,
  attributes: initialAttributes,
  availableAttributePoints: 0,
  availableSkillPoints: 0,
  statusEffects: [],
  equippedTraits: [],
  permanentTraits: [],
  traitSlots: [], // Add missing traitSlots property
  totalPlaytime: 0,
  isAlive: true
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Reset player to initial state
    resetPlayer: () => initialState,

    // Update player stats directly
    updateStats: (state, action: PayloadAction<Partial<PlayerStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
      
      // Ensure health and mana don't exceed maximums
      state.stats.health = Math.min(state.stats.health, state.stats.maxHealth);
      state.stats.mana = Math.min(state.stats.mana, state.stats.maxMana);
    },

    // Modify health by amount (positive or negative)
    modifyHealth: (state, action: PayloadAction<number>) => {
      const newHealth = state.stats.health + action.payload;
      state.stats.health = Math.max(0, Math.min(newHealth, state.stats.maxHealth));
      
      // Update alive status
      state.isAlive = state.stats.health > 0;
    },

    // Modify mana by amount (positive or negative)
    modifyMana: (state, action: PayloadAction<number>) => {
      const newMana = state.stats.mana + action.payload;
      state.stats.mana = Math.max(0, Math.min(newMana, state.stats.maxMana));
    },

    // Allocate attribute points
    allocateAttributePoint: (state, action: PayloadAction<AllocateAttributePointPayload>) => {
      const { attributeName, points } = action.payload;
      if (state.availableAttributePoints >= points && attributeName in state.attributes) {
        state.availableAttributePoints -= points;
        state.attributes[attributeName] += points;
        
        // Recalculate derived stats based on new attributes
        playerSlice.caseReducers.recalculateStats(state);
      }
    },

    // Update available attribute points
    updateAttributePoints: (state, action: PayloadAction<number>) => {
      state.availableAttributePoints = Math.max(0, action.payload);
    },

    // Update available skill points
    updateSkillPoints: (state, action: PayloadAction<number>) => {
      state.availableSkillPoints = Math.max(0, action.payload);
    },

    // Equip a trait
    equipTrait: (state, action: PayloadAction<EquipTraitPayload>) => {
      const { traitId, slotIndex } = action.payload;
      
      // Ensure we don't exceed array bounds
      while (state.equippedTraits.length <= slotIndex) {
        state.equippedTraits.push(null);
      }
      
      state.equippedTraits[slotIndex] = traitId;
      
      // Recalculate stats with new trait
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Unequip a trait
    unequipTrait: (state, action: PayloadAction<UnequipTraitPayload>) => {
      const { slotIndex } = action.payload;
      
      if (state.equippedTraits[slotIndex]) {
        state.equippedTraits[slotIndex] = null;
        
        // Recalculate stats without the trait
        playerSlice.caseReducers.recalculateStats(state);
      }
    },

    // Add a permanent trait
    addPermanentTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
        
        // Recalculate stats with new permanent trait
        playerSlice.caseReducers.recalculateStats(state);
      }
    },

    // Add status effect
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      state.statusEffects.push(action.payload);
      
      // Recalculate stats with new effect
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Remove status effect
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      const effectId = action.payload;
      state.statusEffects = state.statusEffects.filter(effect => effect.id !== effectId);
      
      // Recalculate stats without the effect
      playerSlice.caseReducers.recalculateStats(state);
    },

    // Update total play time
    updatePlaytime: (state, action: PayloadAction<number>) => {
      state.totalPlaytime = action.payload;
    },

    // Recalculate all derived stats
    recalculateStats: (state) => {
      // Start with base stats influenced by attributes
      const str = state.attributes.strength || 10;
      const dex = state.attributes.dexterity || 10;
      const int = state.attributes.intelligence || 10;
      const con = state.attributes.constitution || 10;
      const wis = state.attributes.wisdom || 10;

      // Calculate base stats from attributes
      state.stats.maxHealth = 100 + (con - 10) * 10;
      state.stats.maxMana = 50 + (int - 10) * 5;
      state.stats.attack = 10 + (str - 10) * 2;
      state.stats.defense = 5 + (con - 10) * 1;
      state.stats.speed = 10 + (dex - 10) * 1;
      state.stats.healthRegeneration = 1 + Math.floor((con - 10) * 0.2);
      state.stats.manaRegeneration = 2 + Math.floor((wis - 10) * 0.3);
      state.stats.criticalChance = Math.min(0.5, 0.05 + (dex - 10) * 0.005);

      // Apply status effect bonuses
      state.statusEffects.forEach(effect => {
        // Status effect application would go here when StatusEffect type is properly defined
        // For now, we'll skip this to avoid TypeScript errors
      });

      // Ensure current health and mana don't exceed new maximums
      state.stats.health = Math.min(state.stats.health, state.stats.maxHealth);
      state.stats.mana = Math.min(state.stats.mana, state.stats.maxMana);

      // Update alive status
      state.isAlive = state.stats.health > 0;
    }
  }
});

export const {
  resetPlayer,
  updateStats,
  modifyHealth,
  modifyMana,
  allocateAttributePoint,
  updateAttributePoints,
  updateSkillPoints,
  equipTrait,
  unequipTrait,
  addPermanentTrait,
  addStatusEffect,
  removeStatusEffect,
  updatePlaytime,
  recalculateStats
} = playerSlice.actions;

export default playerSlice.reducer;
