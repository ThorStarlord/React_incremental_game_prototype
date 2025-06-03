import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Assignment as QuestIcon,
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Star as RewardIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import type { NPC } from '../../../state/NPCTypes';

interface NPCQuestsTabProps {
  npc: NPC;
  relationshipLevel: number;
  onInteraction: (data: { questId: string; actionType: 'accept' | 'complete' }) => void;
}

// Mock quest data for demonstration
const mockQuests = [
  {
    id: 'gather_herbs',
    title: 'Gather Healing Herbs',
    description: 'Collect 10 healing herbs from the nearby forest to help with my research.',
    objectives: [
      { text: 'Collect healing herbs', current: 7, required: 10, completed: false }
    ],
    rewards: ['50 XP', '25 Gold', '+5 Relationship'],
    status: 'accepted',
    difficulty: 'Easy'
  },
  {
    id: 'ancient_artifact',
    title: 'Retrieve Ancient Artifact',
    description: 'Venture into the old ruins and retrieve the crystalline artifact.',
    objectives: [
      { text: 'Enter the ancient ruins', current: 1, required: 1, completed: true },
      { text: 'Find the crystalline artifact', current: 0, required: 1, completed: false },
      { text: 'Return safely', current: 0, required: 1, completed: false }
    ],
    rewards: ['100 XP', '75 Gold', 'Rare Trait: Explorer', '+10 Relationship'],
    status: 'available',
    difficulty: 'Hard'
  },
  {
    id: 'deliver_message',
    title: 'Deliver Important Message',
    description: 'Take this sealed letter to the merchant in the town square.',
    objectives: [
      { text: 'Deliver message to merchant', current: 1, required: 1, completed: true }
    ],
    rewards: ['25 XP', '15 Gold', '+3 Relationship'],
    status: 'completed',
    difficulty: 'Easy'
  }
];

const NPCQuestsTab: React.FC<NPCQuestsTabProps> = React.memo(({ npc, relationshipLevel }) => {
  const handleAcceptQuest = (questId: string) => {
    // TODO: Implement quest acceptance logic
    console.log(`Accepting quest: ${questId}`);
  };

  const handleCompleteQuest = (questId: string) => {
    // TODO: Implement quest completion logic
    console.log(`Completing quest: ${questId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'accepted': return 'primary';
      case 'available': return 'secondary';
      default: return 'default';
    }
  };

  const calculateProgress = (objectives: any[]) => {
    const completed = objectives.filter(obj => obj.completed).length;
    return (completed / objectives.length) * 100;
  };

  const isQuestReady = (quest: any) => {
    return quest.status === 'accepted' && quest.objectives.every((obj: any) => obj.completed);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Quests Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestIcon color="primary" />
          Quests from {npc.name}
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Complete quests to earn rewards and strengthen your relationship with {npc.name}.
          </Typography>
        </Alert>
      </Box>

      {/* Quest List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mockQuests.map((quest) => {
          const progress = calculateProgress(quest.objectives);
          const readyToComplete = isQuestReady(quest);

          return (
            <Accordion key={quest.id} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Typography variant="h6">{quest.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={quest.difficulty} 
                      color={getDifficultyColor(quest.difficulty) as any}
                      size="small"
                    />
                    <Chip 
                      label={quest.status} 
                      color={getStatusColor(quest.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}> {/* Remove default padding top from details */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {quest.description}
                </Typography>

                {/* Quest Objectives */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Objectives:
                  </Typography>
                  <List dense>
                    {quest.objectives.map((objective, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {objective.completed ? (
                            <CompleteIcon color="success" fontSize="small" />
                          ) : (
                            <IncompleteIcon color="disabled" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: objective.completed ? 'line-through' : 'none',
                                color: objective.completed ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {objective.text} ({objective.current}/{objective.required})
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  {quest.status === 'accepted' && (
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ mt: 1, mb: 2 }}
                      color={progress === 100 ? 'success' : 'primary'}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Quest Rewards */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RewardIcon fontSize="small" />
                    Rewards:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {quest.rewards.map((reward, index) => (
                      <Chip 
                        key={index}
                        label={reward} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Quest Actions */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt:2 }}>
                  {quest.status === 'available' && (
                    <Button 
                      variant="contained" 
                      onClick={() => handleAcceptQuest(quest.id)}
                    >
                      Accept Quest
                    </Button>
                  )}
                  
                  {readyToComplete && (
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleCompleteQuest(quest.id)}
                    >
                      Complete Quest
                    </Button>
                  )}
                  
                  {quest.status === 'completed' && (
                    <Chip 
                      icon={<CompleteIcon />}
                      label="Completed" 
                      color="success" 
                      variant="filled"
                    />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Quest Information */}
      {mockQuests.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <InfoIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            No quests available at the moment. Check back later or improve your relationship!
          </Typography>
        </Alert>
      )}
    </Box>
  );
});

NPCQuestsTab.displayName = 'NPCQuestsTab';

export default NPCQuestsTab;
