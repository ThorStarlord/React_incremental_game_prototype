const enemies = [
    { id: 1, name: 'Goblin', health: 30, attack: 5, experience: 50 },
    { id: 2, name: 'Orc', health: 50, attack: 10, experience: 100 }
];

export const getEnemies = () => {
    return enemies;
};

export const getEnemyById = (id) => {
    return enemies.find(enemy => enemy.id === id);
};