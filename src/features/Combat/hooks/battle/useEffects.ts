import { useCallback } from 'react';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { StatusEffect } from '../../../../context/types/combat/effects';
import { Dispatch, SetStateAction } from 'react';

// Define a type for skill items with cooldown
interface SkillWithCooldown {
  id: string;
  name: string;
  description: string; // Required by ActiveSkill
  cooldown: number;    // Required by ActiveSkill
  currentCooldown: number;
  targeting: 'single' | 'aoe' | 'self'; // Required by ActiveSkill
  [key: string]: any;
}

/**
 * Hook for processing combat effects and status changes
 */
export const useEffects = (
  combatState: UnifiedCombatState,
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>
) => {
  /**
   * Process effects that happen at the start of a turn
   */
  const processStartOfTurnEffects = useCallback(() => {
    // Process ongoing effects like DoTs, HoTs, etc.
    // This is a placeholder for future implementation
    // Could include status effect damage, healing over time, etc.
  }, []);

  /**
   * Process effects that happen at the end of a turn
   */
  const processEndOfTurnEffects = useCallback(() => {
    // Reduce duration of status effects
    setCombatState(prev => {
      // Reduce duration on effects and filter out expired ones
      const updatedEffects = prev.effects
        ?.map((effect: StatusEffect) => ({
          ...effect,
          duration: effect.duration - 1
        }))
        .filter((effect: StatusEffect) => effect.duration > 0) || [];
      
      // Reduce cooldowns on skills, ensuring we maintain all required ActiveSkill properties
      const updatedSkills = prev.skills?.map((skill: SkillWithCooldown) => ({
        ...skill,
        currentCooldown: Math.max(0, skill.currentCooldown - 1),
        // Make sure all required ActiveSkill properties are preserved
        description: skill.description,
        cooldown: skill.cooldown,
        targeting: skill.targeting
      })) || [];
      
      return {
        ...prev,
        skills: updatedSkills,
        effects: updatedEffects
      };
    });
  }, [setCombatState]);

  /**
   * Apply a status effect to a combatant
   */
  const applyStatusEffect = useCallback((effect: StatusEffect) => {
    setCombatState(prev => {
      // Check if effect already exists
      const existingEffect = prev.effects?.find(e => e.id === effect.id);
      
      if (existingEffect) {
        // Replace with longer duration if applicable
        const updatedEffects = prev.effects?.map(e => 
          e.id === effect.id 
            ? { ...e, duration: Math.max(e.duration, effect.duration) }
            : e
        );
        
        return {
          ...prev,
          effects: updatedEffects
        };
      } else {
        return {
          ...prev,
          effects: [...(prev.effects || []), effect]
        };
      }
    });
  }, [setCombatState]);

  return {
    processStartOfTurnEffects,
    processEndOfTurnEffects,
    applyStatusEffect
  };
};
