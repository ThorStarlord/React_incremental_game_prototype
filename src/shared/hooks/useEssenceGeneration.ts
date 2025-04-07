import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { useGameState, useGameDispatch } from '../../context/GameStateExports';

/**
 * Hook for generating essence over time
 * 
 * This is a compatibility version that works with both context and Redux approaches
 */
export function useEssenceGeneration(baseRate: number = 1) {
  const dispatch = useDispatch();
  const gameDispatch = useGameDispatch(); // For backward compatibility
  
  // Get state from Redux
  const essence = useSelector((state: RootState) => state.essence?.amount || 0);
  const essenceMultiplier = useSelector((state: RootState) => state.essence?.multiplier || 1);
  
  // Also use the compatibility layer for backward compatibility
  const gameState = useGameState();
  
  // Local state for the hook
  const [rate, setRate] = useState(baseRate);
  
  useEffect(() => {
    // Calculate actual rate based on multipliers and bonuses
    const calculatedRate = baseRate * essenceMultiplier;
    setRate(calculatedRate);
    
    // Set up interval for essence generation
    const interval = setInterval(() => {
      // Dispatch to both Redux and the compatibility layer
      dispatch({ type: 'essence/addEssence', payload: calculatedRate });
      
      // For backward compatibility, if needed
      gameDispatch({ 
        type: 'UPDATE_ESSENCE', 
        payload: { amount: calculatedRate } 
      });
    }, 10000); // Generate essence every 10 seconds
    
    return () => clearInterval(interval);
  }, [baseRate, essenceMultiplier, dispatch, gameDispatch]);
  
  return {
    currentEssence: essence,
    generationRate: rate,
    essencePerHour: rate * 360 // 10 seconds * 360 = 1 hour
  };
}

export default useEssenceGeneration;
