/**
 * @file NPCListView.tsx
 * @description Container component for browsing and managing discovered NPCs
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  // CardActions, // CardActions seems unused
  // Button, // Button seems unused directly in this component's own JSX
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search,
  // FilterList, // FilterList icon seems unused
  Person,
  // Chat, // Chat icon seems unused
  LocationOn,
  Favorite,
  // Star, // Star icon seems unused
  Groups,
  // Schedule, // Schedule icon seems unused
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import { selectNPCs, selectDiscoveredNPCs } from '../../state/NPCSelectors';
import { NPC } from '../../state/NPCTypes';
import { getRelationshipTier as getCentralRelationshipTier } from '../../../../config/relationshipConstants'; 

interface NPCListViewProps {
  onSelectNPC: (npcId: string) => void;
  selectedNPCId?: string;
  viewMode?: 'grid' | 'list';
}

type SortOption = 'name' | 'relationship' | 'location' | 'recent';
type FilterOption = 'all' | 'available' | 'high_relationship' | 'same_location';

export const NPCListView: React.FC<NPCListViewProps> = ({
  onSelectNPC,
  selectedNPCId,
  viewMode = 'grid'
}) => {
  const npcs = useAppSelector(selectNPCs);
  const discoveredNPCIds = useAppSelector(selectDiscoveredNPCs);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredAndSortedNPCs = useMemo(() => {
    let npcList = discoveredNPCIds
      .map(id => npcs[id])
      .filter(Boolean); 

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      npcList = npcList.filter(npc => 
        npc.name.toLowerCase().includes(searchLower) ||
        (npc.description?.toLowerCase().includes(searchLower) ?? false) ||
        npc.location.toLowerCase().includes(searchLower) ||
        (npc.faction?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    switch (filterBy) {
      case 'available':
        npcList = npcList.filter(npc => npc.isAvailable);
        break;
      case 'high_relationship':
        npcList = npcList.filter(npc => npc.relationshipValue >= 60);
        break;
      case 'same_location':
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'name':
        npcList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relationship':
        npcList.sort((a, b) => b.relationshipValue - a.relationshipValue);
        break;
      case 'location':
        npcList.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'recent':
        npcList.sort((a, b) => (b.lastInteraction || 0) - (a.lastInteraction || 0));
        break;
      default:
        break;
    }
    return npcList;
  }, [npcs, discoveredNPCIds, searchTerm, filterBy, sortBy]);

  const renderNPCCard = (npc: NPC) => {
    const currentTier = getCentralRelationshipTier(npc.relationshipValue);
    const isSelected = selectedNPCId === npc.id;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={npc.id}>
        <Card
          sx={{
            height: '100%',
            border: isSelected ? 2 : 1,
            borderColor: isSelected ? 'primary.main' : 'divider',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
            },
          }}
          onClick={() => onSelectNPC(npc.id)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: npc.isAvailable ? 'success.main' : 'grey.500', mr: 2 }}>
                {npc.avatar ? <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} /> : <Person />}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" noWrap>{npc.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary" noWrap>{npc.location}</Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
              {npc.description || 'No description available'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {currentTier && (
                <Chip
                  size="small"
                  label={currentTier.name}
                  icon={<Favorite fontSize="small" />} // Keep icon for visual cue
                  sx={{ backgroundColor: currentTier.color, color: '#fff' }}
                />
              )}
              {npc.faction && (
                <Chip size="small" icon={<Groups />} label={npc.faction} variant="outlined" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {npc.isAvailable ? (
                  <Chip size="small" icon={<Visibility />} label="Available" color="success" />
                ) : (
                  <Chip size="small" icon={<VisibilityOff />} label="Away" color="default" />
                )}
              </Box>
              {npc.lastInteraction && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(npc.lastInteraction).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderNPCListItem = (npc: NPC) => {
    const currentTier = getCentralRelationshipTier(npc.relationshipValue);
    const isSelected = selectedNPCId === npc.id;

    return (
      <React.Fragment key={npc.id}>
        <ListItem
          onClick={() => onSelectNPC(npc.id)}
          sx={{ py: 2, cursor: 'pointer', backgroundColor: isSelected ? 'action.selected' : 'transparent', '&:hover': { backgroundColor: isSelected ? 'action.selected' : 'action.hover' }}}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: npc.isAvailable ? 'success.main' : 'grey.500' }}>
              {npc.avatar ? <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} /> : <Person />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">{npc.name}</Typography>
                {currentTier && (
                  <Chip
                    size="small"
                    label={currentTier.name}
                    icon={<Favorite fontSize="small" />}
                    sx={{ backgroundColor: currentTier.color, color: '#fff' }}
                  />
                )}
              </Box>
            }
            secondary={
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">{npc.location}</Typography>
                  {npc.faction && (
                    <>
                      <Groups fontSize="small" sx={{ ml: 1 }} />
                      <Typography variant="body2">{npc.faction}</Typography>
                    </>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {npc.description || 'No description available'}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title={npc.isAvailable ? 'Available for interaction' : 'Currently unavailable'}>
              <IconButton edge="end">
                {npc.isAvailable ? <Visibility color="success" /> : <VisibilityOff color="disabled" />}
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Responsive padding */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          NPCs ({filteredAndSortedNPCs.length} / {discoveredNPCIds.length} discovered)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your relationships and interactions with discovered NPCs.
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search NPCs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>)}}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 250 } }} // Responsive width
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value as SortOption)}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="relationship">Relationship</MenuItem>
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="recent">Recent</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filterBy} label="Filter" onChange={(e) => setFilterBy(e.target.value as FilterOption)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="high_relationship">High Relationship</MenuItem>
            <MenuItem value="same_location">Same Location</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {(searchTerm || filterBy !== 'all') && filteredAndSortedNPCs.length !== discoveredNPCIds.length && (
         <Alert severity="info" sx={{ mb: 2 }}>
           Showing {filteredAndSortedNPCs.length} matching NPCs.
         </Alert>
       )}

      {filteredAndSortedNPCs.length > 0 ? (
        viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredAndSortedNPCs.map(renderNPCCard)}
          </Grid>
        ) : (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}> {/* Added background for list items */}
            {filteredAndSortedNPCs.map(renderNPCListItem)}
          </List>
        )
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {discoveredNPCIds.length === 0 ? 'No NPCs discovered yet' : 'No NPCs match your filters'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {discoveredNPCIds.length === 0 
              ? 'Explore the world to meet new NPCs'
              : 'Try adjusting your search or filters'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(NPCListView);
