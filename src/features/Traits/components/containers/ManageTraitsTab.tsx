import React, { useCallback } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { 
  selectTraits, 
  selectAvailableTraitObjects, 
  selectPlayerPermanentTraitIdsFromPlayer,
  selectTraitPresets,
  selectEquippedTraitObjects
} from '../../state/TraitsSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { equipTrait, unequipTrait } from '../../state/TraitsSlice';
import EquippedSlotsPanel from '../ui/EquippedSlotsPanel';
import AvailableTraitsPanel from '../ui/AvailableTraitsPanel';
import TraitCard from '../ui/TraitCard';

/**
 * ManageTraitsTab Container
 * 
 * Primary container for the entire "Manage Traits" tab experience.
 * Provides drag-and-drop functionality for trait management and handles
 * all state updates through Redux actions.
 */
const ManageTraitsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const availableTraits = useAppSelector(selectAvailableTraitObjects);
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects);
  const permanentTraitIds = useAppSelector(selectPlayerPermanentTraitIdsFromPlayer);
  const allTraits = useAppSelector(selectTraits);
  const currentEssence = useAppSelector(selectCurrentEssence);

  // Create hardcoded trait slots since Player doesn't export trait slots
  const traitSlots = React.useMemo(() => {
    const totalSlots = 6;
    const unlockedSlots = 3;
    
    return Array.from({ length: totalSlots }, (_, index) => ({
      id: `slot_${index}`,
      index,
      traitId: equippedTraitObjects[index]?.id || null,
      isUnlocked: index < unlockedSlots,
      unlockRequirement: index >= unlockedSlots ? `Unlock at slot ${index + 1}` : undefined
    }));
  }, [equippedTraitObjects]);

  // Drag state
  const [activeTraitId, setActiveTraitId] = React.useState<string | null>(null);

  /**
   * Handle drag start - track which trait is being dragged
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveTraitId(active.id as string);
  }, []);

  /**
   * Handle drag end - core logic for trait slot management
   * Checks if a trait was dropped onto a valid slot and dispatches equipTrait action
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear active drag state
    setActiveTraitId(null);

    if (!over) {
      return; // Drag was cancelled or dropped outside droppable area
    }

    const traitId = active.id as string;
    const targetId = over.id as string;

    // Handle dropping onto trait slots
    if (targetId.startsWith('slot-')) {
      const slotIndex = parseInt(targetId.replace('slot-', ''), 10);
      
      if (!isNaN(slotIndex) && slotIndex >= 0 && slotIndex < traitSlots.length) {
        const targetSlot = traitSlots[slotIndex];
        
        // Check if slot is unlocked
        if (!targetSlot.isUnlocked) {
          console.warn(`Cannot equip trait to locked slot ${slotIndex}`);
          return;
        }

        // If slot already has a trait, unequip it first
        if (targetSlot.traitId) {
          dispatch(unequipTrait(slotIndex));
        }

        // Equip the new trait
        dispatch(equipTrait({ traitId, slotIndex }));
      }
    }

    // Handle dropping onto unequip area
    if (targetId === 'unequip-zone') {
      // Find which slot contains this trait and unequip it
      const slotIndex = traitSlots.findIndex(slot => slot.traitId === traitId);
      if (slotIndex !== -1) {
        dispatch(unequipTrait(slotIndex));
      }
    }
  }, [dispatch, traitSlots]);

  /**
   * Handle trait unequip action
   */
  const handleUnequip = useCallback((slotIndex: number, traitId: string) => {
    dispatch(unequipTrait(slotIndex));
  }, [dispatch]);

  /**
   * Handle make trait permanent action - deprecated
   */
  const handleMakePermanent = useCallback((traitId: string) => {
    console.warn('Make permanent action is deprecated. Use Resonance from NPCs instead.');
  }, []);

  // Get the currently dragged trait for drag overlay
  const activeTrait = activeTraitId ? allTraits[activeTraitId] : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Manage Traits
      </Typography>
      
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={3}>
          {/* Equipped Traits Section */}
          <Grid item xs={12} md={6}>
            <EquippedSlotsPanel
              slots={traitSlots}
              equippedTraits={equippedTraitObjects.reduce((acc: Record<string, any>, trait: any) => {
                acc[trait.id] = trait;
                return acc;
              }, {})}
              onSlotClick={(slotIndex: number, traitId: string | null) => {
                // Handle slot click for trait selection
                console.log('Slot clicked:', slotIndex, traitId);
              }}
              onTraitUnequip={handleUnequip}
            />
          </Grid>

          {/* Available Traits Section */}
          <Grid item xs={12} md={6}>
            <AvailableTraitsPanel
              availableTraits={availableTraits}
            />
          </Grid>
        </Grid>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTrait ? (
            <TraitCard
              trait={activeTrait}
              isEquipped={false}
              isPermanent={false}
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