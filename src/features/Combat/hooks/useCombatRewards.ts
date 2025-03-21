import { useCallback, useState } from 'react';
import { Rewards } from '../types/combatTypes';

/**
 * Hook for managing combat rewards
 */
export const useCombatRewards = () => {
  // State for rewards
  const [totalRewards, setTotalRewards] = useState<Rewards>({
    experience: 0,
    gold: 0,
    items: []
  });

  /**
   * Add rewards from a completed encounter
   * @param encounterRewards - Rewards from the current encounter
   */
  const addEncounterRewards = useCallback((encounterRewards: Rewards) => {
    setTotalRewards(prev => ({
      experience: prev.experience + encounterRewards.experience,
      gold: prev.gold + encounterRewards.gold,
      items: [...prev.items, ...encounterRewards.items]
    }));
  }, []);

  /**
   * Reset rewards for a new combat
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
