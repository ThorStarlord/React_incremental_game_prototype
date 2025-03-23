import { COMBAT_CONSTANTS } from '../data/enemyData';
import { CombatResult, BattleResult, Rewards } from '../../../context/types/combat/combatTypes';

/**
 * Calculate retreat success chance based on player stats
 * 
 * @param playerSpeed Player speed stat
 * @param enemySpeed Enemy speed stat
 * @returns Probability of successful retreat (0-1)
 */
export const calculateRetreatChance = (
  playerSpeed: number = 10,
  enemySpeed: number = 10
): number => {
  const baseChance = COMBAT_CONSTANTS.BASE_RETREAT_CHANCE;
  const speedDifference = playerSpeed - enemySpeed;
  
  // Adjust retreat chance based on speed difference
  // +/- 5% per point of speed difference, capped between 10% and 90%
  const adjustedChance = baseChance + (speedDifference * 0.05);
  return Math.min(0.9, Math.max(0.1, adjustedChance));
};

/**
 * Process battle result to update rewards and determine next steps
 * 
 * @param result Battle result from completed encounter
 * @param currentRewards Current accumulated rewards
 * @param encounterIndex Current encounter index
 * @param totalEncounters Total number of encounters
 * @returns Object containing updated rewards and whether combat should end
 */
export const processBattleResult = (
  result: BattleResult,
  currentRewards: Rewards,
  encounterIndex: number,
  totalEncounters: number
): {
  updatedRewards: Rewards;
  shouldEndCombat: boolean;
  combatResult: CombatResult | null;
} => {
  // If player lost, end combat immediately with defeat
  if (!result.victory) {
    return {
      updatedRewards: currentRewards,
      shouldEndCombat: true,
      combatResult: { victory: false }
    };
  }
  
  // Calculate updated rewards
  const updatedRewards = {
    experience: currentRewards.experience + result.rewards.experience,
    gold: currentRewards.gold + result.rewards.gold,
    items: [...currentRewards.items, ...result.rewards.items]
  };
  
  // Check if this was the last encounter
  const isLastEncounter = encounterIndex === totalEncounters - 1;
  
  return {
    updatedRewards,
    shouldEndCombat: isLastEncounter,
    combatResult: isLastEncounter ? { victory: true } : null
  };
};
