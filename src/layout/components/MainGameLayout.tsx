/**
 * @file MainGameLayout.tsx
 * @description Main layout container for the incremental RPG game interface.
 * Provides the basic responsive 3-column structure.
 */

import React from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';

/**
 * MainGameLayout Component
 *
 * Implements the responsive 3-column layout for the main game interface using Flexbox.
 * Renders the Header, LeftColumn, MiddleColumn (with Outlet for routed content),
 * and RightColumn. Hides side columns on smaller screens ('md' breakpoint and below).
 * The main content area grows to fill available vertical space.
 */
const MainGameLayout: React.FC = () => {
  const theme = useTheme();
  // Determine if the screen is medium size or smaller
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    // Root container: Full viewport height, column direction flex
    <Box sx={{
      width: '100%',
      p: isSmallScreen ? 1 : 2, // Responsive padding
      display: 'flex',
      flexDirection: 'column', // Stack Header and Columns vertically
      height: '100vh',        // Take full viewport height
      overflow: 'hidden',     // Prevent body scroll
      mx: 'auto',             // Center layout
      gap: 1,                 // Gap between Header and Columns container
    }}>
      <CssBaseline /> {/* Ensures consistent baseline styles */}
      <Header /> {/* Added Header component */}

      {/* Columns container: Takes remaining vertical space, row direction flex */}
      <Box sx={{
        display: 'flex',      // Arrange columns horizontally
        flexGrow: 1,          // Allow this box to grow and fill remaining vertical space
        overflow: 'hidden',   // Hide overflow from this container
        gap: 1,               // Gap between columns
        // Removed explicit height calculation, flexGrow handles it
       }}>

        {/* Left Column Wrapper */}
        <Box sx={{
           width: '25%',       // Column width
           minWidth: '250px',  // Minimum width
           overflowY: 'auto',  // Enable vertical scroll within this column
           height: '100%',     // Ensure Box takes full height of the container
           mx: 'auto',
           display: isSmallScreen ? 'none' : 'block', // Hide on small screens using display
           }}>
          <LeftColumn />
        </Box>

        {/* Middle Column Wrapper */}
        <Box sx={{
            flexGrow: 1,          // Allow middle column to take available horizontal space
            overflowY: 'auto',    // Enable vertical scroll within this column
            width: isSmallScreen ? '100%' : 'auto', // Full width on small screens
            height: '100%',       // Ensure Box takes full height of the container
            mx: 'auto',
            }}>
          <MiddleColumn>
            <Outlet /> {/* Renders the active route's component */}
          </MiddleColumn>
        </Box>

        {/* Right Column Wrapper */}
        <Box sx={{
          width: '25%',       // Column width
          minWidth: '250px',  // Minimum width
          overflowY: 'auto',  // Enable vertical scroll within this column
          height: '100%',     // Ensure Box takes full height of the container
          mx: 'auto',
          display: isSmallScreen ? 'none' : 'block', // Hide on small screens using display
           }}>
          <RightColumn />
        </Box>
      </Box>
    </Box>
  );
};

export default MainGameLayout;
