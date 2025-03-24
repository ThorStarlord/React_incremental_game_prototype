import { useState, useCallback } from 'react';
import { SimpleLogEntry } from '../../../../context/types/combat/logging';
import { CombatStatus } from '../../../../context/types/combat/basic';
import { UnifiedCombatState } from '../../../../context/types/combat/unifiedTypes';
import { createLogEntry } from './usePlayerActions/utils/logEntryFormatters';

// Define default battle state with all required properties
const DEFAULT_BATTLE_STATE: UnifiedCombatState = {
  active: true,
  playerTurn: true,
  round: 1,
  playerStats: {
    currentHealth: 100,
    maxHealth: 100,
    currentMana: 50,
    maxMana: 50
  },
  log: [],
  turnHistory: [],
  effects: [],
  skills: [],
  items: [],
  status: CombatStatus.NOT_STARTED
};

/**
 * Hook for managing battle state
 */
export const useBattleState = (dungeonId: string, player: any) => {
  // State for tracking battle
  const [battleState, setBattleState] = useState<UnifiedCombatState>(DEFAULT_BATTLE_STATE);
  
  // Generate an enemy for the current dungeon
  const generateEnemy = useCallback((level: number = 1) => {
    // Get enemy base stats from player level or dungeon
    const enemyLevel = Math.max(1, level);
    const baseHealth = 30 + (enemyLevel * 10);
    const baseAttack = 5 + (enemyLevel * 2);
    const baseDefense = 2 + Math.floor(enemyLevel / 2);
    
    // Create an enemy with proper naming based on dungeon
    const dungeonPrefix = dungeonId.charAt(0).toUpperCase() + dungeonId.slice(1);
    const enemyTypes = ['Wolf', 'Bandit', 'Skeleton', 'Goblin', 'Troll'];
    const randomEnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    return {
      id: `${dungeonId}-${Date.now()}`,
      name: `${dungeonPrefix} ${randomEnemyType}`,
      level: enemyLevel,
      currentHealth: baseHealth,
      maxHealth: baseHealth,
      attack: baseAttack,
      defense: baseDefense
    };
  }, [dungeonId]);
  
  // Initialize battle with player and enemy
  const initializeBattle = useCallback(() => {
    // Calculate player level based on stats or other metrics
    const playerLevel = Math.floor((player?.stats?.attack || 10) / 5);
    
    // Generate enemy based on player level
    const enemy = generateEnemy(playerLevel);
    
    // Calculate initiative for turn order
    const playerInitiative = Math.random() * 10 + (player?.stats?.speed || 0);
    const enemyInitiative = Math.random() * 10 + (enemy.level || 0);
    
    // Update battle state with enemy and initial turn order
    setBattleState(prevState => ({
      ...prevState,
      playerTurn: playerInitiative >= enemyInitiative,
      active: true,
      round: 1,
      status: CombatStatus.IN_PROGRESS,
      log: [...(prevState.log || []), 
        createLogEntry(
          `A ${enemy.name} (Level ${enemy.level}) appears!`,
          'encounter',
          'high'
        )
      ],
      enemyStats: enemy,
      playerStats: {
        currentHealth: player?.stats?.health || 100,
        maxHealth: player?.stats?.maxHealth || 100,
        currentMana: player?.stats?.mana || 50,
        maxMana: player?.stats?.maxMana || 50
      }
    }));
  }, [dungeonId, player, generateEnemy, setBattleState]);
  
  // Helper function to calculate player level from attributes or other stats
  const calculatePlayerLevel = useCallback(() => {
    // Simple calculation based on attack (placeholder)
    return Math.floor((player?.stats?.attack || 10) / 5);
  }, [player]);
  
  return {
    battleState,
    setBattleState,
    initializeBattle,
    calculatePlayerLevel
  };
};