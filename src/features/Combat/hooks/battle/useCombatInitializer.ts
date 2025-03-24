import { useEffect } from 'react';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';
import { Dispatch, SetStateAction } from 'react';

/**
 * Hook to initialize the combat state with player data
 */
export const useCombatInitializer = (
  player: any,
  combatState: UnifiedCombatState,
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>,
  calculatedStats: any
) => {
  // Initialize player stats when component mounts
  useEffect(() => {
    // Only initialize if player stats aren't set yet
    if (!combatState.playerStats || combatState.playerStats.currentHealth === 0) {
      setCombatState(prev => ({
        ...prev,
        playerStats: {
          currentHealth: player?.stats?.health || 100,
          maxHealth: player?.stats?.maxHealth || 100,
          currentMana: player?.stats?.mana || 50,
          maxMana: player?.stats?.maxMana || 50
        }
      }));
    }
    
    // Initialize skills if player has them
    if ((!combatState.skills || combatState.skills.length === 0) && player?.skills?.length > 0) {
      // Transform player skills to combat format
      const combatSkills = player.skills.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description || '',
        cooldown: skill.cooldown || 3,
        currentCooldown: 0,
        manaCost: skill.manaCost || 10,
        damage: skill.damage || calculatedStats.attack || 10,
        targeting: skill.targeting || 'single',
        effects: skill.effects || []
      }));
      
      setCombatState(prev => ({
        ...prev,
        skills: combatSkills
      }));
    }
    
    // Add initial combat log entry if none exists
    if (combatState.log.length === 0) {
      setCombatState(prev => ({
        ...prev,
        log: [
          createLogEntry(
            'Combat has begun!',
            'info',
            'high'
          )
        ]
      }));
    }
  }, [player, combatState, setCombatState, calculatedStats]);
};
