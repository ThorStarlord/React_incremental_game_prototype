/**
 * Async thunk operations for the NPCs system
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, InteractionResult, RelationshipChangeEntry } from './NPCTypes';
import { updateEssenceGenerationRateThunk } from '../../Essence';
import { setAffinity, increaseConnectionDepth, addRelationshipChangeEntry, updateNpcConnectionDepth, debugUnlockAllSharedSlots as debugUnlockAllSharedSlotsAction, setNPCSharedTraitInSlot, addDialogueEntry, setDialogueNodes, incrementNpcShopItem, markNpcRestock } from './NPCSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { spendGold, addAvailableAttributePoints, addAvailableSkillPoints } from '../../Player/state/PlayerSlice';
import { TRADING } from '../../../constants/gameConstants';
import { getItemDef } from '../../../shared/data/itemCatalog';
import { addItem } from '../../Inventory/state/InventorySlice';

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
      // Load dialogue nodes (best-effort)
      try {
        const dres = await fetch('/data/dialogues.json');
        if (dres.ok) {
          const nodes = await dres.json();
          dispatch(setDialogueNodes(nodes));
        }
      } catch {}
      
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
      const choiceId = context?.choiceId as string | undefined;
      const selectedResponse = context?.selectedResponse as string | undefined;
      const playerMessage = context?.playerMessage as string | undefined;

      // Data-driven node support
      const nodes = (getState() as RootState).npcs.dialogueNodes || {};
      let relDelta = 0;
      let npcText = '';
      const node = choiceId ? (nodes as any)[choiceId] : undefined;

      if (node) {
        // Gate checks
        if (typeof node.minAffinity === 'number' && (npc.affinity || 0) < node.minAffinity) {
          dispatch(addNotification({ type: 'info', message: 'They are not ready to discuss that yet.' }));
          return { success: false, message: 'Dialogue gate not met.' } as InteractionResult;
        }
        npcText = node.text || node.title || '';
        const effects = Array.isArray(node.effects) ? node.effects : [];
        for (const eff of effects) {
          if (eff.type === 'AFFINITY_DELTA') {
            relDelta += Number(eff.value) || 0;
          } else if (eff.type === 'UNLOCK_QUEST') {
            // Minimal: surface as notification; actual quest unlocking handled elsewhere
            dispatch(addNotification({ type: 'info', message: `Quest unlocked: ${eff.questId}` }));
          } else if (eff.type === 'GIVE_ITEM') {
            const qty = eff.amount || 1;
            dispatch(addItem({ itemId: eff.itemId, quantity: qty }));
          } else if (eff.type === 'OPEN_SERVICE') {
            // Inform user to check Services tab
            dispatch(addNotification({ type: 'info', message: 'A service is now available.' }));
          }
        }

        // Determine next node
        const nextId = selectedResponse && node.next ? node.next[selectedResponse] : undefined;
        if (nextId) {
          // Fire-and-forget next node text as an additional response line for feedback
          const nextNode = (nodes as any)[nextId];
          if (nextNode && nextNode.text) {
            npcText = nextNode.text;
          }
        }
      } else if (playerMessage) {
        // Fallback heuristic for free text
        const text = (playerMessage || '').toLowerCase();
        if (text.includes('thanks') || text.includes('hello') || text.includes('help')) relDelta = 1;
        npcText = relDelta > 0 ? 'They seem pleased.' : 'They acknowledge you.';
      } else {
        npcText = 'They acknowledge you.';
      }

      if (relDelta !== 0) {
        await dispatch(updateNPCRelationshipThunk({ npcId, change: relDelta, reason: 'Dialogue' }));
      }

      if (playerMessage) {
        dispatch(addDialogueEntry({ id: `${npcId}-player-${now}`, npcId, timestamp: now, speaker: 'player', playerText: playerMessage, npcResponse: '' }));
      }
      dispatch(addDialogueEntry({ id: `${npcId}-npc-${now + 1}`, npcId, timestamp: now + 1, speaker: 'npc', playerText: '', npcResponse: npcText, relationshipChange: relDelta || undefined }));

      return { success: true, relationshipChange: relDelta, message: 'Dialogue processed.' };
    }

    return { success: true, message: `Interaction '${interactionType}' with ${npcId} processed.` };
  }
);

/**
 * Thunk: Shop restock processing. Call periodically (e.g., from game loop tick handler) to refresh NPC stocks.
 */
