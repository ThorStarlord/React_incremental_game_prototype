import { useState, useEffect } from 'react';
import { useGameState } from '../../../context/GameStateExports';
import { InitialState } from '../../../context/initialStates';
import { CombatStatus, ExtendedCombatState } from '../../../context/types/CombatGameStateTypes';
import { PlayerState } from '../../../context/types/PlayerGameStateTypes';
import { GameState } from '../../../context/types/GameStateTypes';
import useEnemyGeneration from './useEnemyGeneration';

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
  const [combatState, setCombatState] = useState<ExtendedCombatState>({
    active: true,
    playerTurn: true,
    round: 1,
    playerStats: {
      currentHealth: player.stats?.health ?? 100,
      maxHealth: player.stats?.maxHealth ?? 100,
      currentMana: player.stats?.mana ?? 50,
      maxMana: player.stats?.maxMana ?? 50
    },
    log: [],
    enemyId: dungeonId
  });

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
      log: [...(prevState.log || []), {
        timestamp: Date.now(),
        message: `A ${enemy.name} (Level ${enemy.level}) appears!`,
        type: 'encounter',
        importance: 'high'
      }]
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
