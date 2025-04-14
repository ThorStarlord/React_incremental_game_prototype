import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { makePermanent, setTraits } from './TraitsSlice';
import { Trait } from './TraitsTypes';

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
    
    // Get the current essence amount from player
    const currentEssence = state.player.totalEssenceEarned || 0;
    
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
        reason: `Made ${trait.name} permanent`
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
 * Thunk for fetching initial trait data
 * This simulates fetching data from an API or local source
 */
export const fetchTraitsThunk = createAsyncThunk<
  // Return type on success: the fetched traits
  Record<string, Trait>,
  // Argument type: void (no arguments needed)
  void,
  // ThunkAPI config
  { rejectValue: string }
>(
  'traits/fetchTraits',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch trait data from the public JSON file
      const response = await fetch('/data/traits.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch traits: ${response.statusText}`);
      }
      // Assuming the JSON structure is { "copyableTraits": { ... } }
      const jsonData: { copyableTraits: Record<string, Omit<Trait, 'id'>> } = await response.json();

      // Process the data: Extract the nested object and add the ID to each trait
      const processedTraits: Record<string, Trait> = {};
      if (jsonData && jsonData.copyableTraits) {
        for (const [id, traitData] of Object.entries(jsonData.copyableTraits)) {
          processedTraits[id] = {
            ...traitData,
            id: id, // Add the ID property
            // Ensure category is set, potentially mapping from 'type' if needed
            category: traitData.category || (traitData as any).type || 'General',
          };
        }
      } else {
        console.warn("Fetched traits data is not in the expected format { copyableTraits: { ... } }");
        // Return empty object or throw error depending on desired behavior
        // throw new Error("Invalid trait data format");
      }


      // Return the processed data
      return processedTraits;
    } catch (error) {
      let message = 'Unknown error fetching traits';
      if (error instanceof Error) {
        message = error.message;
      }
      console.error('Fetch Traits Error:', message);
      // Reject the thunk with an error message
      return rejectWithValue(message);
    }
  }
);
