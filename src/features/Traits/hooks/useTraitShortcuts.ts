import { useEffect, useCallback } from 'react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts'; // Adjusted path
import { Trait } from '../state/TraitsTypes'; // Adjusted path

/**
 * Props for the useTraitShortcuts hook
 */
export interface UseTraitShortcutsProps {
  /** Callback function to unequip a trait */
  onUnequip: (traitId: string) => void;
  /** Array of currently equipped traits */
  equippedTraits: Trait[];
}

/**
 * Return type for the useTraitShortcuts hook
 * Currently returns nothing, but could be extended
 */
export interface UseTraitShortcutsReturn {
  // Currently empty, but could return functions to manage shortcuts if needed
}

/**
 * Hook to manage keyboard shortcuts for unequipping traits.
 * Registers Shift + 1 through Shift + 9 to unequip traits in the corresponding slots.
 *
 * @param {UseTraitShortcutsProps} props - The hook props.
 * @returns {UseTraitShortcutsReturn} - An object potentially containing shortcut management functions.
 */
const useTraitShortcuts = ({ onUnequip, equippedTraits }: UseTraitShortcutsProps): UseTraitShortcutsReturn => {
  const { registerShortcut } = useKeyboardShortcuts();

  useEffect(() => {
    const unregisterCallbacks: (() => void)[] = [];

    // Ensure equippedTraits is an array before iterating
    if (Array.isArray(equippedTraits)) {
      equippedTraits.forEach((trait, index) => {
        // Only register shortcuts for the first 9 slots (Shift+1 to Shift+9)
        if (trait && index < 9) {
          const key = (index + 1).toString();
          const unregister = registerShortcut({
            key: key,
            shift: true, // Require Shift key
            action: () => onUnequip(trait.id),
            description: `Unequip trait: ${trait.name}`
          });
          unregisterCallbacks.push(unregister);
        }
      });
    }

    // Cleanup function: Unregister all shortcuts when the component unmounts
    // or when the dependencies (equippedTraits, onUnequip) change.
    return () => {
      unregisterCallbacks.forEach(unregister => unregister());
    };
  }, [equippedTraits, onUnequip, registerShortcut]); // Dependencies for the effect

  // The hook currently doesn't need to return anything, but the structure allows for future extension.
  return {};
};

export default useTraitShortcuts;

// Note: Removed re-export of types like TraitSlot, TraitPreset as they are not directly used in this hook.
// Trait type is imported directly.
