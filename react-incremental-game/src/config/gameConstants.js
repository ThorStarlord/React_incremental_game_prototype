const GAME_TITLE = "React Incremental Game";
const MAX_LEVEL = 100;
const INITIAL_PLAYER_STATS = {
    health: 100,
    mana: 50,
    strength: 10,
    agility: 10,
    intelligence: 10,
};

const TRAIT_EFFECTS = {
    strength: {
        description: "Increases physical damage dealt.",
        multiplier: 1.5,
    },
    agility: {
        description: "Increases dodge chance.",
        multiplier: 1.2,
    },
    intelligence: {
        description: "Increases magic damage dealt.",
        multiplier: 1.5,
    },
};

const NPC_RELATIONSHIP_THRESHOLDS = {
    FRIEND: 50,
    ALLY: 75,
    BEST_FRIEND: 100,
};

const COMBAT_SETTINGS = {
    BASE_DAMAGE: 10,
    CRITICAL_HIT_CHANCE: 0.1,
    DODGE_CHANCE: 0.05,
};

const INVENTORY_LIMIT = 50;

export {
    GAME_TITLE,
    MAX_LEVEL,
    INITIAL_PLAYER_STATS,
    TRAIT_EFFECTS,
    NPC_RELATIONSHIP_THRESHOLDS,
    COMBAT_SETTINGS,
    INVENTORY_LIMIT,
};