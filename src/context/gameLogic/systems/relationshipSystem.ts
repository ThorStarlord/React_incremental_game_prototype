import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { getSimplifiedTier } from '../../../config/relationshipConstants';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState, NPC } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing NPC relationship changes and interactions
 */
export const useRelationshipSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const relationshipInterval = setInterval(() => {
      // Apply natural relationship decay over time
      dispatch({ 
        type: ACTION_TYPES.DECAY_RELATIONSHIPS, 
        payload: {} 
      });
      
      // Apply trait effects that modify relationships
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
      
      // Process NPC interactions based on relationship tiers
      gameState.npcs?.forEach(npc => {
        processNpcInteractions(npc, dispatch);
      });
    }, 60000); // Run every minute
    
    return () => clearInterval(relationshipInterval);
  }, [dispatch, gameState.player.equippedTraits, gameState.npcs]);
};

/**
 * Process tier-based NPC interactions
 */
function processNpcInteractions(npc: NPC, dispatch: React.Dispatch<GameAction>) {
  const tier = getSimplifiedTier(npc.relationship || 0);
  
  // ENEMY tier effects
  if (tier === "ENEMY" && Math.random() < 0.05) {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification(
        `${npc.name} is spreading rumors about you!`, 
        'negative', 
        5000
      )
    });
  }
  
  // ALLY tier effects
  if (tier === "ALLY" && Math.random() < 0.1) {
    const essenceAmount = Math.floor(Math.random() * 5) + 1;
      
    dispatch({ 
      type: ACTION_TYPES.GAIN_ESSENCE, 
      payload: { amount: essenceAmount }
    });
    
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification(
        `${npc.name} sent you ${essenceAmount} essence as a gift!`,
        'positive',
        5000
      )
    });
  }
  
  // FRIEND tier effects
  if (tier === "FRIEND" && Math.random() < 0.08) {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification(
        `${npc.name} shared some useful information with you.`,
        'info',
        5000
      )
    });
  }
}
