import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Alert, Snackbar } from '@mui/material';
import TraitList from './TraitList';
import TraitSlots from './TraitSlots';
import TraitSlotsFallback from './TraitSlotsFallback';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';

// Import from Redux store
import { RootState } from '../../../../app/store';

// Import from local types - using our new types file
import { 
  ExtendedTrait, 
  TraitId, 
  TRAIT_CATEGORIES,
  TraitEffect,
  createTraitId,
  TRAIT_SOURCES,
  TRAIT_RARITIES
} from '../../types/TraitTypes';

// Import trait data
import { traits, TraitsCollection as ImportedTraitsCollection } from '../../data/traits';

// Define our own SlotTrait interface that matches the needs of TraitSlots component
interface SlotTrait {
  id: string;
  name: string;
  description: string;
  level: number;
  category: typeof TRAIT_CATEGORIES[keyof typeof TRAIT_CATEGORIES]; // Use correct enum type
  icon: string;
  effect: string;
  source: typeof TRAIT_SOURCES[keyof typeof TRAIT_SOURCES]; // Use the actual enum type
  rarity: typeof TRAIT_RARITIES[keyof typeof TRAIT_RARITIES]; // Use the actual enum type
  isRemovable: boolean;
  cost?: number;
  effects: TraitEffect[]; // Changed to only accept array type, not union type
}

// Define our own TraitSlotsProps interface
interface TraitSlotsProps {
  availableTraits: SlotTrait[];
  equippedTraits: SlotTrait[];
  maxSlots: number;
  onAssignTrait: (slotId: string, traitId: string) => void;  // Changed slotIndex: number to slotId: string
  onRemoveTrait: (traitId: string) => void;
  playerLevel: number;
  activeSlots: Record<number, string>;
}

/**
 * Interface for TraitList props
 */
interface TraitListProps {
  traits: {
    id: string;
    name: string;
    level: number;
    description: string;
    effect: string;
    cost: number;
  }[];
  onTraitLevelUp: (traitId: string) => void;
  pointsAvailable: number;
}

/**
 * Interface for a Trait object that matches our component needs
 * Renamed to InternalTrait to avoid conflicts
 */
interface InternalTrait {
  id: string;
  name: string;
  description: string;
  level: number;
  effect?: string;
  cost?: number;
  icon?: string;
  category?: string;
  effects?: TraitEffect[] | Record<string, number>;
}

/**
 * TraitSystemWrapper Component
 * 
 * Manages the trait system UI, handling fallbacks for missing dependencies
 * and coordinating between trait list and trait slots components.
 * 
 * @returns {JSX.Element} The rendered component
 */
