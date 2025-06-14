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
  Divider,
  Tooltip,
  Paper,
  IconButton,
  ListItemButton,
} from '@mui/material';
import {
  Share as ShareIcon,
  GetApp as GetAppIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  HelpOutline as HelpIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  School as LearnIcon, // New Icon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import {
  selectPermanentTraits,
  selectEquippedTraits,
  selectPlayerTraitSlots,
} from '../../../../Player/state/PlayerSelectors';
import { selectTraits, selectAcquiredTraits } from '../../../../Traits/state/TraitsSelectors';
import { selectCurrentEssence } from '../../../../Essence/state/EssenceSelectors';
import { shareTraitWithNPCThunk } from '../../../state/NPCThunks';
import { learnTraitThunk } from '../../../../Traits/state/TraitThunks'; // Using the new learn thunk
import type { Trait } from '../../../../Traits/state/TraitsTypes';
import TraitSlotItem from '../../../../Traits/components/ui/TraitSlotItem';
import EmptySlotCard from '../../../../Traits/components/ui/EmptySlotCard';
import LockedSlotCard from '../../../../Traits/components/ui/LockedSlotCard';

interface NPCTraitsTabProps {
  npcId: string;
}

const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const currentNPC = useAppSelector(state => selectNPCById(state, npcId));
  const allTraits = useAppSelector(selectTraits);
  const playerAcquiredTraitIds = useAppSelector(selectAcquiredTraits);
  const playerPermanentTraitIds = useAppSelector(selectPermanentTraits);
  const playerEquippedTraits = useAppSelector(selectEquippedTraits);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const playerSlots = useAppSelector(selectPlayerTraitSlots);

  const [learnDialogOpen, setLearnDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTraitForDialog, setSelectedTraitForDialog] = useState<Trait | null>(null);
  const [targetSlotForShare, setTargetSlotForShare] = useState<number | null>(null);

  // Memoize lists for performance
  const availableTraitsForLearning = useMemo(() => {
    if (!currentNPC?.availableTraits || !allTraits) return [];
    return currentNPC.availableTraits
      .map(traitId => allTraits[traitId])
      .filter((trait): trait is Trait => !!trait && !playerAcquiredTraitIds.includes(trait.id));
  }, [currentNPC?.availableTraits, allTraits, playerAcquiredTraitIds]);

  const shareablePlayerTraits = useMemo(() => {
    const npcSharedIds = currentNPC?.sharedTraitSlots?.map(s => s.traitId).filter(Boolean) || [];
    return playerEquippedTraits.filter(t => !npcSharedIds.includes(t.id));
  }, [playerEquippedTraits, currentNPC?.sharedTraitSlots]);

  // Handlers
  const handleOpenLearnDialog = useCallback((trait: Trait) => {
    setSelectedTraitForDialog(trait);
    setLearnDialogOpen(true);
  }, []);

  const handleConfirmLearning = useCallback(async () => {
    if (selectedTraitForDialog) {
      await dispatch(learnTraitThunk({
        traitId: selectedTraitForDialog.id,
        essenceCost: selectedTraitForDialog.essenceCost || 0
      }));
    }
    setLearnDialogOpen(false);
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
        {/* Traits for Learning Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LearnIcon sx={{ mr: 1, color: 'primary.main' }} />
              Learnable Traits
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Spend Essence to learn these traits from {currentNPC.name}. Learned traits can be equipped in your active slots.
            </Typography>
            <List dense>
              {availableTraitsForLearning.length > 0 ? availableTraitsForLearning.map(trait => {
                const canAfford = (trait.essenceCost || 0) <= currentEssence;
                return (
                  <ListItem key={trait.id} divider secondaryAction={
                    <Tooltip title={!canAfford ? `Requires ${trait.essenceCost} Essence` : ''}>
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenLearnDialog(trait)}
                          disabled={!canAfford}
                        >
                          Learn
                        </Button>
                      </span>
                    </Tooltip>
                  }>
                    <ListItemText primary={trait.name} secondary={`${trait.essenceCost || 0} Essence`} />
                  </ListItem>
                );
              }) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No new traits available to learn from {currentNPC.name}.</Typography>
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
      <Dialog open={learnDialogOpen} onClose={() => setLearnDialogOpen(false)}>
        <DialogTitle>Confirm Learning Trait</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to spend {selectedTraitForDialog?.essenceCost || 0} Essence to learn the trait "{selectedTraitForDialog?.name}"?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
            This will add the trait to your pool of available traits to equip.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLearnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmLearning} variant="contained" color="primary">Confirm</Button>
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