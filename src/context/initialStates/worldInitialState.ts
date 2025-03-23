/**
 * @file WorldInitialState.ts
 * @description Defines the initial state of the game world for the incremental RPG.
 * This file contains all the default values and configurations for world regions,
 * global properties, events and other world-related state.
 */

import { 
  WorldState, 
  BiomeType,
  ExtendedLocation,
  Region as GameRegion,
  WorldEvent as GameWorldEvent,
  WorldNPC,
  Faction,
  Shop,
  WeatherType,
  WeatherEffect,
  WorldTime,
  Season,
  TimeOfDay,
  LocationResource
} from '../types/gameStates/WorldGameStateTypes';

/**
 * Interface for a world resource
 */
interface Resource {
  available: boolean;
  abundance: 'low' | 'medium' | 'high';
}

/**
 * Interface for a monster in a region
 */
interface Monster {
  level: number;
  spawnRate: number;
}

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
 * Interface for a world region
 */
interface Region {
  name: string;
  description: string;
  unlocked: boolean;
  explored: number;
  dangerLevel: number;
  resources: Record<string, Resource>;
  monsters: Record<string, Monster>;
  locations: Location[];
  unlockRequirements?: UnlockRequirements;
}

/**
 * Interface for a world event
 */
interface WorldEvent {
  name: string;
  description: string;
  duration: number;
  affectedRegions: string[];
  effects: Record<string, number>;
}

/**
 * Interface for a lore fragment
 */
interface LoreFragment {
  id: string;
  title: string;
  content: string;
  discovered: boolean;
}

/**
 * Interface for global world properties
 */
interface GlobalProperties {
  worldLevel: number;
  daysPassed: number;
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  isNight: boolean;
  weatherCondition: string;
  difficultyMultiplier: number;
}

/**
 * Interface for discovery status
 */
interface DiscoveryStatus {
  totalDiscovered: number;
  foundSecrets: number;
  unlockedLore: string[];
}

/**
 * Original regions data to convert from
 */
const worldRegionsOriginal = {
  forest: {
    name: 'Whispering Woods',
    description: 'A peaceful forest teeming with wildlife and basic resources.',
    unlocked: true,
    explored: 0.05,
    dangerLevel: 1,
    resources: {
      wood: { available: true, abundance: 'high' },
      herbs: { available: true, abundance: 'medium' },
      stones: { available: true, abundance: 'low' },
    },
    monsters: {
      wolf: { level: 1, spawnRate: 0.3 },
      goblin: { level: 2, spawnRate: 0.1 },
    },
    locations: [
      { id: 'clearing', name: 'Forest Clearing', discovered: true },
      { id: 'cave', name: 'Hidden Cave', discovered: false },
    ]
  },
  mountains: {
    name: 'Craggy Heights',
    description: 'Rugged mountains with valuable minerals and dangerous creatures.',
    unlocked: false,
    explored: 0,
    dangerLevel: 3,
    resources: {},
    monsters: {},
    locations: [],
    unlockRequirements: {
      playerLevel: 5,
      questCompleted: 'forest_guardian',
    }
  },
  swamp: {
    name: 'Murky Marshes',
    description: 'A dangerous swamp filled with poisonous creatures and rare alchemical ingredients.',
    unlocked: false,
    explored: 0,
    dangerLevel: 5,
    resources: {},
    monsters: {},
    locations: [],
    unlockRequirements: {
      playerLevel: 10,
      questCompleted: 'mountain_king',
    }
  },
};

// Convert local region to game region format
const convertRegion = (region: Region): GameRegion => ({
  id: '',  // Required by GameRegion interface
  name: region.name,
  description: region.description,
  locations: [],  // Will be populated from locations object
  biomes: [region.name.toLowerCase() as BiomeType],
  discoveryRequirement: {
    level: region.unlockRequirements?.playerLevel,
    quest: region.unlockRequirements?.questCompleted
  },
  mapPosition: { x: 0, y: 0 },  // Default position
  mapSize: { width: 100, height: 100 },  // Default size
  difficulty: region.dangerLevel * 10,  // Scale to 1-100
  isUnlocked: region.unlocked,
  discoveredAt: region.unlocked ? new Date().toISOString() : undefined
});

// Weather effect template
const defaultWeather: WeatherEffect = {
  type: 'clear',
  intensity: 0,
  effects: {},
  description: 'Clear skies and calm weather.'
};

// Create world time
const worldTime: WorldTime = {
  day: 1,
  timeOfDay: 'morning',
  season: 'spring',
  year: 1,
  totalMinutesPassed: 0,
  realSecondsPerGameMinute: 3,
  isPaused: false
};

const WorldInitialState: WorldState = {
  // Remove top-level properties that don't exist in WorldState interface
  
  // Convert regions to proper format
  regions: Object.fromEntries(
    Object.entries(worldRegionsOriginal)
      .map(([key, value]) => [key, convertRegion(value as Region)])
  ),
  
  // Add all the missing required properties
  locations: {},  // Empty locations object
  currentLocation: 'forest_clearing',  // Default starting location
  currentWeather: defaultWeather,
  npcs: {},  // No NPCs initially
  factions: {},  // No factions initially
  shops: {},  // No shops initially
  activeEvents: {},  // No active events initially
  
  // Move time-related properties to the time object
  time: {
    ...worldTime,  // Keep existing worldTime properties
    day: 1,  // Moved from daysPassed
    season: 'spring' as const, // Moved from currentSeason
    // Other time properties already set in worldTime
  },
  
  discoveredLocations: new Set(['forest_clearing']),
  discoveredRegions: new Set(['forest']),
  metNPCs: new Set(),
  resourceNodes: {},
  
  // Add world flags
  worldFlags: {
    isNight: false, // Moved from top-level
  },
  
  // Add global modifiers
  globalModifiers: {
    worldLevel: 1, // Moved from top-level
    difficultyMultiplier: 1.0, // Moved from top-level
  }
};

export default WorldInitialState;
// Do not export the local interfaces as they're replaced by the imported ones
export type { Resource, Monster, LoreFragment };
