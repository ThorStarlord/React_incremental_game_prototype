/**
 * Simple enemies data file for basic encounters
 * This provides a simplified enemy interface for components that don't need
 * the full complexity of the combat system
 */

/**
 * Interface for Enemy object
 */
export interface Enemy {
    id: number;
    name: string;
    health: number;
    attack: number;
    experience: number;
  }
  
  /**
   * Basic enemies list
   */
  const enemies: Enemy[] = [
    { id: 1, name: 'Goblin', health: 30, attack: 5, experience: 50 },
    { id: 2, name: 'Orc', health: 50, attack: 10, experience: 100 }
  ];
  
  /**
   * Get all available enemies
   */
  export const getEnemies = (): Enemy[] => {
    return enemies;
  };
  
  /**
   * Get a specific enemy by ID
   */
  export const getEnemyById = (id: number): Enemy | undefined => {
    return enemies.find(enemy => enemy.id === id);
  };