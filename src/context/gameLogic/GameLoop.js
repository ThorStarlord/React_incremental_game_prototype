import React, { useEffect } from 'react';
import { useGameState, useGameDispatch } from '../GameDispatchContext';
import { ACTION_TYPES } from '../GameStateContext';
import { getSimplifiedTier } from '../../config/relationshipConstants';

/**
 * GameLoop Component
 * 
 * Purpose: Manages recurring game mechanics and time-based events.
 * 
 * This component:
 * 1. Sets up interval timers for various game systems
 * 2. Handles relationship changes over time
 * 3. Processes NPC interactions based on relationship tiers
 * 4. Applies passive trait effects at regular intervals
 * 5. Manages resource generation and consumption cycles
 * 
 * Each game system is isolated in its own useEffect for maintainability
 * and to allow for incremental addition of new systems.
 */
const GameLoop = ({ children }) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  // Relationship system loop - handles NPC relationships and interactions
  useEffect(() => {
    const relationshipInterval = setInterval(() => {
      // Apply natural relationship decay over time
      dispatch({ type: ACTION_TYPES.DECAY_RELATIONSHIPS });
      
      // Apply trait effects that modify relationships
      const hasGrowingAffinity = gameState.player.equippedTraits?.includes('GrowingAffinity');
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
        const tier = getSimplifiedTier(npc.relationship || 0);
        
        // ENEMY tier effects
        if (tier === "ENEMY" && Math.random() < 0.05) {
          // 5% chance for negative events from enemies
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} is spreading rumors about you!`,
              type: 'negative',
              duration: 5000
            }
          });
          
          // Additional enemy actions could be implemented here
        }
        
        // ALLY tier effects
        if (tier === "ALLY" && Math.random() < 0.1) {
          // 10% chance for gifts from allies
          const essenceAmount = Math.floor(Math.random() * 5) + 1;
            
          dispatch({ 
            type: ACTION_TYPES.GAIN_ESSENCE, 
            payload: essenceAmount
          });
          
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} sent you ${essenceAmount} essence as a gift!`,
              type: 'positive',
              duration: 5000
            }
          });
        }
        
        // FRIEND tier effects
        if (tier === "FRIEND" && Math.random() < 0.08) {
          // 8% chance for information from friends
          dispatch({
            type: ACTION_TYPES.ADD_NOTIFICATION,
            payload: {
              message: `${npc.name} shared some useful information with you.`,
              type: 'info',
              duration: 5000
            }
          });
          
          // Additional friend-based events could be implemented here
        }
      });
    }, 60000); // Run every minute
    
    return () => clearInterval(relationshipInterval);
  }, [dispatch, gameState.player.equippedTraits, gameState.npcs]);

  // Resource generation loop
  useEffect(() => {
    const resourceInterval = setInterval(() => {
      // Generate passive resources based on player stats/buildings/etc
      const passiveGold = gameState.player.goldPerMinute || 0;
      if (passiveGold > 0) {
        dispatch({
          type: ACTION_TYPES.GAIN_GOLD,
          payload: passiveGold
        });
      }
      
      // Additional resource generation logic can be added here
    }, 60000); // Run every minute
    
    return () => clearInterval(resourceInterval);
  }, [dispatch, gameState.player]);

  // Time progression loop
  useEffect(() => {
    const timeInterval = setInterval(() => {
      // Advance game time
      dispatch({ type: ACTION_TYPES.ADVANCE_TIME });
      
      // Check for time-based events
      const { day, period } = gameState.gameTime || {};
      if (period === 'NIGHT') {
        // Night-time specific events
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION,
          payload: {
            message: `Day ${day} has ended. It's now night time.`,
            type: 'info',
            duration: 3000
          }
        });
      }
    }, 300000); // Run every 5 minutes
    
    return () => clearInterval(timeInterval);
  }, [dispatch, gameState.gameTime]);

  return <>{children}</>;
};

export default GameLoop;