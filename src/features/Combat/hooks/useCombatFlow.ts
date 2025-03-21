import { useState, useCallback } from 'react';
import { useGameDispatch } from '../../../context/GameStateExports';
import { useCombatEncounters } from './useCombatEncounters';
import { useCombatRewards } from './useCombatRewards';
import { CombatResult, BattleResult } from '../types/combatTypes';
import { COMBAT_CONSTANTS } from '../data/enemyData';

/**
 * Hook for managing the flow of combat - from start to completion
 */
export const useCombatFlow = (
  player: any, 
  areaId: string, 
  difficulty: number, 
  isRandomEncounter: boolean
) => {
  const dispatch = useGameDispatch();
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  
  // Use existing hooks for encounters and rewards
  const {
    loading,
    currentEnemy,
    currentEncounter,
    totalEncounters,
    hasMoreEncounters,
    generateEncounters,
    advanceToNextEncounter
  } = useCombatEncounters(player, areaId, difficulty, isRandomEncounter);

  const { 
    totalRewards,
    addEncounterRewards,
    resetRewards
  } = useCombatRewards();

  /**
   * Initialize combat when component mounts
   */
  const initializeCombat = useCallback(() => {
    resetRewards();
    setCombatResult(null);
    generateEncounters();
  }, [generateEncounters, resetRewards]);

  /**
   * Handle when a battle is completed
   */
  const handleBattleComplete = useCallback((result: BattleResult) => {
    if (result.victory) {
      // Add rewards from this encounter
      addEncounterRewards(result.rewards);
      
      // Check if there are more encounters
      if (hasMoreEncounters) {
        // Proceed to next encounter after a delay
        setTimeout(() => {
          advanceToNextEncounter();
        }, COMBAT_CONSTANTS.RESULT_DISPLAY_DELAY);
      } else {
        // All encounters complete - show victory results
        setCombatResult({ victory: true });
      }
    } else {
      // Player was defeated
      setCombatResult({ victory: false });
    }
  }, [addEncounterRewards, hasMoreEncounters, advanceToNextEncounter]);

  /**
   * Handle retreat from combat
   */
  const handleRetreat = useCallback(() => {
    // Calculate chance of successful retreat
    if (Math.random() < COMBAT_CONSTANTS.BASE_RETREAT_CHANCE) {
      setCombatResult({ victory: false, retreat: true });
    } else {
      // Failed retreat - enemy gets a free attack
      dispatch({
        type: 'LOG_MESSAGE',
        payload: "You couldn't escape!"
      });
    }
  }, [dispatch]);

  return {
    loading,
    currentEnemy,
    currentEncounter,
    totalEncounters,
    combatResult,
    totalRewards,
    hasMoreEncounters,
    initializeCombat,
    handleBattleComplete,
    handleRetreat
  };
};

export default useCombatFlow;
