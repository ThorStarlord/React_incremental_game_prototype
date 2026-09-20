import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectHasSeenIntro } from '../../Meta/state/MetaSlice';
import {
  WHISPERING_WOODS_LOCATION_ID,
  resolveCanonicalLocationId,
} from '../../Exploration/LocationDefinitions';
import { GC02_FIRST_LESSON_EXPERIENCE_ID } from '../CampaignSpine';

export { GC02_FIRST_LESSON_EXPERIENCE_ID } from '../CampaignSpine';

export type PrologueStage =
  | 'INTRO'
  | 'FIND_WILLOW'
  | 'SPEAK_WITH_WILLOW'
  | 'CHAPTER_ONE_READY';

export interface PrologueStageInput {
  hasSeenIntro: boolean;
  playerLocation: string;
  hasFirstLesson: boolean;
}

export const derivePrologueStage = ({
  hasSeenIntro,
  playerLocation,
  hasFirstLesson,
}: PrologueStageInput): PrologueStage => {
  if (!hasSeenIntro) return 'INTRO';
  if (hasFirstLesson) return 'CHAPTER_ONE_READY';
  if (resolveCanonicalLocationId(playerLocation) !== WHISPERING_WOODS_LOCATION_ID) {
    return 'FIND_WILLOW';
  }
  return 'SPEAK_WITH_WILLOW';
};

export const PrologueObjectivePanel: React.FC = () => {
  const hasSeenIntro = useAppSelector(selectHasSeenIntro);
  const playerLocation = useAppSelector(state => state.player.location);
  const hasFirstLesson = useAppSelector(state =>
    Boolean(state.relationships.experiencesById[GC02_FIRST_LESSON_EXPERIENCE_ID])
  );

  const stage = derivePrologueStage({
    hasSeenIntro,
    playerLocation,
    hasFirstLesson,
  });

  if (stage === 'INTRO') return null;

  if (stage === 'FIND_WILLOW') {
    return (
      <Alert severity="info" data-testid="gc02-prologue-objective" sx={{ mb: 2 }}>
        <AlertTitle>Prologue — Find Elder Willow</AlertTitle>
        <Typography variant="body2">
          Your only known contact is Elder Willow. Use the Dashboard travel controls and follow
          {' '}City Center → City Gate → Whispering Woods.
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <Button component={RouterLink} to="/game/dashboard" size="small" variant="outlined">
            Open travel controls
          </Button>
        </Box>
      </Alert>
    );
  }

  if (stage === 'SPEAK_WITH_WILLOW') {
    return (
      <Alert severity="info" data-testid="gc02-prologue-objective" sx={{ mb: 2 }}>
        <AlertTitle>Prologue — Speak with Elder Willow</AlertTitle>
        <Typography variant="body2">
          Open Dialogue and follow the conversation through The First Lesson. The prologue
          advances only when that Relationship experience is recorded.
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <Button
            component={RouterLink}
            to="/game/npcs/npc_elder_willow"
            size="small"
            variant="outlined"
          >
            Open Elder Willow
          </Button>
        </Box>
      </Alert>
    );
  }

  // GC-03 owns the post-prologue campaign objective surface.
  return null;
};

export default PrologueObjectivePanel;
