import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { CopyTraitSlot } from '../../state/CopyTypes';
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
import { styled } from '@mui/material/styles';

// Styled components for maintainability and consistent theming
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 70,
  position: 'relative',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  // theme.spacing returns a string like '12px'; use string template for negative values
  top: `-${theme.spacing(1.5)}`,
  right: `-${theme.spacing(1.5)}`,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

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
                    <StyledIconButton size="small" onClick={onUnshare} aria-label="Unshare trait">
                        <Cancel fontSize="small" color="error" />
                    </StyledIconButton>
                </Box>
            );
        }

        return (
             <Tooltip title="Share a Trait">
                <Button
                  onClick={onShare}
                  variant="text"
                  aria-label="Share a trait"
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    py: 2,
                    minHeight: 70,
                  }}
                >
                  <AddCircleOutline color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="caption" display="block" color="text.secondary">Share</Typography>
                </Button>
            </Tooltip>
        );
    };

    return (
        <StyledPaper variant="outlined">
            {renderContent()}
        </StyledPaper>
    );
};


export const CopyTraitSlots: React.FC<CopyTraitSlotsProps> = ({ copyId }) => {
  const dispatch = useAppDispatch();
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const copy = useAppSelector((state: RootState) => selectCopyById(state, copyId));
  const player = useAppSelector(selectPlayer);
  const allTraits = useAppSelector(selectAllTraits);

  // Memoized derived data (placed before any early returns to satisfy hooks rule)
  const eligibleTraitsForSharing = useMemo(() => {
    if (!copy) return [] as Trait[];

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
  }, [player.traitSlots, player.permanentTraits, copy, allTraits]);

  const inheritedTraitObjects = useMemo(() => {
      if (!copy) return [] as Trait[];
      return (copy.inheritedTraits || []).map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [copy, allTraits]);

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

  if (!copy) return null;

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
