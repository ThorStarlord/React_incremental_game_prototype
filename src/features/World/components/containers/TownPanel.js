import React from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    List, 
    ListItem, 
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import { towns } from '../../../../modules/data/towns';
import { regions } from '../../../../modules/data/regions';
import { npcs } from '../../../../modules/data/npcs';
import './TownPanel.css';

const TownPanel = ({ townId, onBack, onNpcSelect }) => {
    const town = towns.find(t => t.id === townId);
    if (!town) return null;

    const region = regions.find(r => r.id === town.regionId);
    const townNpcs = town.npcIds.map(id => npcs.find(npc => npc.id === id)).filter(Boolean);

    return (
        <Paper className="town-panel">
            <Box className="town-header">
                <IconButton onClick={onBack} className="back-button">
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" component="h2">
                        {town.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {town.type} - {region.name}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            <Box className="town-content">
                <Box className="town-description">
                    <Typography paragraph>
                        {town.description}
                    </Typography>
                </Box>

                {townNpcs.length > 0 && (
                    <Box className="town-npcs">
                        <Typography variant="h6" gutterBottom>
                            Notable Residents
                        </Typography>
                        <List>
                            {townNpcs.map(npc => (
                                <ListItem 
                                    button 
                                    key={npc.id}
                                    onClick={() => onNpcSelect(npc.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={npc.name}
                                        secondary={npc.type}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Box className="town-activities">
                    <Typography variant="h6" gutterBottom>
                        Available Activities
                    </Typography>
                    <List>
                        <ListItem>
                            <Button variant="outlined" fullWidth>
                                Visit Market
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button variant="outlined" fullWidth>
                                Rest at Inn
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button variant="outlined" fullWidth>
                                Visit Guild Hall
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </Paper>
    );
};

export default TownPanel;