import React, { useState, useContext, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper, 
  Grid, 
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
import TraitCard from './TraitCardOld';
import EmptySlotCard from './EmptySlotCard';
import TraitSlotProgressIndicator from './TraitSlotProgressIndicator';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`traits-tabpanel-${index}`}
      aria-labelledby={`traits-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const IntegratedTraitsPanel = () => {
  const { player } = useGameState();
  const dispatch = useGameDispatch();
  
  const { acquiredTraits = [], equippedTraits = [] } = player || {};
  
  // Custom hotkey categories specific to trait management
  const traitHotkeyCategories = [
    {
      name: "Trait Management",
      hotkeys: [
        { keys: ["Drag"], description: "Equip a trait to a slot" },
        { keys: ["Click"], description: "Unequip a trait" },
        { keys: ["Shift", "1-8"], description: "Quick unequip from slots 1-8" },
        { keys: ["T"], description: "Toggle traits panel" }
      ]
    }
  ];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Character Traits 
        </Typography>
        <HotkeyHelpTooltip 
          hotkeyCategories={traitHotkeyCategories}
          title="Trait Management Controls"
          placement="right"
        />
      </Box>
      
      {acquiredTraits.length > 0 ? (
        <Grid container spacing={2}>
          {acquiredTraits.map((trait) => (
            <Grid item xs={12} sm={6} md={4} key={trait.id}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: equippedTraits.includes(trait.id) ? 'action.selected' : 'background.paper'
                }}
              >
                <Typography variant="subtitle1">{trait.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {trait.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">
          You haven't acquired any traits yet. Explore the world to discover new traits.
        </Typography>
      )}
    </Box>
  );
};

export default IntegratedTraitsPanel;

// src/components/npcs/NPCPanel.js
import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  ListItemAvatar,
  Chip,
  Button,
  Badge,
  Paper,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Panel from '../ui/Panel';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
import { useNavigate } from 'react-router-dom';

const NPCPanel = () => {
  const { npcs, player, tutorial } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const navigate = useNavigate();
  
  // Active location is either from tutorial or default to woodhaven
  const activeLocation = tutorial?.currentLocation || 'woodhaven';
  
  // Filter NPCs by current location
  const locationNPCs = npcs.filter(npc => npc.location === activeLocation);
  
  // Handle NPC interaction
  const handleNPCClick = (npc) => {
    // If this is the first NPC interaction and tutorial is active
    if (tutorial?.active && tutorial?.step === 'meetFirstNPC' && npc.id === tutorial?.targetNPCId) {
      // Mark this tutorial step as complete
      dispatch({ 
        type: 'TUTORIAL_PROGRESS', 
        payload: { step: 'meetFirstNPC', completed: true }
      });
      
      // Move to next tutorial step
      dispatch({
        type: 'SET_TUTORIAL_STEP',
        payload: 'acquireFirstTrait'
      });
    }
    
    // Navigate to NPC detail view
    navigate(`/npc/${npc.id}`);
  };
  
  // If no NPCs found in this location
  if (locationNPCs.length === 0) {
    return (
      <Panel title="Town Residents">
        <Typography variant="body2" color="text.secondary">
          There doesn't seem to be anyone around here.
        </Typography>
      </Panel>
    );
  }
  
  // Tutorial highlight for the target NPC
  const highlightNPC = tutorial?.active && tutorial?.step === 'meetFirstNPC' ? tutorial.targetNPCId : null;
  
  return (
    <Panel title={`${activeLocation.charAt(0).toUpperCase() + activeLocation.slice(1)} Residents`}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        People you can interact with in this area:
      </Typography>
      <List sx={{ pt: 0 }}>
        {locationNPCs.map(npc => {
          // Check if this NPC has been met before
          const hasInteracted = (player.metNPCs || []).includes(npc.id);
          const isHighlighted = npc.id === highlightNPC;
          
          return (
            <Paper 
              key={npc.id} 
              elevation={isHighlighted ? 3 : 1}
              sx={{ 
                mb: 1.5, 
                position: 'relative',
                border: isHighlighted ? '2px solid' : 'none',
                borderColor: isHighlighted ? 'primary.main' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {isHighlighted && (
                <Chip 
                  label="Talk to this NPC" 
                  color="primary"
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 10,
                    zIndex: 2
                  }} 
                />
              )}
              <ListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => handleNPCClick(npc)}
              >
                <ListItemAvatar>
                  <Badge 
                    color={hasInteracted ? "success" : "default"}
                    variant="dot"
                    overlap="circular"
                    invisible={!hasInteracted}
                  >
                    <Avatar sx={{ bgcolor: npc.hasTrait ? 'secondary.main' : 'primary.main' }}>
                      {npc.hasTrait ? <AutoFixHighIcon /> : <PersonIcon />}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {npc.name}
                      {npc.hasTrait && (
                        <Chip 
                          label="Has Trait" 
                          size="small" 
                          color="secondary" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={npc.description}
                  primaryTypographyProps={{
                    fontWeight: isHighlighted ? 'bold' : 'regular'
                  }}
                />
                <ArrowForwardIcon fontSize="small" color="action" />
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Panel>
  );
};

export default NPCPanel;

// src/components/npcs/NPCDetailView.js
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
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';
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

// src/components/combat/TutorialCombat.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { GameStateContext, GameDispatchContext } from '../../../../context/GameStateContext';

const TutorialCombat = () => {
  const { player, tutorial, traits } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const navigate = useNavigate();
  
  // Local state
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [combatLog, setCombatLog] = useState([]);
  const [combatTurn, setCombatTurn] = useState(0);
  const [combatEnded, setCombatEnded] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
  
  // Tutorial monster
  const monster = {
    name: "Skittering Crawler",
    description: "A large insect with menacing pincers. It seems weak to direct attacks.",
    image: "🦂", // You could use an actual image path here
    health: 50,
    attackPower: 5
  };
  
  // Check if player has the necessary trait
  const tutorialTraitId = tutorial?.requiredTraitId;
  const hasTutorialTrait = player.acquiredTraits?.includes(tutorialTraitId);
  const equippedTraits = player.equippedTraits || [];
  const hasTraitEquipped = equippedTraits.includes(tutorialTraitId);
  
  // Get trait details
  const tutorialTrait = traits?.copyableTraits?.[tutorialTraitId];
  
  // Combat functions
  const attackMonster = () => {
    let damage = 10; // Base damage
    let message = "You strike the monster!";
    
    // Bonus damage if the tutorial trait is equipped
    if (hasTraitEquipped) {
      damage *= 2;
      message = `You use ${tutorialTrait?.name} for a powerful attack!`;
    }
    
    const newMonsterHealth = Math.max(0, monsterHealth - damage);
    setMonsterHealth(newMonsterHealth);
    addToCombatLog(message, `Damage: ${damage}`);
    
    if (newMonsterHealth <= 0) {
      endCombat(true);
      return;
    }
    
    // Monster's turn
    setTimeout(monsterAttack, 1000);
  };
  
  const monsterAttack = () => {
    const damage = monster.attackPower;
    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    addToCombatLog("The monster attacks!", `You take ${damage} damage`);
    
    setCombatTurn(prev => prev + 1);
    
    if (newPlayerHealth <= 0) {
      endCombat(false);
    }
  };
  
  const equipTrait = () => {
    if (hasTutorialTrait && !hasTraitEquipped) {
      dispatch({
        type: 'EQUIP_TRAIT',
        payload: { traitId: tutorialTraitId, slotIndex: 0 }
      });
      addToCombatLog(`You equipped ${tutorialTrait?.name}!`, "Ready to fight!");
    }
  };
  
  const addToCombatLog = (action, result) => {
    setCombatLog(prev => [
      { action, result, turn: combatTurn },
      ...prev
    ].slice(0, 10)); // Keep only last 10 entries
  };
  
  const endCombat = (victory) => {
    setCombatEnded(true);
    
    if (victory) {
      setShowVictoryDialog(true);
      
      // Complete tutorial step if active
      if (tutorial?.active && tutorial.step === 'findFirstMonster') {
        dispatch({
          type: 'TUTORIAL_PROGRESS',
          payload: { step: 'findFirstMonster', completed: true }
        });
        
        // Complete tutorial
        dispatch({
          type: 'COMPLETE_TUTORIAL'
        });
        
        // Give rewards
        dispatch({
          type: 'ADD_ESSENCE',
          payload: 100
        });
      }
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Combat Encounter
      </Typography>
      
      {/* Combat area */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Player section */}
          <Grid item xs={5}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  You
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Health
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={playerHealth} 
                    sx={{ height: 10, borderRadius: 1 }}
                    color={playerHealth > 50 ? "success" : playerHealth > 25 ? "warning" : "error"}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {playerHealth}/100
                  </Typography>
                </Box>
                
                {/* Equipped traits */}
                <Typography variant="body2" gutterBottom>
                  Equipped Traits
                </Typography>
                {hasTraitEquipped ? (
                  <Chip 
                    icon={<AutoFixHighIcon />}
                    label={tutorialTrait?.name || "Combat Trait"} 
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                ) : hasTutorialTrait ? (
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={equipTrait}
                    sx={{ mb: 1 }}
                  >
                    Equip {tutorialTrait?.name}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No combat traits equipped
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* VS */}
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4">VS</Typography>
          </Grid>
          
          {/* Monster section */}
          <Grid item xs={5}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {monster.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Health
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={monsterHealth} 
                    sx={{ height: 10, borderRadius: 1 }}
                    color="error"
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {monsterHealth}/100
                  </Typography>
                </Box>
                
                <Typography variant="body2">
                  {monster.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Combat actions */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            disabled={combatEnded}
            onClick={attackMonster}
          >
            Attack
          </Button>
          
          <Button 
            variant="outlined"
            disabled={combatEnded}
            onClick={() => {
              navigate(-1);
            }}
          >
            Flee
          </Button>
        </Box>
      </Paper>
      
      {/* Combat tutorial */}
      {tutorial?.active && tutorial.step === 'findFirstMonster' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Your first combat! Use your newly acquired trait to defeat the monster.
          </Typography>
          {!hasTraitEquipped && hasTutorialTrait && (
            <Button 
              color="info"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={equipTrait}
            >
              Equip Combat Trait
            </Button>
          )}
        </Alert>
      )}
      
      {/* Combat log */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Combat Log
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {combatLog.length > 0 ? (
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {combatLog.map((entry, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Turn {entry.turn}: {entry.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.result}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No actions yet.
          </Typography>
        )}
      </Paper>
      
      {/* Victory Dialog */}
      <Dialog 
        open={showVictoryDialog}
        onClose={() => setShowVictoryDialog(false)}
      >
        <DialogTitle>Victory!</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            You've defeated the {monster.name}!
          </Typography>
          <Typography variant="body2" paragraph>
            You've learned the basics of combat and trait usage. This will serve you well on your journey.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Rewards:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Chip label="100 Essence" color="primary" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowVictoryDialog(false);
              navigate('/');
            }}
            variant="contained"
          >
            Continue Your Journey
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TutorialCombat;

// src/context/GameStateContext.js
// Add tutorial to your initial state
const initialState = {
  // ...existing state,
  tutorial: {
    active: true, // Start with tutorial active
    step: 'meetFirstNPC', // First step in tutorial flow
    targetNPCId: 'mentor', // ID of the tutorial NPC
    requiredTraitId: 'basicAttack', // ID of the trait needed for tutorial
    completedSteps: [],
    currentLocation: 'woodhaven' // Default starting location
  }
}

// Add tutorial-related reducer cases
const gameStateReducer = (state, action) => {
  switch (action.type) {
    // ...existing cases

    case 'TUTORIAL_PROGRESS':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          completedSteps: [
            ...state.tutorial.completedSteps,
            action.payload.step
          ]
        }
      };

    case 'SET_TUTORIAL_STEP':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          step: action.payload
        }
      };

    case 'COMPLETE_TUTORIAL':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          active: false
        }
      };

    case 'MEET_NPC':
      return {
        ...state,
        player: {
          ...state.player,
          metNPCs: [...(state.player.metNPCs || []), action.payload.npcId]
        }
      };

    case 'INCREASE_RELATIONSHIP':
      return {
        ...state,
        npcs: state.npcs.map(npc => 
          npc.id === action.payload.npcId 
            ? { ...npc, relationship: (npc.relationship || 0) + action.payload.amount }
            : npc
        )
      };
      
    // ... other cases
  }
};

// Add this to your initial state or seed data
const initialNpcs = [
  {
    id: 'mentor',
    name: 'Master Elysia',
    type: 'Mentor',
    title: 'Sage of Woodhaven',
    description: 'A wise elder who has lived in Woodhaven for generations. Known for teaching combat skills to young adventurers.',
    location: 'woodhaven',
    relationship: 0,
    hasTrait: true,
    traitId: 'basicAttack', // ID of the trait this NPC can teach
    dialogue: {
      greeting: "Welcome, young one. The world grows more dangerous by the day. Perhaps I can teach you something that might help you survive."
    },
    background: "Elysia was once a renowned warrior who traveled the world before settling in Woodhaven. She now passes her knowledge to the next generation.",
    hint: "Ask about special abilities to learn a combat trait that will help you defeat monsters."
  },
  // Add more NPCs as needed
];

// Add this to your traits data
const initialTraits = {
  copyableTraits: {
    basicAttack: {
      name: 'Basic Attack',
      type: 'Combat',
      description: 'A fundamental combat technique that focuses your strikes for increased damage against enemies.',
      essenceCost: 0, // Free for tutorial
      effect: {
        combat: {
          damageMultiplier: 2
        }
      }
    },
    // Other traits...
  }
};

import { Routes, Route } from 'react-router-dom';
import NPCDetailView from './components/npcs/NPCDetailView';
import TutorialCombat from './components/combat/TutorialCombat';
import GameContainer from './components/GameContainer';

// Inside your App component
<Routes>
  <Route path="/" element={<GameContainer />} />
  <Route path="/npc/:npcId" element={<NPCDetailView />} />
  <Route path="/combat/tutorial" element={<TutorialCombat />} />
  {/* Other routes */}
</Routes>

// Add to GameContainer.js
import Alert from '@mui/material/Alert';

// Inside your render method, before or after BreadcrumbNav
{tutorial?.active && tutorial.step === 'meetFirstNPC' && (
  <Alert 
    severity="info" 
    sx={{ mb: 2 }}
    onClose={() => setShowTutorial(false)}
  >
    Welcome to your adventure! To get started, speak with {npcs.find(n => n.id === tutorial.targetNPCId)?.name} in Woodhaven.
  </Alert>
)}