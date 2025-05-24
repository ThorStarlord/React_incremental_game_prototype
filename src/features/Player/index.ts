/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// State
export * from './state/PlayerTypes';
export * from './state/PlayerSlice';
export * from './state/PlayerSelectors';

// Hooks
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Components
export { PlayerStats } from './components/ui/PlayerStatsUI';
export { PlayerTraits } from './components/containers/PlayerTraits';
export { PlayerEquipment } from './components/ui/PlayerEquipment';

// Utils
export * from './utils/getPlayerStats';

// Feature barrel exports following Feature-Sliced Design

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

// Actions and selectors
export { 
  playerSlice, 
  updatePlayer, 
  setName, 
  resetPlayer, 
  modifyHealth, 
  allocateAttribute, 
  equipItem 
} from './state/PlayerSlice';

export { 
  selectPlayer, 
  selectPlayerStats, 
  selectPlayerLevel, 
  selectPlayerHealth, 
  selectPlayerMana 
} from './state/PlayerSelectors';

// Utilities
export { 
  getPlayerStats, 
  getPlayerStatsFromState, 
  getEffectivePlayerStats 
} from './utils/getPlayerStats';

// Components (when they exist)
// export { PlayerPanel } from './components/containers/PlayerPanel';
// export { PlayerStatsDisplay } from './components/ui/PlayerStatsDisplay';

// Player System Feature Exports

// Redux State Management
export { default as playerReducer } from './state/PlayerSlice';
export * from './state/PlayerSlice';

// Types
export type * from './state/PlayerTypes';

// Selectors
export * from './state/PlayerSelectors';

// Container Components (primary exports)
export { PlayerStatsContainer as PlayerStats } from './components/containers/PlayerStatsContainer';
export { PlayerTraitsContainer as PlayerTraits } from './components/containers/PlayerTraitsContainer';

// UI Components (for direct use if needed)
export { PlayerStats as PlayerStatsUI } from './components/ui/PlayerStatsUI';
export { PlayerTraits as PlayerTraitsUI } from './components/ui/PlayerTraitsUI';

// Other UI Components
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';

// Container Components
export { default as Progression } from './components/containers/Progression';

// Hooks
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Utils
export * from './utils/getPlayerStats';