import { useCallback } from 'react';
import { CombatActionType, CombatActionResult } from '../../../../../../context/types/combat';
import { PlayerActionProps } from '../types';
import { calculateDamage } from '../utils/combatCalculations';
import { createLogEntry } from '../utils/logEntryFormatters';
import { createTurnHistoryEntry } from '../utils/turnHistoryHelpers';

export const useAttackAction = ({
  combatState,
  setCombatState,
  calculatedStats,
  onComplete,
  onVictory,
  processEndOfTurnEffects
}: PlayerActionProps) => {
  const handlePlayerAttack = useCallback(() => {
    if (!combatState.playerTurn || !combatState.enemyStats) return;
    
    // Calculate damage using utility function
    const { finalDamage, isCritical } = calculateDamage(
      calculatedStats?.attack || 5,
      calculatedStats?.critChance || 0.05,
      combatState.enemyStats.defense || 0
    );
    
    setCombatState(prev => {
      if (!prev.enemyStats) return prev;
      
      // Calculate enemy's new health
      const newHealth = Math.max(0, prev.enemyStats.currentHealth - finalDamage);
      
      // Create log entry using utility
      const newLog = [
        ...prev.log,
        createLogEntry(
          isCritical ? `You land a critical hit for ${finalDamage} damage!` : `You attack for ${finalDamage} damage.`,
          isCritical ? 'critical' : 'damage',
          isCritical ? 'high' : 'normal'
        )
      ];
      
      // Create turn history entry
      const newHistory = [
        ...(prev.turnHistory || []),
        createTurnHistoryEntry(
          'player',
          CombatActionType.Attack,
          isCritical ? CombatActionResult.Critical : CombatActionResult.Hit
        )
      ];
      
      // Check for victory
      if (newHealth <= 0) {
        // Enemy is defeated
        newLog.push(createLogEntry(
          `You have defeated ${prev.enemyStats.name}!`,
          'victory',
          'high'
        ));
        
        // Generate rewards with experience property
        const gold = 25; // Fixed gold reward
        const experience = 0; // No experience given since levels were removed
        
        // Trigger victory callback after a delay
        setTimeout(() => {
          // Safely call onVictory with null check
          if (typeof onVictory === 'function') {
            onVictory();
          }
          onComplete({
            victory: true,
            rewards: {
              experience,
              gold,
              items: []
            },
            retreat: false
          });
        }, 1500);
        
        return {
          ...prev,
          active: false,
          enemyStats: {
            ...prev.enemyStats,
            currentHealth: 0
          },
          log: newLog,
          turnHistory: newHistory,
          rewards: {
            experience,
            gold,
            items: []
          }
        };
      }
      
      // Continue battle - update enemy health and end player turn
      return {
        ...prev,
        playerTurn: false,
        enemyStats: {
          ...prev.enemyStats,
          currentHealth: newHealth
        },
        log: newLog,
        turnHistory: newHistory
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState.playerTurn, 
    combatState.enemyStats, 
    calculatedStats, 
    onComplete, 
    onVictory, 
    processEndOfTurnEffects,
    setCombatState
  ]);

  return { handlePlayerAttack };
};
