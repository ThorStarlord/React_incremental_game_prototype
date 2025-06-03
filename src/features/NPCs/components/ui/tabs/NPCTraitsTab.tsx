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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Psychology,
  Share,
  School,
  CheckCircle,
  Remove,
  GetApp as GetAppIcon,
  Extension as TraitIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks'; // Corrected path
import { selectNPCById } from '../../../state/NPCSelectors'; // Corrected path
import { updateNpcRelationship } from '../../../state/NPCSlice'; // Corrected path
import { shareTraitWithNPCThunk } from '../../../state/NPCThunks'; // Corrected path
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks'; // Corrected path
import { selectTraits, selectPlayerTrulyPossessedTraitObjects } from '../../../../Traits/state/TraitsSelectors'; // Corrected path
// Removed selectAcquiredTraitObjects, selectPermanentTraitObjects as they will be replaced
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors'; // Corrected path
import { selectIsInProximityToNPC } from '../../../../Meta/state/MetaSlice'; // Corrected path
import { selectPermanentTraits as selectPlayerSlicePermanentTraitIds } from '../../../../Player/state/PlayerSelectors'; // Import player's permanent trait IDs
import { NPC } from '../../../state/NPCTypes'; // Corrected path
import { Trait } from '../../../../Traits/state/TraitsTypes'; // Corrected path

interface NPCTraitsTabProps {
  npcId: string;
  onInteraction: (data: { traitId: string; actionType: 'acquire' | 'share' | 'unshare' }) => void;
}

interface TraitAcquisitionDialog {
  open: boolean;
  trait: Trait | null;
  traitId: string | null;
}

