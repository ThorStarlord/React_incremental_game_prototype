import React from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    List, 
    ListItem, 
    ListItemText,
    Button,
    Divider,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { dungeons } from '../../../../modules/data/dungeons';
import { regions } from '../../../../modules/data/regions';
import './DungeonPanel.css';

/**
 * Interface for the DungeonPanel component props
 */
interface DungeonPanelProps {
    dungeonId: string;
    regionId: string;
    onBack: () => void;
    onStartBattle: (dungeonId: string) => void;
}

/**
 * Interface for a Dungeon
 */
interface Dungeon {
    id: string;
    name: string;
    type: string;
    description: string;
    dangers: string[];
    rewards: string[];
}

/**
 * Interface for a Region
 */
interface Region {
    id: string;
    name: string;
}

/**
 * DungeonPanel Component
 * 
 * Displays detailed information about a dungeon including its dangers and rewards,
 * and provides an option to start exploring it.
 * 
 * @param {DungeonPanelProps} props - The component props
 * @returns {JSX.Element | null} The rendered component or null if dungeon not found
 */
const DungeonPanel: React.FC<DungeonPanelProps> = ({ dungeonId, regionId, onBack, onStartBattle }) => {
    const dungeon = dungeons.find(d => d.id === dungeonId) as Dungeon | undefined;
    if (!dungeon) return null;

    const region = regions.find(r => r.id === regionId) as Region | undefined;

    return (
        <Paper className="dungeon-panel">
            <Box className="dungeon-header">
                <IconButton onClick={onBack} className="back-button">
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" component="h2">
                        {dungeon.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {dungeon.type} - {region?.name}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            <Box className="dungeon-content">
                <Box className="dungeon-description">
                    <Typography paragraph>
                        {dungeon.description}
                    </Typography>
                </Box>

                <Box className="dungeon-section">
                    <Typography variant="h6" gutterBottom>
                        Dangers
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {dungeon.dangers.map((danger, index) => (
                            <Chip 
                                key={index} 
                                label={danger} 
                                color="error" 
                                variant="outlined" 
                            />
                        ))}
                    </Stack>
                </Box>

                <Box className="dungeon-section">
                    <Typography variant="h6" gutterBottom>
                        Potential Rewards
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {dungeon.rewards.map((reward, index) => (
                            <Chip 
                                key={index} 
                                label={reward} 
                                color="success" 
                                variant="outlined" 
                            />
                        ))}
                    </Stack>
                </Box>

                <Box className="dungeon-actions">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={() => onStartBattle(dungeonId)}
                    >
                        Explore Dungeon
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default DungeonPanel;
