import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useTheme, 
  Tooltip, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import { traits as traitsData } from '../modules/data/traits';
import TraitSlotNotification from './TraitSlotNotification';
import NewSlotAnimation from './NewSlotAnimation';
import useTraitHotkeys from '../hooks/useTraitHotkeys';
import HotkeyHelpTooltip from './HotkeyHelpTooltip';

const SortableTraitSlot = ({ id, trait, isEquipped, isNew, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        width: 120,
        height: 120,
        border: '2px dashed',
        borderColor: isEquipped ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        position: 'relative',
        bgcolor: 'background.paper',
        transition: 'all 0.2s',
        cursor: 'grab',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover'
        }
      }}
    >
      {isNew && <NewSlotAnimation />}
      
      {isEquipped && (
        <Chip
          label={`⇧${index + 1}`}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            height: 20,
            fontSize: '0.7rem',
            bgcolor: 'primary.main',
            color: 'white',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}

      {trait ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" align="center">
            {trait.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Shift+{index + 1} to unequip
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Empty Slot
        </Typography>
      )}
    </Box>
  );
};

const DraggableTrait = ({ id, trait, isEquipped }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <Tooltip title={trait.description} arrow>
      <Paper
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        elevation={isDragging ? 6 : 1}
        sx={{
          width: 120,
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          cursor: 'grab',
          opacity: isDragging ? 0.5 : 1,
          bgcolor: isEquipped ? 'primary.light' : 'background.paper',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
      >
        <Typography variant="subtitle2" align="center" gutterBottom>
          {trait.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          {isEquipped ? 'Equipped' : 'Drag to equip'}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

const SLOT_UPGRADE_COST = 100; // Base cost for slot upgrade
const MAX_TRAIT_SLOTS = 8; // Maximum number of trait slots

const TraitSlots = () => {
  const { player = { equippedTraits: [], traitSlots: 3 }, essence = 0 } = useContext(GameStateContext) || {};
  const dispatch = useContext(GameDispatchContext);
  const [activeId, setActiveId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [newSlotIndex, setNewSlotIndex] = useState(-1);
  const theme = useTheme();

  // Calculate upgrade cost with increasing scale
  const getUpgradeCost = () => {
    return SLOT_UPGRADE_COST * Math.pow(1.5, (player?.traitSlots || 3) - 3);
  };

  const handleUpgradeSlot = () => {
    const cost = getUpgradeCost();
    if (essence >= cost && player.traitSlots < MAX_TRAIT_SLOTS) {
      dispatch({ type: 'SPEND_ESSENCE', payload: cost });
      dispatch({ type: 'UPGRADE_TRAIT_SLOTS' });
      setNewSlotIndex(player.traitSlots); // Mark the new slot
      setNotification({
        type: 'equip',
        message: 'New trait slot unlocked!',
        open: true
      });
    }
    setShowUpgradeDialog(false);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !player.equippedTraits) return;

    if (active.id && over.id) {
      const oldIndex = player.equippedTraits.indexOf(active.id);
      const newIndex = player.equippedTraits.indexOf(over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrder = arrayMove(player.equippedTraits, oldIndex, newIndex);
        dispatch({
          type: 'REORDER_EQUIPPED_TRAITS',
          payload: newOrder
        });
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleUnequip = (traitId) => {
    const trait = traitsData.copyableTraits[traitId];
    dispatch({ type: 'UNEQUIP_TRAIT', payload: traitId });
    setNotification({
      type: 'unequip',
      message: `${trait.name}'s effects are no longer active`,
      open: true
    });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const availableSlots = Array(player?.traitSlots || 3).fill(null);
  const equippedTraits = player?.equippedTraits || [];
  equippedTraits.forEach((traitId, index) => {
    availableSlots[index] = traitsData.copyableTraits[traitId];
  });

  // Initialize hotkey functionality
  useTraitHotkeys();

  return (
    <Panel title="Trait Slots">
      <TraitSlotNotification 
        open={Boolean(notification)}
        onClose={handleCloseNotification}
        message={notification?.message}
        type={notification?.type}
      />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            Available Slots: {equippedTraits.length}/{player.traitSlots}
          </Typography>
          <HotkeyHelpTooltip />
        </Box>
        {(player?.traitSlots || 0) < MAX_TRAIT_SLOTS && (
          <Tooltip 
            title={
              essence < getUpgradeCost() 
                ? `Need ${getUpgradeCost()} essence` 
                : 'Unlock new trait slot'
            }
            arrow
          >
            <span>
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => setShowUpgradeDialog(true)}
                disabled={essence < getUpgradeCost()}
                sx={{
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark
                  }
                }}
              >
                Upgrade ({getUpgradeCost()} essence)
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
      >
        <SortableContext 
          items={equippedTraits}
          strategy={horizontalListSortingStrategy}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {availableSlots.map((trait, index) => (
              <SortableTraitSlot
                key={trait ? trait.id : `empty-${index}`}
                id={trait ? trait.id : `empty-${index}`}
                trait={trait}
                isEquipped={Boolean(trait)}
                isNew={index === newSlotIndex}
                index={index}
              />
            ))}
          </Box>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <Box
              sx={{
                width: 120,
                height: 120,
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                boxShadow: 3,
                p: 1
              }}
            >
              <Typography variant="body2" align="center">
                {traitsData.copyableTraits[activeId]?.name}
              </Typography>
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog 
        open={showUpgradeDialog} 
        onClose={() => setShowUpgradeDialog(false)}
      >
        <DialogTitle>Upgrade Trait Slots</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to spend {getUpgradeCost()} essence to unlock a new trait slot?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will increase your maximum equippable traits to {(player?.traitSlots || 3) + 1}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpgradeSlot}
            variant="contained"
            disabled={essence < getUpgradeCost()}
          >
            Upgrade
          </Button>
        </DialogActions>
      </Dialog>
    </Panel>
  );
};

export default TraitSlots;