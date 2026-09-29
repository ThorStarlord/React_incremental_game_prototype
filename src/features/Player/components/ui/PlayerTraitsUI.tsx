/**
 * @file PlayerTraitsUI.tsx
 * @description UI component for displaying player trait information with quick actions
 */

import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import type { Trait, TraitSlot } from '../../../Traits/state/TraitsTypes';
import { Star as StarIcon } from '@mui/icons-material';

/**
 * Props interface for PlayerTraitsUI component
 */
interface PlayerTraitsUIProps {
  traitSlots: TraitSlot[];
  assimilatedTraits: Trait[];
  availableTraits: Trait[];
  allTraits: Record<string, Trait>;
  onEquipTrait?: (traitId: string, slotIndex: number) => void;
  onUnequipTrait?: (slotIndex: number) => void;
  onTraitSelect?: (traitId: string) => void;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * PlayerTraitsUI Component
 * 
 * Presentational component for displaying and managing player trait slots.
 * Handles Trait expression, suppression, and expression-capacity presentation.
 */
export const PlayerTraitsUI: React.FC<PlayerTraitsUIProps> = React.memo(({
  traitSlots,
  assimilatedTraits,
  availableTraits,
  allTraits,
  onEquipTrait,
  onUnequipTrait,
  onTraitSelect,
  className,
  isLoading = false,
  error = null
}) => {
  const getTraitById = useMemo(
    () => (id: string | null): Trait | undefined => id ? allTraits[id] : undefined,
    [allTraits]
  );

  const firstEmptySlotIndex = useMemo(
    () => traitSlots.find(slot => !slot.isLocked && slot.traitId === null)?.slotIndex ?? -1,
    [traitSlots]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading traits...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        Trait Expression
      </Typography>
      
      <Grid container spacing={2}>
        {traitSlots.map((slot) => {
          const equippedTrait = getTraitById(slot.traitId);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Card 
                variant={!slot.isLocked ? "outlined" : "elevation"}
                sx={{
                  minHeight: 150,
                  opacity: !slot.isLocked ? 1 : 0.6,
                  cursor: !slot.isLocked && slot.traitId ? 'pointer' : 'default',
                  border: !slot.isLocked && slot.traitId ? '2px solid' : '1px dashed',
                  borderColor: !slot.isLocked && slot.traitId ? 'primary.main' : 'divider',
                  '&:hover': !slot.isLocked ? {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  } : {}
                }}
                onClick={() => {
                  if (!slot.isLocked && slot.traitId) {
                    onUnequipTrait?.(slot.slotIndex);
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Slot {slot.slotIndex + 1}
                    </Typography>
                    {!slot.isLocked ? (
                      <Chip label="Unlocked" size="small" color="success" />
                    ) : (
                      <Chip label="Locked" size="small" color="default" />
                    )}
                  </Box>

                  {!slot.isLocked ? (
                    equippedTrait ? (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {equippedTrait.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {equippedTrait.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip 
                            label={equippedTrait.rarity} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnequipTrait?.(slot.slotIndex);
                            }}
                          >
                            Unequip
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          Empty Slot
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Express a discovered or assimilated Trait here
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would ideally open a selection dialog
                            console.log('Open trait selection for slot', slot.slotIndex);
                          }}
                        >
                          Choose Trait
                        </Button>
                      </Box>
                    )
                  ) : (
                    <Box>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Locked Slot
                      </Typography>
                      {slot.unlockRequirement && (
                        <Typography variant="caption" color="text.secondary">
                          Requires: {slot.unlockRequirement}
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

      {availableTraits.length > 0 && (
        <Box mt={4}>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Available to Express" />
          </Divider>
          <Grid container spacing={1}>
            {availableTraits.map((trait) => (
              <Grid item xs={12} sm={6} md={4} key={trait.id}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  disabled={firstEmptySlotIndex < 0}
                  onClick={() => onEquipTrait?.(trait.id, firstEmptySlotIndex)}
                >
                  Express {trait.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Assimilated Trait Library */}
      {assimilatedTraits.length > 0 && (
        <Box mt={4}>
          <Divider sx={{ mb: 2 }}>
            <Chip icon={<StarIcon />} label="Assimilated Library" />
          </Divider>
          <Grid container spacing={1}>
            {assimilatedTraits.map((trait) => (
              <Grid item xs={12} sm={6} md={4} key={trait.id}>
                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label={trait.name}
                  color="success"
                  variant="outlined"
                  sx={{ width: '100%', justifyContent: 'flex-start' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
});

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

