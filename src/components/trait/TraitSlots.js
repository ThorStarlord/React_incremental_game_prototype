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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import Panel from '../panel/Panel';
import useTraitEffects from '../../hooks/useTraitEffects';

// SortableTraitSlot component for drag-and-drop functionality
const SortableTraitSlot = ({ traitId, index, trait, onRemove, onMakePermanent, essence }) => {
  const [showDetails, setShowDetails] = useState(false);
  const canMakePermanent = essence >= 150;

  if (!trait) return null;

  return (
    <>
      <Draggable draggableId={traitId} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
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
        )}
      </Draggable>

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
const TraitSlots = () => {
  const { player, traits, essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { modifiers } = useTraitEffects();

  // Handle removing a trait
  const handleRemoveTrait = (traitId) => {
    dispatch({
      type: 'UNEQUIP_TRAIT',
      payload: traitId
    });
  };

  // Handle making a trait permanent
  const handleMakePermanent = (traitId) => {
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

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(player.equippedTraits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    dispatch({
      type: 'REORDER_EQUIPPED_TRAITS',
      payload: items
    });
  };

  // Calculate available and total trait slots
  const availableSlots = Math.max(0, player.traitSlots - (player.equippedTraits?.length || 0));
  const totalSlots = player.traitSlots || 0;

  return (
    <Panel title="Trait Slots">
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Available Slots: {availableSlots}/{totalSlots}
          </Typography>
          <Typography variant="subtitle1" color="secondary">
            Permanent Traits: {player.permanentTraits?.length || 0}
          </Typography>
        </Box>

        {/* Permanent traits section */}
        {player.permanentTraits?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Permanent Traits</Typography>
            <Grid container spacing={2}>
              {player.permanentTraits.map(traitId => {
                const trait = traits.copyableTraits[traitId];
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

        {/* Equipped traits section - draggable */}
        <Typography variant="h6" sx={{ mb: 1 }}>Equipped Traits</Typography>
        {player.equippedTraits?.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="traitSlots">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {player.equippedTraits.map((traitId, index) => (
                    <SortableTraitSlot
                      key={traitId}
                      traitId={traitId}
                      index={index}
                      trait={traits.copyableTraits[traitId]}
                      onRemove={handleRemoveTrait}
                      onMakePermanent={handleMakePermanent}
                      essence={essence}
                    />
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
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
    </Panel>
  );
};

export default TraitSlots;