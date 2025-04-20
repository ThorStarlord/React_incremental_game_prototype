/**
 * @file TraitCodexDrawer.tsx
 * @description A drawer component for displaying a list of Traits with filtering and sorting.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  LinearProgress,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Collapse,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { RootState } from '../../../../app/store';
import {
  selectTraits,
  selectAcquiredTraits,
  selectPermanentTraits,
  selectTraitLoading,
  selectTraitError
} from '../../state/TraitsSlice';
import { fetchTraitsThunk } from '../../state/TraitThunks';
import { Trait } from '../../state/TraitsTypes';
import { selectEssenceAmount } from '../../../Essence/state/EssenceSlice';

interface TraitCodexDrawerProps {
    open: boolean;
    onClose: () => void;
    focusedId?: string;
}

interface FilterOptions {
    showFilters: boolean;
    traitTypeFilter: string;
    traitSourceFilter: string;
    traitCostRange: number[];
    traitStatusFilter: string;
    sortBy: keyof Trait | 'essenceCost' | 'name';
    sortOrder: 'asc' | 'desc';
    searchQuery: string;
    showUndiscovered: boolean;
}

const TraitCodexDrawer: React.FC<TraitCodexDrawerProps> = ({ open, onClose, focusedId }) => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraitIds = useAppSelector(selectAcquiredTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const playerEssence = useAppSelector(selectEssenceAmount);

  useEffect(() => {
    if (open && Object.keys(allTraits).length === 0 && !isLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [open, allTraits, isLoading, dispatch]);

  const [filterState, setFilterState] = useState<FilterOptions>({
    showFilters: false,
    traitTypeFilter: 'all',
    traitSourceFilter: 'all',
    traitCostRange: [0, 500],
    traitStatusFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    showUndiscovered: false,
  });

  const setFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilterState(prevState => ({ ...prevState, [key]: value }));
  }, []);

  const toggleFilters = useCallback(() => {
    setFilterState(prevState => ({ ...prevState, showFilters: !prevState.showFilters }));
  }, []);

  const handleSortOrderChange = useCallback((event: React.SyntheticEvent, newOrder: 'asc' | 'desc') => {
    if (newOrder !== null) {
      setFilterState(prevState => ({ ...prevState, sortOrder: newOrder }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      showFilters: false,
      traitTypeFilter: 'all',
      traitSourceFilter: 'all',
      traitCostRange: [0, 500],
      traitStatusFilter: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      searchQuery: '',
      showUndiscovered: false,
    });
  }, []);

  const filteredAndSortedTraits = useMemo(() => {
    let traitsArray = Object.entries(allTraits).map(([id, trait]) => ({ ...trait, id }));

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      traitsArray = traitsArray.filter(trait =>
        trait.name.toLowerCase().includes(query) ||
        trait.description.toLowerCase().includes(query)
      );
    }

    traitsArray = traitsArray.filter(trait => {
      if (filterState.traitTypeFilter !== 'all' && trait.category !== filterState.traitTypeFilter) return false;
      const cost = trait.essenceCost || 0;
      if (cost < filterState.traitCostRange[0] || cost > filterState.traitCostRange[1]) return false;

      const isAcquired = acquiredTraitIds.includes(trait.id);
      const isPermanent = permanentTraitIds.includes(trait.id);
      if (filterState.traitStatusFilter === 'acquired' && !isAcquired) return false;
      if (filterState.traitStatusFilter === 'permanent' && !isPermanent) return false;
      if (filterState.traitStatusFilter === 'available' && (isAcquired || isPermanent)) return false;
      if (filterState.traitStatusFilter === 'unlocked' && !isAcquired && !isPermanent) return false;

      return true;
    });

    traitsArray.sort((a, b) => {
      const sortBy = filterState.sortBy === 'essenceCost' ? 'essenceCost' : filterState.sortBy as keyof Trait;

      const valA = sortBy === 'essenceCost' ? (a.essenceCost || 0) : a[sortBy as keyof Trait];
      const valB = sortBy === 'essenceCost' ? (b.essenceCost || 0) : b[sortBy as keyof Trait];

      let comparison = 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      }

      return filterState.sortOrder === 'asc' ? comparison : comparison * -1;
    });

    return traitsArray;
  }, [allTraits, acquiredTraitIds, permanentTraitIds, filterState]);

  const renderTraitList = () => {
    if (isLoading) {
      return <LinearProgress sx={{ m: 2 }} />;
    }
    if (error) {
      return <Typography color="error" sx={{ p: 2 }}>Error loading traits: {error}</Typography>;
    }
    if (filteredAndSortedTraits.length === 0) {
      return <Typography sx={{ p: 2, textAlign: 'center' }}>No traits match the current filters.</Typography>;
    }

    return (
      <List dense>
        {filteredAndSortedTraits.map(trait => {
          const isAcquired = acquiredTraitIds.includes(trait.id);
          const isPermanent = permanentTraitIds.includes(trait.id);
          const cost = trait.essenceCost || 0;
          const canAfford = playerEssence >= cost;

          return (
            <ListItem
              key={trait.id}
              divider
              sx={{
                bgcolor: focusedId === trait.id ? 'action.selected' : 'inherit',
                opacity: isAcquired || isPermanent ? 0.7 : 1,
              }}
              secondaryAction={
                !isAcquired && !isPermanent && (
                  <Tooltip title={canAfford ? "Acquire Trait" : `Requires ${cost} Essence`}>
                    <span>
                      <IconButton
                        edge="end"
                        color="primary"
                        disabled={!canAfford}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <AutoFixHighIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={trait.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {trait.description}
                    </Typography>
                    <br />
                    <Chip label={`Cost: ${cost}`} size="small" sx={{ mr: 0.5 }} />
                    {isPermanent && <Chip label="Permanent" color="secondary" size="small" sx={{ mr: 0.5 }} />}
                    {isAcquired && !isPermanent && <Chip label="Acquired" color="primary" size="small" sx={{ mr: 0.5 }} />}
                    <Chip label={`Type: ${trait.category || 'General'}`} size="small" />
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderFilters = () => (
    <Collapse in={filterState.showFilters}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Filters</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filterState.traitTypeFilter}
              label="Type"
              onChange={(e) => setFilter('traitTypeFilter', e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {Array.from(new Set(Object.values(allTraits).map(t => t.category))).map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterState.traitStatusFilter}
              label="Status"
              onChange={(e) => setFilter('traitStatusFilter', e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="acquired">Acquired</MenuItem>
              <MenuItem value="permanent">Permanent</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <Typography gutterBottom>Cost Range</Typography>
            <Slider
              value={filterState.traitCostRange}
              onChange={(e, newValue) => setFilter('traitCostRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              size="small"
            />
          </Box>
          <Button variant="outlined" size="small" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Stack>
      </Paper>
    </Collapse>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Trait Codex</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search Traits..."
            value={filterState.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Toggle Filters">
            <IconButton onClick={toggleFilters} color={filterState.showFilters ? 'primary' : 'default'}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {renderFilters()}
        <Box sx={{ px: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filterState.sortBy}
              label="Sort By"
              onChange={(e) => setFilter('sortBy', e.target.value as keyof Trait | 'essenceCost' | 'name')}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="essenceCost">Cost</MenuItem>
              <MenuItem value="category">Type</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            size="small"
            value={filterState.sortOrder}
            exclusive
            onChange={handleSortOrderChange}
          >
            <ToggleButton value="asc">Asc</ToggleButton>
            <ToggleButton value="desc">Desc</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {renderTraitList()}
        </Box>
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption">
            Showing {filteredAndSortedTraits.length} of {Object.keys(allTraits).length} traits
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TraitCodexDrawer;