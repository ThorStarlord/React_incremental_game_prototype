/**
 * @file CopyThunks.ts
 * @description Thunks for handling asynchronous Copy logic, like creation, growth, and loyalty.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { COPY_SYSTEM } from '../../../constants/gameConstants';
import type { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { PlayerStats } from '../../Player/state/PlayerTypes';
import { addCopy, updateCopy, updateMultipleCopies, promoteCopyToAccelerated, shareTraitToCopy, unshareTraitFromCopy, unlockCopySlotsIfEligible, assignCopyRole, startCopyTask, progressCopyTask, clearCopyActiveTask, setCopySharePreference } from './CopySlice';
import { applyGrowth, applyLoyaltyDecay, computeInheritedTraits } from '../utils/copyUtils';
import type { Copy, CopyGrowthType, CopyTask } from './CopyTypes';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { generateCopyId, generateCopyName } from '../utils/copyUtils';

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
  // After maturity changes, ensure any eligible slots unlock
  for (const b of batched) dispatch(unlockCopySlotsIfEligible({ copyId: b.copyId }));
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
  // After loyalty changes, ensure any eligible slots unlock
  for (const b of batched) dispatch(unlockCopySlotsIfEligible({ copyId: b.copyId }));
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
  dispatch(unlockCopySlotsIfEligible({ copyId }));
  dispatch(addNotification({ type: 'success', message: 'Loyalty bolstered.' }));

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

    // --- Connection depth gating for seduction/create ---
    if ((npc.connectionDepth ?? 0) < COPY_SYSTEM.SEDUCTION_CONNECTION_REQUIREMENT) {
      return rejectWithValue(`Requires connection depth ${COPY_SYSTEM.SEDUCTION_CONNECTION_REQUIREMENT} or higher.`);
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
      return rejectWithValue('Seduction attempt failed.');
    }

    // --- Create the Copy Object ---
    const newCopy: Copy = {
  id: generateCopyId(),
      name: generateCopyName(npc.name),
      createdAt: Date.now(),
      parentNPCId: npc.id,
      growthType: growthType,
      maturity: growthType === 'accelerated' ? 90 : 0, // Accelerated copies start almost mature
      loyalty: 50, // Start at a neutral loyalty
      stats: { ...defaultCopyStats },
      // Inherit a capped snapshot of traits informed by NPC connectionDepth
      inheritedTraits: computeInheritedTraits(npc),
      traitSlots: undefined,
      location: npc.location, // Starts at the parent's location
    };

    // --- Dispatch the action & notify ---
  dispatch(addCopy(newCopy));
    dispatch(unlockCopySlotsIfEligible({ copyId: newCopy.id }));
    dispatch(addNotification({ type: 'success', message: `Created ${newCopy.name}.` }));

    return newCopy;
  }
);

/** Assign a role to a Copy (thin thunk with feedback). */
export const assignCopyRoleThunk = createAsyncThunk(
  'copy/assignRole',
  async ({ copyId, role }: { copyId: string; role: import('./CopyTypes').CopyRole }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    if (!state.copy.copies[copyId]) return rejectWithValue('Copy not found');
    dispatch(assignCopyRole({ copyId, role }));
    dispatch(addNotification({ type: 'success', message: 'Role assigned.' }));
    return { success: true };
  }
);

/** Start an MVP timed task on a Copy. */
export const startCopyTimedTaskThunk = createAsyncThunk(
  'copy/startTimedTask',
  async ({ copyId, durationSeconds, type = 'timed' as const }: { copyId: string; durationSeconds: number; type?: 'timed' }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const copy = state.copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found');
    const task: CopyTask = {
      id: `task_${Date.now()}`,
      type,
      durationSeconds,
      progressSeconds: 0,
      status: 'running',
      startedAt: Date.now(),
    };
    dispatch(startCopyTask({ copyId, task }));
    dispatch(addNotification({ type: 'info', message: 'Task started.' }));
    return { success: true };
  }
);

/** Tick active tasks for all Copies based on deltaTime. */
export const processCopyTasksThunk = createAsyncThunk(
  'copy/processTasks',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const seconds = deltaTime / 1000;
    for (const copy of Object.values(state.copy.copies)) {
      const task = copy.activeTask;
      if (task && task.status === 'running') {
        dispatch(progressCopyTask({ copyId: copy.id, deltaSeconds: seconds }));
        const updated = (getState() as RootState).copy.copies[copy.id].activeTask;
        if (updated && updated.status === 'completed') {
          dispatch(addNotification({ type: 'success', message: `${copy.name} completed a task.` }));
          dispatch(clearCopyActiveTask({ copyId: copy.id }));
        }
      }
    }
  }
);

