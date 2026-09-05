import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  initializeBondProfile,
  resetRelationships,
} from '../state/RelationshipSlice';
import {
  selectBondProfileByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
} from '../state/RelationshipSelectors';
import { recordAuthoredRelationshipExperienceThunk } from '../state/RelationshipThunks';

const WILLOW_ID = 'npc_elder_willow';

const DIMENSION_LABELS: Array<[keyof ReturnType<typeof selectBondProfileByNpcId>['dimensions'], string]> = [
  ['affinity', 'Affinity'],
  ['trust', 'Trust'],
  ['understanding', 'Understanding'],
  ['sharedMeaning', 'Shared Meaning'],
  ['reliance', 'Reliance'],
  ['vulnerability', 'Vulnerability'],
  ['reciprocity', 'Reciprocity'],
];

const willowSeedProfile = {
  npcId: WILLOW_ID,
  dimensions: {
    affinity: 0,
    trust: 5,
    understanding: 0,
    sharedMeaning: 0,
    reliance: 0,
    vulnerability: 0,
    reciprocity: 0,
  },
  connectionLevel: 0,
  connectionProgress: 0,
} as const;

const RelationshipDebugPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const legacyWillow = useAppSelector(state => state.npcs.npcs[WILLOW_ID]);
  const profile = useAppSelector(state => selectBondProfileByNpcId(state, WILLOW_ID));
  const experiences = useAppSelector(state =>
    selectRelationshipExperiencesByNpcId(state, WILLOW_ID)
  );
  const memories = useAppSelector(state =>
    selectRelationshipMemoriesByNpcId(state, WILLOW_ID)
  );

  const record = (experienceId: string) => {
    dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId }));
  };

  const resetShadow = () => {
    dispatch(resetRelationships());
    dispatch(initializeBondProfile(willowSeedProfile));
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Relationship Shadow Runtime</Typography>
          <Typography variant="body2" color="text.secondary">
            Compares the existing Affinity/Connection model against the additive Experience/Memory/Bond Profile state.
          </Typography>
        </Box>
        <Chip label="SHADOW MODE" color="warning" size="small" />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Legacy Willow State</Typography>
            <Typography variant="body2">Affinity: {legacyWillow?.affinity ?? 'not loaded'}</Typography>
            <Typography variant="body2">Connection Depth: {legacyWillow?.connectionDepth ?? 'not loaded'}</Typography>
            <Typography variant="caption" color="text.secondary">
              This remains authoritative during M3.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Shadow Bond Profile</Typography>
            <Grid container spacing={1}>
              {DIMENSION_LABELS.map(([key, label]) => (
                <Grid item xs={6} sm={4} key={String(key)}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body1">
                    {typeof profile.dimensions[key] === 'number'
                      ? profile.dimensions[key]
                      : 0}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Connection L${profile.connectionLevel}`} />
              <Chip size="small" label={`Progress ${profile.connectionProgress}`} />
              <Chip size="small" label={`Resonance Q ${profile.resonanceQuality}`} />
              <Chip size="small" label={`Stability: ${profile.stability}`} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Authored Event Injection</Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Development-only buttons exercise idempotency and Memory formation before quest/story cutover.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button size="small" variant="outlined" onClick={() => record('willow_exp_sunstone_decision_preserve')}>
            Record Seed Preserved
          </Button>
          <Button size="small" variant="outlined" onClick={() => record('willow_exp_willow_disagrees')}>
            Record Disagreement
          </Button>
          <Button size="small" variant="outlined" onClick={() => record('willow_exp_three_nights_teaching')}>
            Record Three Nights
          </Button>
          <Button size="small" variant="outlined" onClick={() => record('willow_exp_independent_application')}>
            Record Lesson Made Yours
          </Button>
          <Button size="small" color="warning" onClick={resetShadow}>
            Reset Shadow State
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1">Experience Ledger ({experiences.length})</Typography>
          {experiences.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No shadow Experiences recorded yet.</Typography>
          ) : (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {experiences.slice().reverse().map(experience => (
                <Paper key={experience.id} variant="outlined" sx={{ p: 1.25 }}>
                  <Typography variant="body2" fontWeight={600}>{experience.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {experience.id} · {experience.significance} · +{experience.connectionProgressDelta ?? 0} Connection Progress
                  </Typography>
                  {experience.interpretation && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{experience.interpretation}</Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="subtitle1">Memories ({memories.length})</Typography>
          {memories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No landmark Memories formed yet.</Typography>
          ) : (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {memories.map(memory => (
                <Paper key={memory.id} variant="outlined" sx={{ p: 1.25 }}>
                  <Typography variant="body2" fontWeight={600}>{memory.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {memory.playerVisible ? 'Visible' : 'Hidden'} · {memory.persistence}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{memory.summary}</Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
});

RelationshipDebugPanel.displayName = 'RelationshipDebugPanel';

export default RelationshipDebugPanel;
