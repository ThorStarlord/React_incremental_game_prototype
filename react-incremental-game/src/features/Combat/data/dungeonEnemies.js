const dungeonEnemies = [
    {
        id: 1,
        name: "Goblin",
        health: 30,
        attack: 5,
        defense: 2,
        experience: 10,
        loot: ["Goblin Tooth", "Gold Coin"],
        description: "A small, green creature known for its cunning and trickery."
    },
    {
        id: 2,
        name: "Skeleton",
        health: 40,
        attack: 7,
        defense: 3,
        experience: 15,
        loot: ["Bone", "Rusty Sword"],
        description: "An animated skeleton, often found guarding ancient tombs."
    },
    {
        id: 3,
        name: "Orc",
        health: 50,
        attack: 10,
        defense: 5,
        experience: 20,
        loot: ["Orcish Axe", "Gold Coin"],
        description: "A brutish creature known for its strength and ferocity."
    },
    {
        id: 4,
        name: "Zombie",
        health: 35,
        attack: 6,
        defense: 1,
        experience: 12,
        loot: ["Rotten Flesh", "Gold Coin"],
        description: "A reanimated corpse, driven by a hunger for flesh."
    },
    {
        id: 5,
        name: "Dark Mage",
        health: 45,
        attack: 12,
        defense: 4,
        experience: 25,
        loot: ["Spellbook", "Magic Wand"],
        description: "A powerful sorcerer who wields dark magic."
    }
];

export default dungeonEnemies;