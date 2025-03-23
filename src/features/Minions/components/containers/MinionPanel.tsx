import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useGameState, useGameDispatch } from '../../../../context/GameStateExports';
import MinionCard from '../ui/MinionCard';
import Panel from '../ui/Panel';

/**
 * Interface representing a trait object
 */
interface Trait {
  id: string;
  name: string;
  description: string;
  type: string;
  stats?: Record<string, number>;
}

/**
 * Interface representing a minion object
 */
interface Minion {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  traits: string[];
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    endurance: number;
    [key: string]: number;
  };
  skills: {
    [key: string]: number;
  };
  tasks: string[];
  relationship: number;
  maturity: number;
  happiness: number;
  energy: number;
  lastFed?: number;
  createdAt: number;
}

/**
 * Interface representing a relationship tier
 */
interface RelationshipTier {
  name: string;
  threshold: number;
  color: string;
  description: string;
}

/**
 * Constants for relationship tiers
 */
const RELATIONSHIP_TIERS: Record<string, RelationshipTier> = {
  NEMESIS: {
    name: 'Nemesis',
    threshold: -75,
    color: '#FF0000',
    description: 'Hostile and refuses most commands'
  },
  HOSTILE: {
    name: 'Hostile',
    threshold: -50,
    color: '#FF4500',
    description: 'Disobedient and may sabotage tasks'
  },
  WARY: {
    name: 'Wary',
    threshold: -25,
    color: '#FFA500',
    description: 'Cautious and reluctant'
  },
  NEUTRAL: {
    name: 'Neutral',
    threshold: 0,
    color: '#FFFF00',
    description: 'Will follow orders but no initiative'
  },
  FRIENDLY: {
    name: 'Friendly',
    threshold: 25,
    color: '#90EE90',
    description: 'Helpful and occasionally brings gifts'
  },
  LOYAL: {
    name: 'Loyal',
    threshold: 50,
    color: '#32CD32',
    description: 'Dedicated and works efficiently'
  },
  DEVOTED: {
    name: 'Devoted',
    threshold: 75,
    color: '#008000',
    description: 'Extremely loyal with occasional bonuses'
  }
};

/**
 * Props for the MinionPanel component
 */
interface MinionPanelProps {
  title?: string;
}

/**
 * Get the appropriate relationship tier based on the relationship value
 */
const getRelationshipTier = (value: number): RelationshipTier => {
  return Object.values(RELATIONSHIP_TIERS).find(tier => value >= tier.threshold) || RELATIONSHIP_TIERS.NEMESIS;
};

/**
 * MinionPanel component to manage minions
 */
