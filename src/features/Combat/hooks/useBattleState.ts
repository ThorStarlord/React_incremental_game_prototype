import { useState, useCallback } from 'react';
import { useGameState } from '../../../context/GameStateExports';
import { InitialState } from '../../../context/initialStates';
import { PlayerState } from '../../../context/types/gameStates/PlayerGameStateTypes';
import { GameState } from '../../../context/types/gameStates/GameStateTypes';
import { ExtendedCombatState } from '../../../context/types/combat/hooks'; // Fixed import path
import { CombatStatus } from '../../../context/types/combat/basic'; // Import directly from basic
import { SimpleLogEntry } from '../../../context/types/combat/logging';
import { UnifiedCombatState } from '../../../context/types/combat/unifiedTypes';
import { createLogEntry } from './battle/usePlayerActions/utils/logEntryFormatters';
import useEnemyGeneration from './useEnemyGeneration';

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
  enemyId: '',
  status: CombatStatus.NOT_STARTED
};

/**
 * Hook to manage battle state initialization and management
 */
const useBattleState = (dungeonId?: string) => {
  // Get game state and properly type the player object
  const gameState = useGameState();
  // Type assertion to make TypeScript recognize the player property
  const player = (gameState as unknown as GameState).player || {};
  const { generateEnemy } = useEnemyGeneration();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [combatState, setCombatState] = useState<ExtendedCombatState>(DEFAULT_BATTLE_STATE);

  // Initialize enemy when component mounts or dungeonId changes
  useEffect(() => {
    // Create a compatible player object with a level property
    // Calculate an estimated level based on attributes or use a default value
    const playerLevel = calculatePlayerLevel(player);
    const playerWithLevel = {
      ...player,
      level: playerLevel
    };
    
    // Generate an enemy based on dungeon and player level
    // Provide a fallback value for dungeonId to fix the type error
    const enemy = generateEnemy(dungeonId || 'randomEncounter', playerWithLevel);
    
    setIsLoading(false);
    
    // Update combat state with the enemy data
    setCombatState(prevState => ({
      ...prevState,
      enemyStats: enemy
    }));
    
    // Calculate initiative to determine first turn
    const playerDexterity = player.stats ? (player.stats as any)['dexterity'] ?? 1 : 1;
    const playerInitiative = Math.floor(Math.random() * 10) + playerDexterity;
    const enemyInitiative = Math.floor(Math.random() * 10) + (enemy.speed || 5);
    
    // Update player turn based on initiative
    setCombatState(prevState => ({
      ...prevState,
      playerTurn: playerInitiative >= enemyInitiative,
      log: [...(prevState.log || []), createLogEntry(
        `A ${enemy.name} (Level ${enemy.level}) appears!`,
        'encounter',
        'high'
      )]
    }));
  }, [dungeonId, player, generateEnemy]);

  // Helper function to calculate player level from attributes or other stats
  const calculatePlayerLevel = (player: PlayerState): number => {
    // Option 1: Calculate based on attribute sum
    if (player.attributes) {
      const attributeSum = Object.values(player.attributes).reduce((sum, value) => sum + value, 0);
      // Simple formula: every 5 attribute points = 1 level (min level 1)
      const attributeLevel = Math.max(1, Math.floor(attributeSum / 5));
      return attributeLevel;
    }
    
    // Option 2: If player has experience/level related data in its properties
    if ('experience' in player) {
      // Assume there's some calculation to convert experience to level
      // This is a fallback if the player has an experience property
      return Math.max(1, Math.floor(Math.sqrt((player as any).experience / 100)) + 1);
    }
    
    // Default to level 1 if no level calculation is possible
    return 1;
  };

  return {
    isLoading,
    combatState,
    setCombatState
  };
};

export default useBattleState;
