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
  AlertTitle,
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
  Stack,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  FileUpload as LoadIcon,
  Delete as DeleteIcon,
  ClearAll as ClearAllIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Star,
  Psychology,
  Lock
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        Trait Management
      </Typography>

      {/* Current Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip 
              icon={<Star />}
              label={`Current Essence: ${currentEssence}`}
              color="primary"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Essence is used for trait acquisition and permanent trait unlocking.
          </Typography>
        </CardContent>
      </Card>

      {/* Trait Acquisition */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology />
            Trait Acquisition
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Acquire new traits through NPC interactions and Resonance mechanics.
          </Typography>
          <Button
            variant="outlined"
            disabled
            startIcon={<Lock />}
            sx={{ mb: 1 }}
          >
            Browse Available Traits
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            Visit NPCs to discover and acquire new traits through interaction.
          </Typography>
        </CardContent>
      </Card>

      {/* Trait Permanence */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trait Permanence
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Make acquired traits permanent to free up active trait slots.
          </Typography>
          <Button
            variant="outlined"
            disabled
            startIcon={<Lock />}
            sx={{ mb: 1 }}
          >
            Manage Permanent Traits
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            Permanent traits provide benefits without occupying active slots.
          </Typography>
        </CardContent>
      </Card>

      {/* Development Status */}
      <Alert severity="info">
        <AlertTitle>Feature Development Status</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>✅ Implemented:</strong> Basic trait slot management, trait discovery system
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>🔄 In Progress:</strong> Advanced trait acquisition, permanence system integration
        </Typography>
        <Typography variant="body2">
          <strong>📋 Planned:</strong> Trait combinations, advanced trait effects, trait crafting
        </Typography>
      </Alert>
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';
export default TraitManagement;