import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box } from '@mui/material';
import { useGameDispatch } from '../../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../../context/actions/actionTypes';

/**
 * A button component for gaining essence
 */
const EssenceButton = ({ 
  amount = 10, 
  tooltip = "Click to gain essence", 
  sx = {},
  cooldown = 1000,
  variant = "contained",
  color = "primary",
  size = "medium"
}) => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = () => {
    if (isOnCooldown) return;
    
    // Dispatch an action directly instead of using createEssenceAction.gain
    dispatch({
      type: ACTION_TYPES.GAIN_ESSENCE,
      payload: { 
        amount,
        source: 'essence_button'
      }
    });
    
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), cooldown);
  };
  
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <Button
          variant={variant}
          color={color}
          size={size}
          onClick={handleBasicEssenceGain}
          disabled={isOnCooldown}
          sx={{
            my: 1,
            ...sx
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="button">Gain Essence</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>+{amount}</Typography>
          </Box>
        </Button>
      </span>
    </Tooltip>
  );
};

export default EssenceButton;
