export const updatePlayerStats = (stats) => ({
    type: 'UPDATE_PLAYER_STATS',
    payload: stats,
});

export const addItemToInventory = (item) => ({
    type: 'ADD_ITEM_TO_INVENTORY',
    payload: item,
});

export const removeItemFromInventory = (itemId) => ({
    type: 'REMOVE_ITEM_FROM_INVENTORY',
    payload: itemId,
});

export const setNPCRelations = (relations) => ({
    type: 'SET_NPC_RELATIONS',
    payload: relations,
});

export const updateQuestProgress = (questId, progress) => ({
    type: 'UPDATE_QUEST_PROGRESS',
    payload: { questId, progress },
});

export const createFaction = (faction) => ({
    type: 'CREATE_FACTION',
    payload: faction,
});

export const updateFaction = (factionId, updates) => ({
    type: 'UPDATE_FACTION',
    payload: { factionId, updates },
});