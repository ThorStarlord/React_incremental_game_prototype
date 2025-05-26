/**
 * @file NPCOverviewTab.tsx
 * @description Overview tab showing basic NPC information and available interactions
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Extension as TraitIcon,
  Store as TradeIcon,
  Chat as DialogueIcon,
  Lock as LockedIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import type { NPC } from '../../state/NPCTypes';

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const getUnlockRequirement = (level: number) => {
    return `Requires relationship level ${level}+`;
  };

  const isTabUnlocked = (requirement: number) => {
    return npc.relationshipValue >= requirement;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Available Interactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Interactions
              </Typography>
              
              <List dense>
                {/* Dialogue */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(1) ? (
                      <DialogueIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Dialogue"
                    secondary={isTabUnlocked(1) ? 
                      'Have conversations' : 
                      getUnlockRequirement(1)
                    }
                  />
                  {isTabUnlocked(1) && (
                    <Chip label="Available" color="success" size="small" />
                  )}
                </ListItem>

                {/* Trading */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(2) ? (
                      <TradeIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Trading"
                    secondary={isTabUnlocked(2) ? 
                      'Buy and sell items' : 
                      getUnlockRequirement(2)
                    }
                  />
                  {isTabUnlocked(2) && npc.inventory?.items?.length && (
                    <Chip label={`${npc.inventory.items.length} items`} color="info" size="small" />
                  )}
                </ListItem>

                {/* Quests */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(3) ? (
                      <QuestIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Quests"
                    secondary={isTabUnlocked(3) ? 
                      'Accept and complete quests' : 
                      getUnlockRequirement(3)
                    }
                  />
                  {isTabUnlocked(3) && npc.availableQuests?.length && (
                    <Chip label={`${npc.availableQuests.length} available`} color="warning" size="small" />
                  )}
                </ListItem>

                {/* Traits */}
                <ListItem>
                  <ListItemIcon>
                    {isTabUnlocked(4) ? (
                      <TraitIcon color="primary" />
                    ) : (
                      <LockedIcon color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Trait Sharing"
                    secondary={isTabUnlocked(4) ? 
                      'Share and acquire traits' : 
                      getUnlockRequirement(4)
                    }
                  />
                  {isTabUnlocked(4) && npc.teachableTraits?.length && (
                    <Chip label={`${npc.teachableTraits.length} teachable`} color="secondary" size="small" />
                  )}
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Character Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Character Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loyalty: {npc.loyalty || 0}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connection Depth: {npc.connectionDepth?.toFixed(1) || '0.0'}
                </Typography>
              </Box>

              {npc.personality && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Personality Traits
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {npc.personality.traits?.map((trait, index) => (
                      <Chip
                        key={index}
                        label={trait}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {npc.teachableTraits && npc.teachableTraits.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Known Traits
                  </Typography>
                  <List dense>
                    {npc.teachableTraits.map((traitId) => {
                      const traitInfo = npc.traits?.[traitId];
                      const isVisible = traitInfo?.isVisible || npc.relationshipValue >= (traitInfo?.relationshipRequirement || 0);
                      
                      return (
                        <ListItem key={traitId} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            {isVisible ? (
                              <TraitIcon color="primary" />
                            ) : (
                              <LockedIcon color="disabled" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={isVisible ? traitInfo?.name || traitId : '???'}
                            secondary={isVisible ? 
                              `Requirement: ${traitInfo?.relationshipRequirement || 0}` : 
                              'Hidden trait'
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Interaction History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              
              {npc.lastInteraction ? (
                <Typography variant="body2" color="text.secondary">
                  Last interaction: {new Date(npc.lastInteraction).toLocaleString()}
                </Typography>
              ) : (
                <Alert severity="info">
                  No interactions yet. Start a conversation to build your relationship!
                </Alert>
              )}

              {npc.completedQuests && npc.completedQuests.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Completed Quests
                  </Typography>
                  <List dense>
                    {npc.completedQuests.map((questId, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <CompletedIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={questId} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);
