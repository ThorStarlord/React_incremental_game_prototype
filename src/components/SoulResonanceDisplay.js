import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { GameStateContext } from '../context/GameStateContext';

const SoulResonanceDisplay = () => {
    const { player } = useContext(GameStateContext);
    
    return (
        <Box className="soul-resonance-display">
            <Typography variant="h6">
                Essence: {player.essence}
            </Typography>
        </Box>
    );
};

export default SoulResonanceDisplay;