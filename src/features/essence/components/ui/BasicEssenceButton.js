import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box } from '@mui/material';
import { useGameDispatch } from '../../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../../context/actions/actionTypes';

/**
 * A basic button component for gaining essence
 * 
 * @param {Object} props Component props
 * @param {number} props.amount The amount of essence to gain
 * @param {string} props.tooltip Tooltip text to display
 * @param {Object} props.sx Additional styles
 * @returns {JSX.Element} BasicEssenceButton component
 */
const BasicEssenceButton = ({ 
  amount = 10, 
  tooltip = "Click to gain essence", 
  sx = {},
  cooldown = 1000 // Cooldown in milliseconds
}) => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = () => {
    // Prevent spam clicking
    if (isOnCooldown) return;
    
    // Dispatch essence gain action directly instead of using createEssenceAction
    dispatch({
      type: ACTION_TYPES.GAIN_ESSENCE,
      payload: { 
        amount,
        source: 'button_click'
      }
    });
    
    // Apply cooldown
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), cooldown);
  };
  
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <Button
          variant="contained"
          color="primary"
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

export default BasicEssenceButton;
