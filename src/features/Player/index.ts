/**
 * Player System Public API - Feature-Sliced Design Barrel Exports
 */

// ============================================================================
// Core Redux State Management
// ============================================================================

// Redux Slice - Default export for store configuration
export { default as playerSlice } from './state/PlayerSlice';

// State Types - Core type definitions for Player system
export type {
  PlayerState,
  PlayerStats,
  PlayerAttributes,
  StatusEffect,
  PlayerHealthData,
  PlayerManaData,
  CombatStats,
  PerformanceStats
} from './state/PlayerTypes';

// Redux Selectors - Memoized state selectors for efficient data access
export {
  selectPlayer,
  selectPlayerStats,
  selectPlayerAttributes,
  selectPlayerStatusEffects,
  selectHealthData,
  selectManaData,
  selectCombatStats,
  selectPerformanceStats,
  selectAvailableAttributePoints,
  selectAvailableSkillPoints,
  selectEquippedTraits,
  selectPermanentTraits,
  selectTraitSlots,
  selectIsPlayerAlive,
  selectTotalPlaytime,
  // Legacy selectors for backward compatibility
  selectPlayerHealthData,
  selectPlayerManaData
} from './state/PlayerSelectors';

// Redux Thunks - Async operations for complex Player mechanics
export {
  processStatusEffectsThunk,
  regenerateVitalsThunk,
  useConsumableItemThunk,
  restThunk,
  autoAllocateAttributesThunk
} from './state/PlayerThunks';

// ============================================================================
// Custom Hooks - Feature-specific React hooks
// ============================================================================

export {
  usePlayerStats,
  usePlayerStatsDisplay,
  usePlayerAttributes,
  usePlayerStatusEffects,
  usePlayerProgression,
  usePlayerVitals
} from './hooks/usePlayerStats';

// ============================================================================
// UI Components - Container Components (Smart Components)
// ============================================================================

// Redux-connected container components for state management
export { default as PlayerStatsContainer } from './components/containers/PlayerStatsContainer';
export { default as PlayerTraitsContainer } from './components/containers/PlayerTraitsContainer';
export { default as Progression } from './components/containers/Progression';

// ============================================================================
// UI Components - Presentational Components (Dumb Components)
// ============================================================================

// Pure UI components for Player display and interaction
export { default as PlayerStatsUI } from './components/ui/PlayerStatsUI';
export { default as PlayerTraitsUI } from './components/ui/PlayerTraitsUI';
export { default as StatDisplay } from './components/ui/StatDisplay';
export { default as ProgressBar } from './components/ui/ProgressBar';

// ============================================================================
// Future Exports (Prepared for Implementation)
// ============================================================================

// Layout Components (when implemented)
// export { default as PlayerLayout } from './components/layout/PlayerLayout';

// Utility Functions (when needed)
// export * from './utils/playerUtils';

// Constants (when defined)
// export * from './constants/playerConstants';

// ============================================================================
// Feature Summary
// ============================================================================

/**
 * Player System Feature
 * 
 * Provides comprehensive character management including:
 * - ✅ Core statistics (health, mana, combat stats)
 * - ✅ Attribute system (strength, dexterity, intelligence, etc.)
 * - ✅ Status effect management with duration tracking
 * - ✅ Progression system with playtime and point allocation
 * - ✅ Complete UI component library (StatDisplay, ProgressBar, etc.)
 * - ✅ Container/component architecture for clean state management
 * - ✅ Custom hooks for efficient state access
 * - ✅ Async operations for complex player mechanics
 * 
 * Architecture:
 * - Feature-Sliced Design compliant
 * - Redux Toolkit state management
 * - Material-UI component integration
 * - CSS Modules styling support
 * - Full TypeScript type safety
 * - WCAG 2.1 AA accessibility compliance
 * - Performance optimized with memoization
 * 
 * Integration Ready:
 * - Trait System: Player trait management and effects
 * - Essence System: Progression through essence collection
 * - NPC System: Relationship bonuses and social interactions
 * - Settings System: Character display preferences
 * - Save/Load System: Complete state persistence
 */