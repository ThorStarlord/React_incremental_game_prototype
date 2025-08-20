/**
 * Async thunk operations for the NPCs system
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, InteractionResult, RelationshipChangeEntry } from './NPCTypes';
import { updateEssenceGenerationRateThunk } from '../../Essence';
import { setAffinity, increaseConnectionDepth, addRelationshipChangeEntry, updateNpcConnectionDepth, debugUnlockAllSharedSlots as debugUnlockAllSharedSlotsAction, setNPCSharedTraitInSlot, addDialogueEntry } from './NPCSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';

/**
 * Thunk for initializing NPCs by fetching data from the JSON file.
 */
export const initializeNPCsThunk = createAsyncThunk<
  Record<string, NPC>,
  void,
  { rejectValue: string }
>(
  'npcs/initialize',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/data/npcs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch NPC data');
      }
      const data: Record<string, NPC> = await response.json();
      
      dispatch(updateEssenceGenerationRateThunk());
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk for discovering an NPC
 */
export const discoverNPCThunk = createAsyncThunk(
  'npcs/discoverNPC',
  async (npcId: string) => {
    return npcId;
  }
);

/**
 * REWRITTEN THUNK: Handles relationship updates with "level up" logic for connection depth.
 */
export const updateNPCRelationshipThunk = createAsyncThunk(
  'npcs/updateRelationship',
  async (payload: { npcId: string; change: number; reason: string }, { dispatch, getState }) => {
    const { npcId, change, reason } = payload;
    const state = getState() as RootState;
    const npc = state.npcs.npcs[npcId];

    if (!npc) {
        console.error(`NPC not found for relationship update: ${npcId}`);
        return;
    }

    const oldValue = npc.affinity;
    let newAffinity = oldValue + change;
    let connectionDepthIncrease = 0;

    if (newAffinity >= 100) {
        connectionDepthIncrease = Math.floor(newAffinity / 100);
        newAffinity = newAffinity % 100;

        dispatch(increaseConnectionDepth({ npcId, amount: connectionDepthIncrease }));
    }
    
    dispatch(setAffinity({ npcId, value: newAffinity }));

    const logEntry: RelationshipChangeEntry = {
        id: `${npcId}-${Date.now()}`,
        npcId,
        timestamp: Date.now(),
        oldValue,
        newAffinity,
        reason: connectionDepthIncrease > 0 
            ? `${reason} & Connection Level Up! (+${connectionDepthIncrease})` 
            : reason,
    };
    dispatch(addRelationshipChangeEntry(logEntry));
    
    await dispatch(updateEssenceGenerationRateThunk());
    
    return { ...payload, connectionDepthIncrease };
  }
);

/**
 * Thunk for updating an NPC's connection depth directly (for debug).
 */
export const updateNPCConnectionDepthThunk = createAsyncThunk(
  'npcs/updateConnectionDepth',
  async (payload: { npcId: string; newDepth: number }, { dispatch }) => {
    dispatch(updateNpcConnectionDepth(payload));
    await dispatch(updateEssenceGenerationRateThunk());
    return payload;
  }
);

/**
 * NEW THUNK: Debug action to unlock all of an NPC's shared trait slots.
 */
export const debugUnlockAllSharedSlots = createAsyncThunk(
    'npcs/debugUnlockSlots',
    async (npcId: string, { dispatch }) => {
        dispatch(debugUnlockAllSharedSlotsAction(npcId));
        return { npcId };
    }
);

/**
 * Placeholder thunk for processing NPC interaction
 */
export const processNPCInteractionThunk = createAsyncThunk<
  InteractionResult,
  { npcId: string; interactionType: string; context?: any },
  { state: RootState }
