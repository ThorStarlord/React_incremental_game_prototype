import React, { useState } from 'react';
import { Button, Tooltip, Typography, Box, SxProps, Theme } from '@mui/material';
import { useAppDispatch } from '../../../../app/hooks';
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
  /** Optional callback after essence is gained */
  onEssenceGained?: (amount: number) => void;
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
  size = "medium",
  onEssenceGained
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  /**
   * Handle gaining essence when the button is clicked
   */
  const handleEssenceGain = (): void => {
    if (isOnCooldown) return;
    
    // Dispatch gainEssence action with just the amount (number)
    dispatch(gainEssence({ amount, description: 'Manual Click' }));
    
    // Start cooldown
    setIsOnCooldown(true);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Reset cooldown after delay
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
          variant={variant}
          color={color}
          size={size}
          onClick={handleEssenceGain}
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
            <Typography variant="button">{text}</Typography>
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

export default EssenceButton;
