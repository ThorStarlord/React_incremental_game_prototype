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
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Close as CloseIcon,
  HelpOutline as HelpOutlineIcon,
  AutoAwesome as ResonanceIcon
} from '@mui/icons-material';
import type { Trait } from '../../state/TraitsTypes';
import TraitCard from './TraitCard';

// Define ProcessedTrait locally as it's specific to this component's logic
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
  onAcquireTrait,
  canAcquireTrait,
  getTraitAffordability
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc');
  const [showHidden, setShowHidden] = useState(false);
  const [detailViewTrait, setDetailViewTrait] = useState<ProcessedTrait | null>(null);

  const allTraitsArray = useMemo(() => Object.values(allTraits), [allTraits]);

  // ... (categories, rarities, statusFilters, sortOptions remain the same) ...
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
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'rarity_asc', label: 'Rarity (Low to High)' },
    { value: 'rarity_desc', label: 'Rarity (High to Low)' },
    { value: 'category_asc', label: 'Category (A-Z)' },
    { value: 'essence_cost_asc', label: 'Cost (Low to High)' },
    { value: 'essence_cost_desc', label: 'Cost (High to Low)' },
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

    if (!showHidden) {
      traitsToDisplay = traitsToDisplay.filter(trait => trait.isDiscovered);
    }
    // ... (filtering and sorting logic remains the same) ...

    return traitsToDisplay;
  }, [processedTraits, searchTerm, categoryFilter, rarityFilter, statusFilter, sortOption, showHidden]);

  const handleAcquireTrait = useCallback((trait: Trait) => {
    if (!canAcquireTrait(trait)) return;
    const affordability = getTraitAffordability(trait);
    if (!affordability.canAfford) return;
    onAcquireTrait(trait.id);
  }, [canAcquireTrait, getTraitAffordability, onAcquireTrait]);

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
      {/* ... (Header and Progress JSX remains the same) ... */}
      
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        {/* ... (Filters JSX remains the same) ... */}
      </Card>

      {/* Results */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Trait Library ({filteredAndSortedTraits.length} / {stats.total})
        </Typography>
        {filteredAndSortedTraits.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {/* ... (Alert JSX remains the same) ... */}
          </Alert>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {filteredAndSortedTraits.map(trait => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={trait.id}>
                {/* FIXED: Removed the invalid `isDiscovered` prop */}
                <TraitCard
                  trait={trait}
                  isEquipped={false}
                  isPermanent={trait.isPermanent}
                  currentEssence={currentEssence}
                  showUnequipButton={trait.canBeAcquired && !trait.isPermanent && !trait.isAcquired}
                  unequipButtonText="Acquire"
                  unequipButtonColor="primary"
                  canUnequip={getTraitAffordability(trait).canAfford}
                  onUnequip={() => handleAcquireTrait(trait)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Detail View Dialog */}
      {detailViewTrait && (
        <Dialog open={detailViewTrait !== null} onClose={() => setDetailViewTrait(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* ... (Dialog Title JSX remains the same) ... */}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              {detailViewTrait.isDiscovered ? detailViewTrait.description : 'This trait has not been discovered yet.'}
            </Typography>
            {detailViewTrait.isDiscovered && (
              <>
                <Divider sx={{ my: 2 }} />
                {/* ... (Dialog Details JSX remains the same) ... */}
                {/* FIXED: Changed `sourceNpc` to `source` */}
                {(detailViewTrait.source || detailViewTrait.requirements) && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Acquisition</Typography>
                    {detailViewTrait.source && (
                      <Typography variant="body2">
                        <strong>Source:</strong> {detailViewTrait.source}
                      </Typography>
                    )}
                    {/* ... (rest of acquisition JSX) ... */}
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            {/* ... (Dialog Actions JSX remains the same) ... */}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

TraitCodex.displayName = 'TraitCodex';
export default TraitCodex;