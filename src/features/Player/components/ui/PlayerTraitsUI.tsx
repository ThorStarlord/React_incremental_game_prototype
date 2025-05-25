/**
 * @file PlayerTraitsUI.tsx
 * @description UI component for displaying player trait information with quick actions
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Alert,
  Tooltip,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Star as StarIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Lock as LockIcon,
  AutoAwesome as AutoAwesomeIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import type { Trait, TraitSlot } from '../../../Traits/state/TraitsTypes';

/**
 * Props for the PlayerTraitsUI component
 */
export interface PlayerTraitsUIProps {
  /** Array of trait slots */
  traitSlots: TraitSlot[];
  /** Array of equipped traits */
  equippedTraits: Trait[];
  /** Array of permanent traits */
  permanentTraits: Trait[];
  /** Array of available traits to equip */
  availableTraits: Trait[];
  /** Callback for equipping a trait to a slot */
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  /** Callback for unequipping a trait from a slot */
  onUnequipTrait: (slotId: string) => void;
  /** Additional class name */
  className?: string;
  /** Whether to show compact view */
  compact?: boolean;
  /** Maximum number of traits to show in compact mode */
  maxCompactTraits?: number;
}

/**
 * Props for trait slot component
 */
interface TraitSlotProps {
  slot: TraitSlot;
  trait?: Trait;
  onEquip: (slotId: string) => void;
  onUnequip: (slotId: string) => void;
  compact?: boolean;
}

/**
 * Props for trait selection dialog
 */
interface TraitSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (traitId: string) => void;
  availableTraits: Trait[];
  equippedTraitIds: string[];
}

/**
 * Individual trait slot component with equip/unequip functionality
 */
