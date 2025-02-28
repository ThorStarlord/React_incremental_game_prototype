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

import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { GameStateContext } from '../context/GameStateContext';
import MinionCard from './MinionCard';
import Panel from './Panel';

const MinionPanel = () => {
  const { minions } = useContext(GameStateContext);
  
  return (
    <Panel title="Your Minions">
      {minions && minions.length > 0 ? (
        <Grid container spacing={3}>
          {minions.map(minion => (
            <Grid item xs={12} md={6} lg={4} key={minion.id}>
              <MinionCard minion={minion} />
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
    </Panel>
  );
};

export default MinionPanel;