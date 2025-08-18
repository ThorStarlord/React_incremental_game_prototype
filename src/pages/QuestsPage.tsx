import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllQuests } from '../features/Quest/state/QuestSelectors';
import { Quest, QuestStatus } from '../features/Quest/state/QuestTypes';
import { getTimeRemaining } from '../shared/utils/time';
import { deliverQuestItemThunk } from '../features/Quest/state/QuestThunks';
import { selectPlayerLocation } from '../features/Player/state/PlayerSelectors';
import { selectAllNPCs } from '../features/NPCs';

type SortKey = 'title' | 'status';

const QuestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const allQuests = useAppSelector(selectAllQuests);
  const playerLocation = useAppSelector(selectPlayerLocation);
  const allNpcs = useAppSelector(selectAllNPCs);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('title');

  const handleStatusFilterChange = (event: SelectChangeEvent<QuestStatus | 'ALL'>) => {
    setStatusFilter(event.target.value as QuestStatus | 'ALL');
  };

  const handleSortKeyChange = (event: SelectChangeEvent<SortKey>) => {
    setSortKey(event.target.value as SortKey);
  };

  const filteredAndSortedQuests = useMemo(() => {
    let quests = Object.values(allQuests);

    if (statusFilter !== 'ALL') {
      quests = quests.filter((quest) => quest.status === statusFilter);
    }

    quests.sort((a, b) => {
      if (sortKey === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortKey === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return quests;
  }, [allQuests, statusFilter, sortKey]);

  const selectedQuest = selectedQuestId ? allQuests[selectedQuestId] : null;

  const renderTimeRemaining = (quest: Quest) => {
    const remaining = getTimeRemaining(quest.startedAt, quest.timeLimitSeconds, quest.elapsedSeconds);
    if (remaining === null) return null;
    if (remaining === 0) return <Typography color="error">Time is up!</Typography>;
    return <Typography>Time Remaining: {remaining} seconds</Typography>;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quest Log
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={handleStatusFilterChange}>
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="READY_TO_COMPLETE">Ready to Complete</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortKey} label="Sort By" onChange={handleSortKeyChange}>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <List component="nav">
                {filteredAndSortedQuests.map((quest) => (
                  <ListItemButton
                    key={quest.id}
                    selected={selectedQuestId === quest.id}
                    onClick={() => setSelectedQuestId(quest.id)}
                  >
                    <ListItemText primary={quest.title} secondary={quest.status} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {selectedQuest ? (
                <>
                  <Typography variant="h5">{selectedQuest.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Status: {selectedQuest.status}
                  </Typography>
                  {renderTimeRemaining(selectedQuest)}
                  <Typography sx={{ mt: 2 }}>{selectedQuest.description}</Typography>

                  <Typography variant="h6" sx={{ mt: 3 }}>Objectives</Typography>
                  <ul>
                    {selectedQuest.objectives.map((obj) => {
                      const canDeliver =
                        selectedQuest.status === 'IN_PROGRESS' &&
                        obj.type === 'DELIVER' &&
                        obj.hasItem &&
                        !obj.delivered &&
                        playerLocation === allNpcs[obj.destination!]?.location;

                      return (
                        <li key={obj.objectiveId}>
                          <Typography
                            sx={{ textDecoration: obj.isComplete ? 'line-through' : 'none' }}
                          >
                            {obj.description} ({obj.currentCount}/{obj.requiredCount})
                          </Typography>
                          {canDeliver && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ mt: 1 }}
                              onClick={() => dispatch(deliverQuestItemThunk({ questId: selectedQuest.id, objectiveId: obj.objectiveId }))}
                            >
                              Deliver Item
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <Typography variant="h6" sx={{ mt: 3 }}>Rewards</Typography>
                  <ul>
                    {selectedQuest.rewards.map((reward, index) => (
                      <li key={index}>
                        <Typography>{reward.type}: {reward.value}</Typography>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Typography>Select a quest to see details.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestsPage;
