import { useCallback, useState } from 'react';
import { useGameState, useGameDispatch } from '../../context';

/**
 * Interface for a trait object
 */
interface Trait {
  id: string;
  name: string;
  rarity: string;
  category?: string;
  isActive?: boolean;
  slotId?: string | null;
  [key: string]: any; // Other trait properties
}

/**
 * Interface for a trait slot
 */
interface TraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
}

/**
 * Interface for a saved trait preset
 */
interface TraitPreset {
  id: string;
  name: string;
  traits: string[]; // Array of trait IDs
  description?: string;
  icon?: string;
  created: number; // Timestamp
}

/**
 * Interface for hook return value
 */
interface UseTraitShortcutsReturn {
  quickEquipTrait: (traitId: string) => boolean;
  quickUnequipTrait: (traitId: string) => boolean;
  quickSwapTraits: (traitId1: string, traitId2: string) => boolean;
  clearAllTraits: () => void;
  saveTraitPreset: (name: string, description?: string) => string;
  loadTraitPreset: (presetId: string) => boolean;
  deleteTraitPreset: (presetId: string) => void;
  presets: TraitPreset[];
  findOptimalTraitConfiguration: (categoryPriority?: string[]) => void;
}

/**
 * Hook for managing trait shortcuts and preset configurations
 * 
 * @returns {UseTraitShortcutsReturn} Functions to manage trait loadouts and shortcuts
 */
