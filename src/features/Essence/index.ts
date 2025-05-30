/**
 * Essence Feature - Barrel Export
 * 
 * This file exports the public API of the Essence feature following
 * Feature-Sliced Design principles.
 */

// Components
export {
  EssenceDisplayUI as EssenceDisplay,
  ConfigurableEssenceButton,
  ManualEssenceButton,
  EssenceGenerationTimer,
  EssencePanel
} from './components';

// Types
export type { EssenceState } from './state/EssenceTypes';

// Selectors
export * from './state/EssenceSelectors';

// Actions and Slice
export * from './state/EssenceSlice';

// Hooks
export { default as useEssenceGeneration, useAutoGenerateEssence } from './hooks/useEssenceGeneration';
