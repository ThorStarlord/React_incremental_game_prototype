import React from 'react';
import { useGameState } from '../../../../context/GameStateContext';
import { Typography, Box } from '@mui/material';

/**
 * Interface for Faction data in game state
 */
interface Faction {
    name: string;
    level: number;
    members: string[];
    [key: string]: any; // For additional faction properties
}

/**
 * Interface for the game state
 */
interface GameState {
    faction: Faction;
    [key: string]: any; // For other game state properties
}

/**
 * FactionSummaryPanel component
 * Displays a summary of the player's faction information on the dashboard
 * 
 * @returns {JSX.Element} The faction summary panel component
 */
const FactionSummaryPanel: React.FC = (): JSX.Element => {
    const { gameState } = useGameState() as { gameState: GameState };

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
