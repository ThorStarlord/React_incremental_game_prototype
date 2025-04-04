/**
 * @file WorldTypes.ts
 * @description Type definitions for the world state management
 */

/**
 * Interface for a location within a region
 */
export interface Location {
  id: string;
  name: string;
  discovered: boolean;
  description?: string;
}

/**
 * Interface for requirements to unlock a region
 */
export interface UnlockRequirements {
  playerLevel?: number;
  questCompleted?: string;
}

/**
 * Interface for a region in the world
 */
export interface Region {
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
export interface WeatherCondition {
  current: string;
  intensity: number;
  affectedRegions: string[];
}

/**
 * Interface for a recently discovered location
 */
export interface RecentDiscovery {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  timestamp: number;
}

/**
 * Interface for town data
 */
export interface Town {
  id: string;
  name: string;
  description: string;
  population: number;
  services: string[];
  regionId: string;
}

/**
 * Interface for the world state
 */
export interface WorldState {
  regions: Record<string, Region>;
  currentRegion: string;
  discoveredPoints: number;
  globalExploration: number;
  recentDiscoveries: RecentDiscovery[];
  weatherConditions: WeatherCondition;
}

/**
 * Payload for exploring a region
 */
export interface ExploreRegionPayload {
  regionId: string;
  amount?: number;
}

/**
 * Payload for discovering a location
 */
export interface DiscoverLocationPayload {
  regionId: string;
  locationId: string;
}

/**
 * Payload for adding a town
 */
export interface AddTownPayload {
  regionId: string;
  town: {
    id: string;
    [key: string]: any;
  };
}

/**
 * Payload for updating region danger
 */
export interface UpdateRegionDangerPayload {
  regionId: string;
  level: number;
}

/**
 * Payload for weather changes
 */
export interface ChangeWeatherPayload {
  type: string;
  intensity: number;
  affectedRegions?: string[];
}
