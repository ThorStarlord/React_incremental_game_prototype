import { DungeonEnemy } from '../../../context/types/combat/EnemyTypes';

/**
 * Dungeon Enemies data file
 * Contains enemy definitions for different dungeons
 */

/**
 * Dungeon enemy data organized by dungeon ID
 */
export const dungeonEnemies: Record<string, DungeonEnemy[]> = {
  'dungeon-1': [
    {
      id: 'goblin-1',
      name: 'Goblin Scout',
      maxHealth: 30,
      currentHealth: 30,
      attack: 4,
      defense: 2,
      level: 1,
      essenceValue: 5,
      goldValue: 8,
      experienceValue: 10,
      portrait: 'goblin_scout',
      traits: ['small', 'agile']
    },
    {
      id: 'goblin-2',
      name: 'Goblin Warrior',
      maxHealth: 45,
      currentHealth: 45,
      attack: 6,
      defense: 3,
      level: 2,
      essenceValue: 8,
      goldValue: 12,
      experienceValue: 15,
      portrait: 'goblin_warrior',
      traits: ['aggressive']
    },
    {
      id: 'goblin-3',
      name: 'Goblin Shaman',
      maxHealth: 35,
      currentHealth: 35,
      attack: 8,
      defense: 1,
      level: 3,
      essenceValue: 10,
      goldValue: 15,
      experienceValue: 20,
      portrait: 'goblin_shaman',
      traits: ['magical', 'healer']
    }
  ],
  'dungeon-2': [
    {
      id: 'skeleton-1',
      name: 'Skeleton Archer',
      maxHealth: 40,
      currentHealth: 40,
      attack: 7,
      defense: 2,
      level: 1,
      essenceValue: 10,
      goldValue: 15,
      experienceValue: 12,
      portrait: 'skeleton_archer',
      traits: ['undead', 'ranged']
    },
    {
      id: 'skeleton-2',
      name: 'Skeleton Knight',
      maxHealth: 60,
      currentHealth: 60,
      attack: 8,
      defense: 5,
      level: 2,
      essenceValue: 15,
      goldValue: 20,
      experienceValue: 18,
      portrait: 'skeleton_knight',
      traits: ['undead', 'armored']
    },
    {
      id: 'zombie-1',
      name: 'Rotting Zombie',
      maxHealth: 70,
      currentHealth: 70,
      attack: 6,
      defense: 3,
      level: 3,
      essenceValue: 12,
      goldValue: 18,
      experienceValue: 22,
      portrait: 'rotting_zombie',
      traits: ['undead', 'poisonous']
    }
  ],
  'dungeon-3': [
    {
      id: 'demon-1',
      name: 'Lesser Demon',
      maxHealth: 75,
      currentHealth: 75,
      attack: 10,
      defense: 7,
      level: 1,
      essenceValue: 20,
      goldValue: 25,
      experienceValue: 30,
      portrait: 'lesser_demon',
      traits: ['demonic', 'fireResistant']
    },
    {
      id: 'demon-2',
      name: 'Demon Overseer',
      maxHealth: 100,
      currentHealth: 100,
      attack: 15,
      defense: 10,
      level: 2,
      essenceValue: 30,
      goldValue: 40,
      experienceValue: 40,
      portrait: 'demon_overseer',
      traits: ['demonic', 'commander']
    },
    {
      id: 'hellhound-1',
      name: 'Hellhound',
      maxHealth: 65,
      currentHealth: 65,
      attack: 12,
      defense: 5,
      level: 3,
      essenceValue: 18,
      goldValue: 22,
      experienceValue: 25,
      portrait: 'hellhound',
      traits: ['beast', 'fireBreath']
    }
  ]
};

/**
 * Get all enemies for a specific dungeon
 * @param dungeonId The ID of the dungeon
 * @returns Array of enemies for the dungeon
 */
export function getEnemiesForDungeon(dungeonId: string): DungeonEnemy[] {
  return dungeonEnemies[dungeonId] || [];
}

/**
 * Get a random enemy from a specific dungeon
 * @param dungeonId The ID of the dungeon
 * @returns A random enemy or null if no enemies exist
 */
export function getRandomEnemyFromDungeon(dungeonId: string): DungeonEnemy | null {
  const enemies = getEnemiesForDungeon(dungeonId);
  if (enemies.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * enemies.length);
  return enemies[randomIndex];
}

// Remove the adaptToCombatEnemy function from here as it's now centralized
