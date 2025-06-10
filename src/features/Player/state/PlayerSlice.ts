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
import { TraitSlot } from '../../Traits/state/TraitsTypes';
import type { ProcessedTraitEffects } from '../utils/traitEffectProcessor';
import {
  ATTRIBUTE_CONSTANTS,
  PROGRESSION_CONSTANTS,
  STAT_LIMITS
} from '../../../constants/playerConstants';

// Canonical initial state - single source of truth
export const initialState: PlayerState = {
  stats: {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    defense: 5,
    speed: 10,
    healthRegen: 1.0,
    manaRegen: 0.5,
    criticalChance: 0.05,
    criticalDamage: 1.5,
  },
  attributes: {
    strength: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
    dexterity: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
    intelligence: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
    constitution: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
    wisdom: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
    charisma: ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE,
  },
  availableAttributePoints: PROGRESSION_CONSTANTS.STARTING_ATTRIBUTE_POINTS,
  availableSkillPoints: PROGRESSION_CONSTANTS.STARTING_SKILL_POINTS,
  statusEffects: [],
  permanentTraits: [],
  traitSlots: [
    { id: 'slot-0', index: 0, isUnlocked: true, traitId: null },
    { id: 'slot-1', index: 1, isUnlocked: false, traitId: null, unlockRequirements: { type: 'resonanceLevel', value: 1 } },
    { id: 'slot-2', index: 2, isUnlocked: false, traitId: null, unlockRequirements: { type: 'resonanceLevel', value: 2 } },
    { id: 'slot-3', index: 3, isUnlocked: false, traitId: null, unlockRequirements: { type: 'resonanceLevel', value: 3 } },
  ],
  maxTraitSlots: PROGRESSION_CONSTANTS.MAX_TRAIT_SLOTS,
  totalPlaytime: 0,
  isAlive: true,
  resonanceLevel: PROGRESSION_CONSTANTS.STARTING_RESONANCE_LEVEL,
  activeTraitEffects: {
    statModifiers: {},
    specialEffects: {},
    multipliers: {}
  }
};

