/**
 * Player System Public API - Feature-Sliced Design Barrel Exports (Corrected)
 */
export { default as playerSlice } from './state/PlayerSlice';
export * from './state/PlayerSlice'; // Also export actions
export type {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  TraitSlot,
} from './state/PlayerTypes';

// FIXED: Exporting all selectors, including the ones moved from Traits
export * from './state/PlayerSelectors';

export {
  processStatusEffectsThunk,
  regenerateVitalsThunk,
  recalculateStatsThunk
} from './state/PlayerThunks';
export {
  usePlayer,
  usePlayerVitals,
  usePlayerAttributes,
  usePlayerCombatStats,
} from './hooks/usePlayerStats';
export { default as PlayerStatsContainer } from './components/containers/PlayerStatsContainer';
export { default as PlayerTraitsContainer } from './components/containers/PlayerTraitsContainer';
export { default as Progression } from './components/containers/Progression';
export { PlayerStatsUI } from './components/ui/PlayerStatsUI';
export { PlayerTraitsUI } from './components/ui/PlayerTraitsUI';
export { StatDisplay } from './components/ui/StatDisplay';
export { ProgressBar } from './components/ui/ProgressBar';