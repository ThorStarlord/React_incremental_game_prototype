import { useContext } from 'react';
import { GameStateContext } from '../../context/GameStateContext';

const usePlayerStats = () => {
    const { state, dispatch } = useContext(GameStateContext);
    
    const playerStats = state.player.stats;

    const updatePlayerStat = (statName, value) => {
        dispatch({
            type: 'UPDATE_PLAYER_STAT',
            payload: { statName, value },
        });
    };

    return {
        playerStats,
        updatePlayerStat,
    };
};

export default usePlayerStats;