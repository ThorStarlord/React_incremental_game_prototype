/**
 * @file NPCQuestsTab.tsx
 * @description Quest management interface for NPC interactions including available and completed quests
 */

import React, { useState } from 'react';
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
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Star,
  ExpandMore,
  PlayArrow,
  Info,
  EmojiEvents,
  AttachMoney,
  Psychology,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById } from '../../state/NPCSelectors';
import { updateRelationship } from '../../state/NPCSlice';
import { NPC } from '../../state/NPCTypes';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

interface NPCQuestsTabProps {
  npcId: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  relationshipRequirement: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  estimatedTime: string;
  category: 'main' | 'side' | 'daily' | 'personal';
  prerequisites?: string[];
  status: 'available' | 'active' | 'completed' | 'locked';
  progress?: number;
}

interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

interface QuestReward {
  type: 'essence' | 'relationship' | 'trait' | 'item' | 'service';
  value: number | string;
  description: string;
}

export const NPCQuestsTab: React.FC<NPCQuestsTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(selectNPCById(npcId)) as NPC;
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestDialog, setShowQuestDialog] = useState(false);

  // Mock quest data - this would come from the NPC's quest data
  const mockQuests: Quest[] = [
    {
      id: 'daily_chat',
      title: 'Daily Check-in',
      description: `Have a meaningful conversation with ${npc.name} today.`,
      objectives: [
        { id: 'talk', description: 'Start a conversation', completed: false },
        { id: 'learn', description: 'Learn something new about them', completed: false },
      ],
      rewards: [
        { type: 'relationship', value: 5, description: '+5 Relationship' },
        { type: 'essence', value: 10, description: '+10 Essence' },
      ],
      relationshipRequirement: 0,
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      category: 'daily',
      status: 'available',
    },
    {
      id: 'personal_favor',
      title: 'A Personal Favor',
      description: `${npc.name} needs help with something important to them.`,
      objectives: [
        { id: 'listen', description: 'Listen to their request', completed: false },
        { id: 'gather', description: 'Gather required items', completed: false },
        { id: 'return', description: 'Return with the items', completed: false },
      ],
      rewards: [
        { type: 'relationship', value: 15, description: '+15 Relationship' },
        { type: 'trait', value: 'personal_bond', description: 'Unlock Personal Bond trait' },
        { type: 'essence', value: 50, description: '+50 Essence' },
      ],
      relationshipRequirement: 30,
      difficulty: 'medium',
      estimatedTime: '20 minutes',
      category: 'personal',
      status: npc.relationshipValue >= 30 ? 'available' : 'locked',
    },
    {
      id: 'deep_secret',
      title: 'A Deep Secret',
      description: `${npc.name} is ready to share something very personal with you.`,
      objectives: [
        { id: 'prove_trust', description: 'Prove your trustworthiness', completed: false },
        { id: 'keep_secret', description: 'Promise to keep their secret', completed: false },
        { id: 'support', description: 'Offer emotional support', completed: false },
      ],
      rewards: [
        { type: 'relationship', value: 25, description: '+25 Relationship' },
        { type: 'trait', value: 'confidant', description: 'Unlock Confidant trait' },
        { type: 'service', value: 'personal_training', description: 'Unlock personal training' },
      ],
      relationshipRequirement: 60,
      difficulty: 'hard',
      estimatedTime: '45 minutes',
      category: 'main',
      status: npc.relationshipValue >= 60 ? 'available' : 'locked',
    },
  ];

  // Filter quests by tab
  const getQuestsByStatus = (status: Quest['status']) => {
    return mockQuests.filter(quest => quest.status === status);
  };

  const availableQuests = getQuestsByStatus('available');
  const activeQuests = getQuestsByStatus('active');
  const completedQuests = getQuestsByStatus('completed');

  // Get difficulty color
  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      case 'legendary': return 'secondary';
      default: return 'default';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: Quest['category']) => {
    switch (category) {
      case 'main': return <Star />;
      case 'daily': return <Schedule />;
      case 'personal': return <Psychology />;
      default: return <Assignment />;
    }
  };

  // Handle quest start
  const handleStartQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setShowQuestDialog(true);
  };

  // Handle quest acceptance
  const handleAcceptQuest = () => {
    if (selectedQuest) {
      // This would dispatch an action to start the quest
      console.log(`Starting quest: ${selectedQuest.id}`);
      setShowQuestDialog(false);
      setSelectedQuest(null);
    }
  };

  const renderQuestCard = (quest: Quest) => (
    <Card key={quest.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getCategoryIcon(quest.category)}
              <Typography variant="h6">{quest.title}</Typography>
              <Chip
                size="small"
                label={quest.difficulty}
                color={getDifficultyColor(quest.difficulty)}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {quest.description}
            </Typography>
          </Box>
        </Box>

        {/* Quest Objectives */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Objectives ({quest.objectives.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {quest.objectives.map((objective) => (
                <ListItem key={objective.id}>
                  <ListItemIcon>
                    {objective.completed ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Schedule color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={objective.description}
                    secondary={objective.optional ? 'Optional' : undefined}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Quest Rewards */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Rewards ({quest.rewards.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {quest.rewards.map((reward, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {reward.type === 'essence' && <AttachMoney color="primary" />}
                    {reward.type === 'relationship' && <Psychology color="secondary" />}
                    {reward.type === 'trait' && <Star color="warning" />}
                    {reward.type === 'item' && <EmojiEvents color="success" />}
                    {reward.type === 'service' && <Info color="info" />}
                    <Typography variant="body2">{reward.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Quest Actions */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip size="small" label={`Est. ${quest.estimatedTime}`} variant="outlined" />
            {quest.relationshipRequirement > 0 && (
              <Chip
                size="small"
                label={`Req. ${quest.relationshipRequirement} relationship`}
                color={npc.relationshipValue >= quest.relationshipRequirement ? 'success' : 'error'}
                variant="outlined"
              />
            )}
          </Box>
          
          {quest.status === 'available' && (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => handleStartQuest(quest)}
              disabled={npc.relationshipValue < quest.relationshipRequirement}
            >
              Start Quest
            </Button>
          )}
          
          {quest.status === 'active' && quest.progress !== undefined && (
            <Box sx={{ minWidth: 100 }}>
              <LinearProgress variant="determinate" value={quest.progress} />
              <Typography variant="caption" color="text.secondary">
                {quest.progress}% Complete
              </Typography>
            </Box>
          )}
          
          {quest.status === 'completed' && (
            <Chip icon={<CheckCircle />} label="Completed" color="success" />
          )}
        </Box>

        {quest.status === 'locked' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Relationship level {quest.relationshipRequirement} required to unlock this quest.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Quest Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Quests from {npc.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete quests to deepen your relationship and unlock new opportunities
        </Typography>
      </Box>

      {/* Quest Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label={`Available (${availableQuests.length})`} />
          <Tab label={`Active (${activeQuests.length})`} />
          <Tab label={`Completed (${completedQuests.length})`} />
        </Tabs>
      </Box>

      {/* Quest Lists */}
      {selectedTab === 0 && (
        <Box>
          {availableQuests.length > 0 ? (
            availableQuests.map(renderQuestCard)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No available quests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build your relationship to unlock new quests
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          {activeQuests.length > 0 ? (
            activeQuests.map(renderQuestCard)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No active quests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start a quest from the Available tab
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {selectedTab === 2 && (
        <Box>
          {completedQuests.length > 0 ? (
            completedQuests.map(renderQuestCard)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No completed quests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete quests to see them here
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Quest Start Dialog */}
      <Dialog open={showQuestDialog} onClose={() => setShowQuestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Start Quest: {selectedQuest?.title}</DialogTitle>
        <DialogContent>
          {selectedQuest && (
            <Box>
              <Typography sx={{ mb: 2 }}>{selectedQuest.description}</Typography>
              
              <Typography variant="h6" sx={{ mb: 1 }}>Objectives:</Typography>
              <List dense>
                {selectedQuest.objectives.map((objective) => (
                  <ListItem key={objective.id}>
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText
                      primary={objective.description}
                      secondary={objective.optional ? 'Optional' : undefined}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1 }}>Rewards:</Typography>
              <Grid container spacing={1}>
                {selectedQuest.rewards.map((reward, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="body2">• {reward.description}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated time: {selectedQuest.estimatedTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Difficulty: {selectedQuest.difficulty}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuestDialog(false)}>Cancel</Button>
          <Button onClick={handleAcceptQuest} variant="contained">
            Accept Quest
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NPCQuestsTab;
