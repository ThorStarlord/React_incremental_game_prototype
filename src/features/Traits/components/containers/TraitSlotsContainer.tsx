import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
// FIXED: Importing the correct selectors
import {
  selectTraits,
  selectAcquiredTraitObjects, // This gets all traits the player has learned
  
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSelectors';
// FIXED: Importing from PlayerSelectors to get player-specific data
import {
  selectEquippedTraits,
  selectPermanentTraits,
  selectPlayerTraitSlots // Use this selector to get the official slot structure
} from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { selectIsInProximityToNPC } from '../../../Meta/state/MetaSlice';
// FIXED: Importing actions from the correct slice (PlayerSlice)
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../../Player/state/PlayerThunks';
import TraitSlots from '../ui/TraitSlots';

export const TraitSlotsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const equippedTraitObjects = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const essence = useAppSelector(selectCurrentEssence);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // FIXED: Use the official player trait slots from the selector
  const traitSlots = useAppSelector(selectPlayerTraitSlots);

  const equippedTraitIds = useMemo(() => {
    return equippedTraitObjects.map(trait => trait.id);
  }, [equippedTraitObjects]);

  const [showSelector, setShowSelector] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ show: false, message: '', severity: 'info' });

  const onOpenSelector = useCallback((slotId: string) => { setActiveSlotId(slotId); setShowSelector(true); }, []);
  const onCloseSelector = useCallback(() => { setShowSelector(false); setActiveSlotId(null); setSelectedTraitId(null); }, []);
  const onSelectTrait = useCallback((traitId: string) => setSelectedTraitId(traitId), []);

  const onConfirmAssign = useCallback(() => {
    if (selectedTraitId && activeSlotId) {
      const targetSlot = traitSlots.find((s) => s.id === activeSlotId);
      if (targetSlot) {
        // FIXED: Dispatching the correct equipTrait action from PlayerSlice
        dispatch(equipTrait({ traitId: selectedTraitId, slotIndex: targetSlot.slotIndex }));
        dispatch(recalculateStatsThunk());
      }
    }
    onCloseSelector();
  }, [selectedTraitId, activeSlotId, dispatch, onCloseSelector, traitSlots]);

  const onRemove = useCallback((slotIndex: number) => {
    // FIXED: Dispatching the correct unequipTrait action from PlayerSlice
    dispatch(unequipTrait({ slotIndex }));
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  const onCloseNotification = useCallback(() => setNotification(prev => ({ ...prev, show: false })), []);

  const eligibleTraitsForEquip = useMemo(() => {
    // Use the `acquiredTraits` (all known traits) instead of the old `availableTraits`
    return acquiredTraits.filter(trait =>
      !equippedTraitIds.includes(trait.id) &&
      !permanentTraitIds.includes(trait.id)
    );
  }, [acquiredTraits, equippedTraitIds, permanentTraitIds]);

  // The props object passed to the UI component
  const traitSlotsProps = {
    traitSlots,
    equippedTraits: equippedTraitObjects,
    availableTraits: eligibleTraitsForEquip,
    onEquipTrait: onConfirmAssign,
    onUnequipTrait: onRemove,
    isInProximityToNPC,
    // --- The following are props required by TraitSlotsUI that were missing or need defaults ---
    showSelector,
    notification,
    selectedTraitId,
    onOpenSelector,
    onCloseSelector,
    onSelectTrait,
    onCloseNotification,
    // Dummy props for deprecated functionality
    permanentTraitIds,
    essence,
    onMakePermanent: (traitId: string) => {
      console.warn("MakePermanent UI clicked in TraitSlotsContainer, but action is deprecated. Trait ID:", traitId);
      setNotification({ show: true, message: "'Make Permanent' action here is deprecated. Resonate traits from NPCs to make them permanent.", severity: 'info' });
    },
    confirmPermanent: { open: false, traitId: null },
    onConfirmPermanent: () => { console.warn("onConfirmPermanent called in TraitSlotsContainer, but action is deprecated."); },
    onCancelPermanent: () => { console.warn("onCancelPermanent called in TraitSlotsContainer, but action is deprecated."); },
  };

  if (isLoading && Object.keys(allTraits).length === 0) {
    return <TraitSlots {...traitSlotsProps} />;
  }
  
  if (error) {
    return <TraitSlots {...traitSlotsProps} />;
  }

  return <TraitSlots {...traitSlotsProps} />;
};

export default TraitSlotsContainer;