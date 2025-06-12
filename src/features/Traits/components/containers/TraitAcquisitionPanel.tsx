import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Paper,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Panel from '../../../../shared/components/layout/Panel';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
// FIXED: Thunk import is correct.
import { acquireTraitWithEssenceThunk } from '../../state/TraitThunks';
// FIXED: Corrected selector imports. `selectAcquiredTraitObjects` gives us the list of all known traits.
import {
  selectAcquiredTraitObjects,
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSelectors';
import { Trait } from '../../state/TraitsTypes';

const TraitAcquisitionPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();

  const essenceAmount = useAppSelector(selectCurrentEssence);
  // FIXED: Using the correct selector.
  const allAcquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // For this panel, "available" traits are all traits the player has acquired.
  const availableTraits = allAcquiredTraits;

  const traitCategories = useMemo(() => {
    const categories = new Set(availableTraits.map(trait => trait.category || 'General'));
    return Array.from(categories).sort();
  }, [availableTraits]);

  const filteredTraits = useMemo(() => {
    return availableTraits.filter(trait => {
      const matchesSearch = !searchQuery ||
        trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trait.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || (trait.category || 'General') === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [availableTraits, searchQuery, selectedCategory]);

  const handleAcquireTrait = useCallback(async (trait: Trait) => {
    const cost = trait.essenceCost ?? 0;
    if (essenceAmount < cost) {
      console.warn(`Insufficient essence: need ${cost}, have ${essenceAmount}`);
      return;
    }

    try {
      // FIXED: Dispatch thunk with the correct object payload.
      const resultAction = await dispatch(acquireTraitWithEssenceThunk({
        traitId: trait.id,
        essenceCost: cost
      }));

      if (acquireTraitWithEssenceThunk.fulfilled.match(resultAction)) {
        console.log(`Successfully acquired trait: ${resultAction.payload.trait.name}`);
      } else if (acquireTraitWithEssenceThunk.rejected.match(resultAction)) {
        console.error(`Failed to acquire trait: ${resultAction.payload}`);
      }
    } catch (e) {
      console.error('Unexpected error acquiring trait:', e);
    }
  }, [dispatch, essenceAmount]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleCategoryFilter = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const canAffordTrait = useCallback((cost: number) => essenceAmount >= cost, [essenceAmount]);

  return (
    <Panel title="Acquire Traits">
      {/* ... (The rest of the JSX is mostly correct, but we'll ensure types are handled) ... */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Use Essence to acquire new traits that enhance your abilities.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" color="primary">
            Current Essence: {essenceAmount.toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Available: {filteredTraits.length} of {availableTraits.length} traits
          </Typography>
        </Box>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search traits..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip label="All Categories" clickable color={selectedCategory === null ? 'primary' : 'default'} onClick={() => handleCategoryFilter(null)} size="small" />
        {traitCategories.map(category => (
          <Chip key={category} label={category} clickable color={selectedCategory === category ? 'primary' : 'default'} onClick={() => handleCategoryFilter(category)} size="small" />
        ))}
      </Box>
      <Divider sx={{ mb: 2 }} />
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading traits: {error}
        </Alert>
      )}
      {!isLoading && !error && (
        <Grid container spacing={2}>
          {filteredTraits.length > 0 ? (
            filteredTraits.map((trait) => {
              const essenceCost = trait.essenceCost ?? 0;
              const isAffordable = canAffordTrait(essenceCost);
              return (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', transition: 'elevation 0.2s', '&:hover': { elevation: 3 } }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>{trait.name}</Typography>
                      {trait.category && (<Chip label={trait.category} size="small" color="secondary" sx={{ mb: 1 }} />)}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>{trait.description}</Typography>
                      {trait.effects && (<Typography variant="caption" color="text.disabled">Effects: {JSON.stringify(trait.effects)}</Typography>)}
                    </Box>
                    <Box sx={{ pt: 2 }}>
                      <Button fullWidth variant="contained" color="primary" disabled={!isAffordable} onClick={() => handleAcquireTrait(trait)} sx={{ fontWeight: 'bold', ...(isAffordable ? {} : { opacity: 0.6 }) }}>
                        {isAffordable ? `Acquire (${essenceCost.toLocaleString()} Essence)` : `Need ${essenceCost.toLocaleString()} Essence`}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>No traits found</Typography>
                <Typography variant="body2" color="text.disabled">
                  {searchQuery || selectedCategory ? 'Try adjusting your search criteria or filters.' : 'No traits are currently available for acquisition.'}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Panel>
  );
});

TraitAcquisitionPanel.displayName = 'TraitAcquisitionPanel';

export default TraitAcquisitionPanel;