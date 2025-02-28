// This file contains utility functions related to traits in the game.

export const calculateTraitEffect = (baseValue, traitModifier) => {
    return baseValue * (1 + traitModifier);
};

export const getTraitDescription = (trait) => {
    return trait.description || "No description available.";
};

export const isTraitActive = (trait) => {
    return trait.isActive === true;
};

export const activateTrait = (trait) => {
    trait.isActive = true;
};

export const deactivateTrait = (trait) => {
    trait.isActive = false;
};