export const processNpcShopRestockThunk = createAsyncThunk(
  'npcs/processShopRestock',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const now = Date.now();
    const npcs = Object.values(state.npcs.npcs);
    for (const npc of npcs) {
      if (!npc) continue;
      if (!npc.shopStock) continue;
      const last = npc.lastRestockAt || 0;
      if (now - last < TRADING.REFRESH_INTERVAL_MS) continue;

      // Try to increment a few random items that this NPC already deals with
      const itemIds = Object.keys(npc.shopStock);
      if (itemIds.length > 0) {
        const picks = [...itemIds].sort(() => Math.random() - 0.5).slice(0, TRADING.MAX_ITEMS_PER_REFRESH);
        for (const id of picks) {
          const def = getItemDef(id);
          if (!def) continue;
          dispatch(incrementNpcShopItem({ npcId: npc.id, itemId: id, quantity: 1 }));
        }
      }

      // Affinity-gated: introduce new items from NPC inventory list
      const aff = npc.affinity || 0;
      if (aff >= TRADING.AFFINITY_TO_UNLOCK_NEW_ITEMS) {
        const invList = Array.isArray(npc.inventory?.items) ? (npc.inventory!.items as any[]) : [];
        const missing = invList.filter((id: string) => !(npc.shopStock as Record<string, number>)[String(id)]);
        if (missing.length > 0) {
          const pick = String(missing[Math.floor(Math.random() * missing.length)]);
          if (getItemDef(pick)) {
            dispatch(incrementNpcShopItem({ npcId: npc.id, itemId: pick, quantity: 1 }));
          }
        }
      }

      dispatch(markNpcRestock({ npcId: npc.id, at: now }));
    }
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

/**
 * Thunk: Purchase an NPC service
 * - Validates NPC and service existence
 * - Calculates price (uses priceOverride from UI, otherwise currentPrice/basePrice with relationship discount)
 * - Ensures sufficient player gold, deducts on success
 * - Applies a minimal side-effect based on service kind (trainer/info/teacher)
 * - Emits user notifications
 */
export const purchaseNPCServiceThunk = createAsyncThunk(
  'npcs/purchaseService',
  async (
    payload: { npcId: string; serviceId: string; priceOverride?: number },
    { getState, dispatch }
  ) => {
    const { npcId, serviceId, priceOverride } = payload;
    const state = getState() as RootState;
    const npc = state.npcs.npcs[npcId];
    if (!npc) {
      dispatch(addNotification({ type: 'error', message: `NPC not found: ${npcId}` }));
      return payload;
    }

    const service = (npc.services || []).find(s => s.id === serviceId && s.isAvailable !== false);
    if (!service) {
      dispatch(addNotification({ type: 'warning', message: 'Service is not available.' }));
      return payload;
    }

    // Gating by minimum affinity if specified
    if (typeof service.minAffinity === 'number' && (npc.affinity || 0) < service.minAffinity) {
      dispatch(addNotification({ type: 'warning', message: `Requires affinity ${service.minAffinity} to use ${service.name}.` }));
      return payload;
    }

    // Special zero-cost routing services (e.g., merchant links) just inform the user
    const isRoutingService = /merchant_/i.test(serviceId) || /quest_giver_/i.test(serviceId) || /radiant_quest_provider/i.test(serviceId);
    if (isRoutingService && (service.basePrice || 0) === 0) {
      dispatch(addNotification({ type: 'info', message: `${service.name}: check the relevant tab to proceed.` }));
      return payload;
    }

    // Calculate final price with affinity-based discount
    const base = typeof service.currentPrice === 'number' ? service.currentPrice : (service.basePrice || 0);
    const discountPct = Math.min(Math.floor((npc.affinity || 0) / 5), 20);
    let price = Math.max(0, Math.floor(base * (1 - discountPct / 100)));

    if (price <= 0) {
      // Free service
      price = 0;
    }

    const playerGold = state.player.gold;
    if (price > playerGold) {
      dispatch(addNotification({ type: 'warning', message: 'Not enough gold.' }));
      return payload;
    }

    if (price > 0) {
      dispatch(spendGold(price));
    }

    // Minimal service-specific side effects
    if (/combat_trainer|trainer_/i.test(serviceId)) {
      dispatch(addAvailableAttributePoints(1));
      dispatch(addNotification({ type: 'success', message: `${service.name} completed: +1 Attribute Point.` }));
    } else if (/information_broker|lore_provider/i.test(serviceId)) {
      dispatch(addNotification({ type: 'success', message: `${service.name}: You gained useful information.` }));
    } else if (/trait_teacher/i.test(serviceId)) {
      dispatch(addAvailableSkillPoints(1));
      dispatch(addNotification({ type: 'success', message: `${service.name} completed: +1 Skill Point.` }));
    } else if (/crafter_/i.test(serviceId)) {
      dispatch(addNotification({ type: 'success', message: `${service.name} commissioned. It will be ready soon.` }));
    } else {
      dispatch(addNotification({ type: 'success', message: `Purchased: ${service.name}.` }));
    }

    return { npcId, serviceId, price };
  }
);