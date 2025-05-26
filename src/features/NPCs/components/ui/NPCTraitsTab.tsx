/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and acquisition tab for NPC interactions
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Psychology,
  Share,
  School,
  Lock,
  CheckCircle,
  Info,
  Star,
  LocalFireDepartment,
  Bolt,
  Remove,
  Add,
  AutoFixHigh as TraitIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById } from '../../state/NPCSelectors';
import { shareTraitWithNPC, updateRelationship } from '../../state/NPCSlice';
import { NPC, NPCTrait } from '../../state/NPCTypes';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

interface NPCTraitsTabProps {
  npcId: string;
}

interface PlayerTrait {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  isShared: boolean;
  canShare: boolean;
}

interface TraitAcquisitionDialog {
  open: boolean;
  trait: NPCTrait | PlayerTrait | null;
  traitId: string | null;
}

export const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(selectNPCById(npcId)) as NPC;
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState<NPCTrait | PlayerTrait | null>(null);
  const [showTraitDialog, setShowTraitDialog] = useState(false);
  const [actionType, setActionType] = useState<'learn' | 'share'>('learn');
  const [acquisitionDialog, setAcquisitionDialog] = useState<TraitAcquisitionDialog>({
    open: false,
    trait: null,
    traitId: null,
  });

  // Mock player traits - this would come from player state
  const mockPlayerTraits: PlayerTrait[] = [
    {
      id: 'meditation',
      name: 'Meditation',
      description: 'Focus and mental clarity through mindful practice',
      level: 3,
      maxLevel: 5,
      isShared: false,
      canShare: true,
    },
    {
      id: 'empathy',
      name: 'Empathy',
      description: 'Understanding and sharing the feelings of others',
      level: 2,
      maxLevel: 5,
      isShared: true,
      canShare: false, // Already shared
    },
    {
      id: 'analytical_thinking',
      name: 'Analytical Thinking',
      description: 'Breaking down complex problems into manageable parts',
      level: 4,
      maxLevel: 5,
      isShared: false,
      canShare: true,
    },
  ];

  // Get available trait slots
  const usedSharedSlots = Object.keys(npc.traits).length;
  const availableSlots = npc.sharedTraitSlots - usedSharedSlots;

  // Get traits the NPC can teach based on relationship level
  const teachableTraits = useMemo(() => {
    return npc.teachableTraits
      .map(traitId => {
        const trait = npc.traits[traitId];
        if (!trait) return null;
        
        return {
          ...trait,
          canLearn: npc.relationshipValue >= trait.relationshipRequirement,
        };
      })
      .filter(Boolean) as (NPCTrait & { canLearn: boolean })[];
  }, [npc.traits, npc.teachableTraits, npc.relationshipValue]);

  // Get shareable player traits
  const shareableTraits = mockPlayerTraits.filter(trait => trait.canShare);

  // Handle trait learning
  const handleLearnTrait = (trait: NPCTrait) => {
    setSelectedTrait(trait);
    setActionType('learn');
    setShowTraitDialog(true);
  };

  // Handle trait sharing
  const handleShareTrait = (trait: PlayerTrait) => {
    setSelectedTrait(trait);
    setActionType('share');
    setShowTraitDialog(true);
  };

  // Handle trait action confirmation
  const handleConfirmAction = async () => {
    if (!selectedTrait) return;

    if (actionType === 'learn') {
      // This would dispatch an action to learn the trait
      console.log(`Learning trait: ${selectedTrait.id}`);
      // Add relationship bonus for learning
      dispatch(updateRelationship({
        npcId,
        change: 5,
        reason: `Learned trait: ${selectedTrait.name}`,
      }));
    } else if (actionType === 'share') {
      // Share trait with NPC
      dispatch(shareTraitWithNPC({
        npcId,
        traitId: selectedTrait.id,
        slotIndex: usedSharedSlots, // Use next available slot
      }));
    }

    setShowTraitDialog(false);
    setSelectedTrait(null);
  };

  // Confirm trait acquisition from dialog
  const confirmTraitAcquisition = () => {
    if (acquisitionDialog.traitId) {
      console.log(`Learning trait: ${acquisitionDialog.traitId}`);
      // Here you would dispatch the trait acquisition action
    }
    setAcquisitionDialog({ open: false, trait: null, traitId: null });
  };

  // Remove shared trait
  const handleRemoveSharedTrait = (traitId: string) => {
    // This would dispatch an action to remove the shared trait
    console.log(`Removing shared trait: ${traitId}`);
  };

  const renderNPCTrait = (trait: NPCTrait & { canLearn: boolean }) => (
    <Card key={trait.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Psychology color="primary" />
              <Typography variant="h6">{trait.name}</Typography>
              {!trait.canLearn && <Lock color="disabled" />}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Trait description would go here
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={`Req. ${trait.relationshipRequirement} relationship`}
                color={trait.canLearn ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`${trait.essenceCost} essence`}
                color="primary"
                variant="outlined"
              />
            </Box>

            {trait.prerequisites && trait.prerequisites.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Prerequisites:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {trait.prerequisites.map(prereq => (
                    <Chip key={prereq} size="small" label={prereq} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Button
            variant={trait.canLearn ? 'contained' : 'outlined'}
            startIcon={trait.canLearn ? <School /> : <Lock />}
            onClick={() => handleLearnTrait(trait)}
            disabled={!trait.canLearn}
          >
            {trait.canLearn ? 'Learn' : 'Locked'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPlayerTrait = (trait: PlayerTrait) => (
    <Card key={trait.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Star color="warning" />
              <Typography variant="h6">{trait.name}</Typography>
              {trait.isShared && <CheckCircle color="success" />}
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {trait.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Level {trait.level} / {trait.maxLevel}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(trait.level / trait.maxLevel) * 100}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          {trait.isShared ? (
            <Chip icon={<CheckCircle />} label="Shared" color="success" />
          ) : (
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={() => handleShareTrait(trait)}
              disabled={!trait.canShare || availableSlots <= 0}
            >
              Share
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderSharedTrait = (traitId: string, trait: any) => (
    <ListItem key={traitId}>
      <ListItemIcon>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          <Psychology />
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={trait.name || `Trait ${traitId}`}
        secondary="Shared trait - strengthens your bond"
      />
      <IconButton
        edge="end"
        onClick={() => handleRemoveSharedTrait(traitId)}
        color="error"
      >
        <Remove />
      </IconButton>
    </ListItem>
  );

  const currentRelationship = 0; // Placeholder for current relationship value

  const getTraitVisibilityIcon = (traitInfo: NPCTrait) => {
    return traitInfo.isVisible ? (
      <VisibleIcon color="primary" />
    ) : (
      <HiddenIcon color="disabled" />
    );
  };

  const isTraitAvailable = (traitInfo: NPCTrait) => {
    return currentRelationship >= traitInfo.relationshipRequirement;
  };

  const getTraitDetails = (traitId: string) => {
    return {
      name: traitId.charAt(0).toUpperCase() + traitId.slice(1),
      description: 'No description available.',
      category: 'Unknown',
      effects: {},
    };
  };

  if (!npc.traits || Object.keys(npc.traits).length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <TraitIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No traits available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {npc.name} doesn't have any traits you can learn.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Traits Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {npc.name}'s Traits
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Learn traits from {npc.name} by building your relationship and spending Essence.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`Relationship: ${currentRelationship}`}
              color="primary"
            />
            <Chip
              label={`Traits Available: ${Object.values(npc.traits).filter(t => t.isVisible).length}`}
              color="secondary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Visible Traits */}
      <Typography variant="h6" gutterBottom>
        Discoverable Traits
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.entries(npc.traits)
          .filter(([_, traitInfo]) => traitInfo.isVisible)
          .map(([traitId, traitInfo]) => {
            const details = getTraitDetails(traitId);
            const isAvailable = isTraitAvailable(traitInfo);
            
            return (
              <Grid item xs={12} md={6} key={traitId}>
                <Card 
                  variant="outlined"
                  sx={{ 
                    height: '100%',
                    opacity: isAvailable ? 1 : 0.7,
                    border: isAvailable ? 2 : 1,
                    borderColor: isAvailable ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">
                        {details.name}
                      </Typography>
                      <Chip
                        label={details.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {details.description}
                    </Typography>
                    
                    {/* Effects */}
                    {Object.keys(details.effects).length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Effects:
                        </Typography>
                        {Object.entries(details.effects).map(([effect, value]) => (
                          <Chip
                            key={effect}
                            label={`${effect.replace('_', ' ')}: +${value}`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Requirements and Cost */}
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Relationship Required"
                          secondary={traitInfo.relationshipRequirement}
                        />
                        <ListItemIcon>
                          {currentRelationship >= traitInfo.relationshipRequirement ? (
                            <Chip label="✓" color="success" size="small" />
                          ) : (
                            <Chip 
                              label={`Need ${traitInfo.relationshipRequirement - currentRelationship} more`}
                              color="warning" 
                              size="small" 
                            />
                          )}
                        </ListItemIcon>
                      </ListItem>
                      
                      {traitInfo.essenceCost && (
                        <ListItem>
                          <ListItemText
                            primary="Essence Cost"
                            secondary={`${traitInfo.essenceCost} Essence`}
                          />
                        </ListItem>
                      )}
                    </List>
                    
                    <Button
                      fullWidth
                      variant={isAvailable ? "contained" : "outlined"}
                      onClick={() => handleLearnTrait(traitId, traitInfo)}
                      disabled={!isAvailable}
                      startIcon={<LearnIcon />}
                      sx={{ mt: 2 }}
                    >
                      {isAvailable ? 'Learn Trait' : `Requires Relationship ${traitInfo.relationshipRequirement}`}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {/* Hidden Traits */}
      {Object.values(npc.traits).some(t => !t.isVisible) && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Undiscovered Traits
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Some traits remain hidden. Continue building your relationship with {npc.name} to discover them.
          </Alert>
          
          <List>
            {Object.entries(npc.traits)
              .filter(([_, traitInfo]) => !traitInfo.isVisible)
              .map(([traitId, traitInfo], index) => (
                <ListItem key={traitId}>
                  <ListItemText
                    primary="Hidden Trait"
                    secondary={`Unlock at relationship level ${traitInfo.relationshipRequirement}`}
                  />
                  <ListItemIcon>
                    <HiddenIcon color="disabled" />
                  </ListItemIcon>
                </ListItem>
              ))}
          </List>
        </>
      )}

      {/* Trait Sharing Slots (Future Feature) */}
      <Divider sx={{ my: 3 }} />
      
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trait Sharing
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share your traits with {npc.name} to strengthen your bond and unlock new possibilities.
          </Typography>
          
          <Alert severity="info">
            Trait sharing feature coming soon! This will allow you to share your acquired traits with NPCs.
          </Alert>
        </CardContent>
      </Card>

      {/* Trait Action Dialog */}
      <Dialog open={showTraitDialog} onClose={() => setShowTraitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'learn' ? 'Learn Trait' : 'Share Trait'}
        </DialogTitle>
        <DialogContent>
          {selectedTrait && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedTrait.name}
              </Typography>
              
              {actionType === 'learn' && 'relationshipRequirement' in selectedTrait && (
                <Box>
                  <Typography sx={{ mb: 2 }}>
                    Learn this trait from {npc.name}?
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Cost: {selectedTrait.essenceCost} essence
                  </Alert>
                  <Typography variant="body2" color="text.secondary">
                    Learning traits from NPCs strengthens your relationship and expands your abilities.
                  </Typography>
                </Box>
              )}

              {actionType === 'share' && (
                <Box>
                  <Typography sx={{ mb: 2 }}>
                    Share this trait with {npc.name}?
                  </Typography>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Sharing traits strengthens your bond and may unlock new opportunities.
                  </Alert>
                  <Typography variant="body2" color="text.secondary">
                    Shared traits occupy one of {npc.name}'s trait slots ({availableSlots} remaining).
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTraitDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            disabled={actionType === 'share' && availableSlots <= 0}
          >
            {actionType === 'learn' ? 'Learn Trait' : 'Share Trait'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trait Acquisition Dialog */}
      <Dialog
        open={acquisitionDialog.open}
        onClose={() => setAcquisitionDialog({ open: false, trait: null, traitId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Learn Trait: {acquisitionDialog.traitId ? getTraitDetails(acquisitionDialog.traitId).name : ''}
        </DialogTitle>
        
        <DialogContent>
          {acquisitionDialog.trait && acquisitionDialog.traitId && (
            <Box>
              <Typography variant="body1" paragraph>
                Are you sure you want to learn this trait from {npc.name}?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {getTraitDetails(acquisitionDialog.traitId).description}
              </Typography>
              
              {acquisitionDialog.trait.essenceCost && (
                <Alert severity="warning">
                  This will cost {acquisitionDialog.trait.essenceCost} Essence.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAcquisitionDialog({ open: false, trait: null, traitId: null })}>
            Cancel
          </Button>
          <Button 
            onClick={confirmTraitAcquisition}
            variant="contained"
            autoFocus
          >
            Learn Trait
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NPCTraitsTab;
