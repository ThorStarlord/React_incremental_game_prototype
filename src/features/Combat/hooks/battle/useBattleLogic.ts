import { useCallback, useEffect } from 'react';
import { UseBattleHookProps, ExtendedCombatState, BattleResult } from '../../../../context/types/gameStates/BattleGameStateTypes';

// Import all specialized battle hooks
import { useBattleState } from './useBattleState';
import { useCombatLog } from './useCombatLog';
import { useEffectsProcessor } from './useEffectsProcessor';
import { useEnemyAI } from './useEnemyAI';
import { usePlayerActions } from './usePlayerActions';

/**
 * Main battle logic hook that combines various specialized hooks
 * to provide a complete interface for battle management
 */
const useBattleLogic = ({
  player,
  dungeonId,
  dispatch,
  difficulty = 'normal',
  calculatedStats = {},
  onComplete,
  onVictory = () => {},
  onDefeat = () => {},
  showTraitEffect = () => {}
}: UseBattleHookProps) => {
  // Initialize battle state with player stats
  const { combatState, setCombatState } = useBattleState(player, calculatedStats);
  
  // Set up combat log management
  const { addLogEntry } = useCombatLog(setCombatState);
  
  // Set up effects processing
  const {
    endTurn,
    processStartOfTurnEffects,
    processEndOfTurnEffects
  } = useEffectsProcessor(setCombatState);
  
  // Set up player actions
  const {
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd
  } = usePlayerActions(
    combatState,
    setCombatState,
    calculatedStats,
    onComplete,
    onVictory,
    processEndOfTurnEffects,
    addLogEntry
  );
  
  // Set up enemy AI
  const {
    processEnemyTurn,
    runEnemyTurn
  } = useEnemyAI(
    combatState,
    setCombatState,
    calculatedStats,
    onComplete,
    onDefeat,
    processEndOfTurnEffects,
    processStartOfTurnEffects
  );
  
  // Run enemy turn when it's not player's turn
  useEffect(() => {
    if (combatState.active && !combatState.playerTurn) {
      runEnemyTurn();
    }
  }, [combatState.active, combatState.playerTurn, runEnemyTurn]);
  
  // Check for battle completion conditions
  useEffect(() => {
    // Check if battle is over (player or enemy defeated)
    if (combatState.active) {
      const playerHealth = combatState.playerStats?.currentHealth || 0;
      const enemyHealth = combatState.enemyStats?.currentHealth || 0;
      
      if (playerHealth <= 0) {
        // Player defeated
        setCombatState(prev => ({ ...prev, active: false }));
        addLogEntry('You have been defeated!', 'defeat', 'high');
        
        setTimeout(() => {
          onDefeat();
          onComplete({
            victory: false,
            rewards: {},
            retreat: false
          });
        }, 1500);
      } else if (enemyHealth <= 0) {
        // Enemy defeated
        setCombatState(prev => ({ ...prev, active: false }));
        addLogEntry('You are victorious!', 'victory', 'high');
        
        const experience = combatState.enemyStats?.level ? combatState.enemyStats.level * 10 : 10;
        const gold = combatState.enemyStats?.level ? combatState.enemyStats.level * 5 : 5;
        
        setTimeout(() => {
          onVictory();
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
      }
    }
  }, [
    combatState.active, 
    combatState.playerStats?.currentHealth, 
    combatState.enemyStats?.currentHealth,
    combatState.enemyStats?.level,
    addLogEntry,
    setCombatState,
    onVictory,
    onDefeat,
    onComplete
  ]);

  return {
    combatState,
    setCombatState,
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd,
    addLogEntry,
    showTraitEffect
  };
};

export default useBattleLogic;
