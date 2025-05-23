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
  CardActions,
  Button,
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
  FilterList,
  Person,
  Chat,
  LocationOn,
  Favorite,
  Star,
  Groups,
  Schedule,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import { selectAllNPCs, selectDiscoveredNPCs } from '../../state/NPCSelectors';
import { NPC } from '../../state/NPCTypes';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

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
  const npcs = useAppSelector(selectAllNPCs);
  const discoveredNPCIds = useAppSelector(selectDiscoveredNPCs);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Get discovered NPCs only
  const discoveredNPCs = useMemo(() => {
    return discoveredNPCIds.map(id => npcs[id]).filter(Boolean);
  }, [npcs, discoveredNPCIds]);

  // Filter and sort NPCs
  const filteredAndSortedNPCs = useMemo(() => {
    let filtered = discoveredNPCs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(npc => 
        npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        npc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        npc.faction?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'available':
        filtered = filtered.filter(npc => npc.isAvailable);
        break;
      case 'high_relationship':
        filtered = filtered.filter(npc => npc.relationshipValue >= 50);
        break;
      case 'same_location':
        // This would filter by current player location
        // For now, just show all
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'relationship':
          return b.relationshipValue - a.relationshipValue;
        case 'location':
          return a.location.localeCompare(b.location);
        case 'recent':
          const aTime = a.lastInteraction ? new Date(a.lastInteraction).getTime() : 0;
          const bTime = b.lastInteraction ? new Date(b.lastInteraction).getTime() : 0;
          return bTime - aTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [discoveredNPCs, searchTerm, sortBy, filterBy]);

  // Get relationship tier for an NPC
  const getRelationshipTier = (relationshipValue: number) => {
    return RELATIONSHIP_TIERS.find(tier => 
      relationshipValue >= tier.minValue && relationshipValue <= tier.maxValue
    );
  };

  // Get relationship color
  const getRelationshipColor = (relationshipValue: number) => {
    const tier = getRelationshipTier(relationshipValue);
    if (!tier) return 'default';
    
    if (relationshipValue >= 80) return 'error'; // Deep bond
    if (relationshipValue >= 60) return 'warning'; // Close friend
    if (relationshipValue >= 40) return 'success'; // Friend
    if (relationshipValue >= 20) return 'primary'; // Acquaintance
    return 'default'; // Stranger
  };

  // Render NPC card for grid view
  const renderNPCCard = (npc: NPC) => {
    const tier = getRelationshipTier(npc.relationshipValue);
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
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: npc.isAvailable ? 'success.main' : 'grey.500',
                  mr: 2,
                }}
              >
                {npc.avatar ? (
                  <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Person />
                )}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" noWrap>
                  {npc.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {npc.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
              {npc.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                icon={<Favorite />}
                label={`${npc.relationshipValue}`}
                color={getRelationshipColor(npc.relationshipValue)}
              />
              {tier && (
                <Chip
                  size="small"
                  label={tier.name}
                  variant="outlined"
                  color={getRelationshipColor(npc.relationshipValue)}
                />
              )}
              {npc.faction && (
                <Chip
                  size="small"
                  icon={<Groups />}
                  label={npc.faction}
                  variant="outlined"
                />
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

  // Render NPC list item for list view
  const renderNPCListItem = (npc: NPC) => {
    const tier = getRelationshipTier(npc.relationshipValue);
    const isSelected = selectedNPCId === npc.id;

    return (
      <React.Fragment key={npc.id}>
        <ListItem
          button
          selected={isSelected}
          onClick={() => onSelectNPC(npc.id)}
          sx={{ py: 2 }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: npc.isAvailable ? 'success.main' : 'grey.500',
              }}
            >
              {npc.avatar ? (
                <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Person />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">{npc.name}</Typography>
                <Chip
                  size="small"
                  icon={<Favorite />}
                  label={npc.relationshipValue}
                  color={getRelationshipColor(npc.relationshipValue)}
                />
                {tier && (
                  <Chip
                    size="small"
                    label={tier.name}
                    variant="outlined"
                    color={getRelationshipColor(npc.relationshipValue)}
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
                <Typography variant="body2" color="text.secondary">
                  {npc.description}
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          NPCs ({discoveredNPCs.length} discovered)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your relationships and interactions with discovered NPCs
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search NPCs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="relationship">Relationship</MenuItem>
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="recent">Recent</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterBy}
            label="Filter"
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="high_relationship">High Relationship</MenuItem>
            <MenuItem value="same_location">Same Location</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results Summary */}
      {(searchTerm || filterBy !== 'all') && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing {filteredAndSortedNPCs.length} of {discoveredNPCs.length} NPCs
        </Alert>
      )}

      {/* NPC List/Grid */}
      {filteredAndSortedNPCs.length > 0 ? (
        viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredAndSortedNPCs.map(renderNPCCard)}
          </Grid>
        ) : (
          <List>
            {filteredAndSortedNPCs.map(renderNPCListItem)}
          </List>
        )
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {discoveredNPCs.length === 0 ? 'No NPCs discovered yet' : 'No NPCs match your filters'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {discoveredNPCs.length === 0 
              ? 'Explore the world to meet new NPCs'
              : 'Try adjusting your search or filters'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};
