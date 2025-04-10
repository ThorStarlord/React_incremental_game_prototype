import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import {
  selectPlayerTotalEssenceEarned,
  selectPlayerTraitSlots
} from '../../../Player/state/PlayerSelectors';

/**
 * TraitSlotProgressIndicator Component
 *
 * Displays a progress bar indicating progress toward unlocking the next trait slot.
 * Trait slots are unlocked by earning essence, with each slot costing 1000 essence.
 *
 * @returns {JSX.Element} The rendered component
 */
const TraitSlotProgressIndicator: React.FC = () => {
  // Use Redux selectors to get player data
  const totalEssenceEarned = useSelector(selectPlayerTotalEssenceEarned);
  const traitSlots = useSelector(selectPlayerTraitSlots);

  // Calculate the next essence threshold for a slot unlock
  const currentUnlocks: number = Math.floor(totalEssenceEarned / 1000);
  const nextThreshold: number = (currentUnlocks + 1) * 1000;

  // Calculate progress percentage toward next slot
  const progress: number = ((totalEssenceEarned % 1000) / 1000) * 100;

  // If already at max slots, show 100% progress
  const MAX_TRAIT_SLOTS: number = 8;
  const DEFAULT_TRAIT_SLOTS: number = 1;
  const currentTraitSlots = traitSlots || DEFAULT_TRAIT_SLOTS;
  const isMaxSlots: boolean = currentTraitSlots >= MAX_TRAIT_SLOTS;
  const displayProgress: number = isMaxSlots ? 100 : progress;

  return (
    <Tooltip
      title={isMaxSlots
        ? "Maximum trait slots reached!"
        : `${totalEssenceEarned % 1000}/${1000} essence toward next slot`
      }
      arrow
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Next Trait Slot
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isMaxSlots
              ? "Max slots reached"
              : `${Math.floor(progress)}% (${currentTraitSlots}/${MAX_TRAIT_SLOTS} slots)`}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={displayProgress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: isMaxSlots ? 'success.main' : 'primary.main',
            }
          }}
        />

        {!isMaxSlots && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Need {nextThreshold - totalEssenceEarned} more essence
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default TraitSlotProgressIndicator;
