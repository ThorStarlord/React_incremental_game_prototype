// This file contains utility functions related to quests in the game.

export const getQuestById = (quests, id) => {
    return quests.find(quest => quest.id === id);
};

export const getActiveQuests = (quests) => {
    return quests.filter(quest => quest.isActive);
};

export const completeQuest = (quests, id) => {
    return quests.map(quest => 
        quest.id === id ? { ...quest, isActive: false, isCompleted: true } : quest
    );
};

export const addQuest = (quests, newQuest) => {
    return [...quests, newQuest];
};

export const removeQuest = (quests, id) => {
    return quests.filter(quest => quest.id !== id);
};