import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';

/**
 * Interface for Panel component props
 */
interface PanelProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Panel component that provides consistent styling for content panels
 */
const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {title && (
        <>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      
      <Box>
        {children}
      </Box>
    </Paper>
  );
};

export default Panel;
