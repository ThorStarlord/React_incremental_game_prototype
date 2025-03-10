import React, { useContext, useState } from 'react';
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
  DialogActions
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useGameState, useGameDispatch } from '../../../../context/index';
import Panel from '../../../../shared/components/layout/Panel';
import useTraitEffects from '../../hooks/useTraitEffects';
import { TRAIT_CATEGORIES, TraitDefinition } from '../../traitsInitialState';
import './TraitSlots.css';

/**
 * Interface for the trait with ID
 */
interface Trait extends TraitDefinition {
  id: string;
}

/**
 * Props for the TraitSlot component
 */
interface TraitSlotProps {
  traitId: string;
  trait: Trait | null;
  onRemove: (id: string) => void;
  onMakePermanent: (id: string) => void;
  essence: number;
}

/**
 * Props for the TraitSlots component
 */
interface TraitSlotsProps {
  availableTraits: Trait[];
  activeSlots: Record<string, string>;
  onAssignTrait: (slotId: string, traitId: string) => void;
  onRemoveTrait: (slotId: string) => void;
  slotUnlockLevels?: Record<string, number>;
  playerLevel?: number;
}

/**
 * Interface for slot definition
 */
interface SlotDefinition {
  id: string;
  category: string;
  unlockLevel: number;
}

