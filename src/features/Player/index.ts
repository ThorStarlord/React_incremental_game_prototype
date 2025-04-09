/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// Components
export { default as PlayerStats } from './components/containers/PlayerStats';
export { default as PlayerTraits } from './data/PlayerTraits';
export { default as CharacterPanel } from './components/layout/CharacterPanel';
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';
export { default as AchievementsList } from '../Achivements/components/AchievementsList';

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

// Redux Toolkit exports - actions from slice
export {
  // Actions
  updatePlayer,
  setName,
  resetPlayer,
  rest,
  modifyHealth,
  modifyEnergy,
  updateAttribute,
  updateAttributes,
  allocateAttribute,
  updateSkill,
  learnSkill,
  upgradeSkill,
  equipTrait,
  unequipTrait,
  acquireTrait,
  unlockTraitSlot,
  addStatusEffect,
  removeStatusEffect,
  updateStat,
  updateStats,
} from './state/PlayerSlice';

// Selectors from dedicated file
export {
  selectPlayer,
  selectPlayerName,
  selectPlayerLevel,
  selectPlayerHealth,
  selectPlayerMaxHealth,
  selectPlayerMana,
  selectPlayerAttribute,
  selectPlayerSkills,
  selectPlayerTraits,
  selectPlayerStatusEffects,
  selectPlayerExperience,
  selectPlayerTraitSlots
} from './state/playerSelectors';

// Export the reducer
export { default as playerReducer } from './state/PlayerSlice';

// Export thunks if you have them
export * from './state/playerThunks';