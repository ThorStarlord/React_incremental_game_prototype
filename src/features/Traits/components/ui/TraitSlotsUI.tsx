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
          sx={{ minHeight: 120, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }, border: 2, borderColor: 'primary.main' }}
          onClick={() => onSlotClick(slot)}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>{trait.name}</Typography>
              <Tooltip title="Suppress Trait">
                <IconButton size="small" color="error" aria-label="Unequip trait"><ClearIcon fontSize="small" /></IconButton>
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
      <Box onClick={() => onSlotClick(slot)} sx={{ cursor: 'pointer', height: '100%' }}>
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
        <Typography variant="h5" component="h2">Trait Expression</Typography>
        <Tooltip title="Express available Traits to manifest their effects. Click empty slots to express, or expressed Traits to suppress."><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip>
      </Box>

      <Grid container spacing={2}>
        {traitSlots.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
              {getSlotContent(slot)}
          </Grid>
        ))}
      </Grid>

      {/* Trait Selection Dialog */}
      <Dialog open={isTraitSelectionModalOpen} onClose={onCloseTraitSelectionModal} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Trait to Express in Slot {selectedSlotIndexForModal !== null ? selectedSlotIndexForModal + 1 : ''}</DialogTitle>
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
                <Typography sx={{p: 2, textAlign: 'center'}} color="text.secondary">No available Traits to express. Discover or assimilate new patterns.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseTraitSelectionModal}>Cancel</Button>
          <Button onClick={onConfirmEquip} variant="contained" disabled={!selectedTraitIdInModal}>Express</Button>
        </DialogActions>
      </Dialog>

      {/* Unequip Confirmation Dialog */}
      <Dialog open={unequipDialogState.open} onClose={onCloseUnequipDialog}>
        <DialogTitle>Suppress Trait</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to suppress "{unequipDialogState.trait?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseUnequipDialog}>Cancel</Button>
          <Button onClick={onConfirmUnequip} variant="contained" color="warning">Suppress</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

TraitSlotsUI.displayName = 'TraitSlotsUI';

export default TraitSlotsUI;
