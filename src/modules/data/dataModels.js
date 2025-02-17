export const RegionModel = {
    id: String,
    name: String,
    description: String,
    features: [String],
    dangers: [String],
    resources: [String],
    townIds: [String],
    dungeonIds: [String],
};

export const TownModel = {
    id: String,
    name: String,
    type: String,
    description: String,
    regionId: String,
    npcIds: [Number],
};

export const DungeonModel = {
    id: String,
    name: String,
    type: String,
    description: String,
    regionId: String,
    dangers: [String],
    rewards: [String],
};

export const RouteModel = {
    id: String,
    name: String,
    description: String,
    regionIds: [String],
    townIds: [String],
    dangers: [String],
};