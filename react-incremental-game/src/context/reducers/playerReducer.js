import { PLAYER_ACTIONS } from '../actions/actionTypes';

const initialState = {
    stats: {
        health: 100,
        mana: 100,
        experience: 0,
        level: 1,
    },
    traits: [],
};

const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case PLAYER_ACTIONS.UPDATE_STATS:
            return {
                ...state,
                stats: {
                    ...state.stats,
                    ...action.payload,
                },
            };
        case PLAYER_ACTIONS.ADD_TRAIT:
            return {
                ...state,
                traits: [...state.traits, action.payload],
            };
        case PLAYER_ACTIONS.REMOVE_TRAIT:
            return {
                ...state,
                traits: state.traits.filter(trait => trait.id !== action.payload.id),
            };
        default:
            return state;
    }
};

export default playerReducer;