import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box, SxProps, Theme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { gainEssence } from '../../state/EssenceSlice';

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
  const dispatch = useDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = (): void => {
    if (isOnCooldown) return;
    
    // Dispatch gainEssence action from EssenceSlice
    dispatch(gainEssence({ 
      amount,
      source: 'essence_button'
    }));
    
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
