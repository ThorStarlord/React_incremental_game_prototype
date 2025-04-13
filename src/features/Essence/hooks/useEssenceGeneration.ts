import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
// Import setGenerationRate instead of updateGenerationRate
import { gainEssence, setGenerationRate } from '../state/EssenceSlice'; 
import { selectEquippedTraitIds } from '../../Traits/state/TraitsSelectors'; // Adjust path if needed

/**
 * Custom hook to manage essence generation based on game state.
 *
 * @returns An object containing the generateEssence function.
 */
const useEssenceGeneration = () => {
  // Get necessary state from Redux store
  const { perSecond, multiplier, unlocked } = useSelector((state: RootState) => state.essence);
  const { generators, upgrades } = useSelector((state: RootState) => state.essence);
  
  // Get player level and traits that might affect essence generation
  const playerLevel = useSelector((state: RootState) => state.player?.level || 1);
  const equippedTraitIds = useSelector(selectEquippedTraitIds); 
  
  // Get the Redux dispatch function
  const dispatch = useDispatch();

  // Calculate the base generation rate from generators
  const calculateBaseRate = useCallback(() => {
    let rate = 0;
    Object.values(generators).forEach(gen => {
      if (gen.unlocked && gen.owned > 0) {
        rate += gen.baseProduction * gen.owned * (1 + (gen.level - 1) * 0.1); // Simple level bonus
      }
    });
    return rate;
  }, [generators]);

  // Calculate bonuses from upgrades and traits
  const calculateBonuses = useCallback(() => {
    let totalMultiplier = multiplier; // Start with global multiplier

    // Add upgrade bonuses (example: autoGeneration upgrade)
    const autoGenUpgrade = upgrades.autoGeneration;
    if (autoGenUpgrade?.unlocked && autoGenUpgrade.level > 0) {
      totalMultiplier += autoGenUpgrade.effect * autoGenUpgrade.level;
    }

    // Add trait bonuses
    const traitBonus = equippedTraitIds.reduce((bonus: number, traitId: string) => {
      if (traitId === 'essence_boost') return bonus + 0.1; // Assuming 0.1 represents 10%
      return bonus;
    }, 1.0); // Start bonus multiplier at 1.0

    totalMultiplier *= traitBonus; // Apply trait multiplier

    // Add player level bonus (example: 1% per level)
    totalMultiplier *= (1 + (playerLevel - 1) * 0.01);

    return totalMultiplier;
  }, [multiplier, upgrades, equippedTraitIds, playerLevel]);

  // Update the generation rate whenever dependencies change
  useEffect(() => {
    if (unlocked) {
      const baseRate = calculateBaseRate();
      const finalMultiplier = calculateBonuses();
      const finalRate = baseRate * finalMultiplier;
      
      // Dispatch action to update the perSecond rate in the store
      if (finalRate !== perSecond) {
        // Use setGenerationRate action
        dispatch(setGenerationRate(finalRate)); 
      }
    } else if (perSecond !== 0) {
      // Reset rate if essence becomes locked
      // Use setGenerationRate action
      dispatch(setGenerationRate(0)); 
    }
  }, [unlocked, calculateBaseRate, calculateBonuses, dispatch, perSecond]);

  // Function to manually trigger essence gain (e.g., from clicking)
  const generateEssence = useCallback((amount: number, source: string = 'manual') => {
    if (unlocked) {
      dispatch(gainEssence({ amount, source }));
    }
  }, [dispatch, unlocked]);

  // Return the manual generation function
  return { generateEssence };
};

export default useEssenceGeneration;
