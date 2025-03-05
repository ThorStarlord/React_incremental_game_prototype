import { useState, useCallback } from 'react';
import { useGameDispatch } from '../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../context/actions/actionTypes';

/**
 * Interface for useEssenceButton hook return value
 */
interface UseEssenceButtonReturn {
  isOnCooldown: boolean;
  handleEssenceGain: (amount?: number) => void;
}

/**
 * Hook for handling essence button functionality
 * 
 * @param defaultAmount - Default amount of essence to gain
 * @param cooldownTime - Cooldown time in milliseconds
 * @returns Object with cooldown state and essence gain handler
 */
const useEssenceButton = (defaultAmount: number = 10, cooldownTime: number = 1000): UseEssenceButtonReturn => {
  const dispatch = useGameDispatch();
  const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
  
  /**
   * Handle gaining essence
   * @param {number} amount - Amount of essence to gain (defaults to the hook's defaultAmount)
   */
  const handleEssenceGain = useCallback((amount: number = defaultAmount): void => {
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
