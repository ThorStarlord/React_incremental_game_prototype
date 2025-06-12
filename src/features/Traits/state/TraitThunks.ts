import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { 
  loadTraits, 
  discoverTrait, 
  acquireTrait, 
  setLoading, 
  setError 
} from './TraitsSlice';
import { 
  spendEssence 
} from '../../Essence/state/EssenceSlice';
import { 
  addPermanentTrait 
} from '../../Player/state/PlayerSlice';
import type { 
  Trait, 
  AcquireTraitWithEssencePayload 
} from './TraitsTypes';

/**
 * Fetch and load trait definitions from data source
 */
export const fetchTraitsThunk = createAsyncThunk(
  'traits/fetchTraits',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      // Fetch traits from public data
      const response = await fetch('/data/traits.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch traits: ${response.statusText}`);
      }
      
      const traitsData = await response.json();
      
      // Validate and normalize trait data
      const normalizedTraits: Record<string, Trait> = {};
      
      for (const [id, traitData] of Object.entries(traitsData)) {
        normalizedTraits[id] = {
          id,
          ...(traitData as Omit<Trait, 'id'>)
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
 * Acquire trait with Essence cost (Resonance mechanic)
 * This action permanently adds the trait to the player
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'traits/acquireTraitWithEssence',
  async (
    { traitId, essenceCost }: AcquireTraitWithEssencePayload,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const currentEssence = state.essence.currentEssence;
      const trait = state.traits.traits[traitId];
      
      // Validate trait exists
      if (!trait) {
        throw new Error(`Trait with ID ${traitId} not found`);
      }
      
      // Validate essence cost
      const actualCost = essenceCost || trait.essenceCost || 0;
      if (currentEssence < actualCost) {
        throw new Error(`Insufficient Essence. Required: ${actualCost}, Available: ${currentEssence}`);
      }
      
      // Check if already permanently acquired
      if (state.player.permanentTraits.includes(traitId)) {
        throw new Error('Trait is already permanently acquired');
      }
      
      // Spend essence
      if (actualCost > 0) {
        dispatch(spendEssence({ amount: actualCost }));
      }
      
      // Add to general acquired traits
      dispatch(acquireTrait({ traitId }));
      
      // Add to player's permanent traits
      dispatch(addPermanentTrait(traitId));
      
      return {
        traitId,
        essenceCost: actualCost,
        trait
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
      
      // Check if already discovered
      if (state.traits.discoveredTraits.includes(traitId)) {
        return { traitId, alreadyDiscovered: true };
      }
      
      dispatch(discoverTrait({ traitId }));
      
      return {
        traitId,
        trait,
        alreadyDiscovered: false
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
      
      // Validate required fields
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
      
      // Validate effects
      if (!trait.effects || (Array.isArray(trait.effects) && trait.effects.length === 0)) {
        warnings.push('Trait has no effects defined');
      }
      
      // Validate essence cost
      if (trait.essenceCost !== undefined && trait.essenceCost < 0) {
        errors.push('Essence cost cannot be negative');
      }
      
      return {
        traitId,
        isValid: errors.length === 0,
        errors,
        warnings
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate trait';
      return rejectWithValue(errorMessage);
    }
  }
);