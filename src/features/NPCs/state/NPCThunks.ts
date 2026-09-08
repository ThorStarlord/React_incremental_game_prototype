/**
 * Async thunk operations for the NPCs system
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, InteractionResult, RelationshipChangeEntry } from './NPCTypes';
import { updateEssenceGenerationRateThunk } from '../../Essence';
import { setAffinity, increaseConnectionDepth, addRelationshipChangeEntry, updateNpcConnectionDepth, debugUnlockAllSharedSlots as debugUnlockAllSharedSlotsAction, setNPCSharedTraitInSlot, addDialogueEntry, markDialogueCompleted, setDialogueNodes, incrementNpcShopItem, markNpcRestock, addAvailableQuestToNPC, setNPCs } from './NPCSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { spendGold, addAvailableAttributePoints, addAvailableSkillPoints } from '../../Player/state/PlayerSlice';
import { TRADING } from '../../../constants/gameConstants';
import { getItemDef } from '../../../shared/data/itemCatalog';
import { addItem } from '../../Inventory/state/InventorySlice';
import { resetRelationships } from '../../Relationships/state/RelationshipSlice';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../../Relationships/state/RelationshipThunks';
import { selectUsesRelationshipConnectionAuthority } from '../../Relationships/state/RelationshipSelectors';
import { learnNpcFact } from '../../Knowledge/state/KnowledgeSlice';
import { selectNpcKnowsFact } from '../../Knowledge/state/KnowledgeSelectors';
import { adjustFactionReputation } from '../../Factions/state/FactionSlice';
import { selectFactionReputation } from '../../Factions/state/FactionSelectors';
import { setWorldStateCondition } from '../../WorldState/state/WorldStateSlice';
import {
  doesWorldStateRequirementPass,
  selectWorldStateRegions,
} from '../../WorldState/state/WorldStateSelectors';
import type { WorldStateMutation } from '../../WorldState/state/WorldStateTypes';

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

      await dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: false }));
      dispatch(updateEssenceGenerationRateThunk());

      let dialogueNodes: Record<string, any> | undefined;
      try {
        const dres = await fetch('/data/dialogues.json');
        if (dres.ok) {
          dialogueNodes = await dres.json();
        }
      } catch {}

      // M24 uses one bounded content extension rather than rewriting the large
      // historical NPC/dialogue fixtures. If the extension is unavailable, older
      // content still initializes normally; the dedicated M24 qualification proves
      // the production bundle itself exists and is merged when present.
      try {
        const m24res = await fetch('/data/m24-world-state-content.json');
        if (m24res.ok) {
          const extension = await m24res.json();
          const extensionDialogues = extension?.dialogues && typeof extension.dialogues === 'object'
            ? extension.dialogues as Record<string, any>
            : {};
          const npcDialogueIds = extension?.npcDialogueIds && typeof extension.npcDialogueIds === 'object'
            ? extension.npcDialogueIds as Record<string, unknown>
            : {};

          for (const [npcId, rawDialogueIds] of Object.entries(npcDialogueIds)) {
            const npc = data[npcId];
            if (!npc || !Array.isArray(rawDialogueIds)) continue;
            const dialogueIds = rawDialogueIds.filter(
              (id): id is string => typeof id === 'string' && id.length > 0
            );
            npc.availableDialogues = Array.from(new Set([
              ...(npc.availableDialogues ?? []),
              ...dialogueIds,
            ]));
          }

          dialogueNodes = {
            ...(dialogueNodes ?? {}),
            ...extensionDialogues,
          };
        }
      } catch {}

      if (dialogueNodes) {
        dispatch(setDialogueNodes(dialogueNodes));
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(message);
    }
  }
);

export const discoverNPCThunk = createAsyncThunk(
  'npcs/discoverNPC',
  async (npcId: string) => npcId
);

/**
 * NEW GAME THUNK: Seeds Willow-only onboarding and the authored M4 relationship config.
 */
export const newGameSeedNPCsThunk = createAsyncThunk(
  'npcs/newGameSeed',
  async (_, { dispatch }) => {
    try {
      const res = await fetch('/data/npcs.json');
      if (!res.ok) throw new Error('Failed to fetch npc data');
      const data: Record<string, NPC> = await res.json();
      const elder = data['npc_elder_willow'];
      if (!elder) throw new Error('Elder Willow NPC definition missing');

      const seeded: Record<string, NPC> = {
        npc_elder_willow: {
          ...elder,
          affinity: 0,
          connectionDepth: 0,
          loyalty: 0,
          isDiscovered: true,
          discoveredAt: Date.now(),
          availableQuests: [],
          completedQuests: [],
          // All authored Willow topics can exist in the NPC definition; the UI and
          // runtime gates reveal/allow them only when their Experience prerequisites hold.
          availableDialogues: elder.availableDialogues || [],
          completedDialogues: [],
        }
      } as Record<string, NPC>;

      dispatch(resetRelationships());
      dispatch(setNPCs(seeded));
      await dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true }));
      await dispatch(updateEssenceGenerationRateThunk());
      return Object.keys(seeded);
    } catch (e) {
      console.error('newGameSeedNPCsThunk failed', e);
      return [] as string[];
    }
  }
);

