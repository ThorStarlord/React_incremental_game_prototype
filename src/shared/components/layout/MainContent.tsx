import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface MainContentProps {
  children?: ReactNode;
  fullWidth?: boolean;
  padding?: number | string;
}

/**
 * MainContent Component
 * 
 * A container for the main content area of the application
 * 
 * @param {ReactNode} children - Content to display
 * @param {boolean} fullWidth - Whether to use full width
 * @param {number|string} padding - Custom padding value
 * @returns {JSX.Element} The rendered component
 */
const MainContent: React.FC<MainContentProps> = ({
  children,
  fullWidth = false,
  padding = 2
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: fullWidth ? '100%' : '1200px',
        margin: '0 auto',
        padding,
        boxSizing: 'border-box'
      }}
    >
      {children}
    </Box>
  );
};

export default MainContent;
