/**
 * Player Action System
 * ===================
 * 
 * Central hub for all player-related actions in the game.
 * This module re-exports action creators from specialized modules
 * organized by function, providing a clean API for the rest of the application.
 * 
 * @module playerActions
 */

// Import action type definitions from types folder
import { 
  PLAYER_ACTIONS, 
  PlayerAction,
  PlayerActionType,
  ModificationReason
} from '../../types/actions/playerActionTypes';

// Re-export all action creators by domain
// =======================================

// Core player state actions
export { updatePlayer, setPlayerName, resetPlayer } from './stateActions';

// Character management
export { setActiveCharacter, switchCharacter } from './characterActions';

// Health and energy
export { modifyHealth, modifyEnergy, rest } from './healthActions';

// Skills and progression
export { updateSkill, learnSkill, upgradeSkill } from './skillActions';

// Attributes and stats
export { 
  allocateAttribute, 
  addAttributePoints, 
  spendAttributePoints
} from './attributeActions';

// Re-export stats action creators
export {
  updateStat,
  updateStats
} from './statsActions';

// Traits and perks
export { 
  acquireTrait, 
  equipTrait, 
  unequipTrait
} from './traitActions';

// Status effects
export {
  addStatusEffect,
  removeStatusEffect
} from './statusActions';

// Equipment
export {
  equipItem,
  unequipItem
} from './equipmentActions';

// Statistics
export {
  updateTotalPlayTime
} from './statsActions'

// Re-export common constants and enums
// ====================================
export { 
  PLAYER_ACTIONS,
  ModificationReason
};

// Re-export TypeScript types
// =========================
export type { 
  PlayerAction,
  PlayerActionType
};

// Re-export utilities and helpers
// ==============================

// Validation utilities
export { playerActionValidation } from './utils';

// Action creator factories
export {
  createActionWithTimestamp,
  createPlayerAction,
  createResourceAction
} from './actionCreators';
