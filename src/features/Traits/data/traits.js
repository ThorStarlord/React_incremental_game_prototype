const traits = [
    {
        id: 1,
        name: "Bravery",
        description: "Increases the player's courage in battle, reducing fear effects.",
        effect: {
            type: "statBoost",
            stat: "courage",
            value: 10,
        },
    },
    {
        id: 2,
        name: "Wisdom",
        description: "Enhances decision-making abilities, improving strategy in combat.",
        effect: {
            type: "statBoost",
            stat: "intelligence",
            value: 15,
        },
    },
    {
        id: 3,
        name: "Agility",
        description: "Boosts the player's speed, allowing for quicker movements.",
        effect: {
            type: "statBoost",
            stat: "speed",
            value: 20,
        },
    },
    {
        id: 4,
        name: "Strength",
        description: "Increases physical power, enhancing damage dealt in combat.",
        effect: {
            type: "statBoost",
            stat: "strength",
            value: 25,
        },
    },
    {
        id: 5,
        name: "Charisma",
        description: "Improves interactions with NPCs, increasing relationship gains.",
        effect: {
            type: "relationshipBoost",
            value: 5,
        },
    },
];

export default traits;