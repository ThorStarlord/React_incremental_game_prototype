import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box, SxProps, Theme } from '@mui/material';
// Fix imports to use correct exports
import { useGameDispatch } from '../../../../context/GameStateExports';
import { ACTION_TYPES } from '../../../../context/types/ActionTypes';

/**
 * Interface for EssenceButton component props
 */
interface EssenceButtonProps {
  /** Amount of essence to gain when clicked */
  amount?: number;
  /** Tooltip text to display */
  tooltip?: string;
  /** Button text */
  text?: string;
  /** Additional styles for the button */
  sx?: SxProps<Theme>;
  /** Cooldown time in milliseconds */
  cooldown?: number;
  /** Button variant */
  variant?: 'text' | 'outlined' | 'contained';
  /** Button color */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
}

/**
 * A styled button component for gaining essence
 * 
 * @param {EssenceButtonProps} props Component props
 * @returns {React.ReactElement} EssenceButton component
 */
const EssenceButton: React.FC<EssenceButtonProps> = ({ 
  amount = 10, 
  tooltip = "Click to gain essence", 
  text = "Gather Essence",
  sx = {},
  cooldown = 1000, // Cooldown in milliseconds
  variant = "contained",
  color = "primary",
  size = "medium"
}): React.ReactElement => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = (): void => {
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
            <Typography variant="button">{text}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>+{amount}</Typography>
          </Box>
        </Button>
      </span>
    </Tooltip>
  );
};

export default EssenceButton;
