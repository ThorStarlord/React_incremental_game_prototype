/**
 * Player feature exports
 *
 * This file serves as the public API for the Player feature,
 * exporting components, hooks, and utilities.
 */

// State
export * from './state/PlayerSlice';
export * from './state/PlayerSelectors';
export * from './state/PlayerThunks';
export * from './state/PlayerTypes';

// Hooks
export { default as usePlayerStats } from './hooks/usePlayerStats';

// Components
export { default as PlayerStats } from './components/containers/PlayerStats';
export { default as CharacterPanel } from './components/layout/CharacterPanel';
export { default as PlayerTraits } from './components/containers/PlayerTraits';
export { default as Progression } from './components/containers/Progression';

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