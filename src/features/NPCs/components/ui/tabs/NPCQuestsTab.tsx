import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Chip, LinearProgress } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import type { NpcState } from '../../../state/NpcTypes';

interface NPCQuestsTabProps {
  npc: NpcState;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'accepted' | 'completed';
  progress?: number;
  maxProgress?: number;
  rewards: {
    xp?: number;
    gold?: number;
    essence?: number;
    items?: string[];
  };
  requirements?: {
    level?: number;
    relationshipLevel?: number;
  };
}

const NPCQuestsTab: React.FC<NPCQuestsTabProps> = ({ npc }) => {
  // Mock quests - in real implementation, this would come from quest system
  const quests: Quest[] = [
    {
      id: 'fetch_herbs',
      title: 'Gather Healing Herbs',
      description: 'Collect 10 healing herbs from the nearby forest to help with my research.',
      status: 'available',
      rewards: {
        xp: 100,
        gold: 50,
        essence: 5
      },
      requirements: {
        relationshipLevel: 3
      }
    },
    {
      id: 'deliver_message',
      title: 'Deliver a Message',
      description: 'Take this important message to the merchant in the town square.',
      status: 'accepted',
      progress: 0,
      maxProgress: 1,
      rewards: {
        xp: 75,
        gold: 30,
        essence: 3
      }
    },
    {
      id: 'find_artifact',
      title: 'Locate Ancient Artifact',
      description: 'Help me find a mysterious artifact rumored to be hidden in the old ruins.',
      status: 'available',
      rewards: {
        xp: 300,
        gold: 200,
        essence: 25,
        items: ['Ancient Key']
      },
      requirements: {
        level: 5,
        relationshipLevel: 4
      }
    }
  ];

  const handleAcceptQuest = (quest: Quest) => {
    // TODO: Implement quest acceptance logic
    console.log(`Accepting quest: ${quest.title}`);
  };

  const handleCompleteQuest = (quest: Quest) => {
    // TODO: Implement quest completion logic
    console.log(`Completing quest: ${quest.title}`);
  };

  const canAcceptQuest = (quest: Quest): boolean => {
    if (quest.requirements?.relationshipLevel && npc.relationshipValue < quest.requirements.relationshipLevel) {
      return false;
    }
    // TODO: Check player level requirement
    return true;
  };

  const getQuestStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'available': return 'primary';
      case 'accepted': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getQuestStatusIcon = (status: Quest['status']) => {
    switch (status) {
      case 'available': return <AssignmentIcon />;
      case 'accepted': return <HourglassEmptyIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AssignmentIcon color="primary" />
        <Typography variant="h6">Quests from {npc.name}</Typography>
      </Box>

      {/* Quests List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {quests.map((quest) => (
          <Card key={quest.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getQuestStatusIcon(quest.status)}
                    <Typography variant="h6">{quest.title}</Typography>
                    <Chip
                      label={quest.status.toUpperCase()}
                      size="small"
                      color={getQuestStatusColor(quest.status)}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {quest.description}
                  </Typography>

                  {/* Progress Bar for Accepted Quests */}
                  {quest.status === 'accepted' && quest.progress !== undefined && quest.maxProgress !== undefined && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Progress: {quest.progress} / {quest.maxProgress}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(quest.progress / quest.maxProgress) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  {/* Requirements */}
                  {quest.requirements && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Requirements:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {quest.requirements.level && (
                          <Chip
                            label={`Level ${quest.requirements.level}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {quest.requirements.relationshipLevel && (
                          <Chip
                            label={`Relationship ${quest.requirements.relationshipLevel}+`}
                            size="small"
                            variant="outlined"
                            color={npc.relationshipValue >= quest.requirements.relationshipLevel ? 'success' : 'error'}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Rewards */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Rewards:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {quest.rewards.xp && (
                        <Chip label={`${quest.rewards.xp} XP`} size="small" color="info" />
                      )}
                      {quest.rewards.gold && (
                        <Chip label={`${quest.rewards.gold} Gold`} size="small" color="warning" />
                      )}
                      {quest.rewards.essence && (
                        <Chip label={`${quest.rewards.essence} Essence`} size="small" color="secondary" />
                      )}
                      {quest.rewards.items?.map((item) => (
                        <Chip key={item} label={item} size="small" color="success" />
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Action Button */}
                <Box sx={{ flexShrink: 0 }}>
                  {quest.status === 'available' && (
                    <Button
                      variant="contained"
                      onClick={() => handleAcceptQuest(quest)}
                      disabled={!canAcceptQuest(quest)}
                    >
                      Accept
                    </Button>
                  )}
                  {quest.status === 'accepted' && quest.progress === quest.maxProgress && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleCompleteQuest(quest)}
                    >
                      Complete
                    </Button>
                  )}
                  {quest.status === 'completed' && (
                    <Button variant="outlined" disabled>
                      Completed
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {quests.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No quests available from {npc.name} at this time.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default React.memo(NPCQuestsTab);
