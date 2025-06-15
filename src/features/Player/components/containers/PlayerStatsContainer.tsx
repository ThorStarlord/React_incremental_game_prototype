/**
 * @file PlayerStatsContainer.tsx
 * @description Container component connecting PlayerStatsUI to Redux state
 */

import React from 'react';
import { Box, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
// Corrected: Import the new, specific selector for final stats
import { selectFinalStats } from '../../state/PlayerSelectors';
import { PlayerStatsUI } from '../ui/PlayerStatsUI';

/**
 * Props interface for PlayerStatsContainer
 */
export interface PlayerStatsContainerProps {
  /** Show detailed stat breakdown */
  showDetails?: boolean;
  className?: string;
}

/**
 * Container component that connects PlayerStatsUI to Redux state
 * Handles state subscription and provides computed player statistics
 */
export const PlayerStatsContainer: React.FC<PlayerStatsContainerProps> = React.memo(({
  showDetails = true,
  className,
}) => {
  // FIXED: Use the correct `selectFinalStats` selector.
  const stats = useAppSelector(selectFinalStats);
  const isLoading = false; // Placeholder for future implementation
  const error = null;     // Placeholder for future implementation

  if (error) {
    return (
      <Box className={className} role="alert">
        <Alert severity="error">
          <AlertTitle>Player Stats Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  if (isLoading || !stats) { // Add a check for stats existence
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
        role="status"
        aria-label="Loading player stats"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box className={className}>
      <PlayerStatsUI
        stats={stats}
        showDetails={showDetails}
      />
    </Box>
  );
});

PlayerStatsContainer.displayName = 'PlayerStatsContainer';

export default PlayerStatsContainer;