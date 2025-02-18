import React, { useContext } from 'react';
import { GameStateContext } from '../context/GameStateContext';
import { Typography, Box } from '@mui/material';

const SoulResonanceDisplay = () => {
  const { essence } = useContext(GameStateContext);

  return (
    <Box>
      <Typography variant="h6">Essence: {essence}</Typography>
    </Box>
  );
};

export default SoulResonanceDisplay;