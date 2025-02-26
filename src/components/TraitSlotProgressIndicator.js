import React, { useContext } from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';
import { GameStateContext } from '../context/GameStateContext';

const TraitSlotProgressIndicator = () => {
  const { player } = useContext(GameStateContext);
  
  // Calculate the next essence threshold for a slot unlock
  const currentUnlocks = Math.floor(player.totalEssenceEarned / 1000);
  const nextThreshold = (currentUnlocks + 1) * 1000;
  
  // Calculate progress percentage toward next slot
  const progress = ((player.totalEssenceEarned % 1000) / 1000) * 100;
  
  // If already at max slots, show 100% progress
  const isMaxSlots = player.traitSlots >= 8;
  const displayProgress = isMaxSlots ? 100 : progress;
  
  return (
    <Tooltip 
      title={isMaxSlots 
        ? "Maximum trait slots reached!" 
        : `${player.totalEssenceEarned % 1000}/${1000} essence toward next slot`
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
              : `${Math.floor(progress)}% (${player.traitSlots}/${8} slots)`}
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
            Need {nextThreshold - player.totalEssenceEarned} more essence
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default TraitSlotProgressIndicator;