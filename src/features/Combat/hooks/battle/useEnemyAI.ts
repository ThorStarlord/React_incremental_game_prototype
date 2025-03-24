import { useCallback } from 'react';
import { BattleResult } from '../../../../context/types/gameStates/BattleGameStateTypes';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { CombatActionType, CombatActionResult } from '../../../../context/types/combat/basic';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';
import { createTurnHistoryEntry } from './usePlayerActions/utils/turnHistoryHelpers';
import { calculateDamage } from './usePlayerActions/utils/combatCalculations';
import { Dispatch, SetStateAction } from 'react';

/**
 * Props for enemy AI hook
 */
interface EnemyAIProps {
  combatState: UnifiedCombatState;
  setCombatState: Dispatch<SetStateAction<UnifiedCombatState>>;
  calculatedStats: any;
  onComplete: (result: BattleResult) => void;
  onDefeat: () => void;
  processEndOfTurnEffects: () => void;
  processStartOfTurnEffects: () => void;
}

/**
 * Hook for enemy AI actions in combat
 */
export const useEnemyAI = ({
  combatState,
  setCombatState,
  calculatedStats,
  onComplete,
  onDefeat,
  processEndOfTurnEffects,
  processStartOfTurnEffects
}: EnemyAIProps) => {
  /**
   * Process the enemy's turn
   */
  const processEnemyTurn = useCallback(() => {
    if (!combatState.active || combatState.playerTurn || !combatState.enemyStats) return;
    
    // Process any start-of-turn effects first
    processStartOfTurnEffects();
    
    // Calculate enemy attack damage
    const { finalDamage, isCritical } = calculateDamage(
      combatState.enemyStats.attack || 5,
      0.05, // Base 5% crit chance for enemies
      calculatedStats?.defense || 0
    );
    
    // Apply damage to player
    setCombatState(prev => {
      // Calculate player's new health
      const newHealth = Math.max(0, prev.playerStats.currentHealth - finalDamage);
      
      // Create log entry for enemy attack
      const newLog = [
        ...prev.log,
        createLogEntry(
          isCritical 
            ? `${prev.enemyStats?.name || 'Enemy'} lands a critical hit for ${finalDamage} damage!` 
            : `${prev.enemyStats?.name || 'Enemy'} attacks for ${finalDamage} damage.`,
          isCritical ? 'critical' : 'damage',
          isCritical ? 'high' : 'normal'
        )
      ];
      
      // Create turn history entry
      const newHistory = [
        ...(prev.turnHistory || []),
        createTurnHistoryEntry(
          'enemy',
          CombatActionType.Attack,
          isCritical ? CombatActionResult.Critical : CombatActionResult.Hit
        )
      ];
      
      // Check for player defeat
      if (newHealth <= 0) {
        // Player is defeated
        newLog.push(createLogEntry(
          'You have been defeated!',
          'defeat',
          'high'
        ));
        
        // Trigger defeat callback after a delay
        setTimeout(() => {
          onDefeat();
          onComplete({
            victory: false,
            rewards: {
              experience: 0,
              gold: 0,
              items: []
            },
            retreat: false
          });
        }, 1500);
        
        return {
          ...prev,
          active: false,
          playerStats: {
            ...prev.playerStats,
            currentHealth: 0
          },
          log: newLog,
          turnHistory: newHistory
        };
      }
      
      // Continue battle - update player health and return to player turn
      return {
        ...prev,
        playerTurn: true,
        playerStats: {
          ...prev.playerStats,
          currentHealth: newHealth
        },
        round: prev.round + 1, // Increment round counter
        log: newLog,
        turnHistory: newHistory
      };
    });
    
    // Process end of turn effects
    processEndOfTurnEffects();
  }, [
    combatState,
    calculatedStats,
    processStartOfTurnEffects,
    setCombatState,
    onDefeat,
    onComplete,
    processEndOfTurnEffects
  ]);

  /**
   * Run the enemy turn after a delay
   */
  const runEnemyTurn = useCallback(() => {
    processEnemyTurn();
  }, [processEnemyTurn]);

  return {
    processEnemyTurn,
    runEnemyTurn
  };
};