/** Update a share preference with validation and feedback. */
export const setCopySharePreferenceThunk = createAsyncThunk(
  'copy/setSharePreference',
  async ({ copyId, traitId, enabled }: { copyId: string; traitId: string; enabled: boolean }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const copy = state.copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found');
    dispatch(setCopySharePreference({ copyId, traitId, enabled }));
    dispatch(addNotification({ type: 'info', message: enabled ? 'Share preference enabled.' : 'Share preference disabled.' }));
    return { success: true };
  }
);

/** Try to apply enabled share preferences to the first available slot(s) for a copy. */
export const applySharePreferencesForCopyThunk = createAsyncThunk(
  'copy/applySharePreferencesForCopy',
  async (copyId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const copy = state.copy.copies[copyId];
    if (!copy) return { applied: 0 };
    const prefs = copy.sharePreferences || {};
    const enabledTraitIds = Object.keys(prefs).filter(tid => prefs[tid]);
    if (!enabledTraitIds.length) return { applied: 0 };

    const playerEquipped = state.player.traitSlots.map(s => s.traitId).filter((id): id is string => !!id);
    const permanent = state.player.permanentTraits;
    let applied = 0;

    for (const traitId of enabledTraitIds) {
      const already = new Set([...(copy.inheritedTraits || []), ...((copy.traitSlots || []).map(s => s.traitId).filter(Boolean) as string[])]);
      if (already.has(traitId)) continue;
      if (permanent.includes(traitId)) continue;
      if (!playerEquipped.includes(traitId)) continue;
      const empty = (copy.traitSlots || []).find(s => !s.isLocked && !s.traitId);
      if (!empty) continue;
      // Use the validated thunk to share (will ensure correctness and notify)
      // eslint-disable-next-line no-await-in-loop
      const result = await (dispatch as unknown as import('../../../app/store').AppDispatch)(
        shareTraitWithCopyThunk({ copyId, slotIndex: empty.slotIndex ?? 0, traitId })
      );
      if (shareTraitWithCopyThunk.fulfilled.match(result)) applied += 1;
    }
    if (applied > 0) dispatch(addNotification({ type: 'success', message: `Applied ${applied} share preference(s).` }));
    return { applied };
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
    return { success: true };
  }
);

/** Share a player-equipped, non-permanent trait to a Copy slot. */
export const shareTraitWithCopyThunk = createAsyncThunk<
  { copyId: string; slotIndex: number; traitId: string },
  { copyId: string; slotIndex: number; traitId: string },
  { state: RootState; rejectValue: string }
>(
  'copy/shareTraitWithCopy',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { copyId, slotIndex, traitId } = payload;
    const state = getState();
    const copy = state.copy.copies[copyId];
    const reject = (message: string) => {
      dispatch(addNotification({ type: 'error', message }));
      return rejectWithValue(message);
    };

    if (!copy) return reject('Copy not found');
    const slot = copy.traitSlots?.[slotIndex];
    if (!slot) return reject('Invalid slot');
    if (slot.isLocked) return reject('Slot is locked');
    if (slot.traitId === traitId) return reject('Trait already shared to this slot');

    // Prevent sharing traits the copy already has via another slot or inherited
    const inheritedHas = (copy.inheritedTraits || []).includes(traitId);
    const otherSlotHas = (copy.traitSlots || []).some((s, i) => i !== slotIndex && s.traitId === traitId);
    if (inheritedHas || otherSlotHas) {
      return reject('Trait already present on this Copy');
    }

    const equippedIds = state.player.traitSlots
      .map(s => s.traitId)
      .filter((id): id is string => !!id);
    const isPermanent = state.player.permanentTraits.includes(traitId);
  if (isPermanent) return reject('Permanent traits are not shareable');
  if (!equippedIds.includes(traitId)) return reject('Trait must be equipped to share');

    dispatch(shareTraitToCopy({ copyId, slotIndex, traitId }));
    dispatch(addNotification({ type: 'success', message: 'Trait shared to Copy.' }));
    return payload;
  }
);

/** Unshare a trait from a Copy slot. */
export const unshareTraitFromCopyThunk = createAsyncThunk<
  { copyId: string; slotIndex: number },
  { copyId: string; slotIndex: number },
  { state: RootState; rejectValue: string }
>(
  'copy/unshareTraitFromCopy',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { copyId, slotIndex } = payload;
    const copy = getState().copy.copies[copyId];
    if (!copy) return rejectWithValue('Copy not found');
    dispatch(unshareTraitFromCopy({ copyId, slotIndex }));
    dispatch(addNotification({ type: 'info', message: 'Trait unshared from Copy.' }));
    return payload;
  }
);