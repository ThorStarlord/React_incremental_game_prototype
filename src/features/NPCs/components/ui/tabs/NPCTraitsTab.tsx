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
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Share as ShareIcon,
  Star as StarIcon,
  AutoFixHigh as MagicIcon,
  CheckCircle as CheckCircleIcon,
  GetApp as GetAppIcon,
  Lock as LockIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { selectSelectedNPCId, selectNPCById } from '../../../state/NPCSelectors';
import { selectPermanentTraits } from '../../../../Player/state/PlayerSelectors';
import {
  selectUnlockedSlotCount,
  selectEquippedTraitObjects
} from '../../../../Traits/state/TraitsSelectors';
import { selectTraits } from '../../../../Traits/state/TraitsSelectors';
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { shareTraitWithNPCThunk } from '../../../state/NPCThunks';

const TEST_TRAIT_ID_DEBUG = "test_trait_debug";

interface NPCTraitsTabProps {
  npcId: string; // Add the missing npcId prop
}

/**
 * NPCTraitsTab - Handles trait-related interactions with NPCs
 */
const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const selectedNPCId = useAppSelector(selectSelectedNPCId);
  const currentNPC = useAppSelector(state => selectedNPCId ? selectNPCById(state, selectedNPCId) : null);
  const allTraits = useAppSelector(selectTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const unlockedSlotCount = useAppSelector(selectUnlockedSlotCount);
  const equippedTraits = useAppSelector(selectEquippedTraitObjects);
  const currentEssence = useAppSelector(selectCurrentEssence);

  const [acquisitionDialogOpen, setAcquisitionDialogOpen] = useState(false);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [acquireError, setAcquireError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  const playerAcquiredTraitIds = useMemo(() =>
    equippedTraits.map((trait) => trait.id),
    [equippedTraits]
  );

  const availableTraitsDetails = useMemo(() => {
    if (!currentNPC?.availableTraits || !allTraits) {
      return [];
    }
    return currentNPC.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait: Trait | undefined) => trait !== undefined) as Trait[];
  }, [currentNPC?.availableTraits, allTraits]);

  const sharedTraitIds = currentNPC?.sharedTraitSlots?.map((slot: NPCSharedTraitSlot) => slot.traitId).filter(Boolean) || [];
  const shareableTraits = equippedTraits.filter((trait: Trait) =>
    !sharedTraitIds.includes(trait.id) &&
    !permanentTraitIds.includes(trait.id)
  );

  const canPlayerAcquireTrait = useCallback((trait: Trait): boolean => {
    if (playerAcquiredTraitIds.includes(trait.id)) return false;
    const essenceCost = trait.essenceCost || 0;
    if (currentEssence < essenceCost) return false;
    return true;
  }, [playerAcquiredTraitIds, currentEssence]);

  const handleAcquireTrait = useCallback(async (traitId: string) => {
    if (!currentNPC) return;
    setAcquireError(null);
    try {
      // TODO: Implement acquisition logic when TraitsThunks is available
      console.log('Acquire trait functionality pending TraitsThunks implementation:', traitId);
      // await dispatch(acquireTraitWithEssenceThunk(traitId)).unwrap();
      // Optionally, update NPC relationship or perform other actions
    } catch (error: any) {
      console.error('Failed to acquire trait:', error);
      setAcquireError(error?.message || (typeof error === 'string' ? error : 'Failed to acquire trait.'));
    }
  }, [dispatch]);

  const handleShareTrait = useCallback(async (traitId: string, targetSlotIndex?: number) => {
    if (!currentNPC) return;
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
        const emptyUnlockedSlot = currentNPC.sharedTraitSlots?.find(slot => slot.isUnlocked && !slot.traitId);
        if (emptyUnlockedSlot) {
          actualSlotIndex = emptyUnlockedSlot.index;
        } else {
          setShareError(`No available unlocked trait slots on ${currentNPC.name}. Improve relationship or wait for slots to open.`);
          return;
        }
      }
      await dispatch(shareTraitWithNPCThunk({ npcId: currentNPC.id, traitId, slotIndex: actualSlotIndex })).unwrap();
    } catch (error: any) {
      console.error('Failed to share/unshare trait:', error);
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Failed to share/unshare trait.');
      setShareError(errorMessage);
    }
  }, [dispatch, currentNPC]);

  const getLearnButtonTooltip = useCallback((trait: Trait, isAcquiredByPlayer: boolean): string => {
    if (isAcquiredByPlayer) return "Already acquired";
    if (currentEssence < (trait.essenceCost || 0)) {
      return `Requires ${trait.essenceCost || 0} Essence (you have ${currentEssence})`;
    }
    return "Learn this trait";
  }, [currentEssence]);

  const handleOpenAcquisitionDialog = useCallback((trait: Trait) => {
    setSelectedTraitId(trait.id);
    setAcquisitionDialogOpen(true);
  }, []);

  const handleCloseAcquisitionDialog = useCallback(() => {
    setSelectedTraitId(null);
    setAcquisitionDialogOpen(false);
  }, []);

  const handleConfirmAcquisition = useCallback(async () => {
    if (selectedTraitId) {
      await handleAcquireTrait(selectedTraitId);
      handleCloseAcquisitionDialog();
    }
  }, [selectedTraitId, handleAcquireTrait, handleCloseAcquisitionDialog]);

  const handleDebugGrantAndEquipTrait = () => {
    setDebugMessage(null);
    if (!allTraits[TEST_TRAIT_ID_DEBUG]) {
      setDebugMessage(`Error: Test trait "${TEST_TRAIT_ID_DEBUG}" not found in traits data. Please define it in traits.json.`);
      console.error(`Error: Test trait "${TEST_TRAIT_ID_DEBUG}" not found in traits data.`);
      return;
    }

    dispatch(acquireTraitAction(TEST_TRAIT_ID_DEBUG));

    const emptyPlayerSlotIndex = playerTraitSlots.findIndex((slot: TraitSlot) => !slot.traitId);

    if (emptyPlayerSlotIndex !== -1) {
      // TODO: Implement trait equipping when the correct action is available
      // For now, show a placeholder message
      console.log(`Equipping innate trait ${TEST_TRAIT_ID_DEBUG} to player - functionality pending`);

      setDebugMessage(`Granted and equipped "${allTraits[TEST_TRAIT_ID_DEBUG]?.name || TEST_TRAIT_ID_DEBUG}" to player slot ${emptyPlayerSlotIndex + 1}.`);
    } else {
      setDebugMessage('Granted trait, but no empty player slot to equip it.');
      console.warn('DEBUG: Granted trait, but no empty player slot to equip it.');
    }
  };

  if (!currentNPC) {
    return <Alert severity="warning">NPC data not available.</Alert>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MagicIcon color="primary" />
        <Typography variant="h6">Trait Interaction with {currentNPC.name}</Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          {acquireError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAcquireError(null)}>{acquireError}</Alert>}
          <Typography variant="h6" sx={{ mb: 2 }}>Traits Available from {currentNPC.name} for Resonance</Typography>
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
                          <Button variant={isAcquiredByPlayer ? "outlined" : "contained"} size="small" startIcon={isAcquiredByPlayer ? <CheckCircleIcon /> : <GetAppIcon />} onClick={() => handleOpenAcquisitionDialog(trait)} disabled={isAcquiredByPlayer || !canAcquire} color={isAcquiredByPlayer ? "success" : "primary"}>
                            {isAcquiredByPlayer ? 'Acquired' : 'Resonate'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : ( <Typography variant="body2" color="text.secondary">{currentNPC.name} has no traits available for Resonance at this time.</Typography> )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          {shareError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShareError(null)}>{shareError}</Alert>}
          <Typography variant="h6" sx={{ mb: 2 }}>Shared Trait Slots</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Share your acquired traits with {currentNPC.name} to strengthen your connection.</Typography>
          {currentNPC.sharedTraitSlots && currentNPC.sharedTraitSlots.length > 0 ? (
            <Grid container spacing={2}>
              {currentNPC.sharedTraitSlots.map((slot: NPCSharedTraitSlot) => (
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
                const canShareToAnySlot = currentNPC.sharedTraitSlots?.some(s => s.isUnlocked && !s.traitId) ?? false;
                return (
                  <Grid item key={trait.id}>
                    <Button variant="outlined" size="small" startIcon={<ShareIcon />} onClick={() => handleShareTrait(trait.id)} disabled={!canShareToAnySlot}>
                      {trait.name}
                    </Button>
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
          <Button
            variant="outlined"
            size="small"
            color="warning"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleDebugGrantAndEquipTrait}
          >
            Grant & Equip Test Trait
          </Button>
          <Typography variant="caption" display="block" sx={{mt:1}}>
            Note: Ensure a trait with ID "{TEST_TRAIT_ID_DEBUG}" exists in traits.json.
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={acquisitionDialogOpen} onClose={handleCloseAcquisitionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Resonate Trait</DialogTitle>
        <DialogContent>
          {selectedTraitId && allTraits[selectedTraitId] && (
            <Box>
              <Typography variant="body1" paragraph>Are you sure you want to resonate with "{allTraits[selectedTraitId].name}" from {currentNPC.name}?</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>{allTraits[selectedTraitId].description}</Typography>
              {allTraits[selectedTraitId].essenceCost && allTraits[selectedTraitId].essenceCost > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This will cost {allTraits[selectedTraitId].essenceCost} Essence. You currently have {currentEssence} Essence.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcquisitionDialog}>Cancel</Button>
          <Button onClick={handleConfirmAcquisition} variant="contained" disabled={!selectedTraitId || !canPlayerAcquireTrait(allTraits[selectedTraitId])}>
            Resonate Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(NPCTraitsTab);
