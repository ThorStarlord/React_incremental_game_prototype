import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  exploreRegion, 
  unlockRegion, 
  changeWeather,
  discoverLocation
} from './worldSlice';
import { 
  ExploreRegionPayload, 
  DiscoverLocationPayload, 
  ChangeWeatherPayload 
} from './WorldTypes';

/**
 * Explore a region with validation and side effects
 * 
 * This thunk checks if the player meets requirements and handles related
 * side effects like rewarding discovery points, triggering events, etc.
 */
export const exploreRegionThunk = createAsyncThunk<
  { success: boolean; message: string; exploration: number },
  ExploreRegionPayload,
  { state: RootState }
>(
  'world/exploreRegionThunk',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { regionId, amount = 0.05 } = payload;
    const state = getState();
    
    // Check if region exists and is unlocked
    const region = state.world.regions[regionId];
    if (!region) {
      return rejectWithValue('Region not found');
    }
    
    if (!region.unlocked) {
      return rejectWithValue('This region is locked. Complete the necessary requirements to unlock it.');
    }
    
    // Check if player has sufficient energy
    const playerEnergy = state.player.stats?.energy || 0;
    const explorationCost = 10; // Cost per exploration attempt
    
    if (playerEnergy < explorationCost) {
      return rejectWithValue('Not enough energy to explore. Rest to recover energy.');
    }
    
    try {
      // Dispatch the exploration action
      dispatch(exploreRegion(payload));
      
      // Handle energy consumption (would be in a separate slice)
      // dispatch(consumeEnergy(explorationCost));
      
      // Calculate new exploration percentage
      const newExploration = Math.min(1, region.explored + amount);
      
      return {
        success: true,
        message: `You explored the ${region.name}`,
        exploration: newExploration
      };
    } catch (error) {
      return rejectWithValue('Failed to explore region');
    }
  }
);

/**
 * Unlock a region if all requirements are met
 * 
 * This thunk validates player level, completed quests, etc.
 * before unlocking a new region for exploration
 */
export const unlockRegionThunk = createAsyncThunk<
  { success: boolean; message: string; regionId: string },
  string, // regionId
  { state: RootState }
>(
  'world/unlockRegionThunk',
  async (regionId, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    
    // Check if region exists
    const region = state.world.regions[regionId];
    if (!region) {
      return rejectWithValue('Region not found');
    }
    
    // Check if already unlocked
    if (region.unlocked) {
      return {
        success: true,
        message: 'This region is already unlocked',
        regionId
      };
    }
    
    // Get player level and completed quests
    const playerLevel = state.player.level || 1;
    const completedQuests = state.quests?.completedQuests || [];
    
    // Check requirements
    const requirements = region.unlockRequirements;
    if (requirements) {
      // Check level requirement
      if (requirements.playerLevel && playerLevel < requirements.playerLevel) {
        return rejectWithValue(`You need to be level ${requirements.playerLevel} to unlock this region`);
      }
      
      // Check quest requirement
      if (requirements.questCompleted && !completedQuests.includes(requirements.questCompleted)) {
        return rejectWithValue(`You need to complete a specific quest to unlock this region`);
      }
    }
    
    // All checks passed, unlock the region
    dispatch(unlockRegion(regionId));
    
    return {
      success: true,
      message: `You've unlocked ${region.name}!`,
      regionId
    };
  }
);

/**
 * Discover a specific location in a region
 * 
 * This thunk handles special discovery conditions and rewards
 */
export const discoverLocationThunk = createAsyncThunk<
  { success: boolean; message: string },
  DiscoverLocationPayload,
  { state: RootState }
>(
  'world/discoverLocationThunk',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { regionId, locationId } = payload;
    const state = getState();
    
    // Validate region and location
    const region = state.world.regions[regionId];
    if (!region) {
      return rejectWithValue('Region not found');
    }
    
    const location = region.locations.find(loc => loc.id === locationId);
    if (!location) {
      return rejectWithValue('Location not found');
    }
    
    // Check if already discovered
    if (location.discovered) {
      return {
        success: true,
        message: `You've already discovered ${location.name}`
      };
    }
    
    // Dispatch discover location action
    dispatch(discoverLocation(payload));
    
    return {
      success: true,
      message: `You discovered ${location.name}!`
    };
  }
);

/**
 * Change weather conditions with appropriate effects
 * 
 * This thunk handles the transition to new weather conditions
 * and applies appropriate effects based on the weather type
 */
export const changeWeatherThunk = createAsyncThunk<
  { success: boolean; message: string; weatherType: string },
  ChangeWeatherPayload,
  { state: RootState }
>(
  'world/changeWeatherThunk',
  async (payload, { dispatch, rejectWithValue }) => {
    const { type, intensity, affectedRegions } = payload;
    
    try {
      // Apply the weather change
      dispatch(changeWeather(payload));
      
      // Prepare a descriptive message based on weather type
      let message = 'The weather has changed.';
      
      switch(type) {
        case 'clear':
          message = 'The skies have cleared, making travel easier.';
          break;
        case 'rain':
          message = 'Rain begins to fall, making the ground muddy and slippery.';
          break;
        case 'storm':
          message = 'A storm rages, making travel dangerous and reducing visibility.';
          break;
        case 'snow':
          message = 'Snow blankets the land, slowing movement but revealing tracks.';
          break;
        case 'fog':
          message = 'A thick fog rolls in, reducing visibility and hiding dangers.';
          break;
      }
      
      return {
        success: true,
        message,
        weatherType: type
      };
    } catch (error) {
      return rejectWithValue('Failed to change weather conditions');
    }
  }
);
