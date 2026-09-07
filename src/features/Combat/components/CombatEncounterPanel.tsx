import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  createCombatEncounterState,
  getCombatActionPresentations,
  performCombatAction,
} from '../CombatEngine';
import type {
  CombatActionId,
  CombatEncounterDefinition,
  CombatEncounterState,
} from '../CombatTypes';

interface CombatEncounterPanelProps {
  definition: CombatEncounterDefinition;
  permanentTraitIds: readonly string[];
  onTargetKilled: (targetId: string) => void;
}

export const CombatEncounterPanel: React.FC<CombatEncounterPanelProps> = ({
  definition,
  permanentTraitIds,
  onTargetKilled,
}) => {
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<CombatEncounterState>(() =>
    createCombatEncounterState(definition)
  );
  const [message, setMessage] = useState(
    'The manifestation is present, but the exchange has not begun.'
  );
  const victoryReported = useRef(false);

  const actions = useMemo(
    () => getCombatActionPresentations(definition, state, permanentTraitIds),
    [definition, state, permanentTraitIds]
  );

  const beginEncounter = () => {
    victoryReported.current = false;
    setState(createCombatEncounterState(definition));
    setMessage('The Telluric pressure coheres into a hostile manifestation.');
    setStarted(true);
  };

  const perform = (actionId: CombatActionId) => {
    const result = performCombatAction(
      definition,
      state,
      actionId,
      permanentTraitIds
    );

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setState(result.state);
    setMessage(result.message);

    if (result.victoryJustOccurred && !victoryReported.current) {
      victoryReported.current = true;
      onTargetKilled(definition.targetId);
    }
  };

  const playerPercent = (state.playerHealth / definition.playerMaxHealth) * 100;
  const enemyPercent = (state.enemyHealth / definition.enemyMaxHealth) * 100;

  return (
    <Card elevation={2} data-testid={`combat-encounter-${definition.id}`}>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h6" component="h2">
                {definition.name}
              </Typography>
              {started && <Chip size="small" label={`Phase: ${state.enemyPhase}`} />}
              {started && <Chip size="small" label={`Round ${Math.max(1, state.round + 1)}`} />}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {definition.description}
            </Typography>
          </Box>

          {!started ? (
            <Button variant="contained" onClick={beginEncounter}>
              Begin Encounter
            </Button>
          ) : (
            <>
              <Box>
                <Typography variant="body2">
                  Your encounter vitality: {state.playerHealth}/{definition.playerMaxHealth}
                </Typography>
                <LinearProgress variant="determinate" value={playerPercent} sx={{ mt: 0.5 }} />
              </Box>

              <Box>
                <Typography variant="body2">
                  Echo integrity: {state.enemyHealth}/{definition.enemyMaxHealth}
                </Typography>
                <LinearProgress variant="determinate" value={enemyPercent} sx={{ mt: 0.5 }} />
              </Box>

              {state.patternRead && !state.feedbackDisrupted && (
                <Alert severity="info">
                  The feedback cycle is legible. The disruption window occurs during release.
                </Alert>
              )}

              {state.feedbackDisrupted && (
                <Alert severity="success">
                  The feedback loop is broken. The Echo can no longer regenerate.
                </Alert>
              )}

              {state.status === 'victory' && (
                <Alert severity="success">The Telluric Echo Fragment is defeated.</Alert>
              )}

              {state.status === 'defeat' && (
                <Alert severity="error">
                  The manifestation overwhelms this attempt. No kill has been recorded.
                </Alert>
              )}

              <Typography variant="body2" data-testid="combat-message">
                {message}
              </Typography>

              {state.status === 'active' && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {actions
                    .filter(action => !action.hidden)
                    .map(action => (
                      <Button
                        key={action.id}
                        variant={
                          action.id === 'trace_pattern' || action.id === 'disrupt_feedback'
                            ? 'outlined'
                            : 'contained'
                        }
                        disabled={!action.enabled}
                        title={action.reason ?? action.description}
                        onClick={() => perform(action.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                </Stack>
              )}

              {state.status === 'defeat' && (
                <Button variant="outlined" onClick={beginEncounter}>
                  Retry Encounter
                </Button>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CombatEncounterPanel;
