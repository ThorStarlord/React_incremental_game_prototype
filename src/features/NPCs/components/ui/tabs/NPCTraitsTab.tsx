/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and acquisition tab for NPC interactions
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
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
  Tooltip,
  Paper,
  ListItemButton,
} from '@mui/material';
import {
  Share as ShareIcon,
  Lock as LockIcon,
  Add as AddIcon,
  AutoAwesome as ResonateIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
// Corrected: Import from the feature's public API
import {
  selectNPCById,
  shareTraitWithNPCThunk
} from '../../../';
import {
  selectPermanentTraits,
  selectEquippedTraits,
} from '../../../../Player/state/PlayerSelectors';
import { selectTraits, selectDiscoveredTraits } from '../../../../Traits/state/TraitsSelectors';
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { acquireTraitWithEssenceThunk } from '../../../../Traits/state/TraitThunks';
import { TRAIT_RESONANCE } from '../../../../../constants/gameConstants';
import type { Trait } from '../../../../Traits/state/TraitsTypes';
import TraitSlotItem from '../../../../Traits/components/ui/TraitSlotItem';
import LockedSlotCard from '../../../../Traits/components/ui/LockedSlotCard';

interface NPCTraitsTabProps {
  npcId: string;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const currentNPC = useAppSelector(state => selectNPCById(state, npcId));
  const allTraits = useAppSelector(selectTraits);
  // const playerDiscoveredTraitIds = useAppSelector(selectDiscoveredTraits); // not used in this tab
  const playerPermanentTraitIds = useAppSelector(selectPermanentTraits);
  const playerEquippedTraits = useAppSelector(selectEquippedTraits);
  const currentEssence = useAppSelector(selectCurrentEssence);

  const [resonateDialogOpen, setResonateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTraitForDialog, setSelectedTraitForDialog] = useState<Trait | null>(null);
  const [targetSlotForShare, setTargetSlotForShare] = useState<number | null>(null);

  // Memoize lists for performance
  const availableTraitsForResonance = useMemo(() => {
    if (!currentNPC?.availableTraits || !allTraits) return [];
    return currentNPC.availableTraits
      .map(traitId => allTraits[traitId])
      .filter((trait): trait is Trait => 
        !!trait && !playerPermanentTraitIds.includes(trait.id)
      );
  }, [currentNPC?.availableTraits, allTraits, playerPermanentTraitIds]);

  const shareablePlayerTraits = useMemo(() => {
    const npcSharedIds = currentNPC?.sharedTraitSlots?.map(s => s.traitId).filter(Boolean) || [];
    return playerEquippedTraits.filter(t => !npcSharedIds.includes(t.id));
  }, [playerEquippedTraits, currentNPC?.sharedTraitSlots]);

  // Handlers
  const handleOpenResonateDialog = useCallback((trait: Trait) => {
    setSelectedTraitForDialog(trait);
    setResonateDialogOpen(true);
  }, []);

  const handleConfirmResonance = useCallback(async () => {
    if (selectedTraitForDialog) {
      await dispatch(acquireTraitWithEssenceThunk({
        traitId: selectedTraitForDialog.id,
        essenceCost: selectedTraitForDialog.essenceCost || 0
      }));
    }
    setResonateDialogOpen(false);
    setSelectedTraitForDialog(null);
  }, [dispatch, selectedTraitForDialog]);
  
  const handleShareClick = useCallback((slotIndex: number) => {
    setTargetSlotForShare(slotIndex);
    setShareDialogOpen(true);
  }, []);

  const handleConfirmShare = useCallback(async (traitId: string) => {
    if (targetSlotForShare !== null) {
      await dispatch(shareTraitWithNPCThunk({ npcId, traitId, slotIndex: targetSlotForShare }));
    }
    setShareDialogOpen(false);
    setTargetSlotForShare(null);
  }, [dispatch, npcId, targetSlotForShare]);

  const handleUnshare = useCallback(async (slotIndex: number) => {
     await dispatch(shareTraitWithNPCThunk({ npcId, traitId: '', slotIndex }));
  }, [dispatch, npcId]);

  if (!currentNPC) {
    return <Alert severity="warning">NPC data not available.</Alert>;
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={4}>
        {/* Traits for Resonance Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ResonateIcon sx={{ mr: 1, color: 'primary.main' }} />
              Traits for Resonance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Spend Essence to permanently learn these traits from {currentNPC.name}. Permanent traits are always active and do not require a slot.
            </Typography>
            <List dense>
              {availableTraitsForResonance.length > 0 ? availableTraitsForResonance.map(trait => {
                const canAfford = (trait.essenceCost || 0) <= currentEssence;
                const requiresNpcDepth = !!((trait as any).sourceNpc || (trait as any).source);
                const depthOk = !requiresNpcDepth || (currentNPC.connectionDepth ?? 0) >= TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
                return (
                  <ListItem key={trait.id} divider secondaryAction={
                    <Tooltip title={!canAfford ? `Requires ${trait.essenceCost} Essence` : (!depthOk ? `Requires connection depth ${TRAIT_RESONANCE.MIN_CONNECTION_DEPTH}` : '')}>
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenResonateDialog(trait)}
                          disabled={!canAfford || !depthOk}
                        >
                          Resonate
                        </Button>
                      </span>
                    </Tooltip>
                  }>
                    <ListItemText 
                      primary={trait.name} 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">{`${trait.essenceCost || 0} Essence`}</Typography>
                          {requiresNpcDepth && !depthOk && (
                            <Chip
                              size="small"
                              icon={<LockIcon fontSize="small" />}
                              label={`Requires depth ${TRAIT_RESONANCE.MIN_CONNECTION_DEPTH} (you: ${currentNPC.connectionDepth ?? 0})`}
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              }) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>You have resonated with all of {currentNPC.name}'s available traits.</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Shared Trait Slots Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ShareIcon sx={{ mr: 1, color: 'secondary.main' }} />
              Shared Trait Slots
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your equipped traits to empower {currentNPC.name}. Unlock more slots by increasing your relationship.
            </Typography>
            <Grid container spacing={2}>
              {currentNPC.sharedTraitSlots?.map(slot => (
                <Grid item xs={12} sm={6} key={slot.id}>
                  {slot.isUnlocked ? (
                    slot.traitId ? (
                      <TraitSlotItem 
                        traitId={slot.traitId} 
                        trait={allTraits[slot.traitId]} 
                        onRemove={() => handleUnshare(slot.index)}
                        onMakePermanent={() => {}} // Not applicable here
                        essence={0} // Not applicable here
                      />
                    ) : (
                      <Button fullWidth sx={{ minHeight: 120, borderStyle: 'dashed' }} onClick={() => handleShareClick(slot.index)}>
                          <AddIcon /> Empty Slot
                      </Button>
                    )
                  ) : (
                    <LockedSlotCard slotIndex={slot.index} unlockRequirement={`Affinity: ${slot.unlockRequirement}`} />
                  )}
                </Grid>
              ))}
              {(!currentNPC.sharedTraitSlots || currentNPC.sharedTraitSlots.length === 0) && (
                 <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>{currentNPC.name} has no slots for shared traits.</Typography>
                 </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* DIALOGS */}
      <Dialog open={resonateDialogOpen} onClose={() => setResonateDialogOpen(false)}>
        <DialogTitle>Confirm Trait Resonance</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to spend {selectedTraitForDialog?.essenceCost || 0} Essence to permanently acquire the trait "{selectedTraitForDialog?.name}"?
          </Typography>
           <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
            This action cannot be undone. The trait will become a permanent part of your character.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResonateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmResonance} variant="contained" color="primary">Confirm & Resonate</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share a Trait</DialogTitle>
        <DialogContent>
           <Typography sx={{mb: 2}}>Select a trait to share with {currentNPC.name}.</Typography>
           <List>
            {shareablePlayerTraits.length > 0 ? shareablePlayerTraits.map(trait => (
              <ListItem key={trait.id} disablePadding>
                <ListItemButton onClick={() => handleConfirmShare(trait.id)}>
                   <ListItemText primary={trait.name} secondary={trait.description} />
                </ListItemButton>
              </ListItem>
            )) : (
              <Typography color="text.secondary">No available traits to share.</Typography>
            )}
           </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default React.memo(NPCTraitsTab);