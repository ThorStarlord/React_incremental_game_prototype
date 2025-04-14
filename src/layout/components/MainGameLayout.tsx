/**
 * @file MainGameLayout.tsx
 * @description Main layout container for the incremental RPG game interface.
 * Provides the basic responsive 3-column structure.
 */

import React, { useEffect } from 'react'; // Import useEffect
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';
import { useAppDispatch } from '../../app/hooks'; // Import useAppDispatch
import { fetchTraitsThunk } from '../../features/Traits/state/TraitThunks'; // Import the thunk

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
  const dispatch = useAppDispatch(); // Get the dispatch function

  // Load traits when this layout mounts
  useEffect(() => {
    // Dispatch the thunk action to load traits
    dispatch(fetchTraitsThunk());
  }, [dispatch]); // Dependency array ensures it runs only once on mount

  return (
    // Root container: Removed fixed height and overflow
    <Box sx={{
      width: '100%',
      maxWidth: '1600px', // Optional: Add a max-width if desired
      p: isSmallScreen ? 1 : 2, // Responsive padding
      display: 'flex',
      flexDirection: 'column', // Stack Header and Columns vertically
      mx: 'auto',             // Center layout
      gap: 1,                 // Gap between Header and Columns container
    }}>
      <CssBaseline /> {/* Ensures consistent baseline styles */}
      <Header /> {/* Added Header component */}

      {/* Columns container: Removed overflow */}
      <Box sx={{
        display: 'flex',      // Arrange columns horizontally
        flexGrow: 1,          // Allow this box to grow vertically if needed, but not fixed height
        gap: 1,               // Gap between columns
       }}>

        {/* Left Column Wrapper */}
        <Box sx={{
           width: '25%',       // Column width
           minWidth: '250px',  // Minimum width
           mx: 'auto',
           display: isSmallScreen ? 'none' : 'block', // Hide on small screens using display
           }}>
          <LeftColumn />
        </Box>

        {/* Middle Column Wrapper */}
        <Box sx={{
            flexGrow: 1,          // Allow middle column to take available horizontal space
            width: isSmallScreen ? '100%' : 'auto', // Full width on small screens
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
