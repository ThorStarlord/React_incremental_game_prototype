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
  AccordionDetails,
  Stack, 
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  History,
  EmojiEvents,
  Schedule,
  ExpandMore as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  LockOpen as LockOpenIcon, 
} from '@mui/icons-material';
import type { NPC, RelationshipChangeEntry } from '../../../state/NPCTypes';
import { 
  RELATIONSHIP_TIERS, 
  getTierBenefits 
} from '../../../../../config/relationshipConstants';
import { useAppDispatch } from '../../../../../app/hooks';
import { updateNpcRelationship, debugUnlockAllSharedSlots } from '../../../state/NPCSlice';

interface NPCRelationshipTabProps {
  npc: NPC;
  relationshipChanges?: RelationshipChangeEntry[];
  onImproveRelationship?: (npcId: string) => void;
  onRelationshipChange: (change: number, reason: string) => void; // Added this prop back
}

const NPCRelationshipTab: React.FC<NPCRelationshipTabProps> = ({ 
  npc, 
  relationshipChanges = [],
  onImproveRelationship,
  // onRelationshipChange is now a prop but not directly used by elements in this tab currently
}) => {
  const dispatch = useAppDispatch();
  const currentTierInfo = getTierBenefits(npc.relationshipValue);
  const currentTierName = currentTierInfo.name;

  let pointsInCurrentTier = 0;
  let totalPointsInTier = 0;
  let progressPercentageInTier = 0;
  let progressLabelText = `${currentTierName}`;

  if (currentTierInfo.nextTier) {
    const currentTierMin = currentTierInfo.threshold;
    const nextTierMin = currentTierInfo.nextTier.threshold;
    
    pointsInCurrentTier = npc.relationshipValue - currentTierMin;
    totalPointsInTier = nextTierMin - currentTierMin;

    if (totalPointsInTier > 0) {
      progressPercentageInTier = Math.max(0, Math.min(100, (pointsInCurrentTier / totalPointsInTier) * 100));
    } else {
      progressPercentageInTier = 100;
    }
    progressLabelText = `To ${currentTierInfo.nextTier.name}: ${pointsInCurrentTier} / ${totalPointsInTier} Affinity`;
  } else {
    progressPercentageInTier = 100;
    progressLabelText = `${currentTierName} (Max)`;
  }

  const recentChanges = relationshipChanges
    .filter(change => change.npcId === npc.id)
    .slice(-5)
    .reverse();

  const handleDebugIncreaseAffinity = () => {
    dispatch(updateNpcRelationship({
      npcId: npc.id,
      change: 10,
      reason: 'Debug: +10 Affinity'
    }));
  };

  const handleDebugUnlockSlots = () => {
    dispatch(debugUnlockAllSharedSlots(npc.id));
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
                    {currentTierName}
                  </Typography>
                  <Typography variant="h5" sx={{ color: currentTierInfo.color || 'primary.main' }}>
                    Affinity: {npc.relationshipValue}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={progressPercentageInTier}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    mb: 0.5,
                    backgroundColor: 'action.hover',
                    ...(currentTierInfo.color && {
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: currentTierInfo.color,
                      },
                    }),
                  }}
                  color={!currentTierInfo.color ? 'primary' : undefined}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  {progressLabelText}
                </Typography>
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

              <Stack spacing={1} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingUp />}
                  onClick={() => onImproveRelationship?.(npc.id)}
                  disabled={npc.relationshipValue >= 100}
                >
                  {npc.relationshipValue >= 100 ? 'Maximum Relationship' : 'Spend Time Together'}
                </Button>
                {/* Debug Buttons */}
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleDebugIncreaseAffinity}
                  disabled={npc.relationshipValue >= 100}
                  sx={{textTransform: 'none'}}
                >
                  Debug: +10 Affinity
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<LockOpenIcon />}
                  onClick={handleDebugUnlockSlots}
                  disabled={!npc.sharedTraitSlots || npc.sharedTraitSlots.length === 0}
                  sx={{textTransform: 'none'}}
                >
                  Debug: Unlock All Trait Slots
                </Button>
              </Stack>
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
                  const tierSpecificBenefits = getTierBenefits(thresholdValue).benefits; 

                  return (
                    <ListItem 
                      key={tier.name}
                      sx={{ 
                        pl: 0,
                        opacity: isUnlocked ? 1 : 0.6,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Chip
                          label={thresholdValue}
                          size="small"
                          color={isUnlocked ? 'success' : 'default'}
                          variant={isUnlocked ? 'filled' : 'outlined'}
                          sx={isUnlocked ? {backgroundColor: tier.color, color: '#fff'} : {}}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tier.name}
                        secondary={tierSpecificBenefits.join(', ')}
                        primaryTypographyProps={{
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
