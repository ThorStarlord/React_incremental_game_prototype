/**
 * Player feature exports
 * 
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// Export components
export { default as PlayerStats } from './components/PlayerStats';
export { default as PlayerInventory } from './components/PlayerInventory';
export { default as LevelUpNotification } from './components/LevelUpNotification';

// Export hooks
export { default as usePlayerAttributes } from './hooks/usePlayerAttributes';
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Export utilities as namespaces
import * as expUtils from './utils/experienceUtils';
import * as plrUtils from './utils/playerUtils';

export const experienceUtils = expUtils;
export const playerUtils = plrUtils;
