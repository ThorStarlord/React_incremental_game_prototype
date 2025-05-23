import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Lock as LockIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { equipTrait, unequipTrait } from '../../state/TraitsSlice';
import { 
  selectEquippedTraits, 
  selectAcquiredTraits, 
  selectTraitSlots,
  selectAllTraits 
} from '../../state/TraitsSelectors';

interface TraitSlotsProps {
  className?: string;
}

export const TraitSlots: React.FC<TraitSlotsProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraits);
  const traitSlots = useAppSelector(selectTraitSlots);
  const allTraits = useAppSelector(selectAllTraits);

  const [isEquipDialogOpen, setIsEquipDialogOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Get available traits for equipping (acquired but not currently equipped)
  const availableTraits = acquiredTraits.filter(traitId => 
    !equippedTraits.includes(traitId)
  ).map(traitId => allTraits[traitId]).filter(Boolean);

  const handleSlotClick = useCallback((slotIndex: number) => {
    const slot = traitSlots[slotIndex];
    
    if (!slot?.isUnlocked) {
      // Show unlock requirements or do nothing for locked slots
      return;
    }

    if (slot.traitId) {
      // Slot has a trait - unequip it
      handleUnequipTrait(slot.traitId);
    } else {
      // Empty slot - show equip dialog
      setSelectedSlotIndex(slotIndex);
      setIsEquipDialogOpen(true);
    }
  }, [traitSlots]);

  const handleEquipTrait = useCallback((traitId: string) => {
    if (selectedSlotIndex !== null) {
      dispatch(equipTrait({ traitId, slotIndex: selectedSlotIndex }));
    }
    setIsEquipDialogOpen(false);
    setSelectedSlotIndex(null);
  }, [dispatch, selectedSlotIndex]);

  const handleUnequipTrait = useCallback((traitId: string) => {
    dispatch(unequipTrait(traitId));
  }, [dispatch]);

  const handleCloseEquipDialog = useCallback(() => {
    setIsEquipDialogOpen(false);
    setSelectedSlotIndex(null);
  }, []);

  const getTraitById = useCallback((traitId: string) => {
    return allTraits[traitId];
  }, [allTraits]);

  const renderSlot = useCallback((slot: any, index: number) => {
    const trait = slot.traitId ? getTraitById(slot.traitId) : null;
    const isEmpty = !trait;
    const isLocked = !slot.isUnlocked;

    return (
      <Paper
        key={`slot-${index}`}
        elevation={2}
        sx={{
          p: 2,
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: theme => {
            if (isLocked) return `1px solid ${theme.palette.divider}`;
            if (isEmpty) return `2px dashed ${theme.palette.divider}`;
            return 'none';
          },
          bgcolor: theme => {
            if (isLocked) return theme.palette.action.disabled;
            if (isEmpty) return theme.palette.action.hover;
            return theme.palette.background.paper;
          },
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            ...((!isLocked) && {
              elevation: 4,
              transform: 'translateY(-2px)',
            }),
          },
        }}
        onClick={() => handleSlotClick(index)}
      >
        {isLocked ? (
          <Box textAlign="center">
            <LockIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="caption" color="text.disabled">
              Slot Locked
            </Typography>
            {slot.unlockRequirements && (
              <Typography variant="caption" color="text.disabled" display="block">
                {slot.unlockRequirements.type === 'level' && `Level ${slot.unlockRequirements.value}`}
                {slot.unlockRequirements.type === 'essence' && `${slot.unlockRequirements.value} Essence`}
              </Typography>
            )}
          </Box>
        ) : isEmpty ? (
          <Box textAlign="center">
            <AddIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Click to Equip Trait
            </Typography>
          </Box>
        ) : (
          <Box textAlign="center" sx={{ width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom noWrap>
              {trait?.name}
            </Typography>
            <Chip
              label={trait?.category}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Click to Unequip
            </Typography>
            <Tooltip title="Unequip Trait">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnequipTrait(trait.id);
                }}
                sx={{ mt: 1 }}
                aria-label={`Unequip ${trait?.name}`}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
    );
  }, [getTraitById, handleSlotClick, handleUnequipTrait]);

  const unlockedSlots = traitSlots.filter(slot => slot.isUnlocked);

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Trait Slots ({equippedTraits.length}/{unlockedSlots.length})
      </Typography>
      
      <Grid container spacing={2}>
        {traitSlots.map((slot, index) => (
          <Grid item xs={12} sm={6} md={4} key={`grid-${index}`}>
            {renderSlot(slot, index)}
          </Grid>
        ))}
      </Grid>

      {/* Equip Trait Dialog */}
      <Dialog
        open={isEquipDialogOpen}
        onClose={handleCloseEquipDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="equip-trait-dialog-title"
      >
        <DialogTitle id="equip-trait-dialog-title">
          Select Trait to Equip
        </DialogTitle>
        <DialogContent>
          {availableTraits.length === 0 ? (
            <Alert severity="info" sx={{ mt: 1 }}>
              No traits available to equip. Acquire more traits first.
            </Alert>
          ) : (
            <List>
              {availableTraits.map((trait, index) => (
                <React.Fragment key={trait.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleEquipTrait(trait.id)}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              {trait.name}
                            </Typography>
                            <Chip 
                              label={trait.rarity} 
                              size="small" 
                              color="secondary" 
                              variant="outlined" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              Category: {trait.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {trait.description}
                            </Typography>
                            {trait.effects && typeof trait.effects === 'object' && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="primary">
                                  Effects: {Object.entries(trait.effects).map(([key, value]) => 
                                    `${key}: ${typeof value === 'number' && value > 0 ? '+' : ''}${value}`
                                  ).join(', ')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < availableTraits.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEquipDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TraitSlots;
