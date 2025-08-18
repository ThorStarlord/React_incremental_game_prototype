import React from 'react';
import {
  Box,
  Typography,
  Button,
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
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import { selectQuestById } from '../../../../Quest/state/QuestSelectors';
import { startQuestThunk, turnInQuestThunk } from '../../../../Quest/state/QuestThunks';
import { Quest, QuestObjective, QuestStatus } from '../../../../Quest/state/QuestTypes';

interface NPCQuestsTabProps {
  npcId: string;
}

const formatObjectiveText = (objective: QuestObjective) => {
  switch (objective.type) {
    case 'GATHER':
    case 'KILL':
      return `${objective.description} (${objective.currentCount}/${objective.requiredCount})`;
    case 'REACH_LOCATION':
      return objective.description;
    default:
      return objective.description;
  }
};

const NPCQuestsTab: React.FC<NPCQuestsTabProps> = React.memo(({ npcId }) => {
  const dispatch = useAppDispatch();
  const { npc, availableQuests } = useAppSelector((state) => {
    const n = selectNPCById(state, npcId);
    const quests: Quest[] = (n?.availableQuests ?? [])
      .map((questId: string) => selectQuestById(state, questId))
      .filter((quest: Quest | undefined): quest is Quest => quest !== undefined);
    return { npc: n, availableQuests: quests };
  });

  const handleAcceptQuest = (questId: string) => {
    dispatch(startQuestThunk(questId));
  };

  const handleTurnInQuest = (questId: string) => {
    dispatch(turnInQuestThunk(questId));
  };

  const getStatusColor = (status: QuestStatus) => {
    switch (status) {
      case 'READY_TO_COMPLETE':
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'NOT_STARTED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatQuestStatusLabel = (status: QuestStatus): string => {
    switch (status) {
      case 'READY_TO_COMPLETE':
        return 'Ready to Turn In';
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'NOT_STARTED':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestIcon color="primary" />
          Quests from {npc?.name}
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Complete quests to earn rewards and strengthen your relationship with {npc?.name}.
          </Typography>
        </Alert>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  {availableQuests.map((quest: Quest) => (
          <Accordion key={quest.id} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6">{quest.title}</Typography>
                <Chip
                  label={formatQuestStatusLabel(quest.status)}
                  color={getStatusColor(quest.status)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {quest.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Objectives:
                </Typography>
                <List dense>
                  {quest.objectives.map((objective: QuestObjective) => (
                    <ListItem key={objective.objectiveId} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {objective.isComplete ? (
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
                              textDecoration: objective.isComplete ? 'line-through' : 'none',
                              color: objective.isComplete ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {formatObjectiveText(objective)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RewardIcon fontSize="small" />
                  Rewards:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {quest.rewards.map((reward: any, index: number) => (
                    <Chip 
                      key={index}
                      label={`${reward.value} ${reward.type}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt:2 }}>
                {quest.status === 'NOT_STARTED' && (
                  <Button
                    variant="contained"
                    onClick={() => handleAcceptQuest(quest.id)}
                  >
                    Accept Quest
                  </Button>
                )}

                {quest.status === 'READY_TO_COMPLETE' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTurnInQuest(quest.id)}
                  >
                    Turn In Quest
                  </Button>
                )}
                {quest.status === 'COMPLETED' && (
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
        ))}
      </Box>

      {availableQuests.length === 0 && (
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
