// NPC-related action creators
export const MEET_NPC = 'MEET_NPC';
export const UPDATE_NPC_RELATIONSHIP = 'UPDATE_NPC_RELATIONSHIP';
export const MARK_TRAIT_SEEN = 'MARK_TRAIT_SEEN';
export const UPDATE_DIALOGUE_STATE = 'UPDATE_DIALOGUE_STATE';
export const UPDATE_DIALOGUE_HISTORY = 'UPDATE_DIALOGUE_HISTORY';

export const meetNPC = (npcId) => ({
  type: MEET_NPC,
  payload: { npcId }
});

export const updateNPCRelationship = (npcId, changeAmount, source = 'interaction') => ({
  type: UPDATE_NPC_RELATIONSHIP,
  payload: { npcId, changeAmount, source }
});

export const markTraitSeen = (traitId) => ({
  type: MARK_TRAIT_SEEN,
  payload: { traitId }
});

export const updateDialogueState = (npcId, dialogueBranch) => ({
  type: UPDATE_DIALOGUE_STATE,
  payload: { npcId, dialogueBranch }
});

export const updateDialogueHistory = (npcId, dialogueId, choice, choiceIndex, relationshipChange = 0) => ({
  type: UPDATE_DIALOGUE_HISTORY,
  payload: { npcId, dialogueId, choice, choiceIndex, relationshipChange }
});