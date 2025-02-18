import React, { useContext } from 'react';
import { GameStateContext } from '../../context/GameStateContext';
import { Typography, Box } from '@mui/material';

const SoulResonanceDisplay = () => {
  const { soulResonance } = useContext(GameStateContext);

  return (
    <Box>
      <Typography variant="h6">Soul Resonance: {soulResonance}</Typography>
    </Box>
  );
};

export default SoulResonanceDisplay;