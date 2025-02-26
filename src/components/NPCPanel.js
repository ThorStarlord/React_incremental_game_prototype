import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  LinearProgress,
  Avatar,
  Tooltip,
  Divider,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { GameStateContext, GameDispatchContext, createEssenceAction } from '../context/GameStateContext';
import { RELATIONSHIP_TIERS } from '../config/gameConstants';
import Panel from './Panel';

const getRelationshipTier = (value) => {
  return Object.values(RELATIONSHIP_TIERS).find(tier =>
    value >= tier.threshold
  ) || RELATIONSHIP_TIERS.NEMESIS;
};

const DialogueOption = ({ option, onSelect, disabled }) => (
  <Button
    fullWidth
    variant="outlined"
    onClick={() => onSelect(option)}
    disabled={disabled}
    sx={{
      my: 1,
      textAlign: 'left',
      justifyContent: 'flex-start',
      whiteSpace: 'normal',
      height: 'auto',
      p: 1.5
    }}
  >
    {option.text}
  </Button>
);

const NPCPanel = ({ npcId }) => {
  const { npcs, essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const npc = npcs.find(n => n.id === npcId);
  const [showResponse, setShowResponse] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showInsufficientEssenceAlert, setShowInsufficientEssenceAlert] = useState(false);

  useEffect(() => {
    if (npc && !currentDialogue) {
      setCurrentDialogue(npc.dialogue?.initial || {
        text: npc.greeting,
        options: npc.dialogue?.options || []
      });
    }
  }, [npc, currentDialogue]);

  useEffect(() => {
    let timer;
    if (showInsufficientEssenceAlert) {
      timer = setTimeout(() => {
        setShowInsufficientEssenceAlert(false);
      }, 3000); // Hide the alert after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showInsufficientEssenceAlert]);

  const handleInfluence = (cost) => {
    if (essence >= cost) {
      dispatch(createEssenceAction.spend(cost));
      dispatch({
        type: 'UPDATE_NPC_RELATIONSHIP',
        payload: { npcId, changeAmount: 10 }
      });
      setOpenSnackbar(true);
    } else {
      setShowInsufficientEssenceAlert(true);
    }
  };

  const handleDialogueChoice = (option) => {
    setShowResponse(true);
    if (option.relationshipChange) {
      dispatch({
        type: 'UPDATE_NPC_RELATIONSHIP',
        payload: { npcId: npc.id, changeAmount: option.relationshipChange }
      });
    }
    if (option.stateChanges) {
      dispatch({
        type: 'UPDATE_DIALOGUE_STATE',
        payload: { npcId: npc.id, dialogueState: option.stateChanges }
      });
    }
    if (option.nextDialogue) {
      setTimeout(() => {
        setCurrentDialogue(option.nextDialogue);
        setShowResponse(false);
      }, 1000);
    }
  };

  if (!npc) return null;

  const relationship = npc.relationship || 0;
  const relationshipTier = getRelationshipTier(relationship);
  const essenceRate = relationshipTier.essenceRate;
  const influenceCost = (npc.powerLevel || 1) * 10;

  return (
    <Panel title={`Conversation with ${npc.name}`}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <Avatar
          src={npc.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`}
          sx={{ width: 64, height: 64 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{npc.name}</Typography>
            <Chip
              icon={<FavoriteIcon />}
              label={relationshipTier.name}
              sx={{
                backgroundColor: relationshipTier.color,
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {npc.type} - {npc.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">Relationship: {relationship}/100</Typography>
                  {essenceRate > 0 && (
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'success.light' }}>
                      Generates {essenceRate} essence/minute
                    </Typography>
                  )}
                </Box>
              }
              arrow
              placement="right"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(relationship + 100) / 2}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: relationshipTier.color
                    }
                  }}
                />
                {essenceRate > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AutoGraphIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    <Typography variant="caption" color="success.main">
                      +{essenceRate}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: 'background.default',
          minHeight: 100,
          mb: 2
        }}
      >
        <Fade in={!showResponse} timeout={500}>
          <Typography variant="body1">
            {currentDialogue?.text || npc.greeting}
          </Typography>
        </Fade>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {currentDialogue?.options?.map((option, index) => (
          <DialogueOption
            key={index}
            option={option}
            onSelect={handleDialogueChoice}
            disabled={
              showResponse ||
              (option.requiresRelationship && relationship < option.requiresRelationship)
            }
          />
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Tooltip
          title={essence < influenceCost ? `Need ${influenceCost} essence` : `Spend ${influenceCost} essence to boost relationship by 10`}
          arrow
        >
          <span>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleInfluence(influenceCost)}
              disabled={essence < influenceCost || relationship >= 100}
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              Influence ({influenceCost} Essence)
            </Button>
          </span>
        </Tooltip>
      </Box>
      {showInsufficientEssenceAlert && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Not enough Essence!
        </Alert>
      )}
      {currentDialogue?.options?.length === 0 && (
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setCurrentDialogue(npc.dialogue?.initial)}
          sx={{ mt: 2 }}
        >
          Start Over
        </Button>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Relationship with {npc.name} increased by 10!
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default NPCPanel;
