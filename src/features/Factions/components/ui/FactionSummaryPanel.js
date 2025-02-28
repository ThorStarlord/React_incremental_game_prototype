import React from 'react';
import { useGameState } from '../../../../context/GameStateContext';
import { Typography, Box } from '@mui/material';

const FactionSummaryPanel = () => {
    const { gameState } = useGameState();

    return (
        <div className="dashboard-panel">
            <Typography variant="h5" gutterBottom>
                Faction Summary
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
                <Typography>
                    Faction Name: {gameState.faction.name || 'Your Faction'}
                </Typography>
                <Typography>
                    Level: {gameState.faction.level || 1}
                </Typography>
                <Typography>
                    Members: {gameState.faction.members?.length || 0}
                </Typography>
            </Box>
        </div>
    );
};

export default FactionSummaryPanel;
