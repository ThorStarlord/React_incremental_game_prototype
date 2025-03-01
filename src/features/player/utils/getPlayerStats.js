export const getPlayer = () => {
    return player;
};

export const updatePlayer = (updates) => {
    Object.assign(player, updates);
};

export const getPlayerName = () => {
    return player.name;
};

export const getPlayerLevel = () => {
    return player.level;
};

export const getPlayerHealth = () => {
    return player.health;
};

export const getPlayerMaxHealth = () => {
    return player.maxHealth;
};

export const getPlayerEnergy = () => {
    return player.energy;
};

export const getPlayerMaxEnergy = () => {
    return player.maxEnergy;
};

export const getPlayerExperience = () => {
    return player.experience;
};

export const getPlayerMaxExperience = () => {
    return player.maxExperience;
};