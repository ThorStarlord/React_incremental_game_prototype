// This file contains utility functions for managing application state.

export const getStateFromLocalStorage = (key) => {
    const storedState = localStorage.getItem(key);
    return storedState ? JSON.parse(storedState) : null;
};

export const saveStateToLocalStorage = (key, state) => {
    localStorage.setItem(key, JSON.stringify(state));
};

export const clearStateFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};