import { useCallback } from 'react';
import { getDungeonById } from '../../World/data/dungeons';
import { CombatEnemy } from '../../../context/types/combat/enemyTypes';

interface PlayerData {
  level: number;
  stats?: {
    attack?: number;
    defense?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Hook for generating enemies based on dungeon and player level
 */
const useEnemyGeneration = () => {
  /**
   * Generate appropriate enemy for the dungeon
   */
  const generateEnemy = useCallback((dungeonId: string, player: PlayerData): CombatEnemy => {
    // Get dungeon data
    const dungeon = getDungeonById(dungeonId);
    
    // Default enemy pool if dungeon not found
    const defaultEnemies = [
      { id: 'goblin', name: 'Goblin', baseHealth: 35, baseAttack: 4, baseDefense: 2, baseExp: 10, baseGold: 5 },
      { id: 'wolf', name: 'Wolf', baseHealth: 30, baseAttack: 5, baseDefense: 1, baseExp: 8, baseGold: 3 },
      { id: 'bandit', name: 'Bandit', baseHealth: 40, baseAttack: 4, baseDefense: 3, baseExp: 12, baseGold: 8 }
    ];
    
    // Define enemy pools for each dungeon
    const dungeonEnemies: Record<string, typeof defaultEnemies> = {
      whisperingCaves: [
        { id: 'caveBat', name: 'Cave Bat', baseHealth: 25, baseAttack: 3, baseDefense: 1, baseExp: 7, baseGold: 2 },
        { id: 'poisonousFungus', name: 'Poisonous Fungus', baseHealth: 40, baseAttack: 2, baseDefense: 4, baseExp: 9, baseGold: 4 },
        { id: 'crystalGolem', name: 'Crystal Golem', baseHealth: 60, baseAttack: 6, baseDefense: 6, baseExp: 15, baseGold: 10 }
      ],
      cragheartMine: [
        { id: 'miner', name: 'Corrupted Miner', baseHealth: 35, baseAttack: 4, baseDefense: 2, baseExp: 8, baseGold: 6 },
        { id: 'rockCreature', name: 'Rock Creature', baseHealth: 50, baseAttack: 5, baseDefense: 5, baseExp: 12, baseGold: 7 },
        { id: 'ancientMachine', name: 'Ancient Machine', baseHealth: 70, baseAttack: 7, baseDefense: 7, baseExp: 18, baseGold: 12 }
      ],
      drownedGrotto: [
        { id: 'seaCrawler', name: 'Sea Crawler', baseHealth: 30, baseAttack: 4, baseDefense: 2, baseExp: 9, baseGold: 5 },
        { id: 'waterSpirit', name: 'Water Spirit', baseHealth: 40, baseAttack: 6, baseDefense: 3, baseExp: 13, baseGold: 8 },
        { id: 'drownedOne', name: 'Drowned One', baseHealth: 55, baseAttack: 7, baseDefense: 4, baseExp: 16, baseGold: 11 }
      ],
      plainMonolith: [
        { id: 'timeWarp', name: 'Time Warp', baseHealth: 35, baseAttack: 5, baseDefense: 2, baseExp: 11, baseGold: 6 },
        { id: 'runeGuardian', name: 'Rune Guardian', baseHealth: 60, baseAttack: 6, baseDefense: 6, baseExp: 17, baseGold: 13 },
        { id: 'voidEntity', name: 'Void Entity', baseHealth: 75, baseAttack: 8, baseDefense: 5, baseExp: 20, baseGold: 15 }
      ]
    };
    
    // Get enemies for the specific dungeon or use defaults
    const enemyPool = dungeonId && dungeonEnemies[dungeonId] ? 
      dungeonEnemies[dungeonId] : defaultEnemies;
    
    // Select a random enemy from the pool
    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    const selectedEnemy = enemyPool[randomIndex];
    
    // Calculate difficulty scaling based on player level
    const playerLevel = player.level || 1;
    const levelDifference = Math.floor(Math.random() * 3) - 1; // -1 to +1 level difference
    const enemyLevel = Math.max(1, playerLevel + levelDifference);
    
    // Scale stats based on level
    const levelMultiplier = 1 + (enemyLevel - 1) * 0.2; // 20% increase per level
    
    // Generate the enemy with scaled stats as a CombatEnemy
    return {
      id: selectedEnemy.id,
      name: selectedEnemy.name,
      level: enemyLevel,
      currentHealth: Math.round(selectedEnemy.baseHealth * levelMultiplier),
      maxHealth: Math.round(selectedEnemy.baseHealth * levelMultiplier),
      baseHealth: selectedEnemy.baseHealth,
      attack: Math.round(selectedEnemy.baseAttack * levelMultiplier),
      baseAttack: selectedEnemy.baseAttack,
      defense: Math.round(selectedEnemy.baseDefense * levelMultiplier),
      baseDefense: selectedEnemy.baseDefense,
      speed: Math.round(5 + Math.random() * 5), // Random speed between 5-10
      type: 'enemy',
      enemyType: 'normal',
      imageUrl: `/assets/enemies/${selectedEnemy.id}.png`,
      experience: Math.round(selectedEnemy.baseExp * levelMultiplier),
      experienceValue: Math.round(selectedEnemy.baseExp * levelMultiplier),
      gold: Math.round(selectedEnemy.baseGold * levelMultiplier),
      goldValue: Math.round(selectedEnemy.baseGold * levelMultiplier),
      essenceValue: Math.round((selectedEnemy.baseExp / 2) * levelMultiplier),
      critChance: 0.05,
      critMultiplier: 1.5,
      dodgeChance: 0.05,
      lootTable: [],
      abilities: [],
      statusEffects: [],
      skills: [],
      resistances: {} as Record<string, number>,
      immunities: [],
      weaknesses: []
    };
  }, []);
  
  return { generateEnemy };
};

export default useEnemyGeneration;
