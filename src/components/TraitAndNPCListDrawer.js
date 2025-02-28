import React, { useContext, useState, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  LinearProgress,
  Button,
  Badge,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LockIcon from '@mui/icons-material/Lock';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { GameStateContext } from '../context/GameStateContext';
import { getDiscoveryProgress } from '../utils/discoveryUtils';

// Initial player state in GameStateContext.js
const initialPlayerState = {
  // ... other player properties
  level: 1,
  gold: 100,
  essence: 50,
  discoveredTraits: [], // IDs of discovered traits
  metNPCs: [], // IDs of met NPCs
  highestRelationship: 0, // Highest NPC relationship value
  acquiredTraits: [], // Traits the player has acquired
  equippedTraits: [], // Traits currently equipped
  permanentTraits: [], // Traits made permanent
  traitSlots: 2, // Number of available trait slots
};

// Example character/NPC object structure
{
  id: 'npc1',
  name: 'Elara',
  role: 'Mage',
  relationship: 45,
  // New influence-related fields
  influenceLevel: 35, // 0-100 scale
  influenceThresholds: [20, 40, 60, 80, 100], // Key thresholds for progression
  playerControlled: false, // Auto-sets to true when influence reaches 100%
  playerCreated: false, // true for characters created by player
  influenceUnlocks: [
    { level: 20, feature: 'Basic Commands', description: 'Character will follow simple orders' },
    { level: 40, feature: 'Combat Support', description: 'Character will assist in combat' },
    { level: 60, feature: 'Skill Sharing', description: 'Access to character\'s basic abilities' },
    { level: 80, feature: 'Trait Transfer', description: 'Can extract traits from this character' },
    { level: 100, feature: 'Full Control', description: 'Complete integration into your character pool' }
  ]
}

// TabPanel component for showing tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TraitAndNPCListDrawer = ({ open, onClose, focusedId, sourceType }) => {
  // Game state and discovery progress
  const gameState = useContext(GameStateContext);
  const { traits, npcs } = gameState;
  const discoveryProgress = useMemo(() => getDiscoveryProgress(gameState), [gameState]);
  
  // Progress percentages
  const npcProgress = discoveryProgress.totalNPCs > 0 
    ? (discoveryProgress.metNPCCount / discoveryProgress.totalNPCs) * 100 : 0;
  const traitProgress = discoveryProgress.totalTraits > 0 
    ? (discoveryProgress.discoveredTraitCount / discoveryProgress.totalTraits) * 100 : 0;
  
  // Tab state
  const [tabValue, setTabValue] = useState(sourceType === 'npc' ? 0 : 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUndiscovered, setShowUndiscovered] = useState(false);
  
  // Filter controls state
  const [showFilters, setShowFilters] = useState(false);
  
  // NPC filters
  const [locationFilter, setLocationFilter] = useState('all');
  const [relationshipRange, setRelationshipRange] = useState([0, 100]);
  
  // Trait filters
  const [traitTypeFilter, setTraitTypeFilter] = useState('all');
  const [traitSourceFilter, setTraitSourceFilter] = useState('all');
  const [traitCostRange, setTraitCostRange] = useState([0, 500]);
  const [traitStatusFilter, setTraitStatusFilter] = useState('all');
  const [npcInteractionFilter, setNpcInteractionFilter] = useState('all');
  
  // Character filters
  const [characterFilter, setCharacterFilter] = useState('all');
  
  // Sort options
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle sort order toggle
  const handleSortOrderChange = (event, newOrder) => {
    if (newOrder !== null) {
      setSortOrder(newOrder);
    }
  };
  
  // Get all unique trait types
  const traitTypes = useMemo(() => {
    if (!traits?.copyableTraits) return [];
    
    const types = new Set();
    Object.values(traits.copyableTraits).forEach(trait => {
      if (trait.type) {
        types.add(trait.type);
      }
    });
    
    return Array.from(types).sort();
  }, [traits]);
  
  // Get all unique NPC locations
  const npcLocations = useMemo(() => {
    if (!npcs) return [];
    
    const locations = new Set();
    npcs.forEach(npc => {
      if (npc.location) {
        locations.add(npc.location);
      }
    });
    
    return Array.from(locations).sort();
  }, [npcs]);
  
  // Get all trait sources (NPC names that provide traits)
  const traitSources = useMemo(() => {
    if (!traits?.copyableTraits || !npcs) return [];
    
    const sources = new Set();
    Object.values(traits.copyableTraits).forEach(trait => {
      if (trait.sourceNpc) {
        const sourceNpc = npcs.find(npc => npc.id === trait.sourceNpc);
        if (sourceNpc) {
          sources.add(sourceNpc.id);
        }
      }
    });
    
    return Array.from(sources);
  }, [traits, npcs]);
  
  // Filter NPCs based on all criteria
  const filteredNpcs = useMemo(() => {
    if (!npcs) return [];
    
    return npcs
      .filter(npc => {
        // Discovery filter
        const isDiscovered = discoveryProgress.metNPCs.includes(npc.id);
        const showBasedOnDiscovery = isDiscovered || showUndiscovered;
        
        // Search query filter
        const matchesSearch = searchQuery === '' || 
          npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (npc.role && npc.role.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Location filter
        const matchesLocation = locationFilter === 'all' || 
          npc.location === locationFilter;
        
        // Relationship range filter
        const npcRelationship = npc.relationship || 0;
        const inRelationshipRange = 
          npcRelationship >= relationshipRange[0] && 
          npcRelationship <= relationshipRange[1];

        // NPC interaction filter
        let matchesInteraction = true;
        switch (npcInteractionFilter) {
          case 'high':
            matchesInteraction = (npc.relationship || 0) >= 70;
            break;
          case 'medium':
            matchesInteraction = (npc.relationship || 0) >= 30 && (npc.relationship || 0) < 70;
            break;
          case 'low':
            matchesInteraction = (npc.relationship || 0) < 30 && (npc.relationship || 0) > 0;
            break;
          case 'none':
            matchesInteraction = (npc.relationship || 0) === 0;
            break;
          case 'hasTraits':
            matchesInteraction = npcTraitMap[npc.id] && npcTraitMap[npc.id].length > 0;
            break;
          default:
            matchesInteraction = true;
        }

        return showBasedOnDiscovery && matchesSearch && matchesLocation && inRelationshipRange && matchesInteraction;
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'relationship':
            comparison = (a.relationship || 0) - (b.relationship || 0);
            break;
          case 'power':
            comparison = (a.powerLevel || 1) - (b.powerLevel || 1);
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [
    npcs, 
    searchQuery, 
    discoveryProgress.metNPCs, 
    showUndiscovered, 
    locationFilter, 
    relationshipRange, 
    sortBy, 
    sortOrder,
    npcInteractionFilter
  ]);
  
  // Filter traits based on all criteria
  const filteredTraits = useMemo(() => {
    if (!traits?.copyableTraits) return [];
    
    return Object.entries(traits.copyableTraits)
      .filter(([id, trait]) => {
        // Discovery filter
        const isDiscovered = discoveryProgress.discoveredTraits.includes(id);
        const showBasedOnDiscovery = isDiscovered || showUndiscovered;
        
        // Search query filter
        const matchesSearch = searchQuery === '' || 
          trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trait.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (trait.type && trait.type.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Type filter
        const matchesType = traitTypeFilter === 'all' || 
          trait.type === traitTypeFilter;
        
        // Source filter
        const matchesSource = traitSourceFilter === 'all' || 
          trait.sourceNpc === traitSourceFilter;
        
        // Cost range filter
        const traitCost = trait.essenceCost || 0;
        const inCostRange = 
          traitCost >= traitCostRange[0] && 
          traitCost <= traitCostRange[1];
        
        // Acquisition status filter
        const isAcquired = gameState.player?.acquiredTraits?.includes(id);
        const isPermanent = gameState.player?.permanentTraits?.includes(id);
        const isEquipped = gameState.player?.equippedTraits?.includes(id);
        
        let matchesStatus = true;
        switch (traitStatusFilter) {
          case 'acquired':
            matchesStatus = isAcquired;
            break;
          case 'unacquired':
            matchesStatus = !isAcquired;
            break;
          case 'equipped':
            matchesStatus = isEquipped;
            break;
          case 'permanent':
            matchesStatus = isPermanent;
            break;
          case 'available':
            // Available traits are those that can potentially be acquired
            // (player has met the source NPC and has enough relationship)
            if (trait.sourceNpc) {
              const npc = npcs.find(n => n.id === trait.sourceNpc);
              matchesStatus = npc && 
                              discoveryProgress.metNPCs.includes(npc.id) && 
                              (npc.relationship || 0) >= (trait.requiredRelationship || 0) &&
                              !isAcquired;
            } else {
              matchesStatus = !isAcquired; // All non-acquired traits without NPC source
            }
            break;
          default:
            matchesStatus = true;
        }
        
        return showBasedOnDiscovery && matchesSearch && matchesType && matchesSource && inCostRange && matchesStatus;
      })
      .sort(([idA, traitA], [idB, traitB]) => {
        // Apply sorting
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = traitA.name.localeCompare(traitB.name);
            break;
          case 'cost':
            comparison = (traitA.essenceCost || 0) - (traitB.essenceCost || 0);
            break;
          case 'type':
            comparison = (traitA.type || '').localeCompare(traitB.type || '');
            break;
          default:
            comparison = traitA.name.localeCompare(traitB.name);
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [
    traits,
    searchQuery,
    discoveryProgress.discoveredTraits,
    showUndiscovered,
    traitTypeFilter,
    traitSourceFilter,
    traitCostRange,
    sortBy,
    sortOrder,
    traitStatusFilter,
    gameState.player?.acquiredTraits,
    gameState.player?.permanentTraits,
    gameState.player?.equippedTraits,
    npcs,
    discoveryProgress.metNPCs
  ]);
  
  // Build map of which traits come from which NPCs
  const npcTraitMap = useMemo(() => {
    const map = {};
    
    if (traits?.copyableTraits && npcs) {
      Object.entries(traits.copyableTraits).forEach(([id, trait]) => {
        if (trait.sourceNpc) {
          if (!map[trait.sourceNpc]) {
            map[trait.sourceNpc] = [];
          }
          map[trait.sourceNpc].push({
            id,
            ...trait
          });
        }
      });
    }
    
    return map;
  }, [traits, npcs]);
  
  // Filter characters based on all criteria
  const filteredCharacters = useMemo(() => {
    if (!gameState.player?.controlledCharacters) return [];
    
    return gameState.player.controlledCharacters
      .filter(character => {
        // Search query filter
        const matchesSearch = searchQuery === '' || 
          character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (character.role && character.role.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Character filter
        let matchesCharacterFilter = true;
        switch (characterFilter) {
          case 'controlled':
            matchesCharacterFilter = character.playerControlled;
            break;
          case 'influenced':
            matchesCharacterFilter = !character.playerControlled && character.influenceLevel > 0;
            break;
          case 'created':
            matchesCharacterFilter = character.playerCreated;
            break;
          case 'potential':
            matchesCharacterFilter = !character.playerControlled && character.influenceLevel === 0;
            break;
          default:
            matchesCharacterFilter = true;
        }
        
        return matchesSearch && matchesCharacterFilter;
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'relationship':
            comparison = (a.relationship || 0) - (b.relationship || 0);
            break;
          case 'influence':
            comparison = (a.influenceLevel || 0) - (b.influenceLevel || 0);
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [
    gameState.player?.controlledCharacters,
    searchQuery,
    characterFilter,
    sortBy,
    sortOrder
  ]);
  
  // Format location name to be more readable
  const formatLocationName = (location) => {
    if (!location) return 'Unknown';
    
    // Convert camelCase to Title Case with spaces
    return location
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Relationships & Traits</Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Discovery progress */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2">NPCs Met</Typography>
              <Typography variant="body2" color="primary">
                {discoveryProgress.metNPCCount}/{discoveryProgress.totalNPCs}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={npcProgress} 
              sx={{ height: 6, borderRadius: 1 }} 
            />
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2">Traits Discovered</Typography>
              <Typography variant="body2" color="secondary">
                {discoveryProgress.discoveredTraitCount}/{discoveryProgress.totalTraits}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={traitProgress}
              color="secondary" 
              sx={{ height: 6, borderRadius: 1 }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              variant={showUndiscovered ? "contained" : "outlined"}
              color="primary"
              onClick={() => setShowUndiscovered(!showUndiscovered)}
              startIcon={<QuestionMarkIcon />}
            >
              {showUndiscovered ? "Hide Unknown" : "Show Unknown"}
            </Button>
          </Box>
        </Box>
        
        {/* Search bar and filter toggle */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant={showFilters ? "contained" : "outlined"} 
              color="primary" 
              onClick={toggleFilters}
              sx={{ minWidth: 'unset' }}
            >
              <FilterListIcon />
            </Button>
          </Box>
          
          {/* Advanced filters section */}
          <Collapse in={showFilters}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Advanced Filters
              </Typography>
              
              {/* Sort controls */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sort by</Typography>
                  <ToggleButtonGroup
                    size="small"
                    value={sortOrder}
                    exclusive
                    onChange={handleSortOrderChange}
                  >
                    <ToggleButton value="asc" aria-label="ascending">
                      <SortIcon sx={{ transform: 'rotate(180deg)' }} />
                    </ToggleButton>
                    <ToggleButton value="desc" aria-label="descending">
                      <SortIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="name">Name</MenuItem>
                    {tabValue === 0 ? (
                      <>
                        <MenuItem value="relationship">Relationship</MenuItem>
                        <MenuItem value="power">Power Level</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="cost">Cost</MenuItem>
                        <MenuItem value="type">Type</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Box>
              
              {/* NPC-specific filters */}
              {tabValue === 0 && (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      label="Location"
                    >
                      <MenuItem value="all">All Locations</MenuItem>
                      {npcLocations.map(location => (
                        <MenuItem key={location} value={location}>
                          {formatLocationName(location)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Relationship Range
                    </Typography>
                    <Slider
                      value={relationshipRange}
                      onChange={(e, newValue) => setRelationshipRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">0</Typography>
                      <Typography variant="caption" color="text.secondary">100</Typography>
                    </Box>
                  </Box>
                  
                  {/* Add this new filter */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Interaction Status</InputLabel>
                    <Select
                      value={npcInteractionFilter}
                      onChange={(e) => setNpcInteractionFilter(e.target.value)}
                      label="Interaction Status"
                    >
                      <MenuItem value="all">All NPCs</MenuItem>
                      <MenuItem value="high">High Relationship (70+)</MenuItem>
                      <MenuItem value="medium">Medium Relationship (30-69)</MenuItem>
                      <MenuItem value="low">Low Relationship (1-29)</MenuItem>
                      <MenuItem value="none">No Relationship (0)</MenuItem>
                      <MenuItem value="hasTraits">Has Learnable Traits</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {/* Trait-specific filters */}
              {tabValue === 1 && (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Trait Type</InputLabel>
                    <Select
                      value={traitTypeFilter}
                      onChange={(e) => setTraitTypeFilter(e.target.value)}
                      label="Trait Type"
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      {traitTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Source NPC</InputLabel>
                    <Select
                      value={traitSourceFilter}
                      onChange={(e) => setTraitSourceFilter(e.target.value)}
                      label="Source NPC"
                    >
                      <MenuItem value="all">All Sources</MenuItem>
                      {traitSources.map(sourceId => {
                        const npc = npcs.find(n => n.id === sourceId);
                        if (!npc) return null;
                        
                        const isDiscovered = discoveryProgress.metNPCs.includes(npc.id);
                        return (
                          <MenuItem key={sourceId} value={sourceId}>
                            {isDiscovered ? npc.name : "Unknown Source"}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Essence Cost Range
                    </Typography>
                    <Slider
                      value={traitCostRange}
                      onChange={(e, newValue) => setTraitCostRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={500}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">0</Typography>
                      <Typography variant="caption" color="text.secondary">500</Typography>
                    </Box>
                  </Box>
                  
                  {/* Add this new filter */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Trait Status</InputLabel>
                    <Select
                      value={traitStatusFilter}
                      onChange={(e) => setTraitStatusFilter(e.target.value)}
                      label="Trait Status"
                    >
                      <MenuItem value="all">All Traits</MenuItem>
                      <MenuItem value="acquired">Acquired</MenuItem>
                      <MenuItem value="unacquired">Unacquired</MenuItem>
                      <MenuItem value="equipped">Currently Equipped</MenuItem>
                      <MenuItem value="permanent">Permanent Traits</MenuItem>
                      <MenuItem value="available">Available to Acquire</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              {/* Add this to the advanced filters section */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    // Reset all filters to default values
                    setSearchQuery('');
                    setSortBy('name');
                    setSortOrder('asc');
                    
                    if (tabValue === 0) {
                      // Reset NPC filters
                      setLocationFilter('all');
                      setRelationshipRange([0, 100]);
                      setNpcInteractionFilter('all');
                    } else {
                      // Reset trait filters
                      setTraitTypeFilter('all');
                      setTraitSourceFilter('all');
                      setTraitCostRange([0, 500]);
                      setTraitStatusFilter('all');
                    }
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label={
                <Badge 
                  badgeContent={discoveryProgress.metNPCCount} 
                  color="primary"
                  max={99}
                >
                  <Box sx={{ ml: 1 }}>NPCs</Box>
                </Badge>
              } 
              icon={<PersonIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={
                <Badge 
                  badgeContent={discoveryProgress.discoveredTraitCount}
                  color="secondary"
                  max={99}
                >
                  <Box sx={{ ml: 1 }}>Traits</Box>
                </Badge>
              }
              icon={<AutoFixHighIcon />} 
              iconPosition="start" 
            />
            {/* New Characters tab */}
            <Tab 
              label={
                <Badge 
                  badgeContent={gameState.player?.controlledCharacters?.length || 0}
                  color="success"
                  max={99}
                >
                  <Box sx={{ ml: 1 }}>Characters</Box>
                </Badge>
              }
              icon={<SportsKabaddiIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Add this after your tabs but before the tab panels */}
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', overflowX: 'auto' }}>
          {tabValue === 0 && (
            <>
              <Button 
                size="small" 
                sx={{ mr: 1, whiteSpace: 'nowrap' }}
                variant={npcInteractionFilter === 'hasTraits' ? 'contained' : 'outlined'}
                onClick={() => setNpcInteractionFilter(npcInteractionFilter === 'hasTraits' ? 'all' : 'hasTraits')}
              >
                Has Traits
              </Button>
              <Button 
                size="small" 
                sx={{ mr: 1, whiteSpace: 'nowrap' }}
                variant={npcInteractionFilter === 'high' ? 'contained' : 'outlined'}
                onClick={() => setNpcInteractionFilter(npcInteractionFilter === 'high' ? 'all' : 'high')}
              >
                High Rel.
              </Button>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <Button 
                size="small" 
                sx={{ mr: 1, whiteSpace: 'nowrap' }}
                variant={traitStatusFilter === 'equipped' ? 'contained' : 'outlined'}
                onClick={() => setTraitStatusFilter(traitStatusFilter === 'equipped' ? 'all' : 'equipped')}
              >
                Equipped
              </Button>
              <Button 
                size="small" 
                sx={{ mr: 1, whiteSpace: 'nowrap' }}
                variant={traitStatusFilter === 'permanent' ? 'contained' : 'outlined'}
                onClick={() => setTraitStatusFilter(traitStatusFilter === 'permanent' ? 'all' : 'permanent')}
              >
                Permanent
              </Button>
              <Button 
                size="small" 
                sx={{ mr: 1, whiteSpace: 'nowrap' }}
                variant={traitStatusFilter === 'available' ? 'contained' : 'outlined'}
                onClick={() => setTraitStatusFilter(traitStatusFilter === 'available' ? 'all' : 'available')}
              >
                Available
              </Button>
            </>
          )}
        </Box>
        
        {/* Tab contents - with flexGrow to fill remaining height */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {/* NPCs Tab */}
          <TabPanel value={tabValue} index={0}>
            {filteredNpcs.length > 0 ? (
              <List>
                {filteredNpcs.map((npc) => {
                  const isDiscovered = discoveryProgress.metNPCs.includes(npc.id);
                  const hasFocus = focusedId === npc.id;
                  const hasTraits = npcTraitMap[npc.id] && npcTraitMap[npc.id].length > 0;
                  
                  return (
                    <React.Fragment key={npc.id}>
                      <ListItem 
                        sx={{ 
                          bgcolor: hasFocus ? 'action.selected' : 'transparent',
                          borderLeft: hasFocus ? '4px solid' : 'none',
                          borderColor: 'primary.main',
                          opacity: isDiscovered ? 1 : 0.7
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {isDiscovered ? <PersonIcon /> : <QuestionMarkIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>
                                {isDiscovered ? npc.name : "Unknown Character"}
                              </Typography>
                              {isDiscovered && npc.powerLevel > 1 && (
                                <Chip 
                                  label={`×${npc.powerLevel}`} 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">
                                {isDiscovered ? (
                                  <>
                                    {npc.role || 'Character'} • Relationship: {npc.relationship || 0}
                                  </>
                                ) : (
                                  "You haven't met this character yet."
                                )}
                              </Typography>
                              
                              {/* Location information */}
                              {isDiscovered && npc.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                  <LocationOnIcon fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatLocationName(npc.location)}
                                  </Typography>
                                </Box>
                              )}
                              
                              {/* Show traits from this NPC if discovered */}
                              {isDiscovered && hasTraits && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Available traits:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {npcTraitMap[npc.id].map(trait => {
                                      const isTraitDiscovered = discoveryProgress.discoveredTraits.includes(trait.id);
                                      
                                      return (
                                        <Chip 
                                          key={trait.id}
                                          label={isTraitDiscovered ? trait.name : "???"}
                                          size="small"
                                          variant="outlined"
                                          color={isTraitDiscovered ? (trait.type === 'Social' ? 'secondary' : 'primary') : 'default'}
                                          sx={{ opacity: isTraitDiscovered ? 1 : 0.7 }}
                                        />
                                      );
                                    })}
                                  </Box>
                                </Box>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Paper sx={{ p: 3, textAlign: 'center', maxWidth: '80%' }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery || showFilters ? 'No NPCs match your filters' : 'No NPCs available'}
                  </Typography>
                </Paper>
              </Box>
            )}
          </TabPanel>
          
          {/* Traits Tab */}
          <TabPanel value={tabValue} index={1}>
            {filteredTraits.length > 0 ? (
              <List>
                {filteredTraits.map(([id, trait]) => {
                  const isDiscovered = discoveryProgress.discoveredTraits.includes(id);
                  const hasFocus = focusedId === id;
                  const hasSource = trait.sourceNpc && npcs;
                  const sourceNpc = hasSource ? 
                    npcs.find(n => n.id === trait.sourceNpc) : null;
                  const isSourceDiscovered = sourceNpc ? 
                    discoveryProgress.metNPCs.includes(sourceNpc.id) : false;
                  
                  // Add these status checks
                  const isAcquired = gameState.player?.acquiredTraits?.includes(id);
                  const isPermanent = gameState.player?.permanentTraits?.includes(id);
                  const isEquipped = gameState.player?.equippedTraits?.includes(id);
                  
                  return (
                    <React.Fragment key={id}>
                      <ListItem
                        sx={{ 
                          bgcolor: hasFocus ? 'action.selected' : 'transparent',
                          borderLeft: hasFocus ? '4px solid' : 'none',
                          borderColor: 'secondary.main',
                          opacity: isDiscovered ? 1 : 0.7
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: isDiscovered ? 
                              (isPermanent ? 'success.main' : 
                               isEquipped ? 'info.main' :
                               isAcquired ? 'success.light' :
                               trait.type === 'Social' ? 'secondary.main' : 'primary.main') : 
                              'text.disabled' 
                          }}>
                            {!isDiscovered ? <QuestionMarkIcon /> : 
                             isPermanent ? <LockIcon /> :
                             <AutoFixHighIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography>
                                {isDiscovered ? trait.name : "Unknown Trait"}
                              </Typography>
                              {isDiscovered && (
                                <>
                                  <Chip 
                                    label={trait.type || 'Basic'} 
                                    size="small"
                                    color={trait.type === 'Social' ? 'secondary' : 'primary'}
                                  />
                                  {/* Add status indicators */}
                                  {isPermanent && (
                                    <Chip
                                      icon={<LockIcon />}
                                      label="Permanent"
                                      size="small"
                                      color="success"
                                    />
                                  )}
                                  {isEquipped && !isPermanent && (
                                    <Chip
                                      label="Equipped"
                                      size="small"
                                      color="info"
                                    />
                                  )}
                                  {isAcquired && !isEquipped && !isPermanent && (
                                    <Chip
                                      label="Acquired"
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                    />
                                  )}
                                </>
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">
                                {isDiscovered ? trait.description : "You haven't discovered this trait yet."}
                              </Typography>
                              
                              {/* If trait has a source NPC, show it */}
                              {isDiscovered && hasSource && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Source:
                                  </Typography>
                                  {isSourceDiscovered ? (
                                    <Chip 
                                      icon={<PersonIcon />}
                                      label={sourceNpc.name}
                                      size="small" 
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                    />
                                  ) : (
                                    <Chip 
                                      icon={<QuestionMarkIcon />}
                                      label="Unknown Source"
                                      size="small" 
                                      variant="outlined"
                                      sx={{ ml: 1, opacity: 0.7 }}
                                    />
                                  )}
                                </Box>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Paper sx={{ p: 3, textAlign: 'center', maxWidth: '80%' }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery || showFilters ? 'No traits match your filters' : 'No traits available'}
                  </Typography>
                </Paper>
              </Box>
            )}
          </TabPanel>

          {/* Add this new tab panel */}
          <TabPanel value={tabValue} index={2}>
            {/* Filter options specific to characters */}
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Character Filter</InputLabel>
                <Select
                  value={characterFilter}
                  onChange={(e) => setCharacterFilter(e.target.value)}
                  label="Character Filter"
                >
                  <MenuItem value="all">All Characters</MenuItem>
                  <MenuItem value="controlled">Fully Controlled</MenuItem>
                  <MenuItem value="influenced">Under Influence</MenuItem>
                  <MenuItem value="created">Player Created</MenuItem>
                  <MenuItem value="potential">Potential Recruits</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Character list */}
            {filteredCharacters.length > 0 ? (
              <List>
                {filteredCharacters.map((character) => (
                  <React.Fragment key={character.id}>
                    <ListItem 
                      sx={{ 
                        borderLeft: character.playerControlled ? '4px solid' : 'none',
                        borderColor: 'success.main',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: character.playerCreated 
                            ? 'success.main' 
                            : character.playerControlled 
                              ? 'success.light' 
                              : 'primary.main' 
                        }}>
                          {character.playerCreated ? <AddCircleIcon /> : <PersonIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{character.name}</Typography>
                            {character.playerCreated && (
                              <Chip label="Created" size="small" color="success" />
                            )}
                            {character.playerControlled && !character.playerCreated && (
                              <Chip label="Controlled" size="small" color="success" variant="outlined" />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              {character.role || 'Character'} • Relationship: {character.relationship || 0}
                            </Typography>
                            
                            {/* Influence progress bar */}
                            {!character.playerCreated && (
                              <Box sx={{ mt: 1, mb: 0.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Influence Level: {character.influenceLevel}%
                                  </Typography>
                                  {character.playerControlled && (
                                    <Typography variant="caption" color="success.main">
                                      Fully Controlled
                                    </Typography>
                                  )}
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={character.influenceLevel}
                                  sx={{
                                    height: 6,
                                    borderRadius: 1,
                                    '& .MuiLinearProgress-bar': {
                                      backgroundImage: character.playerControlled 
                                        ? 'none'
                                        : 'linear-gradient(90deg, #2196f3, #4caf50)'
                                    }
                                  }}
                                />
                              </Box>
                            )}
                            
                            {/* Next influence milestone */}
                            {!character.playerCreated && !character.playerControlled && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Next milestone: {character.nextMilestone?.level}% - {character.nextMilestone?.feature}
                                </Typography>
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Paper sx={{ p: 3, textAlign: 'center', maxWidth: '80%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No characters found
                  </Typography>
                </Paper>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TraitAndNPCListDrawer;