import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { 
  selectTraits, 
  selectAvailableTraitObjects, 
  selectEquippedTraitObjects,
  selectTraitLoading,
  selectTraitError 
} from '../../state/TraitsSelectors';
import { selectPermanentTraits } from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { selectIsInProximityToNPC } from '../../../Meta/state/MetaSlice';
import { equipTrait, unequipTrait } from '../../state/TraitsSlice';
import { recalculateStatsThunk } from '../../../Player/state/PlayerThunks';
import TraitSlots from '../ui/TraitSlots';

export const TraitSlotsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const availableTraits = useAppSelector(selectAvailableTraitObjects);
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const essence = useAppSelector(selectCurrentEssence);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // Create trait slots array - hardcoded structure since Player doesn't export trait slots
  const traitSlots = useMemo(() => {
    const totalSlots = 6; // Standard number of trait slots
    const unlockedSlots = 3; // Default unlocked slots
    
    return Array.from({ length: totalSlots }, (_, index) => ({
      id: `slot_${index}`,
      index,
      traitId: equippedTraitObjects[index]?.id || null,
      isUnlocked: index < unlockedSlots,
      unlockRequirement: index >= unlockedSlots ? `Unlock at slot ${index + 1}` : undefined
    }));
  }, [equippedTraitObjects]);

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
      const targetSlot = traitSlots.find((s: any) => s.id === activeSlotId);
      if (targetSlot) {
        dispatch(equipTrait({ traitId: selectedTraitId, slotIndex: targetSlot.index }));
        dispatch(recalculateStatsThunk());
      }
    }
    onCloseSelector();
  }, [selectedTraitId, activeSlotId, dispatch, onCloseSelector, traitSlots]);

  const onRemove = useCallback((slotIndex: number) => {
    dispatch(unequipTrait(slotIndex));
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  const onCloseNotification = useCallback(() => setNotification(prev => ({ ...prev, show: false })), []);

  const eligibleTraitsForEquip = useMemo(() => {
    return availableTraits.filter(trait => 
      !equippedTraitIds.includes(trait.id) && 
      !permanentTraitIds.includes(trait.id) 
    );
  }, [availableTraits, equippedTraitIds, permanentTraitIds]);

  const traitSlotsProps = {
    traitSlots: traitSlots,
    equippedTraits: equippedTraitObjects, 
    availableTraits: eligibleTraitsForEquip, 
    permanentTraitIds, 
    essence,
    showSelector,
    notification,
    selectedTraitId,
    onOpenSelector,
    onCloseSelector,
    onSelectTrait,
    onEquipTrait: onConfirmAssign,
    onUnequipTrait: onRemove,
    onCloseNotification,
    isInProximityToNPC,
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
