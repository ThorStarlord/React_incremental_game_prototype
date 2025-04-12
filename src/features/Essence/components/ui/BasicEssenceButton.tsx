import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box, SxProps, Theme } from '@mui/material';
import { useAppDispatch } from '../../../../app/hooks';
import { gainEssence } from '../../state/EssenceSlice';

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
  /** Optional callback after essence is gained */
  onEssenceGained?: (amount: number) => void;
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
  cooldown = 1000, // Cooldown in milliseconds
  onEssenceGained
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleBasicEssenceGain = (): void => {
    // Prevent spam clicking
    if (isOnCooldown) return;
    
    // Dispatch gainEssence action from EssenceSlice
    dispatch(gainEssence({ 
      amount,
      source: 'button_click'
    }));
    
    // Start animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Apply cooldown
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), cooldown);
    
    // Call optional callback
    if (onEssenceGained) {
      onEssenceGained(amount);
    }
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
            position: 'relative',
            transition: 'transform 0.1s',
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
            ...sx
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="button">Gain Essence</Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: isOnCooldown ? 0.5 : 0.8,
                transition: 'opacity 0.3s'
              }}
            >
              +{amount}
            </Typography>
          </Box>
        </Button>
      </span>
    </Tooltip>
  );
};

export default BasicEssenceButton;
