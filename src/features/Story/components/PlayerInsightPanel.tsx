import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import {
  selectCausalJournalEntries,
  selectMasteredRoutines,
  selectMasteryCompressionOverview,
  selectOpportunityMap,
  selectOpenCopyExceptions,
  selectRelationshipBuildCapabilities,
  type RelationshipCapabilityStatus,
} from '../PlayerInsightSelectors';
import { DOCTRINE_DEFINITIONS } from '../../Traits/state/DoctrineDefinitions';
import { selectActiveDoctrineIds } from '../../Traits/state/DoctrineSelectors';

const capabilityColor = (
  status: RelationshipCapabilityStatus
): 'default' | 'warning' | 'success' => {
  if (status === 'permanent') return 'success';
  if (status === 'resonance_ready') return 'warning';
  return 'default';
};

const capabilityLabel = (status: RelationshipCapabilityStatus): string => {
  if (status === 'permanent') return 'Permanent';
  if (status === 'resonance_ready') return 'Resonance ready';
  return 'Developing';
};

/**
 * Read-only projection over canonical gameplay state.
 *
 * This component owns no journal, opportunity, chapter, relationship, Trait,
 * routine-mastery, or Copy state. It intentionally exposes only evidence the
 * player has already earned.
 */
export const PlayerInsightPanel: React.FC = React.memo(() => {
  const journal = useAppSelector(state => selectCausalJournalEntries(state, 5));
  const opportunities = useAppSelector(selectOpportunityMap);
  const capabilities = useAppSelector(selectRelationshipBuildCapabilities);
  const activeDoctrineIds = useAppSelector(selectActiveDoctrineIds);
  const masteredRoutines = useAppSelector(selectMasteredRoutines);
  const copyExceptions = useAppSelector(selectOpenCopyExceptions);
  const masteryCompression = useAppSelector(selectMasteryCompressionOverview);
  const visibleOpportunities = opportunities.filter(
    chapter => chapter.status !== 'not_started'
  );

  return (
    <Card elevation={2} data-test-id="player-insight-panel">
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              Player Insight
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A read-only view of consequences, unresolved opportunities, learned capabilities, and repeatable work you have already mastered.
            </Typography>
          </Box>

          {copyExceptions.length > 0 && (
            <Box
              data-test-id="copy-exception-inbox"
              sx={{ border: 1, borderColor: 'warning.main', borderRadius: 1, p: 2 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Needs your judgment
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                Copies handle known procedures. When a routine encounters something outside that authority, it stops and returns the problem to you.
              </Typography>
              <Stack spacing={1.5}>
                {copyExceptions.map(exception => (
                  <Box key={exception.exceptionId}>
                    <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                      <Typography variant="body2" fontWeight={600}>
                        {exception.title}
                      </Typography>
                      <Chip
                        label={exception.status === 'acknowledged' ? 'Acknowledged' : 'Action required'}
                        size="small"
                        color="warning"
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {exception.copyName} · {exception.routineName} · tick {exception.detectedAtTick}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {exception.summary}
                    </Typography>
                    <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                      Escalation boundary: {exception.boundaryLabel}. {exception.boundaryDescription}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                      Open this Copy's details to acknowledge the operational exception. Player Insight remains read-only, and acknowledgement still does not resolve the underlying player-owned decision.
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Causal Journal
                </Typography>
                {journal.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No player-visible relationship memories have formed yet.
                  </Typography>
                ) : journal.map(entry => (
                  <Box key={entry.id}>
                    <Typography variant="body2" fontWeight={600}>
                      {entry.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {entry.causeLabel} · {entry.npcName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {entry.summary}
                    </Typography>
                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
                      {entry.tags.slice(0, 3).map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Opportunity Map
                </Typography>
                {visibleOpportunities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No chapter-scale opportunity has enough player evidence to reveal a route yet.
                  </Typography>
                ) : visibleOpportunities.map(chapter => (
                  <Box key={chapter.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={600}>
                        {chapter.title}
                      </Typography>
                      <Chip
                        label={chapter.status === 'complete' ? 'Complete' : 'In progress'}
                        size="small"
                        color={chapter.status === 'complete' ? 'success' : 'default'}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                      {chapter.centerOfGravity}
                    </Typography>
                    <Stack spacing={1}>
                      {chapter.routes.map(route => (
                        <Box key={route.routeId}>
                          <Typography variant="body2">{route.label}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={route.totalRequirements === 0
                              ? 0
                              : (route.satisfiedRequirements / route.totalRequirements) * 100}
                            sx={{ mt: 0.5 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {route.satisfiedRequirements}/{route.totalRequirements} evidenced
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Relationship-Derived Build
                </Typography>
                {activeDoctrineIds.length > 0 ? (
                  <Box data-test-id="player-insight-active-doctrine">
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Current doctrine
                    </Typography>
                    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                      {activeDoctrineIds.map(doctrineId => (
                        <Chip
                          key={doctrineId}
                          label={DOCTRINE_DEFINITIONS[doctrineId].name}
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Current doctrine: none selected.
                  </Typography>
                )}
                {capabilities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Relationship-mediated capabilities remain hidden until discovered through play.
                  </Typography>
                ) : capabilities.map(capability => (
                  <Box key={capability.traitId}>
                    <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                      <Typography variant="body2" fontWeight={600}>
                        {capability.name}
                      </Typography>
                      <Chip
                        label={capabilityLabel(capability.status)}
                        size="small"
                        color={capabilityColor(capability.status)}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Learned with {capability.sourceNpcName} · Connection {capability.connectionLevel}/{capability.requiredConnectionLevel}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, capability.assimilationProgress)}
                      sx={{ mt: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Assimilation {capability.assimilationProgress}/{capability.assimilationThreshold}
                    </Typography>
                    {capability.evidence.length > 0 ? (
                      <Stack spacing={0.75} sx={{ mt: 1 }}>
                        <Typography variant="caption" fontWeight={600}>
                          Learned through remembered experience
                        </Typography>
                        {capability.evidence.map(evidence => (
                          <Box key={evidence.memoryId} sx={{ pl: 1, borderLeft: 2, borderColor: 'divider' }}>
                            <Typography variant="caption" fontWeight={600} display="block">
                              {evidence.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              From: {evidence.causeLabel}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {evidence.summary}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : capability.status === 'developing' ? (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                        Your understanding is still developing through shared experience.
                      </Typography>
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Mastered Routines
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Personally learned repeatable work. A specific Copy may still need the right maturity, role, loyalty, or location before you can delegate it.
                </Typography>
                {masteredRoutines.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No repeatable routine has been personally mastered yet.
                  </Typography>
                ) : masteredRoutines.map(routine => (
                  <Box key={routine.taskId}>
                    <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                      <Typography variant="body2" fontWeight={600}>
                        {routine.name}
                      </Typography>
                      <Chip label="Mastered by you" size="small" color="success" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {routine.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {routine.sourceLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mastery recorded <time dateTime={new Date(routine.learnedAt).toISOString()}>{new Date(routine.learnedAt).toLocaleString()}</time>
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Box
            data-test-id="mastery-compression-overview"
            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Mastery Compression
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Solved work can rise from personal routine to shared procedure to a standing responsibility. Unknown or irreversible judgment still returns to you.
            </Typography>

            <Stack spacing={1.5}>
              {masteryCompression.procedureFamilies.map(family => (
                <Box key={family.id}>
                  <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600}>
                      Procedure family — {family.name}
                    </Typography>
                    <Chip
                      label={family.status === 'mastered' ? 'Generalized' : `${family.masteredRoutineIds.length}/${family.requiredRoutineIds.length} evidence`}
                      size="small"
                      color={family.status === 'mastered' ? 'success' : 'default'}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {family.description}
                  </Typography>
                </Box>
              ))}

              <Box>
                <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                  <Typography variant="body2" fontWeight={600}>
                    Operational domain — {masteryCompression.operationalDomain.name}
                  </Typography>
                  <Chip
                    label={masteryCompression.operationalDomain.status.replace(/_/g, ' ')}
                    size="small"
                    color={
                      masteryCompression.operationalDomain.status === 'operating'
                        ? 'success'
                        : masteryCompression.operationalDomain.status === 'attention_required'
                          ? 'warning'
                          : 'default'
                    }
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {masteryCompression.operationalDomain.description}
                </Typography>
                {masteryCompression.operationalDomain.reasons.map(reason => (
                  <Typography key={reason} variant="caption" color="text.secondary" display="block">
                    {reason}
                  </Typography>
                ))}
              </Box>

              {masteryCompression.standingResponsibilities.length > 0 && (
                <Box>
                  <Typography variant="caption" fontWeight={600} display="block">
                    Standing responsibilities
                  </Typography>
                  {masteryCompression.standingResponsibilities.map(responsibility => (
                    <Typography
                      key={`${responsibility.copyId}:${responsibility.routineId}`}
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {responsibility.routineName} — {responsibility.copyName}
                    </Typography>
                  ))}
                </Box>
              )}

              <Typography variant="caption" color="text.secondary">
                Campaign One ceiling: {masteryCompression.organizationalCeiling.summary} Managers-of-managers and autonomous strategy remain outside this campaign.
              </Typography>
            </Stack>
          </Box>

          <Divider />
          <Typography variant="caption" color="text.secondary">
            This view explains recorded state; it does not create chapter completion, reveal undiscovered authored Traits, grant routine mastery, resolve Copy exceptions, or make delegation decisions for the player.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
});

PlayerInsightPanel.displayName = 'PlayerInsightPanel';

export default PlayerInsightPanel;