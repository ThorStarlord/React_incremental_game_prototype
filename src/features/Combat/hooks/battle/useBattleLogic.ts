import { useCallback, useState, useEffect } from 'react';
import { useGameDispatch } from '../../../../context/GameStateExports';
import { BattleResult, UseBattleHookProps } from '../../../../context/types/gameStates/BattleGameStateTypes';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { CombatStatus } from '../../../../context/types/combat/basic';
import { Dispatch, SetStateAction } from 'react';

// Import combat hooks
import { useCombatLog } from './useCombatLog';
import { usePlayerActions } from './usePlayerActions';
import { useEnemyAI } from './useEnemyAI';
import { useEffects } from './useEffects';

/**
 * Main hook for battle logic
 * 
 * This hook brings together all the combat-related functionality like:
 * - Player actions (attack, defend, use skills/items)
 * - Enemy AI behavior
 * - Combat state management
 * - Effect processing
 * - Combat log entries
 */
const useBattleLogic = ({ 
  player,
  dungeonId,
  dispatch: gameDispatch,
  difficulty = 'normal',
  calculatedStats = { attack: 10, defense: 5, critChance: 0.05 },
  modifiers = { criticalChance: 0, criticalDamage: 0 },
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
    processEndOfTurnEffects,
    applyStatusEffect
  } = useEffects(combatState, setCombatState);
  
  // Initialize combat state when component mounts
  useEffect(() => {
    // Check if enemy is already set
    if (!combatState.enemyStats) {
      // Here we would normally call generateEnemy from useEnemyGeneration
      // But for now, we'll just set some reasonable defaults
      setCombatState(prev => ({
        ...prev,
        enemyStats: {
          id: `enemy-${Date.now()}`,
          name: `${dungeonId.charAt(0).toUpperCase() + dungeonId.slice(1)} Enemy`,
          level: Math.max(1, Math.floor((calculatedStats.attack || 10) / 5)),
          currentHealth: 50,
          maxHealth: 50,
          attack: 8,
          defense: 3
        }
      }));

      // Add initial log entry
      addLogEntry('Combat begins!', 'info', 'high');
    }
  }, [combatState.enemyStats, dungeonId, calculatedStats, setCombatState, addLogEntry]);
  
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

  // Callback to handle trait effects display
  const handleShowTraitEffect = useCallback((traitId: string, x: number, y: number) => {
    // Call the provided showTraitEffect function with proper parameters
    showTraitEffect(traitId, x, y);
  }, [showTraitEffect]);
  
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
    showTraitEffect: handleShowTraitEffect
  };
};

export default useBattleLogic;