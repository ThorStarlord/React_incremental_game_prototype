import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
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
  Grid,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  FileUpload as LoadIcon,
  Delete as DeleteIcon,
  ClearAll as ClearAllIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Star as FavoriteIcon
} from '@mui/icons-material';

import {
  selectTraits,
  selectTraitPresets,
  selectEquippedTraitObjects
} from '../../state/TraitsSelectors';
import {
  selectPermanentTraits
} from '../../../Player/state/PlayerSelectors';
import {
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset,
  equipTrait,
  unequipTrait
} from '../../state/TraitsSlice';
import type { TraitPreset, Trait } from '../../state/TraitsTypes';
import TraitCard from './TraitCard';

/**
 * Fixed props interface - only accept what parent actually passes
 */
export interface TraitManagementProps {
  currentEssence: number;
  onEquipTrait?: (traitId: string, slotIndex: number) => void;
  onUnequipTrait?: (slotIndex: number) => void;
}

type SortOption = 'name' | 'category' | 'rarity' | 'recent';
type FilterOption = 'all' | 'equipped' | 'unequipped' | 'permanent' | 'temporary';

/**
 * Enhanced trait management interface with preset support and organization
 */
export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  currentEssence,
  onEquipTrait,
  onUnequipTrait
}) => {
  const dispatch = useAppDispatch();
  const equippedTraitObjects = useAppSelector(selectEquippedTraitObjects);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const allTraits = useAppSelector(selectTraits);
  const traitPresets = useAppSelector(selectTraitPresets);

  // Calculate available slots based on default game design
  const unlockedSlotCount = useMemo(() => {
    return 6; // Default max trait slots for the player
  }, []);

  // Extract equipped trait IDs from trait objects
  const equippedTraitIds = useMemo(() => {
    return equippedTraitObjects.map(trait => trait.id);
  }, [equippedTraitObjects]);

  // Get trait objects from equipped traits (already have them)
  const acquiredTraitObjects = useMemo(() => {
    return equippedTraitObjects;
  }, [equippedTraitObjects]);

  // Local state for UI controls
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort traits
  const filteredAndSortedTraits = useMemo(() => {
    let filtered = [...acquiredTraitObjects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trait => 
        trait.name.toLowerCase().includes(query) ||
        trait.description.toLowerCase().includes(query) ||
        trait.category?.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    switch (filterBy) {
      case 'equipped':
        filtered = filtered.filter(trait => equippedTraitIds.includes(trait.id));
        break;
      case 'unequipped':
        filtered = filtered.filter(trait => 
          !equippedTraitIds.includes(trait.id) && !permanentTraitIds.includes(trait.id)
        );
        break;
      case 'permanent':
        filtered = filtered.filter(trait => permanentTraitIds.includes(trait.id));
        break;
      case 'temporary':
        filtered = filtered.filter(trait => 
          equippedTraitIds.includes(trait.id) && !permanentTraitIds.includes(trait.id)
        );
        break;
      case 'all':
      default:
        // No additional filtering
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
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          const aRarity = rarityOrder.indexOf(a.rarity?.toLowerCase() || 'common');
          const bRarity = rarityOrder.indexOf(b.rarity?.toLowerCase() || 'common');
          return bRarity - aRarity; // Highest rarity first
        case 'recent':
          const aIndex = equippedTraitIds.indexOf(a.id);
          const bIndex = equippedTraitIds.indexOf(b.id);
          return bIndex - aIndex; // Most recent first
        default:
          return 0;
      }
    });

    return filtered;
  }, [acquiredTraitObjects, searchQuery, filterBy, sortBy, equippedTraitIds, permanentTraitIds]);

  // Preset management functions
  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;

    const preset: TraitPreset = {
      id: `preset_${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || undefined,
      traits: [...equippedTraitIds], // Use trait IDs for preset
      created: Date.now()
    };

    dispatch(saveTraitPreset(preset));
    setPresetDialogOpen(false);
    setPresetName('');
    setPresetDescription('');
  }, [presetName, presetDescription, equippedTraitIds, dispatch]);

  const handleLoadPreset = useCallback((presetId: string) => {
    dispatch(loadTraitPreset(presetId));
  }, [dispatch]);

  const handleDeletePreset = useCallback(() => {
    if (selectedPresetId) {
      dispatch(deleteTraitPreset(selectedPresetId));
      setDeleteConfirmOpen(false);
      setSelectedPresetId(null);
    }
  }, [selectedPresetId, dispatch]);

  const handleClearAllEquipped = useCallback(() => {
    // TODO: Implement clear all equipped functionality when the correct action is available
    console.log('Clear all equipped functionality - to be implemented');
    
    // When the correct action is available, it might look like:
    // dispatch(clearAllPlayerEquippedTraits());
  }, []);

  // Enhanced trait toggle with proper slot management
  const handleToggleTrait = useCallback((traitId: string) => {
    if (equippedTraitIds.includes(traitId)) {
      // Find the slot index for this trait and unequip it
      const slotIndex = equippedTraitIds.indexOf(traitId);
      if (slotIndex !== -1) {
        dispatch(unequipTrait(slotIndex)); // Pass slot index directly
      }
    } else {
      // Equip the trait to an available slot
      dispatch(equipTrait({ traitId, slotIndex: -1 })); // Use TraitsSlice action
    }
  }, [equippedTraitIds, dispatch]);

  // Statistics calculations
  const stats = useMemo(() => ({
    total: acquiredTraitObjects.length,
    equipped: equippedTraitIds.length,
    permanent: permanentTraitIds.length,
    available: acquiredTraitObjects.length - permanentTraitIds.length,
    temporary: equippedTraitIds.filter((id: string) => !permanentTraitIds.includes(id)).length
  }), [acquiredTraitObjects.length, equippedTraitIds.length, permanentTraitIds.length]);

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
              onClick={handleClearAllEquipped}
              disabled={equippedTraitIds.length === 0}
              color="warning"
            >
              Clear All
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
              {traitPresets.map((preset: TraitPreset) => (
                <ListItem key={preset.id} divider>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{preset.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {preset.traits.length} traits • Created {new Date(preset.created).toLocaleDateString()}
                      {preset.description && ` • ${preset.description}`}
                    </Typography>
                  </Box>
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
              <TextField
                fullWidth
                size="small"
                label="Search Traits"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description, or category"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="rarity">Rarity</MenuItem>
                  <MenuItem value="recent">Recently Discovered</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterBy}
                  label="Filter"
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                >
                  <MenuItem value="all">All Traits</MenuItem>
                  <MenuItem value="equipped">Equipped</MenuItem>
                  <MenuItem value="unequipped">Unequipped</MenuItem>
                  <MenuItem value="permanent">Permanent</MenuItem>
                  <MenuItem value="temporary">Temporary</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
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
            Acquired Traits ({filteredAndSortedTraits.length} / {stats.total})
          </Typography>

          {filteredAndSortedTraits.length === 0 ? (
            <Alert severity="info">
              {searchQuery || filterBy !== 'all' 
                ? "No traits match the current filter criteria."
                : "No traits acquired yet. Visit NPCs to discover and acquire traits through Resonance."
              }
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredAndSortedTraits.map((trait) => (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  <TraitCard
                    trait={trait}
                    onClick={() => handleToggleTrait(trait.id)}
                    isEquipped={equippedTraitIds.includes(trait.id)}
                    isPermanent={permanentTraitIds.includes(trait.id)}
                  />
                </Grid>
              ))}
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
