/**
 * @file CopyThunks.ts
 * @description Thunks for handling asynchronous Copy logic, like creation, growth, and loyalty.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import type { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { PlayerStats } from '../../Player/state/PlayerTypes';
import { addCopy, updateCopy } from './CopySlice';
import type { Copy } from './CopyTypes';

// Default starting stats for a new Copy
const defaultCopyStats: PlayerStats = {
  health: 50,
  maxHealth: 50,
  mana: 25,
  maxMana: 25,
  attack: 5,
  defense: 5,
  speed: 10,
  healthRegen: 0.5,
  manaRegen: 0.5,
  criticalChance: 0.05,
  criticalDamage: 1.5,
};

interface CreateCopyPayload {
  npcId: string;
}

/**
 * Thunk to process maturity growth for all active copies.
 * Increases maturity from 0 to 100 based on deltaTime (ms).
 */
export const processCopyGrowthThunk = createAsyncThunk(
  'copy/processGrowth',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const copies = state.copy.copies;
    // Calculate growth per tick based on the growth rate and elapsed time in seconds.
    const growthThisTick = COPY_SYSTEM.GROWTH_RATE_PER_SECOND * (deltaTime / 1000);

    for (const copy of Object.values(copies)) {
      if (copy.maturity < 100) {
        const newMaturity = Math.min(100, copy.maturity + growthThisTick);
        dispatch(updateCopy({ copyId: copy.id, updates: { maturity: newMaturity } }));
      }
    }
  }
);

/**
 * Thunk to process loyalty decay for all copies.
 * Decreases loyalty over time, not below 0.
 */
export const processCopyLoyaltyDecayThunk = createAsyncThunk(
  'copy/processLoyaltyDecay',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const copies = state.copy.copies;
    // Decay rate: COPY_SYSTEM.DECAY_RATE_PER_SECOND per second. This value can be adjusted to fine-tune gameplay difficulty or to align with design goals for loyalty decay.
    const decayThisTick = COPY_SYSTEM.DECAY_RATE_PER_SECOND * (deltaTime / 1000);

    for (const copy of Object.values(copies)) {
      if (copy.loyalty > 0) {
        const newLoyalty = Math.max(0, copy.loyalty - decayThisTick);
        dispatch(updateCopy({ copyId: copy.id, updates: { loyalty: newLoyalty } }));
      }
    }
  }
);

/**
 * Thunk to bolster a copy's loyalty by spending essence.
 * Returns { success: boolean, reason?: string }
 */
export const bolsterCopyLoyaltyThunk = createAsyncThunk(
  'copy/bolsterLoyalty',
  async (copyId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const copy = state.copy.copies[copyId];
    const essence = state.essence.currentEssence;
    
    const essenceCost = COPY_SYSTEM.BOLSTER_LOYALTY_COST;
    const loyaltyGain = COPY_SYSTEM.BOLSTER_LOYALTY_GAIN;

    if (!copy) {
      return rejectWithValue('Copy not found.');
    }
    if (copy.loyalty >= 100) {
      return rejectWithValue('Loyalty already at maximum.');
    }
    if (essence < essenceCost) {
      return rejectWithValue('Not enough essence.');
    }

    dispatch(spendEssence({ amount: essenceCost, source: 'bolster_loyalty' }));
    const newLoyalty = Math.min(100, copy.loyalty + loyaltyGain);
    dispatch(updateCopy({ copyId, updates: { loyalty: newLoyalty } }));

    return { success: true };
  }
);

/**
 * Thunk to attempt creating a Copy from an NPC.
 */
export const createCopyThunk = createAsyncThunk(
  'copy/create',
  async ({ npcId }: CreateCopyPayload, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const player = state.player;
    const npc = state.npcs.npcs[npcId];

    if (!npc) {
      return rejectWithValue('Target NPC not found.');
    }

    // --- Success Check ---
    // Example: Success chance is based on player's Charisma.
    // A Charisma of 20 gives a 55% chance ((20-10)/2 * 10) + 5
    const charismaModifier = Math.floor((player.attributes.charisma - 10) / 2);
    const successChance = (5 + (charismaModifier * 10)) / 100; // Base 5% + 10% per modifier point

    if (Math.random() > successChance) {
      // TODO: Dispatch a failure notification
      console.log(`Seduction failed. Chance was ${successChance * 100}%.`);
      return rejectWithValue('Seduction attempt failed.');
    }

    // --- Create the Copy Object ---
    const newCopy: Copy = {
      id: `copy_${Date.now()}`,
      name: `Copy of ${npc.name}`,
      createdAt: Date.now(),
      parentNPCId: npc.id,
      growthType: 'normal', // Can be changed later via another action
      maturity: 0,
      loyalty: 50, // Start at a neutral loyalty
      stats: { ...defaultCopyStats },
      // Inherit a snapshot of traits the player has equipped
      inheritedTraits: player.traitSlots
        .map(slot => slot.traitId)
        .filter(Boolean) as string[],
      location: npc.location, // Starts at the parent's location
    };

    // --- Dispatch the action to add the new copy ---
    dispatch(addCopy(newCopy));
    
    // TODO: Dispatch a success notification
    console.log(`Seduction successful! Created: ${newCopy.name}`);

    return newCopy;
  }
);