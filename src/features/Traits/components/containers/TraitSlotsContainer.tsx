import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
// Selectors
import {
  selectTraits,
  selectAcquiredTraitObjects,
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSelectors';
import {
  selectEquippedTraits,
  selectPermanentTraits,
  selectPlayerTraitSlots
} from '../../../Player/state/PlayerSelectors';
import { selectIsInProximityToNPC } from '../../../Meta/state/MetaSlice';
// Actions and Thunks
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../../Player/state/PlayerThunks';
// UI Component
import { TraitSlotsUI } from '../ui/TraitSlotsUI';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

export const TraitSlotsContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  // --- Data selection from Redux ---
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // --- Local UI State Management ---
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [unequipDialog, setUnequipDialog] = useState<{ open: boolean; trait?: Trait; slotIndex?: number; }>({ open: false });

  // --- Memoized Derived Data ---
  const equippedTraitIds = useMemo(() => {
    return equippedTraits.map(trait => trait.id);
  }, [equippedTraits]);

  const availableTraitsForEquip = useMemo(() => {
    return acquiredTraits.filter(trait =>
      !equippedTraitIds.includes(trait.id) &&
      !permanentTraitIds.includes(trait.id)
    );
  }, [acquiredTraits, equippedTraitIds, permanentTraitIds]);

  // --- Callback Handlers ---
  const handleSlotClick = useCallback((slot: TraitSlot) => {
    if (!isInProximityToNPC || slot.isLocked) return;

    if (slot.traitId) {
      const equippedTrait = equippedTraits.find(t => t.id === slot.traitId);
      if (equippedTrait) {
        setUnequipDialog({ open: true, trait: equippedTrait, slotIndex: slot.slotIndex });
      }
    } else {
      setSelectedSlotIndex(slot.slotIndex);
    }
  }, [equippedTraits, isInProximityToNPC]);

  const handleCloseSelector = useCallback(() => {
    setSelectedSlotIndex(null);
    setSelectedTraitId(null);
  }, []);

  const handleTraitSelectInDialog = useCallback((traitId: string) => {
    setSelectedTraitId(traitId);
  }, []);

  const handleEquipConfirm = useCallback(() => {
    if (selectedTraitId && selectedSlotIndex !== null) {
      dispatch(equipTrait({ traitId: selectedTraitId, slotIndex: selectedSlotIndex }));
      dispatch(recalculateStatsThunk());
    }
    handleCloseSelector();
  }, [selectedSlotIndex, selectedTraitId, dispatch, handleCloseSelector]);

  const handleUnequipConfirm = useCallback(() => {
    if (unequipDialog.slotIndex !== undefined) {
      dispatch(unequipTrait({ slotIndex: unequipDialog.slotIndex }));
      dispatch(recalculateStatsThunk());
    }
    setUnequipDialog({ open: false });
  }, [dispatch, unequipDialog.slotIndex]);
  
  const handleCloseUnequipDialog = useCallback(() => {
    setUnequipDialog({ open: false });
  }, []);

  if (isLoading && Object.keys(allTraits).length === 0) {
    return <TraitSlotsUI
      traitSlots={traitSlots}
      equippedTraits={equippedTraits}
      availableTraits={[]}
      isInProximityToNPC={isInProximityToNPC}
      isLoading={true}
      error={null} // Provide null for error prop
      onSlotClick={() => {}} // Provide empty function for onSlotClick
      // Provide all other required props even in loading state
      selectedSlotIndexForModal={selectedSlotIndex}
      isTraitSelectionModalOpen={selectedSlotIndex !== null}
      onOpenTraitSelectionModal={() => {}}
      onCloseTraitSelectionModal={handleCloseSelector}
      onSelectTraitInModal={handleTraitSelectInDialog}
      selectedTraitIdInModal={selectedTraitId}
      onConfirmEquip={handleEquipConfirm}
      unequipDialogState={unequipDialog}
      onOpenUnequipDialog={() => {}}
      onConfirmUnequip={handleUnequipConfirm}
      onCloseUnequipDialog={handleCloseUnequipDialog}
    />;
  }
  
  if (error) {
     return <p>Error loading traits: {error}</p>; // Simplified error display
  }

  return (
    <TraitSlotsUI
      traitSlots={traitSlots}
      equippedTraits={equippedTraits}
      availableTraits={availableTraitsForEquip}
      isInProximityToNPC={isInProximityToNPC}
      isLoading={false}
      error={error}
      // Pass state and handlers for the selection modal
      selectedSlotIndexForModal={selectedSlotIndex}
      isTraitSelectionModalOpen={selectedSlotIndex !== null}
      onOpenTraitSelectionModal={(slotIndex) => setSelectedSlotIndex(slotIndex)}
      onCloseTraitSelectionModal={handleCloseSelector}
      onSelectTraitInModal={handleTraitSelectInDialog}
      selectedTraitIdInModal={selectedTraitId}
      onConfirmEquip={handleEquipConfirm}
      // Pass state and handlers for the unequip confirmation
      unequipDialogState={unequipDialog}
      onOpenUnequipDialog={(trait, slotIndex) => setUnequipDialog({ open: true, trait, slotIndex })}
      onConfirmUnequip={handleUnequipConfirm}
      onCloseUnequipDialog={handleCloseUnequipDialog}
      // Pass the main slot click handler
      onSlotClick={handleSlotClick}
    />
  );
};

export default TraitSlotsContainer;