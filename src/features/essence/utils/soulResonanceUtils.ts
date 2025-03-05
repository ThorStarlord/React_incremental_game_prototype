// This file contains utility functions related to soul resonance in the Essence feature of the game.

/**
 * Interface for resonance level effects
 */
interface ResonanceEffect {
    description: string;
    level: number;
}

/**
 * Calculate the soul resonance value based on essence and multiplier
 * 
 * @param {number} essence - Current essence amount
 * @param {number} multiplier - Resonance multiplier
 * @returns {number} Calculated resonance value
 */
export const calculateSoulResonance = (essence: number, multiplier: number): number => {
    return essence * multiplier;
};

/**
 * Check if resonance is active based on its level
 * 
 * @param {number} resonanceLevel - Current resonance level
 * @returns {boolean} Whether resonance is active
 */
export const isResonanceActive = (resonanceLevel: number): boolean => {
    return resonanceLevel > 0;
};

/**
 * Get the effect description for the current resonance level
 * 
 * @param {number} resonanceLevel - Current resonance level
 * @returns {string} Description of the resonance effect
 */
export const getResonanceEffect = (resonanceLevel: number): string => {
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

/**
 * Get all possible resonance effects
 * 
 * @returns {ResonanceEffect[]} Array of all resonance effects
 */
export const getAllResonanceEffects = (): ResonanceEffect[] => {
    return [
        { level: 0, description: "No effect." },
        { level: 1, description: "Minor effect activated." },
        { level: 2, description: "Moderate effect activated." },
        { level: 3, description: "Major effect activated." }
    ];
};
