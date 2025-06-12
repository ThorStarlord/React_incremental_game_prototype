/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and acquisition tab for NPC interactions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Share as ShareIcon,
  GetApp as GetAppIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { selectSelectedNPCId, selectNPCById } from '../../../state/NPCSelectors';
// FIXED: Importing from PlayerSelectors
import {
  selectPermanentTraits,
  selectEquippedTraits,
  selectPlayerTraitSlots
} from '../../../../Player/state/PlayerSelectors';
// FIXED: Importing from TraitsSelectors
import { selectTraits } from '../../../../Traits/state/TraitsSelectors';
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { shareTraitWithNPCThunk } from '../../../state/NPCThunks';
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks';
import type { Trait } from '../../../../Traits/state/TraitsTypes';
import type { NPCSharedTraitSlot } from '../../../state/NPCTypes';
import { equipTrait } from '../../../../Player/state/PlayerSlice';

interface NPCTraitsTabProps {
  npcId: string;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const currentNPC = useAppSelector(state => selectNPCById(state, npcId));
  const allTraits = useAppSelector(selectTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const currentEssence = useAppSelector(selectCurrentEssence);
  
  const [acquisitionDialogOpen, setAcquisitionDialogOpen] = useState(false);
  const [selectedTraitForDialog, setSelectedTraitForDialog] = useState<Trait | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [acquireError, setAcquireError] = useState<string | null>(null);

  const playerAcquiredTraitIds = useMemo(() =>
    [...equippedTraits.map(t => t.id), ...permanentTraitIds],
    [equippedTraits, permanentTraitIds]
  );

  const availableTraitsDetails = useMemo(() => {
    if (!currentNPC?.availableTraits || !allTraits) return [];
    return currentNPC.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait): trait is Trait => !!trait);
  }, [currentNPC?.availableTraits, allTraits]);

  const sharedTraitIds = useMemo(() =>
    currentNPC?.sharedTraitSlots?.map(slot => slot.traitId).filter(Boolean) as string[] || [],
    [currentNPC?.sharedTraitSlots]
  );

  const shareableTraits = useMemo(() =>
    equippedTraits.filter(trait => !sharedTraitIds.includes(trait.id)),
    [equippedTraits, sharedTraitIds]
  );

  const canPlayerAcquireTrait = useCallback((trait: Trait): boolean => {
    if (playerAcquiredTraitIds.includes(trait.id)) return false;
    const essenceCost = trait.essenceCost || 0;
    return currentEssence >= essenceCost;
  }, [playerAcquiredTraitIds, currentEssence]);

  const handleAcquireTrait = useCallback(async (trait: Trait) => {
    if (!currentNPC) return;
    setAcquireError(null);
    try {
      await dispatch(acquireTraitWithEssenceThunk({
        traitId: trait.id,
        essenceCost: trait.essenceCost || 0
      })).unwrap();
    } catch (error: any) {
      setAcquireError(error?.message || 'Failed to acquire trait.');
    }
  }, [dispatch, currentNPC]);

  const handleShareTrait = useCallback(async (traitId: string, targetSlotIndex?: number) => {
    if (!currentNPC) return;
    setShareError(null);
    try {
      let actualSlotIndex: number;
      if (traitId === '') {
        if (targetSlotIndex === undefined) {
          setShareError('Internal error: Slot index missing for unshare operation.');
          return;
        }
        actualSlotIndex = targetSlotIndex;
      } else {
        const emptyUnlockedSlot = currentNPC.sharedTraitSlots?.find(slot => slot.isUnlocked && !slot.traitId);
        if (emptyUnlockedSlot) {
          actualSlotIndex = emptyUnlockedSlot.index;
        } else {
          setShareError(`No available unlocked trait slots on ${currentNPC.name}.`);
          return;
        }
      }
      await dispatch(shareTraitWithNPCThunk({ npcId: currentNPC.id, traitId, slotIndex: actualSlotIndex })).unwrap();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to share/unshare trait.';
      setShareError(errorMessage);
    }
  }, [dispatch, currentNPC]);

  const handleOpenAcquisitionDialog = useCallback((trait: Trait) => {
    setSelectedTraitForDialog(trait);
    setAcquisitionDialogOpen(true);
  }, []);

  const handleCloseAcquisitionDialog = useCallback(() => {
    setSelectedTraitForDialog(null);
    setAcquisitionDialogOpen(false);
  }, []);

  const handleConfirmAcquisition = useCallback(async () => {
    if (selectedTraitForDialog) {
      await handleAcquireTrait(selectedTraitForDialog);
      handleCloseAcquisitionDialog();
    }
  }, [selectedTraitForDialog, handleAcquireTrait, handleCloseAcquisitionDialog]);

  if (!currentNPC) {
    return <Alert severity="warning">NPC data not available.</Alert>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* ... (rest of the JSX code) ... */}
       <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Traits for Resonance</Typography>
          {availableTraitsDetails.map((trait: Trait) => (
             <Typography key={trait.id}>{trait.name}</Typography>
          ))}
        </CardContent>
      </Card>
      
    </Box>
  );
};

export default React.memo(NPCTraitsTab);