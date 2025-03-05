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
 * Interface representing a trait object
 */
interface Trait {
  /** Unique identifier for the trait */
  id: string;
  /** Display name of the trait */
  name: string;
  /** Description of the trait's effects */
  description?: string;
}

/**
 * Interface for a relationship tier configuration
 */
interface RelationshipTier {
  /** Name of the relationship tier */
  name: string;
  /** Minimum threshold value for this tier */
  threshold: number;
  /** Color representation for this tier */
  color: string;
}

/**
 * Interface representing a minion object
 */
interface Minion {
  /** Unique identifier for the minion */
  id: string;
  /** Display name of the minion */
  name: string;
  /** Description or type of minion */
  description?: string;
  /** Type of minion */
  type?: string;
  /** URL to the minion's avatar image */
  avatar?: string;
  /** Relationship value with player (-100 to 100) */
  relationship: number;
  /** Number of trait slots this minion has */
  traitSlots: number;
  /** Array of trait IDs assigned to this minion */
  traits: string[];
  /** Growth type of the minion ('normal', 'accelerated', etc.) */
  growthType?: 'normal' | 'accelerated'; 
  /** Current maturity level (percentage 0-100) */
  maturity: number;
}

/**
 * Interface for player data
 */
interface Player {
  /** Number of trait slots the player has available */
  traitSlots: number;
  /** Other player properties */
  [key: string]: any;
}

/**
 * Interface for game state
 */
interface GameState {
  /** Array of player's minions */
  minions: Minion[];
  /** Player data */
  player: Player;
  /** Other game state properties */
  [key: string]: any;
}

/**
 * Interface for dispatch action
 */
interface GameAction {
  /** Type of action being dispatched */
  type: string;
  /** Payload data for the action */
  payload: any;
}

/**
 * Interface for notification state
 */
interface NotificationState {
  /** Whether the notification is open */
  open: boolean;
  /** Notification message text */
  message: string;
  /** Severity level of notification */
  severity: 'success' | 'info' | 'warning' | 'error';
}

/**
 * Interface for MinionCard component props
 */
interface MinionCardProps {
  /** Minion object to display */
  minion: Minion;
  /** Player data for comparison and validation */
  player: Player;
  /** Callback when sharing trait slots */
  onShareSlot: (minionId: string, slotsToShare: number) => void;
  /** Callback when assigning a trait */
  onAssignTrait: (minionId: string) => void;
  /** Callback when removing a trait */
  onRemoveTrait: (traitId: string) => void;
  /** Callback when deleting a minion */
  onDelete: () => void;
  /** Whether minion is immature (not fully grown) */
  isImmature: boolean;
}

/**
 * Helper function to determine relationship tier based on value
 * @param value - Relationship value (-100 to 100)
 * @returns The appropriate relationship tier object
 */
const getRelationshipTier = (value: number): RelationshipTier => {
  return Object.values(RELATIONSHIP_TIERS).find(tier => value >= tier.threshold) || RELATIONSHIP_TIERS.NEMESIS;
};

/**
 * MinionPanel component displays all player's minions and allows interaction with them
 * @returns The minion panel interface
 */
const MinionPanel: React.FC = () => {
  const { minions, player } = useContext<GameState>(GameStateContext);
  const dispatch = useContext<React.Dispatch<GameAction>>(GameDispatchContext);
  
  // State for dialogs and notifications
  const [assignTraitDialogOpen, setAssignTraitDialogOpen] = useState<boolean>(false);
  const [selectedMinionId, setSelectedMinionId] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  /**
   * Handles sharing trait slots with a minion
   * @param minionId - ID of the minion to share slots with
   * @param slotsToShare - Number of slots to share
   */
  const handleShareSlot = (minionId: string, slotsToShare: number): void => {
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
   * @param minionId - ID of the minion to assign traits to
   */
  const handleAssignTraitClick = (minionId: string): void => {
    setSelectedMinionId(minionId);
    setAssignTraitDialogOpen(true);
  };

  /**
   * Handles assigning a trait to a minion from the dialog
   * @param traitId - ID of the trait to assign
   */
  const handleAssignTrait = (traitId: string): void => {
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
   * @param minionId - ID of the minion
   * @param traitId - ID of the trait to remove
   */
  const handleRemoveTrait = (minionId: string, traitId: string): void => {
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
   * @param minionId - ID of the minion to delete
   */
  const handleDeleteMinion = (minionId: string): void => {
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
  const handleCloseNotification = (): void => {
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