// Simplified TraitSlot component without drag-and-drop
const TraitSlot: React.FC<TraitSlotProps> = ({ traitId, trait, onRemove, onMakePermanent, essence }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const canMakePermanent = essence >= 150;

  if (!trait) return null;

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
          {trait.effects && Object.entries(trait.effects).length > 0 && (
            <Box>
              <Typography variant="subtitle1">Effects</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {Object.entries(trait.effects).map(([key, value]) => (
                  <Typography component="li" key={key} variant="body2">
                    {key}: {value > 0 ? "+" : ""}{typeof value === 'number' && value < 1 ? `${value * 100}%` : value}
                  </Typography>
                ))}
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

// Main TraitSlots component
const TraitSlots: React.FC<TraitSlotsProps> = ({ 
  availableTraits,
  activeSlots,
  onAssignTrait,
  onRemoveTrait,
  slotUnlockLevels = {},
  playerLevel = 1
}) => {
  const { player, traits, essence } = useGameState();
  const dispatch = useGameDispatch();
  const { modifiers } = useTraitEffects();
  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);
  const [showTraitSelector, setShowTraitSelector] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  // Define slot structure based on trait categories
  const slotStructure: SlotDefinition[] = [
    { 
      id: 'physical_slot_1', 
      category: TRAIT_CATEGORIES.PHYSICAL, 
      unlockLevel: slotUnlockLevels.physical1 || 3 
    },
    { 
      id: 'mental_slot_1', 
      category: TRAIT_CATEGORIES.MENTAL, 
      unlockLevel: slotUnlockLevels.mental1 || 5 
    },
    { 
      id: 'magical_slot_1', 
      category: TRAIT_CATEGORIES.MAGICAL, 
      unlockLevel: slotUnlockLevels.magical1 || 8 
    },
    { 
      id: 'physical_slot_2', 
      category: TRAIT_CATEGORIES.PHYSICAL, 
      unlockLevel: slotUnlockLevels.physical2 || 10 
    },
    { 
      id: 'mental_slot_2', 
      category: TRAIT_CATEGORIES.MENTAL, 
      unlockLevel: slotUnlockLevels.mental2 || 15 
    },
    { 
      id: 'special_slot_1', 
      category: TRAIT_CATEGORIES.SPECIAL, 
      unlockLevel: slotUnlockLevels.special1 || 20 
    },
  ];

  // Handle opening the trait selector for a slot
  const handleOpenSelector = (slotId: string): void => {
    setActiveSlotId(slotId);
    setShowTraitSelector(true);
  };

  // Handle closing the trait selector
  const handleCloseSelector = (): void => {
    setShowTraitSelector(false);
    setActiveSlotId(null);
    setSelectedTrait(null);
  };

  // Handle selecting a trait
  const handleSelectTrait = (trait: Trait): void => {
    setSelectedTrait(trait);
  };

  // Handle confirming trait assignment
  const handleConfirmTraitAssignment = (): void => {
    if (selectedTrait && activeSlotId) {
      onAssignTrait(activeSlotId, selectedTrait.id);
      handleCloseSelector();
    }
  };

  // Handle removing a trait from a slot
  const handleRemoveTrait = (slotId: string): void => {
    onRemoveTrait(slotId);
  };

  // Get the active trait for a slot
  const getActiveTraitForSlot = (slotId: string): Trait | null => {
    if (!activeSlots || !activeSlots[slotId]) return null;
    
    const traitId = activeSlots[slotId];
    return availableTraits.find(trait => trait.id === traitId) || null;
  };

  // Determine if a trait is compatible with a slot
  const isTraitCompatibleWithSlot = (trait: Trait, slotCategory: string): boolean => {
    return trait.category === slotCategory && trait.level > 0;
  };

  // Filter available traits for current active slot
  const getCompatibleTraits = (): Trait[] => {
    if (!activeSlotId) return [];
    
    const slot = slotStructure.find(s => s.id === activeSlotId);
    if (!slot) return [];
    
    return availableTraits.filter(trait => 
      isTraitCompatibleWithSlot(trait, slot.category)
    );
  };

  // Render a trait slot
  const renderSlot = (slot: SlotDefinition): JSX.Element => {
    const isUnlocked = playerLevel >= slot.unlockLevel;
    const activeTrait = getActiveTraitForSlot(slot.id);
    
    return (
      <div 
        key={slot.id} 
        className={`trait-slot ${slot.category} ${isUnlocked ? 'unlocked' : 'locked'}`}
      >
        {isUnlocked ? (
          <>
            {activeTrait ? (
              <div className="active-trait">
                <div className="trait-slot-icon">
                  <i className={`icon-${activeTrait.icon}`}></i>
                </div>
                <div className="trait-slot-details">
                  <h4>{activeTrait.name}</h4>
                  <p>Level {activeTrait.level}</p>
                </div>
                <button 
                  className="slot-action-button remove"
                  onClick={() => handleRemoveTrait(slot.id)}
                >
                  ✖
                </button>
              </div>
            ) : (
              <div 
                className="empty-slot"
                onClick={() => handleOpenSelector(slot.id)}
              >
                <span className="empty-slot-text">Assign trait</span>
                <span className="empty-slot-category">
                  {slot.category.charAt(0).toUpperCase() + slot.category.slice(1)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="locked-slot">
            <span className="lock-icon">🔒</span>
            <span>Unlocks at level {slot.unlockLevel}</span>
          </div>
        )}
      </div>
    );
  };

  // Render the trait selector modal
  const renderTraitSelector = (): JSX.Element | null => {
    if (!showTraitSelector) return null;
    
    const compatibleTraits = getCompatibleTraits();
    
    return (
      <div className="trait-selector-modal">
        <div className="trait-selector-content">
          <div className="trait-selector-header">
            <h3>Select a Trait</h3>
            <button 
              className="close-selector-button"
              onClick={handleCloseSelector}
            >
              ✖
            </button>
          </div>
          
          <div className="trait-selector-list">
            {compatibleTraits.length > 0 ? (
              compatibleTraits.map(trait => (
                <div 
                  key={trait.id}
                  className={`trait-selector-item ${selectedTrait?.id === trait.id ? 'selected' : ''}`}
                  onClick={() => handleSelectTrait(trait)}
                >
                  <div className="trait-selector-icon">
                    <i className={`icon-${trait.icon}`}></i>
                  </div>
                  <div className="trait-selector-details">
                    <h4>{trait.name}</h4>
                    <p>Level {trait.level}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-traits-message">
                No compatible traits available. Level up traits of this category first.
              </p>
            )}
          </div>
          
          <div className="trait-selector-actions">
            <button
              className="confirm-selection-button"
              onClick={handleConfirmTraitAssignment}
              disabled={!selectedTrait}
            >
              Confirm
            </button>
            <button
              className="cancel-selection-button"
              onClick={handleCloseSelector}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle removing a trait
  const handleRemoveTraitOld = (traitId: string): void => {
    dispatch({
      type: 'UNEQUIP_TRAIT',
      payload: traitId
    });
  };

  // Handle making a trait permanent
  const handleMakePermanent = (traitId: string): void => {
    if (essence >= 150) {
      // Show confirmation dialog (optional)
      if (window.confirm(`Make ${traits.copyableTraits[traitId]?.name} permanent? This will cost 150 Essence.`)) {
        dispatch({ 
          type: 'ADD_PERMANENT_TRAIT', 
          payload: { traitId } 
        });
        
        // Show notification (if you have a notification system)
        dispatch({
          type: 'SHOW_NOTIFICATION',
          payload: {
            message: `${traits.copyableTraits[traitId]?.name} is now a permanent trait!`,
            severity: 'success',
            duration: 3000
          }
        });
      }
    }
  };

  // Calculate available and total trait slots
  const availableSlots = Math.max(0, (player?.traitSlots || 0) - ((player?.equippedTraits?.length || 0)));
  const totalSlots = player?.traitSlots || 0;

  return (
    <Panel title="Trait Slots">
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Available Slots: {availableSlots}/{totalSlots}
          </Typography>
          <Typography variant="subtitle1" color="secondary">
            Permanent Traits: {player?.permanentTraits?.length || 0}
          </Typography>
        </Box>

        {/* Permanent traits section */}
        {(player?.permanentTraits?.length || 0) > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Permanent Traits</Typography>
            <Grid container spacing={2}>
              {player?.permanentTraits?.map(traitId => {
                const trait = traits?.copyableTraits?.[traitId];
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

        {/* Equipped traits section - replace DragDropContext with regular Box */}
        <Typography variant="h6" sx={{ mb: 1 }}>Equipped Traits</Typography>
        {(player?.equippedTraits?.length || 0) > 0 ? (
          <Box>
            {player?.equippedTraits?.map((traitId: string) => (
              <TraitSlot
                key={traitId}
                traitId={traitId}
                trait={traits?.copyableTraits?.[traitId] ? { id: traitId, ...traits.copyableTraits[traitId] } : null}
                onRemove={handleRemoveTraitOld}
                onMakePermanent={handleMakePermanent}
                essence={essence || 0}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No traits equipped. Acquire traits and equip them to gain their benefits.
          </Typography>
        )}

        {/* Empty slots display */}
        {availableSlots > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Empty Slots: {availableSlots}</Typography>
            <Grid container spacing={1}>
              {[...Array(availableSlots)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Box
                    sx={{
                      height: 80,
                      border: '1px dashed',
                      borderColor: 'grey.400',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Empty Trait Slot
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <div className="trait-slots-container">
        <div className="trait-slots-header">
          <h2>Active Trait Slots</h2>
          <p className="trait-slots-description">
            Assign your leveled traits to slots for additional bonuses. 
            Unlock more slots as you level up.
          </p>
        </div>
        
        <div className="trait-slots-grid">
          {slotStructure.map(renderSlot)}
        </div>
        
        {/* Active slot bonuses summary */}
        <div className="active-slot-bonuses">
          <h3>Active Slot Bonuses</h3>
          {Object.entries(activeSlots || {}).length > 0 ? (
            <ul className="bonus-list">
              {Object.entries(activeSlots || {}).map(([slotId, traitId]) => {
                const trait = availableTraits.find(t => t.id === traitId);
                if (!trait) return null;
                
                return (
                  <li key={slotId} className="bonus-item">
                    <span className="bonus-name">{trait.name}:</span>
                    <span className="bonus-value">
                      {trait.effect ? 
                        `+${(trait.effect.value * trait.level * 0.5 * 100).toFixed(1)}% ${trait.effect.type.toLowerCase().replace(/_/g, ' ')}` 
                        : 'Special bonus'}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-bonuses-message">No active bonuses. Assign traits to slots to receive bonuses.</p>
          )}
        </div>
        
        {renderTraitSelector()}
      </div>
    </Panel>
  );
};

export default TraitSlots;
