import { useCallback } from 'react';
import { ExtendedCombatState } from '../../../../context/types/combat/hooks'; // Fixed import path
import { StatusEffect } from '../../../../context/types/combat/effects';

// Define a type for skill items
interface SkillWithCooldown {
  id: string;
  name: string;
  currentCooldown: number;
  [key: string]: any;
}

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
      const updatedSkills = prev.skills?.map((skill: SkillWithCooldown) => ({
        ...skill,
        currentCooldown: Math.max(0, skill.currentCooldown - 1)
      }));
      
      // Reduce duration of status effects
      const updatedEffects = prev.effects
        ?.map((effect: StatusEffect) => ({
          ...effect,
          duration: effect.duration - 1
        }))
        .filter((effect: StatusEffect) => effect.duration > 0);
        
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