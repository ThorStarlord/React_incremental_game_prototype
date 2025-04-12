/**
 * @file MiddleColumn.tsx
 * @description Central column layout component for the incremental RPG game interface.
 * Renders child components passed to it dynamically.
 */

import React, { ReactNode, memo } from 'react';
import { 
  Box, 
  useTheme,
  SxProps,
  Theme
} from '@mui/material';

/**
 * Props for the MiddleColumn component
 */
interface MiddleColumnProps {
  /** Title displayed at the top of the column */
  title?: string; // Title is optional now, content might provide its own
  /** Content to render within the middle column */
  children?: ReactNode; 
  /** Additional Material-UI style props to apply to the column */
  sx?: SxProps<Theme>;
}

/**
 * MiddleColumn Component
 * 
 * The central layout component for the game interface, displaying the main game content.
 * 
 * @component
 */
const MiddleColumn: React.FC<MiddleColumnProps> = ({ 
  title, // Title is now optional
  children, 
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Box 
      id="middle-column"
      sx={{ 
        ...sx,
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        flexGrow: 1, // Allow middle column to take remaining space
        overflowY: 'auto' // Allow scrolling for content
      }}
    >
      {/* Render children passed from MainGameLayout */}
      {children}
    </Box>
  );
};

export default memo(MiddleColumn);
