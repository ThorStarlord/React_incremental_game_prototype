import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface PanelProps {
  title?: ReactNode;
  children: ReactNode;
}

/**
 * Panel component for containing content with a title
 */
const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {title && (
        <Box mb={2}>
          {typeof title === 'string' ? (
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          ) : (
            title
          )}
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default Panel;
