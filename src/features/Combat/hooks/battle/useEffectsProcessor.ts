import { useCallback } from 'react';
import { ExtendedCombatState } from '../../../../context/types/gameStates/BattleGameStateTypes';

/**
 * Hook for processing combat effects and turn transitions
 */
export const useEffectsProcessor = (
  setCombatState: React.Dispatch<React.SetStateAction<ExtendedCombatState>>
) => {
  /**
   * End the current turn and switch to the other combatant
   */
  const endTurn = useCallback(() => {
    setCombatState(prev => ({
      ...prev,
      playerTurn: !prev.playerTurn,
      round: prev.playerTurn ? prev.round + 1 : prev.round
    }));
  }, [setCombatState]);

  /**
   * Process effects that happen at the start of a turn
   */
  const processStartOfTurnEffects = useCallback(() => {
    // Process status effects, DoTs, HoTs, etc.
    // Implementation depends on your game's mechanics
  }, []);

  /**
   * Process effects that happen at the end of a turn
   */
  const processEndOfTurnEffects = useCallback(() => {
    // Reduce cooldowns on skills
    setCombatState(prev => {
      const updatedSkills = prev.skills?.map(skill => ({
        ...skill,
        currentCooldown: Math.max(0, skill.currentCooldown - 1)
      }));
      
      // Reduce duration of status effects
      const updatedEffects = prev.effects
        ?.map(effect => ({
          ...effect,
          duration: effect.duration - 1
        }))
        .filter(effect => effect.duration > 0);
        
      return {
        ...prev,
        skills: updatedSkills,
        effects: updatedEffects
      };
    });
  }, [setCombatState]);

  return {
    endTurn,
    processStartOfTurnEffects,
    processEndOfTurnEffects
  };
};
