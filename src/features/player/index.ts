/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// Components
export { default as PlayerStats } from './data/PlayerStats';
export { default as PlayerTraits } from './data/PlayerTraits';
export { default as CharacterPanel } from './components/layout/CharacterPanel';
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';
export { default as AchievementsList } from './components/ui/AchievementsList';

// Container components
export { default as PlayerTraitsContainer } from './components/containers/PlayerTraits';
export { default as ProgressionContainer } from './components/containers/Progression';
export { default as StatisticsPanel } from './components/containers/StatisticsPanel';

// Hooks
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Utilities
import * as expUtils from './utils/experienceUtils';
import * as plrUtils from './utils/playerUtils';
import * as getStatsUtils from './utils/getPlayerStats';

export const experienceUtils = expUtils;
export const playerUtils = plrUtils;
export const getPlayerStatsUtils = getStatsUtils;

// For any Redux actions that might have been exported from playerSlice.ts,
// consider using the action creators from context/actions/player/ instead
// For example:
// export { modifyHealth, equipTrait } from '../../context/actions/player';
