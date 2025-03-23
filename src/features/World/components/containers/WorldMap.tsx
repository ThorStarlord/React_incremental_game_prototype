/**
 * @file WorldMap.tsx
 * @description Component for rendering an interactive world map showing all regions
 * and their current status. Allows players to select regions for further interactions.
 */

import React, { useState } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { useGameState, useGameDispatch } from '../../../../context/GameStateExports';
import { ACTION_TYPES } from '../../../../context/types/ActionTypes';
import { Region as WorldRegion } from '../../../../context/types/gameStates/WorldGameStateTypes';
// Fix import path to use an actual type that exists
import { Quest } from '../../../../context/types/gameStates/ProgressionGameStateTypes';

/**
 * Define missing action type
 */
const WORLD_ACTIONS = {
  SELECT_REGION: 'world/selectRegion'
};

// Add the missing action to ACTION_TYPES
const ExtendedActionTypes = {
  ...ACTION_TYPES,
  SELECT_REGION: WORLD_ACTIONS.SELECT_REGION
};

/**
 * Interface for a location within a region
 */
interface Location {
  id: string;
  name: string;
  discovered: boolean;
}

/**
 * Interface for region unlock requirements
 */
interface UnlockRequirements {
  playerLevel?: number;
  questCompleted?: string;
}

/**
 * Interface for a region - using properties that we actually use in this component
 */
interface Region {
  id: string;
  name: string;
  description: string;
  explored: number;
  dangerLevel: number;
  isUnlocked: boolean;
  unlockRequirements?: UnlockRequirements;
  locations: Location[];
}

// Helper function to adapt WorldRegion to our local Region interface
const adaptRegion = (region: WorldRegion, id: string): Region => {
  return {
    id,
    name: region.name,
    description: region.description,
    // Safely access potentially missing properties - fix by using an optional getter function
    explored: getRegionExploration(region),
    dangerLevel: typeof region.difficulty === 'number' ? region.difficulty : 0, // Use difficulty as dangerLevel
    isUnlocked: region.isUnlocked,
    unlockRequirements: region.discoveryRequirement ? {
      playerLevel: region.discoveryRequirement.level,
      questCompleted: region.discoveryRequirement.quest
    } : undefined,
    locations: Array.isArray(region.locations) ? region.locations.map(locId => ({
      id: locId,
      name: locId, // Using id as name since we don't have actual data
      discovered: true // Assume discovered for now
    })) : []
  };
};

/**
 * Helper function to get exploration value from region with type safety
 */
const getRegionExploration = (region: WorldRegion): number => {
  // Check if region has an explored property that's a number
  if (region && typeof (region as any).explored === 'number') {
    return (region as any).explored;
  }
  
  // Fall back to default exploration value if not found
  return 0;
};

/**
 * Interface for region position styling
 */
interface RegionPosition {
  top: string;
  left: string;
  width: string;
  height: string;
  backgroundColor: string;
}

/**
 * Interface for game state world data
 */
interface WorldData {
  regions: Record<string, WorldRegion>;
  globalProperties?: {
    isNight: boolean;
    weatherCondition: string;
  };
}

/**
 * WorldMap Component
 * Renders an interactive map with all the world regions
 * based on their current state from the GameStateContext
 * 
 * @returns React element
 */
