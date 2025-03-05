import React, { useState, useEffect } from 'react';
import { Grid, Alert, Snackbar } from '@mui/material';
import TraitList from './TraitList';
import TraitSlots from './TraitSlots';
import TraitSlotsFallback from './TraitSlotsFallback';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';
import { useGameState, useGameDispatch } from '../../../../context/index';
import { traits } from '../../data/traits';

/**
 * Interface for a Trait object
 * 
 * @interface Trait
 * @property {string} id - Unique identifier for the trait
 * @property {string} name - Display name of the trait
 * @property {string} description - Description of what the trait does
 */
interface Trait {
  id: string;
  name: string;
  description: string;
  [key: string]: any; // For any additional trait properties
}

/**
 * Interface for Player object in the game state
 * 
 * @interface Player
 * @property {number} traitSlots - Number of available trait slots
 * @property {string[]} equippedTraits - Array of equipped trait IDs
 * @property {string[]} acquiredTraits - Array of acquired trait IDs
 */
interface Player {
  traitSlots: number;
  equippedTraits: string[];
  acquiredTraits: string[];
}

/**
 * Interface for traits data structure
 * 
 * @interface TraitsData
 * @property {Record<string, Omit<Trait, 'id'>>} copyableTraits - Dictionary of trait data without IDs
 */
interface TraitsData {
  copyableTraits: Record<string, Omit<Trait, 'id'>>;
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
  const { player, essence } = useGameState();
  const dispatch = useGameDispatch();

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
    if (player.equippedTraits.length < player.traitSlots) {
      dispatch({ type: 'EQUIP_TRAIT', payload: traitId });
    }
  };

  /**
   * Handles unequipping a trait
   * @param {string} traitId - ID of the trait to unequip
   */
  const handleUnequipTrait = (traitId: string): void => {
    dispatch({ type: 'UNEQUIP_TRAIT', payload: traitId });
  };

  /**
   * Handles upgrading trait slots if player has enough essence
   * @param {number} cost - Cost in essence to upgrade
   */
  const handleUpgradeSlot = (cost: number): void => {
    if (essence >= cost) {
      dispatch({ type: 'SPEND_ESSENCE', payload: cost });
      dispatch({ type: 'UPGRADE_TRAIT_SLOTS' });
    }
  };

  /**
   * Gets an array of equipped trait objects with their data
   * @returns {Trait[]} Array of equipped traits with complete data
   */
  const getEquippedTraits = (): Trait[] => {
    return player.equippedTraits.map(id => ({
      id,
      ...(traits as TraitsData).copyableTraits[id]
    }));
  };

  /**
   * Gets an array of all acquired trait objects with their data
   * @returns {Trait[]} Array of acquired traits with complete data
   */
  const getAvailableTraits = (): Trait[] => {
    return player.acquiredTraits.map(id => ({
      id,
      ...(traits as TraitsData).copyableTraits[id]
    }));
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
          <TraitList />
        </Grid>
        <Grid item xs={12} md={5}>
          {dndKitError ? (
            <TraitSlotsFallback 
              player={player}
              essence={essence}
              equippedTraits={getEquippedTraits()}
              availableTraits={getAvailableTraits()}
              onEquip={handleEquipTrait}
              onUnequip={handleUnequipTrait}
              onUpgradeSlot={handleUpgradeSlot}
            />
          ) : (
            <TraitSlots />
          )}
        </Grid>
      </Grid>
    </TraitSystemErrorBoundary>
  );
};

export default TraitSystemWrapper;
