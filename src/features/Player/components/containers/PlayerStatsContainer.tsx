import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { 
  selectPlayerStats, 
  selectPlayerHealth, 
  selectPlayerMana 
} from '../../state/PlayerSelectors';
import { PlayerStatsUI } from '../ui/PlayerStatsUI';

/**
 * Container component for player statistics management
 * 
 * Connects PlayerStatsUI to Redux state and provides:
 * - Current player statistics from Redux store
 * - Calculated vital stats with percentages
 * - Loading state management
 * - Additional derived stats
 * 
 * This container follows the Feature-Sliced Design pattern by:
 * - Using typed Redux hooks (useAppSelector)
 * - Importing from feature-local selectors
 * - Separating concerns between data fetching and UI rendering
 * - Providing memoized data to prevent unnecessary re-renders
 */
export const PlayerStatsContainer: React.FC = React.memo(() => {
  const stats = useAppSelector(selectPlayerStats);
  const health = useAppSelector(selectPlayerHealth);
  const mana = useAppSelector(selectPlayerMana);

  return (
    <PlayerStatsUI 
      stats={stats}
      health={health}
      mana={mana}
    />
  );
});

PlayerStatsContainer.displayName = 'PlayerStatsContainer';

export default PlayerStatsContainer;
