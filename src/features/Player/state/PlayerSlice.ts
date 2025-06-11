import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayerAttributes, StatusEffect, ProcessedTraitEffects, PlayerStats } from './PlayerTypes';
import { updateActiveTraitEffectsThunk, recalculatePlayerStatsThunk } from './PlayerThunks';
import { BASE_STATS, INITIAL_ATTRIBUTES, MAX_TRAIT_SLOTS, INITIAL_TRAIT_SLOTS } from '../../../constants/playerConstants';

const initialState: PlayerState = {
  attributes: { ...INITIAL_ATTRIBUTES },
  baseStats: { ...BASE_STATS },
  calculatedStats: { ...BASE_STATS }, // Will be properly calculated on init/load
  currentHealth: BASE_STATS.maxHealth,
  currentMana: BASE_STATS.maxMana,
  statusEffects: [],
  activeTraitEffects: {},
  traitSlots: Array(INITIAL_TRAIT_SLOTS).fill(null),
  maxTraitSlots: MAX_TRAIT_SLOTS,
  permanentTraits: [],
  resonanceLevel: 1,
  attributePoints: 0,
  skillPoints: 0,
  playtime: 0,
  lastStatsUpdate: 0,
  isLoading: false,
  error: null,
};

// Helper function to calculate stats (simplified example)
const calculateFinalStats = (
  base: PlayerStats,
  attributes: PlayerAttributes,
  traitEffects: ProcessedTraitEffects,
  statusEffects: StatusEffect[]
): PlayerStats => {
  const finalStats = { ...base };

  // Apply attribute effects (example logic)
  finalStats.maxHealth += attributes.constitution * 10;
  finalStats.maxMana += attributes.intelligence * 5;
  finalStats.attack += attributes.strength * 2;
  finalStats.defense += attributes.constitution * 1;
  finalStats.speed += attributes.dexterity * 0.5;
  finalStats.criticalChance += attributes.dexterity * 0.005;
  finalStats.manaRegen += attributes.wisdom * 0.1;
  finalStats.healthRegen += attributes.constitution * 0.2;


  // Apply trait effects
  Object.entries(traitEffects).forEach(([statKey, value]) => {
    if (value !== undefined && statKey in finalStats) {
      (finalStats as any)[statKey] = ((finalStats as any)[statKey] || 0) + value;
    }
  });

  // Apply status effects
  statusEffects.forEach(status => {
    Object.entries(status.effects).forEach(([statKey, value]) => {
      if (value !== undefined && statKey in finalStats) {
        (finalStats as any)[statKey] = ((finalStats as any)[statKey] || 0) + value;
      }
    });
  });
  
  // Ensure stats don't go below reasonable minimums (e.g., 0 or 1 for some)
  finalStats.maxHealth = Math.max(1, finalStats.maxHealth);
  finalStats.maxMana = Math.max(0, finalStats.maxMana);
  finalStats.attack = Math.max(0, finalStats.attack);
  finalStats.defense = Math.max(0, finalStats.defense);
  finalStats.speed = Math.max(1, finalStats.speed);
  finalStats.criticalChance = Math.max(0, Math.min(1, finalStats.criticalChance));


  return finalStats;
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    applyDamage: (state, action: PayloadAction<number>) => {
      state.currentHealth = Math.max(0, state.currentHealth - action.payload);
    },
    healPlayer: (state, action: PayloadAction<number>) => {
      state.currentHealth = Math.min(state.calculatedStats.maxHealth, state.currentHealth + action.payload);
    },
    spendMana: (state, action: PayloadAction<number>) => {
      state.currentMana = Math.max(0, state.currentMana - action.payload);
    },
    restoreMana: (state, action: PayloadAction<number>) => {
      state.currentMana = Math.min(state.calculatedStats.maxMana, state.currentMana + action.payload);
    },
    addAttributePoint: (state, action: PayloadAction<{ attribute: keyof PlayerAttributes; amount: number }>) => {
      if (state.attributePoints >= action.payload.amount) {
        state.attributes[action.payload.attribute] += action.payload.amount;
        state.attributePoints -= action.payload.amount;
        // Note: recalculateStats should be dispatched after this
      }
    },
    addStatusEffect: (state, action: PayloadAction<StatusEffect>) => {
      // Avoid duplicate status effects by ID or allow stacking based on design
      const existingIndex = state.statusEffects.findIndex(se => se.id === action.payload.id);
      if (existingIndex !== -1) {
        state.statusEffects[existingIndex] = action.payload; // Refresh or stack
      } else {
        state.statusEffects.push(action.payload);
      }
      // Note: recalculateStats should be dispatched after this
    },
    removeStatusEffect: (state, action: PayloadAction<string>) => {
      state.statusEffects = state.statusEffects.filter(se => se.id !== action.payload);
      // Note: recalculateStats should be dispatched after this
    },
    processTickVitals: (state) => {
        // Health Regen
        const healthToRegen = state.calculatedStats.healthRegen / 10; // Assuming 10 ticks per second
        state.currentHealth = Math.min(state.calculatedStats.maxHealth, state.currentHealth + healthToRegen);
        // Mana Regen
        const manaToRegen = state.calculatedStats.manaRegen / 10; // Assuming 10 ticks per second
        state.currentMana = Math.min(state.calculatedStats.maxMana, state.currentMana + manaToRegen);
    },
    processTickStatusEffects: (state) => {
        let statsChanged = false;
        state.statusEffects = state.statusEffects.map(effect => {
            effect.remainingDuration -= 1; // Assuming 1 tick
            return effect;
        }).filter(effect => {
            if (effect.remainingDuration <= 0) {
                statsChanged = true;
                return false;
            }
            return true;
        });
        // If any status effect expired, stats might need recalculation
        // This is often handled by a thunk that then dispatches recalculateStats
    },
    recalculateStats: (state) => {
      state.calculatedStats = calculateFinalStats(
        state.baseStats,
        state.attributes,
        state.activeTraitEffects,
        state.statusEffects
      );
      // Ensure current health/mana are within new max values
      state.currentHealth = Math.min(state.currentHealth, state.calculatedStats.maxHealth);
      state.currentMana = Math.min(state.currentMana, state.calculatedStats.maxMana);
      state.lastStatsUpdate = Date.now();
    },
    equipTrait: (state, action: PayloadAction<{ traitId: string; slotIndex: number }>) => {
      if (action.payload.slotIndex >= 0 && action.payload.slotIndex < state.traitSlots.length) {
        state.traitSlots[action.payload.slotIndex] = action.payload.traitId;
        // recalculateStats should be dispatched
      }
    },
    unequipTrait: (state, action: PayloadAction<number>) => { // slotIndex
      if (action.payload >= 0 && action.payload < state.traitSlots.length) {
        state.traitSlots[action.payload] = null;
        // recalculateStats should be dispatched
      }
    },
    addPermanentTrait: (state, action: PayloadAction<string>) => {
        if (!state.permanentTraits.includes(action.payload)) {
            state.permanentTraits.push(action.payload);
            // recalculateStats should be dispatched
        }
    },
    setPlayerState: (state, action: PayloadAction<PlayerState>) => {
      // Used for loading game state
      return { ...state, ...action.payload };
    },
    incrementPlaytime: (state, action: PayloadAction<number>) => {
        state.playtime += action.payload; // payload is seconds
    },
    incrementResonanceLevel: (state, action: PayloadAction<number | undefined>) => {
      state.resonanceLevel += action.payload || 1;
      // Potentially add logic here if resonance level unlocks things, e.g., trait slots
      // For example:
      // if (state.resonanceLevel % 5 === 0 && state.traitSlots.length < state.maxTraitSlots) {
      //   state.traitSlots.push(null);
      // }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateActiveTraitEffectsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateActiveTraitEffectsThunk.fulfilled, (state, action) => {
        state.activeTraitEffects = action.payload;
        state.isLoading = false;
        // The recalculatePlayerStatsThunk dispatches 'player/recalculateStats' after this,
        // so no need to call calculateFinalStats directly here if using that thunk.
      })
      .addCase(updateActiveTraitEffectsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update trait effects';
      })
      // Example for recalculatePlayerStatsThunk if it had its own lifecycle (it currently dispatches actions)
      .addCase(recalculatePlayerStatsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(recalculatePlayerStatsThunk.fulfilled, (state) => {
        // This thunk internally dispatches 'player/recalculateStats'
        // so the main logic is in the 'recalculateStats' reducer.
        state.isLoading = false; 
      })
      .addCase(recalculatePlayerStatsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to recalculate stats';
      });
  },
});

export const {
  applyDamage,
  healPlayer,
  spendMana,
  restoreMana,
  addAttributePoint,
  addStatusEffect,
  removeStatusEffect,
  processTickVitals,
  processTickStatusEffects,
  recalculateStats,
  equipTrait,
  unequipTrait,
  addPermanentTrait,
  setPlayerState,
  incrementPlaytime,
  incrementResonanceLevel, // Add export here
} = playerSlice.actions;

export default playerSlice.reducer;
