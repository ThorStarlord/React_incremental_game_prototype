import { useState, useEffect, useCallback } from 'react';
import { useGameState, useGameDispatch, ACTION_TYPES } from '../../context';
import { calculateEssenceGeneration } from '../utils/soulResonanceUtils';
import { GameState } from '../../context/InitialState';

// Define types for the hook
interface Player {
  equippedTraits?: string[];
  // Add other player properties as needed
}

interface NPC {
  id: string;
  name: string;
  relationship?: number;
  // Add other NPC properties as needed
}

// Extended game state with npcs property
interface ExtendedGameState {
  player?: Player;
  npcs?: NPC[];
  essence?: {
    amount?: number;
    maxAmount?: number;
  };
}

interface UseEssenceGenerationReturn {
  isGenerating: boolean;
  generateEssence: (amount?: number) => number;
  startGenerating: () => void;
  stopGenerating: () => void;
  toggleGenerating: () => void;
  essenceRate?: number; // Add essenceRate to the interface
}

const useEssenceGeneration = (baseAmount = 1, interval = 10000): UseEssenceGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Cast to ExtendedGameState to resolve the TypeScript error
  const gameState = useGameState() as unknown as ExtendedGameState;
  const { player, npcs = [] } = gameState;
  const dispatch = useGameDispatch();
  
  // Add the missing generateEssence function that's being called elsewhere
  const generateEssence = useCallback((amount = baseAmount): number => {
    const finalAmount = calculateFinalAmount(amount, player as Player);
    dispatch({ 
      type: ACTION_TYPES.GAIN_ESSENCE, 
      payload: { 
        amount: finalAmount,
        source: 'essence_generation'
      }
    });
    return finalAmount;
  }, [baseAmount, player, dispatch]);
  
  useEffect(() => {
    let essenceTimer: NodeJS.Timeout;
    let relationshipTimer: NodeJS.Timeout | undefined;
    
    if (isGenerating) {
      // Essence generation timer
      essenceTimer = setInterval(() => {
        generateEssence(baseAmount);
      }, interval);
      
      // Relationship growth timer - runs every 60 seconds
      // Guard against undefined player or equippedTraits
      const equippedTraits = (player as Player)?.equippedTraits || [];
      if (equippedTraits.includes && equippedTraits.includes('GrowingAffinity')) {
        relationshipTimer = setInterval(() => {
          // Apply relationship growth to all NPCs
          // Guard against undefined or non-array npcs
          if (Array.isArray(npcs)) {
            npcs.forEach((npc: NPC) => {
              // Skip undefined NPCs
              if (!npc) return;
              
              // Only improve relationship if not already at max (100)
              if ((npc.relationship || 0) < 100) {
                dispatch({ 
                  type: 'UPDATE_NPC_RELATIONSHIP', 
                  payload: { 
                    npcId: npc.id, 
                    changeAmount: 1,  // Modest gain per minute
                    source: 'GrowingAffinity'  // Add source for stat tracking
                  } 
                });
                
                // Occasionally show notifications about relationship growth
                // This runs with a 10% chance each time to avoid spamming notifications
                if (Math.random() < 0.1) {
                  dispatch({
                    type: 'SHOW_NOTIFICATION',
                    payload: {
                      message: `Your relationship with ${npc.name} is growing thanks to Growing Affinity`,
                      severity: 'info',
                      duration: 3000
                    }
                  });
                }
              }
            });
          }
        }, 60000); // Run every minute
      }
    }
    
    // Cleanup timers on component unmount or when generating state changes
    return () => {
      clearInterval(essenceTimer);
      if (relationshipTimer) clearInterval(relationshipTimer);
    };
  }, [isGenerating, baseAmount, interval, player, npcs, dispatch, generateEssence]);
  
  // Calculate final essence amount based on traits and other factors
  const calculateFinalAmount = (base: number, player: Player): number => {
    let amount = base;
    
    // Guard against undefined player or equippedTraits
    const equippedTraits = player?.equippedTraits || [];
    
    // Apply trait effects
    if (equippedTraits.includes && equippedTraits.includes('EssenceAttunement')) {
      amount *= 1.5; // 50% more essence
    }
    
    return Math.floor(amount);
  };
  
  return {
    isGenerating,
    generateEssence, // Export the function to be used by other components
    startGenerating: () => setIsGenerating(true),
    stopGenerating: () => setIsGenerating(false),
    toggleGenerating: () => setIsGenerating(prev => !prev),
    essenceRate: baseAmount // Add essenceRate to the returned object
  };
};

export default useEssenceGeneration;
