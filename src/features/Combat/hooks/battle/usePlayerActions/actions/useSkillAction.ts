import { useCallback } from 'react';
import { PlayerActionProps } from '../types';

export const useSkillAction = ({
  combatState,
  setCombatState,
  processEndOfTurnEffects,
  addLogEntry
}: PlayerActionProps) => {
  const handleUseSkill = useCallback((skillId: string) => {
    if (!combatState.playerTurn) return;
    
    const skill = combatState.skills?.find(s => s.id === skillId);
    if (!skill || skill.currentCooldown > 0 || (skill.manaCost ?? 0) > combatState.playerStats.currentMana) {
      return;
    }
    
    // Apply skill effects 
    addLogEntry(`You use ${skill.name}!`, 'skill');
    
    // Update skill cooldown and mana
    setCombatState(prev => {
      const updatedSkills = prev.skills?.map(s => 
        s.id === skillId 
          ? { ...s, currentCooldown: s.cooldown } 
          : s
      );
      
      return {
        ...prev,
        skills: updatedSkills,
        playerStats: {
          ...prev.playerStats,
          currentMana: prev.playerStats.currentMana - (skill.manaCost ?? 0)
        },
        playerTurn: false
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState.playerTurn, 
    combatState.skills, 
    combatState.playerStats.currentMana,
    addLogEntry, 
    processEndOfTurnEffects,
    setCombatState
  ]);

  return { handleUseSkill };
};
