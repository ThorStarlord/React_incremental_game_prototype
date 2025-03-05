import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { towns } from './data/towns';
import { RootState } from '../../app/store';

/**
 * Interface for a location within a region
 */
interface Location {
  id: string;
  name: string;
  discovered: boolean;
}

/**
 * Interface for requirements to unlock a region
 */
interface UnlockRequirements {
  playerLevel?: number;
  questCompleted?: string;
}

/**
 * Interface for a region in the world
 */
interface Region {
  id: string;
  name: string;
  description: string;
  explored: number;
  dangerLevel: number;
  unlocked: boolean;
  unlockRequirements?: UnlockRequirements;
  towns: string[];
  locations: Location[];
}

/**
 * Interface for a weather condition
 */
interface WeatherCondition {
  current: string;
  intensity: number;
  affectedRegions: string[];
}

/**
 * Interface for a recently discovered location
 */
interface RecentDiscovery {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  timestamp: number;
}

/**
 * Interface for the world state
 */
interface WorldState {
  regions: Record<string, Region>;
  currentRegion: string;
  discoveredPoints: number;
  globalExploration: number;
  recentDiscoveries: RecentDiscovery[];
  weatherConditions: WeatherCondition;
}

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
     * @param {WorldState} state Current state
     * @param {PayloadAction<string>} action Action with regionId payload
     */
    selectRegion: (state, action: PayloadAction<string>) => {
      const regionId = action.payload;
      if (state.regions[regionId] && state.regions[regionId].unlocked) {
        state.currentRegion = regionId;
      }
    },
    
    /**
     * Increase exploration percentage for a region
     * @param {WorldState} state Current state
     * @param {PayloadAction<{regionId: string, amount?: number}>} action Action with regionId and amount payloads
     */
    exploreRegion: (state, action: PayloadAction<{regionId: string, amount?: number}>) => {
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
     * @param {WorldState} state Current state
     * @param {PayloadAction<string>} action Action with regionId payload
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
     * @param {WorldState} state Current state
     * @param {PayloadAction<{type: string, intensity: number, affectedRegions?: string[]}>} action Action with weather properties
     */
    changeWeather: (state, action: PayloadAction<{type: string, intensity: number, affectedRegions?: string[]}>) => {
      const { type, intensity, affectedRegions } = action.payload;
      state.weatherConditions = {
        current: type,
        intensity,
        affectedRegions: affectedRegions || []
      };
    },
    
    /**
     * Add a new town to a region
     * @param {WorldState} state Current state
     * @param {PayloadAction<{town: {id: string}, regionId: string}>} action Action with town data and regionId
     */
    addTown: (state, action: PayloadAction<{town: {id: string}, regionId: string}>) => {
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
     * @param {WorldState} state Current state
     * @param {PayloadAction<{locationId: string, regionId: string}>} action Action with locationId and regionId
     */
    discoverLocation: (state, action: PayloadAction<{locationId: string, regionId: string}>) => {
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
     * @param {WorldState} state Current state
     * @param {PayloadAction<{regionId: string, level: number}>} action Action with regionId and level
     */
    updateRegionDanger: (state, action: PayloadAction<{regionId: string, level: number}>) => {
      const { regionId, level } = action.payload;
      const region = state.regions[regionId];
      
      if (region) {
        region.dangerLevel = level;
      }
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
  updateRegionDanger
} = worldSlice.actions;

// Selectors for accessing world state in components
export const selectCurrentRegion = (state: RootState) => {
  const regionId = state.world.currentRegion;
  return state.world.regions[regionId];
};

export const selectAllRegions = (state: RootState) => state.world.regions;
export const selectGlobalExploration = (state: RootState) => state.world.globalExploration;
export const selectWeatherConditions = (state: RootState) => state.world.weatherConditions;
export const selectRecentDiscoveries = (state: RootState) => state.world.recentDiscoveries;

export default worldSlice.reducer;
export type { WorldState, Region, Location, WeatherCondition, RecentDiscovery };
