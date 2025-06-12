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
} from '../../state/TraitsSelectors';
import {
  selectEquippedTraits,
  selectPermanentTraits
} from '../../../Player/state/PlayerSelectors';
// FIXED: Import actions that expect specific payload shapes
import {
  saveTraitPreset,
  loadTraitPreset,
  deleteTraitPreset
} from '../../state/TraitsSlice';
// FIXED: Import equip/unequip from the correct PlayerSlice
import {
  equipTrait,
  unequipTrait
} from '../../../Player/state/PlayerSlice';
import type { TraitPreset, Trait } from '../../state/TraitsTypes';
import TraitCard from './TraitCard';

export interface TraitManagementProps {
  currentEssence: number;
  onEquipTrait?: (traitId: string, slotIndex: number) => void;
  onUnequipTrait?: (slotIndex: number) => void;
}

type SortOption = 'name' | 'category' | 'rarity' | 'recent';
type FilterOption = 'all' | 'equipped' | 'unequipped' | 'permanent' | 'temporary';

export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  currentEssence
}) => {
  const dispatch = useAppDispatch();
  const equippedTraitObjects = useAppSelector(selectEquippedTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const traitPresets = useAppSelector(selectTraitPresets);

  const equippedTraitIds = useMemo(() => {
    return equippedTraitObjects.map(trait => trait.id);
  }, [equippedTraitObjects]);

  const acquiredTraitObjects = useMemo(() => {
    return equippedTraitObjects;
  }, [equippedTraitObjects]);

  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedTraits = useMemo(() => {
    let filtered = [...acquiredTraitObjects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trait =>
        trait.name.toLowerCase().includes(query) ||
        trait.description.toLowerCase().includes(query) ||
        trait.category?.toLowerCase().includes(query)
      );
    }

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
      default:
        break;
    }

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
          return bRarity - aRarity;
        case 'recent':
          const aIndex = equippedTraitIds.indexOf(a.id);
          const bIndex = equippedTraitIds.indexOf(b.id);
          return bIndex - aIndex;
        default:
          return 0;
      }
    });

    return filtered;
  }, [acquiredTraitObjects, searchQuery, filterBy, sortBy, equippedTraitIds, permanentTraitIds]);

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;

    const preset: TraitPreset = {
      id: `preset_${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || undefined,
      traits: [...equippedTraitIds],
      created: Date.now()
    };
    // FIXED: Dispatching with the correct payload shape
    dispatch(saveTraitPreset({ preset }));
    setPresetDialogOpen(false);
    setPresetName('');
    setPresetDescription('');
  }, [presetName, presetDescription, equippedTraitIds, dispatch]);

  const handleLoadPreset = useCallback((presetId: string) => {
    // FIXED: Dispatching with the correct payload shape
    dispatch(loadTraitPreset({ presetId }));
  }, [dispatch]);

  const handleDeletePreset = useCallback(() => {
    if (selectedPresetId) {
      // FIXED: Dispatching with the correct payload shape
      dispatch(deleteTraitPreset({ presetId: selectedPresetId }));
      setDeleteConfirmOpen(false);
      setSelectedPresetId(null);
    }
  }, [selectedPresetId, dispatch]);

  const handleClearAllEquipped = useCallback(() => {
    console.log('Clear all equipped functionality - to be implemented');
  }, []);

  const handleToggleTrait = useCallback((traitId: string) => {
    const equippedSlotIndex = equippedTraitObjects.findIndex(trait => trait.id === traitId);

    if (equippedSlotIndex !== -1) {
      dispatch(unequipTrait({ slotIndex: equippedSlotIndex }));
    } else {
      dispatch(equipTrait({ traitId, slotIndex: -1 }));
    }
  }, [equippedTraitObjects, dispatch]);

  const stats = useMemo(() => ({
    total: acquiredTraitObjects.length,
    equipped: equippedTraitIds.length,
    permanent: permanentTraitIds.length,
    available: acquiredTraitObjects.length - permanentTraitIds.length,
    temporary: equippedTraitIds.filter((id: string) => !permanentTraitIds.includes(id)).length
  }), [acquiredTraitObjects.length, equippedTraitIds.length, permanentTraitIds.length]);

  return (
    <Box>
      {/* ... (rest of the JSX code remains the same, but the TraitCard onClick is now fixed) ... */}
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
      
      {traitPresets.length > 0 && (
        <Card sx={{ mb: 2 }}>
          {/* ... (preset list JSX remains the same) ... */}
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        {/* ... (filters JSX remains the same) ... */}
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acquired Traits ({filteredAndSortedTraits.length} / {stats.total})
          </Typography>
          {filteredAndSortedTraits.length === 0 ? (
            <Alert severity="info">
              {/* ... (alert JSX remains the same) ... */}
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredAndSortedTraits.map((trait) => (
                <Grid item xs={12} sm={6} md={4} key={trait.id}>
                  {/* FIXED: Removed the invalid `onClick` prop from TraitCard */}
                  <TraitCard
                    trait={trait}
                    showUnequipButton={equippedTraitIds.includes(trait.id)}
                    onUnequip={() => handleToggleTrait(trait.id)}
                    showMakePermanentButton={false} // This functionality is deprecated here
                    currentEssence={currentEssence}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* ... (dialogs JSX remains the same) ... */}
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';
export default TraitManagement;