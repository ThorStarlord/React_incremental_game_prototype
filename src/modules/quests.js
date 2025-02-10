const quests = [
    { id: 1, name: 'Defeat the Goblin', description: 'Defeat the Goblin in the forest.', reward: { experience: 100, item: 1 } },
    { id: 2, name: 'Find the Lost Sword', description: 'Find the lost sword in the cave.', reward: { experience: 200, item: 2 } }
];

export const getQuests = () => {
    return quests;
};

export const getQuestById = (id) => {
    return quests.find(quest => quest.id === id);
};