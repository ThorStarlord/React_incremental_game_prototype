import React from 'react';
import { Box, Button, Typography, Fade } from '@mui/material';
import { BattleResult } from '../../types/combatTypes';

interface BattleResultsProps {
  /** Whether combat is currently active */
  isActive: boolean;
  /** Whether the player character is still alive */
  playerAlive: boolean;
  /** Callback when player completes the battle */
  onComplete: (result: BattleResult) => void;
  /** Optional callback when player chooses to retreat */
  onRetreat?: () => void;
  /** Optional additional message to display */
  message?: string;
}

/**
 * Component to display battle results and continuation options when combat ends
 */
const BattleResults: React.FC<BattleResultsProps> = ({
  isActive,
  playerAlive,
  onComplete,
  onRetreat,
  message
}) => {
  // Don't render anything if combat is still active
  if (isActive) {
    return null;
  }

  /**
   * Handle continuing after combat ends
   */
  const handleContinue = () => {
    onComplete({
      victory: playerAlive,
      rewards: {},
      retreat: false
    });
  };

  /**
   * Handle player retreat
   */
  const handleRetreat = () => {
    if (onRetreat) {
      onRetreat();
    } else {
      onComplete({
        victory: false,
        rewards: {},
        retreat: true
      });
    }
  };

  return (
    <Fade in={!isActive} timeout={800}>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          color={playerAlive ? "success.main" : "error.main"}
          sx={{ mb: 2 }}
        >
          {playerAlive ? "Victory!" : "Defeat!"}
        </Typography>
        
        {message && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
        
        <Button 
          variant="contained" 
          color={playerAlive ? "success" : "error"}
          onClick={handleContinue}
          sx={{ minWidth: 180 }}
        >
          {playerAlive ? "Continue Adventure" : "Return to Town"}
        </Button>
        
        {onRetreat && playerAlive && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRetreat}
            sx={{ ml: 2 }}
          >
            Retreat
          </Button>
        )}
      </Box>
    </Fade>
  );
};

export default BattleResults;
