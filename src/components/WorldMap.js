import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import RegionDetailsModal from './RegionDetailsModal';
import { regions, towns } from '../modules/data';

const WorldMap = ({ onTownSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
    setModalOpen(true);
  };

  return (
    <Box className="world-map-container" sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>World Map</Typography>
      
      <svg viewBox="0 0 800 600" width="100%" height="100%">
        <g className="regions-layer">
          {regions.map((region) => (
            <g key={region.id}>
              <rect
                className={`region-${region.type}`}
                x={region.mapCoordinates.x}
                y={region.mapCoordinates.y}
                width={region.mapCoordinates.width}
                height={region.mapCoordinates.height}
                onClick={() => handleRegionClick(region.id)}
                style={{
                  fill: region.type === 'forest' ? '#4CAF50' : 
                        region.type === 'mountain' ? '#795548' : 
                        region.type === 'desert' ? '#FFD700' : '#90A4AE',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1
                  }
                }}
              />
              <text
                x={region.mapCoordinates.x + region.mapCoordinates.width / 2}
                y={region.mapCoordinates.y + region.mapCoordinates.height / 2}
                textAnchor="middle"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {region.name}
              </text>
            </g>
          ))}
        </g>
        
        <g className="towns-layer">
          {towns.map((town) => (
            <circle
              key={town.id}
              cx={town.mapCoordinates.x}
              cy={town.mapCoordinates.y}
              r={5}
              fill="red"
              onClick={() => onTownSelect(town.id)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </svg>

      <RegionDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        regionId={selectedRegion}
        onTownSelect={onTownSelect}
      />
    </Box>
  );
};

export default WorldMap;