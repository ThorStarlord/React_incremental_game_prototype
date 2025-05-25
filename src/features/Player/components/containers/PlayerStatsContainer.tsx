/**
 * @file PlayerStatsContainer.tsx
 * @description Container component connecting PlayerStatsUI to Redux state
 */

import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectPlayerStats } from '../../state/PlayerSelectors';
import { PlayerStatsUI } from '../ui/PlayerStatsUI';

/**
 * Props interface for PlayerStatsContainer
 */
export interface PlayerStatsContainerProps {
  /** Show detailed stat breakdown */
  showDetails?: boolean;
}

/**
 * Container component that connects PlayerStatsUI to Redux state
 */
export const PlayerStatsContainer: React.FC<PlayerStatsContainerProps> = React.memo(({
  showDetails = true
}) => {
  const playerStats = useAppSelector(selectPlayerStats);

  return (
    <PlayerStatsUI 
      stats={playerStats}
      showDetails={showDetails}
    />
  );
});

PlayerStatsContainer.displayName = 'PlayerStatsContainer';

export default PlayerStatsContainer;
