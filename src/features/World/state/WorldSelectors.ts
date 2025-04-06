import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { Region, Location, WeatherCondition, RecentDiscovery, Town } from './WorldTypes';

/**
 * Basic selectors
 */
export const selectAllRegions = (state: RootState) => state.world.regions;
export const selectCurrentRegionId = (state: RootState) => state.world.currentRegion;
export const selectGlobalExploration = (state: RootState) => state.world.globalExploration;
export const selectWeatherConditions = (state: RootState) => state.world.weatherConditions;
export const selectRecentDiscoveries = (state: RootState) => state.world.recentDiscoveries;
export const selectDiscoveredPoints = (state: RootState) => state.world.discoveredPoints;

/**
 * Memoized selectors
 */

/**
 * Select the current active region
 */
export const selectCurrentRegion = createSelector(
  [selectAllRegions, selectCurrentRegionId],
  (regions, currentRegionId) => regions[currentRegionId]
);

/**
 * Select only unlocked regions
 */
export const selectUnlockedRegions = createSelector(
  [selectAllRegions],
  (regions) => Object.values(regions).filter(region => region.unlocked)
);

/**
 * Select locked regions that could potentially be unlocked
 */
export const selectLockedRegions = createSelector(
  [selectAllRegions],
  (regions) => Object.values(regions).filter(region => !region.unlocked)
);

/**
 * Select a specific region by ID
 */
export const selectRegionById = createSelector(
  [selectAllRegions, (_, regionId: string) => regionId],
  (regions, regionId) => regions[regionId]
);

/**
 * Select all discovered locations across all regions
 */
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

/**
 * Select locations in a specific region
 */
export const selectLocationsByRegion = createSelector(
  [selectAllRegions, (_, regionId: string) => regionId],
  (regions, regionId) => {
    const region = regions[regionId];
    return region ? region.locations : [];
  }
);

/**
 * Select weather effects for a specific region
 */
export const selectWeatherForRegion = createSelector(
  [selectWeatherConditions, (_, regionId: string) => regionId],
  (weather, regionId) => {
    // Check if this region is affected by current weather
    const isAffected = weather.affectedRegions.includes(regionId);
    
    // Return weather conditions if affected, or default clear weather
    return isAffected ? weather : {
      current: 'clear',
      intensity: 1,
      affectedRegions: []
    };
  }
);

/**
 * Select total world exploration as a percentage
 */
export const selectTotalExplorationPercentage = createSelector(
  [selectGlobalExploration],
  (exploration) => Math.round(exploration * 100)
);

/**
 * Select sorted recent discoveries (newest first)
 */
export const selectSortedRecentDiscoveries = createSelector(
  [selectRecentDiscoveries],
  (discoveries) => [...discoveries].sort((a, b) => b.timestamp - a.timestamp)
);

/**
 * Select regions with high danger levels (for warnings)
 */
export const selectDangerousRegions = createSelector(
  [selectAllRegions],
  (regions) => Object.values(regions).filter(region => region.dangerLevel >= 4)
);

/**
 * Select unlocked regions with unexplored locations
 */
export const selectRegionsWithUnexploredContent = createSelector(
  [selectAllRegions],
  (regions) => {
    return Object.values(regions)
      .filter(region => region.unlocked)
      .filter(region => region.locations.some(loc => !loc.discovered));
  }
);

/**
 * Select regions with a specific weather condition
 */
export const selectRegionsByWeather = createSelector(
  [selectAllRegions, selectWeatherConditions, (_, weatherType: string) => weatherType],
  (regions, weather, weatherType) => {
    const affectedRegionIds = weather.current === weatherType 
      ? weather.affectedRegions 
      : [];
      
    return Object.entries(regions)
      .filter(([regionId]) => affectedRegionIds.includes(regionId))
      .map(([_, region]) => region);
  }
);
