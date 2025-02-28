export const updatePlayerStats = (stats) => ({
    type: 'UPDATE_PLAYER_STATS',
    payload: stats,
});

export const resetPlayerStats = () => ({
    type: 'RESET_PLAYER_STATS',
});

export const setPlayerTraits = (traits) => ({
    type: 'SET_PLAYER_TRAITS',
    payload: traits,
});

export const addPlayerTrait = (trait) => ({
    type: 'ADD_PLAYER_TRAIT',
    payload: trait,
});

export const removePlayerTrait = (traitId) => ({
    type: 'REMOVE_PLAYER_TRAIT',
    payload: traitId,
});