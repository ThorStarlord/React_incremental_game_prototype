import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing environmental changes and world events
 */
export const useEnvironmentSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const environmentInterval = setInterval(() => {
      // Change weather conditions randomly
      if (Math.random() < 0.2) { // 20% chance to change weather
        changeWeather(dispatch);
      }
      
      // Update world events
      const worldEventChance = 0.05; // 5% chance for a world event
      if (Math.random() < worldEventChance) {
        triggerWorldEvent(dispatch);
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(environmentInterval);
  }, [dispatch]);
};

/**
 * Change the weather to a random condition
 */
function changeWeather(dispatch: React.Dispatch<GameAction>) {
  const weatherTypes = ['Clear', 'Rainy', 'Foggy', 'Stormy', 'Snowy'];
  const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  dispatch({
    type: ACTION_TYPES.SET_WEATHER,
    payload: { weather: newWeather }
  });
  
  // Apply weather effects based on type
  if (newWeather === 'Stormy') {
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification(
        "A storm is brewing. Some areas may be more dangerous!",
        'warning',
        5000
      )
    });
  }
}

/**
 * Trigger a random world event
 */
function triggerWorldEvent(dispatch: React.Dispatch<GameAction>) {
  const possibleEvents = [
    'Merchant Festival', 
    'Monster Invasion', 
    'Resource Abundance',
    'Magical Anomaly'
  ];
  
  const newEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  const duration = Math.floor(Math.random() * 3) + 1; // 1-3 day duration
  
  dispatch({
    type: ACTION_TYPES.TRIGGER_WORLD_EVENT,
    payload: {
      eventType: newEvent,
      duration
    }
  });
  
  dispatch({
    type: ACTION_TYPES.ADD_NOTIFICATION,
    payload: createNotification(
      `World Event: ${newEvent} has begun!`,
      'info',
      10000
    )
  });
}
