import React, { useState, useEffect, useCallback } from 'react';
import { Snackbar, Alert, Box, Typography, Avatar, Fade, LinearProgress, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useGameState } from '../../../context/index';
import { getRelationshipTier } from '../../../constants/relationshipConstants';

/**
 * Simple audio player using native Web Audio API
 * @param {string} src - Audio file path
 * @param {number} volume - Volume level (0-1)
 */
const playSound = (src, volume = 0.5) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(err => console.log("Audio play failed:", err));
  } catch (error) {
    console.log("Audio error:", error);
  }
};

/**
 * RelationshipNotification Component
 * 
 * Displays a notification when player's relationship with an NPC changes.
 * Shows the new relationship tier, benefits, and relevant information.
 * 
 * @component
 * @returns {React.Component} A notification component for relationship changes
 */
const RelationshipNotification = () => {
  const { npcs, dispatch } = useGameState();
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  // Clear relationship change flag for the NPC after showing notification
  const clearRelationshipChanged = useCallback((npcId) => {
    if (dispatch) {
      dispatch({
        type: 'CLEAR_RELATIONSHIP_CHANGED',
        payload: { npcId }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    // Find NPCs with relationship changes
    const changedNpc = npcs.find(npc => npc.relationshipChanged);
    
    if (changedNpc) {
      const currentTier = getRelationshipTier(changedNpc.relationship);
      const previousRelationship = changedNpc.previousRelationship || 0;
      const isImproved = changedNpc.relationship > previousRelationship;
      
      // Play appropriate sound effect
      if (isImproved) {
        playSound('/sounds/relationship-up.mp3', 0.5);
      } else {
        playSound('/sounds/relationship-down.mp3', 0.5);
      }
      
      setNotification({
        npc: changedNpc,
        tier: currentTier,
        previousRelationship,
        isImproved,
        delta: Math.abs(changedNpc.relationship - previousRelationship).toFixed(1)
      });
      
      setOpen(true);
      
      // Clear the flag after showing notification
      clearRelationshipChanged(changedNpc.id);
    }
  }, [npcs, clearRelationshipChanged]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (!notification) return null;

  const { npc, tier, isImproved, delta } = notification;
  const icon = isImproved ? <ThumbUpIcon /> : <ThumbDownIcon />;
  const severity = isImproved ? "success" : "warning";

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Fade}
    >
      <Alert 
        severity={severity}
        onClose={handleClose}
        icon={icon}
        variant="filled"
        sx={{ 
          width: '100%',
          minWidth: 300,
          boxShadow: theme.shadows[3],
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={npc.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`} 
              sx={{ width: 32, height: 32, mr: 1 }} 
            />
            <Typography variant="subtitle1">
              {npc.name}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            Relationship {isImproved ? 'improved' : 'worsened'} by {delta} points!
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon sx={{ color: tier.color, fontSize: 18 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: tier.color,
                fontWeight: 'bold'
              }}
            >
              {tier.name}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={Math.max(0, npc.relationship + 100) / 2}
            sx={{ 
              height: 5, 
              borderRadius: 1,
              my: 1,
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: tier.color
              }
            }} 
          />
          
          {tier.benefits && tier.benefits.length > 0 && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                Current Benefits:
              </Typography>
              {tier.benefits.map((benefit, i) => (
                <Typography key={i} variant="caption" display="block" sx={{ fontSize: '0.7rem' }}>
                  • {benefit}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default RelationshipNotification;