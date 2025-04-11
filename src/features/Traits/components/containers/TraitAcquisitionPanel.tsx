import React, { useState, useMemo } from 'react';
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
import { selectEssenceAmount, spendEssence } from '../../../Essence/state/EssenceSlice';
import { acquireTrait } from '../../state/TraitsSlice';
import { 
  selectAvailableTraitObjects, 
  selectTraitLoading, 
  selectTraitError 
} from '../../state/TraitsSelectors';
import { Trait } from '../../state/TraitsTypes';

/**
 * Component for discovering and purchasing traits with essence
 */
const TraitAcquisitionPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const essenceAmount = useAppSelector(selectEssenceAmount);
  const availableTraits = useAppSelector(selectAvailableTraitObjects); // Returns Trait[]
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Filter and sort available traits
  const filteredTraits = useMemo(() => {
    return availableTraits
      .filter(trait => {
        // Filter by search query (name or description)
        const matchesSearch = searchQuery === '' ||
          trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trait.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by selected type (use category)
        const matchesType = !selectedType || trait.category === selectedType;

        return matchesSearch && matchesType;
      })
      // Sort alphabetically by name (can add more sorting later)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [availableTraits, searchQuery, selectedType]);

  // Get all unique trait categories
  const traitTypes = useMemo(() => Array.from(
    new Set(
      availableTraits
        .map(trait => trait.category || 'General')
    )
  ), [availableTraits]);

  const handleAcquireTrait = (traitId: string, cost: number) => {
    if (essenceAmount >= cost) {
      try {
        // Find the trait name for the reason message
        const trait = availableTraits.find(t => t.id === traitId);
        const traitName = trait ? trait.name : 'Unknown Trait';

        // Spend essence first
        dispatch(spendEssence({
          amount: cost,
          reason: `Acquired trait: ${traitName}`
        }));

        // Then acquire the trait
        dispatch(acquireTrait(traitId));

        // Optionally show success notification
        console.log(`Successfully acquired trait: ${traitName}`);

      } catch (e) {
        console.error("Error acquiring trait:", e);
        // Optionally show error notification
      }
    } else {
      console.warn("Not enough essence to acquire trait");
      // Optionally show warning notification
    }
  };

  return (
    <Panel title="Acquire Traits">
      {/* Header section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          Use essence to acquire new traits that enhance your abilities. 
          Acquired traits can be equipped in trait slots or made permanent.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          <Typography variant="h6" color="primary">
            Current Essence: {essenceAmount}
          </Typography>
          <Typography variant="subtitle2">
            Available Traits: {availableTraits.length}
          </Typography>
        </Box>
      </Box>

      {/* Search and filter */}
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search traits..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          label="All Types"
          clickable
          color={selectedType === null ? 'primary' : 'default'}
          onClick={() => setSelectedType(null)}
          size="small"
        />
        {traitTypes.map(type => (
          <Chip
            key={type}
            label={type}
            clickable
            color={selectedType === type ? 'primary' : 'default'}
            onClick={() => setSelectedType(type)}
            size="small"
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Status messages */}
      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error">Error loading traits: {error}</Alert>}

      {/* Traits grid */}
      {!isLoading && !error && (
        <Grid container spacing={2}>
          {filteredTraits.length > 0 ? (
            filteredTraits.map((trait) => {
              const currentEssenceCost = trait.essenceCost ?? 0; // Handle undefined cost
              return (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6">{trait.name}</Typography>
                      <Chip
                        label={trait.category || 'General'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {trait.description}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={essenceAmount < currentEssenceCost}
                        onClick={() => handleAcquireTrait(trait.id, currentEssenceCost)}
                      >
                        Acquire ({currentEssenceCost} Essence)
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', p: 2 }}>
                No traits match your criteria or none available to acquire.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Panel>
  );
};

export default TraitAcquisitionPanel;