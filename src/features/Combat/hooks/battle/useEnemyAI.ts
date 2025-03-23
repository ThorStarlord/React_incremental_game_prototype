import { useCallback } from 'react';
import { CombatActionType, CombatActionResult } from '../../../../context/types/combat';
import { 
  ExtendedCombatState, 
  BattleResult 
} from '../../../../context/types/gameStates/BattleGameStateTypes';

/**
 * Hook for enemy AI and actions
 */
export const useEnemyAI = (
  combatState: ExtendedCombatState,
  setCombatState: React.Dispatch<React.SetStateAction<ExtendedCombatState>>,
  calculatedStats: any,
  onComplete: (result: BattleResult) => void,
  onDefeat: () => void,
  processEndOfTurnEffects: () => void,
  processStartOfTurnEffects: () => void
) => {
  /**
   * Process enemy turn
   */
  const processEnemyTurn = useCallback(() => {
    // Check that enemyStats exists before proceeding
    if (!combatState.enemyStats) {
      console.warn('Enemy stats not available for processing turn');
      return;
    }
    
    // Simple enemy AI logic
    setTimeout(() => {
      // Safely access enemy attack value with fallback
      const enemyAttack = combatState.enemyStats?.attack || 5;
      
      const enemyDamage = Math.max(1, 
        Math.floor(enemyAttack) - 
        Math.floor(calculatedStats?.defense || 0) / 4
      );
      
      setCombatState(prev => {
        // Ensure enemy stats exist in the previous state
        if (!prev.enemyStats) {
          return prev;
        }
        
        // Calculate new player health
        const newHealth = Math.max(0, prev.playerStats.currentHealth - enemyDamage);
        
        // Add log entry with proper literal type assertions
        const newLog = [
          ...prev.log,
          {
            timestamp: Date.now(),
            message: `${prev.enemyStats.name || 'Enemy'} attacks you for ${enemyDamage} damage!`,
            type: 'damage',
            importance: 'normal' as const  // Add type assertion
          }
        ];
        
        // Record turn history with proper type assertion
        const newHistory = [
          ...(prev.turnHistory || []),
          {
            actor: 'enemy' as const, // Type assertion to ensure it's treated as a literal
            action: CombatActionType.Attack,
            result: newHealth > 0 ? CombatActionResult.Hit : CombatActionResult.Critical, // Fix: use Critical instead of Defeat
            timestamp: Date.now()
          }
        ];
        
        // Check for player defeat
        if (newHealth <= 0) {
          // Player is defeated
          newLog.push({
            timestamp: Date.now(),
            message: 'You have been defeated!',
            type: 'defeat',
            importance: 'high' as const  // Add type assertion
          });
          
          // Trigger defeat callback after a delay
          setTimeout(() => {
            onDefeat();
            onComplete({
              victory: false,
              rewards: {},
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
        
        return {
          ...prev,
          playerTurn: true,
          playerStats: {
            ...prev.playerStats,
            currentHealth: newHealth
          },
          log: newLog,
          turnHistory: newHistory
        };
      });
    }, 1000); // Delay for effect
  }, [combatState.enemyStats, calculatedStats, onComplete, onDefeat, setCombatState]);

  /**
   * Handle running enemy turn logic when it's not player's turn
   */
  const runEnemyTurn = useCallback(() => {
    if (combatState.active && !combatState.playerTurn) {
      processStartOfTurnEffects();
      processEnemyTurn();
      processEndOfTurnEffects();
    }
  }, [
    combatState.active, 
    combatState.playerTurn, 
    processEnemyTurn, 
    processStartOfTurnEffects, 
    processEndOfTurnEffects
  ]);

  return {
    processEnemyTurn,
    runEnemyTurn
  };
};
