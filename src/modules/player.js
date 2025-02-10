const player = {
    name: 'Hero',
    level: 1,
    health: 100,
    experience: 0,
    inventory: [],
    quests: []
};

export const getPlayer = () => {
    return player;
};

export const updatePlayer = (updates) => {
    Object.assign(player, updates);
};

export const addItemToInventory = (item) => {
    player.inventory.push(item);
};

export const addQuest = (quest) => {
    player.quests.push(quest);
};