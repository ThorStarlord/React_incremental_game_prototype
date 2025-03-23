/**
 * @file Barrel file for initial states and related utilities
 * 
 * This file centralizes all initial state exports to provide a single import point,
 * making it easier to manage dependencies throughout the application.
 */

// Export the composed initial state
export { InitialState } from './InitialStateComposer';

// Export reset functionality
export { 
  resetGameState,
  resetPlayerState,
  resetStateSlice
} from './stateReset';

// Export individual initial states
export { default as PlayerInitialState } from './PlayerInitialState';
export { default as statisticsInitialState } from './StatisticsInitialState';
export { default as notificationsInitialState } from './NotificationsInitialState';
export { default as settingsInitialState } from './SettingsInitialState';
export { default as progressionInitialState } from './ProgressionInitialState';
export { default as equipmentInitialState } from './EquipmentInitialState';
export { default as inventoryInitialState } from './InventoryInitialState';
export { default as metaInitialState } from './MetaInitialState';
export { default as factionsInitialState } from './FactionInitialState';
export { default as essenceInitialState } from './EssenceInitialState';
export { default as traitsInitialState } from './TraitsInitialState';
export { default as resourceInitialState } from './ResourceInitialState';
export { default as combatInitialState } from './CombatInitialState';
export { default as worldInitialState } from './WorldInitialState';
export { default as skillsInitialState } from './SkillsInitialState';
export { default as questsInitialState } from './QuestsInitialState';

// Export utility functions
export * from '../utils/stateUtils';

// Re-export feature utilities through feature indices
export { experienceUtils } from '../../features/Player';
export { playerUtils } from '../../features/Player';

// Export types from game state
export type { GameState } from '../types/gameStates/GameStateTypes';
export type { PlayerState, PlayerStats } from '../types/gameStates/PlayerGameStateTypes';
export type { EquipmentState } from '../types/gameStates/EquipmentGameStateTypes';
export type { InventoryItem } from '../types/gameStates/InventoryGameStateTypes';
