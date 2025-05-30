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
    nextResonanceLevel,
    nextResonanceLevelThreshold,
    progressPercentage,
    essenceNeeded,
    isMaxResonanceLevel,
  } = resonanceProgress;

  const currentUnlockedSlots = traitSlotsArray.filter(slot => slot.isUnlocked).length;
  const isMaxSlots = currentUnlockedSlots >= maxTraitSlots; // Check against actual max slots from state

  const displayProgress: number = isMaxResonanceLevel ? 100 : progressPercentage;

  return (
    <Tooltip
      title={isMaxResonanceLevel
        ? "Maximum Resonance Level reached!"
        : `Resonance Level ${currentResonanceLevel} (Next at ${nextResonanceLevelThreshold?.essenceRequired.toLocaleString() || 'N/A'} Essence)`
      }
      arrow
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Resonance Level: {currentResonanceLevel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isMaxResonanceLevel
              ? "Max slots reached"
              : `Next Slot at RL ${nextResonanceLevel} (${currentUnlockedSlots}/${maxTraitSlots} slots)`}
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
              bgcolor: isMaxResonanceLevel ? 'success.main' : 'primary.main',
            }
          }}
        />

        {!isMaxResonanceLevel && nextResonanceLevelThreshold && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Need {essenceNeeded.toLocaleString()} more Essence for Resonance Level {nextResonanceLevel}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default TraitSlotProgressIndicator;
