import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import { traits } from '../modules/data/traits';
import { RELATIONSHIP_TIERS } from '../config/gameConstants';

const getRelationshipTier = (value) => {
  return Object.values(RELATIONSHIP_TIERS).find(tier => value >= tier.threshold) || RELATIONSHIP_TIERS.NEMESIS;
};

const MinionCard = ({ minion, player, onShareSlot, onAssignTrait, onRemoveTrait, onDelete, isImmature }) => {
  const relationship = minion.relationship || 0;
  const relationshipTier = getRelationshipTier(relationship);
  const slotsToShare = Math.floor(relationship / 20);
  const canShareSlots = player.traitSlots > (minion.traitSlots || 0);
  
  return (
    <Paper sx={{ 
      p: 2, 
      position: 'relative',
      border: isImmature ? '2px solid' : 'none',
      borderColor: 'secondary.main',
    }}>
      {isImmature && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 0.5,
          textAlign: 'center',
          zIndex: 1
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            Growing... ({minion.maturity || 0}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={minion.maturity || 0}
            sx={{ height: 3, mt: 0.5 }}
          />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar 
          src={minion.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${minion.id}`}
          sx={{ 
            width: 64, 
            height: 64,
            opacity: isImmature ? 0.7 : 1,
            filter: isImmature ? 'grayscale(50%)' : 'none',
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">{minion.name}</Typography>
              {minion.growthType === 'accelerated' && (
                <Chip 
                  size="small" 
                  label="Accelerated"
                  color="secondary"
                  sx={{ ml: 1, height: 20 }} 
                />
              )}
            </Box>
            <Chip 
              label={relationshipTier.name} 
              sx={{ 
                bgcolor: relationshipTier.color,
                color: '#fff'
              }} 
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {minion.description || minion.type}
          </Typography>
          
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              Relationship: {relationship}/100
            </Typography>
            <LinearProgress 
              variant="determinate"
              value={(relationship + 100) / 2} // Convert -100 to 100 scale to 0 to 100 scale
              sx={{ 
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  bgcolor: relationshipTier.color
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">
              Trait Slots: {minion.traitSlots || 0}
            </Typography>
            
            <Tooltip 
              title={!canShareSlots 
                ? "You don't have more trait slots than this minion" 
                : slotsToShare === 0
                  ? "Increase relationship to share trait slots"
                  : `Share ${slotsToShare} trait slot${slotsToShare > 1 ? 's' : ''} with this minion`
              }
            >
              <span>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => onShareSlot(minion.id, slotsToShare)}
                  disabled={!canShareSlots || slotsToShare === 0}
                >
                  Share Slot{slotsToShare > 1 ? 's' : ''} ({slotsToShare})
                </Button>
              </span>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Assigned Traits:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {minion.traits.length > 0 ? (
              minion.traits.map(traitId => {
                const trait = traits.copyableTraits[traitId];
                return (
                  <Chip
                    key={traitId}
                    label={trait.name}
                    onDelete={() => onRemoveTrait(traitId)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                );
              })
            ) : (
              <Typography variant="caption" color="text.secondary">
                No traits assigned
              </Typography>
            )}
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            size="small"
            onClick={() => onAssignTrait(minion.id)}
            fullWidth
            disabled={isImmature}
          >
            Assign Trait
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import MinionCard from './MinionCard';

/**
 * MinionPanel component displays all player's minions and allows interaction with them
 * @returns {JSX.Element} The minion panel interface
 */
const MinionPanel = () => {
  const { minions, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // State for dialogs and notifications
  const [assignTraitDialogOpen, setAssignTraitDialogOpen] = useState(false);
  const [selectedMinionId, setSelectedMinionId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  /**
   * Handles sharing trait slots with a minion
   * @param {string} minionId - ID of the minion to share slots with
   * @param {number} slotsToShare - Number of slots to share
   */
  const handleShareSlot = (minionId, slotsToShare) => {
    if (slotsToShare <= 0) return;
    
    dispatch({
      type: 'SHARE_TRAIT_SLOTS',
      payload: {
        minionId,
        slots: slotsToShare
      }
    });
    
    setNotification({
      open: true,
      message: `Shared ${slotsToShare} trait slot${slotsToShare > 1 ? 's' : ''} with minion`,
      severity: 'success'
    });
  };

  /**
   * Opens the trait assignment dialog for a minion
   * @param {string} minionId - ID of the minion to assign traits to
   */
  const handleAssignTraitClick = (minionId) => {
    setSelectedMinionId(minionId);
    setAssignTraitDialogOpen(true);
  };

  /**
   * Handles assigning a trait to a minion from the dialog
   * @param {string} traitId - ID of the trait to assign
   */
  const handleAssignTrait = (traitId) => {
    if (!selectedMinionId) return;
    
    dispatch({
      type: 'ASSIGN_TRAIT_TO_MINION',
      payload: {
        minionId: selectedMinionId,
        traitId
      }
    });
    
    setAssignTraitDialogOpen(false);
    setNotification({
      open: true,
      message: 'Trait assigned successfully',
      severity: 'success'
    });
  };

  /**
   * Handles removing a trait from a minion
   * @param {string} minionId - ID of the minion
   * @param {string} traitId - ID of the trait to remove
   */
  const handleRemoveTrait = (minionId, traitId) => {
    dispatch({
      type: 'REMOVE_TRAIT_FROM_MINION',
      payload: {
        minionId,
        traitId
      }
    });
    
    setNotification({
      open: true,
      message: 'Trait removed',
      severity: 'info'
    });
  };

  /**
   * Handles deleting a minion
   * @param {string} minionId - ID of the minion to delete
   */
  const handleDeleteMinion = (minionId) => {
    dispatch({
      type: 'DELETE_MINION',
      payload: {
        minionId
      }
    });
    
    setNotification({
      open: true,
      message: 'Minion dismissed',
      severity: 'warning'
    });
  };

  /**
   * Closes the notification snackbar
   */
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Panel title="Your Minions">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Manage your minions and assign them traits to increase their effectiveness
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => {
            /* Logic for recruiting new minions */
          }}
        >
          Recruit Minion
        </Button>
      </Box>
      
      {minions && minions.length > 0 ? (
        <Grid container spacing={3}>
          {minions.map(minion => (
            <Grid item xs={12} md={6} lg={4} key={minion.id}>
              <MinionCard 
                minion={minion} 
                player={player}
                onShareSlot={handleShareSlot}
                onAssignTrait={handleAssignTraitClick}
                onRemoveTrait={(traitId) => handleRemoveTrait(minion.id, traitId)}
                onDelete={() => handleDeleteMinion(minion.id)}
                isImmature={minion.maturity < 100}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You don't have any minions yet. Recruit some to help with your tasks!
          </Typography>
        </Paper>
      )}
      
      {/* Dialog for assigning traits (implementation details omitted for brevity) */}
      <Dialog 
        open={assignTraitDialogOpen} 
        onClose={() => setAssignTraitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Trait</DialogTitle>
        <DialogContent>
          {/* Trait selection UI would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignTraitDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleAssignTrait(/* selected trait id */)}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default MinionPanel;