export const ADD_NPC = 'ADD_NPC';
export const REMOVE_NPC = 'REMOVE_NPC';
export const UPDATE_NPC = 'UPDATE_NPC';
export const SET_NPC_RELATIONSHIP = 'SET_NPC_RELATIONSHIP';

export const addNPC = (npc) => ({
    type: ADD_NPC,
    payload: npc,
});

export const removeNPC = (npcId) => ({
    type: REMOVE_NPC,
    payload: npcId,
});

export const updateNPC = (npc) => ({
    type: UPDATE_NPC,
    payload: npc,
});

export const setNPCRelationship = (npcId, relationship) => ({
    type: SET_NPC_RELATIONSHIP,
    payload: { npcId, relationship },
});