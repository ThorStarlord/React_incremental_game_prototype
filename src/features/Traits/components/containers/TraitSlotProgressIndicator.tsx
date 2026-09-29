import React, { useMemo } from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
// FIXED: Removed non-existent selector import. Kept selectTotalCollected.
import { selectTotalCollected } from '../../../Essence/state/EssenceSelectors';
// FIXED: Changed to the correct selector `selectPlayerTraitSlots` and added `selectResonanceLevel`.
import { selectPlayerTraitSlots, selectMaxTraitSlots, selectResonanceLevel } from '../../../Player/state/PlayerSelectors';

/**
 * TraitSlotProgressIndicator Component
 *
 * Displays progress toward unlocking the next Trait expression slot.
 */
const TraitSlotProgressIndicator: React.FC = () => {
  const totalEssenceCollected = useAppSelector(selectTotalCollected);
  const traitSlots = useAppSelector(selectPlayerTraitSlots);
  const maxTraitSlots = useAppSelector(selectMaxTraitSlots);
  const currentResonanceLevel = useAppSelector(selectResonanceLevel);

  // FIXED: All progress logic is now calculated inside the component using valid selectors.
  const progressData = useMemo(() => {
    const currentUnlockedSlots = traitSlots.filter(slot => !slot.isLocked).length;

    if (currentUnlockedSlots >= maxTraitSlots) {
      return {
        progressPercentage: 100,
        allSlotsUnlocked: true,
        nextSlotUnlockLevel: 'Max',
        essenceForNextSlot: 0,
        essenceNeeded: 0,
      };
    }

    const nextLockedSlot = traitSlots.find(slot => slot.isLocked);
    const nextSlotUnlockLevel = nextLockedSlot
      ? nextLockedSlot.slotIndex + 1
      : currentResonanceLevel;
    const essenceForNextSlot = nextSlotUnlockLevel * 100;
    const currentLevelFloor = Math.max(0, currentResonanceLevel * 100);
    const essenceInCurrentTier = Math.max(0, totalEssenceCollected - currentLevelFloor);
    const essenceNeededForNext = Math.max(1, essenceForNextSlot - currentLevelFloor);

    const progressPercentage = Math.min(
      100,
      (essenceInCurrentTier / essenceNeededForNext) * 100
    );

    return {
      progressPercentage,
      allSlotsUnlocked: false,
      nextSlotUnlockLevel,
      essenceForNextSlot,
      essenceNeeded: Math.max(0, essenceForNextSlot - totalEssenceCollected),
    };
  }, [totalEssenceCollected, traitSlots, maxTraitSlots, currentResonanceLevel]);
  
  const {
      progressPercentage,
      allSlotsUnlocked,
      nextSlotUnlockLevel,
      essenceNeeded,
  } = progressData;

  const currentUnlockedSlots = traitSlots.filter(slot => !slot.isLocked).length;

  return (
    <Tooltip
      title={allSlotsUnlocked
        ? "All Trait expression slots unlocked!"
        : `Resonance Level ${currentResonanceLevel} (Next slot at RL ${nextSlotUnlockLevel})`
      }
      arrow
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Resonance Level: {currentResonanceLevel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {allSlotsUnlocked
              ? "All Expression Slots Unlocked"
              : `Expression slots: ${currentUnlockedSlots}/${maxTraitSlots}`}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: allSlotsUnlocked ? 'success.main' : 'primary.main',
            }
          }}
        />

        {!allSlotsUnlocked && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Need {essenceNeeded.toLocaleString()} more Essence for next slot.
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default TraitSlotProgressIndicator;