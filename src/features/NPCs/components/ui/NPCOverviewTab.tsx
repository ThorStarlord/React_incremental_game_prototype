/**
 * @file NPCOverviewTab.tsx
 * @description Overview tab showing basic NPC information and status
 */

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StoreIcon from '@mui/icons-material/Store';

import { useAppSelector } from '../../../../app/hooks';
import { selectNPCById } from '../state/NPCSelectors';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';
import RelationshipProgress from '../ui/RelationshipProgress';

// Styled components
const NPCHeader = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
}));

const NPCAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: '2rem',
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const StatusCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const StatChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

interface NPCOverviewTabProps {
  npcId: string;
}

/**
 * NPCOverviewTab - Displays comprehensive NPC information
 * 
 * Shows:
 * - Basic information (name, description, location)
 * - Relationship status and progress
 * - Available interactions summary
 * - Recent interaction history
 * - Quick stats and capabilities
 */
const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npcId }) => {
  const npc = useAppSelector((state) => selectNPCById(state, npcId));

  if (!npc) {
    return (
      <Typography variant="body1" color="text.secondary">
        NPC not found.
      </Typography>
    );
  }

  // Get relationship tier info
  const getRelationshipTier = () => {
    const tiers = Object.entries(RELATIONSHIP_TIERS);
    for (const [tierKey, tierData] of tiers) {
      if (npc.relationshipValue >= tierData.min && npc.relationshipValue <= tierData.max) {
        return { key: tierKey, ...tierData };
      }
    }
    return { key: 'NEUTRAL', ...RELATIONSHIP_TIERS.NEUTRAL };
  };

  const relationshipTier = getRelationshipTier();

  // Calculate interaction stats
  const totalQuests = npc.availableQuests.length + npc.completedQuests.length;
  const totalTraits = Object.keys(npc.traits).length;
  const inventoryItems = npc.inventory?.items.length || 0;

  // Format last interaction
  const formatLastInteraction = () => {
    if (!npc.lastInteraction) return 'Never';
    
    const date = new Date(npc.lastInteraction);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 7) return date.toLocaleDateString();
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  return (
    <Box>
      {/* NPC Header */}
      <NPCHeader>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <NPCAvatar>
                {npc.avatar ? (
                  <img 
                    src={npc.avatar} 
                    alt={npc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  npc.name.charAt(0).toUpperCase()
                )}
              </NPCAvatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {npc.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {npc.description}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={npc.location}
                  variant="outlined"
                  size="small"
                />
                {npc.faction && (
                  <Chip
                    icon={<GroupIcon />}
                    label={npc.faction}
                    variant="outlined"
                    size="small"
                  />
                )}
                <Chip
                  label={npc.isAvailable ? 'Available' : 'Unavailable'}
                  color={npc.isAvailable ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </NPCHeader>

      <Grid container spacing={3}>
        {/* Relationship Status */}
        <Grid item xs={12} md={6}>
          <StatusCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FavoriteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Relationship Status
              </Typography>
              
              <RelationshipProgress 
                npcId={npcId}
                showDetails={true}
              />
              
              <Box mt={2}>
                <Chip
                  label={relationshipTier.name}
                  sx={{ 
                    backgroundColor: relationshipTier.color,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {relationshipTier.description}
                </Typography>
              </Box>
            </CardContent>
          </StatusCard>
        </Grid>

        {/* Interaction Summary */}
        <Grid item xs={12} md={6}>
          <StatusCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interaction Summary
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${npc.availableQuests.length} Available Quests`}
                    secondary={`${npc.completedQuests.length} completed`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AutoFixHighIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${npc.teachableTraits.length} Teachable Traits`}
                    secondary={`${totalTraits} total traits`}
                  />
                </ListItem>
                
                {npc.inventory && (
                  <ListItem>
                    <ListItemIcon>
                      <StoreIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${inventoryItems} Items for Trade`}
                      secondary={npc.relationshipValue >= 25 ? 'Trading available' : 'Requires Friend status'}
                    />
                  </ListItem>
                )}
                
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Interaction"
                    secondary={formatLastInteraction()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </StatusCard>
        </Grid>

        {/* Personality and Preferences */}
        <Grid item xs={12}>
          <StatusCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personality & Preferences
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Personality Traits
                  </Typography>
                  <Box>
                    {npc.personality.traits.map((trait, index) => (
                      <StatChip
                        key={index}
                        label={trait}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Likes
                  </Typography>
                  <Box>
                    {npc.personality.likes.map((like, index) => (
                      <StatChip
                        key={index}
                        label={like}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dislikes
                  </Typography>
                  <Box>
                    {npc.personality.dislikes.map((dislike, index) => (
                      <StatChip
                        key={index}
                        label={dislike}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Conversation Style:</strong> {npc.personality.conversationStyle}
              </Typography>
            </CardContent>
          </StatusCard>
        </Grid>

        {/* Services and Capabilities */}
        {npc.services && npc.services.length > 0 && (
          <Grid item xs={12}>
            <StatusCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Services & Capabilities
                </Typography>
                
                <Grid container spacing={1}>
                  {npc.services.map((service, index) => (
                    <Grid item key={index}>
                      <Paper 
                        variant="outlined" 
                        sx={{ p: 2, minWidth: 200 }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {service.description}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={`${service.cost} essence`}
                            size="small"
                            color="primary"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Requires {service.relationshipRequirement}+ relationship
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StatusCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NPCOverviewTab;
