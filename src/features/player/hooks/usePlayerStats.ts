import { useGameState } from '../../../context/GameStateContext';
import { useGameDispatch } from '../../../context/GameDispatchContext';

/**
 * Interface for player stat update payload
 */
interface StatUpdatePayload {
    [key: string]: number;
}

/**
 * Hook for accessing and updating player stats
 * 
 * Provides a way to read and modify player statistics directly
 * 
 * @returns Object with player stats and update function
 */
const usePlayerStats = () => {
    const gameState = useGameState();
    const dispatch = useGameDispatch();
    
    const playerStats = gameState.player?.stats || {};
    
    /**
     * Update player stats with new values
     * 
     * @param stats - Object with stat keys and their new values
     */
    const updateStats = (stats: StatUpdatePayload) => {
        dispatch({
            type: 'UPDATE_PLAYER_STATS',
            payload: stats
        });
    };
    
    return {
        stats: playerStats,
        updateStats
    };
};

export default usePlayerStats;
