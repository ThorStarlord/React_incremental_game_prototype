import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    Tab,
    Chip,
    Grid,
    LinearProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
// Import the actions (to be created in worldSlice)
import { selectRegion, visitLocation } from '../../state/WorldSlice';
import './RegionsPanel.css';
import { RootState } from '../../../../app/store';

/**
 * Interface for a resource with abundance
 */
interface Resource {
    abundance: string;
}

/**
 * Interface for a monster with level and spawn rate
 */
interface Monster {
    level: number;
    spawnRate: number;
}

/**
 * Interface for a location in a region
 */
interface Location {
    id: string;
    name: string;
    discovered: boolean;
}

/**
 * Interface for region unlock requirements
 */
interface UnlockRequirements {
    playerLevel?: number;
    questCompleted?: string;
}

/**
 * Interface for a region
 */
interface Region {
    id: string;
    name: string;
    description: string;
    explored: number;
    dangerLevel: number;
    unlocked: boolean;
    unlockRequirements?: UnlockRequirements;
    resources?: Record<string, Resource>;
    monsters?: Record<string, Monster>;
    locations?: Location[];
}

/**
 * Interface for RegionListItem props
 */
interface RegionListItemProps {
    regionId: string;
    region: Region;
    onLocationSelect: (regionId: string, locationId: string) => void;
}

/**
 * Interface for RegionsPanel props
 */
interface RegionsPanelProps {
    onLocationSelect: (regionId: string, locationId: string) => void;
}

/**
 * Component for displaying a single region with expandable details
 */
