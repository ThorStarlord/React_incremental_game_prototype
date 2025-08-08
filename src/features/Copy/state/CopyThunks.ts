/**
 * @file CopyThunks.ts
 * @description Thunks for handling asynchronous Copy logic, like creation, growth, and loyalty.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import type { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { PlayerStats } from '../../Player/state/PlayerTypes';
import { addCopy, updateCopy, updateMultipleCopies, promoteCopyToAccelerated } from './CopySlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { applyGrowth, applyLoyaltyDecay } from '../utils/copyUtils';
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
 * Process maturity growth for all active Copies.
 * - Applies normal or accelerated growth based on each Copy's growthType.
 * - Batches state updates for performance (single reducer call).
 * @param deltaTime Milliseconds since last tick.
 */
export const processCopyGrowthThunk = createAsyncThunk(
  'copy/processGrowth',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const copies = state.copy.copies;
    const baseGrowth = COPY_SYSTEM.GROWTH_RATE_PER_SECOND * (deltaTime / 1000);
    const batched: Array<{ copyId: string; updates: Partial<Copy> }> = [];
    for (const copy of Object.values(copies)) {
      if (copy.maturity < COPY_SYSTEM.MATURITY_MAX) {
        const newMaturity = applyGrowth(copy.maturity, baseGrowth, copy.growthType === 'accelerated');
        if (newMaturity !== copy.maturity) {
          batched.push({ copyId: copy.id, updates: { maturity: newMaturity } });
        }
      }
    }
    if (batched.length) {
      dispatch(updateMultipleCopies(batched));
    }
  }
);

/**
 * Process loyalty decay for all Copies.
 * - Applies a flat decay rate per second.
 * - Batches updates to minimize re-renders.
 * @param deltaTime Milliseconds since last tick.
 */
export const processCopyLoyaltyDecayThunk = createAsyncThunk(
  'copy/processLoyaltyDecay',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const copies = state.copy.copies;
    const decayThisTick = COPY_SYSTEM.DECAY_RATE_PER_SECOND * (deltaTime / 1000);
    const batched: Array<{ copyId: string; updates: Partial<Copy> }> = [];
    for (const copy of Object.values(copies)) {
      if (copy.loyalty > COPY_SYSTEM.LOYALTY_MIN) {
        const newLoyalty = applyLoyaltyDecay(copy.loyalty, decayThisTick);
        if (newLoyalty !== copy.loyalty) {
          batched.push({ copyId: copy.id, updates: { loyalty: newLoyalty } });
        }
      }
    }
    if (batched.length) {
      dispatch(updateMultipleCopies(batched));
    }
  }
);

/**
 * Increase a Copy's loyalty by spending Essence.
 * Validation:
 * - Copy must exist
 * - Loyalty must not already be max
 * - Player must have enough Essence
 * @returns success or rejects with reason string
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
 * Attempt to create a new Copy from an NPC via "Seduction" style interaction.
 * Success chance currently derived from player's Charisma modifier.
 * On success: adds Copy and emits success notification.
 * On failure: emits failure notification.
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
      dispatch(addNotification({
        message: `Copy creation failed (Chance ${(successChance * 100).toFixed(1)}%).`,
        type: 'warning'
      }));
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

    // --- Dispatch the action & notify ---
    dispatch(addCopy(newCopy));
    dispatch(addNotification({
      message: `Copy created: ${newCopy.name}`,
      type: 'success'
    }));

    return newCopy;
  }
);

/**
 * Promote a Copy to accelerated growth by spending Essence.
 * Validation: copy exists, not already accelerated, sufficient Essence.
 */
export const promoteCopyToAcceleratedThunk = createAsyncThunk(
  'copy/promoteAccelerated',
  async (copyId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const copy = state.copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found.');
    if (copy.growthType === 'accelerated') return rejectWithValue('Already accelerated.');
    const essence = state.essence.currentEssence;
    if (essence < COPY_SYSTEM.PROMOTE_ACCELERATED_COST) {
      return rejectWithValue('Not enough essence.');
    }
    dispatch(spendEssence({ amount: COPY_SYSTEM.PROMOTE_ACCELERATED_COST, source: 'promote_copy' }));
    dispatch(promoteCopyToAccelerated({ copyId }));
   dispatch(addNotification({ message: `Copy promoted to accelerated growth: ${copy.name}`, type: 'info' }));
    return { success: true };
  }
);