/**
 * @file NPCRelationshipTab.tsx
 * @description Tab component for managing NPC relationships and triggering high-level actions.
 */

import React, { useMemo, useCallback, useState } from 'react';
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
  Divider,
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
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import type { NPC, RelationshipChangeEntry } from '../../../state/NPCTypes';
import { 
  RELATIONSHIP_TIERS, 
  getTierBenefits 
} from '../../../../../config/relationshipConstants';
import { useAppDispatch } from '../../../../../app/hooks';
import { updateNPCRelationshipThunk, debugUnlockAllSharedSlots } from '../../../state/NPCThunks';
import { createCopyThunk } from '../../../../Copy/state/CopyThunks';
import { COPY_SYSTEM } from '../../../../../constants/gameConstants';
import { CreateCopyModal } from '../../../../Copy/components/ui/CreateCopyModal';

interface NPCRelationshipTabProps {
  npc: NPC;
  relationshipChanges?: RelationshipChangeEntry[];
  onImproveRelationship?: (npcId: string) => void;
}

const NPCRelationshipTab: React.FC<NPCRelationshipTabProps> = ({ 
  npc, 
  relationshipChanges = [],
  onImproveRelationship,
}) => {
  const dispatch = useAppDispatch();
  const currentTierInfo = getTierBenefits(npc.affinity);
  
  const SEDUCTION_CONNECTION_REQUIREMENT = COPY_SYSTEM.SEDUCTION_CONNECTION_REQUIREMENT;

  const canAttemptSeduction = npc.connectionDepth >= SEDUCTION_CONNECTION_REQUIREMENT;
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleDebugIncreaseAffinity = () => {
    dispatch(updateNPCRelationshipThunk({
      npcId: npc.id,
      change: 10,
      reason: 'Debug: +10 Affinity'
    }));
  };
  
  const handleDebugUnlockSlots = () => {
    // This thunk doesn't exist, but the reducer action does.
    // However, it's better practice to create a thunk for this debug action if it might have side effects.
    // For now, let's assume a thunk should exist for it.
    dispatch(debugUnlockAllSharedSlots(npc.id));
  };

  const { progressPercentageInTier, progressLabelText } = useMemo(() => {
    const currentTierName = currentTierInfo.name;
    if (currentTierInfo.nextTier) {
      const currentTierMin = currentTierInfo.threshold;
      const nextTierMin = currentTierInfo.nextTier.threshold;
      const pointsInCurrentTier = npc.affinity - currentTierMin;
      const totalPointsInTier = nextTierMin - currentTierMin;
      const progressPercentage = totalPointsInTier > 0
        ? Math.max(0, Math.min(100, (pointsInCurrentTier / totalPointsInTier) * 100))
        : 100;
      return {
        progressPercentageInTier: progressPercentage,
        progressLabelText: `To ${currentTierInfo.nextTier.name}: ${pointsInCurrentTier} / ${totalPointsInTier} Affinity`,
      };
    }
    return {
      progressPercentageInTier: 100,
      progressLabelText: `${currentTierInfo.name} (Max)`,
    };
  }, [npc.affinity, currentTierInfo]);

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
                    {currentTierInfo.name}
                  </Typography>
                  <Typography variant="h5" sx={{ color: currentTierInfo.color || 'primary.main' }}>
                    Affinity: {npc.affinity}
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
                  disabled={npc.affinity >= 100}
                >
                  {npc.affinity >= 100 ? 'Maximum Relationship' : 'Spend Time Together'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleDebugIncreaseAffinity}
                  disabled={npc.affinity >= 100}
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
                  const isUnlocked = npc.affinity >= thresholdValue;
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
        
        {/* Seduction / Create Copy Card */}
        <Grid item xs={12}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <CopyIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        Create a Copy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        When your bond is strong enough, you can attempt to create a Copy of this NPC. This is a difficult action based on your Charisma. A success will create a loyal Copy, but failure may damage your relationship.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                            onClick={handleOpenCreate}
                        disabled={!canAttemptSeduction}
                    >
                        Attempt to Create Copy
                    </Button>
                        <CreateCopyModal
                          open={openCreate}
                          onClose={handleCloseCreate}
                          npcId={npc.id}
                          npcName={npc.name}
                        />
                    {!canAttemptSeduction && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Requires Connection Depth Level {SEDUCTION_CONNECTION_REQUIREMENT} or higher. (Current: {npc.connectionDepth.toFixed(1)})
                        </Typography>
                    )}
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

              {relationshipChanges.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent relationship changes
                </Typography>
              ) : (
                <List>
                  {relationshipChanges.map((change) => (
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
                              label={change.newAffinity > change.oldValue ? `+${change.newAffinity - change.oldValue}` : `${change.newAffinity - change.oldValue}`}
                              size="small"
                              color={change.newAffinity > change.oldValue ? 'success' : 'error'}
                            />
                          </Box>
                        }
                        secondary={`${change.oldValue} → ${change.newAffinity} • ${new Date(change.timestamp).toLocaleString()}`}
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