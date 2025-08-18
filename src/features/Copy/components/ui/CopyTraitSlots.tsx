import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { Box, Button, Chip, Grid, Typography, Tooltip } from '@mui/material';
import { selectCopyById, selectCopyTraitSlots } from '../../state/CopySelectors';
import { shareTraitWithCopyThunk, unshareTraitFromCopyThunk } from '../../state/CopyThunks';
import { RootState } from '../../../../app/store';

interface CopyTraitSlotsProps {
  copyId: string;
}

/**
 * Minimal Copy Trait Slots UI: shows locked/unlocked slot states and allows sharing/unsharing
 * with the player's currently equipped, non-permanent traits.
 */
export const CopyTraitSlots: React.FC<CopyTraitSlotsProps> = ({ copyId }) => {
  const dispatch = useAppDispatch();
  const copy = useAppSelector((s: RootState) => selectCopyById(s, copyId));
  const slots = useAppSelector((s: RootState) => selectCopyTraitSlots(s, copyId));
  const playerEquipped = useAppSelector((s: RootState) => s.player.traitSlots || []);
  const permanent = useAppSelector((s: RootState) => s.player.permanentTraits || []);

  if (!copy) return null;

  const shareableTraitIds = playerEquipped
    .map(ts => ts.traitId)
    .filter((id): id is string => !!id && !permanent.includes(id));

  const onShare = (slotIndex: number, traitId: string) => {
    dispatch(shareTraitWithCopyThunk({ copyId, slotIndex, traitId }));
  };

  const onUnshare = (slotIndex: number) => {
    dispatch(unshareTraitFromCopyThunk({ copyId, slotIndex }));
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle1" gutterBottom>Traits</Typography>
      <Grid container spacing={1}>
        {slots.map((slot, idx) => {
          const label = slot.traitId ? `Slot ${idx + 1}` : `Empty Slot ${idx + 1}`;
          const locked = slot.isLocked;
          const hasTrait = !!slot.traitId;
          return (
            <Grid item xs={12} sm={6} md={4} key={slot.id ?? idx}>
              <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{label}</Typography>
                  {locked && (
                    <Tooltip title={`Locked: ${slot.unlockRequirement?.type} >= ${slot.unlockRequirement?.value}`}>
                      <Chip size="small" label="Locked" color="default" />
                    </Tooltip>
                  )}
                </Box>

                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {hasTrait ? (
                    <>
                      <Chip color="primary" label={slot.traitId} />
                      <Button size="small" variant="outlined" onClick={() => onUnshare(slot.slotIndex ?? idx)}>
                        Unshare
                      </Button>
                    </>
                  ) : locked ? (
                    <Typography variant="caption" color="text.secondary">Unlock to use</Typography>
                  ) : (
                    <>
                      {shareableTraitIds.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">No shareable traits equipped</Typography>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {shareableTraitIds.map(tid => (
                            <Button key={tid} size="small" variant="outlined" onClick={() => onShare(slot.slotIndex ?? idx, tid)}>
                              Share {tid}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CopyTraitSlots;
