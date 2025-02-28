export const initialState = {
    player: {
        stats: {
            health: 100,
            mana: 50,
            strength: 10,
            agility: 10,
            intelligence: 10,
        },
        traits: [],
        inventory: [],
    },
    npcs: [],
    essence: {
        current: 0,
        generationRate: 1,
    },
    quests: [],
    factions: [],
    combat: {
        activeEnemies: [],
        battleLog: [],
    },
    world: {
        regions: [],
        currentRegion: null,
    },
    minions: [],
};