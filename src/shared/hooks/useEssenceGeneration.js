import { useState, useEffect, useContext } from 'react';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';

const useEssenceGeneration = (baseAmount = 1, interval = 10000) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { player, npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  useEffect(() => {
    let essenceTimer;
    let relationshipTimer;
    
    if (isGenerating) {
      // Essence generation timer
      essenceTimer = setInterval(() => {
        const finalAmount = calculateFinalAmount(baseAmount, player);
        dispatch({ type: 'GAIN_ESSENCE', payload: finalAmount });
      }, interval);
      
      // Relationship growth timer - runs every 60 seconds
      if (player.equippedTraits.includes('GrowingAffinity')) {
        relationshipTimer = setInterval(() => {
          // Apply relationship growth to all NPCs
          npcs.forEach(npc => {
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
        }, 60000); // Run every minute
      }
    }
    
    // Cleanup timers on component unmount or when generating state changes
    return () => {
      clearInterval(essenceTimer);
      if (relationshipTimer) clearInterval(relationshipTimer);
    };
  }, [isGenerating, baseAmount, interval, player, npcs, dispatch]);
  
  // Calculate final essence amount based on traits and other factors
  const calculateFinalAmount = (base, player) => {
    let amount = base;
    
    // Apply trait effects
    if (player.equippedTraits.includes('EssenceAttunement')) {
      amount *= 1.5; // 50% more essence
    }
    
    return Math.floor(amount);
  };
  
  return {
    isGenerating,
    startGenerating: () => setIsGenerating(true),
    stopGenerating: () => setIsGenerating(false),
    toggleGenerating: () => setIsGenerating(prev => !prev)
  };
};

export default useEssenceGeneration;