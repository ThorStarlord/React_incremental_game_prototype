import React, { useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '../../../../app/hooks';
import { equipTrait, unequipTrait } from '../../../Traits/state/TraitsSlice';
import type { TraitSlot, Trait } from '../../../Traits/state/TraitsTypes';

interface PlayerTraitsUIProps {
  traitSlots: TraitSlot[];
  equippedTraits: Trait[];
  availableTraits: Trait[];
}

/**
 * UI component for player traits management
 *
 * Features:
 * - Visual trait slot representation with status indicators
 * - Quick equip/unequip actions for trait management
 * - Available traits list with metadata display
 * - Locked slot indicators with unlock requirements
 * - Responsive grid layout for different screen sizes
 */
export const PlayerTraitsUI: React.FC<PlayerTraitsUIProps> = React.memo(
  ({ traitSlots, equippedTraits, availableTraits }) => {
    const dispatch = useAppDispatch();

    const handleEquipTrait = useCallback(
      (traitId: string, slotIndex: number) => {
        dispatch(equipTrait({ traitId, slotIndex }));
      },
      [dispatch]
    );

    const handleUnequipTrait = useCallback(
      (slotIndex: number) => {
        dispatch(unequipTrait({ slotIndex }));
      },
      [dispatch]
    );

    const getRarityColor = (rarity: string) => {
      switch (rarity.toLowerCase()) {
        case 'legendary':
          return 'warning';
        case 'epic':
          return 'secondary';
        case 'rare':
          return 'primary';
        default:
          return 'default';
      }
    };

    return (
      <Grid container spacing={3}>
        {/* Equipped Traits Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipped Traits
              </Typography>

              <Grid container spacing={2}>
                {traitSlots.map((slot, index) => (
                  <Grid item xs={6} sm={4} key={slot.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: slot.isUnlocked ? 1 : 0.5,
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        {!slot.isUnlocked ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <LockIcon color="disabled" sx={{ mb: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              Slot Locked
                            </Typography>
                          </Box>
                        ) : slot.traitId ? (
                          <Box>
                            {/* Find equipped trait info */}
                            {(() => {
                              const trait = equippedTraits.find(
                                (t) => t.id === slot.traitId
                              );
                              return trait ? (
                                <Box>
                                  <Typography variant="subtitle2" noWrap>
                                    {trait.name}
                                  </Typography>
                                  <Chip
                                    label={trait.rarity}
                                    color={getRarityColor(trait.rarity)}
                                    size="small"
                                    sx={{ mb: 1 }}
                                  />
                                  <Typography variant="caption" display="block">
                                    {trait.description}
                                  </Typography>
                                  <Button
                                    size="small"
                                    color="error"
                                    startIcon={<RemoveIcon />}
                                    onClick={() => handleUnequipTrait(index)}
                                    sx={{ mt: 1 }}
                                  >
                                    Unequip
                                  </Button>
                                </Box>
                              ) : (
                                <Typography variant="caption" color="error">
                                  Trait not found
                                </Typography>
                              );
                            })()}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                // This would open a trait selection dialog
                                console.log('Open trait selection for slot', index);
                              }}
                            >
                              Equip Trait
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Traits Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Traits
              </Typography>

              {availableTraits.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No traits available for equipping.
                </Typography>
              ) : (
                <List dense>
                  {availableTraits
                    .slice(0, 10)
                    .map((trait, index) => (
                      <React.Fragment key={trait.id}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {trait.name}
                                </Typography>
                                <Chip
                                  label={trait.rarity}
                                  color={getRarityColor(trait.rarity)}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={trait.description}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                // Find first available slot
                                const availableSlot = traitSlots.findIndex(
                                  (slot) => slot.isUnlocked && !slot.traitId
                                );
                                if (availableSlot !== -1) {
                                  handleEquipTrait(trait.id, availableSlot);
                                }
                              }}
                              disabled={
                                !traitSlots.some(
                                  (slot) => slot.isUnlocked && !slot.traitId
                                )
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < availableTraits.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
);

PlayerTraitsUI.displayName = 'PlayerTraitsUI';

export default PlayerTraitsUI;