const MinionPanel: React.FC<MinionPanelProps> = ({ title = "Minions" }) => {
  // Get game state and dispatch
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Local state
  const [minions, setMinions] = useState<Minion[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [assignTraitDialogOpen, setAssignTraitDialogOpen] = useState(false);
  const [selectedMinionId, setSelectedMinionId] = useState<string | null>(null);
  const [newMinionName, setNewMinionName] = useState('');
  const [newMinionType, setNewMinionType] = useState('');
  const [selectedTraitId, setSelectedTraitId] = useState<string>('');
  
  // Dummy data for development
  const minionTypes = ['Worker', 'Guard', 'Harvester', 'Scout'];
  const availableTraits: Trait[] = [
    { id: 'trait1', name: 'Strong', description: 'Increased strength', type: 'physical', stats: { strength: 5 } },
    { id: 'trait2', name: 'Quick', description: 'Increased agility', type: 'physical', stats: { agility: 5 } },
    { id: 'trait3', name: 'Smart', description: 'Increased intelligence', type: 'mental', stats: { intelligence: 5 } },
    { id: 'trait4', name: 'Tough', description: 'Increased endurance', type: 'physical', stats: { endurance: 5 } }
  ];
  
  // Initialize or load minions from state
  useEffect(() => {
    // Access minions through minionsSystem instead of directly from gameState
    if (gameState.minionsSystem?.minions) {
      // Convert from Record<string, Minion> to Minion[] to match state type
      const minionsArray = Object.values(gameState.minionsSystem.minions);
      setMinions(minionsArray);
    } else {
      // Create empty minions array if none exists
      setMinions([]);
    }
  }, [gameState.minionsSystem?.minions]);
  
  /**
   * Handle creating a new minion
   */
  const handleCreateMinion = () => {
    if (!newMinionName || !newMinionType) return;
    
    const newMinion: Minion = {
      id: `minion-${Date.now()}`,
      name: newMinionName,
      type: newMinionType,
      level: 1,
      experience: 0,
      traits: [],
      stats: {
        strength: 5,
        agility: 5,
        intelligence: 5,
        endurance: 5
      },
      skills: {},
      tasks: [],
      relationship: 0,
      maturity: 0,
      happiness: 50,
      energy: 100,
      createdAt: Date.now()
    };
    
    dispatch({
      type: 'ADD_MINION',
      payload: newMinion
    });
    
    setCreateDialogOpen(false);
    setNewMinionName('');
    setNewMinionType('');
  };
  
  /**
   * Handle sharing a trait with a minion
   */
  const handleShareTrait = (minionId: string, traitId: string) => {
    dispatch({
      type: 'SHARE_TRAIT',
      payload: { minionId, traitId }
    });
  };
  
  /**
   * Handle removing a trait from a minion
   */
  const handleRemoveTrait = (minionId: string, traitId: string) => {
    dispatch({
      type: 'REMOVE_MINION_TRAIT',
      payload: { minionId, traitId }
    });
  };
  
  /**
   * Handle deleting a minion
   */
  const handleDeleteMinion = (minionId: string) => {
    dispatch({
      type: 'REMOVE_MINION',
      payload: { minionId }
    });
  };
  
  /**
   * Handle assigning a task to a minion
   */
  const handleAssignTask = (minionId: string, taskId: string) => {
    dispatch({
      type: 'ASSIGN_MINION_TASK',
      payload: { minionId, taskId }
    });
  };
  
  /**
   * Open the assign trait dialog for a specific minion
   */
  const handleAssignTraitClick = (minionId: string) => {
    setSelectedMinionId(minionId);
    setAssignTraitDialogOpen(true);
  };
  
  /**
   * Share a skill between minions
   */
  const handleShareSlot = (sourceId: string, targetId: string) => {
    console.log(`Sharing slots between ${sourceId} and ${targetId}`);
    // Implement sharing logic here
  };
  
  /**
   * Assign selected trait to the minion
   */
  const handleAssignTrait = (traitId: string) => {
    if (!selectedMinionId || !traitId) return;
    
    handleShareTrait(selectedMinionId, traitId);
    setAssignTraitDialogOpen(false);
    setSelectedTraitId('');
  };
  
  return (
    <Panel title={title}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1">
          Manage your minions, assign them tasks, and share traits.
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Minion
        </Button>
      </Box>
      
      {minions.length > 0 ? (
        <Grid container spacing={2}>
          {minions.map(minion => {
            const relationshipTier = getRelationshipTier(minion.relationship);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={minion.id}>
                <MinionCard
                  minion={minion}
                  relationshipTier={relationshipTier}
                  assignedTasks={minion.tasks}
                  onAssignTask={(taskId) => handleAssignTask(minion.id, taskId)}
                  onShareTrait={(traitId) => handleShareTrait(minion.id, traitId)}
                  onShareSlot={handleShareSlot}
                  onAssignTrait={handleAssignTraitClick}
                  onRemoveTrait={(traitId: string) => handleRemoveTrait(minion.id, traitId)}
                  onDelete={() => handleDeleteMinion(minion.id)}
                  isImmature={minion.maturity < 100}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You don't have any minions yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first minion to help with tasks
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Minion
          </Button>
        </Box>
      )}
      
      {/* Create Minion Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Minion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Minion Name"
            fullWidth
            value={newMinionName}
            onChange={(e) => setNewMinionName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Minion Type</InputLabel>
            <Select
              value={newMinionType}
              label="Minion Type"
              onChange={(e) => setNewMinionType(e.target.value)}
            >
              {minionTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateMinion} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Assign Trait Dialog */}
      <Dialog open={assignTraitDialogOpen} onClose={() => setAssignTraitDialogOpen(false)}>
        <DialogTitle>Assign Trait</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Trait</InputLabel>
            <Select
              value={selectedTraitId}
              label="Select Trait"
              onChange={(e) => setSelectedTraitId(e.target.value)}
            >
              {availableTraits.map(trait => (
                <MenuItem key={trait.id} value={trait.id}>
                  {trait.name} - {trait.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignTraitDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleAssignTrait(selectedTraitId)}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Panel>
  );
};

export default MinionPanel;
