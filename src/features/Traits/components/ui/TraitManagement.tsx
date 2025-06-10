import React, { useState, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Badge,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  FileUpload as LoadIcon,
  Delete as DeleteIcon,
  ClearAll as ClearAllIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Settings as SettingsIcon,
  LockOpen as UnlockIcon,
  Star as FavoriteIcon,
  Category as CategoryIcon,
  Speed as OptimizeIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Added import
import StarIcon from '@mui/icons-material/Star'; // Added import

import {
  selectAcquiredTraits,
  selectTraitPresets,
  selectDiscoveredTraits,
  selectTraits,
  selectEquippedTraitObjects,
  selectPermanentTraitObjects
} from '../../state/TraitsSelectors';
import { selectTraitSlots } from '../../../Player/state/PlayerSelectors'; // Add import
import {
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  clearAllEquippedTraits
} from '../../state/TraitsSlice';
import { equipTrait, unequipTrait } from '../../../Player/state/PlayerSlice';
import type { TraitPreset, Trait, TraitEffect, TraitEffectValues } from '../../state/TraitsTypes'; // Corrected import path and added TraitEffect, TraitEffectValues

/**
 * Props for the TraitManagement component
 */
export interface TraitManagementProps {
  // Data (props that are actually passed from parent)
  acquiredTraits: string[]; // This should be string[] (IDs) from TraitsSlice
  permanentTraits: string[]; // This should be string[] (IDs) from PlayerSlice
  currentEssence: number;
  
  // No longer passing equippedTraitIds or permanentTraitIds as props, selecting internally
  // No longer passing onAcquireTrait, onMakeTraitPermanent, canMakePermanent, getTraitAffordability, isInProximityToNPC
}

type SortOption = 'name' | 'category' | 'rarity' | 'recent'; // Defined SortOption
type FilterOption = 'all' | 'equipped' | 'unequipped' | 'permanent' | 'temporary'; // Defined FilterOption

/**
 * Trait management interface for acquired traits.
 * "Make Permanent" functionality is now deprecated as Resonance handles it.
 */
export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  acquiredTraits: acquiredTraitIdsFromProps,
  permanentTraits: permanentTraitIdsFromProps,
  currentEssence, 
}) => {
  const dispatch = useAppDispatch();
  
  // State selections
  const allTraits = useAppSelector(selectTraits);
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects);
  const permanentTraitObjects = useAppSelector(selectPermanentTraitObjects);
  const traitPresets = useAppSelector(selectTraitPresets);
  const discoveredTraits = useAppSelector(selectDiscoveredTraits);
  const playerTraitSlots = useAppSelector(selectTraitSlots); // Move hook call to component level

  // Convert trait objects to IDs for compatibility with existing logic
  const equippedTraitIds = useMemo(() => 
    equippedTraitObjects.map(trait => trait.id), 
    [equippedTraitObjects]
  );
  
  const permanentTraitIds = useMemo(() => 
    permanentTraitObjects.map(trait => trait.id), 
    [permanentTraitObjects]
  );

  // Local state
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get trait objects from IDs
  const acquiredTraitObjects = useMemo(() => {
    // Use acquiredTraitIdsFromProps (from TraitsSlice) to map to actual Trait objects
    return acquiredTraitIdsFromProps.map(id => allTraits[id]).filter(Boolean) as Trait[];
  }, [acquiredTraitIdsFromProps, allTraits]);

  // Filter and sort traits
  const filteredAndSortedTraits = useMemo(() => {
    let filtered = [...acquiredTraitObjects];

    // Apply filters
    switch (filterBy) {
      case 'equipped':
        filtered = filtered.filter(trait => equippedTraitIds.includes(trait.id));
        break;
      case 'unequipped':
        filtered = filtered.filter(trait => !equippedTraitIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
        break;
      case 'permanent':
        filtered = filtered.filter(trait => permanentTraitIds.includes(trait.id));
        break;
      case 'temporary':
        filtered = filtered.filter(trait => equippedTraitIds.includes(trait.id) && !permanentTraitIds.includes(trait.id));
        break;
      case 'all':
      default:
        // No filtering
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']; // Added uncommon, mythic
          const aRarity = rarityOrder.indexOf(a.rarity?.toLowerCase() || 'common');
          const bRarity = rarityOrder.indexOf(b.rarity?.toLowerCase() || 'common');
          return bRarity - aRarity; // Highest rarity first
        case 'recent':
          // Sort by discovery order (most recently discovered first)
          const aIndex = discoveredTraits.indexOf(a.id);
          const bIndex = discoveredTraits.indexOf(b.id);
          return bIndex - aIndex;
        default:
          return 0;
      }
    });

    return filtered;
  }, [acquiredTraitObjects, filterBy, sortBy, equippedTraitIds, permanentTraitIds, discoveredTraits]);

  // Save current loadout as preset
  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;

    const preset: TraitPreset = {
      id: `preset_${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || undefined,
      traits: [...equippedTraitIds],
      created: Date.now()
    };

    dispatch(saveTraitPreset(preset));
    setPresetDialogOpen(false);
    setPresetName('');
    setPresetDescription('');
  }, [presetName, presetDescription, equippedTraitIds, dispatch]);

  // Load preset configuration
  const handleLoadPreset = useCallback((presetId: string) => {
    dispatch(loadTraitPreset(presetId));
  }, [dispatch]);

  // Delete preset
  const handleDeletePreset = useCallback(() => {
    if (selectedPresetId) {
      dispatch(deleteTraitPreset(selectedPresetId));
      setDeleteConfirmOpen(false);
      setSelectedPresetId(null);
    }
  }, [selectedPresetId, dispatch]);

  // Clear all equipped traits
  const handleClearAll = useCallback(() => {
    dispatch(clearAllEquippedTraits());
  }, [dispatch]);

  // Toggle trait equipment - Fixed logic
  const handleToggleTrait = useCallback((traitId: string) => {
    if (equippedTraitIds.includes(traitId)) {
      // Find the slot index for this trait and unequip it
      const equippedSlot = playerTraitSlots.find(slot => slot.traitId === traitId);
      if (equippedSlot) {
        dispatch(unequipTrait({ slotIndex: equippedSlot.index }));
      }
    } else {
      // Equip the trait to an available slot
      dispatch(equipTrait({ traitId, slotIndex: -1 })); // -1 means auto-assign
    }
  }, [equippedTraitIds, playerTraitSlots, dispatch]);

  // Get trait status
  const getTraitStatus = useCallback((trait: Trait) => {
    if (permanentTraitIds.includes(trait.id)) {
      return { type: 'permanent', label: 'Permanent', color: 'success' as const };
    }
    if (equippedTraitIds.includes(trait.id)) {
      return { type: 'equipped', label: 'Equipped', color: 'primary' as const };
    }
    return { type: 'available', label: 'Acquired', color: 'default' as const }; // Changed label to Acquired
  }, [permanentTraitIds, equippedTraitIds]);

  // Statistics
  const stats = useMemo(() => ({
    total: acquiredTraitObjects.length,
    equipped: equippedTraitIds.length,
    permanent: permanentTraitIds.length,
    available: acquiredTraitObjects.length - permanentTraitIds.length,
    temporary: equippedTraitIds.filter(id => !permanentTraitIds.includes(id)).length // Added temporary count
  }), [acquiredTraitObjects.length, equippedTraitIds.length, permanentTraitIds.length]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'error';
      case 'epic': return 'secondary';
      case 'rare': return 'primary';
      case 'uncommon': return 'info'; // Added uncommon
      default: return 'default';
    }
  };

  const getStatusChip = (trait: Trait) => {
    if (permanentTraitIds.includes(trait.id)) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Permanent"
          color="success"
          size="small"
          variant="filled"
        />
      );
    }
    
    if (equippedTraitIds.includes(trait.id)) {
      return (
        <Chip
          icon={<StarIcon />}
          label="Equipped"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    }
    
    return (
      <Chip
        label="Acquired"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const renderTraitItem = (trait: Trait) => {
    const isPermanentByPlayer = permanentTraitIds.includes(trait.id); // Use internal permanentTraitIds

    return (
      <ListItem
        key={trait.id}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.name}
            </Typography>
            <Chip
              label={trait.rarity}
              color={getRarityColor(trait.rarity)}
              size="small"
            />
            {getStatusChip(trait)}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {trait.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Category: {trait.category}
              </Typography>
              {trait.sourceNpc && (
                <Typography variant="caption" color="text.secondary">
                  • Source: {trait.sourceNpc}
                </Typography>
              )}
            </Box>
            
            {isPermanentByPlayer && (
                 <Typography variant="caption" color="success.main">
                    (Permanently active)
                 </Typography>
            )}
          </Box>
          {/* Display effects */}
          {showAdvanced && trait.effects && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Effects:
              </Typography>
              <Box sx={{ ml: 1 }}>
                {Array.isArray(trait.effects) ? (
                  trait.effects.map((effect: TraitEffect, index: number) => ( // Explicitly type effect and index
                    <Typography key={index} variant="caption" display="block">
                      • {effect.type}: {effect.magnitude > 0 ? '+' : ''}{effect.magnitude}
                    </Typography>
                  ))
                ) : (
                  Object.entries(trait.effects).map(([key, value]: [string, number]) => ( // Explicitly type key and value
                    <Typography key={key} variant="caption" display="block">
                      • {key}: {value > 0 ? '+' : ''}{value}
                    </Typography>
                  ))
                )}
              </Box>
            </Box>
          )}
        </Box>
      </ListItem>
    );
  };

  // Filter acquired traits to display (excluding permanent ones, as they are displayed separately)
  // This is for traits that can be equipped/unequipped
  const displayableAcquiredTraits = acquiredTraitObjects.filter(t => !permanentTraitIds.includes(t.id));


  return (
    <Box>
      {/* Statistics Overview */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            Trait Management
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="caption">Total Acquired</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">{stats.permanent}</Typography>
                <Typography variant="caption">Permanent</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">{stats.equipped}</Typography>
                <Typography variant="caption">Equipped</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">{stats.available}</Typography>
                <Typography variant="caption">Available</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => setPresetDialogOpen(true)}
              disabled={equippedTraitIds.length === 0}
            >
              Save Preset
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={handleClearAll}
              disabled={equippedTraitIds.length === 0}
              color="warning"
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              startIcon={<OptimizeIcon />}
              disabled
              title="Auto-optimize coming soon"
            >
              Optimize
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Trait Presets */}
      {traitPresets.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon color="secondary" />
              Saved Presets ({traitPresets.length})
            </Typography>
            
            <List dense>
              {traitPresets.map((preset: TraitPreset) => ( // Explicitly type preset
                <ListItem key={preset.id} divider>
                  <ListItemText
                    primary={preset.name}
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption">
                          {preset.traits.length} traits
                        </Typography>
                        {preset.description && (
                          <Typography variant="caption" color="text.secondary">
                            • {preset.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          • {new Date(preset.created).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Load preset">
                      <IconButton 
                        edge="end" 
                        aria-label="load"
                        onClick={() => handleLoadPreset(preset.id)}
                        size="small"
                      >
                        <LoadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete preset">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          setDeleteConfirmOpen(true);
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sorting */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="info" />
            Organization & Filters
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  startAdornment={<SortIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="rarity">Rarity</MenuItem>
                  <MenuItem value="recent">Recently Discovered</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterBy}
                  label="Filter"
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  startAdornment={<CategoryIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="all">All Traits</MenuItem>
                  <MenuItem value="equipped">
                    <Badge badgeContent={stats.equipped} color="primary">
                      Equipped
                    </Badge>
                  </MenuItem>
                  <MenuItem value="unequipped">Unequipped</MenuItem>
                  <MenuItem value="permanent">
                    <Badge badgeContent={stats.permanent} color="success">
                      Permanent
                    </Badge>
                  </MenuItem>
                  <MenuItem value="temporary">Temporary</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                }
                label="Advanced View"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Trait List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acquired Traits ({filteredAndSortedTraits.length})
          </Typography>

          {filteredAndSortedTraits.length === 0 ? (
            <Alert severity="info">
              No traits match the current filter criteria.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredAndSortedTraits.map((trait) => {
                const status = getTraitStatus(trait);
                const isEquippable = status.type === 'available';
                const isUnequippable = status.type === 'equipped';

                return (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" component="h3">
                            {trait.name}
                          </Typography>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={trait.category || 'Uncategorized'}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={trait.rarity || 'Common'}
                            size="small"
                            color={
                              trait.rarity === 'legendary' ? 'warning' :
                              trait.rarity === 'epic' ? 'secondary' :
                              trait.rarity === 'rare' ? 'primary' : 'default'
                            }
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {trait.description}
                        </Typography>

                        {showAdvanced && trait.effects && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Effects:
                            </Typography>
                            <Box sx={{ ml: 1 }}>
                              {Array.isArray(trait.effects) ? (
                                trait.effects.map((effect: TraitEffect, index: number) => (
                                  <Typography key={index} variant="caption" display="block">
                                    • {effect.type}: {effect.magnitude > 0 ? '+' : ''}{effect.magnitude}
                                  </Typography>
                                ))
                              ) : (
                                Object.entries(trait.effects).map(([key, value]: [string, number]) => (
                                  <Typography key={key} variant="caption" display="block">
                                    • {key}: {value > 0 ? '+' : ''}{value}
                                  </Typography>
                                ))
                              )}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                          {isEquippable && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleToggleTrait(trait.id)}
                              fullWidth
                            >
                              Equip
                            </Button>
                          )}
                          {isUnequippable && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleToggleTrait(trait.id)}
                              fullWidth
                            >
                              Unequip
                            </Button>
                          )}
                          {status.type === 'permanent' && (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled
                              fullWidth
                            >
                              Permanent
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Save Preset Dialog */}
      <Dialog open={presetDialogOpen} onClose={() => setPresetDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Trait Preset</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Preset Name"
              fullWidth
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g., Combat Build, Social Setup"
              required
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              placeholder="Brief description of this trait configuration"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              This preset will save your current equipped traits configuration ({equippedTraitIds.length} traits).
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPresetDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePreset} 
            variant="contained"
            disabled={!presetName.trim()}
          >
            Save Preset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Preset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this preset? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePreset} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';
export default TraitManagement;
