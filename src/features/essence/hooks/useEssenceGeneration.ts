import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';

/**
 * Interface for the return value of the useEssenceGeneration hook
 */
interface EssenceGenerationHook {
  /** Current essence amount */
  essence: number;
  /** Maximum essence capacity */
  maxEssence: number;
  /** Rate of essence generation per minute */
  generationRate: number;
  /** Function to generate essence based on time elapsed */
  generateEssence: (timeElapsed?: number) => void;
  /** Function to spend essence */
  spendEssence: (amount: number) => boolean;
}

/**
 * Custom hook for essence generation and management
 * 
 * Provides access to essence values and functions to generate/spend essence
 * 
 * @returns Essence data and management functions
 */
export default function useEssenceGeneration(): EssenceGenerationHook {
  // Use Redux selectors to get essence data from the store
  const essence = useSelector((state: RootState) => state.essence?.amount || 0);
  const maxEssence = useSelector((state: RootState) => state.essence?.maxAmount || 100);
  const generationRate = useSelector((state: RootState) => state.essence?.generationRate || 1);
  
  // Get player level and traits that might affect essence generation
  const playerLevel = useSelector((state: RootState) => state.player?.level || 1);
  const playerTraits = useSelector((state: RootState) => state.player?.equippedTraits || []);
  
  // Get the Redux dispatch function
  const dispatch = useDispatch();

  /**
   * Generate essence based on elapsed time
   * @param timeElapsed - Time elapsed in milliseconds (defaults to 1 minute)
   */
  const generateEssence = useCallback((timeElapsed: number = 60000) => {
    // Calculate base amount to generate (timeElapsed is in ms, convert to minutes)
    const timeInMinutes = timeElapsed / 60000;
    let amount = generationRate * timeInMinutes;
    
    // Apply level bonus (1% per level)
    amount *= (1 + (playerLevel - 1) * 0.01);
    
    // Apply trait bonuses if needed
    // This would check for traits that boost essence generation
    // Simplified implementation for now
    const traitBonus = playerTraits.reduce((bonus, traitId) => {
      // Example: If trait 'essence_boost' exists, add 10% bonus
      if (traitId === 'essence_boost') return bonus + 0.1;
      return bonus;
    }, 0);
    
    amount *= (1 + traitBonus);
    
    // Round to 2 decimal places
    amount = Math.round(amount * 100) / 100;
    
    // Dispatch action to update essence in the Redux store
    dispatch({ 
      type: 'essence/generateEssence', 
      payload: amount 
    });
  }, [dispatch, generationRate, playerLevel, playerTraits]);

  /**
   * Spend essence if player has enough
   * @param amount - Amount of essence to spend
   * @returns Whether the transaction was successful
   */
  const spendEssence = useCallback((amount: number): boolean => {
    if (essence < amount) return false;
    
    // Dispatch action to spend essence in Redux store
    dispatch({ 
      type: 'essence/spendEssence', 
      payload: amount 
    });
    
    return true;
  }, [essence, dispatch]);

  return {
    essence,
    maxEssence,
    generationRate,
    generateEssence,
    spendEssence
  };
}
