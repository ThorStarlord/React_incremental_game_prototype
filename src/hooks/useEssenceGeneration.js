import { useContext, useEffect } from 'react';
import { GameStateContext, GameDispatchContext, createEssenceAction } from '../context/GameStateContext';
import { ESSENCE_GENERATION_RATES, UPDATE_INTERVALS } from '../config/gameConstants';

const getGenerationRateForRelationship = (relationship) => {
  if (relationship >= 80) return 5; // Devoted
  if (relationship >= 60) return 4; // Trusted
  if (relationship >= 40) return 3; // Friendly
  if (relationship >= 20) return 2; // Warm
  if (relationship > 0) return 1;  // Positive
  return 0;
};

const useEssenceGeneration = () => {
  const { npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    const generateEssence = () => {
      const essenceGenerated = npcs.reduce((total, npc) => {
        const relationship = npc.relationship || 0;
        const rate = getGenerationRateForRelationship(relationship);
        return total + rate;
      }, 0);

      if (essenceGenerated > 0) {
        dispatch(createEssenceAction.gain(essenceGenerated));
      }
    };

    const intervalId = setInterval(generateEssence, UPDATE_INTERVALS.ESSENCE_GENERATION);
    return () => clearInterval(intervalId);
  }, [npcs, dispatch]);

  // Return the total generation rate for use in UI
  const totalRate = npcs.reduce((total, npc) => {
    const relationship = npc.relationship || 0;
    return total + getGenerationRateForRelationship(relationship);
  }, 0);

  return { totalRate };
};

export default useEssenceGeneration;