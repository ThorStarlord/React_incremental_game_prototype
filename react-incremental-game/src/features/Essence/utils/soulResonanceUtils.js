// This file contains utility functions related to soul resonance in the Essence feature of the game.

export const calculateSoulResonance = (essence, multiplier) => {
    return essence * multiplier;
};

export const isResonanceActive = (resonanceLevel) => {
    return resonanceLevel > 0;
};

export const getResonanceEffect = (resonanceLevel) => {
    switch (resonanceLevel) {
        case 1:
            return "Minor effect activated.";
        case 2:
            return "Moderate effect activated.";
        case 3:
            return "Major effect activated.";
        default:
            return "No effect.";
    }
};