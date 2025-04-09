/**
 * Redux Thunks for Essence-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';
// Correct the import path for NotificationsSlice
import {
  GENERATOR_TYPES,
  EssenceSource,
  GainEssencePayload,
  PurchaseGeneratorPayload,
  PurchaseUpgradePayload
} from './EssenceTypes';

/**
 * Generate essence over time based on current generators and modifiers
 */
export const generateEssence = createAsyncThunk<
  number,
  void,
  { state: RootState }
>(
  'essence/generate',
  async (_, { dispatch, getState }) => {
    const state = getState();
    // Ensure essence state and its properties exist before destructuring
    const essenceState = state.essence;
    if (!essenceState) {
        console.error("Essence state is undefined");
        return 0; // Or handle appropriately
    }
    const {
        perSecond = 0, // Provide defaults
        multiplier = 1,
        generators = {},
        upgrades = {},
        mechanics = { autoCollectUnlocked: false, resonanceUnlocked: false }
    } = essenceState;

    // Calculate base amount from generators
    let totalAmount = 0;

    // Add amount from each generator
    Object.entries(generators).forEach(([type, generator]) => {
      if (generator.unlocked && generator.owned > 0) {
        const generatorAmount = generator.owned * generator.baseProduction * generator.level;
        totalAmount += generatorAmount;
      }
    });

    // Apply global multiplier
    totalAmount *= multiplier;

    // Apply upgrade effects
    // Check if upgrades and autoGeneration exist before accessing properties
    if (upgrades?.autoGeneration && upgrades.autoGeneration.level > 0) {
      totalAmount *= (1 + (upgrades.autoGeneration.level * upgrades.autoGeneration.effect));
    }

    // Round to avoid floating point issues
    const finalAmount = Math.floor(totalAmount);

    // Dispatch action to add essence
    if (finalAmount > 0) {
      // Use the correct action type string 'essence/gainEssence'
      dispatch({
        type: 'essence/gainEssence',
        payload: {
          amount: finalAmount,
          source: 'auto_generation'
        }
      });
    }

    return finalAmount;
  }
);
