/**
 * Player Feature Barrel Exports
 * Following Feature-Sliced Design principles
 */

// Player Feature Public API

// Components - Containers
export { default as PlayerStatsContainer } from './components/containers/PlayerStatsContainer';
export { default as Progression } from './components/containers/Progression';

// Components - UI
export { default as PlayerStatsUI } from './components/ui/PlayerStatsUI';
export { default as PlayerTraitsUI } from './components/ui/PlayerTraitsUI';
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';

// Components - Layout
export { default as CharacterPanel } from './components/layout/CharacterPanel';

// Redux State Management
export { default as playerReducer } from './state/PlayerSlice';
export * from './state/PlayerSlice';
export * from './state/PlayerSelectors';
export * from './state/PlayerTypes';

// Hook exports would go here when implemented
export { usePlayerStats, usePlayerAttribute, usePlayerHealth, usePlayerMana } from './hooks/usePlayerStats';

// Type Definitions - Only export types that actually exist
export type {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  PlayerHealthData,
  PlayerManaData,
  CombatStats,
  PerformanceStats,
  StatDisplayProps,
  ProgressBarProps
} from './state/PlayerTypes';

// Utility exports would go here when implemented
// export * from './utils/getPlayerStats';
// export * from './utils/calculateDerivedStats';