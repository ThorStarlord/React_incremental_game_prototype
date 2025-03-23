import React, { useState, useEffect } from 'react';
import { Grid, Alert, Snackbar } from '@mui/material';
import TraitList from './TraitList';
import TraitSlots from './TraitSlots';
import TraitSlotsFallback from './TraitSlotsFallback';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';
import { useGameState, useGameDispatch } from '../../../../context/GameStateExports';
import { traits, TraitsCollection as ImportedTraitsCollection } from '../../data/traits';
import { 
  ExtendedTrait, 
  TraitId, 
  TRAIT_CATEGORIES,
  TraitEffect,
  createTraitId,
  TraitSystem,
  TRAIT_SOURCES,
  TRAIT_RARITIES
} from '../../../../context/types/gameStates/TraitsGameStateTypes';

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
 * Interface for Player object in the game state that matches our usage
 */
interface PlayerWithTraits {
  traitSlots: number;
  equippedTraits: string[];
  acquiredTraits: string[];
  level?: number;
}

/**
 * Interface for the actual structure of the traits data
 */
interface TraitsCollection {
  copyableTraits: {
    [traitId: string]: ExtendedTrait;
  };
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
  const gameState = useGameState();
  const { player, essence } = gameState;
  const dispatch = useGameDispatch();
  const traitPoints = (gameState.traits?.traitPoints || 0);

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
    if ((player?.equippedTraits?.length || 0) < (player?.traitSlots || 0)) {
      dispatch({ type: 'TRAIT_ACTIONS.EQUIP_TRAIT', payload: { traitId: createTraitId(traitId) } });
    }
  };

  /**
   * Handles unequipping a trait
   * @param {string} traitId - ID of the trait to unequip
   */
  const handleUnequipTrait = (traitId: string): void => {
    dispatch({ type: 'TRAIT_ACTIONS.UNEQUIP_TRAIT', payload: { traitId: createTraitId(traitId) } });
  };

  /**
   * Handles upgrading trait slots if player has enough essence
   * @param {number} cost - Cost in essence to upgrade
   */
  const handleUpgradeSlot = (cost: number): void => {
    const essenceAmount = (essence?.amount || 0);
    if (essenceAmount >= cost) {
      dispatch({ type: 'ESSENCE_ACTIONS.SPEND_ESSENCE', payload: cost });
      dispatch({ type: 'TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT', payload: { slotIndex: (player?.traitSlots || 0) } });
    }
  };

  /**
   * Gets an array of equipped trait objects with their data
   * @returns {InternalTrait[]} Array of equipped traits with complete data
   */
  const getEquippedTraits = (): InternalTrait[] => {
    if (!player?.equippedTraits) return [];
    
    return player.equippedTraits
      .filter(id => id !== '') // Filter out empty slot placeholders
      .map(id => {
        const traitsData = gameState.traits as TraitSystem || {};
        // Convert string id to TraitId type before accessing copyableTraits
        const traitId = createTraitId(id);
        const traitData = traitsData.copyableTraits?.[traitId] || {};
        
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
    if (!player?.acquiredTraits) return [];
    
    return player.acquiredTraits.map(id => {
      const traitsData = gameState.traits as TraitSystem || {};
      // Convert string id to TraitId type before accessing copyableTraits
      const traitId = createTraitId(id);
      const traitData = traitsData.copyableTraits?.[traitId] || {};
      
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
        type: 'TRAIT_ACTIONS.UPGRADE_TRAIT', 
        payload: { traitId: createTraitId(traitId), newTier: 2 } 
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
    maxSlots: player?.traitSlots || 0,
    onAssignTrait: (slotId: string, traitId: string) => {
      // Convert slotId from string to number since our dispatch expects a number
      const slotIndex = parseInt(slotId, 10);
      if (!isNaN(slotIndex)) {
        dispatch({ 
          type: 'TRAIT_ACTIONS.EQUIP_TRAIT', 
          payload: { traitId: createTraitId(traitId), slotIndex } 
        });
      }
    },
    onRemoveTrait: (traitId: string) => {
      dispatch({ 
        type: 'TRAIT_ACTIONS.UNEQUIP_TRAIT', 
        payload: { traitId: createTraitId(traitId) } 
      });
    },
    playerLevel: player?.level || 1,
    activeSlots: (player?.equippedTraits || []).reduce((acc, traitId, index) => {
      if (traitId) {
        acc[index] = traitId;
      }
      return acc;
    }, {} as Record<number, string>)
  };

  // Create player object with only the properties we need
  const playerForFallback: PlayerWithTraits = {
    traitSlots: player?.traitSlots || 0,
    equippedTraits: player?.equippedTraits || [],
    acquiredTraits: player?.acquiredTraits || [],
    level: player?.level || 1
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
              player={playerForFallback}
              essence={(essence?.amount || 0)}
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
