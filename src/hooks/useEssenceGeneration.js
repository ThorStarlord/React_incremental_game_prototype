import { useContext, useEffect } from 'react';
import { GameStateContext, GameDispatchContext, createEssenceAction } from '../context/GameStateContext';
import { ESSENCE_GENERATION_RATES, UPDATE_INTERVALS } from '../config/gameConstants';

// NPC type power levels
const NPC_POWER_LEVELS = {
  'Mentor': 3,    // Highest influence
  'Elder': 3,     // Equal to Mentor
  'Craftsman': 2, // Medium influence
  'Trader': 2,    // Equal to Craftsman
  'Quest Giver': 2,
  'default': 1    // Base power level for other types
};

const getGenerationRateForRelationship = (relationship, npcType) => {
  // Base rate calculation
  let baseRate = 0;
  if (relationship >= 80) baseRate = 5; // Devoted
  else if (relationship >= 60) baseRate = 4; // Trusted
  else if (relationship >= 40) baseRate = 3; // Friendly
  else if (relationship >= 20) baseRate = 2; // Warm
  else if (relationship > 0) baseRate = 1;  // Positive

  // Apply NPC power level multiplier
  const powerLevel = NPC_POWER_LEVELS[npcType] || NPC_POWER_LEVELS.default;
  return baseRate * powerLevel;
};

const useEssenceGeneration = () => {
  const { npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    const generateEssence = () => {
      const essenceGenerated = npcs.reduce((total, npc) => {
        const relationship = npc.relationship || 0;
        const rate = getGenerationRateForRelationship(relationship, npc.type);
        return total + rate;
      }, 0);

      if (essenceGenerated > 0) {
        dispatch(createEssenceAction.gain(essenceGenerated));
      }
    };

    const intervalId = setInterval(generateEssence, UPDATE_INTERVALS.ESSENCE_GENERATION);
    return () => clearInterval(intervalId);
  }, [npcs, dispatch]);

  // Return generation rates per NPC for UI
  const npcRates = npcs.map(npc => ({
    name: npc.name,
    type: npc.type,
    rate: getGenerationRateForRelationship(npc.relationship || 0, npc.type)
  })).filter(info => info.rate > 0);

  const totalRate = npcRates.reduce((sum, info) => sum + info.rate, 0);

  return { totalRate, npcRates };
};

export default useEssenceGeneration;