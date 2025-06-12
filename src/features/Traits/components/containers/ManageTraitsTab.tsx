import React, { useCallback, useMemo, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// FIXED: Importing correct selectors
import {
  selectTraits,
  selectAcquiredTraitObjects,
} from '../../state/TraitsSelectors';
import { selectPermanentTraits, selectPlayerTraitSlots, selectEquippedTraits } from '../../../Player/state/PlayerSelectors';
// FIXED: Importing actions from PlayerSlice
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import EquippedSlotsPanel from '../ui/EquippedSlotsPanel';
import AvailableTraitsPanel from '../ui/AvailableTraitsPanel';
import TraitCard from '../ui/TraitCard';
import { Trait } from '../../state/TraitsTypes';

const ManageTraitsTab: React.FC = () => {
  const dispatch = useAppDispatch();

  // State selectors
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const equippedTraitObjects = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots); // Get official slots

  // Filter for traits that are acquired but not equipped or permanent
  const availableTraits = useMemo(() => {
    const equippedIds = equippedTraitObjects.map(t => t.id);
    return acquiredTraits.filter(trait =>
      !equippedIds.includes(trait.id) &&
      !permanentTraitIds.includes(trait.id)
    );
  }, [acquiredTraits, equippedTraitObjects, permanentTraitIds]);

  const [activeTraitId, setActiveTraitId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTraitId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTraitId(null);

    if (!over) return;

    const traitId = active.id as string;
    const targetId = over.id as string;

    if (targetId.startsWith('slot-')) {
      const slotIndex = parseInt(targetId.replace('slot-', ''), 10);
      if (!isNaN(slotIndex) && slotIndex >= 0 && slotIndex < traitSlots.length) {
        const targetSlot = traitSlots[slotIndex];
        if (!targetSlot.isLocked) {
          if (targetSlot.traitId) {
            dispatch(unequipTrait({ slotIndex }));
          }
          dispatch(equipTrait({ traitId, slotIndex }));
        }
      }
    } else if (targetId === 'unequip-zone') {
      const slotIndex = traitSlots.findIndex(slot => slot.traitId === traitId);
      if (slotIndex !== -1) {
        dispatch(unequipTrait({ slotIndex }));
      }
    }
  }, [dispatch, traitSlots]);

  const handleUnequip = useCallback((slotIndex: number) => {
    dispatch(unequipTrait({ slotIndex }));
  }, [dispatch]);

  const activeTrait = activeTraitId ? allTraits[activeTraitId] : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Manage Traits
      </Typography>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EquippedSlotsPanel
              slots={traitSlots}
              equippedTraits={equippedTraitObjects.reduce((acc, trait) => {
                acc[trait.id] = trait;
                return acc;
              }, {} as Record<string, Trait>)}
              onSlotClick={(slotIndex, traitId) => {
                if (traitId) {
                  handleUnequip(slotIndex);
                }
              }}
              onTraitUnequip={(slotIndex, _) => handleUnequip(slotIndex)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AvailableTraitsPanel
              availableTraits={availableTraits}
              onTraitSelect={(traitId) => {
                const availableSlot = traitSlots.find(s => !s.isLocked && !s.traitId);
                if (availableSlot) {
                  dispatch(equipTrait({ traitId, slotIndex: availableSlot.slotIndex }));
                }
              }}
            />
          </Grid>
        </Grid>

        <DragOverlay>
          {activeTrait ? (
            <TraitCard
              trait={activeTrait}
              currentEssence={0} // Not needed for drag overlay
              sx={{
                opacity: 0.8,
                transform: 'rotate(5deg)',
                cursor: 'grabbing'
              }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
};

export default React.memo(ManageTraitsTab);