export const PlayerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Update player stats directly
    updateStats: (state, action: PayloadAction<PlayerStats>) => {
      state.stats = action.payload;
    },

    // Update active trait effects
    updateTraitEffects: (state, action: PayloadAction<ProcessedTraitEffects>) => {
      state.activeTraitEffects = action.payload;
    },

    // Allocate attribute points
    allocateAttributePoint: (state, action: PayloadAction<AllocateAttributePointPayload>) => {
      const { attribute } = action.payload;
      if (state.availableAttributePoints > 0 && state.attributes[attribute] < ATTRIBUTE_CONSTANTS.MAX_ATTRIBUTE_VALUE) {
        state.attributes[attribute] += 1;
        state.availableAttributePoints -= 1;
      }
    },

    // Add attribute points
    addAttributePoints: (state, action: PayloadAction<number>) => {
      state.availableAttributePoints += action.payload;
    },

    // Add skill points
    addSkillPoints: (state, action: PayloadAction<number>) => {
      state.availableSkillPoints += action.payload;
    },

    // Add a status effect
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      state.statusEffects.push(action.payload);
    },

    // Remove a status effect by ID
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      state.statusEffects = state.statusEffects.filter(effect => effect.id !== action.payload);
    },

    // Update status effects array
    updateStatusEffects: (state, action: PayloadAction<StatusEffect[]>) => {
      state.statusEffects = action.payload;
    },

    // Add a permanent trait
    addPermanentTrait: (state, action: PayloadAction<string>) => {
      if (!state.permanentTraits.includes(action.payload)) {
        state.permanentTraits.push(action.payload);
      }
    },

    // Remove a permanent trait
    removePermanentTrait: (state, action: PayloadAction<string>) => {
      state.permanentTraits = state.permanentTraits.filter(id => id !== action.payload);
    },

    // Equip a trait to a specific slot
    equipTrait: (state, action: PayloadAction<EquipTraitPayload>) => {
      const { slotIndex, traitId } = action.payload;
      const slot = state.traitSlots[slotIndex];
      if (slot && slot.isUnlocked) {
        slot.traitId = traitId;
      }
    },

    // Unequip a trait from a specific slot
    unequipTrait: (state, action: PayloadAction<UnequipTraitPayload>) => {
      const { slotIndex } = action.payload;
      const slot = state.traitSlots[slotIndex];
      if (slot) {
        slot.traitId = null;
      }
    },

    // Unlock a player trait slot
    unlockTraitSlot: (state, action: PayloadAction<number>) => {
      const slot = state.traitSlots[action.payload];
      if (slot) {
        slot.isUnlocked = true;
      }
    },

    // Update total play time
    updateTotalPlaytime: (state, action: PayloadAction<number>) => {
      state.totalPlaytime = action.payload;
    },

    // Set player's alive status
    setPlayerAlive: (state, action: PayloadAction<boolean>) => {
      state.isAlive = action.payload;
    },

    // Increment resonance level
    incrementResonanceLevel: (state) => {
      state.resonanceLevel += 1;
    },

    // Set resonance level directly
    setResonanceLevel: (state, action: PayloadAction<number>) => {
      state.resonanceLevel = Math.max(0, action.payload);
    },

    // Health and mana management with limits
    restoreHealth: (state, action: PayloadAction<number>) => {
      state.stats.health = Math.min(
        state.stats.maxHealth,
        state.stats.health + action.payload
      );
    },

    restoreMana: (state, action: PayloadAction<number>) => {
      state.stats.mana = Math.min(
        state.stats.maxMana,
        state.stats.mana + action.payload
      );
    },

    takeDamage: (state, action: PayloadAction<number>) => {
      state.stats.health = Math.max(
        STAT_LIMITS.MIN_HEALTH,
        state.stats.health - action.payload
      );
      if (state.stats.health <= 0) {
        state.isAlive = false;
      }
    },

    consumeMana: (state, action: PayloadAction<number>) => {
      state.stats.mana = Math.max(
        STAT_LIMITS.MIN_MANA,
        state.stats.mana - action.payload
      );
    },

    // Reset player to initial state
    resetPlayer: (state) => {
      return { ...initialState };
    },

    /**
     * Clear all equipped traits from player slots
     */
    clearAllEquippedTraits: (state) => {
      state.traitSlots.forEach(slot => {
        if (slot.traitId && slot.isUnlocked) { // Changed !slot.isLocked to slot.isUnlocked
          slot.traitId = null;
        }
      });
      
      // Recalculate stats after clearing traits (removed direct call, handled by thunk dispatch)
    },

    /**
     * Load trait preset configuration
     */
    loadTraitPreset: (state, action: PayloadAction<string[]>) => {
      const traitIds = action.payload;
      
      // Clear existing equipped traits first (except permanent ones)
      state.traitSlots.forEach(slot => {
        if (slot.traitId && slot.isUnlocked && !state.permanentTraits.includes(slot.traitId)) { // Changed !slot.isLocked to slot.isUnlocked
          slot.traitId = null;
        }
      });
      
      // Equip traits from preset
      let availableSlots = state.traitSlots.filter(slot => slot.isUnlocked && slot.traitId === null); // Changed !slot.isLocked to slot.isUnlocked
      
      traitIds.forEach(traitId => {
        // Skip if trait is already permanent
        if (state.permanentTraits.includes(traitId)) {
          return;
        }
        
        // Find an available slot
        const slot = availableSlots.find(s => s.traitId === null);
        if (slot) {
          slot.traitId = traitId;
          // Remove this slot from available slots
          availableSlots = availableSlots.filter(s => s.id !== slot.id);
        }
      });
      
      // Recalculate stats after loading preset (removed direct call, handled by thunk dispatch)
    },
  },

  extraReducers: (builder) => {
    // Handle trait management actions from TraitsSlice
    builder.addCase(clearAllEquippedTraits, (state) => {
      state.traitSlots.forEach(slot => {
        if (slot.traitId && slot.isUnlocked) { // Changed !slot.isLocked to slot.isUnlocked
          slot.traitId = null;
        }
      });
      // Recalculate stats after clearing traits (removed direct call, handled by thunk dispatch)
    });
  },
});

export const {
  updateStats,
  updateTraitEffects,
  allocateAttributePoint,
  addAttributePoints,
  addSkillPoints,
  addStatusEffect,
  removeStatusEffect,
  updateStatusEffects,
  addPermanentTrait,
  removePermanentTrait,
  equipTrait,
  unequipTrait,
  unlockTraitSlot,
  updateTotalPlaytime,
  setPlayerAlive,
  incrementResonanceLevel,
  setResonanceLevel,
  restoreHealth,
  restoreMana,
  takeDamage,
  consumeMana,
  resetPlayer,
  clearAllEquippedTraits,
  loadTraitPreset,
} = PlayerSlice.actions;

export default PlayerSlice.reducer;
