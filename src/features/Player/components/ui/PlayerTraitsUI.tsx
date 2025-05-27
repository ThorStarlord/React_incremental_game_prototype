/**
 * @file PlayerTraitsUI.tsx
 * @description UI component for displaying player trait information with quick actions
 */

import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Star as StarIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  Add as AddIcon
} from '@mui/icons-material';
import type { PlayerTraitsUIProps, TraitSlotData } from '../../state/PlayerTypes';

/**
 * PlayerTraitsUI - Presentational component for player trait management
 * Displays trait slots, equipped traits, and provides trait management interface
 */
export const PlayerTraitsUI: React.FC<PlayerTraitsUIProps> = React.memo(({
  slots,
  equippedTraits,
  permanentTraits,
  onSlotClick,
  onTraitEquip,
  onTraitUnequip,
  onTraitMakePermanent,
  onEquipTrait,
  onUnequipTrait,
  onMakePermanent,
  showLoading = false,
  isLoading,
  equippedCount = 0,
  permanentCount = 0,
  maxSlots = 0,
  totalSlots = 0,
  unlockedSlots = 0,
  className
}) => {
  const getTraitById = useMemo(
    () => (traitId: string | null | undefined) => {
      if (!traitId) return null;
      return equippedTraits.find((trait: any) => trait.id === traitId) || null;
    },
    [equippedTraits]
  );

  const handleSlotClick = useCallback(
    (slotId: string) => {
      // TODO: Open trait selection dialog
      console.log('Opening trait selection for slot:', slotId);
    },
    []
  );

  if (showLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
        className={className}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading traits...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* Statistics Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trait Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {equippedCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Equipped
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary">
                  {permanentCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Permanent
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {unlockedSlots}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Unlocked
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {totalSlots}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Slots
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Trait Slots */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Trait Slots
          </Typography>
          <Grid container spacing={2}>
            {slots.map((slot: TraitSlotData) => {
              const equippedTrait = getTraitById(slot.traitId);

              return (
                <Grid item xs={12} sm={6} md={4} key={slot.id}>
                  <Card
                    sx={{
                      minHeight: 200,
                      cursor: slot.isUnlocked ? 'pointer' : 'default',
                      opacity: slot.isUnlocked ? 1 : 0.6,
                      border: equippedTrait ? '2px solid' : '1px solid',
                      borderColor: equippedTrait ? 'primary.main' : 'divider'
                    }}
                    onClick={() => {
                      if (slot.isUnlocked && slot.traitId) {
                        onUnequipTrait?.(slot.id);
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2">
                          Slot {slot.index + 1}
                        </Typography>
                        {slot.isUnlocked ? (
                          <LockOpenIcon color="success" fontSize="small" />
                        ) : (
                          <LockIcon color="disabled" fontSize="small" />
                        )}
                      </Box>
                      
                      {slot.traitId && equippedTrait ? (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {equippedTrait.name}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnequipTrait?.(slot.id);
                            }}
                          >
                            Unequip
                          </Button>
                        </Box>
                      ) : slot.isUnlocked ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Empty Slot
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSlotClick(slot.id);
                            }}
                          >
                            Equip Trait
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Locked
                          </Typography>
                          {slot.unlockRequirement && (
                            <Typography variant="caption" color="text.secondary">
                              {slot.unlockRequirement}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Permanent Traits */}
      {permanentTraits.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <StarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Permanent Traits ({permanentTraits.length})
            </Typography>
            <Grid container spacing={1}>
              {permanentTraits.map((trait: any) => (
                <Grid item key={trait.id}>
                  <Chip
                    label={trait.name}
                    color="secondary"
                    variant="filled"
                    icon={<StarIcon />}
                  />
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
              variant="contained"
              color="success"
              disabled={equippedTraits.length === 0}
              onClick={() => {
                const firstEquippedTrait = equippedTraits[0];
                if (firstEquippedTrait) {
                  onMakePermanent?.(firstEquippedTrait.id);
                }
              }}
            >
              Make First Trait Permanent
            </Button>
          </Box>

          <Alert severity="info">
            This interface is ready for full trait system integration. Trait acquisition,
            permanence mechanics, and slot management are prepared for backend implementation.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
});

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

export default PlayerTraitsUI;
