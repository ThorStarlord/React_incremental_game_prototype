/**
 * @file WorldMap.js
 * @description Component for rendering an interactive world map showing all regions
 * and their current status. Allows players to select regions for further interactions.
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

// Assume these actions will be defined elsewhere
import { selectRegion, exploreRegion } from '../../worldSlice';

/**
 * Styled components for the world map
 */
const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #2a4d69;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin-bottom: 20px;
`;

const MapTitle = styled.h2`
  color: #e7eff6;
  text-align: center;
  margin-top: 10px;
  text-shadow: 1px 1px 2px #000;
`;

const RegionContainer = styled.div`
  position: absolute;
  border-radius: 50%;
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  border: 2px solid ${props => props.unlocked ? '#fff' : '#555'};
  opacity: ${props => props.unlocked ? 1 : 0.6};
  transform: scale(${props => props.selected ? 1.1 : 1});
  
  &:hover {
    transform: ${props => props.unlocked ? 'scale(1.1)' : 'scale(1)'};
    z-index: 10;
  }
`;

const RegionProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #4CAF50;
  width: ${props => props.progress}%;
`;

const RegionName = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px black;
  white-space: nowrap;
`;

const RegionInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const UnlockMessage = styled.div`
  background-color: rgba(209, 87, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 0.8em;
  margin-top: 5px;
`;

/**
 * WorldMap Component
 * Renders an interactive map with all the world regions
 * based on their current state from the Redux store
 */
const WorldMap = () => {
  const dispatch = useDispatch();
  const regions = useSelector(state => state.world.regions);
  const playerLevel = useSelector(state => state.player.level);
  const completedQuests = useSelector(state => state.quests.completed);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  // Positions for regions on the map - these would normally be configured per region
  const regionPositions = {
    forest: { top: '60%', left: '25%', width: '120px', height: '120px', backgroundColor: '#2e7d32' },
    mountains: { top: '30%', left: '55%', width: '100px', height: '100px', backgroundColor: '#5d4037' },
    swamp: { top: '70%', left: '65%', width: '90px', height: '90px', backgroundColor: '#4a148c' }
  };
  
  /**
   * Handle region selection
   * @param {string} regionId - ID of the selected region
   */
  const handleRegionClick = (regionId) => {
    const region = regions[regionId];
    
    if (region.unlocked) {
      setSelectedRegion(regionId);
      dispatch(selectRegion(regionId));
    }
  };
  
  /**
   * Check if a region can be unlocked based on requirements
   * @param {Object} region - Region object
   * @returns {boolean} - Whether the region can be unlocked
   */
  const canUnlockRegion = (region) => {
    if (!region.unlockRequirements) return true;
    
    const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
    
    return (
      (!reqLevel || playerLevel >= reqLevel) && 
      (!reqQuest || completedQuests.includes(reqQuest))
    );
  };
  
  /**
   * Renders information about unlock requirements for a region
   * @param {Object} region - Region object
   * @returns {JSX.Element} - JSX for rendering unlock requirements
   */
  const renderUnlockRequirements = (region) => {
    if (!region.unlockRequirements) return null;
    
    const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
    
    return (
      <UnlockMessage>
        Unlock Requirements:
        {reqLevel && <div>Player Level: {playerLevel}/{reqLevel}</div>}
        {reqQuest && (
          <div>
            Quest: {completedQuests.includes(reqQuest) ? '✓' : '✗'} {reqQuest.replace(/_/g, ' ')}
          </div>
        )}
      </UnlockMessage>
    );
  };
  
  return (
    <div>
      <MapTitle>World Map</MapTitle>
      <MapContainer>
        {Object.entries(regions).map(([id, region]) => (
          <RegionContainer
            key={id}
            style={regionPositions[id]}
            unlocked={region.unlocked}
            selected={selectedRegion === id}
            onClick={() => handleRegionClick(id)}
            title={region.unlocked ? region.name : `Locked: ${region.name}`}
          >
            <RegionName>{region.name}</RegionName>
            <RegionProgress progress={region.explored * 100} />
          </RegionContainer>
        ))}
        
        {selectedRegion && (
          <RegionInfo visible={true}>
            <h3>{regions[selectedRegion].name}</h3>
            <p>{regions[selectedRegion].description}</p>
            <p>Exploration: {Math.round(regions[selectedRegion].explored * 100)}%</p>
            <p>Danger Level: {regions[selectedRegion].dangerLevel}</p>
            <p>Locations Discovered: {
              regions[selectedRegion].locations.filter(loc => loc.discovered).length
            } / {regions[selectedRegion].locations.length}</p>
          </RegionInfo>
        )}
        
        {!selectedRegion && Object.entries(regions)
          .filter(([id, region]) => !region.unlocked)
          .map(([id, region]) => (
            canUnlockRegion(region) && (
              <RegionInfo key={`unlock-${id}`} visible={true} style={{ 
                bottom: 'auto', 
                top: regionPositions[id].top, 
                left: regionPositions[id].left
              }}>
                <h4>{region.name} (Locked)</h4>
                {renderUnlockRequirements(region)}
              </RegionInfo>
            )
          ))
        }
      </MapContainer>
    </div>
  );
};

export default WorldMap;