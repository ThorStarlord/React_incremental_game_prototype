import React, { useState, useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { GameDispatchContext } from '../context/GameStateContext';
import { useDialogue, getRandomGreeting } from '../modules/dialogueManager';
import { useAffinityManager } from '../hooks/resourceHooks';
import './NPCEncounter.css';

const NPCEncounter = ({ npcId, onBack }) => {
  const [currentDialogueId, setCurrentDialogueId] = useState('intro');
  const dispatch = useContext(GameDispatchContext);
  const { getDialogue, handleDialogueAction } = useDialogue(npcId);
  const { getAffinityLevel } = useAffinityManager();

  const currentDialogue = getDialogue(currentDialogueId);
  const affinityLevel = getAffinityLevel(npcId);

  const handleOptionClick = (option) => {
    if (option.next === 'end') {
      onBack();
      return;
    }

    if (currentDialogue.action) {
      handleDialogueAction(currentDialogue, dispatch);
    }

    setCurrentDialogueId(option.next);
  };

  if (!currentDialogue) {
    return (
      <Box className="npc-encounter">
        <Typography>No dialogue available.</Typography>
        <Button onClick={onBack}>Back</Button>
      </Box>
    );
  }

  return (
    <Box className="npc-encounter">
      <Typography variant="h5">
        Affinity Level: {affinityLevel}
      </Typography>
      
      <Box className="dialogue-container">
        <Typography className="dialogue-text">
          {currentDialogue.text}
        </Typography>

        <Box className="dialogue-options">
          {currentDialogue.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionClick(option)}
              variant="contained"
              className="dialogue-option"
            >
              {option.text}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NPCEncounter;