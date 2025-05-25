/**
 * Player Feature Barrel Exports
 * Following Feature-Sliced Design principles
 */

// Redux State Management
export { default as playerReducer } from './state/PlayerSlice';
export * from './state/PlayerSlice';
export * from './state/PlayerSelectors';
export * from './state/PlayerThunks';

// Type Definitions
export type {
  PlayerState,
  PlayerStats,
  Attribute,
  StatusEffect,
  PlayerHealthData,
  PlayerManaData,
  CombatStats,
  PerformanceStats,
  UpdatePlayerPayload,
  ModifyHealthPayload,
  AllocateAttributePayload,
  EquipTraitPayload,
  UnequipTraitPayload,
  PlayerStatsContainerProps,
  PlayerTraitsContainerProps,
  TraitSlotData,
  PlayerStatsUIProps,
  StatDisplayProps,
  ProgressBarProps,
  ProgressionProps
} from './state/PlayerTypes';

// Component exports would go here when implemented
// export { PlayerStatsContainer } from './components/containers/PlayerStatsContainer';
// export { PlayerTraitsContainer } from './components/containers/PlayerTraitsContainer';
// export { Progression } from './components/containers/Progression';
// export { PlayerStatsUI } from './components/ui/PlayerStatsUI';
// export { PlayerTraitsUI } from './components/ui/PlayerTraitsUI';
// export { StatDisplay } from './components/ui/StatDisplay';
// export { ProgressBar } from './components/ui/ProgressBar';

// Utility exports would go here when implemented
// export * from './utils/getPlayerStats';
// export * from './utils/calculateDerivedStats';

// Hook exports would go here when implemented
// export { usePlayerStats } from './hooks/usePlayerStats';