const TraitSlotComponent: React.FC<TraitSlotProps> = React.memo(
  ({ slot, trait, onEquip, onUnequip, compact = false }) => {
    const theme = useTheme();

    const handleSlotClick = useCallback(() => {
      if (!slot.isUnlocked) return;

      if (trait) {
        onUnequip(slot.id);
      } else {
        onEquip(slot.id);
      }
    }, [slot.id, slot.isUnlocked, trait, onEquip, onUnequip]);

    const getSlotContent = () => {
      if (!slot.isUnlocked) {
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={compact ? 80 : 120}
            sx={{
              backgroundColor: theme.palette.action.disabled,
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
          >
            <LockIcon color="disabled" sx={{ fontSize: compact ? 24 : 32, mb: 0.5 }} />
            <Typography variant="caption" color="text.disabled" textAlign="center">
              {slot.unlockRequirements?.type === 'level'
                ? `Level ${slot.unlockRequirements.value}`
                : 'Locked'}
            </Typography>
          </Box>
        );
      }

      if (!trait) {
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={compact ? 80 : 120}
            sx={{
              backgroundColor: theme.palette.background.paper,
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.dark,
              },
            }}
            onClick={handleSlotClick}
            role="button"
            tabIndex={0}
            aria-label={`Equip trait to slot ${slot.index + 1}`}
          >
            <AddIcon color="primary" sx={{ fontSize: compact ? 24 : 32, mb: 0.5 }} />
            <Typography variant="caption" color="primary" textAlign="center">
              Equip Trait
            </Typography>
          </Box>
        );
      }

      return (
        <Card
          elevation={2}
          sx={{
            height: compact ? 80 : 120,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
          }}
          onClick={handleSlotClick}
          role="button"
          tabIndex={0}
          aria-label={`Unequip ${trait.name}`}
        >
          <CardContent sx={{ p: compact ? 1 : 2, '&:last-child': { pb: compact ? 1 : 2 } }}>
            <Box display="flex" flexDirection="column" height="100%" justifyContent="space-between">
              <Typography
                variant={compact ? 'caption' : 'body2'}
                fontWeight="bold"
                noWrap
                sx={{ mb: 0.5 }}
              >
                {trait.name}
              </Typography>
              <Chip
                label={trait.rarity}
                size="small"
                color={
                  trait.rarity === 'legendary'
                    ? 'warning'
                    : trait.rarity === 'epic'
                    ? 'secondary'
                    : trait.rarity === 'rare'
                    ? 'info'
                    : 'default'
                }
                sx={{ alignSelf: 'flex-start' }}
              />
              {!compact && (
                <IconButton
                  size="small"
                  color="error"
                  sx={{ alignSelf: 'flex-end', mt: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnequip(slot.id);
                  }}
                  aria-label={`Remove ${trait.name}`}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      );
    };

    return (
      <Tooltip
        title={
          !slot.isUnlocked
            ? `Unlock at ${
                slot.unlockRequirements?.type === 'level'
                  ? `Level ${slot.unlockRequirements.value}`
                  : 'requirement met'
              }`
            : trait
            ? `${trait.name}: ${trait.description}`
            : 'Click to equip a trait'
        }
        arrow
      >
        <Box>{getSlotContent()}</Box>
      </Tooltip>
    );
  }
);

TraitSlotComponent.displayName = 'TraitSlotComponent';

/**
 * Trait selection dialog component
 */
const TraitSelectionDialog: React.FC<TraitSelectionDialogProps> = React.memo(
  ({ open, onClose, onSelect, availableTraits, equippedTraitIds }) => {
    const handleTraitSelect = useCallback(
      (traitId: string) => {
        onSelect(traitId);
        onClose();
      },
      [onSelect, onClose]
    );

    const unequippedTraits = useMemo(
      () =>
        availableTraits.filter((trait) => !equippedTraitIds.includes(trait.id)),
      [availableTraits, equippedTraitIds]
    );

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="trait-selection-dialog-title"
      >
        <DialogTitle id="trait-selection-dialog-title">Select Trait to Equip</DialogTitle>
        <DialogContent>
          {unequippedTraits.length === 0 ? (
            <Alert severity="info" sx={{ mt: 1 }}>
              No available traits to equip. Acquire more traits to expand your options.
            </Alert>
          ) : (
            <List sx={{ mt: 1 }}>
              {unequippedTraits.map((trait) => (
                <ListItem key={trait.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleTraitSelect(trait.id)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {trait.category === 'Combat' && <StarIcon color="warning" />}
                          {trait.category === 'Social' && <CategoryIcon color="info" />}
                          {trait.category === 'Physical' && <AutoAwesomeIcon color="success" />}
                          <Typography variant="body1" fontWeight="medium">
                            {trait.name}
                          </Typography>
                          <Chip
                            label={trait.rarity}
                            size="small"
                            color={
                              trait.rarity === 'legendary'
                                ? 'warning'
                                : trait.rarity === 'epic'
                                ? 'secondary'
                                : trait.rarity === 'rare'
                                ? 'info'
                                : 'default'
                            }
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
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
);

TraitSelectionDialog.displayName = 'TraitSelectionDialog';

/**
 * Player trait management UI component for the character page
 * Provides an integrated interface for managing equipped traits and viewing permanent traits
 */
export const PlayerTraitsUI: React.FC<PlayerTraitsUIProps> = React.memo(
  ({
    traitSlots,
    equippedTraits,
    permanentTraits,
    availableTraits,
    onEquipTrait,
    onUnequipTrait,
    className,
    compact = false,
    maxCompactTraits = 6,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Local state
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [traitDialogOpen, setTraitDialogOpen] = useState(false);

    // Get equipped trait IDs
    const equippedTraitIds = useMemo(
      () => equippedTraits.map((trait) => trait.id),
      [equippedTraits]
    );

    // Handlers
    const handleEquipTrait = useCallback((slotId: string) => {
      setSelectedSlotId(slotId);
      setTraitDialogOpen(true);
    }, []);

    const handleUnequipTrait = useCallback(
      (slotId: string) => {
        onUnequipTrait(slotId);
      },
      [onUnequipTrait]
    );

    const handleTraitSelect = useCallback(
      (traitId: string) => {
        if (selectedSlotId) {
          // Find the slot index for the selected slot
          const slot = traitSlots.find((slot) => slot.id === selectedSlotId);
          if (slot) {
            onEquipTrait(traitId, slot.index);
          }
          setSelectedSlotId(null);
        }
      },
      [selectedSlotId, onEquipTrait, traitSlots]
    );

    const handleDialogClose = useCallback(() => {
      setTraitDialogOpen(false);
      setSelectedSlotId(null);
    }, []);

    // Display slots (limited in compact mode)
    const displaySlots = compact ? traitSlots.slice(0, maxCompactTraits) : traitSlots;

    return (
      <Box className={className}>
        {/* Equipped Traits Section */}
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <StarIcon color="primary" />
              Equipped Traits
              <Chip
                label={`${equippedTraits.length}/${traitSlots.filter((slot) => slot.isUnlocked).length}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Typography>

            <Grid container spacing={2}>
              {displaySlots.map((slot) => {
                const equippedTrait = equippedTraits.find((trait) => slot.traitId === trait.id);

                return (
                  <Grid item xs={6} sm={4} md={compact ? 4 : 3} key={slot.id}>
                    <TraitSlotComponent
                      slot={slot}
                      trait={equippedTrait}
                      onEquip={handleEquipTrait}
                      onUnequip={handleUnequipTrait}
                      compact={compact || isMobile}
                    />
                  </Grid>
                );
              })}
            </Grid>

            {compact && traitSlots.length > maxCompactTraits && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Showing {maxCompactTraits} of {traitSlots.length} trait slots. Visit the Traits tab for
                full management.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Permanent Traits Section */}
        {permanentTraits.length > 0 && (
          <Card elevation={1}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AutoAwesomeIcon color="warning" />
                Permanent Traits
                <Chip
                  label={permanentTraits.length}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Typography>

              <Grid container spacing={1}>
                {permanentTraits
                  .slice(0, compact ? 4 : undefined)
                  .map((trait) => (
                    <Grid item xs={6} sm={4} md={compact ? 6 : 3} key={trait.id}>
                      <Chip
                        label={trait.name}
                        color="warning"
                        variant="outlined"
                        size={compact ? 'small' : 'medium'}
                        sx={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          '& .MuiChip-label': {
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                        title={`${trait.name}: ${trait.description}`}
                      />
                    </Grid>
                  ))}
              </Grid>

              {compact && permanentTraits.length > 4 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  +{permanentTraits.length - 4} more permanent traits
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {!compact && (
          <Card elevation={1} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trait Summary
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {availableTraits.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Acquired
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {equippedTraits.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Equipped
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {permanentTraits.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Permanent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {traitSlots.filter((slot) => slot.isUnlocked).length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available Slots
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Trait Selection Dialog */}
        <TraitSelectionDialog
          open={traitDialogOpen}
          onClose={handleDialogClose}
          onSelect={handleTraitSelect}
          availableTraits={availableTraits}
          equippedTraitIds={equippedTraitIds}
        />
      </Box>
    );
  }
);

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

export default PlayerTraitsUI;
