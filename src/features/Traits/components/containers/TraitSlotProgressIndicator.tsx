import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectTotalCollected, selectResonanceLevelProgress } from '../../../Essence/state/EssenceSelectors';
import { selectTraitSlots, selectMaxTraitSlots } from '../../../Player/state/PlayerSelectors'; // Import from PlayerSelectors

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
  const totalEssenceEarned = useAppSelector(selectTotalCollected);
  const traitSlotsArray = useAppSelector(selectTraitSlots);
  const maxTraitSlots = useAppSelector(selectMaxTraitSlots);
  const resonanceProgress = useAppSelector(selectResonanceLevelProgress);

  const {
    currentResonanceLevel,
    nextResonanceLevelForSlotUnlock,
    essenceForNextSlotUnlock,
    progressPercentage,
    essenceNeededForNextSlotUnlock,
    allSlotsUnlocked,
  } = resonanceProgress;

  const currentUnlockedSlots = traitSlotsArray.filter(slot => slot.isUnlocked).length;
  // isMaxSlots can be simplified or directly use allSlotsUnlocked if it covers all conditions
  const isEffectivelyMaxSlots = allSlotsUnlocked || currentUnlockedSlots >= maxTraitSlots;


  const displayProgress: number = isEffectivelyMaxSlots ? 100 : progressPercentage;

  return (
    <Tooltip
      title={isEffectivelyMaxSlots
        ? "All trait slots unlocked or max resonance reached!"
        : `Resonance Level ${currentResonanceLevel} (Next slot at RL ${nextResonanceLevelForSlotUnlock} - requires ${essenceForNextSlotUnlock.toLocaleString()} total Essence)`
      }
      arrow
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Resonance Level: {currentResonanceLevel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isEffectivelyMaxSlots
              ? "All Slots Unlocked"
              : `Next Slot at RL ${nextResonanceLevelForSlotUnlock} (${currentUnlockedSlots}/${maxTraitSlots} slots)`}
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
              bgcolor: isEffectivelyMaxSlots ? 'success.main' : 'primary.main',
            }
          }}
        />

        {!isEffectivelyMaxSlots && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Need {essenceNeededForNextSlotUnlock.toLocaleString()} more Essence for next slot (RL {nextResonanceLevelForSlotUnlock})
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default TraitSlotProgressIndicator;
