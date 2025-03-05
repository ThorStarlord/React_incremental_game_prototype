import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box, SxProps, Theme } from '@mui/material';
import { useGameDispatch } from '../../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../../context/actions/actionTypes';

/**
 * Interface for BasicEssenceButton component props
 */
interface BasicEssenceButtonProps {
  /** Amount of essence to gain when clicked */
  amount?: number;
  /** Tooltip text to display */
  tooltip?: string;
  /** Additional styles for the button */
  sx?: SxProps<Theme>;
  /** Cooldown time in milliseconds */
  cooldown?: number;
}

/**
 * A basic button component for gaining essence
 * 
 * @param {BasicEssenceButtonProps} props Component props
 * @returns {JSX.Element} BasicEssenceButton component
 */
const BasicEssenceButton: React.FC<BasicEssenceButtonProps> = ({ 
  amount = 10, 
  tooltip = "Click to gain essence", 
  sx = {},
  cooldown = 1000 // Cooldown in milliseconds
}): JSX.Element => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = (): void => {
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
