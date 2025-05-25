import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as EssenceIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import type { Trait } from '../../state/TraitsTypes';

/**
 * Props for the TraitCodex component
 */
export interface TraitCodexProps {
  // Data
  allTraits: Record<string, Trait>;
  discoveredTraits: Trait[];
  acquiredTraitIds: string[];
  permanentTraitIds: string[];
  currentEssence: number;
  
  // Actions
  onDiscoverTrait: (traitId: string) => void;
  onAcquireTrait: (traitId: string) => void;
  
  // Utilities
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait, action: 'acquire' | 'permanent') => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
  };
}

/**
 * Presentational component for trait discovery and browsing
 * Provides comprehensive trait reference with filtering and acquisition
 */
export const TraitCodex: React.FC<TraitCodexProps> = React.memo(({
  allTraits,
  discoveredTraits,
  acquiredTraitIds,
  permanentTraitIds,
  currentEssence,
  onDiscoverTrait,
  onAcquireTrait,
  canAcquireTrait,
  getTraitAffordability
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  // Get unique categories and rarities for filters
  const categories = useMemo(() => {
    const cats = new Set(discoveredTraits.map(trait => trait.category));
    return ['all', ...Array.from(cats).sort()];
  }, [discoveredTraits]);

  const rarities = useMemo(() => {
    const rars = new Set(discoveredTraits.map(trait => trait.rarity));
    return ['all', ...Array.from(rars).sort()];
  }, [discoveredTraits]);

  // Filter and search traits
  const filteredTraits = useMemo(() => {
    let traits = discoveredTraits;

    // Search filter
    if (searchTerm) {
      traits = traits.filter(trait =>
        trait.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trait.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      traits = traits.filter(trait => trait.category === categoryFilter);
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      traits = traits.filter(trait => trait.rarity === rarityFilter);
    }

    // Only available filter
    if (showOnlyAvailable) {
      traits = traits.filter(trait => canAcquireTrait(trait));
    }

    return traits.sort((a, b) => a.name.localeCompare(b.name));
  }, [discoveredTraits, searchTerm, categoryFilter, rarityFilter, showOnlyAvailable, canAcquireTrait]);

  const handleAcquireTrait = useCallback((trait: Trait) => {
    if (!canAcquireTrait(trait)) return;
    
    const affordability = getTraitAffordability(trait, 'acquire');
    if (!affordability.canAfford) return;
    
    onAcquireTrait(trait.id);
  }, [canAcquireTrait, getTraitAffordability, onAcquireTrait]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'error';
      case 'epic': return 'secondary';
      case 'rare': return 'primary';
      default: return 'default';
    }
  };

  const getTraitStatus = (trait: Trait) => {
    if (permanentTraitIds.includes(trait.id)) {
      return { status: 'permanent', label: 'Permanent', color: 'success' as const };
    }
    if (acquiredTraitIds.includes(trait.id)) {
      return { status: 'acquired', label: 'Acquired', color: 'primary' as const };
    }
    return { status: 'available', label: 'Available', color: 'default' as const };
  };

  const renderTraitCard = (trait: Trait) => {
    const status = getTraitStatus(trait);
    const canAcquire = canAcquireTrait(trait);
    const affordability = trait.essenceCost ? getTraitAffordability(trait, 'acquire') : null;

    return (
      <Card
        key={trait.id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: status.status === 'permanent' ? 2 : 1,
          borderColor: status.status === 'permanent' ? 'success.main' : 'divider'
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label={trait.rarity}
                size="small"
                color={getRarityColor(trait.rarity)}
              />
              <Chip
                label={status.label}
                size="small"
                color={status.color}
                icon={status.status === 'permanent' ? <CheckCircleIcon /> : undefined}
              />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {trait.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Category: {trait.category}
              </Typography>
              {trait.source && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Source: {trait.source}
                </Typography>
              )}
            </Box>

            {status.status === 'available' && trait.essenceCost && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {affordability && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EssenceIcon fontSize="small" />
                    <Typography
                      variant="body2"
                      color={affordability.canAfford ? 'success.main' : 'error.main'}
                    >
                      {trait.essenceCost}
                    </Typography>
                  </Box>
                )}
                <Tooltip
                  title={
                    !canAcquire
                      ? "Requirements not met"
                      : !affordability?.canAfford
                      ? `Need ${trait.essenceCost} Essence (have ${currentEssence})`
                      : "Acquire this trait"
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!canAcquire}
                      onClick={() => handleAcquireTrait(trait)}
                      startIcon={<StarIcon />}
                    >
                      Acquire
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const undiscoveredCount = Object.keys(allTraits).length - discoveredTraits.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" component="h2">
          Trait Codex
        </Typography>
        <Tooltip title="Browse and acquire discovered traits. Hidden traits can be discovered through NPC interactions.">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Discovery Progress
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Discovered
              </Typography>
              <Typography variant="h6">
                {discoveredTraits.length} / {Object.keys(allTraits).length}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Acquired
              </Typography>
              <Typography variant="h6" color="primary">
                {acquiredTraitIds.length}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Permanent
              </Typography>
              <Typography variant="h6" color="success.main">
                {permanentTraitIds.length}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Hidden
              </Typography>
              <Typography variant="h6" color="warning.main">
                {undiscoveredCount}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Rarity</InputLabel>
                <Select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  label="Rarity"
                >
                  {rarities.map(rarity => (
                    <MenuItem key={rarity} value={rarity}>
                      {rarity === 'all' ? 'All Rarities' : rarity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant={showOnlyAvailable ? 'contained' : 'outlined'}
                  onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  size="small"
                >
                  Available Only
                </Button>
                <Button
                  variant={showHidden ? 'contained' : 'outlined'}
                  onClick={() => setShowHidden(!showHidden)}
                  size="small"
                  startIcon={showHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                >
                  Hidden Traits
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Trait Grid */}
      {filteredTraits.length === 0 ? (
        <Alert severity="info">
          {searchTerm || categoryFilter !== 'all' || rarityFilter !== 'all'
            ? "No traits match your current filters."
            : "No traits discovered yet. Interact with NPCs to discover new traits."
          }
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredTraits.map(trait => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trait.id}>
              {renderTraitCard(trait)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Hidden Traits Section */}
      {showHidden && undiscoveredCount > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Hidden Traits ({undiscoveredCount})
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            These traits exist but haven't been discovered yet. Build relationships with NPCs to uncover new traits.
          </Alert>
          <List>
            {Object.values(allTraits)
              .filter(trait => !discoveredTraits.some(d => d.id === trait.id))
              .slice(0, 5) // Show only first 5 for teasing
              .map((trait, index) => (
                <ListItem key={`hidden-${index}`} divider>
                  <ListItemText
                    primary="???"
                    secondary={`Hidden ${trait.category} trait`}
                  />
                  <Chip label="Unknown" size="small" />
                </ListItem>
              ))}
            {undiscoveredCount > 5 && (
              <ListItem>
                <ListItemText
                  primary={`... and ${undiscoveredCount - 5} more hidden traits`}
                  secondary="Keep exploring to discover them all!"
                />
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
});

TraitCodex.displayName = 'TraitCodex';

export default TraitCodex;