/**
 * Handles short-horizon NPC Affinity updates.
 * Migrated NPCs never roll Affinity into Connection; legacy NPCs still do.
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

    const usesRelationshipAuthority = selectUsesRelationshipConnectionAuthority(state, npcId);
    const oldValue = npc.affinity;
    let newAffinity = oldValue + change;
    let connectionDepthIncrease = 0;

    if (usesRelationshipAuthority) {
      newAffinity = Math.max(-100, Math.min(100, newAffinity));
    } else if (newAffinity >= 100) {
      connectionDepthIncrease = Math.floor(newAffinity / 100);
      newAffinity = newAffinity % 100;
      dispatch(increaseConnectionDepth({ npcId, amount: connectionDepthIncrease }));
      dispatch(addNotification({
        type: 'success',
        message: `Your bond with ${npc.name} has deepened. (Depth ${(npc.connectionDepth || 0) + connectionDepthIncrease})`,
      }));
    }

    // setAffinity is a legacy 0..100 reducer. Migrated authored Affinity normally
    // projects through updateNpcAffinity; free-text/legacy deltas remain bounded here.
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

export const updateNPCConnectionDepthThunk = createAsyncThunk(
  'npcs/updateConnectionDepth',
  async (payload: { npcId: string; newDepth: number }, { dispatch }) => {
    dispatch(updateNpcConnectionDepth(payload));
    await dispatch(updateEssenceGenerationRateThunk());
    return payload;
  }
);

export const debugUnlockAllSharedSlots = createAsyncThunk(
  'npcs/debugUnlockSlots',
  async (npcId: string, { dispatch }) => {
    dispatch(debugUnlockAllSharedSlotsAction(npcId));
    return { npcId };
  }
);

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
      const nodes = (getState() as RootState).npcs.dialogueNodes || {};
      let relDelta = 0;
      let npcText = '';
      const node = choiceId ? (nodes as any)[choiceId] : undefined;

      if (node) {
        const isNonRepeatable = node.repeatable === false;
        const completedDialogues = Array.isArray(npc.completedDialogues) ? npc.completedDialogues : [];
        if (isNonRepeatable && completedDialogues.includes(node.id)) {
          dispatch(addNotification({
            type: 'info',
            message: 'That decision has already been made.',
          }));
          return { success: false, message: 'Dialogue already completed.' } as InteractionResult;
        }

        const authoredResponses = node.responses && typeof node.responses === 'object'
          ? Object.keys(node.responses)
          : [];
        if (
          isNonRepeatable &&
          authoredResponses.length > 0 &&
          (!selectedResponse || !Object.prototype.hasOwnProperty.call(node.responses, selectedResponse))
        ) {
          return { success: false, message: 'A valid response is required for this one-time decision.' } as InteractionResult;
        }

        if (typeof node.minAffinity === 'number' && (npc.affinity || 0) < node.minAffinity) {
          dispatch(addNotification({ type: 'info', message: 'They are not ready to discuss that yet.' }));
          return { success: false, message: 'Dialogue gate not met.' } as InteractionResult;
        }

        const currentState = getState() as RootState;
        const recordedExperiences = currentState.relationships?.experiencesById ?? {};
        const requiredExperienceIds = Array.isArray(node.requiredExperienceIds)
          ? node.requiredExperienceIds as string[]
          : [];
        const missingRequired = requiredExperienceIds.find(id => !recordedExperiences[id]);
        if (missingRequired) {
          dispatch(addNotification({
            type: 'info',
            message: 'This conversation has not become meaningful yet.',
          }));
          return { success: false, message: `Missing relationship evidence: ${missingRequired}` } as InteractionResult;
        }

        const anyOfExperienceIds = Array.isArray(node.anyOfExperienceIds)
          ? node.anyOfExperienceIds as string[]
          : [];
        if (
          anyOfExperienceIds.length > 0 &&
          !anyOfExperienceIds.some(id => Boolean(recordedExperiences[id]))
        ) {
          dispatch(addNotification({
            type: 'info',
            message: 'This conversation depends on an earlier decision.',
          }));
          return { success: false, message: 'Missing alternative relationship evidence.' } as InteractionResult;
        }

        const requiredRoutineFamiliarityIds = Array.isArray(node.requiredRoutineFamiliarityIds)
          ? node.requiredRoutineFamiliarityIds as string[]
          : [];
        const missingRoutine = requiredRoutineFamiliarityIds.find(
          id => !currentState.player.routineFamiliarity?.[id as keyof typeof currentState.player.routineFamiliarity]
        );
        if (missingRoutine) {
          dispatch(addNotification({
            type: 'info',
            message: 'You have not personally experienced what this report depends on yet.',
          }));
          return { success: false, message: `Missing routine familiarity: ${missingRoutine}` } as InteractionResult;
        }

        const requiredKnowledgeFactIds = Array.isArray(node.requiredKnowledgeFactIds)
          ? node.requiredKnowledgeFactIds as string[]
          : [];
        const missingKnowledge = requiredKnowledgeFactIds.find(
          factId => !selectNpcKnowsFact(currentState, npcId, factId)
        );
        if (missingKnowledge) {
          dispatch(addNotification({
            type: 'info',
            message: 'They do not know what this conversation depends on yet.',
          }));
          return { success: false, message: `Missing NPC knowledge: ${missingKnowledge}` } as InteractionResult;
        }

        const forbiddenKnowledgeFactIds = Array.isArray(node.forbiddenKnowledgeFactIds)
          ? node.forbiddenKnowledgeFactIds as string[]
          : [];
        const alreadyKnown = forbiddenKnowledgeFactIds.find(
          factId => selectNpcKnowsFact(currentState, npcId, factId)
        );
        if (alreadyKnown) {
          dispatch(addNotification({
            type: 'info',
            message: 'They already know that fact.',
          }));
          return { success: false, message: `NPC already knows fact: ${alreadyKnown}` } as InteractionResult;
        }

        const requiredFactionReputation = Array.isArray(node.requiredFactionReputation)
          ? node.requiredFactionReputation as Array<{ factionId: string; min?: number; max?: number }>
          : [];
        const unmetFactionRequirement = requiredFactionReputation.find(requirement => {
          if (!requirement?.factionId) return true;
          const reputation = selectFactionReputation(currentState, requirement.factionId);
          if (typeof requirement.min === 'number' && reputation < requirement.min) return true;
          if (typeof requirement.max === 'number' && reputation > requirement.max) return true;
          return false;
        });
        if (unmetFactionRequirement) {
          dispatch(addNotification({
            type: 'info',
            message: 'The institution is not prepared to offer that yet.',
          }));
          return {
            success: false,
            message: `Faction reputation gate not met: ${unmetFactionRequirement.factionId}`,
          } as InteractionResult;
        }

        const requiredWorldState = Array.isArray(node.requiredWorldState)
          ? node.requiredWorldState
          : [];
        const worldStateRegions = selectWorldStateRegions(currentState);
        const unmetWorldStateRequirement = requiredWorldState.find(
          requirement => !doesWorldStateRequirementPass(worldStateRegions, requirement)
        );
        if (unmetWorldStateRequirement) {
          const regionId = typeof unmetWorldStateRequirement?.regionId === 'string'
            ? unmetWorldStateRequirement.regionId
            : 'unknown-region';
          const field = typeof unmetWorldStateRequirement?.field === 'string'
            ? unmetWorldStateRequirement.field
            : 'unknown-field';
          dispatch(addNotification({
            type: 'info',
            message: 'The objective conditions in the world do not support that yet.',
          }));
          return {
            success: false,
            message: `World state gate not met: ${regionId}.${field}`,
          } as InteractionResult;
        }

        npcText = node.text || node.title || '';
        const effects = Array.isArray(node.effects) ? node.effects : [];
        for (const eff of effects) {
          // A response-scoped effect must only fire for that actual response.
          if (eff.responseId && eff.responseId !== selectedResponse) continue;

          if (eff.type === 'AFFINITY_DELTA') {
            relDelta += Number(eff.value) || 0;
          } else if (eff.type === 'UNLOCK_QUEST') {
            if (eff.questId) {
              dispatch(addAvailableQuestToNPC({ npcId: npc.id, questId: eff.questId }));
              dispatch(addNotification({ type: 'success', message: `Quest available: ${eff.questId}` }));
            }
          } else if (eff.type === 'GIVE_ITEM') {
            const qty = eff.amount || 1;
            dispatch(addItem({ itemId: eff.itemId, quantity: qty }));
          } else if (eff.type === 'OPEN_SERVICE') {
            dispatch(addNotification({ type: 'info', message: 'A service is now available.' }));
          } else if (eff.type === 'KNOWLEDGE_FACT') {
            if (eff.factId) {
              dispatch(learnNpcFact({ npcId: npc.id, factId: eff.factId }));
            }
          } else if (eff.type === 'FACTION_REPUTATION') {
            if (eff.factionId) {
              dispatch(adjustFactionReputation({
                factionId: eff.factionId,
                amount: Number(eff.value) || 0,
              }));
            }
          } else if (eff.type === 'WORLD_STATE_SET') {
            dispatch(setWorldStateCondition({
              regionId: eff.regionId,
              field: eff.field,
              value: eff.value,
            } as WorldStateMutation));
          } else if (eff.type === 'RELATIONSHIP_EXPERIENCE') {
            const experienceId = eff.experienceId || (
              selectedResponse ? eff.experienceIdByResponse?.[selectedResponse] : undefined
            );
            if (experienceId) {
              await dispatch(recordAuthoredRelationshipExperienceThunk({
                experienceId,
                timestamp: now,
              }));
            }
          }
        }

        const nextId = selectedResponse && node.next ? node.next[selectedResponse] : undefined;
        if (nextId) {
          const nextNode = (nodes as any)[nextId];
          if (nextNode && nextNode.text) {
            npcText = nextNode.text;
          }

          // The existing lightweight dialogue runtime displays the next node inline.
          // Relationship-only continuation effects therefore record the evidence that
          // was actually displayed; resource/quest effects still require an explicit click.
          const nextEffects = Array.isArray(nextNode?.effects) ? nextNode.effects : [];
          for (const eff of nextEffects) {
            if (eff.type !== 'RELATIONSHIP_EXPERIENCE') continue;
            if (eff.responseId && eff.responseId !== selectedResponse) continue;
            const experienceId = eff.experienceId || (
              selectedResponse ? eff.experienceIdByResponse?.[selectedResponse] : undefined
            );
            if (experienceId) {
              await dispatch(recordAuthoredRelationshipExperienceThunk({
                experienceId,
                timestamp: now + 1,
              }));
            }
          }
        }

        if (isNonRepeatable) {
          dispatch(markDialogueCompleted({ npcId, dialogueId: node.id }));
        }
      } else if (playerMessage) {
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

export const processNpcShopRestockThunk = createAsyncThunk(
  'npcs/processShopRestock',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const now = Date.now();
    const npcs = Object.values(state.npcs.npcs);
    for (const npc of npcs) {
      if (!npc || !npc.shopStock) continue;
      const last = npc.lastRestockAt || 0;
      if (now - last < TRADING.REFRESH_INTERVAL_MS) continue;

      const itemIds = Object.keys(npc.shopStock);
      if (itemIds.length > 0) {
        const picks = [...itemIds].sort(() => Math.random() - 0.5).slice(0, TRADING.MAX_ITEMS_PER_REFRESH);
        for (const id of picks) {
          const def = getItemDef(id);
          if (!def) continue;
          dispatch(incrementNpcShopItem({ npcId: npc.id, itemId: id, quantity: 1 }));
        }
      }

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

    if (!traitId) {
      dispatch(setNPCSharedTraitInSlot({ npcId, slotIndex, traitId: null }));
      dispatch(addNotification({ type: 'info', message: `Removed shared trait from ${npc.name}'s slot ${slot.index + 1}.` }));
      return payload;
    }

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

    dispatch(setNPCSharedTraitInSlot({ npcId, slotIndex, traitId }));
    dispatch(addNotification({ type: 'success', message: `Shared trait to ${npc.name} (slot ${slot.index + 1}).` }));
    return payload;
  }
);

export const purchaseNPCServiceThunk = createAsyncThunk(
  'npcs/purchaseService',
  async (
    payload: { npcId: string; serviceId: string; priceOverride?: number },
    { getState, dispatch }
  ) => {
    const { npcId, serviceId } = payload;
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

    if (typeof service.minAffinity === 'number' && (npc.affinity || 0) < service.minAffinity) {
      dispatch(addNotification({ type: 'warning', message: `Requires affinity ${service.minAffinity} to use ${service.name}.` }));
      return payload;
    }

    const isRoutingService = /merchant_/i.test(serviceId) || /quest_giver_/i.test(serviceId) || /radiant_quest_provider/i.test(serviceId);
    if (isRoutingService && (service.basePrice || 0) === 0) {
      dispatch(addNotification({ type: 'info', message: `${service.name}: check the relevant tab to proceed.` }));
      return payload;
    }

    const base = typeof service.currentPrice === 'number' ? service.currentPrice : (service.basePrice || 0);
    const discountPct = Math.min(Math.floor((npc.affinity || 0) / 5), 20);
    let price = Math.max(0, Math.floor(base * (1 - discountPct / 100)));
    if (price <= 0) price = 0;

    if (price > state.player.gold) {
      dispatch(addNotification({ type: 'warning', message: 'Not enough gold.' }));
      return payload;
    }
    if (price > 0) dispatch(spendGold(price));

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