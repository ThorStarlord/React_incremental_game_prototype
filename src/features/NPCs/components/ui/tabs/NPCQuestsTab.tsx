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
  AccordionDetails,
  Stack,
} from '@mui/material';
import {
  Assignment as QuestIcon,
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Star as RewardIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import { selectQuestById } from '../../../../Quest/state/QuestSelectors';
import {
  resolveQuestOutcomeThunk,
  startQuestThunk,
  turnInQuestThunk,
} from '../../../../Quest/state/QuestThunks';
import type { Quest, QuestObjective, QuestStatus } from '../../../../Quest/state/QuestTypes';

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

  const handleResolveQuest = (questId: string, resolutionId: string) => {
    dispatch(resolveQuestOutcomeThunk({ questId, resolutionId }));
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
        return 'Ready to Resolve';
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
            Important outcomes can change relationship history and future progression without becoming one-time relationship loot.
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
                              color: objective.isComplete ? 'text.secondary' : 'text.primary',
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

              {quest.status === 'READY_TO_COMPLETE' &&
                quest.resolutionRequired &&
                !quest.selectedResolutionId &&
                (quest.resolutionOptions?.length ?? 0) > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Decision:
                    </Typography>
                    <Stack spacing={1}>
                      {quest.resolutionOptions?.map(option => (
                        <Box key={option.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.25 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            {option.description}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleResolveQuest(quest.id, option.id)}
                          >
                            Choose {option.label}
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

              {quest.selectedResolutionId && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Decision locked: {quest.resolutionOptions?.find(option => option.id === quest.selectedResolutionId)?.label ?? quest.selectedResolutionId}
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RewardIcon fontSize="small" />
                  Turn-in Rewards:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {quest.rewards.length > 0 ? (
                    quest.rewards.map((reward, index) => (
                      <Chip
                        key={index}
                        label={`${reward.value} ${reward.type}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No automatic turn-in reward. Authored resolution consequences are shown above.
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                {quest.status === 'NOT_STARTED' && (
                  <Button
                    variant="contained"
                    onClick={() => handleAcceptQuest(quest.id)}
                  >
                    Accept Quest
                  </Button>
                )}

                {quest.status === 'READY_TO_COMPLETE' &&
                  (!quest.resolutionRequired || Boolean(quest.selectedResolutionId)) && (
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
            No quests available at the moment. Check back later or deepen the relationship.
          </Typography>
        </Alert>
      )}
    </Box>
  );
});

NPCQuestsTab.displayName = 'NPCQuestsTab';

export default NPCQuestsTab;
