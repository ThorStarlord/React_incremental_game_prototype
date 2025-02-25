import { useContext, useEffect } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import { PROGRESSION_THRESHOLDS } from '../config/gameConstants';

const Progression = () => {
  const { essence, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    // Check essence-based slot unlocks
    const totalSlots = Math.min(
      8, // Maximum slots
      3 + Math.floor(essence / PROGRESSION_THRESHOLDS.TRAIT_SLOT_ESSENCE)
    );

    if (totalSlots > player.traitSlots) {
      dispatch({
        type: 'UNLOCK_TRAIT_SLOTS',
        payload: {
          newTotal: totalSlots,
          reason: 'essence'
        }
      });
    }
  }, [essence, player.traitSlots, dispatch]);

  // Level-based progression
  useEffect(() => {
    // Unlock a slot every 5 levels after level 5
    if (player.level >= 5) {
      const levelBasedSlots = Math.min(
        3, // Maximum level-based slots
        Math.floor((player.level - 5) / 5) + 1
      );
      
      const totalSlots = Math.min(8, player.traitSlots + levelBasedSlots);
      
      if (totalSlots > player.traitSlots) {
        dispatch({
          type: 'UNLOCK_TRAIT_SLOTS',
          payload: {
            newTotal: totalSlots,
            reason: 'level'
          }
        });
      }
    }
  }, [player.level, player.traitSlots, dispatch]);

  return null; // This is a logic-only component
};

export default Progression;