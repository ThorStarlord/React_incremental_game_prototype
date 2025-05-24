import React from 'react';
import { PlayerStats as PlayerStatsUI } from '../ui/PlayerStatsUI';

/**
 * PlayerStatsContainer component provides a wrapper around the PlayerStats UI
 * component, handling any additional logic, state management, or side effects
 * needed for stats display within the character context.
 */
export const PlayerStatsContainer: React.FC = React.memo(() => {
  // Additional container logic can be added here if needed
  // For now, this serves as a clean separation between UI and container logic
  
  return <PlayerStatsUI />;
});

PlayerStatsContainer.displayName = 'PlayerStatsContainer';
