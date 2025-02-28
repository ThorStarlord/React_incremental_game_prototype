const dungeons = [
    {
        id: 1,
        name: "Goblin Cave",
        description: "A dark and damp cave inhabited by goblins.",
        difficulty: "Easy",
        rewards: {
            experience: 100,
            loot: ["Goblin Sword", "Goblin Shield"]
        },
        enemies: [
            {
                type: "Goblin",
                count: 5
            }
        ]
    },
    {
        id: 2,
        name: "Haunted Ruins",
        description: "Ancient ruins haunted by restless spirits.",
        difficulty: "Medium",
        rewards: {
            experience: 250,
            loot: ["Spirit Amulet", "Ancient Tome"]
        },
        enemies: [
            {
                type: "Spirit",
                count: 3
            },
            {
                type: "Skeleton",
                count: 2
            }
        ]
    },
    {
        id: 3,
        name: "Dragon's Lair",
        description: "The lair of a fearsome dragon, filled with treasure.",
        difficulty: "Hard",
        rewards: {
            experience: 500,
            loot: ["Dragon Scale", "Treasure Chest"]
        },
        enemies: [
            {
                type: "Dragon",
                count: 1
            }
        ]
    }
];

export default dungeons;