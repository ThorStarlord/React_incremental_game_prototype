import React, { useState, useContext, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper, 
  Grid, 
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import TraitCard from './TraitCard';
import EmptySlotCard from './EmptySlotCard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`traits-tabpanel-${index}`}
      aria-labelledby={`traits-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const IntegratedTraitsPanel = () => {
  // Game state and dispatch
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { player, traits: traitData } = gameState;
  
  // Local state for UI
  const [draggingTrait, setDraggingTrait] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  
  // Function to get trait object by ID
  const getTraitById = (traitId) => {
    if (!traitData?.copyableTraits || !traitId) return null;
    return { id: traitId, ...traitData.copyableTraits[traitId] };
  };
  
  // Get all trait types for filtering
  const traitTypes = useMemo(() => {
    if (!traitData?.copyableTraits) return [];
    
    const types = new Set();
    Object.values(traitData.copyableTraits).forEach(trait => {
      if (trait.type) types.add(trait.type);
    });
    
    return Array.from(types);
  }, [traitData]);
  
  // Get traits that are currently equipped
  const equippedTraits = useMemo(() => {
    if (!player?.equippedTraits) return [];
    
    return player.equippedTraits.map(traitId => 
      getTraitById(traitId)
    ).filter(Boolean);
  }, [player.equippedTraits, getTraitById]);
  
  // Get permanent traits
  const permanentTraits = useMemo(() => {
    if (!player?.permanentTraits) return [];
    
    return player.permanentTraits.map(traitId => 
      getTraitById(traitId)
    ).filter(Boolean);
  }, [player.permanentTraits, getTraitById]);
  
  // Filter and sort traits
  const filteredTraits = useMemo(() => {
    if (!traitData?.copyableTraits) return [];
    
    return Object.entries(traitData.copyableTraits)
      .filter(([id, trait]) => {
        // Type filter
        const matchesType = typeFilter === 'all' || trait.type === typeFilter;
        
        // Search filter
        const matchesSearch = !searchQuery || 
          trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trait.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Discovery filter - only show traits the player has discovered
        const isDiscovered = player.discoveredTraits?.includes(id) || 
          player.acquiredTraits?.includes(id);
        
        return matchesType && matchesSearch && isDiscovered;
      })
      .map(([id, trait]) => ({ id, ...trait }))
      .sort((a, b) => {
        // Sort by acquisition status
        const aAcquired = player.acquiredTraits.includes(a.id);
        const bAcquired = player.acquiredTraits.includes(b.id);
        
        if (aAcquired && !bAcquired) return -1;
        if (!aAcquired && bAcquired) return 1;
        
        // Then by type
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        
        // Finally by name
        return a.name.localeCompare(b.name);
      });
  }, [traitData, player, searchQuery, typeFilter]);
  
  // Filter traits based on acquisition status
  const acquiredTraits = filteredTraits.filter(
    trait => player.acquiredTraits.includes(trait.id) && 
    !player.equippedTraits.includes(trait.id) &&
    !player.permanentTraits.includes(trait.id)
  );
  
  const unacquiredTraits = filteredTraits.filter(
    trait => !player.acquiredTraits.includes(trait.id)
  );
  
  // Event handlers for drag and drop
  const handleDragStart = (traitId, slotIndex = -1) => {
    setDraggingTrait({ id: traitId, fromSlot: slotIndex });
  };
  
  const handleDrop = (slotIndex) => {
    if (!draggingTrait) return;
    
    if (draggingTrait.fromSlot === -1) {
      // Coming from trait collection - equip
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: { 
          traitId: draggingTrait.id, 
          slotIndex 
        }
      });
    } else {
      // Coming from another slot - swap
      const fromSlot = draggingTrait.fromSlot;
      const toSlot = slotIndex;
      
      if (fromSlot !== toSlot) {
        // First, unequip from source slot
        dispatch({
          type: 'UNEQUIP_TRAIT',
          payload: { slotIndex: fromSlot }
        });
        
        // Then equip to target slot
        dispatch({
          type: 'EQUIP_TRAIT',
          payload: { 
            traitId: draggingTrait.id, 
            slotIndex: toSlot 
          }
        });
      }
    }
    
    setDraggingTrait(null);
  };
  
  const handleUnequipTrait = (slotIndex) => {
    dispatch({
      type: 'UNEQUIP_TRAIT',
      payload: { slotIndex }
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Calculate stats for display
  const traitStats = {
    total: Object.keys(traitData?.copyableTraits || {}).length,
    discovered: player.discoveredTraits?.length || 0,
    acquired: player.acquiredTraits?.length || 0,
    permanent: permanentTraits.length,
    equipped: equippedTraits.length,
    slots: player.traitSlots || 0
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Trait Loadout Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Trait Loadout</Typography>
          <Chip 
            label={`${equippedTraits.length}/${traitStats.slots} slots`} 
            color="primary"
          />
        </Box>
        
        <Grid container spacing={2}>
          {/* Render equipped trait slots */}
          {Array.from({ length: traitStats.slots }).map((_, index) => {
            const trait = equippedTraits[index];
            
            return (
              <Grid item xs={6} sm={4} key={index}>
                {trait ? (
                  <TraitCard 
                    trait={trait} 
                    equipped
                    draggable
                    onDragStart={() => handleDragStart(trait.id, index)}
                    onRemove={() => handleUnequipTrait(index)}
                  />
                ) : (
                  <EmptySlotCard 
                    onDrop={() => handleDrop(index)}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      {/* Permanent traits section */}
      {permanentTraits.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Permanent Traits
            </Typography>
            <Chip 
              icon={<LockIcon />}
              label={permanentTraits.length} 
              color="success"
            />
          </Box>
          
          <Grid container spacing={2}>
            {permanentTraits.map(trait => (
              <Grid item xs={6} sm={4} key={trait.id}>
                <TraitCard trait={trait} permanent />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Search and filter bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search traits..."
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
        
        <Tooltip title="Filter by type">
          <IconButton 
            size="small" 
            color={typeFilter !== 'all' ? 'primary' : 'default'}
            onClick={() => setTypeFilter(typeFilter === 'all' ? traitTypes[0] || 'all' : 'all')}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Type filter buttons */}
      {typeFilter !== 'all' && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {traitTypes.map(type => (
            <Button
              key={type}
              size="small"
              variant={typeFilter === type ? "contained" : "outlined"}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </Button>
          ))}
        </Box>
      )}
      
      {/* Trait tabs for Acquired vs Available */}
      <Box>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 1 }}>
          <Tab label="Acquired" />
          <Tab label="Discoverable" />
        </Tabs>
        
        {/* Acquired traits tab */}
        <TabPanel value={tabValue} index={0}>
          {acquiredTraits.length > 0 ? (
            <Grid container spacing={2}>
              {acquiredTraits.map(trait => (
                <Grid item xs={6} sm={4} key={trait.id}>
                  <TraitCard 
                    trait={trait} 
                    acquired
                    draggable
                    onDragStart={() => handleDragStart(trait.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No acquired traits available to equip
            </Typography>
          )}
        </TabPanel>
        
        {/* Discoverable traits tab */}
        <TabPanel value={tabValue} index={1}>
          {unacquiredTraits.length > 0 ? (
            <Grid container spacing={2}>
              {unacquiredTraits.map(trait => (
                <Grid item xs={6} sm={4} key={trait.id}>
                  <TraitCard 
                    trait={trait} 
                    onAcquire={() => {/* Add acquire handler */}}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No discoverable traits available
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default IntegratedTraitsPanel;