import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { gainEssence, updateGenerationRate } from '../state/EssenceSlice'; 
import { selectEquippedTraitIds } from '../../Traits/state/TraitsSelectors';
import { selectEssenceState, selectGenerationRate } from '../state/EssenceSelectors';

/**
 * Custom hook to manage essence generation based on game state.
 * 
 * Provides manual essence generation functionality and calculates
 * generation rates based on player progression and equipped traits.
 */
const useEssenceGeneration = () => {
  const dispatch = useAppDispatch();
  
  // Get essence state using selectors
  const essence = useAppSelector(selectEssenceState);
  const currentGenerationRate = useAppSelector(selectGenerationRate);
  
  // Get traits that might affect essence generation
  const equippedTraitIds = useAppSelector(selectEquippedTraitIds); 
  
  // Calculate trait bonuses for essence generation
  const calculateTraitBonus = useCallback(() => {
    return equippedTraitIds.reduce((bonus: number, traitId: string) => {
      // Example trait bonuses - adjust based on actual trait definitions
      switch (traitId) {
        case 'essence_boost':
          return bonus + 0.1; // 10% bonus
        case 'growing_affinity':
          return bonus + 0.05; // 5% bonus
        default:
          return bonus;
      }
    }, 1.0); // Start with 1.0 (no bonus)
  }, [equippedTraitIds]);

  // Calculate total generation rate including bonuses
  const calculateTotalRate = useCallback(() => {
    const baseRate = essence.generationRate || 0;
    const traitMultiplier = calculateTraitBonus();
    return baseRate * traitMultiplier;
  }, [essence.generationRate, calculateTraitBonus]);

  // Update generation rate when bonuses change
  useEffect(() => {
    const newRate = calculateTotalRate();
    if (Math.abs(newRate - currentGenerationRate) > 0.01) { // Avoid unnecessary updates
      dispatch(updateGenerationRate(newRate));
    }
  }, [calculateTotalRate, currentGenerationRate, dispatch]);

  // Manual essence generation function
  const generateEssence = useCallback((amount: number) => {
    dispatch(gainEssence({ amount, source: 'manual_generation' }));
  }, [dispatch]);

  // Return generation utilities
  return { 
    generateEssence,
    currentRate: currentGenerationRate,
    traitBonus: calculateTraitBonus()
  };
};

// Auto-generation hook for passive essence gain
export const useAutoGenerateEssence = () => {
  const dispatch = useAppDispatch();
  const generationRate = useAppSelector(selectGenerationRate);
  
  useEffect(() => {
    if (generationRate <= 0) return;
    
    const intervalId = setInterval(() => {
      // Generate essence based on per-second rate
      dispatch(gainEssence({ amount: generationRate, source: 'passive_generation' }));
    }, 1000); // Generate every second
    
    return () => clearInterval(intervalId);
  }, [dispatch, generationRate]);
};

export default useEssenceGeneration;
