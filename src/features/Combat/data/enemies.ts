/**
 * Interface for Enemy object
 */
interface Enemy {
  id: number;
  name: string;
  health: number;
  attack: number;
  experience: number;
}

const enemies: Enemy[] = [
    { id: 1, name: 'Goblin', health: 30, attack: 5, experience: 50 },
    { id: 2, name: 'Orc', health: 50, attack: 10, experience: 100 }
];

export const getEnemies = (): Enemy[] => {
    return enemies;
};

export const getEnemyById = (id: number): Enemy | undefined => {
    return enemies.find(enemy => enemy.id === id);
};
