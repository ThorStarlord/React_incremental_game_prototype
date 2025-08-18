import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { Copy, CopyTraitSlot } from '../../state/CopyTypes';
import { shareTraitWithCopyThunk, unshareTraitFromCopyThunk } from '../../state/CopyThunks';
import { selectPlayer } from '../../../Player/state/PlayerSelectors';
import { selectAllTraits, selectTraitById } from '../../../Traits/state/TraitsSelectors';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import { Lock, AddCircleOutline, Cancel } from '@mui/icons-material';
import { Trait } from '../../../Traits/state/TraitsTypes';
import { RootState } from '../../../../app/store';
import { selectCopyById } from '../../state/CopySelectors';

interface CopyTraitSlotsProps {
  copyId: string;
}

const TraitSelectionDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  eligibleTraits: Trait[];
  onShare: (traitId: string) => void;
}> = ({ open, onClose, eligibleTraits, onShare }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Share an Equipped Trait</DialogTitle>
    <DialogContent>
      <List>
        {eligibleTraits.length > 0 ? (
          eligibleTraits.map(trait => (
            <ListItem
              key={trait.id}
              secondaryAction={
                <Button variant="contained" size="small" onClick={() => onShare(trait.id)}>
                  Share
                </Button>
              }
            >
              <ListItemText primary={trait.name} secondary={trait.description} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No eligible traits available." secondary="Shareable traits must be equipped, not permanent, and not already on this Copy." />
          </ListItem>
        )}
      </List>
    </DialogContent>
  </Dialog>
);

const TraitSlotCard: React.FC<{
    slot: CopyTraitSlot;
    onShare: () => void;
    onUnshare: () => void;
}> = ({ slot, onShare, onUnshare }) => {
    const trait = useAppSelector((state: RootState) => slot.traitId ? selectTraitById(state, slot.traitId) : null);

    const renderContent = () => {
        if (slot.isLocked) {
            const requirement = slot.unlockRequirement;
            const requirementText = requirement ? `Requires ${requirement.type} ${requirement.value}` : 'Locked';
            return (
                <Tooltip title={requirementText}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Lock color="disabled" sx={{ fontSize: 40 }} />
                        <Typography variant="caption" display="block" color="text.secondary">Locked</Typography>
                    </Box>
                </Tooltip>
            );
        }

        if (trait) {
            return (
                <Box sx={{ textAlign: 'center', position: 'relative', width: '100%' }}>
                    <Tooltip title={trait.description}>
                        <Typography variant="body2" fontWeight="bold">{trait.name}</Typography>
                    </Tooltip>
                    <IconButton size="small" onClick={onUnshare} sx={{ position: 'absolute', top: -12, right: -12, zIndex: 1, backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'grey.200'} }}>
                        <Cancel fontSize="small" color="error" />
                    </IconButton>
                </Box>
            );
        }

        return (
             <Tooltip title="Share a Trait">
                <Box sx={{ textAlign: 'center', cursor: 'pointer', width: '100%' }} onClick={onShare}>
                    <AddCircleOutline color="primary" sx={{ fontSize: 40 }}/>
                    <Typography variant="caption" display="block" color="text.secondary">Share</Typography>
                </Box>
            </Tooltip>
        );
    };

    return (
        <Paper variant="outlined" sx={{ p: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70px', position: 'relative' }}>
            {renderContent()}
        </Paper>
    );
};


export const CopyTraitSlots: React.FC<CopyTraitSlotsProps> = ({ copyId }) => {
  const dispatch = useAppDispatch();
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const copy = useAppSelector((state: RootState) => selectCopyById(state, copyId));
  const player = useAppSelector(selectPlayer);
  const allTraits = useAppSelector(selectAllTraits);

  if (!copy) return null;

  const handleOpenShareDialog = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    setSelectedSlotIndex(null);
  };

  const handleShareTrait = (traitId: string) => {
    if (selectedSlotIndex !== null) {
      dispatch(shareTraitWithCopyThunk({ copyId: copy.id, slotIndex: selectedSlotIndex, traitId }));
    }
    handleCloseShareDialog();
  };

  const handleUnshareTrait = (slotIndex: number) => {
    dispatch(unshareTraitFromCopyThunk({ copyId: copy.id, slotIndex }));
  };

  const eligibleTraitsForSharing = useMemo(() => {
    const equippedPlayerTraitIds = player.traitSlots
      .map(slot => slot.traitId)
      .filter((id): id is string => !!id);

    const permanentPlayerTraits = new Set(player.permanentTraits);
    const copyTraits = new Set([
      ...(copy.inheritedTraits || []),
      ...(copy.traitSlots?.map(slot => slot.traitId).filter(Boolean) as string[] || [])
    ]);

    return equippedPlayerTraitIds
      .filter(traitId => !permanentPlayerTraits.has(traitId) && !copyTraits.has(traitId))
      .map(traitId => allTraits[traitId])
      .filter((t): t is Trait => !!t);
  }, [player.traitSlots, player.permanentTraits, copy.inheritedTraits, copy.traitSlots, allTraits]);

  const inheritedTraitObjects = useMemo(() => {
      return (copy.inheritedTraits || []).map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [copy.inheritedTraits, allTraits]);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" gutterBottom>Inherited Traits</Typography>
      {inheritedTraitObjects.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {inheritedTraitObjects.map(trait => (
                <Tooltip key={trait.id} title={trait.description}>
                    <Chip label={trait.name} size="small" />
                </Tooltip>
            ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>None</Typography>
      )}

      <Typography variant="subtitle2" gutterBottom>Shared Trait Slots</Typography>
      <Grid container spacing={1}>
        {(copy.traitSlots || []).map(slot => (
          <Grid item xs={6} sm={4} key={slot.id}>
             <TraitSlotCard
                slot={slot}
                onShare={() => handleOpenShareDialog(slot.slotIndex)}
                onUnshare={() => handleUnshareTrait(slot.slotIndex)}
             />
          </Grid>
        ))}
      </Grid>

      <TraitSelectionDialog
        open={isShareDialogOpen}
        onClose={handleCloseShareDialog}
        eligibleTraits={eligibleTraitsForSharing}
        onShare={handleShareTrait}
      />
    </Box>
  );
};

export default CopyTraitSlots;
