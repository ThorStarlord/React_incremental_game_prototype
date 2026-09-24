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
  markRoutineFamiliarity,
  unequipTrait,
} from '../../Player/state/PlayerSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import type {
  Trait,
  AcquireTraitWithEssencePayload,
} from './TraitsTypes';
import { recordAuthoredRelationshipExperienceThunk } from '../../Relationships/state/RelationshipThunks';
import { evaluateTraitResonanceReadiness } from './TraitResonanceReadiness';
import { classifyTraitEffectAuthority } from './TraitEffectAuthority';

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
    { traitId }: AcquireTraitWithEssencePayload,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      let state = getState() as RootState;
      const trait = state.traits.traits[traitId];

      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }

      const readiness = evaluateTraitResonanceReadiness(state, traitId);
      if (!readiness.ready) {
        const msg = readiness.blockers[0] ?? 'Trait is not ready for Resonance.';
        dispatch(addNotification({ message: msg, type: 'info' }));
        throw new Error(msg);
      }

      // Resonance cost is catalog-owned. Callers may still pass the historical
      // compatibility field, but it is intentionally ignored.
      const actualCost = trait.essenceCost ?? 0;

      // Validate and durably record the authored Resonance beat before committing
      // irreversible currency/permanence reducers. The event thunk is idempotent,
      // so a retried acquisition after an interrupted client turn remains safe.
      if (trait.resonanceExperienceId) {
        const resonanceResult = await dispatch(
          recordAuthoredRelationshipExperienceThunk({
            experienceId: trait.resonanceExperienceId,
          })
        );
        if (recordAuthoredRelationshipExperienceThunk.rejected.match(resonanceResult)) {
          throw new Error(
            String(resonanceResult.payload ?? 'Failed to record authored Resonance event.')
          );
        }
      }

      if (actualCost > 0) {
        dispatch(spendEssence({ amount: actualCost }));
      }

      dispatch(discoverTrait({ traitId }));
      dispatch(addPermanentTrait(traitId));
      dispatch(markRoutineFamiliarity({
        routineId: 'resonance_calibration',
        source: 'trait_resonance',
        learnedAt: Date.now(),
      }));

      // Once permanent, the Trait no longer needs to occupy a temporary attunement slot.
      for (const slot of state.player.traitSlots) {
        if (slot.traitId === traitId) {
          dispatch(unequipTrait({ slotIndex: slot.slotIndex }));
        }
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
      } else if (!Array.isArray(trait.effects)) {
        for (const effectName of Object.keys(trait.effects)) {
          const authority = classifyTraitEffectAuthority(effectName);
          if (authority === 'deferred_legacy') {
            warnings.push(
              `Trait effect "${effectName}" is deferred legacy metadata and has no qualified generic runtime authority.`
            );
          }
        }
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