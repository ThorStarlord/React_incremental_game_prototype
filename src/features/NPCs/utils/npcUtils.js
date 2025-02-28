// This file contains utility functions related to non-player characters (NPCs) in the game.

export const getNPCById = (npcs, id) => {
    return npcs.find(npc => npc.id === id);
};

export const getNPCsByFaction = (npcs, factionId) => {
    return npcs.filter(npc => npc.factionId === factionId);
};

export const getNPCDialogue = (npc, dialogues) => {
    return dialogues[npc.dialogueId] || [];
};

export const calculateRelationshipScore = (npc, player) => {
    return npc.baseRelationshipScore + (player.traits.relationshipBonus || 0);
};