export const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const npc = useAppSelector(state => selectNPCById(state, npcId)) as NPC;
  const allTraits = useAppSelector(selectTraits);
  // Use the new selector for traits player truly possesses according to PlayerSlice
  const playerPossessedTraits = useAppSelector(selectPlayerTrulyPossessedTraitObjects); 
  // Get permanent trait IDs directly from PlayerSlice for consistent filtering
  const playerPermanentTraitIdsFromPlayerSlice = useAppSelector(selectPlayerSlicePermanentTraitIds);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const isInProximityToNPC = useAppSelector(selectIsInProximityToNPC);
  
  // Local state
  const [acquisitionDialog, setAcquisitionDialog] = useState<TraitAcquisitionDialog>({
    open: false,
    trait: null,
    traitId: null,
  });
  const [shareError, setShareError] = useState<string | null>(null);
  const [acquireError, setAcquireError] = useState<string | null>(null);

  // Get player's acquired trait IDs for easy checking (from playerPossessedTraits)
  const playerAcquiredTraitIds = useMemo(() => 
    playerPossessedTraits.map((trait: Trait) => trait.id),
    [playerPossessedTraits]
  );

  // playerPermanentTraitIds will now directly use playerPermanentTraitIdsFromPlayerSlice (which is already an array of IDs)

  // Get NPC's available traits with full details
  const availableTraitsDetails = useMemo(() => {
    if (!npc.availableTraits || !allTraits) {
      return [];
    }
    return npc.availableTraits
      .map((traitId: string) => allTraits[traitId])
      .filter((trait: Trait | undefined) => trait !== undefined) as Trait[];
  }, [npc.availableTraits, allTraits]);
  
  // Get traits player can share
  const sharedTraitIds = npc.sharedTraitSlots?.map((slot: { traitId?: string | null }) => slot.traitId).filter(Boolean) || [];
  const shareableTraits = playerPossessedTraits.filter((trait: Trait) => 
    !sharedTraitIds.includes(trait.id) && 
    !playerPermanentTraitIdsFromPlayerSlice.includes(trait.id) // Use permanent IDs from PlayerSlice
  );

  // Check if player can acquire a trait
  const canPlayerAcquireTrait = useCallback((trait: Trait): boolean => {
    // Already acquired
    if (playerAcquiredTraitIds.includes(trait.id)) return false;
    
    // Not in proximity to NPC
    if (!isInProximityToNPC) return false;
    
    // Insufficient essence
    const essenceCost = trait.essenceCost || 0;
    if (currentEssence < essenceCost) return false;
    
    return true;
  }, [playerAcquiredTraitIds, isInProximityToNPC, currentEssence]);

  // Handle trait acquisition
  const handleAcquireTrait = useCallback(async (traitId: string) => {
    setAcquireError(null); // Clear previous error
    try {
      await dispatch(acquireTraitWithEssenceThunk(traitId)).unwrap();
      
      // Add relationship bonus for learning
      dispatch(updateNpcRelationship({
        npcId,
        change: 5,
        reason: `Resonated trait from ${npc.name}`,
      }));
    } catch (error: any) {
      console.error('Failed to acquire trait:', error);
      setAcquireError(error?.message || (typeof error === 'string' ? error : 'Failed to acquire trait.'));
    }
  }, [dispatch, npcId, npc.name]);

  // Handle trait sharing
  const handleShareTrait = useCallback(async (traitId: string, targetSlotIndex?: number) => {
    setShareError(null); // Clear previous error
    try {
      let actualSlotIndex: number;

      if (traitId === '') { // This is an unshare operation
        if (targetSlotIndex === undefined) {
          console.error('Cannot unshare: targetSlotIndex is undefined.');
          return;
        }
        actualSlotIndex = targetSlotIndex;
      } else { // This is a share operation
        // Find the first empty slot
        const emptySlot = npc.sharedTraitSlots?.find(slot => slot.traitId === null);
        if (emptySlot) {
          actualSlotIndex = emptySlot.index;
        } else {
          // If no empty slots, use the next available index (append a new slot)
          actualSlotIndex = npc.sharedTraitSlots?.length || 0;
        }
      }

      await dispatch(shareTraitWithNPCThunk({
        npcId,
        traitId,
        slotIndex: actualSlotIndex,
      })).unwrap();
    } catch (error: any) {
      console.error('Failed to share trait:', error);
      // If error is an object with a message property, use that, otherwise use the error itself if it's a string.
      const errorMessage = error?.message || (typeof error === 'string' ? error : 'Failed to share trait.');
      setShareError(errorMessage);
    }
  }, [dispatch, npcId, npc.sharedTraitSlots]);

  // Get button tooltip for trait acquisition
  const getLearnButtonTooltip = useCallback((trait: Trait, canAcquireNow: boolean, isAcquiredByPlayer: boolean): string => {
    if (isAcquiredByPlayer) return "Already acquired";
    if (!isInProximityToNPC) return "You must be in proximity to this NPC";
    if (currentEssence < (trait.essenceCost || 0)) {
      return `Requires ${trait.essenceCost || 0} Essence (you have ${currentEssence})`;
    }
    return "Learn this trait";
  }, [isInProximityToNPC, currentEssence]);

  // Handle acquisition dialog
  const handleOpenAcquisitionDialog = useCallback((trait: Trait) => {
    setAcquisitionDialog({
      open: true,
      trait,
      traitId: trait.id,
    });
  }, []);

  const handleCloseAcquisitionDialog = useCallback(() => {
    setAcquisitionDialog({
      open: false,
      trait: null,
      traitId: null,
    });
  }, []);

  const handleConfirmAcquisition = useCallback(async () => {
    if (acquisitionDialog.traitId) {
      await handleAcquireTrait(acquisitionDialog.traitId);
      handleCloseAcquisitionDialog();
    }
  }, [acquisitionDialog.traitId, handleAcquireTrait, handleCloseAcquisitionDialog]);

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TraitIcon color="primary" />
        <Typography variant="h6">Trait Interaction with {npc.name}</Typography>
      </Box>

      {/* Proximity Warning */}
      {!isInProximityToNPC && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must be in proximity to this NPC to acquire or share traits effectively.
        </Alert>
      )}

      {/* NPC's Available Traits for Resonance */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          {acquireError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAcquireError(null)}>
              {acquireError}
            </Alert>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Traits Available from {npc.name} for Resonance
          </Typography>
          
          {availableTraitsDetails.length > 0 ? (
            <Grid container spacing={2}>
              {availableTraitsDetails.map((trait: Trait) => {
                const isAcquiredByPlayer = playerAcquiredTraitIds.includes(trait.id);
                const canAcquireNow = canPlayerAcquireTrait(trait);
                const essenceCost = trait.essenceCost || 0;

                return (
                  <Grid item xs={12} md={6} key={trait.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {trait.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {trait.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                              <Chip size="small" label={trait.category} variant="outlined" />
                              <Chip size="small" label={trait.rarity} color="primary" variant="outlined" />
                              {essenceCost > 0 && (
                                <Chip
                                  size="small"
                                  label={`${essenceCost} Essence`}
                                  color={currentEssence >= essenceCost ? 'success' : 'error'}
                                />
                              )}
                            </Box>
                          </Box>
                          
                          <Tooltip title={getLearnButtonTooltip(trait, canAcquireNow, isAcquiredByPlayer)}>
                            <span>
                              <Button
                                variant={isAcquiredByPlayer ? "outlined" : "contained"}
                                size="small"
                                startIcon={isAcquiredByPlayer ? <CheckCircle /> : <GetAppIcon />}
                                onClick={() => handleOpenAcquisitionDialog(trait)}
                                disabled={isAcquiredByPlayer || !canAcquireNow}
                                color={isAcquiredByPlayer ? "success" : "primary"}
                              >
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
          ) : (
            <Typography variant="body2" color="text.secondary">
              {npc.name} has no traits available for Resonance at this time.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Shared Trait Slots */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          {shareError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShareError(null)}>
              {shareError}
            </Alert>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shared Trait Slots
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share your acquired traits with {npc.name} to strengthen your connection.
          </Typography>
          
          {npc.sharedTraitSlots && npc.sharedTraitSlots.length > 0 ? (
            <Grid container spacing={2}>
              {npc.sharedTraitSlots.map((slot: { id: string; index: number; traitId?: string | null }) => (
                <Grid item xs={12} md={6} key={slot.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Slot {slot.index + 1}
                      </Typography>
                      {slot.traitId ? (
                        <Box>
                          <Typography variant="body2">
                            {allTraits[slot.traitId]?.name || slot.traitId}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleShareTrait('', slot.index)} // Pass slot.index for unsharing
                            sx={{ mt: 1 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Empty slot
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No shared trait slots available. Improve your relationship to unlock trait sharing.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Available Traits to Share */}
      {shareableTraits.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Traits Available to Share
            </Typography>
            
            <Grid container spacing={1}>
              {shareableTraits.map((trait: Trait) => {
                if (!trait) return null;

                return (
                  <Grid item key={trait.id}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Share />}
                      onClick={() => handleShareTrait(trait.id)}
                    >
                      {trait.name}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Trait Acquisition Confirmation Dialog */}
      <Dialog
        open={acquisitionDialog.open}
        onClose={handleCloseAcquisitionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Resonate Trait: {acquisitionDialog.trait?.name}
        </DialogTitle>
        
        <DialogContent>
          {acquisitionDialog.trait && (
            <Box>
              <Typography variant="body1" paragraph>
                Are you sure you want to resonate with "{acquisitionDialog.trait.name}" from {npc.name}?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {acquisitionDialog.trait.description}
              </Typography>
              
              {acquisitionDialog.trait.essenceCost && acquisitionDialog.trait.essenceCost > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This will cost {acquisitionDialog.trait.essenceCost} Essence.
                  You currently have {currentEssence} Essence.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseAcquisitionDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAcquisition}
            variant="contained"
            disabled={!acquisitionDialog.trait || !canPlayerAcquireTrait(acquisitionDialog.trait)}
          >
            Resonate Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(NPCTraitsTab);
