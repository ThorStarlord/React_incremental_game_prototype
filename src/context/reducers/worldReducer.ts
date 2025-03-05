import { ACTION_TYPES } from '../actions/actionTypes';
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

/**
 * World Reducer - Manages game world state and environmental systems
 */
export const worldReducer = (state: GameState, action: {type: string; payload: any}): GameState => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_LOCATION: {
      const { locationId, locationData, silent = false } = action.payload;
      
      // Check if already discovered
      if (state.world.discoveredLocations?.some(loc => loc.id === locationId)) {
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
      
      // Update state
      const newState = {
        ...state,
        world: {
          ...state.world,
          discoveredLocations: [
            ...(state.world.discoveredLocations || []),
            newLocation
          ]
        }
      };
      
      return silent ? newState : addNotification(newState, {
        message: `New location discovered: ${locationData.name}`,
        type: 'discovery',
        duration: 5000
      });
    }
    
    case ACTION_TYPES.UNLOCK_REGION: {
      const { regionId, regionData, requirementsMet = true } = action.payload;
      
      // Check if already unlocked
      if (state.world.unlockedRegions?.includes(regionId)) {
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
        if (questCompleted && !state.player.completedQuests?.includes(questCompleted)) {
          return addNotification(state, {
            message: `You need to complete a specific quest to unlock ${regionData.name}`,
            type: 'warning'
          });
        }
        
        // Required item check
        if (itemRequired && !state.player.inventory?.some(item => item.id === itemRequired)) {
          return addNotification(state, {
            message: `You need a specific item to unlock ${regionData.name}`,
            type: 'warning'
          });
        }
      }
      
      // Create updated state with new region
      let newState = {
        ...state,
        world: {
          ...state.world,
          unlockedRegions: [...(state.world.unlockedRegions || []), regionId],
          regions: {
            ...(state.world.regions || {}),
            [regionId]: {
              ...regionData,
              unlockedAt: Date.now(),
              explorationPercentage: 0,
              visitedLocations: []
            }
          }
        }
      };
      
      // Discover initial locations if provided
      if (regionData.initialLocations) {
        for (const location of regionData.initialLocations) {
          newState = worldReducer(newState, {
            type: ACTION_TYPES.DISCOVER_LOCATION,
            payload: {
              locationId: location.id,
              locationData: location,
              silent: true
            }
          });
        }
      }
      
      return addNotification(newState, {
        message: `New region unlocked: ${regionData.name}`,
        type: 'achievement',
        duration: 6000
      });
    }
    
    case ACTION_TYPES.TRIGGER_WORLD_EVENT: {
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
      
      // Add event to active events
      let newState = {
        ...state,
        world: {
          ...state.world,
          activeEvents: [
            ...(state.world.activeEvents || []).filter(e => e.id !== eventId),
            newEvent
          ],
          eventHistory: [
            ...(state.world.eventHistory || []),
            { id: eventId, name: eventData.name, type: eventData.type, startTime }
          ]
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
              
              for (const [resourceId, amount] of Object.entries(eventData.effects.resourceDepletion)) {
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
        type: 'event',
        duration: 7000
      });
    }
    
    case ACTION_TYPES.UPDATE_TIME_CYCLE: {
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
    
    case ACTION_TYPES.CHANGE_ENVIRONMENT: {
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
    
    case ACTION_TYPES.ESTABLISH_SETTLEMENT: {
      // Settlement logic would be implemented here
      return state;
    }
    
    case ACTION_TYPES.DEPLETE_RESOURCE:
    case ACTION_TYPES.REGENERATE_RESOURCE: {
      const { regionId, resourceId, amount } = action.payload;
      
      if (!state.world.regionalResources?.[regionId]?.[resourceId]) {
        return state;
      }
      
      const currentAmount = state.world.regionalResources[regionId][resourceId];
      const isDepletion = action.type === ACTION_TYPES.DEPLETE_RESOURCE;
      const newAmount = Math.max(0, currentAmount + (isDepletion ? -amount : amount));
      
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
