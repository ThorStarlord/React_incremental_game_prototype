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
  ListItemButton,
  IconButton,
  Tooltip,
  Divider,
  Avatar
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
  Done as DoneIcon
} from '@mui/icons-material';
import type { Trait } from '../../state/TraitsTypes';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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
  onMakeTraitPermanent: (traitId: string) => void; // Deprecated
  canMakePermanent: (trait: Trait) => boolean; // Deprecated
  canAcquireTrait: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait) => { // Simplified signature
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
  // onMakeTraitPermanent, // Deprecated prop
  // canMakePermanent, // Deprecated prop
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
    ];
  }, []);

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

    if (!showHidden) {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered);
    }

    if (searchTerm) {
      traitsToDisplay = traitsToDisplay.filter(trait =>
        trait.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trait.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.category === categoryFilter);
    }
    if (rarityFilter !== 'all') {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.rarity === rarityFilter);
    }
    if (showOnlyAvailable) {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered && !trait.isPermanent && trait.canBeAcquired);
    }

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

    return traitsToDisplay.sort((a, b) => {
      if (a.isDiscovered && !b.isDiscovered) return -1;
      if (!a.isDiscovered && b.isDiscovered) return 1;

      switch (sortOption) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'rarity_asc':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrder.indexOf(a.rarity.toLowerCase()) - rarityOrder.indexOf(b.rarity.toLowerCase());
        case 'rarity_desc':
          const rarityOrderDesc = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return rarityOrderDesc.indexOf(b.rarity.toLowerCase()) - rarityOrderDesc.indexOf(a.rarity.toLowerCase());
        case 'category_asc': return (a.category || '').localeCompare(b.category || '');
        case 'category_desc': return (b.category || '').localeCompare(a.category || '');
        case 'essence_cost_asc': return (a.essenceCost || 0) - (b.essenceCost || 0);
        case 'essence_cost_desc': return (b.essenceCost || 0) - (a.essenceCost || 0);
        default: return 0;
      }
    });
  }, [processedTraits, searchTerm, categoryFilter, rarityFilter, statusFilter, sortOption, showOnlyAvailable, showHidden]);

  const handleGeneralAcquireTrait = useCallback((trait: Trait) => {
    if (!canAcquireTrait(trait)) return;
    const affordability = getTraitAffordability(trait);
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

  const renderTraitCard = (trait: ProcessedTrait) => {
    const affordability = trait.essenceCost ? getTraitAffordability(trait) : null;

    return (
      <Card
        key={trait.id}
        onClick={() => setDetailViewTrait(trait)}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
              {!trait.isDiscovered && <VisibilityOffIcon />}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.isDiscovered ? trait.name : '???'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
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
                trait.isAcquired ? <DoneIcon /> :
                (trait.isDiscovered ? undefined : <VisibilityOffIcon fontSize="small" />)
              }
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' }}>
            {trait.isDiscovered ? trait.description : 'This trait is yet to be discovered.'}
          </Typography>

          {trait.isDiscovered && (
            <>
              {trait.effects && Object.keys(trait.effects).length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Effects:</Typography>
                  {Object.entries(trait.effects).map(([key, value]) => (
                    <Chip key={key} label={`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              )}
              <Typography variant="caption" color="text.secondary">Category: {trait.category}</Typography>
              {trait.tier && (<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Tier: {trait.tier}</Typography>)}
              {trait.requirements?.prerequisiteTraits && trait.requirements.prerequisiteTraits.length > 0 && (<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Requires: {trait.requirements.prerequisiteTraits.join(', ')}</Typography>)}
              {trait.sourceNpc && (<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Source: NPC {trait.sourceNpc} {trait.requirements?.relationshipLevel ? `(Rel: ${trait.requirements.relationshipLevel})` : ''}</Typography>)}
            </>
          )}
          
          <Box sx={{ mt: 'auto', pt: 1 }}>
            {trait.isDiscovered && !trait.isPermanent && !trait.isAcquired && trait.essenceCost && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
                {affordability && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EssenceIcon fontSize="small" />
                    <Typography variant="body2" color={affordability.canAfford ? 'text.primary' : 'error.main'}>{trait.essenceCost}</Typography>
                  </Box>
                )}
                <Tooltip title={!trait.canBeAcquired ? "Requirements not met" : !affordability?.canAfford ? `Need ${trait.essenceCost} Essence (have ${currentEssence})` : "Acquire this trait (becomes permanent)"}>
                  <span>
                    <Button variant="contained" size="small" disabled={!trait.canBeAcquired || !affordability?.canAfford} onClick={(e) => { e.stopPropagation(); handleGeneralAcquireTrait(trait); }} startIcon={<StarIcon />}>
                      Acquire (Permanent)
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            )}
             {trait.isDiscovered && !trait.isPermanent && !trait.isAcquired && !trait.essenceCost && (
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
        <Typography variant="h5" component="h2">Trait Codex</Typography>
        <Tooltip title="Browse traits. Resonating traits from NPCs makes them permanent."><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Discovery Progress</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Total Traits</Typography><Typography variant="h6">{allTraitsArray.length}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Acquired</Typography><Typography variant="h6" color="primary">{acquiredTraitIds.length}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Permanent</Typography><Typography variant="h6" color="success.main">{permanentTraitIds.length}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="body2" color="text.secondary">Hidden</Typography><Typography variant="h6" color="warning.main">{undiscoveredCount}</Typography></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FilterIcon />Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />}}/></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Category</InputLabel><Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Category">{categories.map(category => (<MenuItem key={category} value={category}>{category === 'all' ? 'All Categories' : category}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Rarity</InputLabel><Select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)} label="Rarity">{rarities.map(rarity => (<MenuItem key={rarity} value={rarity}>{rarity === 'all' ? 'All Rarities' : rarity}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Status</InputLabel><Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">{statusFilters.map(status => (<MenuItem key={status} value={status}>{status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={6} md={2}><FormControl fullWidth><InputLabel>Sort By</InputLabel><Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} label="Sort By">{sortOptions.map(option => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={12} md={4}><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}><Button variant={showOnlyAvailable ? 'contained' : 'outlined'} onClick={() => setShowOnlyAvailable(!showOnlyAvailable)} size="small">Available Only</Button><Button variant={showHidden ? 'contained' : 'outlined'} onClick={() => setShowHidden(!showHidden)} size="small" startIcon={showHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}>Hidden Traits</Button></Box></Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredAndSortedTraits.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {searchTerm || categoryFilter !== 'all' || rarityFilter !== 'all' || showOnlyAvailable ? "No traits match your current filters." : "No traits available to display. Adjust filters or discover more traits."}
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

      {detailViewTrait && (
        <Dialog open={detailViewTrait !== null} onClose={() => setDetailViewTrait(null)} aria-labelledby="trait-detail-dialog-title" maxWidth="md" fullWidth>
          <DialogTitle id="trait-detail-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={detailViewTrait.iconPath ? detailViewTrait.iconPath : undefined} alt={detailViewTrait.name} sx={{ width: 56, height: 56, bgcolor: 'primary.light', border: '1px solid', borderColor: 'divider' }}>
              {!detailViewTrait.iconPath && <StarIcon />}
            </Avatar>
            <Typography variant="h5" component="span" sx={{ flexGrow: 1 }}>{detailViewTrait.name}</Typography>
            <IconButton aria-label="close" onClick={() => setDetailViewTrait(null)} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>{detailViewTrait.description}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Category: ${detailViewTrait.category}`} size="small" />
              <Chip label={`Rarity: ${detailViewTrait.rarity}`} size="small" color={getRarityColor(detailViewTrait.rarity)} />
              {detailViewTrait.tier && <Chip label={`Tier: ${detailViewTrait.tier}`} size="small" />}
              <Chip label={detailViewTrait.statusLabel} size="small" color={detailViewTrait.statusColor} icon={detailViewTrait.isPermanent ? <CheckCircleIcon fontSize="small"/> : undefined} />
            </Box>
            {detailViewTrait.effects && Object.keys(detailViewTrait.effects).length > 0 && (<Box sx={{ mb: 2 }}><Typography variant="subtitle1" gutterBottom>Effects:</Typography><List dense disablePadding>{Object.entries(detailViewTrait.effects).map(([key, value]) => (<ListItem key={key} disableGutters sx={{py: 0.5}}><ListItemText primary={`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`} primaryTypographyProps={{ variant: 'body2' }} /></ListItem>))}</List></Box>)}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Costs:</Typography>
              {detailViewTrait.essenceCost && (<Typography variant="body2">Acquisition Cost: {detailViewTrait.essenceCost} Essence</Typography>)}
              {!detailViewTrait.essenceCost && (<Typography variant="body2" color="text.secondary">No direct essence costs.</Typography>)}
            </Box>
            {(detailViewTrait.requirements || detailViewTrait.sourceNpc) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Requirements & Source:</Typography>
                {detailViewTrait.sourceNpc && (<Typography variant="body2">Source: NPC {detailViewTrait.sourceNpc}</Typography>)}
                {detailViewTrait.requirements?.relationshipLevel && (<Typography variant="body2">Required Relationship Level: {detailViewTrait.requirements.relationshipLevel}</Typography>)}
                {detailViewTrait.requirements?.prerequisiteTraits && detailViewTrait.requirements.prerequisiteTraits.length > 0 && (<Typography variant="body2">Required Traits: {detailViewTrait.requirements.prerequisiteTraits.map(id => allTraits[id]?.name || id).join(', ')}</Typography>)}
                {detailViewTrait.requirements?.level && (<Typography variant="body2">Required Player Level: {detailViewTrait.requirements.level}</Typography>)}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{p: 2}}>
            {!detailViewTrait.isPermanent && !detailViewTrait.isAcquired && detailViewTrait.essenceCost && detailViewTrait.canBeAcquired && (
              <Button onClick={() => { handleGeneralAcquireTrait(detailViewTrait); setDetailViewTrait(null); }} variant="contained" color="primary" disabled={!(getTraitAffordability(detailViewTrait).canAfford)} startIcon={<StarIcon />}>
                Acquire ({detailViewTrait.essenceCost} Essence)
              </Button>
            )}
            <Button onClick={() => setDetailViewTrait(null)} color="inherit">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

TraitCodex.displayName = 'TraitCodex';
export default TraitCodex;
