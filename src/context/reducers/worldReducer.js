import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * World Reducer
 * 
 * Purpose: Manages the game world state, environment, and global progression systems
 * - Tracks world regions, locations, and their discovery/unlock status
 * - Handles global events, seasons, and time progression
 * - Manages world resources, depletion, and regeneration
 * - Controls environmental effects and world-state based modifiers
 * - Manages NPC populations, settlements, and territory control
 * 
 * The world state represents the overall game environment, its regions,
 * special locations, and global conditions that affect all game systems.
 * It provides context for player actions and creates changing conditions
 * that influence gameplay mechanics and strategic decisions.
 * 
 * Actions:
 * - DISCOVER_LOCATION: Add a location to the player's discovered locations
 * - UNLOCK_REGION: Make a new region available for exploration
 * - TRIGGER_WORLD_EVENT: Initiate a global event affecting the game world
 * - UPDATE_TIME_CYCLE: Progress time (day/night cycle, seasons, etc.)
 * - CHANGE_ENVIRONMENT: Modify environmental conditions in a region
 * - ESTABLISH_SETTLEMENT: Create or modify an NPC settlement
 * - DEPLETE_RESOURCE: Track resource depletion in an area
 * - REGENERATE_RESOURCE: Restore depleted resources over time
 * - MODIFY_FACTION_CONTROL: Change territorial control between factions
 */
