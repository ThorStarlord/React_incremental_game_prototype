import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { towns } from '../../../../modules/data/towns';
import { regions } from '../../../../modules/data/regions';
import { routes } from '../../../../modules/data/routes';
import './WorldMap.css';

const WorldMap = ({ onTownSelect, onDungeonSelect }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredTown, setHoveredTown] = useState(null);
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const handleRegionClick = (regionId) => {
    const regionTowns = towns.filter(town => town.regionId === regionId);
    if (regionTowns.length > 0) {
      onTownSelect(regionTowns[0].id);
    } else {
      alert(`No towns in ${regions.find(r => r.id === regionId).name} yet!`);
    }
  };

  const handleTownClick = (townId, event) => {
    event.stopPropagation();
    onTownSelect(townId);
  };

  return (
    <Box className="world-map-container">
      <Typography variant="h5" component="h2" gutterBottom>
        World Map
      </Typography>
      <svg viewBox="0 0 800 600" width="100%" height="100%">
        {/* Draw routes first */}
        <g className="routes-layer">
          {routes.map(route => (
            <Tooltip key={route.id} title={route.description}>
              <path
                d={route.path}
                className={`route-${route.type}`}
                fill="none"
                strokeWidth={hoveredRoute === route.id ? "4" : "2"}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredRoute(route.id)}
                onMouseLeave={() => setHoveredRoute(null)}
              />
            </Tooltip>
          ))}
        </g>

        {/* Draw regions */}
        <g className="regions-layer">
          {regions.map(region => (
            <g key={region.id}>
              <rect
                className={`region-${region.type}`}
                x={region.mapCoordinates.x}
                y={region.mapCoordinates.y}
                width={region.mapCoordinates.width}
                height={region.mapCoordinates.height}
                stroke="#7cb342"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => handleRegionClick(region.id)}
              />
              <text
                x={region.mapCoordinates.x + region.mapCoordinates.width / 2}
                y={region.mapCoordinates.y + region.mapCoordinates.height / 2}
                textAnchor="middle"
                fill="#1b5e20"
                fontSize="14"
                style={{ pointerEvents: 'none' }}
              >
                {region.name}
              </text>
            </g>
          ))}
        </g>

        {/* Draw towns on top */}
        <g className="towns-layer">
          {towns.map(town => (
            <Tooltip key={town.id} title={`${town.name} - ${town.type}`}>
              <g
                transform={`translate(${town.mapCoordinates.x},${town.mapCoordinates.y})`}
                onClick={(e) => handleTownClick(town.id, e)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredTown(town.id)}
                onMouseLeave={() => setHoveredTown(null)}
              >
                <circle
                  r="8"
                  fill={hoveredTown === town.id ? '#f44336' : '#ff7043'}
                  stroke="#d32f2f"
                  strokeWidth="2"
                />
                <text
                  y="20"
                  textAnchor="middle"
                  fill="#d32f2f"
                  fontSize="12"
                  style={{ pointerEvents: 'none' }}
                >
                  {town.name}
                </text>
              </g>
            </Tooltip>
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default WorldMap;