const TraitSystemWrapper: React.FC = () => {
  const [dndKitError, setDndKitError] = useState<boolean>(false);

  // Replace context with Redux
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const playerLevel = useSelector((state: RootState) => state.player.level || 1);
  const acquiredTraits = useSelector((state: RootState) => state.traits.acquiredTraits || []);
  const equippedTraits = useSelector((state: RootState) => state.traits.equippedTraits || []);
  const traitSlots = useSelector((state: RootState) => state.player.traitSlots || 1);
  const allTraits = useSelector((state: RootState) => state.traits.traits || {});
  const essence = useSelector((state: RootState) => state.essence?.amount || 0);
  const traitPoints = useSelector((state: RootState) => state.traits.traitPoints || 0);

  useEffect(() => {
    // Check if @dnd-kit is available
    const checkDependencies = async (): Promise<void> => {
      try {
        await import('@dnd-kit/core');
        await import('@dnd-kit/sortable');
        await import('@dnd-kit/utilities');
      } catch (error) {
        console.error('DnD-Kit dependency error:', error);
        setDndKitError(true);
      }
    };

    checkDependencies();
  }, []);

  /**
   * Handles equipping a trait if trait slots are available
   * @param {string} traitId - ID of the trait to equip
   */
  const handleEquipTrait = (traitId: string): void => {
    dispatch({
      type: 'traits/equipTrait',
      payload: { traitId }
    });
  };

  /**
   * Handles unequipping a trait
   * @param {string} traitId - ID of the trait to unequip
   */
  const handleUnequipTrait = (traitId: string): void => {
    dispatch({
      type: 'traits/unequipTrait',
      payload: { traitId }
    });
  };

  /**
   * Handles upgrading trait slots if player has enough essence
   * @param {number} cost - Cost in essence to upgrade
   */
  const handleUpgradeSlot = (cost: number): void => {
    if (essence >= cost) {
      dispatch({ type: 'essence/spendEssence', payload: cost });
      dispatch({ type: 'traits/unlockTraitSlot', payload: { slotIndex: traitSlots } });
    }
  };

  /**
   * Gets an array of equipped trait objects with their data
   * @returns {InternalTrait[]} Array of equipped traits with complete data
   */
  const getEquippedTraits = (): InternalTrait[] => {
    return equippedTraits
      .filter(id => id !== '') // Filter out empty slot placeholders
      .map(id => {
        const traitData = allTraits[id] || {};
        
        // Create a new object with our expected structure
        const trait: InternalTrait = {
          id,
          name: traitData.name || 'Unknown Trait',
          description: traitData.description || 'No description available',
          level: 1,
          category: traitData.category || TRAIT_CATEGORIES.SPECIAL,
          effect: '',
          cost: 0,
          icon: ''
        };
        
        // Add effects as a formatted string if available
        if (traitData.effects) {
          trait.effect = Array.isArray(traitData.effects)
            ? traitData.effects.map(e => `${e.type}: ${e.magnitude}`).join(', ')
            : Object.entries(traitData.effects)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
          
          // Store original effects for reference
          trait.effects = traitData.effects;
        }
        
        return trait;
      });
  };

  /**
   * Gets an array of all acquired trait objects with their data
   * @returns {InternalTrait[]} Array of acquired traits with complete data
   */
  const getAvailableTraits = (): InternalTrait[] => {
    return acquiredTraits.map(id => {
      const traitData = allTraits[id] || {};
      
      // Create a new object with our expected structure
      const trait: InternalTrait = {
        id,
        name: traitData.name || 'Unknown Trait',
        description: traitData.description || 'No description available',
        level: 1,
        category: traitData.category || TRAIT_CATEGORIES.SPECIAL,
        effect: '',
        cost: 0,
        icon: ''
      };
      
      // Add effects as a formatted string if available
      if (traitData.effects) {
        trait.effect = Array.isArray(traitData.effects)
          ? traitData.effects.map(e => `${e.type}: ${e.magnitude}`).join(', ')
          : Object.entries(traitData.effects)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
        
        // Store original effects for reference
        trait.effects = traitData.effects;
      }
      
      return trait;
    });
  };

  // Create the necessary props for TraitList
  const traitListProps: TraitListProps = {
    traits: getAvailableTraits().map(trait => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1,
      description: trait.description,
      effect: trait.effect || '',
      cost: trait.cost || 0
    })),
    onTraitLevelUp: (traitId: string) => {
      dispatch({ 
        type: 'traits/upgradeTrait', 
        payload: { traitId, newTier: 2 } 
      });
    },
    pointsAvailable: traitPoints
  };

  // Convert internal traits to the format expected by TraitSlots
  const convertToSlotTrait = (internalTrait: InternalTrait): SlotTrait => {
    // Handle category to ensure it's always a valid enum value
    const category = internalTrait.category && 
      Object.values(TRAIT_CATEGORIES).includes(internalTrait.category as any) 
      ? internalTrait.category as typeof TRAIT_CATEGORIES[keyof typeof TRAIT_CATEGORIES]
      : TRAIT_CATEGORIES.SPECIAL;
      
    // Convert Record<string, number> effects to TraitEffect[] if needed
    let effectsArray: TraitEffect[] = [];
    if (internalTrait.effects) {
      if (Array.isArray(internalTrait.effects)) {
        // Already in the right format
        effectsArray = internalTrait.effects;
      } else {
        // Convert record to array of TraitEffect objects
        effectsArray = Object.entries(internalTrait.effects).map(([type, magnitude]) => ({
          type,
          magnitude
        }));
      }
    }
      
    return {
      id: internalTrait.id,
      name: internalTrait.name,
      description: internalTrait.description,
      level: internalTrait.level || 1,
      category: category,
      icon: internalTrait.icon || '',
      effect: internalTrait.effect || '',
      source: TRAIT_SOURCES.CUSTOM,
      rarity: TRAIT_RARITIES.COMMON,
      isRemovable: true,
      cost: internalTrait.cost || 0,
      effects: effectsArray // Use the properly formatted array
    };
  };
  
  // Create the necessary props for TraitSlots
  const traitSlotsProps: TraitSlotsProps = {
    availableTraits: getAvailableTraits().map(convertToSlotTrait),
    equippedTraits: getEquippedTraits().map(convertToSlotTrait),
    maxSlots: traitSlots,
    onAssignTrait: (slotId: string, traitId: string) => {
      const slotIndex = parseInt(slotId, 10);
      if (!isNaN(slotIndex)) {
        dispatch({ 
          type: 'traits/equipTrait', 
          payload: { traitId, slotIndex } 
        });
      }
    },
    onRemoveTrait: (traitId: string) => {
      dispatch({ 
        type: 'traits/unequipTrait', 
        payload: { traitId } 
      });
    },
    playerLevel: playerLevel,
    activeSlots: equippedTraits.reduce((acc, traitId, index) => {
      if (traitId) {
        acc[index] = traitId;
      }
      return acc;
    }, {} as Record<number, string>)
  };

  return (
    <TraitSystemErrorBoundary>
      <Snackbar
        open={dndKitError}
        autoHideDuration={6000}
        onClose={() => setDndKitError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setDndKitError(false)}>
          Using simplified trait management due to technical limitations
        </Alert>
      </Snackbar>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <TraitList {...traitListProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          {dndKitError ? (
            <TraitSlotsFallback 
              player={{
                traitSlots,
                equippedTraits,
                acquiredTraits,
                level: playerLevel
              }}
              essence={essence}
              equippedTraits={getEquippedTraits()}
              availableTraits={getAvailableTraits()}
              onEquip={handleEquipTrait}
              onUnequip={handleUnequipTrait}
              onUpgradeSlot={handleUpgradeSlot}
            />
          ) : (
            <TraitSlots {...traitSlotsProps} />
          )}
        </Grid>
      </Grid>
    </TraitSystemErrorBoundary>
  );
};

export default TraitSystemWrapper;
