/**
 * @file worldSlice.ts
 * @description Redux Toolkit slice for managing world state
 */

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  WorldState, 
  Region,
  WeatherCondition, 
  RecentDiscovery, 
  Location,
  ExploreRegionPayload,
  DiscoverLocationPayload,
  AddTownPayload,
  UpdateRegionDangerPayload,
  ChangeWeatherPayload
} from './WorldTypes';
import { regions as regionsData } from '../data/regions';

/**
 * Initial regions data
 * This defines the starting state of all world regions including exploration status,
 * danger levels, and unlocking requirements.
 */
const initialRegions: Record<string, Region> = {
  whisperingWoods: {
    id: 'whisperingWoods',
    name: 'Whispering Woods',
    description: 'A dense forest filled with ancient trees that seem to whisper secrets to each other.',
    explored: 0.2, // 20% explored initially
    dangerLevel: 1,
    unlocked: true, // Starting region
    towns: ['oakhaven'],
    locations: [
      { id: 'elderTree', name: 'The Elder Tree', discovered: true },
      { id: 'moonlitGlade', name: 'Moonlit Glade', discovered: false },
      { id: 'foggyHollow', name: 'Foggy Hollow', discovered: false }
    ]
  },
  craggedPeaks: {
    id: 'craggedPeaks',
    name: 'Cragged Peaks',
    description: 'Towering mountains with jagged edges that pierce the clouds.',
    explored: 0,
    dangerLevel: 3,
    unlocked: false,
    unlockRequirements: {
      playerLevel: 5,
      questCompleted: 'explore_whispering_woods'
    },
    towns: ['stonefangHold'],
    locations: [
      { id: 'frozenPass', name: 'Frozen Pass', discovered: false },
      { id: 'abandondedMine', name: 'Abandoned Mine', discovered: false },
      { id: 'eaglesNest', name: 'Eagle\'s Nest', discovered: false }
    ]
  },
  sunkenCoast: {
    id: 'sunkenCoast',
    name: 'Sunken Coast',
    description: 'A coastal region where ancient ruins peek above the water at low tide.',
    explored: 0,
    dangerLevel: 2,
    unlocked: false,
    unlockRequirements: {
      playerLevel: 3,
      questCompleted: 'help_elder_willow'
    },
    towns: ['saltyWharf'],
    locations: [
      { id: 'tidalCaverns', name: 'Tidal Caverns', discovered: false },
      { id: 'shipwreckBay', name: 'Shipwreck Bay', discovered: false },
      { id: 'mistyShoals', name: 'Misty Shoals', discovered: false }
    ]
  },
  emeraldPlains: {
    id: 'emeraldPlains',
    name: 'Emerald Plains',
    description: 'Vast grasslands that shimmer green in the sunlight, home to nomadic tribes.',
    explored: 0,
    dangerLevel: 2,
    unlocked: false,
    unlockRequirements: {
      playerLevel: 7
    },
    towns: ['windriderCamp'],
    locations: [
      { id: 'ancientStone', name: 'Ancient Stone Circle', discovered: false },
      { id: 'windsweptHills', name: 'Windswept Hills', discovered: false },
      { id: 'stampedePlains', name: 'Stampede Plains', discovered: false }
    ]
  }
};

// Initial state for the world slice
const initialState: WorldState = {
  regions: initialRegions,
  currentRegion: 'whisperingWoods', // Default starting region
  discoveredPoints: 0,
  globalExploration: 0.05, // 5% of the world explored initially
  recentDiscoveries: [],
  weatherConditions: {
    current: 'clear',
    intensity: 1,
    affectedRegions: []
  }
};

/**
 * World Slice - Redux Toolkit slice for managing world state
 * 
 * Handles actions related to:
 * - Region selection and exploration
 * - Location discovery
 * - Town management
 * - Weather and environmental conditions
 */
