import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { selectCurrentEssence } from '../../Essence/state/EssenceSelectors';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { addPermanentTrait } from '../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../Player/state/PlayerThunks';
import { selectTraits, selectAcquiredTraits, selectTraitPresetById } from './TraitsSelectors';
import { acquireTrait, loadTraitPreset } from './TraitsSlice';
import type { Trait, TraitEffect, TraitEffectValues, TraitPreset } from '../../Traits/state/TraitsTypes';

/**
 * Thunk for acquiring a trait from an NPC via Resonance, making it PERMANENT for the player.
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'traits/acquireTraitWithEssence',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentEssence = selectCurrentEssence(state);
      const traits = selectTraits(state);
      const trait = traits[traitId];

      if (!trait) {
        return rejectWithValue('Trait not found');
      }

      const essenceCost = trait.essenceCost || 0;
      
      if (currentEssence < essenceCost) {
        return rejectWithValue('Insufficient Essence');
      }

      // Deduct essence cost with proper payload structure
      if (essenceCost > 0) {
        dispatch(spendEssence({
          amount: essenceCost,
          description: `Resonated with trait: ${trait.name}`
        }));
      }

      // Add to acquired traits in TraitsSlice
      dispatch(acquireTrait(traitId));
      
      // Add to permanent traits in PlayerSlice (Resonance makes it permanent)
      dispatch(addPermanentTrait(traitId));

      return { 
        traitId, 
        essenceCost,
        message: `Successfully resonated with trait: ${trait.name}`,
        success: true
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

/**
 * Thunk for loading a trait preset and applying it to the player.
 */
export const loadTraitPresetThunk = createAsyncThunk<
  { preset: TraitPreset; message: string },
  string,
  { state: RootState }
>(
  'traits/loadTraitPreset',
  async (presetId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const preset = selectTraitPresetById(state, presetId);
    
    if (!preset) {
      return rejectWithValue('Preset not found');
    }
    
    // Validate that all traits in preset are still available (acquired by player)
    const acquiredTraits = selectAcquiredTraits(state);
    const validTraits = preset.traits.filter((traitId: string) => acquiredTraits.includes(traitId));
    
    if (validTraits.length < preset.traits.length) {
      console.warn(`Some traits from preset "${preset.name}" are no longer available`);
    }
    
    // Mark preset as used in TraitsSlice
    dispatch(loadTraitPreset(presetId));
    
    // Note: Preset loading would need to integrate with Player trait slot management
    // This is simplified for now - actual implementation would need to coordinate
    // with PlayerSlice for trait slot management
    
    dispatch(recalculateStatsThunk());

    return {
      preset,
      message: `Preset "${preset.name}" loaded successfully!`
    };
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
