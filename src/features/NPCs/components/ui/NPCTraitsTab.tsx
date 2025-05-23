/**
 * @file NPCTraitsTab.tsx
 * @description Trait sharing and learning interface for NPC interactions
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

export const NPCTraitsTab: React.FC<NPCTraitsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(selectNPCById(npcId)) as NPC;
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState<NPCTrait | PlayerTrait | null>(null);
  const [showTraitDialog, setShowTraitDialog] = useState(false);
  const [actionType, setActionType] = useState<'learn' | 'share'>('learn');

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Trait Exchange with {npc.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Learn traits from {npc.name} or share your own to deepen your relationship
        </Typography>
      </Box>

      {/* Shared Traits Summary */}
      <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shared Trait Slots ({usedSharedSlots}/{npc.sharedTraitSlots})
          </Typography>
          
          {usedSharedSlots > 0 ? (
            <List dense>
              {Object.entries(npc.traits).map(([traitId, trait]) =>
                renderSharedTrait(traitId, trait)
              )}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No traits shared yet. Share traits to strengthen your bond!
            </Typography>
          )}

          {availableSlots <= 0 && usedSharedSlots > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              All trait slots are full. Remove a shared trait to add new ones.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Trait Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label={`Learn from ${npc.name} (${teachableTraits.length})`} />
          <Tab label={`Share with ${npc.name} (${shareableTraits.length})`} />
        </Tabs>
      </Box>

      {/* Learn Traits Tab */}
      {selectedTab === 0 && (
        <Box>
          {teachableTraits.length > 0 ? (
            teachableTraits.map(renderNPCTrait)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No traits available to learn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build your relationship to unlock new traits
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Share Traits Tab */}
      {selectedTab === 1 && (
        <Box>
          {availableSlots <= 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No available trait slots. Remove a shared trait first.
            </Alert>
          )}
          
          {shareableTraits.length > 0 ? (
            shareableTraits.map(renderPlayerTrait)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Share sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No traits available to share
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Develop your traits to share them with others
              </Typography>
            </Box>
          )}
        </Box>
      )}

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
    </Box>
  );
};

export default NPCTraitsTab;
