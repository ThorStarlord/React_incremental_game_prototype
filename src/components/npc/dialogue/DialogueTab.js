import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  getRelationshipTier, 
  getRelationshipColor, 
  getRelationshipProgress, 
  getNextRelationshipTier
} from '../utils/relationshipUtils';
import DialogueOption from './DialogueOption';

/**
 * Component for NPC dialogue interactions
 */
const DialogueTab = ({
  npc,
  playerRelationship,
  playerTraits = [],
  onRelationshipChange,
  currentDialogue = {},
  dialogueTree = {},
  onDialogueSelect = () => {},
  dialogueHistory = [],
  tutorial = null
}) => {
  const navigate = useNavigate();
  
  // State for displaying past dialogue exchanges
  const [showHistory, setShowHistory] = useState(false);
  
  // Get relationship information
  const relationshipTier = getRelationshipTier(playerRelationship);
  const relationshipColor = getRelationshipColor(playerRelationship);
  const relationshipProgress = getRelationshipProgress(playerRelationship);
  const nextTier = getNextRelationshipTier(playerRelationship);

  // Handle dialogue option selection
  const handleOptionSelect = (option) => {
    // Update relationship if this option affects it
    if (option.relationshipImpact) {
      onRelationshipChange(playerRelationship + option.relationshipImpact);
    }
    
    // Move to next dialogue
    onDialogueSelect(option);
  };

  return (
    <Box>
      {/* NPC Information and Relationship Display */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {npc.name}
        </Typography>
        
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ color: relationshipColor, fontWeight: 'bold' }}>
            {relationshipTier} ({playerRelationship}/100)
          </Typography>
          
          {nextTier && (
            <Box sx={{ width: 150, mt: 0.5 }}>
              <LinearProgress 
                variant="determinate" 
                value={relationshipProgress.progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 1, 
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: relationshipColor,
                  }
                }}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {relationshipProgress.remaining} to {nextTier.name}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Current Dialogue Display */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {currentDialogue.text || "Greetings, traveler."}
        </Typography>
        
        {currentDialogue.mood && (
          <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary' }}>
            {npc.name} seems {currentDialogue.mood}.
          </Typography>
        )}
      </Paper>

      {tutorial?.active && tutorial.step === 'findFirstMonster' && tutorial.targetNPCId === npc.id && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              // Navigate to monster encounter
              navigate('/combat/tutorial');
            }}
          >
            Ask About Nearby Threats
          </Button>
        </Box>
      )}

      {/* Dialogue History */}
      {showHistory && dialogueHistory.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, maxHeight: '150px', overflowY: 'auto' }}>
          {dialogueHistory.map((entry, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {entry.speaker}:
              </Typography>
              <Typography variant="body2">
                {entry.text}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* Toggle History Button */}
      {dialogueHistory.length > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mb: 2, 
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'text.secondary'
          }}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide conversation history' : 'Show conversation history'}
        </Typography>
      )}
      
      <Divider sx={{ mb: 2 }} />

      {/* Response Options */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Your Response:
        </Typography>
        
        {currentDialogue.options?.map((option, index) => (
          <DialogueOption
            key={index}
            text={option.text}
            relationshipImpact={option.relationshipImpact || 0}
            requiredRelationship={option.requiredRelationship || 0}
            requiredTraits={option.requiredTraits || []}
            playerRelationship={playerRelationship}
            playerTraits={playerTraits}
            type={option.type || 'neutral'}
            tooltip={option.tooltip || ''}
            onClick={() => handleOptionSelect(option)}
          />
        ))}
        
        {(!currentDialogue.options || currentDialogue.options.length === 0) && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No response options available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DialogueTab;