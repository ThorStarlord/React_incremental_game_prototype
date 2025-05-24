/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// Player System Feature Exports
// Following Feature-Sliced Design principles with clean barrel exports

// Types
export type { 
  PlayerState, 
  PlayerStats, 
  Attribute, 
  StatusEffect, 
  EquipmentItem, 
  EquipmentState,
  UpdatePlayerPayload,
  ModifyHealthPayload,
  AllocateAttributePayload,
  EquipItemPayload
} from './state/PlayerTypes';

// Redux State Management
export { default as playerReducer } from './state/PlayerSlice';
export { 
  playerSlice, 
  updatePlayer, 
  setName, 
  resetPlayer, 
  modifyHealth, 
  allocateAttribute, 
  equipItem 
} from './state/PlayerSlice';

// Selectors
export { 
  selectPlayer, 
  selectPlayerStats, 
  selectPlayerLevel, 
  selectPlayerHealth, 
  selectPlayerMana 
} from './state/PlayerSelectors';

// Container Components (primary exports)
export { PlayerStatsContainer } from './components/containers/PlayerStatsContainer';
export { PlayerTraitsContainer } from './components/containers/PlayerTraitsContainer';

// UI Components (for direct use if needed)
export { PlayerStatsUI as PlayerStatsUI } from './components/ui/PlayerStatsUI';
export { PlayerTraitsUI as PlayerTraitsUI } from './components/ui/PlayerTraitsUI';

// Utilities
export { 
  getPlayerStats, 
  getPlayerStatsFromState, 
  getEffectivePlayerStats 
} from './utils/getPlayerStats';