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
 * Displays a progress bar indicating progress toward unlocking the next trait slot.
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

    // Example logic: A new slot unlocks every 2 resonance levels. RL is 1 per 100 essence.
    // This logic needs to be aligned with your game design. For now, a placeholder:
    const nextSlotUnlockLevel = (currentUnlockedSlots - 2 < 1) ? 1 : (currentUnlockedSlots - 2) + 1;
    const essenceForNextSlot = nextSlotUnlockLevel * 100;
    const previousSlotUnlockEssence = (nextSlotUnlockLevel - 1) * 100;
    
    const essenceInCurrentTier = totalEssenceCollected - previousSlotUnlockEssence;
    const essenceNeededForNext = essenceForNextSlot - previousSlotUnlockEssence;
    
    const progressPercentage = essenceNeededForNext > 0
      ? Math.min(100, (essenceInCurrentTier / essenceNeededForNext) * 100)
      : 100;

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
        ? "All trait slots unlocked!"
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
              ? "All Slots Unlocked"
              : `Slots: ${currentUnlockedSlots}/${maxTraitSlots}`}
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