const WorldMap: React.FC = () => {
  const dispatch = useGameDispatch();
  const gameState = useGameState();
  
  // Access properties safely with optional chaining and defaults
  const worldRegions = gameState.world?.regions || {};
  const playerLevel = gameState.player?.level || 1;
  const completedQuests = gameState.quests?.completedQuests || [];
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Convert WorldRegion objects to our local Region interface
  const regions: Record<string, Region> = {};
  Object.entries(worldRegions).forEach(([id, region]) => {
    regions[id] = adaptRegion(region, id);
  });
  
  // Positions for regions on the map - these would normally be configured per region
  const regionPositions: Record<string, RegionPosition> = {
    forest: { top: '60%', left: '25%', width: '120px', height: '120px', backgroundColor: '#2e7d32' },
    mountains: { top: '30%', left: '55%', width: '100px', height: '100px', backgroundColor: '#5d4037' },
    swamp: { top: '70%', left: '65%', width: '90px', height: '90px', backgroundColor: '#4a148c' }
  };
  
  /**
   * Handle region selection
   * @param {string} regionId - ID of the selected region
   */
  const handleRegionClick = (regionId: string): void => {
    const region = regions[regionId];
    
    if (region.isUnlocked) {
      setSelectedRegion(regionId);
      dispatch({
        type: ExtendedActionTypes.SELECT_REGION,
        payload: regionId
      });
    }
  };
  
  /**
   * Check if a region can be unlocked based on requirements
   * @param {Region} region - Region object
   * @returns {boolean} - Whether the region can be unlocked
   */
  const canUnlockRegion = (region: Region): boolean => {
    if (!region.unlockRequirements) return true;
    
    const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
    
    return (
      (!reqLevel || playerLevel >= reqLevel) && 
      (!reqQuest || (Array.isArray(completedQuests) && completedQuests.some(q => 
        typeof q === 'string' ? q === reqQuest : q?.id === reqQuest
      )))
    );
  };
  
  /**
   * Renders information about unlock requirements for a region
   * @param {Region} region - Region object
   * @returns React element or null
   */
  const renderUnlockRequirements = (region: Region): React.ReactElement | null => {
    if (!region.unlockRequirements) return null;
    
    const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
    
    // Helper function to check if a quest ID is in the completed quests
    const isQuestCompleted = (questId: string): boolean => {
      if (!Array.isArray(completedQuests)) return false;
      return completedQuests.some(q => 
        typeof q === 'string' ? q === questId : q?.id === questId
      );
    };
    
    return (
      <Box sx={{
        bgcolor: 'rgba(209, 87, 0, 0.8)',
        color: 'white',
        p: 0.5,
        borderRadius: '3px',
        fontSize: '0.8em',
        mt: 0.5
      }}>
        Unlock Requirements:
        {reqLevel && <Box>Player Level: {playerLevel}/{reqLevel}</Box>}
        {reqQuest && (
          <Box>
            Quest: {isQuestCompleted(reqQuest) ? '✓' : '✗'} {typeof reqQuest === 'string' && reqQuest.replace ? reqQuest.replace(/_/g, ' ') : reqQuest}
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#e7eff6',
          textAlign: 'center',
          mt: 1,
          textShadow: '1px 1px 2px #000'
        }}
      >
        World Map
      </Typography>
      
      <Box 
        sx={{
          position: 'relative',
          width: '100%',
          height: '500px',
          bgcolor: '#2a4d69',
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          mb: 2.5
        }}
      >
        {Object.entries(regions).map(([id, region]) => (
          <Box
            key={id}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              cursor: region.isUnlocked ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              border: `2px solid ${region.isUnlocked ? '#fff' : '#555'}`,
              opacity: region.isUnlocked ? 1 : 0.6,
              transform: `scale(${selectedRegion === id ? 1.1 : 1})`,
              '&:hover': {
                transform: `scale(${region.isUnlocked ? 1.1 : 1})`,
                zIndex: 10
              },
              ...regionPositions[id]
            }}
            onClick={() => handleRegionClick(id)}
            title={region.isUnlocked ? region.name : `Locked: ${region.name}`}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px black',
                whiteSpace: 'nowrap'
              }}
            >
              {region.name}
            </Typography>
            
            <LinearProgress
              variant="determinate"
              value={region.explored * 100}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                width: '100%',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4CAF50'
                }
              }}
            />
          </Box>
        ))}
        
        {selectedRegion && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 1.25,
              borderRadius: '5px'
            }}
          >
            <Typography variant="h5">{regions[selectedRegion].name}</Typography>
            <Typography variant="body2">{regions[selectedRegion].description}</Typography>
            <Typography variant="body2">Exploration: {Math.round(regions[selectedRegion].explored * 100)}%</Typography>
            <Typography variant="body2">Danger Level: {regions[selectedRegion].dangerLevel}</Typography>
            <Typography variant="body2">
              Locations Discovered: {
                regions[selectedRegion].locations.filter(loc => loc.discovered).length
              } / {regions[selectedRegion].locations.length}
            </Typography>
          </Paper>
        )}
        
        {!selectedRegion && Object.entries(regions)
          .filter(([id, region]) => !region.isUnlocked)
          .map(([id, region]) => (
            canUnlockRegion(region) && (
              <Paper
                key={`unlock-${id}`}
                sx={{
                  position: 'absolute',
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  p: 1.25,
                  borderRadius: '5px',
                  bottom: 'auto',
                  top: regionPositions[id].top,
                  left: regionPositions[id].left
                }}
              >
                <Typography variant="h6">{region.name} (Locked)</Typography>
                {renderUnlockRequirements(region)}
              </Paper>
            )
          ))
        }
      </Box>
    </Box>
  );
};

export default WorldMap;
