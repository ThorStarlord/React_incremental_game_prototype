// This file contains utility functions for managing local storage in the application.

export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error("Error saving to local storage", error);
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        return serializedValue === null ? undefined : JSON.parse(serializedValue);
    } catch (error) {
        console.error("Error loading from local storage", error);
        return undefined;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from local storage", error);
    }
};