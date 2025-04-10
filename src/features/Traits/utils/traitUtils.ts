/**
 * Trait Utilities Index
 *
 * This module re-exports utility functions for working with traits,
 * organized into separate files for better maintainability.
 */

// Re-export functions from the new modules
export * from './traitEffectUtils';
export * from './traitFilterSortUtils';
export * from './traitAcquisitionUtils';
export * from './traitUIUtils'; // Add re-export for UI utils

// Note: The following functions/interfaces were removed as they were moved,
// stateful, or trivial:
// - ActiveTrait (moved to TraitsTypes.ts)
// - TraitFilters (moved to TraitsTypes.ts)
// - isTraitActive (stateful logic, belongs elsewhere)
// - activateTrait (stateful logic, belongs elsewhere)
// - deactivateTrait (stateful logic, belongs elsewhere)
// - getTraitDescription (trivial, can be done inline: trait.description || "default")
