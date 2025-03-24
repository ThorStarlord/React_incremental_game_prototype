import { useCallback, useState } from 'react';
import { Rewards } from '../../../context/types/combat/combatTypes';

/**
 * Hook for managing combat rewards
 */
export const useCombatRewards = () => {
  // Initialize an empty rewards object
  const [totalRewards, setTotalRewards] = useState<Rewards>({
    experience: 0,
    gold: 0,
    items: []
  });
  
  /**
   * Add rewards from a single encounter to the total
   */
  const addEncounterRewards = useCallback((encounterRewards: Partial<Rewards>) => {
    setTotalRewards((prev: Rewards) => ({
      experience: prev.experience + (encounterRewards.experience || 0),
      gold: prev.gold + (encounterRewards.gold || 0),
      items: [...prev.items, ...(encounterRewards.items || [])]
    }));
  }, []);
  
  /**
   * Reset all rewards to zero
   */
  const resetRewards = useCallback(() => {
    setTotalRewards({
      experience: 0,
      gold: 0,
      items: []
    });
  }, []);
  
  return {
    totalRewards,
    addEncounterRewards,
    resetRewards
  };
};
