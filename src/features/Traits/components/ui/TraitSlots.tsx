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
  Star as StarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

/**
 * Props for the TraitSlots component
 */
export interface TraitSlotsProps {
  // Data
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  availableTraits: Trait[];
  
  // Actions
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  onUnequipTrait: (slotId: string) => void;
}

/**
 * Presentational component for trait slot management
 * Provides click-based interactions for equipping and unequipping traits
 */
export const TraitSlots: React.FC<TraitSlotsProps> = React.memo(({
  traitSlots,
  equippedTraits,
  availableTraits,
  onEquipTrait,
  onUnequipTrait
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [unequipDialog, setUnequipDialog] = React.useState<{
    open: boolean;
    trait?: Trait;
    slotId?: string;
  }>({ open: false });

  const handleSlotClick = useCallback((slot: TraitSlot, index: number) => {
    if (!slot.isUnlocked) return;
    
    if (slot.traitId) {
      // Slot has a trait - show unequip confirmation
      const equippedTrait = equippedTraits.find(t => t.id === slot.traitId);
      if (equippedTrait) {
        setUnequipDialog({
          open: true,
          trait: equippedTrait,
          slotId: slot.id
        });
      }
    } else {
      // Empty slot - show trait selection
      setSelectedSlotIndex(index);
    }
  }, [equippedTraits]);

  const handleTraitSelect = useCallback((traitId: string) => {
    if (selectedSlotIndex !== null) {
      onEquipTrait(traitId, selectedSlotIndex);
      setSelectedSlotIndex(null);
    }
  }, [selectedSlotIndex, onEquipTrait]);

  const handleUnequipConfirm = useCallback(() => {
    if (unequipDialog.slotId) {
      onUnequipTrait(unequipDialog.slotId);
    }
    setUnequipDialog({ open: false });
  }, [unequipDialog.slotId, onUnequipTrait]);

  const getSlotContent = (slot: TraitSlot) => {
    if (!slot.isUnlocked) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: 2,
            border: 2,
            borderColor: 'grey.300',
            borderStyle: 'dashed',
            borderRadius: 1,
            bgcolor: 'grey.50',
            minHeight: 120,
            justifyContent: 'center'
          }}
        >
          <LockIcon color="disabled" />
          <Typography variant="caption" color="text.disabled" align="center">
            {slot.unlockRequirements ? (
              `Unlock: ${slot.unlockRequirements.type} ${slot.unlockRequirements.value}`
            ) : (
              'Locked'
            )}
          </Typography>
        </Box>
      );
    }

    if (slot.traitId) {
      const trait = equippedTraits.find(t => t.id === slot.traitId);
      if (!trait) return null;

      return (
        <Card
          sx={{
            minHeight: 120,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            border: 2,
            borderColor: 'primary.main'
          }}
          onClick={() => handleSlotClick(slot, slot.index)}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                {trait.name}
              </Typography>
              <IconButton size="small" color="error" aria-label="Unequip trait">
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
            <Chip
              label={trait.rarity}
              size="small"
              color={getRarityColor(trait.rarity)}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {trait.description.length > 60 
                ? `${trait.description.substring(0, 60)}...`
                : trait.description
              }
            </Typography>
          </CardContent>
        </Card>
      );
    }

    // Empty slot
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          p: 2,
          border: 2,
          borderColor: 'grey.400',
          borderStyle: 'dashed',
          borderRadius: 1,
          bgcolor: 'background.paper',
          minHeight: 120,
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50'
          }
        }}
        onClick={() => handleSlotClick(slot, slot.index)}
      >
        <AddIcon color="action" />
        <Typography variant="caption" color="text.secondary" align="center">
          Click to equip trait
        </Typography>
      </Box>
    );
  };

  const getRarityColor = (rarity: string) => {
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
        <Typography variant="h5" component="h2">
          Trait Slots
        </Typography>
        <Tooltip title="Equip traits to gain their effects. Click empty slots to equip, click equipped traits to unequip.">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {traitSlots.length === 0 ? (
        <Alert severity="info">
          No trait slots available. Unlock slots by leveling up or earning Essence.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {traitSlots.map((slot, index) => (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Slot {index + 1}
                </Typography>
                {getSlotContent(slot)}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Trait Selection Dialog */}
      <Dialog
        open={selectedSlotIndex !== null}
        onClose={() => setSelectedSlotIndex(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Trait to Equip
        </DialogTitle>
        <DialogContent>
          {getAvailableTraitsForSlot().length === 0 ? (
            <Alert severity="info">
              No traits available to equip. Acquire traits from NPCs or other sources.
            </Alert>
          ) : (
            <List>
              {getAvailableTraitsForSlot().map((trait) => (
                <ListItem key={trait.id} disablePadding>
                  <ListItemButton onClick={() => handleTraitSelect(trait.id)}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{trait.name}</Typography>
                          <Chip
                            label={trait.rarity}
                            size="small"
                            color={getRarityColor(trait.rarity)}
                          />
                        </Box>
                      }
                      secondary={trait.description}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSlotIndex(null)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unequip Confirmation Dialog */}
      <Dialog
        open={unequipDialog.open}
        onClose={() => setUnequipDialog({ open: false })}
      >
        <DialogTitle>
          Unequip Trait
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unequip "{unequipDialog.trait?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The trait will remain in your collection and can be re-equipped later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnequipDialog({ open: false })}>
            Cancel
          </Button>
          <Button onClick={handleUnequipConfirm} variant="contained" color="warning">
            Unequip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

TraitSlots.displayName = 'TraitSlots';

export default TraitSlots;
