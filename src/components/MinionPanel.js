import React, { useContext, useState } from 'react';
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
  DialogActions
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './Panel';
import { traits } from '../modules/data/traits';

const MinionCard = ({ minion, onAssignTrait, onRemoveTrait, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{minion.name}</Typography>
          <Tooltip title="Dismiss Minion">
            <IconButton color="error" onClick={onDelete} size="small">
              <DeleteIcon />
            </IconButton>
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
        >
          Assign Trait
        </Button>
      </CardContent>
    </Card>
  );
};

const MinionPanel = () => {
  const { essence, player, minions = [] } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [minionName, setMinionName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTraitDialog, setShowTraitDialog] = useState(false);
  const [selectedMinionId, setSelectedMinionId] = useState(null);

  const MINION_COST = 50;
  const MAX_MINIONS = 5;

  const handleCreateMinion = () => {
    if (essence >= MINION_COST && minions.length < MAX_MINIONS) {
      dispatch({
        type: 'CREATE_MINION',
        payload: { 
          name: minionName,
          traits: []
        }
      });
      dispatch({
        type: 'SPEND_ESSENCE',
        payload: MINION_COST
      });
      setMinionName('');
      setShowCreateDialog(false);
    }
  };

  const handleAssignTrait = (minionId, traitId) => {
    dispatch({
      type: 'ASSIGN_MINION_TRAIT',
      payload: {
        minionId,
        traitId
      }
    });
    setShowTraitDialog(false);
  };

  const handleRemoveTrait = (minionId, traitId) => {
    dispatch({
      type: 'REMOVE_MINION_TRAIT',
      payload: {
        minionId,
        traitId
      }
    });
  };

  const handleDeleteMinion = (minionId) => {
    dispatch({
      type: 'DELETE_MINION',
      payload: minionId
    });
  };

  const availableTraits = player.acquiredTraits.filter(traitId => {
    const minion = minions.find(m => m.id === selectedMinionId);
    return !minion?.traits.includes(traitId);
  });

  return (
    <Panel title="Minion Management">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Minions ({minions.length}/{MAX_MINIONS})
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowCreateDialog(true)}
            disabled={essence < MINION_COST || minions.length >= MAX_MINIONS}
          >
            Create Minion ({MINION_COST} essence)
          </Button>
        </Box>

        <Grid container spacing={2}>
          {minions.map(minion => (
            <Grid item xs={12} sm={6} md={4} key={minion.id}>
              <MinionCard
                minion={minion}
                onAssignTrait={() => {
                  setSelectedMinionId(minion.id);
                  setShowTraitDialog(true);
                }}
                onRemoveTrait={(traitId) => handleRemoveTrait(minion.id, traitId)}
                onDelete={() => handleDeleteMinion(minion.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Create Minion Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
      >
        <DialogTitle>Create New Minion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Minion Name"
            fullWidth
            value={minionName}
            onChange={(e) => setMinionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateMinion}
            variant="contained"
            disabled={!minionName.trim() || essence < MINION_COST}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Trait Dialog */}
      <Dialog
        open={showTraitDialog}
        onClose={() => setShowTraitDialog(false)}
      >
        <DialogTitle>Assign Trait</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {availableTraits.map(traitId => {
              const trait = traits.copyableTraits[traitId];
              return (
                <Grid item xs={12} key={traitId}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAssignTrait(selectedMinionId, traitId)}
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{trait.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trait.description}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              );
            })}
            {availableTraits.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  No traits available to assign
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTraitDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Panel>
  );
};

export default MinionPanel;