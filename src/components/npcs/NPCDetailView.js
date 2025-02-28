import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Slide
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import TraitCard from '../traits/TraitCard';

const NPCDetailView = () => {
  const { npcId } = useParams();
  const { npcs, player, traits, tutorial } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const navigate = useNavigate();
  
  // State
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [showTraitDialog, setShowTraitDialog] = useState(false);
  const [showTutorialHint, setShowTutorialHint] = useState(false);
  
  // Find the NPC
  const npc = npcs.find(n => n.id === npcId);
  
  // If NPC doesn't exist, redirect
  useEffect(() => {
    if (!npc) {
      navigate('/');
    } else if (!player.metNPCs?.includes(npc.id)) {
      // Mark NPC as met if first time
      dispatch({
        type: 'MEET_NPC',
        payload: { npcId: npc.id }
      });
    }
  }, [npc, navigate, dispatch, player.metNPCs, npcId]);
  
  // Check if this is a tutorial NPC and update hints
  useEffect(() => {
    if (tutorial?.active && tutorial.targetNPCId === npcId && tutorial.step === 'acquireFirstTrait') {
      setShowTutorialHint(true);
    }
  }, [tutorial, npcId]);
  
  // Exit early if NPC not found
  if (!npc) return null;
  
  // Find the trait this NPC can offer (for tutorial)
  const availableTrait = traits?.copyableTraits?.[npc.traitId];
  
  // Function to handle trait acquisition
  const handleAcquireTrait = () => {
    if (selectedTrait) {
      // Add trait to player's acquired traits
      dispatch({
        type: 'ACQUIRE_TRAIT',
        payload: selectedTrait.id
      });
      
      // Update tutorial if this was part of it
      if (tutorial?.active && tutorial.step === 'acquireFirstTrait') {
        dispatch({ 
          type: 'TUTORIAL_PROGRESS', 
          payload: { step: 'acquireFirstTrait', completed: true }
        });
        
        // Move to combat tutorial step
        dispatch({
          type: 'SET_TUTORIAL_STEP',
          payload: 'findFirstMonster'
        });
      }
      
      setShowTraitDialog(false);
      setShowTutorialHint(false);
    }
  };
  
  // Function to handle showing trait dialog
  const handleShowTrait = () => {
    setSelectedTrait({
      id: npc.traitId,
      ...availableTrait
    });
    setShowTraitDialog(true);
  };
  
  return (
    <Box>
      {/* Back button */}
      <IconButton 
        onClick={() => navigate(-1)} 
        aria-label="back"
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon /> 
        <Typography sx={{ ml: 1 }}>Back</Typography>
      </IconButton>
      
      {/* NPC Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: npc.hasTrait ? 'secondary.main' : 'primary.main' 
            }}
          >
            {npc.hasTrait ? <AutoFixHighIcon sx={{ fontSize: 40 }} /> : <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <Box>
            <Typography variant="h4">{npc.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {npc.title || npc.type}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          {npc.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`Location: ${npc.location}`} />
          {player.metNPCs?.includes(npc.id) && (
            <Chip 
              icon={<CheckCircleOutlineIcon />}
              label="Met" 
              color="success" 
              variant="outlined"
            />
          )}
          {npc.hasTrait && !player.acquiredTraits?.includes(npc.traitId) && (
            <Chip 
              icon={<AutoFixHighIcon />}
              label="Has Trait to Share" 
              color="secondary" 
            />
          )}
        </Box>
      </Paper>
      
      {/* Tutorial hint */}
      {showTutorialHint && (
        <Slide direction="up" in={showTutorialHint}>
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            onClose={() => setShowTutorialHint(false)}
          >
            This NPC has knowledge to share. Ask them about special abilities!
          </Alert>
        </Slide>
      )}
      
      {/* Interaction Options */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Talk to {npc.name}
              </Typography>
              <Typography variant="body2" paragraph>
                {npc.dialogue?.greeting || `Hello there! I'm ${npc.name}. How can I help you today?`}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => {
                    // Generic chat - could add relationship boost here
                    dispatch({
                      type: 'INCREASE_RELATIONSHIP',
                      payload: { npcId: npc.id, amount: 1 }
                    });
                  }}
                >
                  General Conversation
                </Button>
                
                {npc.hasTrait && availableTrait && !player.acquiredTraits?.includes(npc.traitId) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 1 }}
                    startIcon={<AutoFixHighIcon />}
                    onClick={handleShowTrait}
                  >
                    Ask About Special Abilities
                  </Button>
                )}
                
                {tutorial?.active && tutorial.step === 'findFirstMonster' && tutorial.targetNPCId === npcId && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => {
                      // Navigate to monster encounter
                      navigate('/combat/tutorial');
                    }}
                  >
                    Ask About Nearby Threats
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About {npc.name}
              </Typography>
              <Typography variant="body2">
                {npc.background || "This character has a mysterious past."}
              </Typography>
              
              {npc.hint && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {npc.hint}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Trait Acquisition Dialog */}
      <Dialog 
        open={showTraitDialog}
        onClose={() => setShowTraitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Acquire New Trait</DialogTitle>
        <DialogContent>
          {selectedTrait && (
            <Box sx={{ p: 1 }}>
              <Typography variant="body1" paragraph>
                {npc.name} offers to teach you a special ability called "{selectedTrait.name}".
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <TraitCard trait={selectedTrait} />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Would you like to learn this trait?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTraitDialog(false)}>
            Not Now
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<AutoFixHighIcon />}
            onClick={handleAcquireTrait}
          >
            Learn Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NPCDetailView;