const useTraitShortcuts = (): UseTraitShortcutsReturn => {
  const { traits = [], traitSlots = [], traitPresets = [] } = useGameState();
  const dispatch = useGameDispatch();
  const [presets, setPresets] = useState<TraitPreset[]>(traitPresets);
  
  /**
   * Quickly equip a trait to the first available slot
   * 
   * @param {string} traitId - ID of the trait to equip
   * @returns {boolean} Whether the trait was equipped successfully
   */
  const quickEquipTrait = useCallback((traitId: string): boolean => {
    const trait = traits.find(t => t.id === traitId);
    if (!trait) return false;
    
    // If trait is already equipped, do nothing
    if (trait.isActive) return false;
    
    // Find first available slot
    const availableSlot = traitSlots.find(slot => 
      slot.isUnlocked && !slot.traitId
    );
    
    if (availableSlot) {
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: {
          traitId,
          slotId: availableSlot.id
        }
      });
      return true;
    }
    
    return false;
  }, [traits, traitSlots, dispatch]);
  
  /**
   * Quickly unequip a trait
   * 
   * @param {string} traitId - ID of the trait to unequip
   * @returns {boolean} Whether the trait was unequipped successfully
   */
  const quickUnequipTrait = useCallback((traitId: string): boolean => {
    const trait = traits.find(t => t.id === traitId);
    if (!trait || !trait.isActive || !trait.slotId) return false;
    
    dispatch({
      type: 'UNEQUIP_TRAIT',
      payload: {
        traitId,
        slotId: trait.slotId
      }
    });
    
    return true;
  }, [traits, dispatch]);
  
  /**
   * Swap positions of two traits, or move one trait to the slot of another
   * 
   * @param {string} traitId1 - First trait ID
   * @param {string} traitId2 - Second trait ID
   * @returns {boolean} Whether the swap was successful
   */
  const quickSwapTraits = useCallback((traitId1: string, traitId2: string): boolean => {
    const trait1 = traits.find(t => t.id === traitId1);
    const trait2 = traits.find(t => t.id === traitId2);
    
    if (!trait1 || !trait2) return false;
    
    // If both traits are equipped, swap their slots
    if (trait1.isActive && trait2.isActive && trait1.slotId && trait2.slotId) {
      dispatch({
        type: 'SWAP_TRAIT_SLOTS',
        payload: {
          firstTraitId: traitId1,
          secondTraitId: traitId2,
          firstSlotId: trait1.slotId,
          secondSlotId: trait2.slotId
        }
      });
      return true;
    }
    
    // If only one trait is equipped, move the other to its slot
    if (trait1.isActive && trait1.slotId && !trait2.isActive) {
      dispatch({
        type: 'UNEQUIP_TRAIT',
        payload: {
          traitId: traitId1,
          slotId: trait1.slotId
        }
      });
      
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: {
          traitId: traitId2,
          slotId: trait1.slotId
        }
      });
      return true;
    }
    
    // If only the second trait is equipped, move the first to its slot
    if (!trait1.isActive && trait2.isActive && trait2.slotId) {
      dispatch({
        type: 'UNEQUIP_TRAIT',
        payload: {
          traitId: traitId2,
          slotId: trait2.slotId
        }
      });
      
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: {
          traitId: traitId1,
          slotId: trait2.slotId
        }
      });
      return true;
    }
    
    return false;
  }, [traits, dispatch]);
  
  /**
   * Unequip all currently equipped traits
   */
  const clearAllTraits = useCallback((): void => {
    dispatch({
      type: 'CLEAR_ALL_TRAITS'
    });
  }, [dispatch]);
  
  /**
   * Save current trait configuration as a preset
   * 
   * @param {string} name - Name for the preset
   * @param {string} [description] - Optional description
   * @returns {string} ID of the created preset
   */
  const saveTraitPreset = useCallback((name: string, description?: string): string => {
    const activeTraits = traits
      .filter(trait => trait.isActive)
      .map(trait => trait.id);
    
    // Create a new preset
    const newPreset: TraitPreset = {
      id: `preset-${Date.now()}`,
      name: name || `Preset ${presets.length + 1}`,
      description: description || '',
      traits: activeTraits,
      created: Date.now()
    };
    
    dispatch({
      type: 'SAVE_TRAIT_PRESET',
      payload: newPreset
    });
    
    setPresets(prevPresets => [...prevPresets, newPreset]);
    
    return newPreset.id;
  }, [traits, presets, dispatch]);
  
  /**
   * Load a saved trait preset
   * 
   * @param {string} presetId - ID of the preset to load
   * @returns {boolean} Whether the preset was loaded successfully
   */
  const loadTraitPreset = useCallback((presetId: string): boolean => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return false;
    
    // First clear all traits
    dispatch({
      type: 'CLEAR_ALL_TRAITS'
    });
    
    // Then equip traits from preset
    const availableSlots = traitSlots.filter(slot => slot.isUnlocked)
      .sort((a, b) => a.index - b.index);
    
    preset.traits.forEach((traitId, index) => {
      if (index < availableSlots.length) {
        dispatch({
          type: 'EQUIP_TRAIT',
          payload: {
            traitId,
            slotId: availableSlots[index].id
          }
        });
      }
    });
    
    return true;
  }, [presets, traitSlots, dispatch]);
  
  /**
   * Delete a saved trait preset
   * 
   * @param {string} presetId - ID of the preset to delete
   */
  const deleteTraitPreset = useCallback((presetId: string): void => {
    dispatch({
      type: 'DELETE_TRAIT_PRESET',
      payload: {
        presetId
      }
    });
    
    setPresets(prevPresets => prevPresets.filter(p => p.id !== presetId));
  }, [dispatch]);
  
  /**
   * Find and apply an optimal trait configuration based on category priority
   * 
   * @param {string[]} [categoryPriority] - Order of trait categories by priority
   */
  const findOptimalTraitConfiguration = useCallback((categoryPriority: string[] = []): void => {
    // First clear all traits
    dispatch({
      type: 'CLEAR_ALL_TRAITS'
    });
    
    const unlockedSlots = traitSlots.filter(slot => slot.isUnlocked);
    if (unlockedSlots.length === 0) return;
    
    let availableTraits = [...traits];
    
    // Sort traits by priority
    if (categoryPriority.length > 0) {
      availableTraits.sort((a, b) => {
        const categoryA = a.category || 'uncategorized';
        const categoryB = b.category || 'uncategorized';
        
        const indexA = categoryPriority.indexOf(categoryA);
        const indexB = categoryPriority.indexOf(categoryB);
        
        // If both categories are in priority list
        if (indexA >= 0 && indexB >= 0) {
          return indexA - indexB;
        }
        
        // If only one category is in priority list
        if (indexA >= 0) return -1;
        if (indexB >= 0) return 1;
        
        // Sort by rarity if categories are equal or not in priority
        const rarityValues: Record<string, number> = {
          legendary: 5,
          epic: 4,
          rare: 3,
          uncommon: 2,
          common: 1
        };
        
        return (rarityValues[b.rarity] || 0) - (rarityValues[a.rarity] || 0);
      });
    }
    
    // Equip traits
    unlockedSlots.forEach((slot, index) => {
      if (index < availableTraits.length) {
        dispatch({
          type: 'EQUIP_TRAIT',
          payload: {
            traitId: availableTraits[index].id,
            slotId: slot.id
          }
        });
      }
    });
  }, [traits, traitSlots, dispatch]);
  
  return {
    quickEquipTrait,
    quickUnequipTrait,
    quickSwapTraits,
    clearAllTraits,
    saveTraitPreset,
    loadTraitPreset,
    deleteTraitPreset,
    presets,
    findOptimalTraitConfiguration
  };
};

export default useTraitShortcuts;
