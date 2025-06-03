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
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  History,
  EmojiEvents,
  Schedule,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import type { NPC, RelationshipChangeEntry } from '../../../state/NPCTypes';
import { 
  RELATIONSHIP_TIERS, 
  getRelationshipTier as getCentralRelationshipTierInfo, // Renamed to avoid conflict if any local one was kept temporarily
  getTierBenefits 
} from '../../../../../config/relationshipConstants'; // Import centralized constants

interface NPCRelationshipTabProps {
  npc: NPC;
  relationshipChanges?: RelationshipChangeEntry[];
  onImproveRelationship?: (npcId: string) => void;
  onRelationshipChange: (change: number, reason: string) => void;
}

// Local utilities are now removed, will use centralized ones.

const NPCRelationshipTab: React.FC<NPCRelationshipTabProps> = ({ 
  npc, 
  relationshipChanges = [],
  onImproveRelationship 
}) => {
  const currentTierInfo = getTierBenefits(npc.relationshipValue);
  const currentTierName = currentTierInfo.name;
  // The percentage for the main progress bar can represent overall progress from -100 to 100.
  // Or, it could represent progress within the current tier towards the next.
  // Let's keep the existing overall progress for the main bar.
  const overallPercentage = Math.max(0, (npc.relationshipValue + 100) / 200 * 100); // Assumes -100 to 100 range

  const recentChanges = relationshipChanges
    .filter(change => change.npcId === npc.id)
    .slice(-5)
    .reverse();

  // getUnlockAtLevel is replaced by currentTierInfo.benefits and iterating through RELATIONSHIP_TIERS

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
                    {currentTierName}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {npc.relationshipValue}/100
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={overallPercentage}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    mb: 2,
                    backgroundColor: 'action.hover', // A neutral track color from the theme
                    ...(currentTierInfo.color && {
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: currentTierInfo.color,
                      },
                    }),
                  }}
                  // Fallback color prop if currentTierInfo.color is not defined, though sx should handle it.
                  // If currentTierInfo.color is always defined, this color prop might not be strictly necessary
                  // but acts as a safe default if sx somehow doesn't apply.
                  color={!currentTierInfo.color ? 'primary' : undefined}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Overall Progress: {Math.round(overallPercentage)}%
                  </Typography>
                  {currentTierInfo.nextTier && currentTierInfo.pointsNeeded !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      Next: {currentTierInfo.nextTier.name} ({currentTierInfo.pointsNeeded} to go)
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
          <Accordion sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEvents sx={{ mr: 1 }} />
                Relationship Milestones
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <List dense>
                {Object.values(RELATIONSHIP_TIERS).sort((a,b) => a.min - b.min).map((tier) => {
                  const thresholdValue = tier.min;
                  const isUnlocked = npc.relationshipValue >= thresholdValue;
                  const unlocks = getTierBenefits(thresholdValue).benefits; // Get benefits for this specific tier level

                  return (
                    <ListItem 
                      key={tier.name}
                      sx={{ 
                        pl: 0,
                        opacity: isUnlocked ? 1 : 0.6,
                        // bgcolor: isUnlocked ? 'success.light' : 'transparent', // Keep original styling or adjust
                        // borderRadius: 1, // AccordionDetails will handle overall shape
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Chip
                          label={thresholdValue}
                          size="small"
                          color={isUnlocked ? 'success' : 'default'}
                          variant={isUnlocked ? 'filled' : 'outlined'}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tier.name}
                        secondary={unlocks.join(', ')}
                        primaryTypographyProps={{
                          // textTransform: 'capitalize', // Name is already capitalized
                          fontWeight: isUnlocked ? 'medium' : 'normal'
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
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
