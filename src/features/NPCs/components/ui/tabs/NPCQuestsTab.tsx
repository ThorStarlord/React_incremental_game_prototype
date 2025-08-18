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
import { selectNpcById } from '../../../state/NPCSelectors';
import { selectQuestById } from '../../../../Quest/state/QuestSelectors';
import { startQuestThunk } from '../../../../Quest/state/QuestThunks';
import { Quest, QuestStatus } from '../../../../Quest/state/QuestTypes';

interface NPCQuestsTabProps {
  npcId: string;
}

const NPCQuestsTab: React.FC<NPCQuestsTabProps> = React.memo(({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector((state) => selectNpcById(state, npcId));
  const availableQuests = npc?.availableQuests.map(questId =>
    useAppSelector(state => selectQuestById(state, questId))
  ).filter((quest): quest is Quest => quest !== undefined) || [];

  const handleAcceptQuest = (questId: string) => {
    dispatch(startQuestThunk(questId));
  };

  const getStatusColor = (status: QuestStatus) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'NOT_STARTED': return 'secondary';
      default: return 'default';
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
        {availableQuests.map((quest) => (
          <Accordion key={quest.id} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6">{quest.title}</Typography>
                <Chip
                  label={quest.status.replace('_', ' ')}
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
                  {quest.objectives.map((objective, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
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
                            {objective.description} ({objective.currentCount}/{objective.requiredCount})
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
                  {quest.rewards.map((reward, index) => (
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
                    disabled={quest.status !== 'NOT_STARTED'}
                  >
                    Accept Quest
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
