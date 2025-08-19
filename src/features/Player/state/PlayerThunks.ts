import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { applyCalculatedStats, updateHealth, updateMana } from './PlayerSlice';
import { processTraitEffects } from '../utils/traitEffectProcessor';
import { PlayerStats } from '../state/PlayerTypes';
import { recalculatePlayerStats as calculateStatsFromAttributes } from '../utils/playerStatCalculations';

/**
 * Thunk for recalculating all player stats based on attributes, traits, and status effects.
 */
export const recalculateStatsThunk = createAsyncThunk(
  'player/recalculateStats',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const player = state.player;
    const allTraits = state.traits.traits;

    // --- Step 1: Calculate stats from base values and attributes ---
    let finalStats = calculateStatsFromAttributes(player);
    
    // --- Step 2: Get all active traits ---
    const activeTraitIds = new Set([
      ...player.permanentTraits,
      ...player.traitSlots.map(slot => slot.traitId).filter(Boolean) as string[]
    ]);
    
    const activeTraits = Array.from(activeTraitIds).map(id => allTraits[id]).filter(Boolean);

    // --- Step 3: Process trait effects, applying them to the stats from step 1 ---
    finalStats = processTraitEffects(activeTraits, finalStats);

    // --- Step 4: Process status effects (buffs/debuffs) ---
  player.statusEffects.forEach(effect => {
    if (!effect.effects) return;
    for (const [stat, value] of Object.entries(effect.effects)) {
      if (stat in finalStats && typeof value === 'number') {
        (finalStats as any)[stat] += value;
      }
    }
  });

    // --- Step 5: Dispatch the final calculated stats to the store ---
    dispatch(applyCalculatedStats(finalStats));
    
    return finalStats;
  }
);

/**
 * Placeholder thunk for processing status effects (duration, etc.)
 */
export const processStatusEffectsThunk = createAsyncThunk(
  'player/processStatusEffects',
  async () => {
    // TODO: Implement duration countdown and effect removal
    return [];
  }
);

/**
 * Placeholder thunk for regenerating vitals based on final stats
 */
export const regenerateVitalsThunk = createAsyncThunk(
  'player/regenerateVitals',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { health, maxHealth, mana, maxMana, healthRegen, manaRegen } = state.player.stats;
    const isAlive = state.player.isAlive;

    if (!isAlive) return;

    const newHealth = Math.min(maxHealth, health + healthRegen);
    const newMana = Math.min(maxMana, mana + manaRegen);
    
    // Dispatch synchronous updates
    if (newHealth !== health) {
        dispatch(updateHealth(newHealth));
    }
    if (newMana !== mana) {
        dispatch(updateMana(newMana));
    }
    
    return { newHealth, newMana };
  }
);