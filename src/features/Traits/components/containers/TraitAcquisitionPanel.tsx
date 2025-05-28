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
import { spendEssence } from '../../../Essence/state/EssenceSlice';
import { acquireTrait } from '../../state/TraitsSlice';
import { 
  selectAvailableTraitObjects, 
  selectTraitLoading, 
  selectTraitError 
} from '../../state/TraitsSelectors';

/**
 * TraitAcquisitionPanel Component
 * 
 * Provides interface for discovering and acquiring traits using Essence.
 * Follows Feature-Sliced Design principles with proper state management.
 */
const TraitAcquisitionPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();

  // Redux state selectors
  const essenceAmount = useAppSelector(selectCurrentEssence);
  const availableTraits = useAppSelector(selectAvailableTraitObjects);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // Local state for filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoized trait categories for filter chips
  const traitCategories = useMemo(() => {
    const categories = availableTraits
      .map(trait => trait.category || 'General')
      .filter((category, index, array) => array.indexOf(category) === index)
      .sort();
    return categories;
  }, [availableTraits]);

  // Memoized filtered traits with search and category filtering
  const filteredTraits = useMemo(() => {
    return availableTraits
      .filter(trait => {
        const matchesSearch = !searchQuery || 
          trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trait.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || 
          (trait.category || 'General') === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availableTraits, searchQuery, selectedCategory]);

  // Memoized trait acquisition handler
  const handleAcquireTrait = useCallback((traitId: string, cost: number) => {
    if (essenceAmount < cost) {
      console.warn(`Insufficient essence: need ${cost}, have ${essenceAmount}`);
      return;
    }

    try {
      const trait = availableTraits.find(t => t.id === traitId);
      if (!trait) {
        console.error(`Trait not found: ${traitId}`);
        return;
      }

      // Dispatch actions in sequence
      dispatch(spendEssence({ amount: cost, source: 'trait_acquisition' }));
      dispatch(acquireTrait(traitId));

      console.log(`Successfully acquired trait: ${trait.name} for ${cost} essence`);
    } catch (e) {
      console.error('Error acquiring trait:', e);
    }
  }, [dispatch, essenceAmount, availableTraits]);

  // Memoized search handler
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // Memoized category filter handler
  const handleCategoryFilter = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  // Check if trait is affordable
  const canAffordTrait = useCallback((cost: number) => essenceAmount >= cost, [essenceAmount]);

  return (
    <Panel title="Acquire Traits">
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Use Essence to acquire new traits that enhance your abilities. 
          Acquired traits can be equipped in trait slots or made permanent.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2, 
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="h6" color="primary">
            Current Essence: {essenceAmount.toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Available: {filteredTraits.length} of {availableTraits.length} traits
          </Typography>
        </Box>
      </Box>

      {/* Search field */}
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search traits by name or description..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Category filter chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          label="All Categories"
          clickable
          color={selectedCategory === null ? 'primary' : 'default'}
          onClick={() => handleCategoryFilter(null)}
          size="small"
        />
        {traitCategories.map(category => (
          <Chip
            key={category}
            label={category}
            clickable
            color={selectedCategory === category ? 'primary' : 'default'}
            onClick={() => handleCategoryFilter(category)}
            size="small"
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Loading and error states */}
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

      {/* Traits grid */}
      {!isLoading && !error && (
        <Grid container spacing={2}>
          {filteredTraits.length > 0 ? (
            filteredTraits.map((trait) => {
              const essenceCost = trait.essenceCost ?? 0;
              const isAffordable = canAffordTrait(essenceCost);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'elevation 0.2s',
                      '&:hover': {
                        elevation: 3
                      }
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {trait.name}
                      </Typography>
                      
                      {trait.category && (
                        <Chip
                          label={trait.category}
                          size="small"
                          color="secondary"
                          sx={{ mb: 1 }}
                        />
                      )}
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, minHeight: '3em' }}
                      >
                        {trait.description}
                      </Typography>

                      {trait.effects && (
                        <Typography variant="caption" color="text.disabled">
                          Effects: {JSON.stringify(trait.effects)}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ pt: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!isAffordable}
                        onClick={() => handleAcquireTrait(trait.id, essenceCost)}
                        sx={{
                          fontWeight: 'bold',
                          ...(isAffordable ? {} : { opacity: 0.6 })
                        }}
                      >
                        {isAffordable 
                          ? `Acquire (${essenceCost.toLocaleString()} Essence)`
                          : `Need ${essenceCost.toLocaleString()} Essence`
                        }
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No traits found
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {searchQuery || selectedCategory 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No traits are currently available for acquisition.'
                  }
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
