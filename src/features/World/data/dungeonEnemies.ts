/**
 * Dungeon enemies data file
 */

// DungeonEnemy interface - much simpler than the full Combat Enemy
export interface Enemy {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  essenceDrop: number;
  goldDrop: number;
  portrait?: string;
  traits: string[];
}

// Export as DungeonEnemy to avoid type conflicts
export type DungeonEnemy = Enemy;

// Sample dungeon enemies
export const dungeonEnemies: DungeonEnemy[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    hp: 30,
    attack: 5,
    defense: 2,
    essenceDrop: 5,
    goldDrop: 10,
    portrait: 'goblin.png',
    traits: []
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    hp: 45,
    attack: 7,
    defense: 3,
    essenceDrop: 8,
    goldDrop: 15,
    portrait: 'skeleton.png',
    traits: []
  }
];

// Helper function to get enemy by ID
export const getEnemyById = (id: string): DungeonEnemy | undefined => {
  return dungeonEnemies.find(enemy => enemy.id === id);
};
