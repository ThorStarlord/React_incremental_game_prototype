const quests = [
    {
        id: 1,
        title: "The Lost Artifact",
        description: "Find the ancient artifact hidden in the ruins.",
        rewards: {
            experience: 100,
            items: ["Ancient Coin", "Mystic Gem"]
        },
        prerequisites: [],
        status: "available"
    },
    {
        id: 2,
        title: "A Call to Arms",
        description: "Join the battle against the invading forces.",
        rewards: {
            experience: 200,
            items: ["Warrior's Shield"]
        },
        prerequisites: [1],
        status: "available"
    },
    {
        id: 3,
        title: "The Healer's Request",
        description: "Collect herbs for the village healer.",
        rewards: {
            experience: 50,
            items: ["Health Potion"]
        },
        prerequisites: [],
        status: "available"
    },
    {
        id: 4,
        title: "The Dark Forest",
        description: "Explore the dark forest and report back.",
        rewards: {
            experience: 150,
            items: ["Forest Map"]
        },
        prerequisites: [3],
        status: "available"
    },
    {
        id: 5,
        title: "Beneath the Waves",
        description: "Investigate the mysterious happenings in the coastal town.",
        rewards: {
            experience: 250,
            items: ["Mermaid's Tear"]
        },
        prerequisites: [2],
        status: "available"
    }
];

export default quests;