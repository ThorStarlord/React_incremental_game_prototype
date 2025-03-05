import { useContext } from 'react';
import { GameStateContext } from '../../context/GameStateContext';

/**
 * Interface for player stat update payload
 */
interface UpdatePlayerStatPayload {
    statName: string;
    value: number;
}

/**
 * Custom hook for accessing and updating player stats
 * 
 * @returns Object containing player stats and a function to update them
 */
const usePlayerStats = () => {
    const { state, dispatch } = useContext(GameStateContext);
    
    const playerStats = state.player.stats;

    /**
     * Updates a specific player stat
     * 
     * @param statName - The name of the stat to update
     * @param value - The new value for the stat
     */
    const updatePlayerStat = (statName: string, value: number): void => {
        dispatch({
            type: 'UPDATE_PLAYER_STAT',
            payload: { statName, value } as UpdatePlayerStatPayload,
        });
    };

    return {
        playerStats,
        updatePlayerStat,
    };
};

export default usePlayerStats;
