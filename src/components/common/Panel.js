import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Panel = ({ title, children, sx = {} }) => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        ...sx 
      }}
    >
      {title && (
        <Box sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </Paper>
  );
};

export default Panel;