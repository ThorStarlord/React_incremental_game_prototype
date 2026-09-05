import React from 'react';
import { Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectRelationshipProgressionDefinition,
} from '../state/RelationshipSelectors';
import { recordAuthoredRelationshipExperienceThunk } from '../state/RelationshipThunks';

const LYRA_ID = 'npc_lyra';
const LYRA_PROOF_SEQUENCE = [
  'lyra_exp_strategic_defeat',
  'lyra_exp_coercion_reflected',
  'lyra_exp_reluctant_cotraining',
  'lyra_exp_ideological_friction',
  'lyra_exp_mutual_calibration',
  'lyra_exp_proto_bond',
];

const LyraUniversalityDebugPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => selectBondProfileByNpcId(state, LYRA_ID));
  const progression = useAppSelector(state =>
    selectRelationshipProgressionDefinition(state, LYRA_ID)
  );
  const experiences = useAppSelector(state =>
    selectRelationshipExperiencesByNpcId(state, LYRA_ID)
  );
  const memories = useAppSelector(state =>
    selectRelationshipMemoriesByNpcId(state, LYRA_ID)
  );
  const essenceContribution = useAppSelector(state =>
    selectRelationshipEssenceContributionByNpcId(state, LYRA_ID)
  );

  const runProof = async () => {
    for (const experienceId of LYRA_PROOF_SEQUENCE) {
      await dispatch(
        recordAuthoredRelationshipExperienceThunk({ experienceId })
      ).unwrap();
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Lyra Universality Proof</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Adversarial test: high qualified Connection must remain possible while Affinity stays negative and the bond remains contested.
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Chip
          size="small"
          label={progression?.connectionAuthority === 'relationships' ? 'RELATIONSHIPS AUTHORITY' : 'NOT REGISTERED'}
          color={progression?.connectionAuthority === 'relationships' ? 'success' : 'warning'}
        />
        <Chip size="small" label={`Connection L${profile.connectionLevel}`} />
        <Chip size="small" label={`Affinity ${profile.dimensions.affinity}`} />
        <Chip size="small" label={`Stability ${profile.stability}`} />
        <Chip size="small" label={`Progress ${profile.connectionProgress}`} />
      </Stack>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Understanding</Typography>
          <Typography>{profile.dimensions.understanding}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Shared Meaning</Typography>
          <Typography>{profile.dimensions.sharedMeaning}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Experiences</Typography>
          <Typography>{experiences.length}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Memories</Typography>
          <Typography>{memories.length}</Typography>
        </Grid>
      </Grid>

      {Object.entries(profile.connectionQualificationEvidence).map(([level, ids]) => (
        <Typography key={level} variant="body2" sx={{ mb: 0.5 }}>
          L{level} evidence: {ids.join(', ')}
        </Typography>
      ))}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Lyra Essence contribution: {essenceContribution.effectiveRate.toFixed(3)}/sec (intentionally disabled for this proof).
      </Typography>

      <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={runProof}>
        Run Adversarial Proof
      </Button>
    </Paper>
  );
});

LyraUniversalityDebugPanel.displayName = 'LyraUniversalityDebugPanel';

export default LyraUniversalityDebugPanel;
