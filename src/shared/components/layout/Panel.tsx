import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

/**
 * Props for Panel component
 */
interface PanelProps {
  /** Panel title */
  title?: string;
  /** Panel content */
  children: ReactNode;
  /** Additional styling */
  sx?: any;
}

/**
 * Panel component for consistent UI containers
 */
const Panel: React.FC<PanelProps> = ({ title, children, sx = {} }) => {
  return (
    <Paper 
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default Panel;
