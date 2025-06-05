import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { selectCurrentEssence } from '../../Essence/state/EssenceSelectors';
import { acquireTrait as acquireTraitToGeneralPool } from './TraitsSlice'; // Removed makePermanent import
import { addPermanentTrait as addPermanentTraitToPlayer } from '../../Player/state/PlayerSlice';
import { Trait, TraitEffect, TraitEffectValues } from './TraitsTypes';

// const MAKE_PERMANENT_COST = 150; // This is now obsolete as "Resonate" (acquireTraitWithEssenceThunk) makes traits permanent.

/**
 * Thunk for making a trait permanent (OLD SYSTEM - DEPRECATED / TO BE REMOVED)
 */
/*
export const makeTraitPermanentThunk = createAsyncThunk<
  { success: boolean; message: string; traitId: string },
  string,
  { state: RootState }
>(
  'traits/makePermanentThunk',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const currentEssence = state.essence.currentEssence;
    const trait = state.traits.traits[traitId];
    
    if (!trait) {
      return rejectWithValue("Trait not found.");
    }
    if (state.player.permanentTraits.includes(traitId)) {
      return {
        success: false,
        message: "This trait is already a permanent part of you.",
        traitId
      };
    }
    // if (state.traits.permanentTraits.includes(traitId)) { // This referred to TraitsSlice.permanentTraits
    //     // This condition might be redundant
    // }

    // if (currentEssence < MAKE_PERMANENT_COST) {
    //   return rejectWithValue(`Insufficient essence (${MAKE_PERMANENT_COST} required, have ${currentEssence}).`);
    // }
    
    try {
      // dispatch(spendEssence({
      //   amount: MAKE_PERMANENT_COST,
      //   description: `Made ${trait.name} permanent (Old System)` 
      // }));
      // dispatch(makePermanent(traitId)); // makePermanent was from TraitsSlice
      
      return {
        success: true,
        message: `${trait.name} is now permanent! (Old System)`,
        traitId
      };
    } catch (error) {
      let errorMessage = 'Failed to make trait permanent (Old System)';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);
*/

/**
 * Thunk for acquiring a trait from an NPC via Resonance, making it PERMANENT for the player.
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk<
  { success: boolean; message: string; traitId: string },
  string,
  { state: RootState }
>(
  'traits/acquireTraitWithEssence',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const trait = state.traits.traits[traitId];
    
    if (!trait) {
      return rejectWithValue("Trait not found for Resonance.");
    }

    if (state.player.permanentTraits.includes(traitId)) {
      return {
        success: false,
        message: `You already permanently possess ${trait.name}.`,
        traitId
      };
    }
    
    const currentEssence = selectCurrentEssence(state);
    const essenceCost = trait.essenceCost || 0;

    if (currentEssence < essenceCost) {
      return rejectWithValue(`Insufficient essence to Resonate (${essenceCost} required, have ${currentEssence}).`);
    }
    
    try {
      dispatch(spendEssence({
        amount: essenceCost,
        description: `Resonated permanent trait: ${trait.name}`
      }));
      
      dispatch(acquireTraitToGeneralPool(traitId)); 
      dispatch(addPermanentTraitToPlayer(traitId));
      
      return {
        success: true,
        message: `${trait.name} permanently resonated and added to your abilities!`,
        traitId
      };
    } catch (error) {
      let errorMessage = 'Failed to Resonate trait';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

interface RawTraitJsonData {
  name: string;
  description: string;
  category?: string; 
  type?: string;    
  effects?: TraitEffect[] | TraitEffectValues;
  rarity?: string;
  essenceCost?: number;
  permanenceCost?: number; 
  tier?: number;
  iconPath?: string;
  sourceNpc?: string; 
  requirements?: {
    level?: number;
    relationshipLevel?: number; 
    npcId?: string;
    prerequisiteTraits?: string[]; 
    quest?: string;
    [key: string]: any;
  };
  level?: number;
}

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
        throw new Error(`Failed to fetch traits from /data/traits.json: ${response.status} ${response.statusText}`);
      }
      const rawTraitsData: Record<string, RawTraitJsonData> = await response.json();

      const processedTraits: Record<string, Trait> = {};
      for (const [id, rawData] of Object.entries(rawTraitsData)) {
        const traitData: Trait = {
          id: id,
          name: rawData.name,
          description: rawData.description,
          category: rawData.category || rawData.type || 'General',
          effects: rawData.effects || {},
          rarity: rawData.rarity || 'Common',
          tier: rawData.tier,
          sourceNpc: rawData.sourceNpc,
          essenceCost: rawData.essenceCost,
          iconPath: rawData.iconPath,
          level: rawData.level,
          requirements: rawData.requirements ? {
            level: rawData.requirements.level,
            relationshipLevel: rawData.requirements.relationshipLevel,
            npcId: rawData.requirements.npcId,
            prerequisiteTraits: rawData.requirements.prerequisiteTraits,
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
