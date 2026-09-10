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
 * Regenerate health and mana from the documented per-second rates using the
 * logical GameLoop delta in milliseconds. Invalid/non-positive elapsed input
 * is a no-op; maxima remain enforced by the existing Player reducers.
 */
export const regenerateVitalsThunk = createAsyncThunk<
  { newHealth: number; newMana: number } | undefined,
  number,
  { state: RootState }
>(
  'player/regenerateVitals',
  async (deltaTime, { getState, dispatch }) => {
    const state = getState();
    const { health, maxHealth, mana, maxMana, healthRegen, manaRegen } = state.player.stats;
    const isAlive = state.player.isAlive;

    if (!isAlive || !Number.isFinite(deltaTime) || deltaTime <= 0) {
      return undefined;
    }

    const elapsedSeconds = deltaTime / 1000;
    const newHealth = Math.min(maxHealth, health + (healthRegen * elapsedSeconds));
    const newMana = Math.min(maxMana, mana + (manaRegen * elapsedSeconds));
    
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