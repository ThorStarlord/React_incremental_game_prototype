import React, { useCallback } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Lock as LockIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

export interface TraitSlotsProps {
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  availableTraits: Trait[];
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotIndex: number) => void;
  isInProximityToNPC: boolean;
}

export const TraitSlots: React.FC<TraitSlotsProps> = React.memo(({
  traitSlots,
  equippedTraits,
  availableTraits,
  onEquipTrait,
  onUnequipTrait,
  isInProximityToNPC
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [unequipDialog, setUnequipDialog] = React.useState<{ open: boolean; trait?: Trait; slotIndex?: number; }>({ open: false });

  const handleSlotClick = useCallback((slot: TraitSlot) => {
    if (!isInProximityToNPC || slot.isLocked) return;

    if (slot.traitId) {
      const equippedTrait = equippedTraits.find(t => t.id === slot.traitId);
      if (equippedTrait) {
        setUnequipDialog({ open: true, trait: equippedTrait, slotIndex: slot.slotIndex });
      }
    } else {
      setSelectedSlotIndex(slot.slotIndex);
    }
  }, [equippedTraits, isInProximityToNPC]);

  const handleTraitSelect = useCallback((traitId: string) => {
    if (selectedSlotIndex !== null) {
      onEquipTrait(traitId, selectedSlotIndex);
      setSelectedSlotIndex(null);
    }
  }, [selectedSlotIndex, onEquipTrait]);

  const handleUnequipConfirm = useCallback(() => {
    if (unequipDialog.slotIndex !== undefined) {
      onUnequipTrait(unequipDialog.slotIndex);
    }
    setUnequipDialog({ open: false });
  }, [unequipDialog.slotIndex, onUnequipTrait]);

  const getSlotContent = (slot: TraitSlot) => {
    // FIXED: Using correct property names `isLocked` and `unlockRequirement`
    if (slot.isLocked) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2, border: 2, borderColor: 'grey.300', borderStyle: 'dashed', borderRadius: 1, bgcolor: 'grey.50', minHeight: 120, justifyContent: 'center' }}>
          <LockIcon color="disabled" />
          <Typography variant="caption" color="text.disabled" align="center">
            {slot.unlockRequirement ? `Unlock: ${slot.unlockRequirement}` : 'Locked'}
          </Typography>
        </Box>
      );
    }

    if (slot.traitId) {
      const trait = equippedTraits.find(t => t.id === slot.traitId);
      if (!trait) return null;

      return (
        <Card
          sx={{ minHeight: 120, cursor: isInProximityToNPC ? 'pointer' : 'not-allowed', transition: 'all 0.2s', '&:hover': { transform: isInProximityToNPC ? 'translateY(-2px)' : 'none', boxShadow: isInProximityToNPC ? 3 : 'none' }, border: 2, borderColor: 'primary.main' }}
          // FIXED: Using `slot` directly
          onClick={() => handleSlotClick(slot)}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>{trait.name}</Typography>
              <IconButton size="small" color="error" aria-label="Unequip trait" disabled={!isInProximityToNPC}><ClearIcon fontSize="small" /></IconButton>
            </Box>
            <Chip label={trait.rarity} size="small" color={getRarityColor(trait.rarity)} sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{trait.description.length > 60 ? `${trait.description.substring(0, 60)}...` : trait.description}</Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2, border: 2, borderColor: 'grey.400', borderStyle: 'dashed', borderRadius: 1, bgcolor: 'background.paper', minHeight: 120, justifyContent: 'center', cursor: isInProximityToNPC ? 'pointer' : 'not-allowed', transition: 'all 0.2s', '&:hover': { borderColor: isInProximityToNPC ? 'primary.main' : 'grey.400', bgcolor: isInProximityToNPC ? 'primary.50' : 'background.paper' } }}
        // FIXED: Using `slot` directly
        onClick={() => handleSlotClick(slot)}
      >
        <AddIcon color={isInProximityToNPC ? "action" : "disabled"} />
        <Typography variant="caption" color="text.secondary" align="center">{isInProximityToNPC ? 'Click to equip trait' : 'Must be near an NPC'}</Typography>
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

  const getAvailableTraitsForSlot = () => {
    const equippedTraitIds = equippedTraits.map(t => t.id);
    return availableTraits.filter(trait => !equippedTraitIds.includes(trait.id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" component="h2">Trait Slots</Typography>
        <Tooltip title="Equip traits to gain their effects. Click empty slots to equip, click equipped traits to unequip."><IconButton size="small"><InfoIcon fontSize="small" /></IconButton></Tooltip>
      </Box>

      {!isInProximityToNPC && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must be in close proximity to an NPC to manage your trait slots.
        </Alert>
      )}

      <Grid container spacing={2}>
        {traitSlots.map((slot) => (
          // FIXED: Using correct property `slotIndex` for the key
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Slot {slot.slotIndex + 1}</Typography>
              {getSlotContent(slot)}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={selectedSlotIndex !== null} onClose={() => setSelectedSlotIndex(null)} maxWidth="md" fullWidth>
        <DialogTitle>Select Trait to Equip</DialogTitle>
        <DialogContent>
          <List>
            {getAvailableTraitsForSlot().map((trait) => (
              <ListItem key={trait.id} disablePadding>
                <ListItemButton onClick={() => handleTraitSelect(trait.id)} disabled={!isInProximityToNPC}>
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="subtitle1">{trait.name}</Typography><Chip label={trait.rarity} size="small" color={getRarityColor(trait.rarity)} /></Box>}
                    secondary={trait.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSlotIndex(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={unequipDialog.open} onClose={() => setUnequipDialog({ open: false })}>
        <DialogTitle>Unequip Trait</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to unequip "{unequipDialog.trait?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnequipDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleUnequipConfirm} variant="contained" color="warning" disabled={!isInProximityToNPC}>Unequip</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

TraitSlots.displayName = 'TraitSlots';

export default TraitSlots;