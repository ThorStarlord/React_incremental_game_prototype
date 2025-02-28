import React, { useState } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    List, 
    ListItem, 
    ListItemText,
    Collapse,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { regions } from '../../../../modules/data/regions';
import { towns } from '../../../../modules/data/towns';
import { dungeons } from '../../../../modules/data/dungeons';
import './RegionsPanel.css';

const RegionListItem = ({ region, onTownSelect, onDungeonSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    
    const regionTowns = towns.filter(town => town.regionId === region.id);
    const regionDungeons = dungeons.filter(dungeon => dungeon.regionId === region.id);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box className="region-item">
            <ListItem>
                <ListItemText
                    primary={region.name}
                    secondary={region.description}
                />
                <IconButton onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </ListItem>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box className="region-details">
                    <Typography variant="subtitle2" color="primary">Features:</Typography>
                    <List dense>
                        {region.features.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemText secondary={feature} />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="subtitle2" color="primary">Resources:</Typography>
                    <List dense>
                        {region.resources.map((resource, index) => (
                            <ListItem key={index}>
                                <ListItemText secondary={resource} />
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="Towns" />
                            <Tab label="Points of Interest" />
                        </Tabs>
                    </Box>

                    {selectedTab === 0 && (
                        <List dense>
                            {regionTowns.map(town => (
                                <ListItem 
                                    button 
                                    key={town.id}
                                    onClick={() => onTownSelect(town.id)}
                                >
                                    <ListItemText 
                                        primary={town.name}
                                        secondary={town.type}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {selectedTab === 1 && (
                        <List dense>
                            {regionDungeons.map(dungeon => (
                                <ListItem 
                                    button 
                                    key={dungeon.id}
                                    onClick={() => onDungeonSelect(dungeon.id, region.id)}
                                >
                                    <ListItemText 
                                        primary={dungeon.name}
                                        secondary={dungeon.type}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

const RegionsPanel = ({ onTownSelect, onDungeonSelect }) => {
    return (
        <Paper className="regions-panel">
            <Typography variant="h5" component="h2" gutterBottom>
                Regions of Aethel
            </Typography>
            <List>
                {regions.map(region => (
                    <RegionListItem 
                        key={region.id} 
                        region={region}
                        onTownSelect={onTownSelect}
                        onDungeonSelect={onDungeonSelect}
                    />
                ))}
            </List>
        </Paper>
    );
};

export default RegionsPanel;