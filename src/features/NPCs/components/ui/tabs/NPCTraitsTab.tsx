/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and acquisition tab for NPC interactions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Stack, 
} from '@mui/material';
import {
  Share,
  CheckCircle,
  Remove,
  GetApp as GetAppIcon,
  Extension as TraitIcon,
  Lock as LockIcon,
  AddCircleOutline as AddCircleOutlineIcon, 
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import { updateNpcRelationship } from '../../../state/NPCSlice';
import { shareTraitWithNPCThunk } from '../../../state/NPCThunks';
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks';
import { selectTraits, selectPlayerTrulyPossessedTraitObjects } from '../../../../Traits/state/TraitsSelectors';
import { acquireTrait as acquireTraitAction } from '../../../../Traits/state/TraitsSlice'; 
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { selectIsInProximityToNPC } from '../../../../Meta/state/MetaSlice';
import { 
  selectPermanentTraits as selectPlayerSlicePermanentTraitIds,
  selectTraitSlots // Corrected import name
} from '../../../../Player/state/PlayerSelectors';
import { equipTrait as equipPlayerTraitAction } from '../../../../Player/state/PlayerSlice'; 
import { NPC, NPCSharedTraitSlot } from '../../../state/NPCTypes';
import { Trait, TraitSlot } from '../../../../Traits/state/TraitsTypes'; // Corrected: TraitSlot from TraitsTypes

interface NPCTraitsTabProps {
  npcId: string;
}

interface TraitAcquisitionDialog {
  open: boolean;
  trait: Trait | null;
  traitId: string | null;
}

const TEST_TRAIT_ID_DEBUG = "test_trait_debug"; 

export const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  
  const npc = useAppSelector(state => selectNPCById(state, npcId)) as NPC;
  const allTraits = useAppSelector(selectTraits);
  const playerPossessedTraits = useAppSelector(selectPlayerTrulyPossessedTraitObjects); 
  const playerPermanentTraitIdsFromPlayerSlice = useAppSelector(selectPlayerSlicePermanentTraitIds);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);
  const playerTraitSlots = useAppSelector(selectTraitSlots); // Corrected usage

  const [acquisitionDialog, setAcquisitionDialog] = useState<TraitAcquisitionDialog>({
    open: false,
    trait: null,
    traitId: null,
  });
  const [shareError, setShareError] = useState<string | null>(null);
  const [acquireError, setAcquireError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  const playerAcquiredTraitIds = useMemo(() => 
    playerPossessedTraits.map((trait: Trait) => trait.id),
    [playerPossessedTraits]
  );

  const availableTraitsDetails = useMemo(() => {
    if (!npc?.availableTraits || !allTraits) {
      return [];
    }
    return npc.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait: Trait | undefined) => trait !== undefined) as Trait[];
  }, [npc?.availableTraits, allTraits]);
  
  const sharedTraitIds = npc?.sharedTraitSlots?.map((slot: NPCSharedTraitSlot) => slot.traitId).filter(Boolean) || [];
  const shareableTraits = playerPossessedTraits.filter((trait: Trait) => 
    !sharedTraitIds.includes(trait.id) && 
    !playerPermanentTraitIdsFromPlayerSlice.includes(trait.id)
  );

  const canPlayerAcquireTrait = useCallback((trait: Trait): boolean => {
    if (playerAcquiredTraitIds.includes(trait.id)) return false;
    if (!isInProximityToNPC) return false;
    const essenceCost = trait.essenceCost || 0;
    if (currentEssence < essenceCost) return false;
    return true;
  }, [playerAcquiredTraitIds, isInProximityToNPC, currentEssence]);

  const handleAcquireTrait = useCallback(async (traitId: string) => {
    if (!npc) return;
    setAcquireError(null);
    try {
      await dispatch(acquireTraitWithEssenceThunk(traitId)).unwrap();
      dispatch(updateNpcRelationship({
        npcId,
        change: 5,
        reason: `Resonated trait from ${npc.name}`,
      }));
    } catch (error: any) {
      console.error('Failed to acquire trait:', error);
      setAcquireError(error?.message || (typeof error === 'string' ? error : 'Failed to acquire trait.'));
    }
  }, [dispatch, npcId, npc?.name]);

  const handleShareTrait = useCallback(async (traitId: string, targetSlotIndex?: number) => {
    if (!npc) return;
    setShareError(null);
    try {
      let actualSlotIndex: number;
      if (traitId === '') { 
        if (targetSlotIndex === undefined) {
          console.error('Cannot unshare: targetSlotIndex is undefined.');
          setShareError('Internal error: Slot index missing for unshare operation.');
          return;
        }
        actualSlotIndex = targetSlotIndex;
      } else { 
        const emptyUnlockedSlot = npc.sharedTraitSlots?.find(slot => slot.isUnlocked && !slot.traitId);
        if (emptyUnlockedSlot) {
          actualSlotIndex = emptyUnlockedSlot.index;
        } else {
          setShareError(`No available unlocked trait slots on ${npc.name}. Improve relationship or wait for slots to open.`);
          return;
        }
      }
      await dispatch(shareTraitWithNPCThunk({ npcId, traitId, slotIndex: actualSlotIndex })).unwrap();
    } catch (error: any) {
      console.error('Failed to share/unshare trait:', error);
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Failed to share/unshare trait.');
      setShareError(errorMessage);
    }
  }, [dispatch, npcId, npc?.name, npc?.sharedTraitSlots]);

  const getLearnButtonTooltip = useCallback((trait: Trait, isAcquiredByPlayer: boolean): string => {
    if (isAcquiredByPlayer) return "Already acquired";
    if (!isInProximityToNPC) return "You must be in proximity to this NPC";
    if (currentEssence < (trait.essenceCost || 0)) {
      return `Requires ${trait.essenceCost || 0} Essence (you have ${currentEssence})`;
    }
    return "Learn this trait";
  }, [isInProximityToNPC, currentEssence]);

  const handleOpenAcquisitionDialog = useCallback((trait: Trait) => {
    setAcquisitionDialog({ open: true, trait, traitId: trait.id });
  }, []);

  const handleCloseAcquisitionDialog = useCallback(() => {
    setAcquisitionDialog({ open: false, trait: null, traitId: null });
  }, []);

  const handleConfirmAcquisition = useCallback(async () => {
    if (acquisitionDialog.traitId) {
      await handleAcquireTrait(acquisitionDialog.traitId);
      handleCloseAcquisitionDialog();
    }
  }, [acquisitionDialog.traitId, handleAcquireTrait, handleCloseAcquisitionDialog]);

  const handleDebugGrantAndEquipTrait = () => {
    setDebugMessage(null);
    if (!allTraits[TEST_TRAIT_ID_DEBUG]) {
      setDebugMessage(`Error: Test trait "${TEST_TRAIT_ID_DEBUG}" not found in traits data. Please define it in traits.json.`);
      console.error(`Error: Test trait "${TEST_TRAIT_ID_DEBUG}" not found in traits data.`);
      return;
    }

    dispatch(acquireTraitAction(TEST_TRAIT_ID_DEBUG)); 

    const typedPlayerTraitSlots = playerTraitSlots as TraitSlot[]; 
    const emptyPlayerSlotIndex = typedPlayerTraitSlots.findIndex((slot: TraitSlot) => !slot.traitId);

    if (emptyPlayerSlotIndex !== -1) {
      dispatch(equipPlayerTraitAction({ traitId: TEST_TRAIT_ID_DEBUG, slotIndex: emptyPlayerSlotIndex }));
      setDebugMessage(`Granted and equipped "${allTraits[TEST_TRAIT_ID_DEBUG]?.name || TEST_TRAIT_ID_DEBUG}" to player slot ${emptyPlayerSlotIndex + 1}.`);
    } else {
      setDebugMessage('Granted trait, but no empty player slot to equip it.');
      console.warn('DEBUG: Granted trait, but no empty player slot to equip it.');
    }
  };

  if (!npc) { 
    return <Alert severity="warning">NPC data not available.</Alert>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TraitIcon color="primary" />
        <Typography variant="h6">Trait Interaction with {npc.name}</Typography>
      </Box>

      {!isInProximityToNPC && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must be in proximity to this NPC to acquire or share traits effectively.
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          {acquireError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAcquireError(null)}>{acquireError}</Alert>}
          <Typography variant="h6" sx={{ mb: 2 }}>Traits Available from {npc.name} for Resonance</Typography>
          {availableTraitsDetails.length > 0 ? (
            <Grid container spacing={2}>
              {availableTraitsDetails.map((trait: Trait) => {
                const isAcquiredByPlayer = playerAcquiredTraitIds.includes(trait.id);
                const canAcquire = canPlayerAcquireTrait(trait);
                const essenceCost = trait.essenceCost || 0;
                return (
                  <Grid item xs={12} md={6} key={trait.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>{trait.name}</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>{trait.description}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                              <Chip size="small" label={trait.category} variant="outlined" />
                              <Chip size="small" label={trait.rarity} color="primary" variant="outlined" />
                              {essenceCost > 0 && <Chip size="small" label={`${essenceCost} Essence`} color={currentEssence >= essenceCost ? 'success' : 'error'} />}
                            </Box>
                          </Box>
                          <Tooltip title={getLearnButtonTooltip(trait, isAcquiredByPlayer)}>
                            <span>
                              <Button variant={isAcquiredByPlayer ? "outlined" : "contained"} size="small" startIcon={isAcquiredByPlayer ? <CheckCircle /> : <GetAppIcon />} onClick={() => handleOpenAcquisitionDialog(trait)} disabled={isAcquiredByPlayer || !canAcquire} color={isAcquiredByPlayer ? "success" : "primary"}>
                                {isAcquiredByPlayer ? 'Acquired' : 'Resonate'}
                              </Button>
                            </span>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : ( <Typography variant="body2" color="text.secondary">{npc.name} has no traits available for Resonance at this time.</Typography> )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          {shareError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShareError(null)}>{shareError}</Alert>}
          <Typography variant="h6" sx={{ mb: 2 }}>Shared Trait Slots</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Share your acquired traits with {npc.name} to strengthen your connection.</Typography>
          {npc.sharedTraitSlots && npc.sharedTraitSlots.length > 0 ? (
            <Grid container spacing={2}>
              {npc.sharedTraitSlots.map((slot: NPCSharedTraitSlot) => (
                <Grid item xs={12} sm={6} md={4} key={slot.id}>
                  <Card variant="outlined" sx={{ height: '100%', opacity: slot.isUnlocked ? 1 : 0.6, backgroundColor: slot.isUnlocked ? 'transparent' : 'action.disabledBackground' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          {!slot.isUnlocked && <LockIcon fontSize="small" sx={{ mr: 0.5 }} />}
                          Slot {slot.index + 1} {slot.isUnlocked ? '(Unlocked)' : '(Locked)'}
                        </Typography>
                        {!slot.isUnlocked && slot.unlockRequirement !== undefined && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Requires Affinity: {slot.unlockRequirement}
                          </Typography>
                        )}
                        {slot.isUnlocked && slot.traitId && allTraits[slot.traitId] && (
                          <Typography variant="body2">
                            {allTraits[slot.traitId]?.name}
                          </Typography>
                        )}
                        {slot.isUnlocked && !slot.traitId && (
                          <Typography variant="body2" color="text.secondary">
                            Empty
                          </Typography>
                        )}
                      </Box>
                      {slot.isUnlocked && slot.traitId && (
                        <Button size="small" color="error" onClick={() => handleShareTrait('', slot.index)} sx={{ mt: 1, alignSelf: 'flex-start' }}>
                          Remove
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : ( <Typography variant="body2" color="text.secondary">No shared trait slots defined for this NPC. Improve relationship to unlock trait sharing.</Typography> )}
        </CardContent>
      </Card>

      {shareableTraits.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Your Traits Available to Share</Typography>
            <Grid container spacing={1}>
              {shareableTraits.map((trait: Trait) => {
                if (!trait) return null;
                const canShareToAnySlot = npc.sharedTraitSlots?.some(s => s.isUnlocked && !s.traitId) ?? false;
                return (
                  <Grid item key={trait.id}>
                    <Tooltip title={!canShareToAnySlot ? `No empty unlocked slots on ${npc.name}` : `Share ${trait.name}`}>
                      <span>
                        <Button variant="outlined" size="small" startIcon={<Share />} onClick={() => handleShareTrait(trait.id)} disabled={!canShareToAnySlot}>
                          {trait.name}
                        </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ mt: 2, borderColor: 'warning.main' }}>
        <CardContent>
          <Typography variant="overline" color="text.secondary">Debug Tools</Typography>
          {debugMessage && <Alert severity="info" sx={{my:1}} onClose={() => setDebugMessage(null)}>{debugMessage}</Alert>}
          <Stack direction="row" spacing={1} sx={{mt:1}}>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleDebugGrantAndEquipTrait}
            >
              Grant & Equip Test Trait
            </Button>
          </Stack>
          <Typography variant="caption" display="block" sx={{mt:1}}>
            Note: Ensure a trait with ID "{TEST_TRAIT_ID_DEBUG}" exists in traits.json.
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={acquisitionDialog.open} onClose={handleCloseAcquisitionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Resonate Trait: {acquisitionDialog.trait?.name}</DialogTitle>
        <DialogContent>
          {acquisitionDialog.trait && (
            <Box>
              <Typography variant="body1" paragraph>Are you sure you want to resonate with "{acquisitionDialog.trait.name}" from {npc.name}?</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>{acquisitionDialog.trait.description}</Typography>
              {acquisitionDialog.trait.essenceCost && acquisitionDialog.trait.essenceCost > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This will cost {acquisitionDialog.trait.essenceCost} Essence. You currently have {currentEssence} Essence.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcquisitionDialog}>Cancel</Button>
          <Button onClick={handleConfirmAcquisition} variant="contained" disabled={!acquisitionDialog.trait || !canPlayerAcquireTrait(acquisitionDialog.trait)}>
            Resonate Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(NPCTraitsTab);
