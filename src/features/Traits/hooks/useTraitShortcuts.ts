/**
 * Re-export of the useTraitShortcuts hook from shared hooks
 * This file is needed to maintain the expected import structure in components
 */

import useTraitShortcuts from '../../../shared/hooks/useTraitShortcuts';

// Re-export the hook directly
export default useTraitShortcuts;

// Also re-export any types that might be needed
export type {
  Trait,
  TraitSlot,
  TraitPreset,
  UseTraitShortcutsProps,
  UseTraitShortcutsReturn
} from '../../../shared/hooks/useTraitShortcuts';
