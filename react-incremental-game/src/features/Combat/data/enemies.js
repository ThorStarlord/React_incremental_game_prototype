const enemies = [
    {
        id: 1,
        name: "Goblin",
        health: 30,
        attack: 5,
        defense: 2,
        experience: 10,
        loot: ["Goblin Ear", "Gold Coin"],
        description: "A small, green creature known for its cunning and trickery."
    },
    {
        id: 2,
        name: "Orc",
        health: 50,
        attack: 10,
        defense: 5,
        experience: 20,
        loot: ["Orc Tooth", "Gold Coin"],
        description: "A brutish creature that thrives in battle, often found in warbands."
    },
    {
        id: 3,
        name: "Skeleton",
        health: 25,
        attack: 7,
        defense: 1,
        experience: 15,
        loot: ["Bone", "Gold Coin"],
        description: "An animated skeleton, often raised by dark magic."
    },
    {
        id: 4,
        name: "Dragon",
        health: 200,
        attack: 25,
        defense: 15,
        experience: 100,
        loot: ["Dragon Scale", "Gold Coin", "Rare Gem"],
        description: "A legendary creature known for its immense power and treasure hoards."
    }
];

export default enemies;