import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  AllocateAttributePointPayload,
  EquipTraitPayload,
  UnequipTraitPayload,
} from './PlayerTypes';
import { TraitSlot } from '../../Traits/state/TraitsTypes'; // Import TraitSlot
import { processStatusEffectsThunk, regenerateVitalsThunk, useConsumableItemThunk, autoAllocateAttributesThunk, recalculateStatsThunk } from './PlayerThunks'; // Added recalculateStatsThunk

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

// Initial trait slots for player (default unlocked)
const initialPlayerTraitSlots: TraitSlot[] = [
  { id: 'player-slot-0', index: 0, isUnlocked: true, traitId: null },
  { id: 'player-slot-1', index: 1, isUnlocked: false, unlockRequirements: { type: 'resonanceLevel', value: 2 } },
  { id: 'player-slot-2', index: 2, isUnlocked: false, unlockRequirements: { type: 'resonanceLevel', value: 3 } },
  { id: 'player-slot-3', index: 3, isUnlocked: false, unlockRequirements: { type: 'resonanceLevel', value: 4 } },
  { id: 'player-slot-4', index: 4, isUnlocked: false, unlockRequirements: { type: 'resonanceLevel', value: 5 } },
];

// Initial player state - Exporting for use in thunks
export const initialState: PlayerState = {
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
  permanentTraits: [],
  traitSlots: initialPlayerTraitSlots, // Use the new initial player trait slots
  maxTraitSlots: 5, // Max slots for the player
  totalPlaytime: 0,
  isAlive: true,
  resonanceLevel: 1, // Initial Resonance Level
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
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
        // recalculateStatsThunk should be dispatched by the calling component/middleware
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

    // Equip a trait to a specific slot
    equipTrait: (state, action: PayloadAction<EquipTraitPayload>) => {
      const { traitId, slotIndex } = action.payload;
      
      const targetSlot = state.traitSlots.find(slot => slot.index === slotIndex);

      if (!targetSlot) {
        console.warn(`Slot index ${slotIndex} not found.`);
        return;
      }
      if (!targetSlot.isUnlocked) {
        console.warn(`Slot index ${slotIndex} is locked.`);
        return;
      }
      if (targetSlot.traitId) {
        console.warn(`Slot index ${slotIndex} is already occupied by ${targetSlot.traitId}.`);
        return; // Or handle replacement if desired
      }

      targetSlot.traitId = traitId;
      console.log(`Equipped trait ${traitId} to slot index ${targetSlot.index}.`);
      
      // Recalculate stats with new trait
      // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      // recalculateStatsThunk should be dispatched by the calling component/middleware
    },

    // Unequip a trait from a specific slot
    unequipTrait: (state, action: PayloadAction<UnequipTraitPayload>) => {
      const { slotIndex } = action.payload;
      
      const targetSlot = state.traitSlots.find(slot => slot.index === slotIndex);

      if (targetSlot && targetSlot.traitId) {
        targetSlot.traitId = null;
        console.log(`Unequipped trait from slot index ${slotIndex}.`);
        
        // Recalculate stats without the trait
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
        // recalculateStatsThunk should be dispatched by the calling component/middleware
      }
    },

    // Add a permanent trait
    addPermanentTrait: (state, action: PayloadAction<string>) => {
      const traitId = action.payload;
      if (!state.permanentTraits.includes(traitId)) {
        state.permanentTraits.push(traitId);
        
        // Recalculate stats with new permanent trait
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
        // recalculateStatsThunk should be dispatched by the calling component/middleware
      }
    },

    // Unlock a player trait slot
    unlockTraitSlot: (state, action: PayloadAction<number>) => {
      const slotIndex = action.payload;
      const slot = state.traitSlots.find(s => s.index === slotIndex);
      
      if (slot && !slot.isUnlocked) {
        slot.isUnlocked = true;
        console.log(`Player trait slot ${slotIndex} unlocked.`);
      }
    },

    // Update player's Resonance Level
    updateResonanceLevel: (state, action: PayloadAction<number>) => {
      state.resonanceLevel = action.payload;
    },

    // Add status effect
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      state.statusEffects.push(action.payload);
      
      // Recalculate stats with new effect
      // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      // recalculateStatsThunk should be dispatched by the calling component/middleware
    },

    // Remove status effect
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      const effectId = action.payload;
      state.statusEffects = state.statusEffects.filter(effect => effect.id !== effectId);
      
      // Recalculate stats without the effect
      // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      // recalculateStatsThunk should be dispatched by the calling component/middleware
    },

    // Update total play time
    updatePlaytime: (state, action: PayloadAction<number>) => {
      state.totalPlaytime = action.payload;
    },

    // Recalculate all derived stats - This logic is now primarily in recalculateStatsThunk.
    // This reducer can be kept simple or removed if all recalculations are triggered via the thunk.
    // For now, let's make it a no-op or a very basic stat consistency check if needed.
    // The thunk `recalculateStatsThunk` will dispatch `updateStats` with the full calculation.
    recalculateStats: (state) => {
      // Placeholder: The main logic is moved to recalculateStatsThunk.
      // Ensure health and mana don't exceed maximums after any direct modifications.
      // This is a safety net if updateStats isn't called immediately after a direct change.
      if (state.stats.health > state.stats.maxHealth) {
        state.stats.health = state.stats.maxHealth;
      }
      if (state.stats.mana > state.stats.maxMana) {
        state.stats.mana = state.stats.maxMana;
      }
      if (state.stats.health < 0) state.stats.health = 0;
      if (state.stats.mana < 0) state.stats.mana = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processStatusEffectsThunk.fulfilled, (state, action) => {
        const expiredEffectIds = action.payload;
        state.statusEffects = state.statusEffects.filter(effect => !expiredEffectIds.includes(effect.id));
        // Recalculate stats after status effects are removed
        // The recalculateStatsThunk will need to be dispatched by the component that dispatches processStatusEffectsThunk
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      })
      .addCase(regenerateVitalsThunk.fulfilled, (state, action) => {
        state.stats.health += action.payload.healthRegenerated;
        state.stats.mana += action.payload.manaRegenerated;
        // Recalculate stats after regeneration
        // The recalculateStatsThunk will need to be dispatched by the component that dispatches regenerateVitalsThunk
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      })
      .addCase(useConsumableItemThunk.fulfilled, (state, action) => {
        const { effectsApplied, statsModified } = action.payload;
        effectsApplied.forEach(effect => {
          state.statusEffects.push(effect);
        });
        if (statsModified.health) {
          state.stats.health += statsModified.health;
        }
        if (statsModified.mana) {
          state.stats.mana += statsModified.mana;
        }
        // Recalculate stats after consumable item effects
        // The recalculateStatsThunk will need to be dispatched by the component that dispatches useConsumableItemThunk
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      })
      .addCase(autoAllocateAttributesThunk.fulfilled, (state, action) => {
        const allocation = action.payload;
        for (const attr in allocation) {
          if (allocation.hasOwnProperty(attr)) {
            state.attributes[attr as keyof PlayerAttributes] += allocation[attr];
          }
        }
        state.availableAttributePoints -= Object.values(allocation).reduce((sum, val) => sum + val, 0);
        // Recalculate stats after attribute allocation
        // The recalculateStatsThunk will need to be dispatched by the component that dispatches autoAllocateAttributesThunk
        // playerSlice.caseReducers.recalculateStats(state); // Removed direct call
      });
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
  unlockTraitSlot, // Export new action
  updateResonanceLevel, // Export new action
  addStatusEffect,
  removeStatusEffect,
  updatePlaytime,
  recalculateStats
} = playerSlice.actions;

export default playerSlice.reducer;
