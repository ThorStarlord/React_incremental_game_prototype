import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../app/hooks';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Panel from '../../../../shared/components/layout/Panel';
import { RootState } from '../../../../app/store';
import { 
  Trait, 
  TraitSlot 
} from '../../state/TraitsTypes';
import {
  unequipTrait,
  equipTrait,
  selectTraits,
  selectTraitSlots,
  selectEquippedTraitIds,
  selectPermanentTraits
} from '../../state/TraitsSlice';
import { makeTraitPermanentThunk } from '../../state/TraitThunks';
import { selectEssenceAmount } from '../../../Essence/state/EssenceSelectors';
import { selectAvailableTraitObjects } from '../../state/TraitsSelectors';

/**
 * Props for the TraitSlotItem component
 */
interface TraitSlotProps {
  traitId: string;
  trait: Trait | null;
  onRemove: (id: string) => void;
  onMakePermanent: (id: string) => void;
  essence: number;
}

/**
 * Simplified TraitSlotItem component without drag-and-drop
 */
const TraitSlotItem: React.FC<TraitSlotProps> = ({ traitId, trait, onRemove, onMakePermanent, essence }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const canMakePermanent = essence >= 150;

  if (!trait) return null;

  // Helper function to safely render effect values
  const renderEffectValue = (value: any): React.ReactNode => {
    if (typeof value === 'number') {
      // Format numbers properly
      return (value > 0 ? "+" : "") + (value < 1 ? `${value * 100}%` : value);
    } else if (typeof value === 'string') {
      // Strings can be rendered directly
      return value;
    } else if (value === null || value === undefined) {
      // Handle null/undefined values
      return '';
    } else if (typeof value === 'object') {
      // Convert objects to readable string
      try {
        return JSON.stringify(value);
      } catch (e) {
        return '[Complex Object]';
      }
    } 
    // Default fallback
    return String(value);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          p: 1,
          border: '1px solid',
          borderColor: 'primary.light',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <CardContent sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{trait.name}</Typography>
            <Box>
              <IconButton size="small" onClick={() => setShowDetails(true)}>
                <InfoIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onRemove(traitId)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {trait.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Tooltip 
            title={!canMakePermanent ? "Not enough essence (150 required)" : "Make this trait permanent"} 
            arrow
          >
            <span style={{ width: '100%' }}>
              <Button 
                startIcon={<LockIcon />}
                variant="outlined" 
                color="secondary" 
                fullWidth 
                onClick={() => onMakePermanent(traitId)}
                disabled={!canMakePermanent}
              >
                Make Permanent (150 Essence)
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>

      <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
        <DialogTitle>{trait.name}</DialogTitle>
        <DialogContent>
          <Typography paragraph>{trait.description}</Typography>
          {trait.effects && (
            <Box>
              <Typography variant="subtitle1">Effects</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {/* Handle both array and object effects */}
                {Array.isArray(trait.effects) ? (
                  trait.effects.map((effect, index) => (
                    <Typography component="li" key={`${effect.type}-${index}`} variant="body2">
                      {effect.type}: {renderEffectValue(effect.magnitude)}
                    </Typography>
                  ))
                ) : (
                  Object.entries(trait.effects).map(([key, value]) => (
                    <Typography component="li" key={key} variant="body2">
                      {key}: {renderEffectValue(value)}
                    </Typography>
                  ))
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/**
 * Main TraitSlots component using Redux state
 */
const TraitSlots: React.FC = () => {
  const dispatch = useAppDispatch(); // Use typed dispatch instead
  
  // Select data from Redux store
  const traitsData = useSelector(selectTraits);
  const slots = useSelector(selectTraitSlots);
  const equippedTraitIds = useSelector(selectEquippedTraitIds);
  const permanentTraitIds = useSelector(selectPermanentTraits);
  const essence = useSelector(selectEssenceAmount);
  const availableTraits = useSelector(selectAvailableTraitObjects);
  
  const [showTraitSelector, setShowTraitSelector] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    severity: 'info'
  });

  // Handle opening the trait selector for a slot
  const handleOpenSelector = (slotId: string): void => {
    setActiveSlotId(slotId);
    setShowTraitSelector(true);
  };

  // Handle closing the trait selector
  const handleCloseSelector = (): void => {
    setShowTraitSelector(false);
    setActiveSlotId(null);
    setSelectedTraitId(null);
  };

  // Handle confirming trait assignment
  const handleConfirmTraitAssignment = (): void => {
    if (selectedTraitId && activeSlotId) {
      const slot = slots.find(s => s.id === activeSlotId);
      if (slot) {
        dispatch(equipTrait({ 
          traitId: selectedTraitId, 
          slotIndex: slot.index 
        }));
      }
      handleCloseSelector();
    }
  };

  // Handle removing a trait
  const handleRemoveTrait = (traitId: string): void => {
    dispatch(unequipTrait(traitId));
  };

  // Handle making a trait permanent
  const handleMakePermanent = (traitId: string): void => {
    if (essence >= 150) {
      // Show confirmation dialog
      setNotification({
        show: true,
        message: `Make ${traitsData[traitId]?.name || 'this trait'} permanent? This will cost 150 Essence.`,
        severity: 'info'
      });
    }
  };

  // Render traits for slot selection
  const renderTraitOptions = () => {
    // Filter traits that are eligible for the active slot
    const eligibleTraits = availableTraits.filter(trait => {
      // Don't show already equipped traits
      if (equippedTraitIds.includes(trait.id)) return false;
      
      // If a slot has category restrictions, apply them
      if (activeSlotId) {
        const slot = slots.find(s => s.id === activeSlotId);
        if (slot?.unlockRequirements?.type === 'category') {
          return trait.category === slot.unlockRequirements.value;
        }
      }
      
      return true;
    });

    if (eligibleTraits.length === 0) {
      return (
        <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
          No eligible traits available for this slot.
        </Typography>
      );
    }

    return (
      <Grid container spacing={2}>
        {eligibleTraits.map(trait => (
          <Grid item xs={12} sm={6} key={trait.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedTraitId === trait.id ? '2px solid' : '1px solid',
                borderColor: selectedTraitId === trait.id ? 'primary.main' : 'divider'
              }}
              onClick={() => setSelectedTraitId(trait.id)}
            >
              <CardContent>
                <Typography variant="h6">{trait.name}</Typography>
                <Typography variant="body2">{trait.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Calculate available and total trait slots
  const unlockedSlots = slots.filter(slot => slot.isUnlocked);
  const emptySlots = unlockedSlots.filter(slot => !slot.traitId);
  
  return (
    <Panel title="Trait Slots">
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Available Slots: {emptySlots.length}/{unlockedSlots.length}
          </Typography>
          <Typography variant="subtitle1" color="secondary">
            Permanent Traits: {permanentTraitIds.length}
          </Typography>
        </Box>

        {/* Permanent traits section */}
        {permanentTraitIds.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Permanent Traits</Typography>
            <Grid container spacing={2}>
              {permanentTraitIds.map(traitId => {
                const trait = traitsData[traitId];
                if (!trait) return null;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={traitId}>
                    <Card 
                      sx={{ 
                        border: '2px solid', 
                        borderColor: 'secondary.main',
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">{trait.name}</Typography>
                          <LockIcon color="secondary" />
                        </Box>
                        <Typography variant="body2">{trait.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Equipped traits section */}
        <Typography variant="h6" sx={{ mb: 1 }}>Equipped Traits</Typography>
        {equippedTraitIds.length > 0 ? (
          <Box>
            {equippedTraitIds.map((traitId) => {
              const trait = traitsData[traitId];
              
              return (
                <TraitSlotItem
                  key={traitId}
                  traitId={traitId}
                  trait={trait ? { ...trait, id: traitId } : null}
                  onRemove={handleRemoveTrait}
                  onMakePermanent={handleMakePermanent}
                  essence={essence}
                />
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No traits equipped. Acquire traits and equip them to gain their benefits.
          </Typography>
        )}

        {/* Empty slots display */}
        {emptySlots.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Empty Slots: {emptySlots.length}</Typography>
            <Grid container spacing={1}>
              {emptySlots.map((slot) => (
                <Grid item xs={12} sm={6} md={4} key={slot.id}>
                  <Box
                    sx={{
                      height: 80,
                      border: '1px dashed',
                      borderColor: 'grey.400',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenSelector(slot.id)}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Assign Trait
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Locked slots section */}
      {slots.some(slot => !slot.isUnlocked) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Locked Slots</Typography>
          <Grid container spacing={1}>
            {slots.filter(slot => !slot.isUnlocked).map(slot => (
              <Grid item xs={12} sm={6} md={4} key={slot.id}>
                <Box
                  sx={{
                    height: 80,
                    border: '1px dashed',
                    borderColor: 'grey.500',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.05)'
                  }}
                >
                  <LockIcon sx={{ mb: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {slot.unlockRequirements?.type === 'level' 
                      ? `Unlocks at level ${slot.unlockRequirements.value}` 
                      : 'Locked Slot'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Trait selection dialog */}
      <Dialog 
        open={showTraitSelector} 
        onClose={handleCloseSelector}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select a Trait</DialogTitle>
        <DialogContent>
          {renderTraitOptions()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSelector}>Cancel</Button>
          <Button 
            onClick={handleConfirmTraitAssignment}
            disabled={!selectedTraitId}
            variant="contained"
            color="primary"
          >
            Equip Trait
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add notification component */}
      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, show: false })}
      >
        <Alert 
          severity={notification.severity} 
          variant="filled"
          onClose={() => setNotification({ ...notification, show: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default TraitSlots;
