import { useEffect } from 'react';
import { useContext } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

const useTraitHotkeys = () => {
  const { player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Shift + Number keys (1-8) to unequip traits
      if (event.shiftKey && event.key >= '1' && event.key <= '8') {
        const index = parseInt(event.key) - 1;
        if (index < player.equippedTraits.length) {
          const traitId = player.equippedTraits[index];
          dispatch({ type: 'UNEQUIP_TRAIT', payload: traitId });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player.equippedTraits, dispatch]);

  return null;
};

export default useTraitHotkeys;