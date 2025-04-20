/**
 * @file LeftColumn.tsx
 * @description Left sidebar component for the incremental RPG game interface.
 * Renders core player information like stats and essence.
 */
import React from 'react';
import { Box } from '@mui/material';
// Corrected import paths based on the actual file structure
import { PlayerStats } from '../../features/Player/index';
import EssenceDisplayContainer from '../../features/Essence/components/containers/EssenceDisplayContainer';

/**
 * LeftColumn Component
 *
 * The left sidebar component for the game interface. Renders PlayerStats and EssenceDisplayContainer.
 *
 * @returns {JSX.Element} The left column component
 */
const LeftColumn: React.FC = () => {
  return (
    <Box
      id="left-column"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflowY: 'auto', // Allow scrolling if content overflows
        p: 1, // Add some padding
      }}
    >
      {/* Render Player Stats and Essence Display Container */}
      <PlayerStats />
      <EssenceDisplayContainer />
    </Box>
  );
};

export default LeftColumn;
