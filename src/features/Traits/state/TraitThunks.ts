import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { selectCurrentEssence } from '../../Essence/state/EssenceSelectors'; // Import Essence selector
import { makePermanent, acquireTrait } from './TraitsSlice'; // Import acquireTrait
// Import TraitEffectValues as well if needed for RawTraitJsonData
import { Trait, TraitEffect, TraitEffectValues } from './TraitsTypes';

const MAKE_PERMANENT_COST = 150;

/**
 * Thunk for making a trait permanent
 * This operation costs 150 essence and involves multiple state slices:
 * - Checking essence availability from Player slice
 * - Spending essence via Essence slice
 * - Making the trait permanent via Traits slice
 */
export const makeTraitPermanentThunk = createAsyncThunk<
  // Return type on success
  { success: boolean; message: string; traitId: string },
  // Argument type: the ID of the trait to make permanent
  string,
  // ThunkAPI config
  { state: RootState }
>(
  'traits/makePermanentThunk',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    
    // Get the current essence amount from essence slice
    const currentEssence = state.essence.currentEssence;
    
    // Get the trait details and permanent traits list
    const trait = state.traits.traits[traitId];
    const permanentTraits = state.traits.permanentTraits;
    
    // Validation step 1: Check if trait exists
    if (!trait) {
      return rejectWithValue("Trait not found.");
    }
    
    // Validation step 2: Check if trait is already permanent
    if (permanentTraits.includes(traitId)) {
      return {
        success: false,
        message: "This trait is already permanent.",
        traitId
      };
    }
    
    // Validation step 3: Check if player has enough essence
    if (currentEssence < MAKE_PERMANENT_COST) {
      return rejectWithValue(`Insufficient essence (${MAKE_PERMANENT_COST} required, have ${currentEssence}).`);
    }
    
    try {
      // Step 1: Spend essence
      // This call should now be valid with the updated SpendEssencePayload type
      dispatch(spendEssence({
        amount: MAKE_PERMANENT_COST,
        description: `Made ${trait.name} permanent`
      }));
      
      // Step 2: Make the trait permanent
      dispatch(makePermanent(traitId));
      
      // Return success result
      return {
        success: true,
        message: `${trait.name} is now permanent!`,
        traitId
      };
    } catch (error) {
      // Handle potential errors during dispatch
      let errorMessage = 'Failed to make trait permanent';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk for acquiring a trait with Essence cost
 * This operation involves:
 * - Checking essence availability
 * - Spending essence via Essence slice
 * - Acquiring the trait via Traits slice
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk<
  // Return type on success
  { success: boolean; message: string; traitId: string },
  // Argument type: the ID of the trait to acquire
  string,
  // ThunkAPI config
  { state: RootState }
>(
  'traits/acquireTraitWithEssence',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    
    // Get the trait details
    const trait = state.traits.traits[traitId];
    
    // Validation step 1: Check if trait exists
    if (!trait) {
      return rejectWithValue("Trait not found.");
    }

    // Validation step 2: Check if trait is already acquired
    if (state.traits.acquiredTraits.includes(traitId)) {
      return {
        success: false,
        message: "You already possess this trait.",
        traitId
      };
    }
    
    // Get the current essence amount
    const currentEssence = selectCurrentEssence(state);
    const essenceCost = trait.essenceCost || 0; // Default to 0 if not defined

    // Validation step 3: Check if player has enough essence
    if (currentEssence < essenceCost) {
      return rejectWithValue(`Insufficient essence (${essenceCost} required, have ${currentEssence}).`);
    }
    
    try {
      // Step 1: Spend essence
      dispatch(spendEssence({
        amount: essenceCost,
        description: `Acquired trait: ${trait.name}`
      }));
      
      // Step 2: Acquire the trait
      dispatch(acquireTrait(traitId));
      
      // Return success result
      return {
        success: true,
        message: `${trait.name} acquired!`,
        traitId
      };
    } catch (error) {
      let errorMessage = 'Failed to acquire trait';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Interface defining the expected raw structure of a trait object in traits.json
 */
interface RawTraitJsonData {
  name: string;
  description: string;
  category?: string; 
  type?: string;     // Kept for backward compatibility if old JSON data exists
  effects?: TraitEffect[] | TraitEffectValues;
  rarity?: string;
  essenceCost?: number;
  permanenceCost?: number; // Added to match Trait type
  tier?: number;
  iconPath?: string;
  sourceNpc?: string; // Added to match Trait type and new JSON structure
  requirements?: {
    level?: number;
    relationshipLevel?: number; // Changed to number
    npcId?: string;
    prerequisiteTraits?: string[]; // Changed to array
    quest?: string;
    [key: string]: any;
  };
  level?: number;
}

/**
 * Thunk for fetching initial trait data
 * Fetches data from public/data/traits.json
 */
export const fetchTraitsThunk = createAsyncThunk<
  Record<string, Trait>,
  void,
  { rejectValue: string }
>(
  'traits/fetchTraits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/traits.json');
      if (!response.ok) {
        // Add more context to the error message
        throw new Error(`Failed to fetch traits from /data/traits.json: ${response.status} ${response.statusText}`);
      }
      // Use the stricter RawTraitJsonData interface for parsing
      const rawTraitsData: Record<string, RawTraitJsonData> = await response.json();

      const processedTraits: Record<string, Trait> = {};
      for (const [id, rawData] of Object.entries(rawTraitsData)) {
        // Explicitly map fields to ensure type correctness
        const traitData: Trait = {
          id: id,
          name: rawData.name,
          description: rawData.description,
          category: rawData.category || rawData.type || 'General', // Handle potential 'type' field
          effects: rawData.effects || {},
          rarity: rawData.rarity || 'Common',
          tier: rawData.tier,
          sourceNpc: rawData.sourceNpc, // Map sourceNpc
          essenceCost: rawData.essenceCost,
          permanenceCost: rawData.permanenceCost, // Map permanenceCost
          iconPath: rawData.iconPath,
          level: rawData.level,
          requirements: rawData.requirements ? {
            level: rawData.requirements.level,
            relationshipLevel: rawData.requirements.relationshipLevel, // Already number in RawTraitJsonData
            npcId: rawData.requirements.npcId,
            prerequisiteTraits: rawData.requirements.prerequisiteTraits, // Already string[]
            quest: rawData.requirements.quest
          } : undefined
        };
        processedTraits[id] = traitData;
      }

      return processedTraits;
    } catch (error) {
      let message = 'Unknown error fetching traits';
      if (error instanceof Error) {
        message = error.message;
      }
      console.error('Fetch Traits Error:', message);
      return rejectWithValue(message);
    }
  }
);
