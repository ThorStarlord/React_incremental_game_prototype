import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import InfluenceMilestoneCard from './InfluenceMilestoneCard';

const CharacterPanel = ({ characterId }) => {
  const { npcs, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // Find character data - could be from NPCs or player's created/controlled characters
  const character = npcs.find(c => c.id === characterId);
  
  if (!character) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">Character not found</Typography>
      </Box>
    );
  }
  
  // Get next influence milestone
  const getNextMilestone = () => {
    if (character.playerCreated || character.influenceLevel >= 100) return null;
    
    for (let threshold of character.influenceThresholds || [20, 40, 60, 80, 100]) {
      if (character.influenceLevel < threshold) {
        const milestoneData = character.influenceUnlocks?.find(m => m.level === threshold);
        return milestoneData || { level: threshold, feature: 'Influence Milestone', description: 'Increases your control' };
      }
    }
    return null;
  };
  
  const nextMilestone = getNextMilestone();
  
  // Handle influence action (this would be triggered by various in-game actions)
  const handleInfluenceAction = () => {
    dispatch({
      type: 'INCREASE_CHARACTER_INFLUENCE',
      payload: {
        characterId: character.id,
        amount: 5 // Example value, would depend on action
      }
    });
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                mb: 2,
                bgcolor: character.playerCreated 
                  ? 'success.main' 
                  : character.playerControlled 
                    ? 'success.light' 
                    : 'primary.main'  
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            
            <Typography variant="h5" gutterBottom>{character.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {character.role || 'Character'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {character.playerCreated && (
                <Chip label="Player Created" color="success" />
              )}
              {character.playerControlled && !character.playerCreated && (
                <Chip label="Fully Controlled" color="success" />
              )}
              {character.powerLevel > 1 && (
                <Chip label={`Power ${character.powerLevel}x`} color="warning" />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Character Stats</Typography>
              <Grid container spacing={2}>
                {/* Display character stats here */}
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">Strength</Typography>
                  <Typography variant="body1">{character.stats?.strength || 0}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">Intelligence</Typography>
                  <Typography variant="body1">{character.stats?.intelligence || 0}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">Charisma</Typography>
                  <Typography variant="body1">{character.stats?.charisma || 0}</Typography>
                </Grid>
              </Grid>
            </Box>
            
            {/* Influence section - only shown for non-created characters */}
            {!character.playerCreated && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Character Influence {character.playerControlled && "• Complete"}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      Influence Level: {character.influenceLevel}%
                    </Typography>
                    {nextMilestone && (
                      <Typography variant="body2" color="primary">
                        Next: {nextMilestone.level}%
                      </Typography>
                    )}
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={character.influenceLevel}
                    sx={{ 
                      height: 10, 
                      borderRadius: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundImage: character.playerControlled 
                          ? 'none'
                          : 'linear-gradient(90deg, #2196f3, #4caf50)'
                      } 
                    }} 
                  />
                </Box>
                
                {!character.playerControlled && (
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<LockOpenIcon />}
                    onClick={handleInfluenceAction}
                    sx={{ mt: 1 }}
                  >
                    Increase Influence
                  </Button>
                )}
              </Box>
            )}
            
            {/* Relationship info */}
            <Box>
              <Typography variant="h6" gutterBottom>Relationship</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={character.relationship || 0}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 1 }} 
                />
                <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }}>
                  {character.relationship || 0}/100
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Influence milestones section */}
      {!character.playerCreated && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Influence Milestones</Typography>
          <Grid container spacing={2}>
            {(character.influenceUnlocks || []).map((milestone, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <InfluenceMilestoneCard 
                  milestone={milestone}
                  unlocked={character.influenceLevel >= milestone.level}
                  current={nextMilestone?.level === milestone.level}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Character actions section */}
      <Box>
        <Typography variant="h6" gutterBottom>Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              fullWidth
              variant="outlined"
              disabled={!character.playerControlled && !character.playerCreated}
            >
              Assign to Mission
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              fullWidth
              variant="outlined"
              disabled={!character.playerControlled && !character.playerCreated}
            >
              Edit Character
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              fullWidth
              variant="outlined"
              color="secondary"
            >
              View Traits
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CharacterPanel;