import React, { createContext, useReducer } from 'react';
import { rootReducer } from './reducers/rootReducer';
import { initialState } from './initialState';

export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GameStateContext.Provider>
    );
};