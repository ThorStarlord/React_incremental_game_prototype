import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    IconButton,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import SecurityIcon from '@mui/icons-material/Security';

// Import actions from worldSlice (to be created)
import { completeLocationActivity } from '../../state/WorldSlice';
import './TownPanel.css';
import { RootState } from '../../../../app/store';

/**
 * Interface for NPC data
 */
interface NPC {
  id: string;
  name: string;
  role?: string;
}

/**
 * Interface for quest data
 */
interface Quest {
  id: string;
  name: string;
  description: string;
}

/**
 * Interface for location data
 */
interface LocationData {
  type?: string;
  description?: string;
  lore?: string;
  npcs?: NPC[];
  quests?: Quest[];
}

/**
 * Interface for location
 */
interface Location {
  id: string;
  name: string;
  discovered: boolean;
  data?: LocationData;
}

/**
 * Interface for region
 */
interface Region {
  name: string;
  locations: Location[];
}

/**
 * Interface for activity
 */
interface Activity {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

/**
 * Interface for TownPanel props
 */
interface TownPanelProps {
  regionId: string;
  locationId: string;
  onBack: () => void;
  onNpcSelect: (npcId: string) => void;
}

/**
 * Component for displaying town/location details and interactions
 * 
 * @param {TownPanelProps} props - Component props
 * @returns {JSX.Element | null} The rendered component or null if data is missing
 */
const TownPanel: React.FC<TownPanelProps> = ({ regionId, locationId, onBack, onNpcSelect }) => {
    const dispatch = useDispatch();
    const world = useSelector((state: RootState) => state.world);
    const playerStats = useSelector((state: RootState) => state.player || {});
    const [activeTab, setActiveTab] = useState<number>(0);

    // If no world state or region/location not found
    if (!world || !world.regions || !world.regions[regionId]) return null;

    const region = world.regions[regionId];
    const location = region.locations.find(loc => loc.id === locationId);
    
    // If location doesn't exist or hasn't been discovered yet
    if (!location || !location.discovered) return null;
    
    // Town locations can have additional data we might want to render
    const locationData = location.data || {};
    const locationNpcs = locationData.npcs || [];
    const locationType = locationData.type || 'settlement';
    
    /**
     * Define available activities based on location type
     * 
     * @returns {Activity[]} Array of available activities
     */
    const getAvailableActivities = (): Activity[] => {
        const baseActivities: Activity[] = [
            { 
                id: 'explore', 
                name: 'Explore Surroundings', 
                description: 'Search the area for resources, secrets, or encounters.', 
                icon: <LocalActivityIcon />,
                action: () => dispatch(completeLocationActivity({ 
                    regionId, 
                    locationId, 
                    activityId: 'explore' 
                }))
            }
        ];
        
        // Add activities based on location type
        switch (locationType) {
            case 'town':
            case 'village':
            case 'city':
                return [
                    ...baseActivities,
                    { 
                        id: 'market', 
                        name: 'Visit Market', 
                        description: 'Buy and sell items at the local market.', 
                        icon: <StoreIcon />,
                        action: () => console.log('Market not implemented')
                    },
                    { 
                        id: 'inn', 
                        name: 'Rest at Inn', 
                        description: 'Restore health and energy by resting at the inn.', 
                        icon: <HotelIcon />,
                        action: () => dispatch(completeLocationActivity({ 
                            regionId, 
                            locationId, 
                            activityId: 'inn' 
                        }))
                    }
                ];
            case 'outpost':
                return [
                    ...baseActivities,
                    { 
                        id: 'training', 
                        name: 'Train with Guards', 
                        description: 'Improve your combat skills with the local guards.', 
                        icon: <SecurityIcon />,
                        action: () => dispatch(completeLocationActivity({ 
                            regionId, 
                            locationId, 
                            activityId: 'training' 
                        }))
                    }
                ];
            default:
                return baseActivities;
        }
    };
    
    const activities = getAvailableActivities();
    
    /**
     * Handle tab change event
     * 
     * @param {React.SyntheticEvent} event - The event
     * @param {number} newValue - The new tab index
     */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    return (
        <Paper className="town-panel" sx={{ p: 2 }}>
            <Box className="town-header" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={onBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" component="h2">
                        {location.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {locationData.type || 'Location'} - {region.name}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box className="town-content">
                <Box className="town-description" sx={{ mb: 3 }}>
                    <Typography paragraph>
                        {locationData.description || `A ${locationType} in the ${region.name} region.`}
                    </Typography>
                    
                    {locationData.lore && (
                        <Card variant="outlined" sx={{ mb: 2, bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Local Lore
                                </Typography>
                                <Typography variant="body2">
                                    {locationData.lore}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                <Box sx={{ width: '100%', mb: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="Activities" />
                            <Tab label="Residents" />
                            <Tab label="Quests" />
                        </Tabs>
                    </Box>
                    
                    {/* Activities Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                {activities.map(activity => (
                                    <Grid item xs={12} sm={6} key={activity.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                                                        {activity.icon}
                                                    </Avatar>
                                                    <Typography variant="h6">{activity.name}</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {activity.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    onClick={activity.action}
                                                    fullWidth
                                                >
                                                    {activity.name}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                    
                    {/* Residents Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ mt: 2 }}>
                            {locationNpcs.length > 0 ? (
                                <List>
                                    {locationNpcs.map((npc) => (
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
                                                secondary={npc.role || 'Resident'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                                    No notable residents found in this location.
                                </Typography>
                            )}
                        </Box>
                    )}
                    
                    {/* Quests Tab */}
                    {activeTab === 2 && (
                        <Box sx={{ mt: 2 }}>
                            {locationData.quests && locationData.quests.length > 0 ? (
                                <List>
                                    {locationData.quests.map((quest) => (
                                        <ListItem 
                                            button 
                                            key={quest.id}
                                            onClick={() => console.log('Quest selected', quest.id)}
                                        >
                                            <ListItemText 
                                                primary={quest.name}
                                                secondary={quest.description}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                                    No quests available at this location.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Status Info */}
                <Box 
                    sx={{ 
                        mt: 2, 
                        p: 1, 
                        bgcolor: 'background.paper', 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                    }}
                >
                    <Typography variant="body2">
                        Region danger level: <b>{region.dangerLevel}</b>
                    </Typography>
                    <Typography variant="body2">
                        Time of day: <b>{world.globalProperties?.isNight ? 'Night' : 'Day'}</b>
                    </Typography>
                    <Typography variant="body2">
                        Weather: <b>{world.globalProperties?.weatherCondition}</b>
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default TownPanel;
