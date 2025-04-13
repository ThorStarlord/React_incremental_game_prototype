/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// Utilities
import * as plrUtils from './utils/playerStatCalculations';

// Components
export { default as PlayerStats } from './components/containers/PlayerStats';
export { default as PlayerTraits } from './components/containers/PlayerTraits';
export { default as CharacterPanel } from './components/layout/CharacterPanel';
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';

// Container components
export { default as PlayerTraitsContainer } from './components/containers/PlayerTraits';
export { default as ProgressionContainer } from './components/containers/Progression';

// Hooks
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Utilities
export const playerUtils = plrUtils;

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
  selectPlayerStatusEffects,
  selectPlayerTraitSlots
} from './state/PlayerSelectors';

// Export the reducer
export { default as playerReducer } from './state/PlayerSlice';

// Export thunks if you have them
export * from './state/PlayerThunks';