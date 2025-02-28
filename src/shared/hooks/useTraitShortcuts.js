import { useEffect, useCallback } from 'react';

const useTraitShortcuts = ({ onUnequip, equippedTraits }) => {
  const handleKeyDown = useCallback((event) => {
    // Handle Shift + Number (1-8) for unequipping traits
    if (event.shiftKey && event.key >= '1' && event.key <= '8') {
      const index = parseInt(event.key) - 1;
      if (index < equippedTraits.length) {
        const traitId = equippedTraits[index].id;
        onUnequip(traitId);
      }
    }
  }, [equippedTraits, onUnequip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useTraitShortcuts;