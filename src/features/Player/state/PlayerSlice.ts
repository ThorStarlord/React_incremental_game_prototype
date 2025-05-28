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
  healthRegen: 1.0,      // Consistent naming
  manaRegen: 0.5,        // Consistent naming
  criticalChance: 0.05,
  criticalDamage: 1.5,
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
  stats: {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    defense: 5,
    speed: 10,
    healthRegen: 1.0,      // Consistent naming
    manaRegen: 0.5,        // Consistent naming
    criticalChance: 0.05,
    criticalDamage: 1.5,
  },
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
      const { attributes, statusEffects, stats: baseStats } = state;
      
      // Calculate attribute bonuses (D&D style: (attribute - 10) / 2)
      const strengthBonus = Math.floor((attributes.strength - 10) / 2);
      const dexterityBonus = Math.floor((attributes.dexterity - 10) / 2);
      const intelligenceBonus = Math.floor((attributes.intelligence - 10) / 2);
      const constitutionBonus = Math.floor((attributes.constitution - 10) / 2);
      const wisdomBonus = Math.floor((attributes.wisdom - 10) / 2);
      
      // Calculate derived stats from attributes
      const maxHealth = Math.max(1, baseStats.maxHealth + (constitutionBonus * 5));
      const maxMana = Math.max(0, baseStats.maxMana + (intelligenceBonus * 3));
      const healthRegen = Math.max(0, baseStats.healthRegen + (constitutionBonus * 0.1));
      const manaRegen = Math.max(0, baseStats.manaRegen + (wisdomBonus * 0.15));
      
      // Apply status effect modifiers
      let statusModifiers = {
        health: 0,
        mana: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        healthRegen: 0,     // Consistent naming
        manaRegen: 0,       // Consistent naming
        criticalChance: 0,
        criticalDamage: 0
      };
      
      statusEffects.forEach(effect => {
        if (effect.effects) {
          Object.entries(effect.effects).forEach(([stat, value]) => {
            if (stat in statusModifiers) {
              statusModifiers[stat as keyof typeof statusModifiers] += value as number;
            }
          });
        }
      });
      
      // Update calculated stats with consistent property names
      state.stats = {
        ...state.stats,
        maxHealth,
        maxMana,
        health: Math.max(0, Math.min(maxHealth, state.stats.health)),
        mana: Math.max(0, Math.min(maxMana, state.stats.mana)),
        attack: Math.max(0, baseStats.attack + strengthBonus + statusModifiers.attack),
        defense: Math.max(0, baseStats.defense + constitutionBonus + statusModifiers.defense),
        speed: Math.max(0, baseStats.speed + dexterityBonus + statusModifiers.speed),
        healthRegen: Math.max(0, healthRegen + statusModifiers.healthRegen),
        manaRegen: Math.max(0, manaRegen + statusModifiers.manaRegen),
        criticalChance: Math.max(0, Math.min(1, baseStats.criticalChance + (dexterityBonus * 0.01) + statusModifiers.criticalChance)),
        criticalDamage: Math.max(1, baseStats.criticalDamage + (strengthBonus * 0.05) + statusModifiers.criticalDamage),
      };
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
