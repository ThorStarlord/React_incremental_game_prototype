import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectCurrentEssence, selectGenerationRate, selectPerClickValue } from '../state/EssenceSelectors';
import { selectGameLoop } from '../../GameLoop/state/GameLoopSelectors';
import { gainEssence } from '../state/EssenceSlice';
import { selectPermanentTraits } from '../../Player/state/PlayerSelectors';
import { selectEquippedTraits } from '../../Player/state/PlayerSelectors';

/**
 * Hook for managing essence generation mechanics
 * Handles both passive generation from NPC connections and manual generation
 */
export const useEssenceGeneration = () => {
  const dispatch = useAppDispatch();
  
  // Get essence state and current amount
  const currentEssenceAmount = useAppSelector(selectCurrentEssence);
  const generationRate = useAppSelector(selectGenerationRate);
  const perClickValue = useAppSelector(selectPerClickValue);
  
  // Get trait data for bonuses
  const permanentTraits = useAppSelector(selectPermanentTraits);
  const equippedTraits = useAppSelector(selectEquippedTraits);

  // Calculate trait-based generation bonuses
  const calculateTraitBonus = useCallback((): number => {
    let multiplier = 1.0;
    
    // Check permanent traits for essence generation bonuses
    permanentTraits.forEach(traitId => {
      // This would check trait definitions for essence generation effects
      // For now, simplified - traits like "Growing Affinity" might provide bonuses
      if (traitId === 'growing_affinity') {
        multiplier += 0.1; // 10% bonus
      }
    });
    
    // Check equipped traits for bonuses
    equippedTraits.forEach(trait => {
      if (trait.id === 'essence_amplifier') {
        multiplier += 0.15; // 15% bonus
      }
    });
    
    return multiplier;
  }, [permanentTraits, equippedTraits]);

  // Calculate total generation rate from all connections
  const calculateTotalRate = useCallback(() => {
    let totalBaseRateFromConnections = 0;
    
    // Note: The current EssenceState doesn't include npcConnections
    // This is planned for future implementation when NPC connections are integrated
    // For now, use the base generationRate from state
    totalBaseRateFromConnections = generationRate || 0;
    
    const traitMultiplier = calculateTraitBonus();
    return totalBaseRateFromConnections * traitMultiplier;
  }, [generationRate, calculateTraitBonus]);

  // Note: If we later store calculated rate in state, add an effect here to dispatch it.

  // Auto-generation hook for passive essence gain
  const gameLoop = useAppSelector(selectGameLoop);
  
  useEffect(() => {
    if (!gameLoop || !gameLoop.isRunning || gameLoop.isPaused) return;

    // Simple time-based generation using the game loop
    // This is a basic implementation - future versions will use NPC connections
  const generationAmount = calculateTotalRate() / 10; // Per 100ms (1/10th of a second)
    
    if (generationAmount > 0) {
      const intervalId = setInterval(() => {
        dispatch(gainEssence({
          amount: generationAmount,
          source: 'passive_generation',
          description: 'Passive essence generation'
        }));
      }, 100); // Generate every 100ms for smooth updates
      
      return () => clearInterval(intervalId);
    }
  }, [dispatch, gameLoop, calculateTotalRate]);

  // Manual essence generation function
  const generateEssence = useCallback((amount: number) => {
    dispatch(gainEssence({
      amount,
      source: 'manual_click',
      description: 'Manual essence generation'
    }));
  }, [dispatch]);

  // Auto-click generation based on current per-click value
  const generateManualEssence = useCallback(() => {
    const amount = perClickValue || 1;
    generateEssence(amount);
  }, [generateEssence, perClickValue]);

  return {
    currentEssence: currentEssenceAmount,
    generationRate: calculateTotalRate(),
    generateEssence,
    generateManualEssence,
    traitMultiplier: calculateTraitBonus()
  };
};

export default useEssenceGeneration;
