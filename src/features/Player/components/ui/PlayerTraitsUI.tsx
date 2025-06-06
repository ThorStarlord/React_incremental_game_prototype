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
  Alert
} from '@mui/material';
import { PlayerTraitsUIProps } from '../../state/PlayerTypes';

/**
 * PlayerTraitsUI Component
 * 
 * Presentational component for displaying and managing player trait slots.
 * Handles trait equipping, unequipping, and slot management.
 */
export const PlayerTraitsUI: React.FC<PlayerTraitsUIProps> = React.memo(({
  traitSlots,
  availableTraits,
  onEquipTrait,
  onUnequipTrait,
  onTraitSelect,
  className,
  isLoading = false,
  error = null
}) => {
  const getTraitById = useMemo(() => {
    // Since we don't have access to all traits here, we'll work with available traits
    const traitMap = new Map();
    availableTraits.forEach(trait => {
      traitMap.set(trait.id || trait.name, trait);
    });
    return (id: string) => traitMap.get(id);
  }, [availableTraits]);

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
        Trait Slots
      </Typography>
      
      <Grid container spacing={2}>
        {traitSlots.map((slot) => {
          const equippedTrait = slot.traitId ? getTraitById(slot.traitId) : null;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Card 
                variant={slot.isUnlocked ? "outlined" : "elevation"}
                sx={{
                  minHeight: 150,
                  opacity: slot.isUnlocked ? 1 : 0.6,
                  cursor: slot.isUnlocked ? 'pointer' : 'default',
                  border: slot.isUnlocked && slot.traitId ? '2px solid' : undefined,
                  borderColor: slot.isUnlocked && slot.traitId ? 'primary.main' : undefined,
                  '&:hover': slot.isUnlocked ? {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  } : {}
                }}
                onClick={() => {
                  if (slot.isUnlocked && slot.traitId) {
                    onUnequipTrait?.(slot.index);
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Slot {slot.index + 1}
                    </Typography>
                    {slot.isUnlocked ? (
                      <Chip label="Unlocked" size="small" color="success" />
                    ) : (
                      <Chip label="Locked" size="small" color="default" />
                    )}
                  </Box>

                  {slot.isUnlocked ? (
                    equippedTrait ? (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {equippedTrait.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {equippedTrait.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnequipTrait?.(slot.index);
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
                          Click to equip a trait
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Locked Slot
                      </Typography>
                      {slot.unlockRequirements && (
                        <Typography variant="caption" color="text.secondary">
                          {slot.unlockRequirements.type === 'resonanceLevel' 
                            ? `Resonance Level ${slot.unlockRequirements.value}` 
                            : slot.unlockRequirements.value}
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
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Available Traits
          </Typography>
          <Grid container spacing={2}>
            {availableTraits.map((trait) => (
              <Grid item xs={12} sm={6} md={4} key={trait.id || trait.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {trait.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {trait.description}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        onTraitSelect?.(trait.id || trait.name);
                      }}
                    >
                      Select
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
});

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

export default PlayerTraitsUI;
