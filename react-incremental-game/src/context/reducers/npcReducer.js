import { NPC_ACTIONS } from '../actions/actionTypes';

const initialState = {
    npcs: [],
    loading: false,
    error: null,
};

const npcReducer = (state = initialState, action) => {
    switch (action.type) {
        case NPC_ACTIONS.FETCH_NPCS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case NPC_ACTIONS.FETCH_NPCS_SUCCESS:
            return {
                ...state,
                loading: false,
                npcs: action.payload,
            };
        case NPC_ACTIONS.FETCH_NPCS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case NPC_ACTIONS.ADD_NPC:
            return {
                ...state,
                npcs: [...state.npcs, action.payload],
            };
        case NPC_ACTIONS.REMOVE_NPC:
            return {
                ...state,
                npcs: state.npcs.filter(npc => npc.id !== action.payload),
            };
        case NPC_ACTIONS.UPDATE_NPC:
            return {
                ...state,
                npcs: state.npcs.map(npc =>
                    npc.id === action.payload.id ? { ...npc, ...action.payload.data } : npc
                ),
            };
        default:
            return state;
    }
};

export default npcReducer;