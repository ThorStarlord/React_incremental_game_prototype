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

// Define an explicit type for processed traits
type ProcessedTrait = Trait & {
  isDiscovered: boolean;
  isAcquired: boolean;
  isPermanent: boolean;
  statusLabel: string;
  statusColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  canBeAcquired: boolean;
};

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

  // Get unique categories and rarities for filters from allTraits
  const allTraitsArray = useMemo(() => Object.values(allTraits), [allTraits]);

  const categories = useMemo(() => {
    const cats = new Set(allTraitsArray.map(trait => trait.category));
    return ['all', ...Array.from(cats).sort()];
  }, [allTraitsArray]);

  const rarities = useMemo(() => {
    const rars = new Set(allTraitsArray.map(trait => trait.rarity));
    return ['all', ...Array.from(rars).sort()];
  }, [allTraitsArray]);

  // Process traits to include status and acquisition info
  const processedTraits = useMemo((): ProcessedTrait[] => {
    return allTraitsArray.map(trait => {
      const isDiscovered = discoveredTraits.some(d => d.id === trait.id);
      const isAcquired = acquiredTraitIds.includes(trait.id);
      const isPermanent = permanentTraitIds.includes(trait.id);
      let statusLabel = 'Hidden';
      let statusColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

      if (isPermanent) {
        statusLabel = 'Permanent';
        statusColor = 'success';
      } else if (isAcquired) {
        statusLabel = 'Acquired';
        statusColor = 'primary';
      } else if (isDiscovered) {
        statusLabel = 'Discovered';
        statusColor = 'info';
      }
      
      return {
        ...trait,
        isDiscovered,
        isAcquired,
        isPermanent,
        statusLabel,
        statusColor,
        canBeAcquired: canAcquireTrait(trait) // Use the existing prop function
      };
    });
  }, [allTraitsArray, discoveredTraits, acquiredTraitIds, permanentTraitIds, canAcquireTrait]);

  // Filter and sort traits
  const filteredAndSortedTraits = useMemo(() => {
    let traitsToDisplay = processedTraits;

    if (!showHidden) {
      // If not showing hidden, only show discovered traits
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered);
    }

    // Search filter
    if (searchTerm) {
      traitsToDisplay = traitsToDisplay.filter(trait =>
        trait.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trait.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Category filter
    if (categoryFilter !== 'all') {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.category === categoryFilter);
    }
    // Rarity filter
    if (rarityFilter !== 'all') {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.rarity === rarityFilter);
    }
    // Only available to acquire filter
    if (showOnlyAvailable) {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered && !trait.isAcquired && trait.canBeAcquired);
    }

    return traitsToDisplay.sort((a, b) => {
      // Sort by discovery status first (discovered > hidden), then by name
      if (a.isDiscovered && !b.isDiscovered) return -1;
      if (!a.isDiscovered && b.isDiscovered) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [processedTraits, searchTerm, categoryFilter, rarityFilter, showOnlyAvailable, showHidden]);

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

  // Removed getTraitStatus as status is now part of processedTraits

  const renderTraitCard = (trait: ProcessedTrait) => { // Use the new explicit type
    const affordability = trait.essenceCost ? getTraitAffordability(trait, 'acquire') : null;

    return (
      <Card
        key={trait.id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: trait.isPermanent ? 2 : 1,
          borderColor: trait.isPermanent ? 'success.main' : (trait.isDiscovered ? 'divider' : 'warning.light'),
          opacity: trait.isDiscovered ? 1 : 0.7,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.isDiscovered ? trait.name : '???'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {trait.isDiscovered && (
                <Chip
                  label={trait.rarity}
                  size="small"
                  color={getRarityColor(trait.rarity)}
                />
              )}
              <Chip
                label={trait.statusLabel}
                size="small"
                color={trait.statusColor}
                icon={trait.isPermanent ? <CheckCircleIcon /> : (trait.isDiscovered ? undefined : <VisibilityOffIcon fontSize="small" />)}
              />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' /* Ensure consistent card height */ }}>
            {trait.isDiscovered ? trait.description : 'This trait is yet to be discovered.'}
          </Typography>

          {trait.isDiscovered && (
            <>
              {/* Effects Display */}
              {trait.effects && Object.keys(trait.effects).length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Effects:</Typography>
                  {Object.entries(trait.effects).map(([key, value]) => (
                    <Chip key={key} label={`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Category: {trait.category}
              </Typography>
              {trait.tier && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Tier: {trait.tier}
                </Typography>
              )}
              {trait.requirements?.prerequisiteTraits && trait.requirements.prerequisiteTraits.length > 0 && (
                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                   Requires: {trait.requirements.prerequisiteTraits.join(', ')}
                 </Typography>
              )}
               {trait.sourceNpc && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Source: NPC {trait.sourceNpc} {trait.requirements?.relationshipLevel ? `(Rel: ${trait.requirements.relationshipLevel})` : ''}
                </Typography>
              )}
            </>
          )}
          
          <Box sx={{ mt: 'auto', pt: 1 }}> {/* Push button to bottom */}
            {trait.isDiscovered && !trait.isAcquired && trait.essenceCost && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
                {affordability && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EssenceIcon fontSize="small" />
                    <Typography
                      variant="body2"
                      color={affordability.canAfford ? 'text.primary' : 'error.main'}
                    >
                      {trait.essenceCost}
                    </Typography>
                  </Box>
                )}
                <Tooltip
                  title={
                    !trait.canBeAcquired
                      ? "Requirements not met"
                      : !affordability?.canAfford
                      ? `Need ${trait.essenceCost} Essence (have ${currentEssence})`
                      : "Acquire this trait"
                  }
                >
                  <span> {/* Tooltip needs a span wrapper for disabled buttons */}
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!trait.canBeAcquired || !affordability?.canAfford}
                      onClick={() => handleAcquireTrait(trait)}
                      startIcon={<StarIcon />}
                    >
                      Acquire
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            )}
             {trait.isDiscovered && !trait.isAcquired && !trait.essenceCost && ( // For traits that are discovered but not acquirable via essence
                <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block', width: '100%' }}>
                  Acquired via other means.
                </Typography>
             )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const undiscoveredCount = processedTraits.filter(trait => !trait.isDiscovered).length;

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
            Total Traits
          </Typography>
          <Typography variant="h6">
            {allTraitsArray.length}
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
      {filteredAndSortedTraits.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {searchTerm || categoryFilter !== 'all' || rarityFilter !== 'all' || showOnlyAvailable
            ? "No traits match your current filters."
            : "No traits available to display. Adjust filters or discover more traits."
          }
        </Alert>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredAndSortedTraits.map(trait => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trait.id}>
              {renderTraitCard(trait)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Removed separate Hidden Traits Section as it's integrated with the "Show Hidden" toggle */}
    </Box>
  );
});

TraitCodex.displayName = 'TraitCodex';

export default TraitCodex;
