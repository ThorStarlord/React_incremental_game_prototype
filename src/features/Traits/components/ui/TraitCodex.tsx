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
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  Stack,
  Paper,
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
  Star as StarIcon,
  Close as CloseIcon,
  Done as DoneIcon,
  HelpOutline as HelpOutlineIcon,
  AutoAwesome as ResonanceIcon
} from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { Trait } from '../../state/TraitsTypes';
import TraitCard from './TraitCard';

type ProcessedTrait = Trait & {
  isDiscovered: boolean;
  isAcquired: boolean;
  isPermanent: boolean;
  statusLabel: string;
  statusColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  canBeAcquired: boolean;
};

export interface TraitCodexProps {
  allTraits: Record<string, Trait>;
  discoveredTraits: Trait[];
  acquiredTraitIds: string[];
  permanentTraitIds: string[];
  currentEssence: number;
  onDiscoverTrait: (traitId: string) => void;
  onAcquireTrait: (traitId: string) => void;
  onMakeTraitPermanent: (traitId: string) => void;
  canMakePermanent: (trait: Trait) => boolean;
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait) => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
    message?: string;
  };
}

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [detailViewTrait, setDetailViewTrait] = useState<ProcessedTrait | null>(null);

  const allTraitsArray = useMemo(() => Object.values(allTraits), [allTraits]);

  const categories = useMemo(() => {
    const cats = new Set(allTraitsArray.map(trait => trait.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [allTraitsArray]);

  const rarities = useMemo(() => {
    const rars = new Set(allTraitsArray.map(trait => trait.rarity).filter(Boolean));
    return ['all', ...Array.from(rars).sort()];
  }, [allTraitsArray]);

  const statusFilters = [
    { value: 'all', label: 'All Traits' },
    { value: 'acquired', label: 'Acquired' },
    { value: 'not_acquired', label: 'Not Acquired' },
    { value: 'permanent', label: 'Permanent' },
    { value: 'discovered', label: 'Discovered' },
    { value: 'undiscovered', label: 'Undiscovered' }
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'rarity_asc', label: 'Rarity (Low to High)' },
    { value: 'rarity_desc', label: 'Rarity (High to Low)' },
    { value: 'category_asc', label: 'Category (A-Z)' },
    { value: 'essence_cost_asc', label: 'Acquisition Cost (Low to High)' },
    { value: 'essence_cost_desc', label: 'Acquisition Cost (High to Low)' }
  ];

  const processedTraits = useMemo((): ProcessedTrait[] => {
    return allTraitsArray.map(trait => {
      const isDiscovered = discoveredTraits.some(d => d.id === trait.id);
      const isAcquiredByPlayer = acquiredTraitIds.includes(trait.id);
      const isPermanentForPlayer = permanentTraitIds.includes(trait.id);
      
      let statusLabel = 'Hidden';
      let statusColor: ProcessedTrait['statusColor'] = 'default';

      if (isPermanentForPlayer) {
        statusLabel = 'Permanent';
        statusColor = 'success';
      } else if (isAcquiredByPlayer) {
        statusLabel = 'Acquired';
        statusColor = 'primary';
      } else if (isDiscovered) {
        statusLabel = 'Discovered';
        statusColor = 'info';
      }
      
      return {
        ...trait,
        isDiscovered,
        isAcquired: isAcquiredByPlayer,
        isPermanent: isPermanentForPlayer,
        statusLabel,
        statusColor,
        canBeAcquired: canAcquireTrait(trait)
      };
    });
  }, [allTraitsArray, discoveredTraits, acquiredTraitIds, permanentTraitIds, canAcquireTrait]);

  const filteredAndSortedTraits = useMemo(() => {
    let traitsToDisplay = processedTraits;

    // Filter by visibility
    if (!showHidden) {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered);
    }

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      traitsToDisplay = traitsToDisplay.filter(trait =>
        trait.name.toLowerCase().includes(query) ||
        trait.description.toLowerCase().includes(query) ||
        trait.category?.toLowerCase().includes(query)
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

    // Status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'acquired':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isAcquired && !trait.isPermanent);
          break;
        case 'not_acquired':
          traitsToDisplay = traitsToDisplay.filter(trait => !trait.isAcquired && !trait.isPermanent);
          break;
        case 'permanent':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isPermanent);
          break;
        case 'discovered':
          traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered && !trait.isAcquired && !trait.isPermanent);
          break;
        case 'undiscovered':
          traitsToDisplay = traitsToDisplay.filter(trait => !trait.isDiscovered);
          break;
      }
    }

    // Available only filter
    if (showOnlyAvailable) {
      traitsToDisplay = traitsToDisplay.filter(trait => 
        trait.isDiscovered && !trait.isPermanent && trait.canBeAcquired
      );
    }

    // Sort traits
    traitsToDisplay.sort((a, b) => {
      // Always show discovered traits first
      if (a.isDiscovered && !b.isDiscovered) return -1;
      if (!a.isDiscovered && b.isDiscovered) return 1;

      switch (sortOption) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'rarity_asc':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrder.indexOf(a.rarity?.toLowerCase() || 'common') - 
                 rarityOrder.indexOf(b.rarity?.toLowerCase() || 'common');
        case 'rarity_desc':
          const rarityOrderDesc = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrderDesc.indexOf(b.rarity?.toLowerCase() || 'common') - 
                 rarityOrderDesc.indexOf(a.rarity?.toLowerCase() || 'common');
        case 'category_asc': return (a.category || '').localeCompare(b.category || '');
        case 'essence_cost_asc': return (a.essenceCost || 0) - (b.essenceCost || 0);
        case 'essence_cost_desc': return (b.essenceCost || 0) - (a.essenceCost || 0);
        default: return 0;
      }
    });

    return traitsToDisplay;
  }, [processedTraits, searchTerm, categoryFilter, rarityFilter, statusFilter, sortOption, showOnlyAvailable, showHidden]);

  const handleAcquireTrait = useCallback((trait: Trait) => {
    if (!canAcquireTrait(trait)) return;
    const affordability = getTraitAffordability(trait);
    if (!affordability.canAfford) return;
    onAcquireTrait(trait.id);
  }, [canAcquireTrait, getTraitAffordability, onAcquireTrait]);

  // Calculate progress statistics
  const stats = useMemo(() => {
    const total = allTraitsArray.length;
    const discovered = discoveredTraits.length;
    const acquired = acquiredTraitIds.length;
    const permanent = permanentTraitIds.length;
    const hidden = total - discovered;
    
    return {
      total,
      discovered,
      acquired,
      permanent,
      hidden,
      discoveryProgress: total > 0 ? (discovered / total) * 100 : 0,
      acquisitionProgress: discovered > 0 ? (acquired / discovered) * 100 : 0
    };
  }, [allTraitsArray.length, discoveredTraits.length, acquiredTraitIds.length, permanentTraitIds.length]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" component="h2">Trait Codex</Typography>
        <Tooltip title="Browse all traits. Discover new ones through NPC interactions. Use Resonance to permanently acquire traits with Essence.">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Discovery Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Discovery Progress</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total Traits</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">{stats.discovered}</Typography>
                <Typography variant="body2" color="text.secondary">Discovered</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.discoveryProgress} 
                  sx={{ mt: 0.5 }}
                  color="info"
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.discoveryProgress.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">{stats.acquired}</Typography>
                <Typography variant="body2" color="text.secondary">Acquired</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.acquisitionProgress} 
                  sx={{ mt: 0.5 }}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.acquisitionProgress.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">{stats.permanent}</Typography>
                <Typography variant="body2" color="text.secondary">Permanent</Typography>
              </Box>
            </Grid>
          </Grid>

          {stats.hidden > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{stats.hidden}</strong> traits remain hidden. Explore and interact with NPCs to discover more!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            Search & Filters
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Traits"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or category"
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
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  {statusFilters.map(filter => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
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
          </Grid>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
              Show Hidden
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Results */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Trait Library ({filteredAndSortedTraits.length} / {stats.total})
        </Typography>

        {filteredAndSortedTraits.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {searchTerm || categoryFilter !== 'all' || rarityFilter !== 'all' || statusFilter !== 'all' || showOnlyAvailable
              ? "No traits match your current filters. Try adjusting your search criteria."
              : "No traits available to display. Explore the world and interact with NPCs to discover new traits!"
            }
          </Alert>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {filteredAndSortedTraits.map(trait => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={trait.id}>
                <TraitCard
                  trait={trait}
                  isEquipped={false} // Codex doesn't show equipped status
                  isPermanent={trait.isPermanent}
                  isDiscovered={trait.isDiscovered}
                  currentEssence={currentEssence}
                  showActions={true}
                  showDetails={true}
                  onAcquire={trait.canBeAcquired ? handleAcquireTrait : undefined}
                  onShowDetails={() => setDetailViewTrait(trait)}
                  canAcquire={trait.canBeAcquired && !trait.isPermanent && !trait.isAcquired}
                  acquisitionCost={trait.essenceCost || 0}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Detail View Dialog */}
      {detailViewTrait && (
        <Dialog 
          open={detailViewTrait !== null} 
          onClose={() => setDetailViewTrait(null)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={detailViewTrait.iconPath} 
              alt={detailViewTrait.name}
              sx={{ width: 56, height: 56, bgcolor: 'primary.light' }}
            >
              {detailViewTrait.isDiscovered ? <StarIcon /> : <HelpOutlineIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5">
                {detailViewTrait.isDiscovered ? detailViewTrait.name : 'Undiscovered Trait'}
              </Typography>
              <Chip 
                label={detailViewTrait.statusLabel} 
                color={detailViewTrait.statusColor} 
                size="small"
              />
            </Box>
            <IconButton onClick={() => setDetailViewTrait(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              {detailViewTrait.isDiscovered 
                ? detailViewTrait.description 
                : 'This trait has not been discovered yet. Continue exploring to learn more about it.'
              }
            </Typography>

            {detailViewTrait.isDiscovered && (
              <>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Details</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Category:</strong> {detailViewTrait.category || 'Uncategorized'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Rarity:</strong> {detailViewTrait.rarity || 'Common'}
                      </Typography>
                    </Grid>
                    {detailViewTrait.tier && (
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Tier:</strong> {detailViewTrait.tier}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {detailViewTrait.effects && Object.keys(detailViewTrait.effects).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Effects</Typography>
                    {Object.entries(detailViewTrait.effects).map(([key, value]) => (
                      <Typography key={key} variant="body2" sx={{ ml: 1 }}>
                        • {key.replace(/([A-Z])/g, ' $1').trim()}: {value > 0 ? '+' : ''}{value}
                      </Typography>
                    ))}
                  </Box>
                )}

                {(detailViewTrait.sourceNpc || detailViewTrait.requirements) && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Acquisition</Typography>
                    {detailViewTrait.sourceNpc && (
                      <Typography variant="body2">
                        <strong>Source:</strong> {detailViewTrait.sourceNpc}
                      </Typography>
                    )}
                    {detailViewTrait.essenceCost && (
                      <Typography variant="body2">
                        <strong>Resonance Cost:</strong> {detailViewTrait.essenceCost} Essence
                      </Typography>
                    )}
                    {detailViewTrait.requirements?.relationshipLevel && (
                      <Typography variant="body2">
                        <strong>Required Relationship:</strong> Level {detailViewTrait.requirements.relationshipLevel}
                      </Typography>
                    )}
                    {detailViewTrait.requirements?.prerequisiteTraits?.length && (
                      <Typography variant="body2">
                        <strong>Prerequisites:</strong> {detailViewTrait.requirements.prerequisiteTraits.join(', ')}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            {detailViewTrait.isDiscovered && 
             !detailViewTrait.isPermanent && 
             !detailViewTrait.isAcquired && 
             detailViewTrait.essenceCost && 
             detailViewTrait.canBeAcquired && (
              <Button
                onClick={() => {
                  handleAcquireTrait(detailViewTrait);
                  setDetailViewTrait(null);
                }}
                variant="contained"
                color="primary"
                disabled={!getTraitAffordability(detailViewTrait).canAfford}
                startIcon={<ResonanceIcon />}
              >
                Resonate ({detailViewTrait.essenceCost} Essence)
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
