import React from 'react';
import { Box, Typography } from '@mui/material';
import EssenceDisplay from './EssenceDisplay';
import './Header.css';

const Header = () => {
  return (
    <Box className="header">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" align="center">Game Header</Typography>
        <EssenceDisplay />
      </Box>
    </Box>
  );
};

export default Header;