import React, { useState, useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import RegionDetailsModal from '../../../../components/RegionDetailsModal';
import { regions, towns } from '../../../../modules/data';

const WorldMap = ({ onTownSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const theme = useTheme();

  const handleRegionClick = (regionId) => {
    setSelectedRegion(regionId);
    setModalOpen(true);
  };

  const getRegionColor = (regionType) => {
    const colors = {
      forest: theme.palette.mode === 'dark' ? '#2e7d32' : '#4CAF50',
      mountain: theme.palette.mode === 'dark' ? '#5d4037' : '#795548',
      desert: theme.palette.mode === 'dark' ? '#fdd835' : '#FFD700',
      default: theme.palette.grey[500]
    };
    return colors[regionType] || colors.default;
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
                  fill: getRegionColor(region.type),
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: 0.8,
                }}
              />
              <text
                x={region.mapCoordinates.x + region.mapCoordinates.width / 2}
                y={region.mapCoordinates.y + region.mapCoordinates.height / 2}
                textAnchor="middle"
                fill={theme.palette.mode === 'dark' ? '#fff' : '#000'}
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
              fill={theme.palette.error.main}
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