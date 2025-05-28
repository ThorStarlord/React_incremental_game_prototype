import React, { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectTraits, selectTraitSlots, selectEquippedTraitIds, selectPermanentTraits, equipTrait, unequipTrait } from '../../state/TraitsSlice';
import { makeTraitPermanentThunk } from '../../state/TraitThunks';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { selectAvailableTraitObjects, selectTraitLoading, selectTraitError } from '../../state/TraitsSelectors';
import TraitSlots from '../ui/TraitSlots';

const TraitSlotsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const traitsData = useAppSelector(selectTraits);
  const traitSlots = useAppSelector(selectTraitSlots);
  const equippedTraitIds = useAppSelector(selectEquippedTraitIds);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const essence = useAppSelector(selectCurrentEssence);
  const availableTraits = useAppSelector(selectAvailableTraitObjects);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const [showSelector, setShowSelector] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [confirmPermanent, setConfirmPermanent] = useState<{ open: boolean; traitId: string | null }>({ open: false, traitId: null });
  const [notification, setNotification] = useState<{ show: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ show: false, message: '', severity: 'info' });

  const onOpenSelector = useCallback((slotId: string) => { setActiveSlotId(slotId); setShowSelector(true); }, []);

  const onCloseSelector = useCallback(() => { setShowSelector(false); setActiveSlotId(null); setSelectedTraitId(null); }, []);

  const onSelectTrait = useCallback((traitId: string) => setSelectedTraitId(traitId), []);

  const onConfirmAssign = useCallback(() => { 
    if (selectedTraitId && activeSlotId) dispatch(equipTrait({ traitId: selectedTraitId, slotIndex: traitSlots.find(s => s.id === activeSlotId)!.index }));
    onCloseSelector();
  }, [selectedTraitId, activeSlotId, dispatch, onCloseSelector, traitSlots]);

  const onRemove = useCallback((id: string) => dispatch(unequipTrait(id)), [dispatch]);

  const onMakePermanent = useCallback((id: string) => setConfirmPermanent({ open: true, traitId: id }), []);

  const onConfirmPermanent = useCallback(() => {
    if (confirmPermanent.traitId) {
      dispatch(makeTraitPermanentThunk(confirmPermanent.traitId))
        .unwrap()
        .then(res => setNotification({ show: true, message: res.message, severity: res.success ? 'success' : 'info' }))
        .catch(err => setNotification({ show: true, message: typeof err === 'string' ? err : err.message || 'Error', severity: 'error' }));
    }
    setConfirmPermanent({ open: false, traitId: null });
  }, [confirmPermanent, dispatch]);

  const onCancelPermanent = useCallback(() => setConfirmPermanent({ open: false, traitId: null }), []);

  const onCloseNotification = useCallback(() => setNotification(prev => ({ ...prev, show: false })), []);

  const eligibleTraits = availableTraits.filter(t => !equippedTraitIds.includes(t.id));

  if (isLoading) return <TraitSlots traitSlots={traitSlots} allTraits={traitsData} equippedTraitIds={equippedTraitIds} permanentTraitIds={permanentTraitIds} essence={essence} eligibleTraits={eligibleTraits} isLoading={true} error={null} showSelector={false} confirmPermanent={confirmPermanent} notification={notification} onOpenSelector={onOpenSelector} onCloseSelector={onCloseSelector} onSelectTrait={onSelectTrait} onConfirmAssign={onConfirmAssign} onRemove={onRemove} onMakePermanent={onMakePermanent} onConfirmPermanent={onConfirmPermanent} onCancelPermanent={onCancelPermanent} onCloseNotification={onCloseNotification} selectedTraitId={selectedTraitId}/>;
  if (error) return <TraitSlots traitSlots={traitSlots} allTraits={traitsData} equippedTraitIds={equippedTraitIds} permanentTraitIds={permanentTraitIds} essence={essence} eligibleTraits={eligibleTraits} isLoading={false} error={error} showSelector={false} confirmPermanent={confirmPermanent} notification={notification} onOpenSelector={onOpenSelector} onCloseSelector={onCloseSelector} onSelectTrait={onSelectTrait} onConfirmAssign={onConfirmAssign} onRemove={onRemove} onMakePermanent={onMakePermanent} onConfirmPermanent={onConfirmPermanent} onCancelPermanent={onCancelPermanent} onCloseNotification={onCloseNotification} selectedTraitId={selectedTraitId}/>;

  return <TraitSlots traitSlots={traitSlots} allTraits={traitsData} equippedTraitIds={equippedTraitIds} permanentTraitIds={permanentTraitIds} essence={essence} eligibleTraits={eligibleTraits} isLoading={false} error={null} showSelector={showSelector} confirmPermanent={confirmPermanent} notification={notification} onOpenSelector={onOpenSelector} onCloseSelector={onCloseSelector} onSelectTrait={onSelectTrait} onConfirmAssign={onConfirmAssign} onRemove={onRemove} onMakePermanent={onMakePermanent} onConfirmPermanent={onConfirmPermanent} onCancelPermanent={onCancelPermanent} onCloseNotification={onCloseNotification} selectedTraitId={selectedTraitId}/>;
};

export default TraitSlotsContainer;