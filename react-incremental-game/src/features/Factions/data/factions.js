const factions = [
    {
        id: 1,
        name: "The Guardians",
        description: "A faction dedicated to protecting the realm and its inhabitants.",
        members: [
            { name: "Eldrin", role: "Leader" },
            { name: "Thalia", role: "Warrior" },
            { name: "Garrick", role: "Mage" }
        ],
        resources: {
            gold: 1000,
            food: 500,
            supplies: 300
        }
    },
    {
        id: 2,
        name: "The Shadows",
        description: "A secretive faction that operates in the dark, gathering information and influence.",
        members: [
            { name: "Kira", role: "Assassin" },
            { name: "Ronan", role: "Spy" },
            { name: "Zara", role: "Thief" }
        ],
        resources: {
            gold: 800,
            food: 200,
            supplies: 150
        }
    },
    {
        id: 3,
        name: "The Scholars",
        description: "A faction focused on knowledge, magic, and the pursuit of wisdom.",
        members: [
            { name: "Alaric", role: "Archmage" },
            { name: "Lyra", role: "Researcher" },
            { name: "Fenwick", role: "Alchemist" }
        ],
        resources: {
            gold: 600,
            food: 300,
            supplies: 500
        }
    }
];

export default factions;