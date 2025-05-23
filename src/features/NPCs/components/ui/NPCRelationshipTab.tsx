/**
 * @file NPCRelationshipTab.tsx
 * @description Tab component for managing NPC relationships
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GiftIcon from '@mui/icons-material/CardGiftcard';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChatIcon from '@mui/icons-material/Chat';

import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById } from '../state/NPCSelectors';
import { npcActions } from '../state/NPCSlice';
import RelationshipProgress from './RelationshipProgress';

interface NPCRelationshipTabProps {
  npcId: string;
}

/**
 * NPCRelationshipTab - Manage relationship building activities
 * 
 * Features:
 * - Relationship status overview
 * - Available relationship-building activities
 * - Shared trait slot management
 * - Gift giving (future feature)
 * - Relationship history
 */
const NPCRelationshipTab: React.FC<NPCRelationshipTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector((state) => selectNPCById(state, npcId));

  if (!npc) {
    return (
      <Typography variant="body1" color="text.secondary">
        NPC not found.
      </Typography>
    );
  }

  const handleRelationshipActivity = (activityType: string, change: number) => {
    dispatch(npcActions.updateRelationship({
      npcId,
      change,
      reason: `${activityType} activity`,
    }));
  };

  // Mock activities based on relationship level
  const getAvailableActivities = () => {
    const activities = [];
    
    if (npc.relationshipValue >= 10) {
      activities.push({
        id: 'chat',
        name: 'Have a friendly chat',
        description: 'Spend some time talking with them',
        relationshipGain: 2,
        cooldown: 'Once per day',
        icon: <ChatIcon />,
      });
    }
    
    if (npc.relationshipValue >= 25) {
      activities.push({
        id: 'help',
        name: 'Offer to help',
        description: 'Assist them with their daily tasks',
        relationshipGain: 3,
        cooldown: 'Once per day',
        icon: <HandshakeIcon />,
      });
    }
    
    if (npc.relationshipValue >= 50) {
      activities.push({
        id: 'gift',
        name: 'Give a thoughtful gift',
        description: 'Present them with something they might like',
        relationshipGain: 5,
        cooldown: 'Once per week',
        icon: <GiftIcon />,
      });
    }
    
    return activities;
  };

  const availableActivities = getAvailableActivities();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        <FavoriteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Relationship Management
      </Typography>

      {/* Relationship Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Current Relationship Status
          </Typography>
          <RelationshipProgress 
            npcId={npcId} 
            showDetails={true} 
          />
        </CardContent>
      </Card>

      {/* Available Activities */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Relationship Building Activities
          </Typography>
          
          {availableActivities.length > 0 ? (
            <Grid container spacing={2}>
              {availableActivities.map((activity) => (
                <Grid item xs={12} sm={6} key={activity.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {activity.icon}
                        <Typography variant="h6">
                          {activity.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {activity.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2" color="primary">
                          +{activity.relationshipGain} relationship
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.cooldown}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleRelationshipActivity(activity.name, activity.relationshipGain)}
                      >
                        Perform Activity
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                No relationship activities are currently available. 
                Improve your relationship through dialogue and other interactions 
                to unlock new activities.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Shared Trait Slots */}
      {npc.relationshipValue >= 50 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Shared Trait Slots
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              You can share traits with {npc.name} to enhance their abilities.
            </Typography>
            
            <Box mt={2}>
              {Array.from({ length: npc.sharedTraitSlots }, (_, index) => (
                <Box key={index} mb={1}>
                  <Typography variant="body2">
                    Slot {index + 1}: <em>Empty</em>
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    sx={{ mt: 0.5, mb: 1 }} 
                  />
                </Box>
              ))}
              
              {npc.sharedTraitSlots === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No shared trait slots available yet. Increase your relationship further 
                  to unlock the ability to share traits.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NPCRelationshipTab;
