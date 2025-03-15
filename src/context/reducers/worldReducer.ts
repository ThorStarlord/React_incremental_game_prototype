import { ACTION_TYPES, WORLD_ACTIONS } from '../types/ActionTypes';
import { addNotification } from '../utils/notificationUtils';

// Define interfaces
interface GameState {
  world: WorldState;
  player: PlayerState;
  [key: string]: any;
}

interface WorldState {
  discoveredLocations?: Location[];
  unlockedRegions?: string[];
  regions?: Record<string, Region>;
  activeEvents?: WorldEvent[];
  eventHistory?: EventHistoryEntry[];
  regionalResources?: Record<string, Record<string, number>>;
  time?: WorldTime;
}

interface WorldTime {
  day: number;
  hour: number;
  season: string;
  year: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  regionId: string;
  coordinates?: {x: number; y: number};
  discoveredAt: number;
  visited: boolean;
}

interface Region {
  name: string;
  description?: string;
  unlockedAt?: number;
  explorationPercentage?: number;
  visitedLocations?: string[];
  initialLocations?: any[];
  currentWeather?: string;
  weatherEffects?: Record<string, any>;
  dangerLevel?: number;
  dominantFaction?: string;
  requirements?: {
    playerLevel?: number;
    questCompleted?: string;
    itemRequired?: string;
  };
}

interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: string;
  affectedRegions: string[];
  effects: Record<string, any>;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

interface EventHistoryEntry {
  id: string;
  name: string;
  type: string;
  startTime: number;
}

interface PlayerState {
  level: number;
  completedQuests?: string[];
  inventory?: any[];
  activeBuffs?: any[];
}

// Helper functions for safer array handling
const ensureArray = <T>(arr: T[] | undefined): T[] => arr || [];

// Interface for resource operation payloads with improved type safety
interface ResourceOperationPayload {
  regionId: string;
  resourceId: string;
  amount: number;
}

/**
 * World Reducer - Manages game world state and environmental systems
 */
