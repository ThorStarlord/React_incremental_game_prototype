export const saveGame = (gameState) => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
};

export const loadGame = () => {
    const gameState = localStorage.getItem('gameState');
    return gameState ? JSON.parse(gameState) : null;
};