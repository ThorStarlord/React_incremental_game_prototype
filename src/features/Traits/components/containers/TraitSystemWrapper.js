import React, { useState, useEffect, useContext } from 'react';
import { Grid, Alert, Snackbar } from '@mui/material';
import TraitList from './TraitList';
import TraitSlots from './TraitSlots';
import TraitSlotsFallback from './TraitSlotsFallback';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
import { traits } from '../../../../modules/data/traits';

const TraitSystemWrapper = () => {
  const [dndKitError, setDndKitError] = useState(false);
  const { player, essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    // Check if @dnd-kit is available
    const checkDependencies = async () => {
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

  const handleEquipTrait = (traitId) => {
    if (player.equippedTraits.length < player.traitSlots) {
      dispatch({ type: 'EQUIP_TRAIT', payload: traitId });
    }
  };

  const handleUnequipTrait = (traitId) => {
    dispatch({ type: 'UNEQUIP_TRAIT', payload: traitId });
  };

  const handleUpgradeSlot = (cost) => {
    if (essence >= cost) {
      dispatch({ type: 'SPEND_ESSENCE', payload: cost });
      dispatch({ type: 'UPGRADE_TRAIT_SLOTS' });
    }
  };

  const getEquippedTraits = () => {
    return player.equippedTraits.map(id => ({
      id,
      ...traits.copyableTraits[id]
    }));
  };

  const getAvailableTraits = () => {
    return player.acquiredTraits.map(id => ({
      id,
      ...traits.copyableTraits[id]
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