export const worldReducer = (state: GameState, action: {type: string; payload: any}): GameState => {
  switch (action.type) {
    case WORLD_ACTIONS.DISCOVER_LOCATION: {
      const { locationId, locationData, silent = false } = action.payload;
      
      // Check if already discovered - use the helper function to ensure we have an array
      const discoveredLocations = ensureArray(state.world.discoveredLocations);
      if (discoveredLocations.some(loc => loc.id === locationId)) {
        return state;
      }
      
      // Create new location entry
      const newLocation = {
        id: locationId,
        name: locationData.name,
        description: locationData.description,
        type: locationData.type,
        regionId: locationData.regionId,
        coordinates: locationData.coordinates,
        discoveredAt: Date.now(),
        visited: false
      };
      
      // Update state - ensure we always have proper arrays even if undefined
      const newState = {
        ...state,
        world: {
          ...state.world,
          discoveredLocations: [...discoveredLocations, newLocation]
        }
      };
      
      return silent ? newState : addNotification(newState, {
        message: `New location discovered: ${locationData.name}`,
        type: 'info',
        duration: 5000
      });
    }
    
    case WORLD_ACTIONS.UNLOCK_REGION: {
      const { regionId, regionData, requirementsMet = true } = action.payload;
      
      // Check if already unlocked - ensure we have an array
      const unlockedRegions = ensureArray(state.world.unlockedRegions);
      if (unlockedRegions.includes(regionId)) {
        return state;
      }
      
      // Check requirements if not explicitly bypassed
      if (!requirementsMet && regionData.requirements) {
        const { playerLevel, questCompleted, itemRequired } = regionData.requirements;
        
        // Player level check
        if (playerLevel && state.player.level < playerLevel) {
          return addNotification(state, {
            message: `You need to be level ${playerLevel} to unlock ${regionData.name}`,
            type: 'warning'
          });
        }
        
        // Quest completion check
        const completedQuests = ensureArray(state.player.completedQuests);
        if (questCompleted && !completedQuests.includes(questCompleted)) {
          return addNotification(state, {
            message: `You need to complete a specific quest to unlock ${regionData.name}`,
            type: 'warning'
          });
        }
        
        // Required item check
        const inventory = ensureArray(state.player.inventory);
        if (itemRequired && !inventory.some(item => item.id === itemRequired)) {
          return addNotification(state, {
            message: `You need a specific item to unlock ${regionData.name}`,
            type: 'warning'
          });
        }
      }
      
      // Create a new state with guaranteed non-null values
      const regions = state.world.regions || {};
      
      const newState: GameState = {
        ...state,
        world: {
          ...state.world,
          unlockedRegions: [...unlockedRegions, regionId],
          regions: {
            ...regions,
            [regionId]: {
              ...regionData,
              unlockedAt: Date.now(),
              explorationPercentage: 0,
              visitedLocations: []
            }
          },
          discoveredLocations: ensureArray(state.world.discoveredLocations)
        }
      };
      
      // Discover initial locations if provided
      let updatedState = newState;
      if (regionData.initialLocations && Array.isArray(regionData.initialLocations)) {
        for (const location of regionData.initialLocations) {
          if (location && location.id) {
            updatedState = worldReducer(updatedState, {
              type: WORLD_ACTIONS.DISCOVER_LOCATION,
              payload: {
                locationId: location.id,
                locationData: location,
                silent: true
              }
            });
          }
        }
      }
      
      return addNotification(updatedState, {
        message: `New region unlocked: ${regionData.name}`,
        type: 'success',
        duration: 6000
      });
    }
    
    case WORLD_ACTIONS.TRIGGER_WORLD_EVENT: {
      const { eventId, eventData } = action.payload;
      
      // Set up event properties
      const startTime = Date.now();
      const duration = eventData.duration || 24 * 60 * 60 * 1000; // Default 24 hours
      const endTime = startTime + duration;
      
      // Create event object
      const newEvent = {
        id: eventId,
        name: eventData.name,
        description: eventData.description,
        type: eventData.type,
        affectedRegions: eventData.affectedRegions || [],
        effects: eventData.effects || {},
        startTime,
        endTime,
        isActive: true
      };
      
      // Add event to active events - use ensureArray to guarantee we have arrays
      const activeEvents = ensureArray(state.world.activeEvents);
      const eventHistory = ensureArray(state.world.eventHistory);
      
      let newState = {
        ...state,
        world: {
          ...state.world,
          activeEvents: [...activeEvents.filter(e => e.id !== eventId), newEvent],
          eventHistory: [...eventHistory, { 
            id: eventId, 
            name: eventData.name, 
            type: eventData.type, 
            startTime 
          }]
        }
      };
      
      // Apply immediate effects based on event type
      switch (eventData.type) {
        case 'weather': {
          if (eventData.affectedRegions?.length && eventData.weatherCondition) {
            const updatedRegions = {...(state.world.regions || {})};
            
            for (const regionId of eventData.affectedRegions) {
              if (updatedRegions[regionId]) {
                updatedRegions[regionId] = {
                  ...updatedRegions[regionId],
                  currentWeather: eventData.weatherCondition,
                  weatherEffects: eventData.effects
                };
              }
            }
            
            newState.world.regions = updatedRegions;
          }
          break;
        }
          
        case 'disaster': {
          if (eventData.affectedRegions?.length && eventData.effects.resourceDepletion) {
            const updatedResources = {...(state.world.regionalResources || {})};
            
            for (const regionId of eventData.affectedRegions) {
              if (!updatedResources[regionId]) continue;
              
              for (const [resourceId, rawAmount] of Object.entries(eventData.effects.resourceDepletion)) {
                // Add explicit type assertion to fix the 'unknown' type error
                const amount = Number(rawAmount);
                
                if (updatedResources[regionId][resourceId]) {
                  updatedResources[regionId][resourceId] = Math.max(
                    0, updatedResources[regionId][resourceId] - amount
                  );
                }
              }
            }
            
            newState.world.regionalResources = updatedResources;
          }
          break;
        }
          
        case 'festival': {
          if (eventData.effects.playerBuffs) {
            newState.player = {
              ...newState.player,
              activeBuffs: [
                ...(newState.player.activeBuffs || []),
                {
                  id: `festival_${eventId}`,
                  source: eventData.name,
                  effects: eventData.effects.playerBuffs,
                  expiresAt: endTime
                }
              ]
            };
          }
          break;
        }
          
        case 'invasion': {
          if (eventData.affectedRegions?.length && eventData.effects.factionInfluence) {
            const updatedRegions = {...(state.world.regions || {})};
            
            for (const regionId of eventData.affectedRegions) {
              if (updatedRegions[regionId]) {
                updatedRegions[regionId] = {
                  ...updatedRegions[regionId],
                  dangerLevel: (updatedRegions[regionId].dangerLevel || 0) + 
                              (eventData.effects.dangerIncrease || 0),
                  dominantFaction: eventData.effects.invadingFaction
                };
              }
            }
            
            newState.world.regions = updatedRegions;
          }
          break;
        }
      }
      
      return addNotification(newState, {
        message: `${eventData.name} has begun affecting the world!`,
        type: 'warning',
        duration: 7000
      });
    }
    
    case WORLD_ACTIONS.UPDATE_TIME_CYCLE: {
      const { increment, setTime } = action.payload;
      
      // Get current time
      const currentTime = state.world.time || {
        day: 1,
        hour: 0,
        season: 'spring',
        year: 1
      };
      
      // Either increment time or set specific time
      const updatedTime = setTime ? { ...currentTime, ...setTime } : {
        ...currentTime,
        hour: currentTime.hour + (increment?.hours || 0),
        day: currentTime.day + (increment?.days || 0) + 
             Math.floor((currentTime.hour + (increment?.hours || 0)) / 24),
        year: currentTime.year + (increment?.years || 0) + 
              Math.floor((currentTime.day + (increment?.days || 0)) / 365)
      };
      
      // Normalize hours
      updatedTime.hour = updatedTime.hour % 24;
      
      return {
        ...state,
        world: {
          ...state.world,
          time: updatedTime
        }
      };
    }
    
    case WORLD_ACTIONS.CHANGE_ENVIRONMENT: {
      const { regionId, changes } = action.payload;
      
      if (!state.world.regions?.[regionId]) {
        return state;
      }
      
      return {
        ...state,
        world: {
          ...state.world,
          regions: {
            ...state.world.regions,
            [regionId]: {
              ...state.world.regions[regionId],
              ...changes
            }
          }
        }
      };
    }
    
    case WORLD_ACTIONS.ESTABLISH_SETTLEMENT: {
      // Settlement logic would be implemented here
      return state;
    }
    
    case WORLD_ACTIONS.DEPLETE_RESOURCE: {
      // Safely parse the payload with proper type casting
      const payload = action.payload as ResourceOperationPayload;
      const { regionId, resourceId, amount } = payload;
      
      if (!state.world.regionalResources?.[regionId]?.[resourceId]) {
        return state;
      }
      
      const currentAmount = state.world.regionalResources[regionId][resourceId];
      const newAmount = Math.max(0, currentAmount - amount);
      
      return {
        ...state,
        world: {
          ...state.world,
          regionalResources: {
            ...state.world.regionalResources,
            [regionId]: {
              ...state.world.regionalResources[regionId],
              [resourceId]: newAmount
            }
          }
        }
      };
    }
    
    case WORLD_ACTIONS.REGENERATE_RESOURCE: {
      // Safely parse the payload with proper type casting
      const payload = action.payload as ResourceOperationPayload;
      const { regionId, resourceId, amount } = payload;
      
      if (!state.world.regionalResources?.[regionId]?.[resourceId]) {
        return state;
      }
      
      const currentAmount = state.world.regionalResources[regionId][resourceId];
      const newAmount = currentAmount + amount;
      
      return {
        ...state,
        world: {
          ...state.world,
          regionalResources: {
            ...state.world.regionalResources,
            [regionId]: {
              ...state.world.regionalResources[regionId],
              [resourceId]: newAmount
            }
          }
        }
      };
    }
    
    default:
      return state;
  }
};
