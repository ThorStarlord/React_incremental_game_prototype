import React, { useMemo } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { NPC } from '../../NPCs/state/NPCTypes';
import { useAppSelector } from '../../../app/hooks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectRelationshipProgressionDefinition,
} from '../state/RelationshipSelectors';

interface MigratedRelationshipSummaryProps {
  npc: NPC;
}

const DIMENSIONS = [
  ['affinity', 'Affinity'],
  ['trust', 'Trust'],
  ['understanding', 'Understanding'],
  ['sharedMeaning', 'Shared Meaning'],
  ['reciprocity', 'Reciprocity'],
] as const;

/**
 * Player-facing explanation of an Experience-qualified relationship.
 * This intentionally shows causes and landmark evidence rather than exposing the
 * complete authoring formula or debug-only ids.
 */
const MigratedRelationshipSummary: React.FC<MigratedRelationshipSummaryProps> = ({ npc }) => {
  const profile = useAppSelector(state => selectBondProfileByNpcId(state, npc.id));
  const experiences = useAppSelector(state =>
    selectRelationshipExperiencesByNpcId(state, npc.id)
  );
  const memories = useAppSelector(state =>
    selectRelationshipMemoriesByNpcId(state, npc.id).filter(memory => memory.playerVisible)
  );
  const progression = useAppSelector(state =>
    selectRelationshipProgressionDefinition(state, npc.id)
  );
  const essence = useAppSelector(state =>
    selectRelationshipEssenceContributionByNpcId(state, npc.id)
  );

  const nextRule = useMemo(() => {
    return [...(progression?.qualificationRules ?? [])]
      .sort((a, b) => a.level - b.level)
      .find(rule => rule.level > profile.connectionLevel);
  }, [progression?.qualificationRules, profile.connectionLevel]);

  const connectionProgress = nextRule
    ? Math.min(100, (profile.connectionProgress / Math.max(1, nextRule.minimumProgress)) * 100)
    : 100;

  const experienceById = useMemo(
    () => Object.fromEntries(experiences.map(experience => [experience.id, experience])),
    [experiences]
  );
  const memoryById = useMemo(
    () => Object.fromEntries(memories.map(memory => [memory.id, memory])),
    [memories]
  );

  const currentEvidence = profile.connectionQualificationEvidence[String(profile.connectionLevel)] ?? [];
  const evidenceLabels = currentEvidence.map(id => {
    const experience = experienceById[id];
    if (experience) return experience.title;
    const memory = memoryById[id];
    if (memory) return `Memory: ${memory.title}`;
    return 'A qualifying shared experience';
  });

  const bondLabel = profile.bondArchetypes.length > 0
    ? profile.bondArchetypes[profile.bondArchetypes.length - 1]
    : profile.connectionLevel > 0
      ? 'Meaningful Connection'
      : 'Unformed Connection';

  const legacyDepth = profile.provenance?.legacyConnectionDepth;
  const legacyDerived = Boolean(profile.provenance?.legacyDerived);

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {legacyDerived && (
          <Alert severity="info">
            This save preserved Connection {profile.connectionLevel} from the legacy relationship system
            {typeof legacyDepth === 'number' ? ` (legacy depth ${legacyDepth})` : ''}. The migration did not invent Experiences, Memories, or qualification evidence. New authored interactions will build that history from here.
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6">Connection with {npc.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Connection measures how much shared history has made you matter to one another. It is not the same as Affinity.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip color="primary" label={`Connection ${profile.connectionLevel}`} />
                <Chip label={bondLabel} variant="outlined" />
                <Chip label={`Stability: ${profile.stability}`} variant="outlined" />
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {DIMENSIONS.map(([key, label]) => (
                <Grid item xs={6} sm={4} md key={key}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="h6">{profile.dimensions[key]}</Typography>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                {nextRule ? `Toward Connection ${nextRule.level}` : 'Current authored Connection ceiling reached'}
              </Typography>
              <LinearProgress variant="determinate" value={connectionProgress} sx={{ mt: 0.75, mb: 0.5, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">
                {nextRule
                  ? `${profile.connectionProgress} / ${nextRule.minimumProgress} relationship progress. Progress alone is not enough: meaningful Experience and Memory evidence must also qualify the change.`
                  : `${profile.connectionProgress} accumulated relationship progress. Further Connection requires later authored relationship development.`}
              </Typography>
            </Box>

            {evidenceLabels.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Why this Connection level was earned</Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                  {evidenceLabels.map((label, index) => (
                    <Chip key={`${label}-${index}`} size="small" color="success" variant="outlined" label={label} />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Passive Essence</Typography>
                {essence.enabled ? (
                  <>
                    <Typography variant="h4" sx={{ my: 1 }}>
                      {essence.effectiveRate.toFixed(3)}/sec
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      This is an ongoing consequence of the current bond, not an Essence reward dropped by a scene.
                    </Typography>
                    <Stack spacing={0.5}>
                      {essence.explanation.map(line => (
                        <Typography key={line} variant="caption" color="text.secondary">{line}</Typography>
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    This relationship is not currently an active source of passive Essence.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Landmark Memories</Typography>
                <Typography variant="body2" color="text.secondary">
                  Memories are the defining experiences that the relationship can later use as evidence.
                </Typography>
                {memories.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No landmark Memory has formed yet. Meaningful interaction can change the relationship before a Memory becomes necessary.
                  </Typography>
                ) : (
                  <List dense>
                    {memories.map(memory => (
                      <ListItem key={memory.id} disableGutters>
                        <ListItemText
                          primary={memory.title}
                          secondary={memory.summary}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6">Recent Meaningful Experiences</Typography>
            {experiences.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You do not yet share enough history for the system to record a meaningful Experience.
              </Typography>
            ) : (
              <List dense>
                {experiences.slice(-5).reverse().map(experience => (
                  <ListItem key={experience.id} disableGutters divider>
                    <ListItemText
                      primary={experience.title}
                      secondary={experience.interpretation || 'This interaction changed the relationship.'}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default React.memo(MigratedRelationshipSummary);