>(
  'npcs/processInteraction',
  async ({ npcId, interactionType, context }, { getState, dispatch }) => {
    const state = getState();
    const npc = state.npcs.npcs[npcId];
    if (!npc) {
      return { success: false, message: `NPC not found: ${npcId}` };
    }

    if (interactionType === 'dialogue') {
      const now = Date.now();
      // Determine relationship change based on simple rules
      let relDelta = 0;
      const choiceId = context?.choiceId as string | undefined;
      const selectedResponse = context?.selectedResponse as string | undefined;
      const playerMessage = context?.playerMessage as string | undefined;

      if (choiceId === 'greeting') {
        if (selectedResponse === 'friendly') relDelta = 2;
        else if (selectedResponse === 'formal') relDelta = 1;
        else if (selectedResponse === 'curious') relDelta = 1;
      } else if (choiceId === 'freetext') {
        // Very simple heuristic: positive words grant small affinity
        const text = (playerMessage || '').toLowerCase();
        if (text.includes('thanks') || text.includes('hello') || text.includes('help')) relDelta = 1;
      }

      // Apply affinity change via existing relationship thunk for consistency
      if (relDelta !== 0) {
        await dispatch(updateNPCRelationshipThunk({ npcId, change: relDelta, reason: 'Dialogue' }));
      }

      // Log entries: player message (if present) and NPC response
      if (playerMessage) {
        dispatch(addDialogueEntry({
          id: `${npcId}-player-${now}`,
          npcId,
          timestamp: now,
          speaker: 'player',
          playerText: playerMessage,
          npcResponse: '',
        }));
      }

      const npcResponse = relDelta > 0 ? 'They seem pleased.' : (relDelta < 0 ? 'They seem offended.' : 'They acknowledge you.');
      dispatch(addDialogueEntry({
        id: `${npcId}-npc-${now + 1}`,
        npcId,
        timestamp: now + 1,
        speaker: 'npc',
        playerText: '',
        npcResponse,
        relationshipChange: relDelta || undefined,
      }));

      return { success: true, relationshipChange: relDelta, message: 'Dialogue processed.' };
    }

    return { success: true, message: `Interaction '${interactionType}' with ${npcId} processed.` };
  }
);

/**
 * Placeholder thunk for sharing trait with NPC
 */
export const shareTraitWithNPCThunk = createAsyncThunk(
  'npcs/shareTrait',
  async (
    payload: { npcId: string; traitId: string; slotIndex: number },
    { getState, dispatch }
  ) => {
    const { npcId, traitId, slotIndex } = payload;
    const state = getState() as RootState;
    const npc = state.npcs.npcs[npcId];
    if (!npc) {
      dispatch(addNotification({ type: 'error', message: `NPC not found: ${npcId}` }));
      return payload;
    }
    const slots = npc.sharedTraitSlots ?? [];
    if (slotIndex < 0 || slotIndex >= slots.length) {
      dispatch(addNotification({ type: 'error', message: 'Invalid slot selected.' }));
      return payload;
    }
    const slot = slots[slotIndex];
    if (!slot.isUnlocked) {
      dispatch(addNotification({ type: 'warning', message: 'That slot is locked.' }));
      return payload;
    }

    // Unshare if empty traitId provided
    if (!traitId) {
  dispatch(setNPCSharedTraitInSlot({ npcId, slotIndex, traitId: null }));
  dispatch(addNotification({ type: 'info', message: `Removed shared trait from ${npc.name}'s slot ${slot.index + 1}.` }));
      return payload;
    }

    // Validate: player must have trait equipped or permanent
    const playerPermanent = new Set(state.player.permanentTraits);
    const equippedTraitIds = new Set(
      state.player.traitSlots
        .filter(s => !!s.traitId)
        .map(s => s.traitId as string)
    );
    const playerHasTrait = playerPermanent.has(traitId) || equippedTraitIds.has(traitId);
    if (!playerHasTrait) {
      dispatch(addNotification({ type: 'warning', message: 'You must have this trait equipped or permanent to share it.' }));
      return payload;
    }

    // Apply: de-duplicate across slots and set into target slot
  dispatch(setNPCSharedTraitInSlot({ npcId, slotIndex, traitId }));
  dispatch(addNotification({ type: 'success', message: `Shared trait to ${npc.name} (slot ${slot.index + 1}).` }));
    return payload;
  }
);