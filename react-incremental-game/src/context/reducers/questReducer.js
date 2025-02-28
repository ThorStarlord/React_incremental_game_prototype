import { ADD_QUEST, REMOVE_QUEST, UPDATE_QUEST } from '../actions/actionTypes';

const initialState = {
    quests: [],
};

const questReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_QUEST:
            return {
                ...state,
                quests: [...state.quests, action.payload],
            };
        case REMOVE_QUEST:
            return {
                ...state,
                quests: state.quests.filter(quest => quest.id !== action.payload.id),
            };
        case UPDATE_QUEST:
            return {
                ...state,
                quests: state.quests.map(quest =>
                    quest.id === action.payload.id ? { ...quest, ...action.payload.updates } : quest
                ),
            };
        default:
            return state;
    }
};

export default questReducer;