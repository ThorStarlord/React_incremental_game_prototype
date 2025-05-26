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
  Grid,
  LinearProgress,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  History,
  EmojiEvents,
  Schedule
} from '@mui/icons-material';
import type { NPC, RelationshipChange } from '../../state/NpcTypes';
import { getRelationshipTier, RELATIONSHIP_THRESHOLDS } from '../../state/NpcTypes';

interface NPCRelationshipTabProps {
  npc: NPC;
  relationshipChanges?: RelationshipChange[];
  onImproveRelationship?: (npcId: string) => void;
}

const NPCRelationshipTab: React.FC<NPCRelationshipTabProps> = ({ 
  npc, 
  relationshipChanges = [],
  onImproveRelationship 
}) => {
  const currentTier = getRelationshipTier(npc.relationshipValue);
  const percentage = Math.max(0, (npc.relationshipValue + 100) / 2);
  
  const getNextThreshold = () => {
    const thresholds = Object.values(RELATIONSHIP_THRESHOLDS).sort((a, b) => a - b);
    return thresholds.find(threshold => threshold > npc.relationshipValue) || 100;
  };

  const nextThreshold = getNextThreshold();
  const progressToNext = nextThreshold ? Math.max(0, (npc.relationshipValue - (nextThreshold - 25)) / 25 * 100) : 100;

  const recentChanges = relationshipChanges
    .filter(change => change.npcId === npc.id)
    .slice(-5)
    .reverse();

  const getUnlockAtLevel = (level: number) => {
    const unlocks = [];
    if (level >= 25) unlocks.push('Advanced Dialogue', 'Basic Quest Access');
    if (level >= 50) unlocks.push('Trade Discounts', 'Personal Stories', 'Trait Acquisition');
    if (level >= 75) unlocks.push('Deep Conversations', 'Major Quests', 'Trait Sharing');
    if (level >= 100) unlocks.push('Intimate Bond', 'Exclusive Content', 'Maximum Benefits');
    return unlocks;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Current Relationship Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite sx={{ mr: 1 }} />
                Relationship Status
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {currentTier}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {npc.relationshipValue}/100
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Progress: {Math.round(percentage)}%
                  </Typography>
                  {nextThreshold < 100 && (
                    <Typography variant="caption" color="text.secondary">
                      Next: {nextThreshold} ({nextThreshold - npc.relationshipValue} to go)
                    </Typography>
                  )}
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary">
                      {npc.connectionDepth || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Connection Depth
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {npc.loyalty || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Loyalty
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingUp />}
                  onClick={() => onImproveRelationship?.(npc.id)}
                  disabled={npc.relationshipValue >= 100}
                >
                  {npc.relationshipValue >= 100 ? 'Maximum Relationship' : 'Spend Time Together'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Relationship Milestones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEvents sx={{ mr: 1 }} />
                Relationship Milestones
              </Typography>

              <List dense>
                {Object.entries(RELATIONSHIP_THRESHOLDS).map(([tierName, threshold]) => {
                  const isUnlocked = npc.relationshipValue >= threshold;
                  const unlocks = getUnlockAtLevel(threshold);

                  return (
                    <ListItem 
                      key={tierName}
                      sx={{ 
                        pl: 0,
                        opacity: isUnlocked ? 1 : 0.6,
                        bgcolor: isUnlocked ? 'success.light' : 'transparent',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Chip
                          label={threshold}
                          size="small"
                          color={isUnlocked ? 'success' : 'default'}
                          variant={isUnlocked ? 'filled' : 'outlined'}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tierName.replace('_', ' ').toLowerCase()}
                        secondary={unlocks.join(', ')}
                        primaryTypographyProps={{
                          textTransform: 'capitalize',
                          fontWeight: isUnlocked ? 'medium' : 'normal'
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <History sx={{ mr: 1 }} />
                Recent Relationship Changes
              </Typography>

              {recentChanges.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent relationship changes
                </Typography>
              ) : (
                <List>
                  {recentChanges.map((change) => (
                    <ListItem key={change.id} divider>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {change.reason}
                            </Typography>
                            <Chip
                              label={change.newValue > change.oldValue ? `+${change.newValue - change.oldValue}` : `${change.newValue - change.oldValue}`}
                              size="small"
                              color={change.newValue > change.oldValue ? 'success' : 'error'}
                            />
                          </Box>
                        }
                        secondary={`${change.oldValue} → ${change.newValue} • ${new Date(change.timestamp).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(NPCRelationshipTab);
