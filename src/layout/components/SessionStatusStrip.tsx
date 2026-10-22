import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectGameLoop } from '../../features/GameLoop/state/GameLoopSelectors';
import { selectActiveQuests } from '../../features/Quest/state/QuestSelectors';
import { selectOpenCopyExceptions } from '../../features/Story/PlayerInsightSelectors';

/** Persistent read-only status, not a second time controller or game-state authority. */
export const SessionStatusStrip: React.FC = React.memo(() => {
  const loop = useAppSelector(selectGameLoop);
  const activeQuests = useAppSelector(selectActiveQuests);
  const exceptions = useAppSelector(selectOpenCopyExceptions);
  const timed = activeQuests
    .filter(quest => quest.status === 'IN_PROGRESS' && typeof quest.timeLimitSeconds === 'number')
    .map(quest => ({
      id: quest.id,
      name: quest.title,
      remaining: Math.max(0, (quest.timeLimitSeconds ?? 0) - (quest.elapsedSeconds ?? 0)),
    }))
    .sort((a, b) => a.remaining - b.remaining);

  return (
    <Box role="region" aria-label="Current game status" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
      <Chip size="small" variant="outlined" label={
        !loop.isRunning ? 'Simulation stopped' : loop.isPaused ? 'Simulation paused' : 'Simulation running'
      } color={!loop.isRunning || loop.isPaused ? 'warning' : 'success'} />
      {timed.length > 0 && (
        <Button component={RouterLink} to={`/game/quests?quest=${encodeURIComponent(timed[0].id)}`} size="small" color="warning">
          {timed[0].name}: {Math.ceil(timed[0].remaining)}s left
        </Button>
      )}
      {exceptions.length > 0 && (
        <Button component={RouterLink} to={`/game/copies?copy=${encodeURIComponent(exceptions[0].copyId)}`} size="small" color="warning">
          {exceptions.length} Copy exception{exceptions.length === 1 ? '' : 's'} awaiting judgment
        </Button>
      )}
      {timed.length === 0 && exceptions.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          No active deadlines or unresolved Copy exceptions
        </Typography>
      )}
    </Box>
  );
});
SessionStatusStrip.displayName = 'SessionStatusStrip';
