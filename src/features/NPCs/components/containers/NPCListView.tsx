/**
 * @file NPCListView.tsx
 * @description Container component for browsing and managing discovered NPCs
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
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
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
  ListItemButton,
  ToggleButtonGroup,
  ToggleButton,
  Toolbar,
  Paper,
} from '@mui/material';
import { Search, Person, Star, ViewList, ViewModule } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCs, selectDiscoveredNPCs } from '../../state/NPCSelectors';
import { selectPlayerLocation } from '../../../Player/state/PlayerSelectors';
import { NPC } from '../../state/NPCTypes';
import { initializeNPCsThunk } from '../..';
import { NPCListCard } from '../ui/NPCListCard';

interface NPCListViewProps {
  onSelectNPC: (npcId: string) => void;
  selectedNPCId?: string;
}

type SortOption = 'name' | 'relationship' | 'location' | 'recent' | 'connection';
type FilterOption = 'all' | 'available' | 'high_relationship' | 'same_location' | 'connected';

export const NPCListView: React.FC<NPCListViewProps> = ({
  onSelectNPC,
  selectedNPCId,
}) => {
  const npcs = useAppSelector(selectNPCs);
  const discoveredNPCIds = useAppSelector(selectDiscoveredNPCs);
  const playerLocation = useAppSelector(selectPlayerLocation);
  const dispatch = useAppDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'grid' | 'list' | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

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
        npcList = npcList.filter(npc => npc.affinity >= 60);
        break;
      case 'same_location':
        npcList = npcList.filter(npc => npc.location === playerLocation);
        break;
      case 'connected':
        npcList = npcList.filter(npc => npc.connectionDepth > 0);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'name':
        npcList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relationship':
        npcList.sort((a, b) => b.affinity - a.affinity);
        break;
      case 'location':
        npcList.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'recent':
        npcList.sort((a, b) => (b.lastInteraction || 0) - (a.lastInteraction || 0));
        break;
      case 'connection':
        npcList.sort((a, b) => b.connectionDepth - a.connectionDepth);
        break;
      default:
        break;
    }
    return npcList;
  }, [npcs, discoveredNPCIds, searchTerm, filterBy, sortBy, playerLocation]);

  const renderNPCListItem = (npc: NPC) => {
    const isSelected = selectedNPCId === npc.id;

    return (
      <React.Fragment key={npc.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => onSelectNPC(npc.id)}
            selected={isSelected}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: npc.isAvailable ? 'success.light' : 'grey.500' }}>
                {npc.avatar ? <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} /> : <Person />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={npc.name} secondary={npc.location} />
            <ListItemSecondaryAction>
              <Tooltip title={`Connection Depth: ${npc.connectionDepth}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2 }}>
                  <Star color="action" />
                  <Typography variant="body2">{npc.connectionDepth}</Typography>
                </Box>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>Discovered NPCs</Typography>
      
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Search NPCs"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="relationship">Relationship</MenuItem>
                <MenuItem value="connection">Connection Depth</MenuItem>
                <MenuItem value="location">Location</MenuItem>
                <MenuItem value="recent">Recent Interaction</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter By</InputLabel>
              <Select value={filterBy} label="Filter By" onChange={(e) => setFilterBy(e.target.value as FilterOption)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="high_relationship">High Affinity</MenuItem>
                <MenuItem value="same_location">Same Location</MenuItem>
                <MenuItem value="connected">Connected</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
            size="small"
            sx={{ ml: 2 }}
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewList />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModule />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {filteredAndSortedNPCs.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No NPCs match your criteria. Try exploring more to discover new characters!
          </Alert>
        ) : (
          viewMode === 'grid' ? (
            <Grid container spacing={2}>
              {filteredAndSortedNPCs.map(npc => (
                <NPCListCard 
                  key={npc.id} 
                  npc={npc} 
                  onSelectNPC={onSelectNPC} 
                  isSelected={selectedNPCId === npc.id} 
                />
              ))}
            </Grid>
          ) : (
            <List sx={{ bgcolor: 'background.paper' }}>
              {filteredAndSortedNPCs.map(renderNPCListItem)}
            </List>
          )
        )}
      </Box>
    </Box>
  );
};

export default React.memo(NPCListView);
