export const ADD_QUEST = 'ADD_QUEST';
export const REMOVE_QUEST = 'REMOVE_QUEST';
export const UPDATE_QUEST_STATUS = 'UPDATE_QUEST_STATUS';

export const addQuest = (quest) => ({
    type: ADD_QUEST,
    payload: quest,
});

export const removeQuest = (questId) => ({
    type: REMOVE_QUEST,
    payload: questId,
});

export const updateQuestStatus = (questId, status) => ({
    type: UPDATE_QUEST_STATUS,
    payload: { questId, status },
});