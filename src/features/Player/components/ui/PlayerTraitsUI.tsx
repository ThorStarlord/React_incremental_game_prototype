import React, { useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tooltip,
  IconButton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Star as StarIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  AutoAwesome as TraitIcon,
  Assignment as SlotIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  selectEquippedTraits,
  selectAcquiredTraits,
  selectTraitSlots,
  selectTraitById,
  selectCanEquipTrait,
} from '../../../Traits/state/TraitsSelectors';
import {
  equipTrait,
  unequipTrait,
  unlockTraitSlot,
} from '../../../Traits/state/TraitsSlice';

/**
 * Interface for trait slot display
 */
interface TraitSlotInfo {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
  unlockRequirements?: {
    type: string;
    value: any;
  };
}

/**
 * PlayerTraits component provides trait management interface within the character page
 * 
 * Features:
 * - Visual trait slot grid with locked/empty/equipped states
 * - Quick trait equipping from available traits
 * - Trait information display with descriptions and effects
 * - Integration with existing trait system state management
 * - Accessible interaction patterns following established conventions
 */
export const PlayerTraits: React.FC = React.memo(() => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // Selectors
  const equippedTraits = useAppSelector(selectEquippedTraits);
  const acquiredTraits = useAppSelector(selectAcquiredTraits);
  const traitSlots = useAppSelector(selectTraitSlots);
  
  // Local state for trait selection dialog
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [traitDialogOpen, setTraitDialogOpen] = React.useState(false);
  const [traitInfoDialog, setTraitInfoDialog] = React.useState<string | null>(null);

  /**
   * Get available traits that can be equipped (acquired but not currently equipped)
   */
  const availableTraits = useMemo(() => {
    return acquiredTraits.filter(traitId => !equippedTraits.includes(traitId));
  }, [acquiredTraits, equippedTraits]);

  /**
   * Handle trait slot click for equipping/unequipping
   */
  const handleSlotClick = useCallback((slot: TraitSlotInfo) => {
    if (!slot.isUnlocked) {
      // Show unlock requirements
      return;
    }

    if (slot.traitId) {
      // Unequip the trait
      dispatch(unequipTrait({ slotIndex: slot.index }));
    } else {
      // Open trait selection dialog
      setSelectedSlotIndex(slot.index);
      setTraitDialogOpen(true);
    }
  }, [dispatch]);

  /**
   * Handle trait selection from dialog
   */
  const handleTraitSelect = useCallback((traitId: string) => {
    if (selectedSlotIndex !== null) {
      dispatch(equipTrait({ 
        traitId, 
        slotIndex: selectedSlotIndex 
      }));
    }
    setTraitDialogOpen(false);
    setSelectedSlotIndex(null);
  }, [dispatch, selectedSlotIndex]);

  /**
   * Handle quick equip from available traits list
   */
  const handleQuickEquip = useCallback((traitId: string) => {
    // Find first available slot
    const availableSlot = traitSlots.find(slot => slot.isUnlocked && !slot.traitId);
    if (availableSlot) {
      dispatch(equipTrait({ 
        traitId, 
        slotIndex: availableSlot.index 
      }));
    }
  }, [dispatch, traitSlots]);

  /**
   * Handle slot unlock attempt
   */
  const handleUnlockSlot = useCallback((slotIndex: number) => {
    dispatch(unlockTraitSlot({ slotIndex }));
  }, [dispatch]);

  /**
   * Render individual trait slot
   */
  const renderTraitSlot = useCallback((slot: TraitSlotInfo) => {
    const trait = slot.traitId ? useAppSelector(state => selectTraitById(state, slot.traitId!)) : null;
    const isLocked = !slot.isUnlocked;
    const isEmpty = slot.isUnlocked && !slot.traitId;
    const isEquipped = slot.isUnlocked && !!slot.traitId;

    return (
      <Card 
        key={slot.id}
        sx={{
          height: 120,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: isEquipped ? `2px solid ${theme.palette.primary.main}` : 
                  isEmpty ? `2px dashed ${theme.palette.divider}` :
                  `1px solid ${theme.palette.divider}`,
          backgroundColor: isLocked ? alpha(theme.palette.action.disabled, 0.1) :
                          isEmpty ? alpha(theme.palette.primary.main, 0.05) :
                          'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': !isLocked ? {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          } : {},
        }}
        onClick={() => handleSlotClick(slot)}
      >
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: theme.spacing(1),
        }}>
          {isLocked ? (
            <>
              <LockIcon sx={{ fontSize: 32, color: 'action.disabled', marginBottom: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Slot {slot.index + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {slot.unlockRequirements?.type === 'level' 
                  ? `Unlock at level ${slot.unlockRequirements.value}`
                  : 'Locked'
                }
              </Typography>
            </>
          ) : isEmpty ? (
            <>
              <AddIcon sx={{ fontSize: 32, color: 'primary.main', marginBottom: 1 }} />
              <Typography variant="caption" color="primary.main">
                Empty Slot
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click to equip
              </Typography>
            </>
          ) : trait ? (
            <>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main, 
                marginBottom: 1,
                width: 40,
                height: 40,
              }}>
                <StarIcon />
              </Avatar>
              <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
                {trait.name}
              </Typography>
              <Chip 
                label={trait.rarity} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ marginTop: 0.5 }}
              />
              <Tooltip title="Click to unequip">
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 4, right: 4 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(unequipTrait({ slotIndex: slot.index }));
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : null}
        </CardContent>
      </Card>
    );
  }, [theme, dispatch, handleSlotClick]);

  /**
   * Render available trait item
   */
  const renderAvailableTrait = useCallback((traitId: string) => {
    const trait = useAppSelector(state => selectTraitById(state, traitId));
    const canEquip = useAppSelector(state => selectCanEquipTrait(state, traitId));
    
    if (!trait) return null;

    return (
      <ListItem
        key={traitId}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          marginBottom: 1,
        }}
        secondaryAction={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View trait details">
              <IconButton 
                edge="end" 
                onClick={() => setTraitInfoDialog(traitId)}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              disabled={!canEquip}
              onClick={() => handleQuickEquip(traitId)}
              startIcon={<AddIcon />}
            >
              Equip
            </Button>
          </Box>
        }
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2">{trait.name}</Typography>
              <Chip 
                label={trait.rarity} 
                size="small" 
                color="secondary"
                variant="outlined"
              />
            </Box>
          }
          secondary={
            <Typography variant="body2" color="text.secondary" noWrap>
              {trait.description}
            </Typography>
          }
        />
      </ListItem>
    );
  }, [theme, handleQuickEquip]);

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      {/* Equipped Traits Section */}
      <Card sx={{ marginBottom: theme.spacing(3) }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SlotIcon color="primary" />
              <Typography variant="h6">Equipped Traits</Typography>
            </Box>
          }
          subheader={`${equippedTraits.length} / ${traitSlots.filter(s => s.isUnlocked).length} slots used`}
        />
        <CardContent>
          <Grid container spacing={2}>
            {traitSlots.map((slot) => (
              <Grid item xs={6} md={4} key={slot.id}>
                {renderTraitSlot(slot)}
              </Grid>
            ))}
          </Grid>
          
          {traitSlots.filter(s => !s.isUnlocked).length > 0 && (
            <Alert severity="info" sx={{ marginTop: 2 }}>
              <Typography variant="body2">
                {traitSlots.filter(s => !s.isUnlocked).length} trait slots remain locked. 
                Continue progressing to unlock more slots!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Available Traits Section */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TraitIcon color="secondary" />
              <Typography variant="h6">Available Traits</Typography>
            </Box>
          }
          subheader={`${availableTraits.length} traits ready to equip`}
        />
        <CardContent>
          {availableTraits.length > 0 ? (
            <List sx={{ padding: 0 }}>
              {availableTraits.map(renderAvailableTrait)}
            </List>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                No traits available to equip. Visit the Traits section to discover and acquire new traits!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Trait Selection Dialog */}
      <Dialog
        open={traitDialogOpen}
        onClose={() => setTraitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Trait to Equip</DialogTitle>
        <DialogContent>
          <List>
            {availableTraits.map((traitId) => {
              const trait = useAppSelector(state => selectTraitById(state, traitId));
              if (!trait) return null;
              
              return (
                <ListItemButton
                  key={traitId}
                  onClick={() => handleTraitSelect(traitId)}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    marginBottom: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{trait.name}</Typography>
                        <Chip 
                          label={trait.rarity} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={trait.description}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTraitDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trait Info Dialog */}
      <Dialog
        open={!!traitInfoDialog}
        onClose={() => setTraitInfoDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        {traitInfoDialog && (
          <>
            <DialogTitle>
              {(() => {
                const trait = useAppSelector(state => selectTraitById(state, traitInfoDialog));
                return trait?.name || 'Trait Details';
              })()}
            </DialogTitle>
            <DialogContent>
              {(() => {
                const trait = useAppSelector(state => selectTraitById(state, traitInfoDialog));
                if (!trait) return null;
                
                return (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                      <Chip label={trait.category} variant="outlined" />
                      <Chip label={trait.rarity} color="primary" />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {trait.description}
                    </Typography>
                    {typeof trait.effects === 'object' && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Effects:
                        </Typography>
                        <Box sx={{ marginLeft: 2 }}>
                          {Object.entries(trait.effects).map(([key, value]) => (
                            <Typography key={key} variant="body2" color="text.secondary">
                              • {key}: {typeof value === 'number' ? (value > 0 ? '+' : '') + value : String(value)}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })()}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTraitInfoDialog(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

PlayerTraits.displayName = 'PlayerTraits';

export default PlayerTraits;