const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    /**
     * Select a region to view/interact with
     */
    selectRegion: (state, action: PayloadAction<string>) => {
      const regionId = action.payload;
      if (state.regions[regionId] && state.regions[regionId].unlocked) {
        state.currentRegion = regionId;
      }
    },
    
    /**
     * Increase exploration percentage for a region
     */
    exploreRegion: (state, action: PayloadAction<ExploreRegionPayload>) => {
      const { regionId, amount = 0.05 } = action.payload;
      const region = state.regions[regionId];
      
      if (region && region.unlocked) {
        // Increase exploration percentage
        region.explored = Math.min(1, region.explored + amount);
        
        // Also increase global exploration
        const totalRegions = Object.keys(state.regions).length;
        state.globalExploration = Object.values(state.regions)
          .reduce((sum, region) => sum + region.explored, 0) / totalRegions;
        
        // Check for any locations that should be discovered
        region.locations.forEach(location => {
          // Locations are discovered at certain exploration thresholds
          const explorationThreshold = location.id.includes('difficult') ? 0.7 : 0.3;
          
          if (!location.discovered && region.explored >= explorationThreshold) {
            location.discovered = true;
            state.discoveredPoints += 1;
            
            // Add to recent discoveries list
            state.recentDiscoveries.unshift({
              id: location.id,
              name: location.name,
              regionId: regionId,
              regionName: region.name,
              timestamp: Date.now()
            });
            
            // Limit recent discoveries list to 5 items
            if (state.recentDiscoveries.length > 5) {
              state.recentDiscoveries.pop();
            }
          }
        });
      }
    },
    
    /**
     * Unlock a region if requirements are met
     */
    unlockRegion: (state, action: PayloadAction<string>) => {
      const regionId = action.payload;
      const region = state.regions[regionId];
      
      if (region && !region.unlocked) {
        region.unlocked = true;
      }
    },
    
    /**
     * Change weather conditions in the world
     */
    changeWeather: (state, action: PayloadAction<ChangeWeatherPayload>) => {
      const { type, intensity, affectedRegions } = action.payload;
      state.weatherConditions = {
        current: type,
        intensity,
        affectedRegions: affectedRegions || []
      };
    },
    
    /**
     * Add a new town to a region
     */
    addTown: (state, action: PayloadAction<AddTownPayload>) => {
      const { town, regionId } = action.payload;
      const region = state.regions[regionId];
      
      if (region) {
        if (!region.towns) {
          region.towns = [];
        }
        // Only add if not already present
        if (!region.towns.includes(town.id)) {
          region.towns.push(town.id);
        }
      }
    },
    
    /**
     * Discover a specific location in a region
     */
    discoverLocation: (state, action: PayloadAction<DiscoverLocationPayload>) => {
      const { locationId, regionId } = action.payload;
      const region = state.regions[regionId];
      
      if (region) {
        const location = region.locations.find(loc => loc.id === locationId);
        if (location && !location.discovered) {
          location.discovered = true;
          state.discoveredPoints += 1;
          
          // Add to recent discoveries
          state.recentDiscoveries.unshift({
            id: location.id,
            name: location.name,
            regionId: regionId,
            regionName: region.name,
            timestamp: Date.now()
          });
          
          if (state.recentDiscoveries.length > 5) {
            state.recentDiscoveries.pop();
          }
        }
      }
    },
    
    /**
     * Update region danger level
     */
    updateRegionDanger: (state, action: PayloadAction<UpdateRegionDangerPayload>) => {
      const { regionId, level } = action.payload;
      const region = state.regions[regionId];
      
      if (region) {
        region.dangerLevel = level;
      }
    },
    
    /**
     * Add a new location to a region
     */
    addLocation: (state, action: PayloadAction<{regionId: string, location: Location}>) => {
      const { regionId, location } = action.payload;
      const region = state.regions[regionId];
      
      if (region) {
        // Check if location already exists
        const existingIndex = region.locations.findIndex(loc => loc.id === location.id);
        
        if (existingIndex === -1) {
          // Add new location
          region.locations.push(location);
        }
      }
    },
    
    /**
     * Complete a location-based activity
     */
    completeLocationActivity: (state, action: PayloadAction<{regionId: string, locationId: string, activityId: string}>) => {
      // This is a placeholder for activity completion
      // In a real implementation, this would update location state, give rewards, etc.
      console.log('Activity completed:', action.payload);
    }
  }
});

// Export actions for use in components
export const { 
  selectRegion, 
  exploreRegion, 
  unlockRegion,
  changeWeather,
  addTown,
  discoverLocation,
  updateRegionDanger,
  addLocation,
  completeLocationActivity
} = worldSlice.actions;

// Basic selectors
export const selectAllRegions = (state: RootState) => state.world.regions;
export const selectCurrentRegionId = (state: RootState) => state.world.currentRegion;
export const selectGlobalExploration = (state: RootState) => state.world.globalExploration;
export const selectWeatherConditions = (state: RootState) => state.world.weatherConditions;
export const selectRecentDiscoveries = (state: RootState) => state.world.recentDiscoveries;
export const selectDiscoveredPoints = (state: RootState) => state.world.discoveredPoints;

// Memoized selectors
export const selectCurrentRegion = createSelector(
  [selectAllRegions, selectCurrentRegionId],
  (regions, currentRegionId) => regions[currentRegionId]
);

export const selectUnlockedRegions = createSelector(
  [selectAllRegions],
  (regions) => Object.values(regions).filter(region => region.unlocked)
);

export const selectRegionById = createSelector(
  [selectAllRegions, (_, regionId: string) => regionId],
  (regions, regionId) => regions[regionId]
);

export const selectDiscoveredLocations = createSelector(
  [selectAllRegions],
  (regions) => {
    const discovered: Record<string, Location & { regionId: string }> = {};
    
    Object.entries(regions).forEach(([regionId, region]) => {
      region.locations.forEach(location => {
        if (location.discovered) {
          discovered[location.id] = { ...location, regionId };
        }
      });
    });
    
    return discovered;
  }
);

export default worldSlice.reducer;
