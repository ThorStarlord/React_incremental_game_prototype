import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { ACTION_TYPES } from '../../../../constants/actionTypes';

/**
 * DialogueTab - Component for handling NPC dialogue interactions
 * 
 * @param {Object} props
 * @param {Object} props.currentDialogue - Current dialogue object
 * @param {Function} props.setCurrentDialogue - Function to update dialogue
 * @param {Object} props.npc - The NPC data
 * @param {string} props.npcId - The NPC's unique ID
 * @param {Object} props.player - Player data
 * @param {Function} props.dispatch - Game state dispatch function
 * @param {Function} props.handleRelationshipChange - Function to update relationship
 * @returns {JSX.Element} Dialogue interaction component
 */
const DialogueTab = ({
  currentDialogue,
  setCurrentDialogue,
  npc,
  npcId,
  player,
  dispatch,
  handleRelationshipChange
}) => {
  // Handle dialogue option selection
  const handleDialogueOption = (option) => {
    // Update relationship if the option changes it
    if (option.relationshipChange) {
      handleRelationshipChange(option.relationshipChange);
    }

    // Track that this dialogue option was selected
    if (option.id) {
      dispatch({
        type: ACTION_TYPES.MARK_DIALOGUE_OPTION_SELECTED,
        payload: {
          npcId,
          dialogueId: currentDialogue.id,
          optionId: option.id
        }
      });
    }

    // Navigate to next dialogue if provided
    if (option.next && npc.dialogue[option.next]) {
      setCurrentDialogue(npc.dialogue[option.next]);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_DIALOGUE_STATE, 
        payload: { npcId, dialogueBranch: option.next } 
      });
    }
  };

  // If no dialogue is available
  if (!currentDialogue) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }}>
        <Typography variant="body1">
          There's not much more to discuss at the moment.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}>
        <Typography variant="h6" gutterBottom>
          {npc.name}
        </Typography>
        <Typography variant="body1">
          {currentDialogue.text}
        </Typography>
      </Paper>

      <Stack spacing={1} sx={{ mt: 3 }}>
        {currentDialogue.options && currentDialogue.options.map((option, index) => {
          // Check if option has requirements and if they are met
          const optionDisabled = option.requires && !option.requires.every(req => {
            if (req.trait) return player.traits && player.traits.includes(req.trait);
            if (req.skill) return player.skills && player.skills[req.skill] >= req.level;
            return true;
          });

          return (
            <Button
              key={index}
              variant="outlined"
              fullWidth
              disabled={optionDisabled}
              onClick={() => handleDialogueOption(option)}
              sx={{ 
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1,
                opacity: optionDisabled ? 0.5 : 1,
              }}
            >
              {option.text}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DialogueTab;
