import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Clear as ClearIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';
import EmptySlotCard from './EmptySlotCard';
import LockedSlotCard from './LockedSlotCard';

// The props interface is now larger, as it receives all state and handlers from the container
export interface TraitSlotsUIProps {
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  availableTraits: Trait[];
  canManageSlots: boolean;
  isLoading: boolean;
  error: string | null;

  // State and handlers for the trait selection modal
  isTraitSelectionModalOpen: boolean;
  selectedSlotIndexForModal: number | null;
  selectedTraitIdInModal: string | null;
  onOpenTraitSelectionModal: (slotIndex: number) => void;
  onCloseTraitSelectionModal: () => void;
  onSelectTraitInModal: (traitId: string) => void;
  onConfirmEquip: () => void;

  // State and handlers for the unequip confirmation dialog
  unequipDialogState: { open: boolean; trait?: Trait; slotIndex?: number };
  onOpenUnequipDialog: (trait: Trait, slotIndex: number) => void;
  onConfirmUnequip: () => void;
  onCloseUnequipDialog: () => void;

  // General click handler for a slot
  onSlotClick: (slot: TraitSlot) => void;
}

export const TraitSlotsUI: React.FC<TraitSlotsUIProps> = React.memo(({
  traitSlots,
  equippedTraits,
  availableTraits,
  canManageSlots,
  isLoading,
  error,
  isTraitSelectionModalOpen,
  selectedSlotIndexForModal,
  selectedTraitIdInModal,
  onOpenTraitSelectionModal,
  onCloseTraitSelectionModal,
  onSelectTraitInModal,
  onConfirmEquip,
  unequipDialogState,
  onOpenUnequipDialog,
  onConfirmUnequip,
  onCloseUnequipDialog,
  onSlotClick,
}) => {
  const getSlotContent = (slot: TraitSlot) => {
    if (slot.isLocked) {
      return (
        <LockedSlotCard slotIndex={slot.slotIndex} unlockRequirement={slot.unlockRequirement} />
      );
    }

    const trait = equippedTraits.find(t => t.id === slot.traitId);
    if (trait) {
       return (
        <Card
          sx={{ minHeight: 120, cursor: canManageSlots ? 'pointer' : 'not-allowed', transition: 'all 0.2s', '&:hover': { transform: canManageSlots ? 'translateY(-2px)' : 'none', boxShadow: canManageSlots ? 3 : 'none' }, border: 2, borderColor: 'primary.main' }}
          onClick={() => onSlotClick(slot)}
          role="button"
          tabIndex={canManageSlots ? 0 : -1}
          aria-disabled={!canManageSlots}
          aria-label={`Manage ${trait.name} in trait slot ${slot.slotIndex + 1}`}
          onKeyDown={(event) => {
            if (canManageSlots && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              onSlotClick(slot);
            }
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>{trait.name}</Typography>
              <Tooltip title="Unequip Trait">
                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Unequip ${trait.name}`}
                  disabled={!canManageSlots}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSlotClick(slot);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Chip label={trait.rarity} size="small" color={getRarityColor(trait.rarity)} sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{trait.description.length > 60 ? `${trait.description.substring(0, 60)}...` : trait.description}</Typography>
          </CardContent>
        </Card>
      );
    }
    
    // Render an empty, clickable slot
    return (
      <Box
        onClick={() => onSlotClick(slot)}
        onKeyDown={(event) => {
          if (canManageSlots && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onSlotClick(slot);
          }
        }}
        role="button"
        tabIndex={canManageSlots ? 0 : -1}
        aria-disabled={!canManageSlots}
        aria-label={`Equip a trait in slot ${slot.slotIndex + 1}`}
        sx={{ cursor: canManageSlots ? 'pointer' : 'not-allowed', height: '100%' }}
      >
        <EmptySlotCard />
      </Box>
    );
  };

  const getRarityColor = (rarity: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'error';
      case 'epic': return 'secondary';
      case 'rare': return 'primary';
      default: return 'default';
    }
  };

  if (isLoading) {
      return <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}><CircularProgress /></Box>
  }

  if (error) {
      return <Alert severity="error">Error loading trait data: {error}</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" component="h2">Trait Slots</Typography>
        <Tooltip title="Equip traits to gain their effects. Click empty slots to equip, or equipped traits to unequip.">
          <IconButton size="small" aria-label="Trait slot help">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {!canManageSlots && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Trait slot management is unavailable while Trait data is loading.
        </Alert>
      )}

      <Grid container spacing={2}>
        {traitSlots.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
              {getSlotContent(slot)}
          </Grid>
        ))}
      </Grid>

      {/* Trait Selection Dialog */}
      <Dialog open={isTraitSelectionModalOpen} onClose={onCloseTraitSelectionModal} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Trait for Slot {selectedSlotIndexForModal !== null ? selectedSlotIndexForModal + 1 : ''}</DialogTitle>
        <Typography variant="body2" color="text.secondary" sx={{ px: 3 }}>
          Preview the discovered Trait below. Equipping occupies this slot; permanent Traits remain active without slots.
        </Typography>
        <DialogContent>
          <List>
            {availableTraits.length > 0 ? (
              availableTraits.map((trait) => (
              <ListItem key={trait.id} disablePadding>
                <ListItemButton 
                  onClick={() => onSelectTraitInModal(trait.id)}
                  selected={selectedTraitIdInModal === trait.id}
                >
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="subtitle1">{trait.name}</Typography><Chip label={trait.rarity} size="small" color={getRarityColor(trait.rarity)} /></Box>}
                    secondary={trait.description}
                  />
                </ListItemButton>
              </ListItem>
            ))
            ) : (
                <Typography sx={{p: 2, textAlign: 'center'}} color="text.secondary">No available traits to equip. Learn new traits from NPCs.</Typography>
            )}
          </List>
          {selectedTraitIdInModal && (() => {
            const chosen = availableTraits.find(trait => trait.id === selectedTraitIdInModal);
            if (!chosen) return null;
            const effectSummary = Array.isArray(chosen.effects)
              ? chosen.effects.map(effect => `${effect.type.replace(/_/g, ' ')}: ${effect.magnitude >= 0 ? '+' : ''}${effect.magnitude}`)
              : Object.entries(chosen.effects).map(([name, value]) => `${name.replace(/_/g, ' ')}: ${value >= 0 ? '+' : ''}${value}`);
            return (
              <Alert severity="info" sx={{ mt: 2 }} data-testid="trait-slot-before-after">
                <Typography variant="subtitle2">Slot preview (before → after)</Typography>
                <Typography variant="body2">
                  Before: empty slot. After: {chosen.name} equipped.
                </Typography>
                <Typography variant="body2">Listed Trait effects: {effectSummary.join('; ') || 'No numeric modifiers listed'}.</Typography>
                <Typography variant="caption" display="block">
                  This is a preview of Trait definitions, not a prediction of final character statistics.
                </Typography>
                {chosen.essenceCost !== undefined && (
                  <Typography variant="caption" display="block">
                    Equipping is not the permanent Resonance purchase ({chosen.essenceCost} Essence).
                  </Typography>
                )}
              </Alert>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseTraitSelectionModal}>Cancel</Button>
          <Button onClick={onConfirmEquip} variant="contained" disabled={!selectedTraitIdInModal}>Equip</Button>
        </DialogActions>
      </Dialog>

      {/* Unequip Confirmation Dialog */}
      <Dialog open={unequipDialogState.open} onClose={onCloseUnequipDialog}>
        <DialogTitle>Unequip Trait</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to unequip "{unequipDialogState.trait?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseUnequipDialog}>Cancel</Button>
          <Button onClick={onConfirmUnequip} variant="contained" color="warning" disabled={!canManageSlots}>Unequip</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

TraitSlotsUI.displayName = 'TraitSlotsUI';

export default TraitSlotsUI;
