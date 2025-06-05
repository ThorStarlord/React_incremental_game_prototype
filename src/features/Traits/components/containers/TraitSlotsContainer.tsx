import React, { useState, useCallback, useMemo } from 'react'; // Added useMemo
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { 
  selectTraits, 
  selectAvailableTraitObjects, 
  selectTraitLoading, 
  selectTraitError 
} from '../../state/TraitsSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { selectIsInProximityToNPC } from '../../../Meta/state/MetaSlice';
import { 
  selectTraitSlots, 
  selectEquippedTraitIds,
  selectPermanentTraits as selectPlayerPermanentTraitIds 
} from '../../../Player/state/PlayerSelectors';
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import TraitSlots from '../ui/TraitSlots';

const TraitSlotsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const traitsData = useAppSelector(selectTraits);
  const playerTraitSlots = useAppSelector(selectTraitSlots);
  const equippedTraitIds = useAppSelector(selectEquippedTraitIds);
  const permanentTraitIds = useAppSelector(selectPlayerPermanentTraitIds); 
  const essence = useAppSelector(selectCurrentEssence);
  const availableTraits = useAppSelector(selectAvailableTraitObjects); 
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);

  const [showSelector, setShowSelector] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ show: false, message: '', severity: 'info' });

  const onOpenSelector = useCallback((slotId: string) => { setActiveSlotId(slotId); setShowSelector(true); }, []);
  const onCloseSelector = useCallback(() => { setShowSelector(false); setActiveSlotId(null); setSelectedTraitId(null); }, []);
  const onSelectTrait = useCallback((traitId: string) => setSelectedTraitId(traitId), []);

  const onConfirmAssign = useCallback(() => { 
    if (selectedTraitId && activeSlotId) {
      const targetSlot = playerTraitSlots.find(s => s.id === activeSlotId);
      if (targetSlot) {
        dispatch(equipTrait({ traitId: selectedTraitId, slotIndex: targetSlot.index }));
      }
    }
    onCloseSelector();
  }, [selectedTraitId, activeSlotId, dispatch, onCloseSelector, playerTraitSlots]);

  const onRemove = useCallback((slotIndex: number) => {
    const targetSlot = playerTraitSlots.find(slot => slot.index === slotIndex);
    if (targetSlot && targetSlot.traitId) {
      dispatch(unequipTrait({ slotIndex: targetSlot.index }));
    }
  }, [dispatch, playerTraitSlots]);

  const onCloseNotification = useCallback(() => setNotification(prev => ({ ...prev, show: false })), []);

  const eligibleTraitsForEquip = useMemo(() => {
    return availableTraits.filter(trait => 
      !equippedTraitIds.includes(trait.id) && 
      !permanentTraitIds.includes(trait.id) 
    );
  }, [availableTraits, equippedTraitIds, permanentTraitIds]);
  
  const equippedTraitObjects = useMemo(() => {
    return equippedTraitIds.map(id => traitsData[id]).filter(Boolean);
  }, [equippedTraitIds, traitsData]);

  const traitSlotsProps = {
    traitSlots: playerTraitSlots,
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

  if (isLoading && Object.keys(traitsData).length === 0) { 
    return <TraitSlots {...traitSlotsProps} />; 
  }
  
  if (error) {
    return <TraitSlots {...traitSlotsProps} />; 
  }

  return <TraitSlots {...traitSlotsProps} />;
};

export default TraitSlotsContainer;
