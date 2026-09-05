import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  loadTraits,
  discoverTrait,
  setLoading,
  setError,
} from './TraitsSlice';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import {
  addPermanentTrait,
  unequipTrait,
} from '../../Player/state/PlayerSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import { TRAIT_RESONANCE } from '../../../constants/gameConstants';
import type {
  Trait,
  AcquireTraitWithEssencePayload,
} from './TraitsTypes';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
  selectUsesRelationshipConnectionAuthority,
} from '../../Relationships/state/RelationshipSelectors';
import { recordAuthoredRelationshipExperienceThunk } from '../../Relationships/state/RelationshipThunks';

/**
 * Fetch and load trait definitions from data source
 */
export const fetchTraitsThunk = createAsyncThunk(
  'traits/fetchTraits',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await fetch('/data/traits.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch traits: ${response.statusText}`);
      }

      const traitsData = await response.json();
      const normalizedTraits: Record<string, Trait> = {};

      for (const [id, traitData] of Object.entries(traitsData)) {
        normalizedTraits[id] = {
          id,
          ...(traitData as Omit<Trait, 'id'>),
        };
      }

      dispatch(loadTraits(normalizedTraits));
      return normalizedTraits;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load traits';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Acquire a Trait permanently through Resonance.
 *
 * NPC-sourced Traits whose source has cut over to relationship authority use the
 * M4 gate: discovery -> qualified Connection -> assimilation -> Memory evidence
 * -> prerequisites -> Essence. Unmigrated NPC Traits retain the legacy
 * connectionDepth + Essence gate.
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'traits/acquireTraitWithEssence',
  async (
    { traitId, essenceCost }: AcquireTraitWithEssencePayload,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      let state = getState() as RootState;
      const trait = state.traits.traits[traitId];

      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }

      if (!state.traits.discoveredTraits.includes(traitId)) {
        const msg = `Discover ${trait.name} before attempting Resonance.`;
        dispatch(addNotification({ message: msg, type: 'info' }));
        throw new Error('Trait not discovered');
      }

      if (state.player.permanentTraits.includes(traitId)) {
        throw new Error('Trait is already permanently acquired');
      }

      const sourceNpcId = trait.sourceNpc || trait.source;
      if (sourceNpcId) {
        const usesRelationshipAuthority = selectUsesRelationshipConnectionAuthority(
          state,
          sourceNpcId
        );

        if (usesRelationshipAuthority) {
          const profile = selectBondProfileByNpcId(state, sourceNpcId);
          const requiredLevel =
            trait.minimumConnectionLevel ?? TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
          if (profile.connectionLevel < requiredLevel) {
            const msg = `Connection ${requiredLevel} required. Current: ${profile.connectionLevel}.`;
            dispatch(addNotification({ message: msg, type: 'info' }));
            throw new Error('Insufficient qualified Connection for resonance');
          }

          const assimilation = selectTraitAssimilationState(state, sourceNpcId, traitId);
          const assimilationThreshold = trait.assimilationThreshold ?? 100;
          if (assimilation.progress < assimilationThreshold) {
            const msg = `Assimilation incomplete: ${Math.floor(assimilation.progress)}% / ${assimilationThreshold}%.`;
            dispatch(addNotification({ message: msg, type: 'info' }));
            throw new Error('Insufficient Trait assimilation for resonance');
          }

          const minimumCompatibility = trait.minimumCompatibility ?? 0;
          if (assimilation.compatibility < minimumCompatibility) {
            const msg = `Resonance compatibility too low: ${Math.floor(assimilation.compatibility)} / ${minimumCompatibility}.`;
            dispatch(addNotification({ message: msg, type: 'info' }));
            throw new Error('Insufficient Trait compatibility for resonance');
          }

          const memories = selectRelationshipMemoriesByNpcId(state, sourceNpcId);
          for (const requiredTag of trait.requiredMemoryTags ?? []) {
            const hasEvidence = memories.some(memory =>
              memory.resonanceTags.includes(requiredTag)
            );
            if (!hasEvidence) {
              const msg = `Resonance requires a Memory demonstrating: ${requiredTag}.`;
              dispatch(addNotification({ message: msg, type: 'info' }));
              throw new Error(`Missing Memory evidence: ${requiredTag}`);
            }
          }
        } else {
          const npc = state.npcs.npcs[sourceNpcId];
          const requiredDepth = TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
          if (!npc || (npc.connectionDepth ?? 0) < requiredDepth) {
            const msg = `Increase your connection with this NPC (required depth ${requiredDepth}) before resonating.`;
            dispatch(addNotification({ message: msg, type: 'info' }));
            throw new Error('Insufficient connectionDepth for resonance');
          }
        }
      }

      const prerequisiteTraits = Array.isArray(trait.requirements?.prerequisiteTraits)
        ? (trait.requirements?.prerequisiteTraits as string[])
        : [];
      const missingPrerequisite = prerequisiteTraits.find(
        prerequisite => !state.player.permanentTraits.includes(prerequisite)
      );
      if (missingPrerequisite) {
        const msg = `Missing prerequisite Trait: ${missingPrerequisite}.`;
        dispatch(addNotification({ message: msg, type: 'info' }));
        throw new Error(msg);
      }

      state = getState() as RootState;
      const currentEssence = state.essence.currentEssence;
      const actualCost = essenceCost ?? trait.essenceCost ?? 0;
      if (currentEssence < actualCost) {
        const msg = `Insufficient Essence. Required: ${actualCost}, Available: ${currentEssence}`;
        dispatch(addNotification({ message: msg, type: 'warning' }));
        throw new Error(msg);
      }

      if (actualCost > 0) {
        dispatch(spendEssence({ amount: actualCost }));
      }

      dispatch(discoverTrait({ traitId }));
      dispatch(addPermanentTrait(traitId));

      // Once permanent, the Trait no longer needs to occupy a temporary attunement slot.
      for (const slot of state.player.traitSlots) {
        if (slot.traitId === traitId) {
          dispatch(unequipTrait({ slotIndex: slot.slotIndex }));
        }
      }

      if (trait.resonanceExperienceId) {
        await dispatch(
          recordAuthoredRelationshipExperienceThunk({
            experienceId: trait.resonanceExperienceId,
          })
        );
      }

      dispatch(addNotification({ message: `Resonated ${trait.name}`, type: 'success' }));

      return {
        traitId,
        essenceCost: actualCost,
        trait,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to acquire trait';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Discover a trait (make it visible to the player)
 */
export const discoverTraitThunk = createAsyncThunk(
  'traits/discoverTrait',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const trait = state.traits.traits[traitId];

      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }

      if (state.traits.discoveredTraits.includes(traitId)) {
        return { traitId, alreadyDiscovered: true };
      }

      dispatch(discoverTrait({ traitId }));

      return {
        traitId,
        trait,
        alreadyDiscovered: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to discover trait';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Validate trait data structure
 */
export const validateTraitThunk = createAsyncThunk(
  'traits/validateTrait',
  async (traitId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const trait = state.traits.traits[traitId];

      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      if (!trait.name || trait.name.trim() === '') {
        errors.push('Trait name is required');
      }

      if (!trait.description || trait.description.trim() === '') {
        errors.push('Trait description is required');
      }

      if (!trait.category || trait.category.trim() === '') {
        errors.push('Trait category is required');
      }

      if (!trait.rarity || trait.rarity.trim() === '') {
        errors.push('Trait rarity is required');
      }

      if (!trait.effects || (Array.isArray(trait.effects) && trait.effects.length === 0)) {
        warnings.push('Trait has no effects defined');
      }

      if (trait.essenceCost !== undefined && trait.essenceCost < 0) {
        errors.push('Essence cost cannot be negative');
      }

      return {
        traitId,
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate trait';
      return rejectWithValue(errorMessage);
    }
  }
);