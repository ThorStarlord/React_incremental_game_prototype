import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { gainEssence, updateGenerationRate, updateEssenceConnection } from '../state/EssenceSlice'; 
import { selectEquippedTraitIds } from '../../Player/state/PlayerSelectors'; // Corrected import
import { selectEssenceState, selectGenerationRate } from '../state/EssenceSelectors';
import { selectGameLoop } from '../../GameLoop/state/GameLoopSelectors'; // Corrected import

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

  // Calculate total generation rate from NPC connections and apply trait bonuses
  const calculateTotalRate = useCallback(() => {
    let totalBaseRateFromConnections = 0;
    Object.values(essence.npcConnections).forEach(connection => {
      totalBaseRateFromConnections += connection.baseGenerationRate;
    });

    // If essence.generationRate was meant as a global base, it would be added here.
    // For now, let's make it purely connection-driven for clarity.
    const baseRate = totalBaseRateFromConnections; 
    const traitMultiplier = calculateTraitBonus();
    return baseRate * traitMultiplier;
  }, [essence.npcConnections, calculateTraitBonus]);

  // Update generation rate when connections or bonuses change
  useEffect(() => {
    const newRate = calculateTotalRate();
    // Only dispatch if the rate has significantly changed to avoid unnecessary re-renders
    if (Math.abs(newRate - currentGenerationRate) > 0.001) { 
      dispatch(updateGenerationRate(newRate));
    }
  }, [calculateTotalRate, currentGenerationRate, dispatch]);

  // Auto-generation hook for passive essence gain (modified to use tick-based generation per connection)
  const gameLoop = useAppSelector(selectGameLoop); // Corrected selector
  const currentTick = gameLoop.currentTick;

  useEffect(() => {
    if (!gameLoop.isRunning || gameLoop.isPaused) return;

    // Iterate over each NPC connection and generate essence if due
    Object.values(essence.npcConnections).forEach(connection => {
      // Assuming 1 essence per tick for simplicity, or based on connection.baseGenerationRate
      // For now, let's use connection.baseGenerationRate per tick
      const ticksSinceLastGeneration = currentTick - connection.lastGeneratedTick;
      
      if (ticksSinceLastGeneration >= 1) { // If at least one tick has passed
        const amountToGenerate = connection.baseGenerationRate * ticksSinceLastGeneration;
        if (amountToGenerate > 0) {
          dispatch(gainEssence({ 
            amount: amountToGenerate, 
            source: `npc_connection_${connection.npcId}`,
            description: `Essence from ${connection.npcId} connection`
          }));
          // Update the lastGeneratedTick for this specific connection
          dispatch(updateEssenceConnection({
            npcId: connection.npcId,
            updates: { lastGeneratedTick: currentTick }
          }));
        }
      }
    });
  }, [dispatch, essence.npcConnections, currentTick, gameLoop.isRunning, gameLoop.isPaused]);

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

// The useAutoGenerateEssence hook is now integrated into useEssenceGeneration's useEffect
// and will be removed or refactored.
// export const useAutoGenerateEssence = () => { ... }; // Removed or refactored

export default useEssenceGeneration;
