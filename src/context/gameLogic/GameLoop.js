import React, { useContext, useEffect } from 'react';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../context/GameStateContext';
import { getRelationshipTier, getSimplifiedTier } from '../config/relationshipConstants';

const GameLoop = ({ children }) => {
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  // Relationship decay and trait effects
  useEffect(() => {
    const relationshipInterval = setInterval(() => {
      // Apply relationship decay
      dispatch({ type: ACTION_TYPES.DECAY_RELATIONSHIPS });
      
      // Check for Growing Affinity trait effect
      const hasGrowingAffinity = gameState.player.equippedTraits.includes('GrowingAffinity');
      if (hasGrowingAffinity) {
        dispatch({ 
          type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP, 
          payload: {
            npcId: 'all',
            changeAmount: 1,
            source: 'GrowingAffinity'
          }
        });
      }
      
      // Check for special effects based on relationship tiers
      gameState.npcs.forEach(npc => {
        const tier = getSimplifiedTier(npc.relationship || 0);
        
        // ENEMY tier effects (combines Nemesis and Enemy from detailed tiers)
        if (tier === "ENEMY" && Math.random() < 0.05) {
          // 5% chance per minute that enemies cause problems
          console.log(`${npc.name} is spreading rumors about you!`);
          
          // You could implement reputation damage here
          // dispatch({ type: ACTION_TYPES.UPDATE_REPUTATION, payload: { amount: -1 } });
          
          // Or generate hostile encounters
          if (Math.random() < 0.2) { // 20% chance to send enemies
            // dispatch({ type: ACTION_TYPES.SPAWN_HOSTILE_NPC, payload: { sourceNpc: npc.id } });
          }
        }
        
        // ALLY tier effects (combines Ally and Devoted from detailed tiers)
        if (tier === "ALLY" && Math.random() < 0.1) {
          // 10% chance per minute that allied NPCs give gifts
          console.log(`${npc.name} has sent you a gift!`);
          
          // Determine gift type based on relationship value
          if (npc.relationship >= 80) { // Devoted tier
            // Better gifts for devoted NPCs
            const essenceAmount = Math.floor(Math.random() * 10) + 5; // 5-15 essence
            
            dispatch({ 
              type: ACTION_TYPES.GAIN_ESSENCE, 
              payload: essenceAmount
            });
            
            // Add notification
            dispatch({
              type: ACTION_TYPES.ADD_NOTIFICATION,
              payload: {
                message: `${npc.name} sent you ${essenceAmount} essence as a gift!`,
                type: 'positive',
                duration: 5000
              }
            });
          } else { // Regular ally
            // Standard gifts for allies
            const essenceAmount = Math.floor(Math.random() * 5) + 1; // 1-5 essence
            
            dispatch({ 
              type: ACTION_TYPES.GAIN_ESSENCE, 
              payload: essenceAmount
            });
            
            // Add notification
            dispatch({
              type: ACTION_TYPES.ADD_NOTIFICATION,
              payload: {
                message: `${npc.name} sent you ${essenceAmount} essence as a gift!`,
                type: 'positive',
                duration: 5000
              }
            });
          }
        }
        
        // FRIEND tier effects
        if (tier === "FRIEND" && Math.random() < 0.08) {
          // 8% chance to give information about quests or secrets
          console.log(`${npc.name} has shared some information with you!`);
          
          // Could reveal map locations, hints, etc.
          // dispatch({ type: ACTION_TYPES.REVEAL_INFO, payload: { sourceNpc: npc.id } });
        }
      });
      
    }, 60000); // Run every minute
    
    return () => clearInterval(relationshipInterval);
  }, [dispatch, gameState.player.equippedTraits, gameState.npcs]);

  return <>{children}</>;
};

export default GameLoop;