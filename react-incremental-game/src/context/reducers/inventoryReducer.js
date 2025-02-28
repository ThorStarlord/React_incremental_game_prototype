// This file contains the inventory reducer for managing inventory state in the application.

const initialState = {
    items: [],
    selectedItem: null,
};

const inventoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id),
            };
        case 'SELECT_ITEM':
            return {
                ...state,
                selectedItem: action.payload,
            };
        case 'DESELECT_ITEM':
            return {
                ...state,
                selectedItem: null,
            };
        default:
            return state;
    }
};

export default inventoryReducer;