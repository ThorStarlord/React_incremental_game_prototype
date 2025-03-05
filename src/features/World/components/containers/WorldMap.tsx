/**
 * @file WorldMap.tsx
 * @description Component for rendering an interactive world map showing all regions
 * and their current status. Allows players to select regions for further interactions.
 */

import React, { useState } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { useGameState, useGameDispatch } from '../../../../context/index';
import { ACTION_TYPES } from '../../../../constants/actionTypes';

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
 * Interface for a region
 */
interface Region {
  name: string;
  description: string;
  explored: number;
  dangerLevel: number;
  unlocked: boolean;
  unlockRequirements?: UnlockRequirements;
  locations: Location[];
}

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
  regions: Record<string, Region>;
  globalProperties: {
    isNight: boolean;
    weatherCondition: string;
  };
}

/**
 * Interface for player data
 */
interface PlayerData {
  level: number;
}

/**
 * Interface for quest data
 */
interface QuestData {
  completed: string[];
}

/**
 * WorldMap Component
 * Renders an interactive map with all the world regions
 * based on their current state from the GameStateContext
 * 
 * @returns {JSX.Element} The rendered component
 */
const WorldMap: React.FC = () => {
  const dispatch = useGameDispatch();
  const { world, player, quests } = useGameState() as {
    world: WorldData,
    player: PlayerData,
    quests: QuestData
  };
  
  const regions = world?.regions || {};
  const playerLevel = player?.level || 1;
  const completedQuests = quests?.completed || [];
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
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
    
    if (region.unlocked) {
      setSelectedRegion(regionId);
      dispatch({
        type: ACTION_TYPES.SELECT_REGION,
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
      (!reqQuest || completedQuests.includes(reqQuest))
    );
  };
  
  /**
   * Renders information about unlock requirements for a region
   * @param {Region} region - Region object
   * @returns {JSX.Element | null} - JSX for rendering unlock requirements
   */
  const renderUnlockRequirements = (region: Region): JSX.Element | null => {
    if (!region.unlockRequirements) return null;
    
    const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
    
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
            Quest: {completedQuests.includes(reqQuest) ? '✓' : '✗'} {reqQuest.replace(/_/g, ' ')}
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
              cursor: region.unlocked ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              border: `2px solid ${region.unlocked ? '#fff' : '#555'}`,
              opacity: region.unlocked ? 1 : 0.6,
              transform: `scale(${selectedRegion === id ? 1.1 : 1})`,
              '&:hover': {
                transform: `scale(${region.unlocked ? 1.1 : 1})`,
                zIndex: 10
              },
              ...regionPositions[id]
            }}
            onClick={() => handleRegionClick(id)}
            title={region.unlocked ? region.name : `Locked: ${region.name}`}
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
          .filter(([id, region]) => !region.unlocked)
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