const RegionListItem: React.FC<RegionListItemProps> = ({ regionId, region, onLocationSelect }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const dispatch = useDispatch();
    const playerLevel = useSelector((state: RootState) => state?.player?.level || 1);
    const completedQuests = useSelector((state: RootState) => state?.quests?.completed || []);

    /**
     * Check if region meets unlock requirements
     * @returns {boolean} Whether the region can be unlocked
     */
    const canUnlock = (): boolean => {
        if (region.unlocked) return true;
        if (!region.unlockRequirements) return true;
        
        const { playerLevel: reqLevel, questCompleted: reqQuest } = region.unlockRequirements;
        
        return (
            (!reqLevel || playerLevel >= reqLevel) && 
            (!reqQuest || completedQuests.includes(reqQuest))
        );
    };

    /**
     * Handle tab change
     * @param {React.SyntheticEvent} event - The event
     * @param {number} newValue - New tab index
     */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setSelectedTab(newValue);
    };

    /**
     * Handle region selection
     */
    const handleRegionSelect = (): void => {
        if (region.unlocked) {
            dispatch(selectRegion(regionId));
        }
    };

    /**
     * Handle location selection
     * @param {string} locationId - ID of the location
     */
    const handleLocationSelect = (locationId: string): void => {
        if (region.unlocked) {
            onLocationSelect(regionId, locationId);
            dispatch(visitLocation({ regionId, locationId }));
        }
    };

    /**
     * Get the abundance color for resource display
     * @param {string} abundance - Resource abundance level
     * @returns {string} MUI color name for chip
     */
    const getAbundanceColor = (abundance: string): "success" | "primary" | "warning" | "default" => {
        switch(abundance) {
            case 'high': return 'success';
            case 'medium': return 'primary';
            case 'low': return 'warning';
            default: return 'default';
        }
    };

    /**
     * Get a descriptive text for danger level
     * @param {number} level - Danger level
     * @returns {string} Descriptive text
     */
    const getDangerText = (level: number): string => {
        if (level <= 1) return 'Safe';
        if (level <= 3) return 'Moderate';
        if (level <= 5) return 'Dangerous';
        return 'Deadly';
    };

    return (
        <Box className="region-item" sx={{ mb: 2, border: '1px solid', borderColor: region.unlocked ? 'primary.main' : 'text.disabled', borderRadius: 1 }}>
            <ListItem 
                button 
                onClick={handleRegionSelect}
                disabled={!region.unlocked}
                sx={{ 
                    bgcolor: region.unlocked ? 'background.paper' : 'action.disabledBackground',
                    '&:hover': { bgcolor: region.unlocked ? 'action.hover' : 'action.disabledBackground' }
                }}
            >
                <ListItemText
                    primary={
                        <Box display="flex" alignItems="center">
                            {region.unlocked ? 
                                <LockOpenIcon fontSize="small" color="success" sx={{ mr: 1 }} /> : 
                                <LockIcon fontSize="small" color="disabled" sx={{ mr: 1 }} />
                            }
                            {region.name}
                        </Box>
                    }
                    secondary={region.description}
                />
                <Box>
                    <Typography variant="caption" display="block">
                        Explored: {Math.round(region.explored * 100)}%
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={region.explored * 100}
                        sx={{ height: 5, width: 100 }}
                    />
                </Box>
                <IconButton onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </ListItem>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box className="region-details" sx={{ p: 2 }}>
                    {!region.unlocked && (
                        <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Unlock Requirements:</Typography>
                            {region.unlockRequirements?.playerLevel && (
                                <Typography variant="body2">
                                    Player Level: {playerLevel}/{region.unlockRequirements.playerLevel}
                                </Typography>
                            )}
                            {region.unlockRequirements?.questCompleted && (
                                <Typography variant="body2">
                                    Quest: {completedQuests.includes(region.unlockRequirements.questCompleted) ? '✓' : '✗'} 
                                    {' '}{region.unlockRequirements.questCompleted.replace(/_/g, ' ')}
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="primary">Danger Level:</Typography>
                            <Box display="flex" alignItems="center">
                                <Chip 
                                    label={getDangerText(region.dangerLevel)}
                                    color={region.dangerLevel <= 2 ? "success" : region.dangerLevel <= 4 ? "warning" : "error"}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2">({region.dangerLevel}/10)</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="Resources" />
                            <Tab label="Monsters" />
                            <Tab label="Locations" />
                        </Tabs>
                    </Box>

                    {/* Resources Tab */}
                    {selectedTab === 0 && (
                        <List dense>
                            {Object.entries(region.resources || {}).map(([resourceId, resource]) => (
                                <ListItem key={resourceId}>
                                    <Chip 
                                        label={resourceId.charAt(0).toUpperCase() + resourceId.slice(1)}
                                        size="small"
                                        color={getAbundanceColor(resource.abundance)}
                                        sx={{ mr: 1 }}
                                    />
                                    <ListItemText 
                                        secondary={`Abundance: ${resource.abundance}`} 
                                    />
                                </ListItem>
                            ))}
                            {Object.keys(region.resources || {}).length === 0 && (
                                <Typography variant="body2" sx={{ p: 1 }}>No resources discovered</Typography>
                            )}
                        </List>
                    )}

                    {/* Monsters Tab */}
                    {selectedTab === 1 && (
                        <List dense>
                            {Object.entries(region.monsters || {}).map(([monsterId, monster]) => (
                                <ListItem key={monsterId}>
                                    <ListItemText 
                                        primary={monsterId.charAt(0).toUpperCase() + monsterId.slice(1)}
                                        secondary={`Level: ${monster.level} | Spawn Rate: ${monster.spawnRate * 100}%`} 
                                    />
                                </ListItem>
                            ))}
                            {Object.keys(region.monsters || {}).length === 0 && (
                                <Typography variant="body2" sx={{ p: 1 }}>No monsters discovered</Typography>
                            )}
                        </List>
                    )}

                    {/* Locations Tab */}
                    {selectedTab === 2 && (
                        <List dense>
                            {(region.locations || []).map(location => (
                                <ListItem 
                                    button 
                                    key={location.id}
                                    onClick={() => handleLocationSelect(location.id)}
                                    disabled={!location.discovered && region.unlocked}
                                >
                                    <ListItemText 
                                        primary={location.discovered ? location.name : '???'}
                                        secondary={location.discovered ? "" : "Undiscovered location"} 
                                    />
                                </ListItem>
                            ))}
                            {(region.locations || []).length === 0 && (
                                <Typography variant="body2" sx={{ p: 1 }}>No locations discovered</Typography>
                            )}
                        </List>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

/**
 * RegionsPanel Component - displays all world regions with their details
 */
const RegionsPanel: React.FC<RegionsPanelProps> = ({ onLocationSelect }) => {
    const regions = useSelector((state: RootState) => state.world?.regions || {});

    return (
        <Paper className="regions-panel" sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                World Regions
            </Typography>
            <List>
                {Object.entries(regions).map(([regionId, region]) => (
                    <RegionListItem 
                        key={regionId} 
                        regionId={regionId}
                        region={region}
                        onLocationSelect={onLocationSelect}
                    />
                ))}
            </List>
        </Paper>
    );
};

export default RegionsPanel;