export const worldReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.DISCOVER_LOCATION: {
      const { locationId, locationData, silent = false } = action.payload;
      
      // Check if already discovered
      if (state.world.discoveredLocations?.some(loc => loc.id === locationId)) {
        return state;
      }
      
      // Add to discovered locations
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
      
      // Update world state
      let newState = {
        ...state,
        world: {
          ...state.world,
          discoveredLocations: [
            ...(state.world.discoveredLocations || []),
            newLocation
          ]
        }
      };
      
      // Add notification if not silent
      if (!silent) {
        newState = addNotification(newState, {
          message: `New location discovered: ${locationData.name}`,
          type: 'discovery',
          duration: 5000
        });
      }
      
      return newState;
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
      
      // Add to unlocked regions
      let newState = {
        ...state,
        world: {
          ...state.world,
          unlockedRegions: [
            ...(state.world.unlockedRegions || []),
            regionId
          ],
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
      
      // Discover initial locations in the region if provided
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
      
      // Add notification
      return addNotification(newState, {
        message: `New region unlocked: ${regionData.name}`,
        type: 'achievement',
        duration: 6000
      });
    }
    
    case ACTION_TYPES.TRIGGER_WORLD_EVENT: {
      const { eventId, eventData } = action.payload;
      
      // Calculate event duration
      const startTime = Date.now();
      const duration = eventData.duration || 24 * 60 * 60 * 1000; // Default 24 hours in ms
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
            ...(state.world.activeEvents || []).filter(e => e.id !== eventId), // Remove if same event exists
            newEvent
          ],
          eventHistory: [
            ...(state.world.eventHistory || []),
            { 
              id: eventId, 
              name: eventData.name, 
              type: eventData.type, 
              startTime 
            }
          ]
        }
      };
      
      // Apply immediate effects based on event type
      switch (eventData.type) {
        case 'weather':
          // Update weather conditions in affected regions
          if (eventData.affectedRegions && eventData.affectedRegions.length > 0) {
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
          
        case 'disaster':
          // Apply disaster effects to regions and resources
          if (eventData.affectedRegions && eventData.effects.resourceDepletion) {
            const updatedResources = {...(state.world.regionalResources || {})};
            
            for (const regionId of eventData.affectedRegions) {
              if (!updatedResources[regionId]) continue;
              
              for (const [resourceId, amount] of Object.entries(eventData.effects.resourceDepletion)) {
                if (updatedResources[regionId][resourceId]) {
                  updatedResources[regionId][resourceId] = Math.max(
                    0, 
                    updatedResources[regionId][resourceId] - amount
                  );
                }
              }
            }
            
            newState.world.regionalResources = updatedResources;
          }
          break;
          
        case 'festival':
          // Add temporary bonuses
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
          
        case 'invasion':
          // Add enemies and modify faction control
          if (eventData.affectedRegions && eventData.effects.factionInfluence) {
            const updatedRegions = {...(state.world.regions || {})};
            
            for (const regionId of eventData.affectedRegions) {
              if (updatedRegions[regionId]) {
                updatedRegions[regionId] = {
                  ...updatedRegions[regionId],
                  dangerLevel: (updatedRegions[regionId].dangerLevel || 0) + eventData.effects.dangerIncrease,
                  dominantFaction: eventData.effects.invadingFaction
                };
              }
            }
            
            newState.world.regions = updatedRegions;
          }
          break;
          
        default:
          // Generic event handling
          break;
      }
      
      // Add notification
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
      
      let newTime;
      
      // If specific time is provided, use that
      if (setTime) {
        newTime = {
          ...currentTime,
          ...setTime
        };
      } else {
        // Otherwise increment time
        const hoursInDay = 24;
        const daysInSeason = 30;
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        
        // Calculate new hour
        let newHour = (currentTime.hour + (increment || 1)) % hoursInDay;
        
        // Calculate day increment
        let dayIncrement = Math.floor((currentTime.hour + (increment || 1)) / hoursInDay);
        let newDay = currentTime.day + dayIncrement;
        
        // Calculate season and year
        let seasonIndex = seasons.indexOf(currentTime.season);
        let newSeasonIndex = seasonIndex;
        let newYear = currentTime.year;
        
        // Check for season change
        if (newDay > daysInSeason) {
          newSeasonIndex = (seasonIndex + Math.floor(newDay / daysInSeason)) % seasons.length;
          if (newSeasonIndex < seasonIndex) {
            newYear += 1; // Year change when cycling back to first season
          }
          newDay = ((newDay - 1) % daysInSeason) + 1;
        }
        
        newTime = {
          day: newDay,
          hour: newHour,
          season: seasons[newSeasonIndex],
          year: newYear
        };
      }
      
      // Update time
      let newState = {
        ...state,
        world: {
          ...state.world,
          time: newTime,
          previousTime: currentTime
        }
      };
      
      // Handle world events based on time changes
      
      // Day/night cycle changes
      const isDaylight = newTime.hour >= 6 && newTime.hour < 18;
      const wasDaylight = currentTime.hour >= 6 && currentTime.hour < 18;
      
      if (isDaylight !== wasDaylight) {
        // Day/night transition
        const timeOfDay = isDaylight ? 'day' : 'night';
        
        // Update lighting in all regions
        const updatedRegions = {...(newState.world.regions || {})};
        for (const regionId in updatedRegions) {
          updatedRegions[regionId] = {
            ...updatedRegions[regionId],
            lighting: timeOfDay,
            visibilityModifier: isDaylight ? 1 : 0.6
          };
        }
        
        newState.world.regions = updatedRegions;
        
        // Notify time change
        newState = addNotification(newState, {
          message: `It is now ${timeOfDay}time`,
          type: 'info',
          duration: 3000
        });
      }
      
      // Season change
      if (currentTime.season !== newTime.season) {
        // Change season-specific attributes
        newState.world.currentSeason = newTime.season;
        
        // Update season effects in all regions
        const updatedRegions = {...(newState.world.regions || {})};
        for (const regionId in updatedRegions) {
          // Apply season-specific modifiers to each region
          const seasonModifiers = {
            spring: { growthRate: 1.2, temperature: 15, precipitation: 0.6 },
            summer: { growthRate: 1.5, temperature: 25, precipitation: 0.3 },
            autumn: { growthRate: 0.8, temperature: 15, precipitation: 0.7 },
            winter: { growthRate: 0.3, temperature: 0, precipitation: 0.5 }
          };
          
          updatedRegions[regionId] = {
            ...updatedRegions[regionId],
            seasonalModifiers: seasonModifiers[newTime.season],
            growthRate: (updatedRegions[regionId].baseGrowthRate || 1) * seasonModifiers[newTime.season].growthRate
          };
        }
        
        newState.world.regions = updatedRegions;
        
        // Handle resource regeneration based on season
        const updatedResources = {...(newState.world.regionalResources || {})};
        for (const regionId in updatedResources) {
          for (const resourceId in updatedResources[regionId]) {
            // Regenerate certain resources based on season (e.g., more herbs in spring)
            if (['herb', 'fruit', 'crop'].includes(resourceId) && newTime.season === 'spring') {
              updatedResources[regionId][resourceId] = Math.min(
                updatedResources[regionId][resourceId] * 1.5,
                newState.world.regions[regionId]?.resourceMaximums?.[resourceId] || 1000
              );
            }
          }
        }
        
        newState.world.regionalResources = updatedResources;
        
        // Notify season change
        newState = addNotification(newState, {
          message: `The season has changed to ${newTime.season}`,
          type: 'event',
          duration: 5000
        });
        
        // Add new seasonal events
        const seasonalEvents = {
          spring: { id: 'spring_bloom', name: 'Spring Bloom', type: 'seasonal' },
          summer: { id: 'summer_heat', name: 'Summer Heat Wave', type: 'seasonal' },
          autumn: { id: 'autumn_harvest', name: 'Autumn Harvest', type: 'seasonal' },
          winter: { id: 'winter_frost', name: 'Winter Frost', type: 'seasonal' }
        };
        
        const eventData = seasonalEvents[newTime.season];
        if (eventData) {
          newState = worldReducer(newState, {
            type: ACTION_TYPES.TRIGGER_WORLD_EVENT,
            payload: {
              eventId: eventData.id,
              eventData: {
                name: eventData.name,
                description: `Effects of the ${newTime.season} season are now active.`,
                type: eventData.type,
                duration: daysInSeason * hoursInDay * 60 * 60 * 1000, // Full season duration
                affectedRegions: Object.keys(newState.world.regions || {}),
                effects: {
                  seasonal: true
                }
              }
            }
          });
        }
      }
      
      // Year change
      if (currentTime.year !== newTime.year) {
        newState = addNotification(newState, {
          message: `A new year has begun! Year ${newTime.year}`,
          type: 'achievement',
          duration: 8000
        });
      }
      
      return newState;
    }
    
    case ACTION_TYPES.CHANGE_ENVIRONMENT: {
      const { regionId, changes } = action.payload;
      
      // Check if region exists
      if (!state.world.regions?.[regionId]) {
        return state;
      }
      
      // Apply environmental changes to region
      const updatedRegion = {
        ...state.world.regions[regionId],
        ...changes,
        environmentalHistory: [
          ...(state.world.regions[regionId].environmentalHistory || []),
          {
            timestamp: Date.now(),
            changes: Object.keys(changes),
            source: changes.source || 'system'
          }
        ]
      };
      
      // Notifications for major environmental changes
      let newState = {
        ...state,
        world: {
          ...state.world,
          regions: {
            ...state.world.regions,
            [regionId]: updatedRegion
          }
        }
      };
      
      // Add notification for significant changes
      if (changes.corrupted || changes.purified || changes.dangerLevel) {
        let message;
        if (changes.corrupted) {
          message = `${updatedRegion.name} has become corrupted!`;
        } else if (changes.purified) {
          message = `${updatedRegion.name} has been purified!`;
        } else if (changes.dangerLevel !== undefined) {
          const previousDanger = state.world.regions[regionId].dangerLevel || 0;
          if (changes.dangerLevel > previousDanger) {
            message = `Danger level in ${updatedRegion.name} has increased to ${changes.dangerLevel}!`;
          } else {
            message = `${updatedRegion.name} has become safer.`;
          }
        }
        
        newState = addNotification(newState, {
          message,
          type: 'warning',
          duration: 5000
        });
      }
      
      return newState;
    }
    
    case ACTION_TYPES.ESTABLISH_SETTLEMENT: {
      const { locationId, settlementData } = action.payload;
      
      // Find location
      const locationIndex = state.world.discoveredLocations?.findIndex(loc => loc.id === locationId);
      if (locationIndex === -1) {
        return addNotification(state, {
          message: "Cannot establish settlement at unknown location",
          type: 'error'
        });
      }
      
      // Check if already has settlement
      if (state.world.settlements?.some(settlement => settlement.locationId === locationId)) {
        return addNotification(state, {
          message: "A settlement already exists at this location",
          type: 'warning'
        });
      }
      
      // Create new settlement
      const newSettlement = {
        id: settlementData.id || `settlement_${locationId}`,
        name: settlementData.name,
        locationId,
        regionId: state.world.discoveredLocations[locationIndex].regionId,
        type: settlementData.type || 'outpost',
        level: settlementData.level || 1,
        population: settlementData.population || 10,
        buildings: settlementData.buildings || [],
        resources: settlementData.resources || {},
        foundedAt: Date.now(),
        faction: settlementData.faction || 'neutral'
      };
      
      // Update world state
      const newState = {
        ...state,
        world: {
          ...state.world,
          settlements: [
            ...(state.world.settlements || []),
            newSettlement
          ]
        }
      };
      
      // Add notification
      return addNotification(newState, {
        message: `New settlement established: ${newSettlement.name}`,
        type: 'achievement',
        duration: 6000
      });
    }
    
    case ACTION_TYPES.DEPLETE_RESOURCE: {
      const { regionId, resourceId, amount, source } = action.payload;
      
      // Check if region and resource exist
      if (!state.world.regionalResources?.[regionId]?.[resourceId]) {
        return state;
      }
      
      // Calculate new resource amount
      const currentAmount = state.world.regionalResources[regionId][resourceId];
      const newAmount = Math.max(0, currentAmount - amount);
      
      // Update resources
      const newState = {
        ...state,
        world: {
          ...state.world,
          regionalResources: {
            ...state.world.regionalResources,
            [regionId]: {
              ...state.world.regionalResources[regionId],
              [resourceId]: newAmount
            }
          },
          resourceHistory: [
            ...(state.world.resourceHistory || []),
            {
              regionId,
              resourceId,
              amount: -amount,
              remaining: newAmount,
              source: source || 'player',
              timestamp: Date.now()
            }
          ]
        }
      };
      
      // Add notification if resource is critically low (less than 10%)
      const maxAmount = state.world.regions?.[regionId]?.resourceMaximums?.[resourceId] || 1000;
      if (newAmount <= maxAmount * 0.1 && currentAmount > maxAmount * 0.1) {
        const regionName = state.world.regions?.[regionId]?.name || regionId;
        const resourceName = resourceId.charAt(0).toUpperCase() + resourceId.slice(1);
        
        return addNotification(newState, {
          message: `${resourceName} in ${regionName} is running dangerously low!`,
          type: 'warning',
          duration: 5000
        });
      }
      
      return newState;
    }
    
    case ACTION_TYPES.REGENERATE_RESOURCE: {
      const { regionId, resourceId, amount, natural = true } = action.payload;
      
      // Check if region exists
      if (!state.world.regionalResources?.[regionId]) {
        return state;
      }
      
      // Initialize resource if it doesn't exist
      const currentAmount = state.world.regionalResources[regionId][resourceId] || 0;
      
      // Calculate max amount
      const maxAmount = state.world.regions?.[regionId]?.resourceMaximums?.[resourceId] || 1000;
      
      // Apply growth rate modifier if natural regeneration
      let modifiedAmount = amount;
      if (natural && state.world.regions?.[regionId]?.growthRate) {
        modifiedAmount = amount * state.world.regions[regionId].growthRate;
      }
      
      // Calculate new amount (capped at maximum)
      const newAmount = Math.min(maxAmount, currentAmount + modifiedAmount);
      
      // Update resources
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
          },
          resourceHistory: [
            ...(state.world.resourceHistory || []),
            {
              regionId,
              resourceId,
              amount: modifiedAmount,
              remaining: newAmount,
              source: natural ? 'natural' : 'player',
              timestamp: Date.now()
            }
          ]
        }
      };
    }
    
    case ACTION_TYPES.MODIFY_FACTION_CONTROL: {
      const { regionId, factionId, influenceChange } = action.payload;
      
      // Check if region exists
      if (!state.world.regions?.[regionId]) {
        return state;
      }
      
      // Get current faction influences
      const currentInfluences = state.world.regions[regionId].factionInfluences || {};
      const currentFactionInfluence = currentInfluences[factionId] || 0;
      
      // Calculate new influence (between 0 and 100)
      const newInfluence = Math.min(100, Math.max(0, currentFactionInfluence + influenceChange));
      
      // Update faction influences
      const updatedInfluences = {
        ...currentInfluences,
        [factionId]: newInfluence
      };
      
      // Determine dominant faction (highest influence)
      let dominantFaction = factionId;
      let highestInfluence = newInfluence;
      
      for (const [faction, influence] of Object.entries(updatedInfluences)) {
        if (influence > highestInfluence) {
          highestInfluence = influence;
          dominantFaction = faction;
        }
      }
      
      // Update region
      const updatedRegion = {
        ...state.world.regions[regionId],
        factionInfluences: updatedInfluences,
        dominantFaction
      };
      
      // Track if dominant faction changed
      const factionChanged = state.world.regions[regionId].dominantFaction !== dominantFaction;
      
      // Update state
      let newState = {
        ...state,
        world: {
          ...state.world,
          regions: {
            ...state.world.regions,
            [regionId]: updatedRegion
          }
        }
      };
      
      // Add notification if control changed
      if (factionChanged && highestInfluence >= 50) {
        newState = addNotification(newState, {
          message: `The ${factionId} faction has taken control of ${updatedRegion.name}!`,
          type: 'event',
          duration: 6000
        });
      }
      
      return newState;
    }
    
    default:
      return state;
  }
};
