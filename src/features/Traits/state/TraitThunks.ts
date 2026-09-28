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
  addAssimilatedTrait,
  markRoutineFamiliarity,
} from '../../Player/state/PlayerSlice';
import { addNotification } from '../../../shared/state/NotificationSlice';
import type {
  Trait,
  AcquireTraitWithEssencePayload,
} from './TraitsTypes';
import { recordAuthoredRelationshipExperienceThunk } from '../../Relationships/state/RelationshipThunks';
import { evaluateTraitStabilizationReadiness } from './TraitResonanceReadiness';
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
 * Stabilize an assimilated Trait pattern with Essence.
 *
 * Relationship-mediated Traits preserve the existing authored evidence chain:
 * discovery -> qualified Connection -> assimilation -> Memory evidence ->
 * prerequisites -> Essence. Stabilization makes the pattern permanently
 * available; expression remains Player-controlled through Trait slots.
 */
export const stabilizeTraitWithEssenceThunk = createAsyncThunk(
  'traits/stabilizeTraitWithEssence',
  async (
    { traitId }: AcquireTraitWithEssencePayload,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const trait = state.traits.traits[traitId];

      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }

      const readiness = evaluateTraitStabilizationReadiness(state, traitId);
      if (!readiness.ready) {
        const msg = readiness.blockers[0] ?? 'Trait is not ready for Stabilization.';
        dispatch(addNotification({ message: msg, type: 'info' }));
        throw new Error(msg);
      }

      // Stabilization cost is catalogue-owned. The historical compatibility
      // payload field is intentionally ignored.
      const actualCost = trait.essenceCost ?? 0;

      // Preserve the authored final relationship beat before irreversible state
      // mutation. resonanceExperienceId is a compatibility field name; its
      // current meaning is the authored final stabilization beat.
      if (trait.resonanceExperienceId) {
        const stabilizationResult = await dispatch(
          recordAuthoredRelationshipExperienceThunk({
            experienceId: trait.resonanceExperienceId,
          })
        );
        if (recordAuthoredRelationshipExperienceThunk.rejected.match(stabilizationResult)) {
          throw new Error(
            String(stabilizationResult.payload ?? 'Failed to record authored Stabilization event.')
          );
        }
      }

      if (actualCost > 0) {
        dispatch(spendEssence({ amount: actualCost }));
      }

      dispatch(discoverTrait({ traitId }));
      dispatch(addAssimilatedTrait(traitId));
      dispatch(markRoutineFamiliarity({
        routineId: 'resonance_calibration',
        source: 'trait_stabilization',
        learnedAt: Date.now(),
      }));

      // Do NOT unequip/suppress the Trait after stabilization. Permanent
      // assimilation means permanent availability, while expression remains
      // independently controlled by the Player's expression slots.
      dispatch(addNotification({ message: `Stabilized ${trait.name}`, type: 'success' }));

      return {
        traitId,
        essenceCost: actualCost,
        trait,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stabilize trait';
      return rejectWithValue(errorMessage);
    }
  }
);

/** @deprecated Compatibility name for stabilization. */
export const acquireTraitWithEssenceThunk = stabilizeTraitWithEssenceThunk;

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