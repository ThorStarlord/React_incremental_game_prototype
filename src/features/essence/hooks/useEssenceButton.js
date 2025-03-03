import { useState, useCallback } from 'react';
import { useGameDispatch } from '../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../context/actions/actionTypes';

/**
 * Hook for handling essence button functionality
 */
const useEssenceButton = (defaultAmount = 10, cooldownTime = 1000) => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  
  /**
   * Handle gaining essence
   * @param {number} amount - Amount of essence to gain (defaults to the hook's defaultAmount)
   */
  const handleEssenceGain = useCallback((amount = defaultAmount) => {
    if (isOnCooldown) return;
    
    // Dispatch action directly
    dispatch({
      type: ACTION_TYPES.GAIN_ESSENCE,
      payload: { 
        amount,
        source: 'essence_button_hook'
      }
    });
    
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), cooldownTime);
  }, [dispatch, isOnCooldown, defaultAmount, cooldownTime]);
  
  return {
    isOnCooldown,
    handleEssenceGain
  };
};

export default useEssenceButton;
