import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Interface for TabContent component props
 */
interface TabContentProps {
  /** Whether the content is currently loading */
  isLoading?: boolean;
  /** Whether there's an error loading content */
  error?: string | null;
  /** Value that indicates which tab is selected */
  value: number | string;
  /** Index or identifier of this tab panel */
  index: number | string;
  /** Optional label for this tab content */
  label?: string;
  /** Child components to render inside this tab */
  children: React.ReactNode;
  /** Additional CSS styling */
  sx?: React.CSSProperties | Record<string, any>;
}

/**
 * Generic component that renders tab content with loading and error states
 * 
 * @param props - Component props
 * @returns Tab content container component
 */
const TabContent: React.FC<TabContentProps> = ({ 
  value, 
  index, 
  children, 
  isLoading = false,
  error = null,
  label,
  sx = {}
}) => {
  const hidden = value !== index;
  
  // Show loading state if loading
  if (isLoading) {
    return (
      <Box
        role="tabpanel"
        hidden={hidden}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          ...sx
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <Box
        role="tabpanel"
        hidden={hidden}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          ...sx
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  // Regular content display
  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ p: 2, ...sx }}
    >
      {!hidden && children}
    </Box>
  );
};

export default TabContent;
