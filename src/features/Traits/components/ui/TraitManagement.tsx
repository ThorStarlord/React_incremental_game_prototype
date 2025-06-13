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
  Chip,
  Divider
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
  Lock,
  TrendingUp
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
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<Star />}
                label={`Current Essence: ${currentEssence}`}
                color="primary"
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<Psychology />}
                label="Trait System: Active"
                color="success"
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary">
            Essence is used for trait acquisition through Resonance with NPCs and trait permanence operations.
          </Typography>
        </CardContent>
      </Card>

      {/* Trait Acquisition Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology />
            Trait Acquisition (Resonance)
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Acquire new traits permanently through Resonance with NPCs. Visit NPCs and use their Traits tab to resonate with available traits.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>How Resonance Works</AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Visit an NPC through the NPCs navigation tab
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Open the NPC's "Traits" tab to see available traits for Resonance
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Pay the Essence cost to permanently acquire the trait
            </Typography>
            <Typography variant="body2">
              • Permanent traits are always active and don't require trait slots
            </Typography>
          </Alert>

          <Button
            variant="outlined"
            disabled
            startIcon={<Lock />}
            sx={{ mb: 1 }}
          >
            Browse Available Traits (Visit NPCs)
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            Trait acquisition is handled through NPC interaction interfaces.
          </Typography>
        </CardContent>
      </Card>

      {/* Trait Slot Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp />
            Trait Slot Management
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Manage your active trait slots for temporary trait effects. Use the "Slots" tab to equip and unequip traits.
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Slot Management Features</AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Click empty slots to equip available traits
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Click equipped traits to unequip them
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Locked slots can be unlocked through progression
            </Typography>
            <Typography variant="body2">
              • Permanent traits don't require slots and are always active
            </Typography>
          </Alert>

          <Button
            variant="outlined"
            disabled
            startIcon={<Lock />}
            sx={{ mb: 1 }}
          >
            Advanced Slot Management (Future)
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            Advanced slot features are planned for future implementation.
          </Typography>
        </CardContent>
      </Card>

      {/* Trait Enhancement */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trait Enhancement & Synergies
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Advanced trait mechanics including trait combinations, enhancement effects, and synergy bonuses.
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Planned Features</AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Trait combination effects for equipped trait sets
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Enhancement using Essence to improve trait effectiveness
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Synergy bonuses between related traits
            </Typography>
            <Typography variant="body2">
              • Advanced trait crafting and modification systems
            </Typography>
          </Alert>

          <Button
            variant="outlined"
            disabled
            startIcon={<Lock />}
            sx={{ mb: 1 }}
          >
            Trait Enhancement Laboratory
          </Button>
          <Typography variant="caption" display="block" color="text.secondary">
            Enhancement features are planned for future implementation.
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Development Status */}
      <Alert severity="info">
        <AlertTitle>Trait System Development Status</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>✅ Implemented:</strong> Basic trait slot management, trait discovery system, NPC Resonance interface
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>🔄 Active:</strong> Trait acquisition through NPC Resonance, slot-based trait management, trait sharing with NPCs
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>📋 Planned:</strong> Advanced trait combinations, enhancement systems, synergy mechanics, trait crafting
        </Typography>
        <Typography variant="body2">
          <strong>🎯 Future:</strong> Dynamic trait evolution, player-created traits, advanced trait interaction systems
        </Typography>
      </Alert>
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';
export default TraitManagement;