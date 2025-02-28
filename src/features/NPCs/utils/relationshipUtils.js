// This file contains utility functions for managing relationships between NPCs in the game.

export const calculateRelationshipScore = (npc1, npc2) => {
    // Example calculation based on some attributes of the NPCs
    return (npc1.friendliness + npc2.friendliness) / 2;
};

export const updateRelationshipStatus = (npc1, npc2, change) => {
    // Update the relationship status based on some change value
    const newScore = calculateRelationshipScore(npc1, npc2) + change;
    return newScore < 0 ? 0 : newScore; // Ensure score doesn't go below 0
};

export const getRelationshipDescription = (score) => {
    if (score > 80) return 'Best Friends';
    if (score > 50) return 'Friends';
    if (score > 20) return 'Acquaintances';
    return 'Strangers';
};