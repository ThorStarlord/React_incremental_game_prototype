import { useCallback, useState, useEffect } from 'react';
import { useGameDispatch } from '../../../../context/GameStateExports';
import { BattleResult, UseBattleHookProps } from '../../../../context/types/gameStates/BattleGameStateTypes';
import { ExtendedCombatState } from '../../../../context/types/combat';
import { CombatStateWithRound } from '../../../../context/types/gameStates/CombatStateTypes';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { CombatStatus } from '../../../../context/types/combat/basic';
import { Dispatch, SetStateAction } from 'react';

// Import combat hooks
import { useCombatLog } from './useCombatLog';
import { usePlayerActions } from './usePlayerActions';
import { useEnemyAI } from './useEnemyAI';
import { useEffects } from './useEffects';
import { useCombatInitializer } from './useCombatInitializer';

/**
 * Main hook for battle logic
 */
const useBattleLogic = ({ 
  player,
  dungeonId,
  dispatch: gameDispatch,
  difficulty = 'normal',
  calculatedStats = { attack: 10, defense: 5, critChance: 0.05 },
  onComplete,
  onVictory = () => {},
  onDefeat = () => {},
  showTraitEffect = () => {}
}: UseBattleHookProps) => {
  // Initialize combat state with proper defaults
  const [combatState, setCombatState] = useState<UnifiedCombatState>(() => ({
    active: true,
    playerTurn: true,
    round: 1,
    status: CombatStatus.IN_PROGRESS,
    playerStats: {
      currentHealth: player?.stats?.health || 100,
      maxHealth: player?.stats?.maxHealth || 100,
      currentMana: player?.stats?.mana || 50,
      maxMana: player?.stats?.maxMana || 50
    },
    log: [],
    turnHistory: [],
    skills: [],
    items: [],
    effects: []
  }));
  
  // Use the global dispatch for game-level actions
  const dispatch = useGameDispatch();
  
  // Set up combat log management
  const { addLogEntry } = useCombatLog(setCombatState);
  
  // Set up effects processing
  const {
    processStartOfTurnEffects,
    processEndOfTurnEffects
  } = useEffects(combatState, setCombatState);
  
  // Initialize combat state
  useCombatInitializer(player, combatState, setCombatState, calculatedStats);
  
  // Set up player actions
  const {
    handlePlayerAttack,
    handleUseSkill,
    handleUseItem,
    handleDefend,
    handleFlee,
    handlePlayerTurnEnd
  } = usePlayerActions({
    combatState,
    setCombatState,
    calculatedStats,
    onComplete,
    onVictory,
    onDefeat: onDefeat || (() => {}),
    processEndOfTurnEffects,
    addLogEntry
  });
  
  // Set up enemy AI
  const {
    processEnemyTurn,
    runEnemyTurn
  } = useEnemyAI({
    combatState,
    setCombatState,
    calculatedStats,
    onComplete,
    onDefeat: onDefeat || (() => {}),
    processEndOfTurnEffects,
    processStartOfTurnEffects
  });
  
  // Run enemy turn when it's not player's turn
  useEffect(() => {
    if (combatState.active && !combatState.playerTurn) {
      const timer = setTimeout(() => {
        runEnemyTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [combatState.active, combatState.playerTurn, runEnemyTurn]);
  
  // Return combat state and actions
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