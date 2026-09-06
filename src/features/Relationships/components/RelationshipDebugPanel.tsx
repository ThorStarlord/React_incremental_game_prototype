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
import type { RelationshipDimensionKey } from '../state/RelationshipTypes';
import { resetRelationships } from '../state/RelationshipSlice';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectRelationshipProgressionDefinition,
  selectTraitAssimilationState,
} from '../state/RelationshipSelectors';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../state/RelationshipThunks';

const WILLOW_ID = 'npc_elder_willow';
const WILLOW_TRAIT_ID = 'WillowsWisdom';

const DIMENSION_LABELS: Array<[RelationshipDimensionKey, string]> = [
  ['affinity', 'Affinity'],
  ['trust', 'Trust'],
  ['understanding', 'Understanding'],
  ['sharedMeaning', 'Shared Meaning'],
  ['reliance', 'Reliance'],
  ['vulnerability', 'Vulnerability'],
  ['reciprocity', 'Reciprocity'],
];

const RelationshipDebugPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const legacyWillow = useAppSelector(state => state.npcs.npcs[WILLOW_ID]);
  const totalEssenceRate = useAppSelector(state => state.essence.generationRate);
  const profile = useAppSelector(state => selectBondProfileByNpcId(state, WILLOW_ID));
  const progression = useAppSelector(state =>
    selectRelationshipProgressionDefinition(state, WILLOW_ID)
  );
  const essenceContribution = useAppSelector(state =>
    selectRelationshipEssenceContributionByNpcId(state, WILLOW_ID)
  );
  const assimilation = useAppSelector(state =>
    selectTraitAssimilationState(state, WILLOW_ID, WILLOW_TRAIT_ID)
  );
  const experiences = useAppSelector(state =>
    selectRelationshipExperiencesByNpcId(state, WILLOW_ID)
  );
  const memories = useAppSelector(state =>
    selectRelationshipMemoriesByNpcId(state, WILLOW_ID)
  );

  const record = (experienceId: string) => {
    dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId }));
  };

  const recordSequence = async (experienceIds: string[]) => {
    for (const experienceId of experienceIds) {
      await dispatch(
        recordAuthoredRelationshipExperienceThunk({ experienceId })
      ).unwrap();
    }
  };

  const resetM4 = async () => {
    dispatch(resetRelationships());
    await dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true }));
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Relationship M4 Runtime</Typography>
          <Typography variant="body2" color="text.secondary">
            Willow uses Experience-qualified Connection authority; the legacy NPC depth is now a compatibility projection.
          </Typography>
        </Box>
        <Chip
          label={progression?.connectionAuthority === 'relationships' ? 'WILLOW CUT OVER' : 'LEGACY'}
          color={progression?.connectionAuthority === 'relationships' ? 'success' : 'warning'}
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Compatibility Projection</Typography>
            <Typography variant="body2">NPC Affinity: {legacyWillow?.affinity ?? 'not loaded'}</Typography>
            <Typography variant="body2">NPC connectionDepth: {legacyWillow?.connectionDepth ?? 'not loaded'}</Typography>
            <Typography variant="caption" color="text.secondary">
              For Willow, connectionDepth mirrors qualified Bond Connection for legacy consumers; it no longer levels from Affinity.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Authoritative Willow Bond Profile</Typography>
            <Grid container spacing={1}>
              {DIMENSION_LABELS.map(([key, label]) => (
                <Grid item xs={6} sm={4} key={key}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body1">{profile.dimensions[key]}</Typography>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Connection L${profile.connectionLevel}`} />
              <Chip size="small" label={`Progress ${profile.connectionProgress}`} />
              <Chip size="small" label={`Resonance Q ${profile.resonanceQuality}`} />
              <Chip size="small" label={`Stability: ${profile.stability}`} />
              <Chip size="small" label={`Tether: ${profile.tetherState}`} />
            </Stack>
            {Object.keys(profile.connectionQualificationEvidence).length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Qualification evidence
                </Typography>
                {Object.entries(profile.connectionQualificationEvidence).map(([level, ids]) => (
                  <Typography key={level} variant="body2">
                    L{level}: {ids.join(', ')}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1">Willow Essence Contribution</Typography>
            <Typography variant="h5" sx={{ my: 0.5 }}>
              {essenceContribution.effectiveRate.toFixed(3)} / sec
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Total game rate: {totalEssenceRate.toFixed(3)} / sec
            </Typography>
            {essenceContribution.explanation.map(line => (
              <Typography key={line} variant="body2">{line}</Typography>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1">Willow's Wisdom Assimilation</Typography>
            <Typography variant="h5" sx={{ my: 0.5 }}>
              {Math.floor(assimilation.progress)}%
            </Typography>
            <Typography variant="body2">Compatibility: {Math.floor(assimilation.compatibility)}</Typography>
            <Typography variant="body2">
              Qualifying Memories: {assimilation.qualifyingMemoryIds.length > 0
                ? assimilation.qualifyingMemoryIds.join(', ')
                : 'none'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Authored Event Qualification</Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Development controls exercise the same idempotent authored thunk as playable dialogue/quest delivery.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            onClick={() => recordSequence([
              'willow_exp_first_question_admit',
              'willow_exp_first_lesson',
            ])}
          >
            Qualify Level 1
          </Button>
          <Button size="small" variant="outlined" onClick={() => record('willow_exp_seed_offered')}>
            Record Seed Offered
          </Button>
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
          <Button
            size="small"
            variant="contained"
            onClick={() => recordSequence([
              'willow_exp_first_question_admit',
              'willow_exp_first_lesson',
              'willow_exp_seed_offered',
              'willow_exp_sunstone_decision_preserve',
              'willow_exp_willow_disagrees',
              'willow_exp_three_nights_teaching',
              'willow_exp_independent_application',
            ])}
          >
            Qualify Full Willow Path
          </Button>
          <Button size="small" color="warning" onClick={resetM4}>
            Reset M4 State
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1">Experience Ledger ({experiences.length})</Typography>
          {experiences.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No Experiences recorded yet.</Typography>
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
