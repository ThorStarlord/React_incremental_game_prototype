import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { acquireTrait } from './TraitsSlice';
import { equipTrait, addPermanentTrait } from '../../Player/state/PlayerSlice';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import type { Trait, TraitEffect, TraitEffectValues, TraitPreset } from './TraitsTypes';
import { selectAcquiredTraits, selectTraitPresetById } from './TraitsSelectors';
import { recalculateStatsThunk } from '../../Player/state/PlayerThunks';
import { loadTraitPreset } from './TraitsSlice';
import { PlayerSlice } from '../../Player/state/PlayerSlice';

/**
 * Thunk for acquiring a trait from an NPC via Resonance, making it PERMANENT for the player.
 */
export const acquireTraitWithEssenceThunk = createAsyncThunk(
  'traits/acquireTraitWithEssence',
  async (traitId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      // Use direct state access instead of selectors to avoid circular dependency
      const trait = state.traits.traits[traitId];
      const currentEssence = state.essence.currentEssence;
      
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
    const validTraits = preset.traits.filter(traitId => acquiredTraits.includes(traitId));
    
    if (validTraits.length < preset.traits.length) {
      console.warn(`Some traits from preset "${preset.name}" are no longer available`);
    }
    
    // Mark preset as used in TraitsSlice
    dispatch(loadTraitPreset(presetId));
    
    // Apply preset to player (clear existing equipped and then equip from preset)
    dispatch(PlayerSlice.actions.clearAllEquippedTraits());
    validTraits.forEach(traitId => {
      // Find an available slot for each trait in the preset
      const availableSlot = state.player.traitSlots.find(slot => slot.isUnlocked && !slot.traitId);
      if (availableSlot) {
        dispatch(PlayerSlice.actions.equipTrait({ traitId, slotIndex: availableSlot.index }));
      }
    });
    
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
