import { CREATE_ESSENCE, CONSUME_ESSENCE } from '../actions/actionTypes';

const initialState = {
    totalEssence: 0,
};

const essenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ESSENCE:
            return {
                ...state,
                totalEssence: state.totalEssence + action.payload,
            };
        case CONSUME_ESSENCE:
            return {
                ...state,
                totalEssence: Math.max(state.totalEssence - action.payload, 0),
            };
        default:
            return state;
    }
};

export default essenceReducer;