import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

/**
 * RelationshipTab - Handles relationship building interactions with NPCs
 * 
 * @param {Object} props
 * @param {Object} props.npc - The NPC data object
 * @param {Object} props.player - The player data object
 * @param {Array} props.traits - Player's traits
 * @param {Function} props.handleRelationshipChange - Function to handle relationship changes
 * @param {Function} props.dispatch - Redux dispatch function
 * @param {Function} props.showNotification - Function to show notifications
 * @returns {JSX.Element} Relationship interaction component
 */
const RelationshipTab = ({ npc, player, traits, handleRelationshipChange, dispatch, showNotification }) => {
  const [cooldowns, setCooldowns] = useState({});
  
  // Activities that can improve relationship
  const activities = [
    {
      id: 'chat',
      name: 'Casual Chat',
      icon: <SentimentSatisfiedAltIcon />,
      description: 'Have a friendly conversation about day-to-day topics.',
      relationshipGain: 2,
      cooldown: 120, // seconds
      traitBonus: {
        'charismatic': 1,
        'friendly': 1
      }
    },
    {
      id: 'game',
      name: 'Play a Game',
      icon: <SportsEsportsIcon />,
      description: 'Challenge them to a friendly game.',
      relationshipGain: 3,
      cooldown: 300,
      traitBonus: {
        'competitive': 2,
        'strategic': 1
      }
    },
    {
      id: 'drink',
      name: 'Share a Drink',
      icon: <LocalCafeIcon />,
      description: 'Relax and share a beverage together.',
      relationshipGain: 4,
      cooldown: 600,
      traitBonus: {
        'generous': 2,
        'empathetic': 1
      },
      cost: { gold: 5 }
    },
    {
      id: 'gift',
      name: 'Give a Gift',
      icon: <EmojiEventsIcon />,
      description: 'Offer a small gift as a token of friendship.',
      relationshipGain: 5,
      cooldown: 1800,
      traitBonus: {
        'generous': 3,
        'empathetic': 2
      },
      cost: { gold: 10 }
    }
  ];

  // Calculate actual relationship gain based on traits
  const calculateRelationshipGain = (activity) => {
    let gain = activity.relationshipGain;
    
    // Apply trait bonuses if applicable
    if (activity.traitBonus && player.traits) {
      Object.entries(activity.traitBonus).forEach(([trait, bonus]) => {
        if (player.traits.includes(trait)) {
          gain += bonus;
        }
      });
    }
    
    // Apply NPC preferences if applicable
    if (npc.preferences && npc.preferences.activities) {
      const preference = npc.preferences.activities[activity.id];
      if (preference) {
        gain *= preference;
      }
    }
    
    return Math.round(gain);
  };

  // Handle activity selection
  const handleActivity = (activity) => {
    // Check if on cooldown
    if (cooldowns[activity.id] && cooldowns[activity.id] > Date.now()) {
      showNotification({
        open: true,
        message: `You need to wait before doing this activity again.`,
        severity: 'warning'
      });
      return;
    }
    
    // Check if player can afford the cost (if any)
    if (activity.cost) {
      // Logic to check if player can afford cost would go here
      // For now, we'll assume they can
    }
    
    // Calculate relationship gain
    const relationshipGain = calculateRelationshipGain(activity);
    
    // Update relationship
    handleRelationshipChange(relationshipGain, 'activity');
    
    // Set cooldown
    setCooldowns(prev => ({
      ...prev,
      [activity.id]: Date.now() + (activity.cooldown * 1000)
    }));
    
    // Show success notification
    showNotification({
      open: true,
      message: `${activity.name} was successful! Relationship improved by ${relationshipGain}.`,
      severity: 'success'
    });
  };

  // Calculate time left on cooldown
  const getCooldownText = (activityId) => {
    if (!cooldowns[activityId] || cooldowns[activityId] <= Date.now()) {
      return null;
    }
    
    const secondsLeft = Math.ceil((cooldowns[activityId] - Date.now()) / 1000);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">Relationship with {npc.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Engage in activities to strengthen your relationship and unlock new interactions.
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={`Relationship: ${npc.relationship || 0}`} 
              color="primary" 
              icon={<FavoriteIcon />}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available Activities
      </Typography>
      
      <Grid container spacing={2}>
        {activities.map((activity) => {
          const onCooldown = cooldowns[activity.id] && cooldowns[activity.id] > Date.now();
          const cooldownText = getCooldownText(activity.id);
          
          return (
            <Grid item xs={12} sm={6} key={activity.id}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  opacity: onCooldown ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <Box sx={{ 
                      backgroundColor: 'primary.light', 
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex'
                    }}>
                      {activity.icon}
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">{activity.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Chip 
                          label={`+${calculateRelationshipGain(activity)} Relationship`} 
                          size="small" 
                          color="success"
                        />
                      </Grid>
                      <Grid item>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleActivity(activity)}
                          disabled={onCooldown}
                        >
                          {onCooldown ? `Wait ${cooldownText}` : 'Do Activity'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Relationship History
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="First met at the town square" 
              secondary="Initial impression: Neutral" 
            />
          </ListItem>
          {npc.relationshipHistory?.map((event, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={event.description} 
                secondary={`Changed by ${event.amount > 0 ? '+' : ''}${event.amount}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RelationshipTab;
