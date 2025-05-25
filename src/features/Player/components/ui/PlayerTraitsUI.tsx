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
import type { PlayerTraitsUIProps, TraitSlotData } from '../../state/PlayerTypes';
import type { Trait } from '../../../Traits/state/TraitsTypes';

/**
 * Props for the PlayerTraitsUI component
 */
export interface PlayerTraitsUIProps {
  /** Array of trait slots */
  slots: TraitSlotData[];
  /** Array of equipped traits */
  equippedTraits: Trait[];
  /** Array of permanent traits */
  permanentTraits: Trait[];
  /** Callback for equipping a trait to a slot */
  onEquipTrait: (traitId: string, slotIndex: number) => void;
  /** Callback for unequipping a trait from a slot */
  onUnequipTrait: (slotId: string) => void;
  /** Callback for making a trait permanent */
  onMakePermanent: (traitId: string) => void;
  /** Additional class name */
  className?: string;
  /** Whether to show loading state */
  showLoading?: boolean;
}

/**
 * Props for trait slot component
 */
interface TraitSlotProps {
  slot: TraitSlotData;
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
              backgroundColor: 'action.disabled',
              border: `2px dashed`,
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
              backgroundColor: 'background.paper',
              border: `2px dashed`,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.dark',
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
            border: `2px solid`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.shadows[4],
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
    slots,
    equippedTraits,
    permanentTraits,
    onEquipTrait,
    onUnequipTrait,
    onMakePermanent,
    className,
    showLoading = false,
  }) => {
    const getTraitById = useCallback(
      (traitId: string | null | undefined): Trait | null => {
        if (!traitId) return null;
        return equippedTraits.find((trait) => trait.id === traitId) || null;
      },
      [equippedTraits]
    );

    const isPermanent = useCallback(
      (traitId: string): boolean => {
        return permanentTraits.some((trait) => trait.id === traitId);
      },
      [permanentTraits]
    );

    const handleSlotClick = useCallback(
      (slot: TraitSlotData) => {
        if (!slot.isUnlocked) return;

        if (slot.traitId) {
          // Unequip trait
          onUnequipTrait(slot.id);
        } else {
          // For demonstration, just log - in production this would open trait selection
          console.log('Open trait selection for slot:', slot.index);
          // Example: onEquipTrait('example-trait-id', slot.index);
        }
      },
      [onUnequipTrait]
    );

    const handleMakePermanent = useCallback(
      (traitId: string) => {
        onMakePermanent(traitId);
      },
      [onMakePermanent]
    );

    const getRarityColor = (rarity: string) => {
      switch (rarity.toLowerCase()) {
        case 'common':
          return 'default';
        case 'rare':
          return 'primary';
        case 'epic':
          return 'secondary';
        case 'legendary':
          return 'warning';
        default:
          return 'default';
      }
    };

    return (
      <Box className={className}>
        {/* Trait Slots Section */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Equipped Traits (
                {slots.filter((s) => s.traitId && s.isUnlocked).length}/
                {slots.filter((s) => s.isUnlocked).length}
                )
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {slots.map((slot) => {
                const equippedTrait = getTraitById(slot.traitId);
                const isLocked = !slot.isUnlocked;

                return (
                  <Grid item xs={12} sm={6} md={4} key={slot.id}>
                    <TraitSlotComponent
                      slot={slot}
                      trait={equippedTrait}
                      onEquip={handleSlotClick}
                      onUnequip={onUnequipTrait}
                      compact={false}
                    />
                  </Grid>
                );
              })}
            </Grid>

            {showLoading && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Loading trait data...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Permanent Traits Section */}
        {permanentTraits.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StarIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Permanent Traits ({permanentTraits.length})
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {permanentTraits.map((trait) => (
                  <Grid item xs={12} sm={6} md={4} key={trait.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        backgroundColor: 'warning.light',
                        color: 'warning.contrastText',
                        border: '1px solid',
                        borderColor: 'warning.main',
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <StarIcon color="warning" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {trait.name}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                          {trait.description}
                        </Typography>

                        <Chip
                          label={`${trait.rarity} - Permanent`}
                          size="small"
                          color="warning"
                          sx={{ color: 'warning.contrastText' }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trait Management
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                disabled={showLoading}
              >
                Discover New Traits
              </Button>

              <Button
                variant="outlined"
                startIcon={<StarIcon />}
                disabled={showLoading || equippedTraits.length === 0}
                onClick={() => {
                  // For demonstration - make first non-permanent equipped trait permanent
                  const firstEquippedTrait = equippedTraits.find(
                    (trait) => !isPermanent(trait.id)
                  );
                  if (firstEquippedTrait) {
                    handleMakePermanent(firstEquippedTrait.id);
                  }
                }}
              >
                Make Trait Permanent
              </Button>
            </Box>

            <Alert severity="info">
              This interface is ready for full trait system integration. Trait acquisition,
              permanence mechanics, and slot management are prepared for backend implementation.
            </Alert>
          </CardContent>
        </Card>

        {/* Trait Selection Dialog */}
        <TraitSelectionDialog
          open={false}
          onClose={() => {}}
          onSelect={() => {}}
          availableTraits={[]}
          equippedTraitIds={[]}
        />
      </Box>
    );
  }
);

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

export default PlayerTraitsUI;
