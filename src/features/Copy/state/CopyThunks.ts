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
import type { Copy, CopyGrowthType } from './CopyTypes';

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
  growthType: CopyGrowthType;
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
    // Calculate decay rate based on COPY_SYSTEM.DECAY_RATE_PER_SECOND and deltaTime (in seconds).
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
      const message = 'Copy not found.';
      return rejectWithValue(message);
    }
    if (copy.loyalty >= 100) {
      const message = 'Loyalty already at maximum.';
      return rejectWithValue(message);
    }
    if (essence < essenceCost) {
      const message = 'Not enough essence.';
      return rejectWithValue(message);
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
  async ({ npcId, growthType }: CreateCopyPayload, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const player = state.player;
    const npc = state.npcs.npcs[npcId];
    const essence = state.essence.currentEssence;

    if (!npc) {
      return rejectWithValue('Target NPC not found.');
    }

    // --- Handle Accelerated Growth Cost ---
    if (growthType === 'accelerated') {
      const essenceCost = COPY_SYSTEM.ACCELERATED_GROWTH_COST;
      if (essence < essenceCost) {
        return rejectWithValue('Not enough essence for accelerated growth.');
      }
      dispatch(spendEssence({ amount: essenceCost, source: 'accelerated_copy_growth' }));
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
      growthType: growthType,
      maturity: growthType === 'accelerated' ? 90 : 0, // Accelerated copies start almost mature
      loyalty: 50, // Start at a neutral loyalty
      stats: { ...defaultCopyStats },
      // Inherit a snapshot of traits the player has shared with the NPC
      inheritedTraits: (npc.sharedTraitSlots ?? [])
        .map(slot => slot.traitId)
        .filter((traitId): traitId is string => !!traitId),
      location: npc.location, // Starts at the parent's location
    };

    // --- Dispatch the action to add the new copy ---
    dispatch(addCopy(newCopy));
    
    // TODO: Dispatch a success notification
    console.log(`Seduction successful! Created: ${newCopy.name}`);

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
  // Reuse ACCELERATED_GROWTH_COST for promotion cost
  if (essence < COPY_SYSTEM.ACCELERATED_GROWTH_COST) {
      return rejectWithValue('Not enough essence.');
    }
  dispatch(spendEssence({ amount: COPY_SYSTEM.ACCELERATED_GROWTH_COST, source: 'promote_copy' }));
  // Update the copy directly since there's no promote action in the slice
  dispatch(updateCopy({ copyId, updates: { growthType: 'accelerated' as CopyGrowthType } }));
    return { success: true };
  }
);