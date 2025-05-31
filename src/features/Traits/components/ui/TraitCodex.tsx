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
  Divider,
  Avatar // Added Avatar import
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as EssenceIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Close as CloseIcon, // For Dialog close button
  Done as DoneIcon // Added for acquired status
} from '@mui/icons-material';
import type { Trait } from '../../state/TraitsTypes';
// Import Dialog components from MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
  onMakeTraitPermanent: (traitId: string) => void; // Added
  
  // Utilities
  canMakePermanent: (trait: Trait) => boolean; // Added
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
  onMakeTraitPermanent, // Destructure
  canMakePermanent, // Destructure
  canAcquireTrait,
  getTraitAffordability
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc'); // New state for sort option
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [detailViewTrait, setDetailViewTrait] = useState<ProcessedTrait | null>(null); // State for detail view

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

  const statusFilters = useMemo(() => {
    return ['all', 'acquired', 'not_acquired', 'permanent', 'discovered', 'undiscovered'];
  }, []);

  const sortOptions = useMemo(() => {
    return [
      { value: 'name_asc', label: 'Name (A-Z)' },
      { value: 'name_desc', label: 'Name (Z-A)' },
      { value: 'rarity_asc', label: 'Rarity (Asc)' },
      { value: 'rarity_desc', label: 'Rarity (Desc)' },
      { value: 'category_asc', label: 'Category (A-Z)' },
      { value: 'category_desc', label: 'Category (Z-A)' },
      { value: 'essence_cost_asc', label: 'Acquisition Cost (Low to High)' },
      { value: 'essence_cost_desc', label: 'Acquisition Cost (High to Low)' },
      { value: 'permanence_cost_asc', label: 'Permanence Cost (Low to High)' },
      { value: 'permanence_cost_desc', label: 'Permanence Cost (High to Low)' },
    ];
  }, []);

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

    // New status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'acquired':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isAcquired);
          break;
        case 'not_acquired':
          traitsToDisplay = traitsToDisplay.filter(trait => !trait.isAcquired);
          break;
        case 'permanent':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isPermanent);
          break;
        case 'discovered':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered);
          break;
        case 'undiscovered':
          traitsToDisplay = traitsToDisplay.filter(trait => !trait.isDiscovered);
          break;
      }
    }

    return traitsToDisplay.sort((a, b) => {
      // Primary sort: always by discovery status (discovered > hidden)
      if (a.isDiscovered && !b.isDiscovered) return -1;
      if (!a.isDiscovered && b.isDiscovered) return 1;

      // Secondary sort based on selected option
      switch (sortOption) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'rarity_asc':
          // Assuming rarity has an inherent order (e.g., Common < Rare < Epic)
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrder.indexOf(a.rarity.toLowerCase()) - rarityOrder.indexOf(b.rarity.toLowerCase());
        case 'rarity_desc':
          const rarityOrderDesc = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrderDesc.indexOf(b.rarity.toLowerCase()) - rarityOrderDesc.indexOf(a.rarity.toLowerCase());
        case 'category_asc':
          return (a.category || '').localeCompare(b.category || '');
        case 'category_desc':
          return (b.category || '').localeCompare(a.category || '');
        case 'essence_cost_asc':
          return (a.essenceCost || 0) - (b.essenceCost || 0);
        case 'essence_cost_desc':
          return (b.essenceCost || 0) - (a.essenceCost || 0);
        case 'permanence_cost_asc':
          return (a.permanenceCost || 0) - (b.permanenceCost || 0);
        case 'permanence_cost_desc':
          return (b.permanenceCost || 0) - (a.permanenceCost || 0);
        default:
          return 0; // Should not happen
      }
    });
  }, [processedTraits, searchTerm, categoryFilter, rarityFilter, statusFilter, sortOption, showOnlyAvailable, showHidden]); // Added sortOption to dependencies

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

  // Removed getTraitStatus as status is now part of processedTraits

  const renderTraitCard = (trait: ProcessedTrait) => {
    const affordability = trait.essenceCost ? getTraitAffordability(trait, 'acquire') : null;

    return (
      <Card
        key={trait.id}
        onClick={() => setDetailViewTrait(trait)} // Open detail view on click
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: trait.isPermanent ? 2 : 1,
          borderColor: trait.isPermanent ? 'success.main' : (trait.isDiscovered ? 'divider' : 'warning.light'),
          opacity: trait.isDiscovered ? 1 : 0.7,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 3,
            borderColor: 'primary.main'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}> {/* Added alignItems: 'center' */}
            <Avatar 
              src={trait.isDiscovered && trait.iconPath ? trait.iconPath : undefined} 
              alt={trait.isDiscovered ? trait.name : 'Undiscovered Trait'}
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: trait.isDiscovered ? 'primary.light' : 'grey.400',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {!trait.isDiscovered && <VisibilityOffIcon />} {/* Placeholder for undiscovered */}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.isDiscovered ? trait.name : '???'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}> {/* Moved chips here */}
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
              icon={
                trait.isPermanent ? <CheckCircleIcon /> :
                trait.isAcquired ? <DoneIcon /> : // Icon for acquired but not permanent
                (trait.isDiscovered ? undefined : <VisibilityOffIcon fontSize="small" />)
              }
            />
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
                      disabled={!trait.canBeAcquired || !(getTraitAffordability(trait, 'acquire').canAfford)}
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
            <Grid item xs={6} md={2}> {/* New grid item for Status filter */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  {statusFilters.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} {/* Format for display */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}> {/* New grid item for Sort By filter */}
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  label="Sort By"
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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

      {/* Detail View Dialog */}
      {detailViewTrait && (
        <Dialog
          open={detailViewTrait !== null}
          onClose={() => setDetailViewTrait(null)}
          aria-labelledby="trait-detail-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="trait-detail-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={detailViewTrait.iconPath ? detailViewTrait.iconPath : undefined} 
              alt={detailViewTrait.name}
              sx={{ width: 56, height: 56, bgcolor: 'primary.light', border: '1px solid', borderColor: 'divider' }}
            >
              {!detailViewTrait.iconPath && <StarIcon />} {/* Fallback icon */}
            </Avatar>
            <Typography variant="h5" component="span" sx={{ flexGrow: 1 }}>
              {detailViewTrait.name}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setDetailViewTrait(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {/* Basic Info */}
            <Typography variant="body1" gutterBottom>
              {detailViewTrait.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Category: ${detailViewTrait.category}`} size="small" />
              <Chip label={`Rarity: ${detailViewTrait.rarity}`} size="small" color={getRarityColor(detailViewTrait.rarity)} />
              {detailViewTrait.tier && <Chip label={`Tier: ${detailViewTrait.tier}`} size="small" />}
              <Chip 
                label={detailViewTrait.statusLabel} 
                size="small" 
                color={detailViewTrait.statusColor}
                icon={detailViewTrait.isPermanent ? <CheckCircleIcon fontSize="small"/> : undefined}
              />
            </Box>

            {/* Effects */}
            {detailViewTrait.effects && Object.keys(detailViewTrait.effects).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Effects:</Typography>
                <List dense disablePadding>
                  {Object.entries(detailViewTrait.effects).map(([key, value]) => (
                    <ListItem key={key} disableGutters sx={{py: 0.5}}>
                      <ListItemText 
                        primary={`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Costs */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Costs:</Typography>
              {detailViewTrait.essenceCost && (
                <Typography variant="body2">
                  Acquisition Cost: {detailViewTrait.essenceCost} Essence
                </Typography>
              )}
              {detailViewTrait.permanenceCost && detailViewTrait.isAcquired && (
                 <Typography variant="body2">
                   Permanence Cost: {detailViewTrait.permanenceCost} Essence
                 </Typography>
              )}
              {!detailViewTrait.essenceCost && !detailViewTrait.permanenceCost && (
                 <Typography variant="body2" color="text.secondary">No direct essence costs.</Typography>
              )}
            </Box>

            {/* Requirements & Source */}
            {(detailViewTrait.requirements || detailViewTrait.sourceNpc) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Requirements & Source:</Typography>
                {detailViewTrait.sourceNpc && (
                  <Typography variant="body2">Source: NPC {detailViewTrait.sourceNpc}</Typography>
                )}
                {detailViewTrait.requirements?.relationshipLevel && (
                  <Typography variant="body2">Required Relationship Level: {detailViewTrait.requirements.relationshipLevel}</Typography>
                )}
                {detailViewTrait.requirements?.prerequisiteTraits && detailViewTrait.requirements.prerequisiteTraits.length > 0 && (
                  <Typography variant="body2">Required Traits: {detailViewTrait.requirements.prerequisiteTraits.map(id => allTraits[id]?.name || id).join(', ')}</Typography>
                )}
                 {detailViewTrait.requirements?.level && (
                  <Typography variant="body2">Required Player Level: {detailViewTrait.requirements.level}</Typography>
                )}
              </Box>
            )}
            
          </DialogContent>
          <DialogActions sx={{p: 2}}>
            {!detailViewTrait.isAcquired && detailViewTrait.essenceCost && (
              <Button 
                onClick={() => {
                  handleAcquireTrait(detailViewTrait);
                  setDetailViewTrait(null); // Close dialog after action
                }} 
                variant="contained" 
                color="primary"
                disabled={!detailViewTrait.canBeAcquired || !(getTraitAffordability(detailViewTrait, 'acquire').canAfford)}
                startIcon={<StarIcon />}
              >
                Acquire ({detailViewTrait.essenceCost} Essence)
              </Button>
            )}
            {detailViewTrait.isAcquired && !detailViewTrait.isPermanent && detailViewTrait.permanenceCost && (
              <Button
                onClick={() => {
                  onMakeTraitPermanent(detailViewTrait.id);
                  setDetailViewTrait(null); // Close dialog after action
                }}
                variant="contained"
                color="warning"
                disabled={!canMakePermanent(detailViewTrait) || !(getTraitAffordability(detailViewTrait, 'permanent').canAfford)}
                startIcon={<StarIcon />}
              >
                Make Permanent ({detailViewTrait.permanenceCost} Essence)
              </Button>
            )}
            <Button onClick={() => setDetailViewTrait(null)} color="inherit">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

TraitCodex.displayName = 'TraitCodex';

export default TraitCodex;
