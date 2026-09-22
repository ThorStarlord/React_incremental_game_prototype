import React, { useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  DOCTRINE_DEFINITIONS,
  type DoctrineId,
} from '../../state/DoctrineDefinitions';
import {
  selectActiveDoctrineIds,
  selectDoctrineFocusTraitIds,
} from '../../state/DoctrineSelectors';
import {
  activateDoctrineThunk,
  clearDoctrineFocusThunk,
} from '../../state/DoctrineThunks';

const doctrineIds = Object.keys(DOCTRINE_DEFINITIONS) as DoctrineId[];

/**
 * Player-facing doctrine selection over permanently learned Traits.
 *
 * The surface deliberately hides doctrines until every required Trait is
 * permanent, so it does not leak future relationship-derived capabilities.
 */
const DoctrineFocusPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const permanentTraitIds = useAppSelector(state => state.player.permanentTraits);
  const allTraits = useAppSelector(state => state.traits.traits);
  const npcs = useAppSelector(state => state.npcs.npcs);
  const activeDoctrineIds = useAppSelector(selectActiveDoctrineIds);
  const focusTraitIds = useAppSelector(selectDoctrineFocusTraitIds);

  const eligibleDoctrineIds = useMemo(() => {
    const permanent = new Set(permanentTraitIds);
    return doctrineIds.filter(doctrineId =>
      DOCTRINE_DEFINITIONS[doctrineId].requiredPermanentTraitIds.every(
        traitId => permanent.has(traitId)
      )
    );
  }, [permanentTraitIds]);

  const activeDoctrineId = activeDoctrineIds[0];
  const activeDoctrine = activeDoctrineId
    ? DOCTRINE_DEFINITIONS[activeDoctrineId]
    : undefined;

  return (
    <Stack spacing={2.5} data-test-id="doctrine-focus-panel">
      <Box>
        <Typography variant="h6" gutterBottom>
          Doctrine Focus
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Permanent Traits stay learned. Doctrine focus chooses which learned
          principles currently organize your approach.
        </Typography>
      </Box>

      <Alert severity="info">
        Changing doctrine never removes a permanent Trait. It only changes which
        learned pair is currently foregrounded for higher-order synthesis.
      </Alert>

      <Box data-test-id="active-doctrine-summary">
        <Typography variant="subtitle2" gutterBottom>
          Current doctrine
        </Typography>
        {activeDoctrine ? (
          <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
            <Chip
              label={activeDoctrine.name}
              color="primary"
              data-test-id={`active-doctrine-${activeDoctrine.id}`}
            />
            <Typography variant="body2" color="text.secondary">
              {activeDoctrine.description}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No active doctrine. Adopt an available doctrine to foreground a
            learned capability pair.
          </Typography>
        )}
      </Box>

      <Divider />

      {eligibleDoctrineIds.length === 0 ? (
        <Alert severity="info">
          No doctrine is available yet. Compatible doctrines appear here only
          after every required relationship-derived Trait has become permanent.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {eligibleDoctrineIds.map(doctrineId => {
            const definition = DOCTRINE_DEFINITIONS[doctrineId];
            const isActive = activeDoctrineIds.includes(doctrineId);
            const actionLabel = isActive
              ? 'Current doctrine'
              : activeDoctrineId
                ? `Switch to ${definition.name}`
                : `Adopt ${definition.name}`;

            return (
              <Card
                key={doctrineId}
                variant="outlined"
                data-test-id={`doctrine-card-${doctrineId}`}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                      useFlexGap
                      flexWrap="wrap"
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {definition.name}
                      </Typography>
                      {isActive && <Chip label="Active" size="small" color="success" />}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {definition.description}
                    </Typography>

                    <Stack spacing={0.75}>
                      <Typography variant="caption" fontWeight={600}>
                        Permanent capabilities in this doctrine
                      </Typography>
                      {definition.requiredPermanentTraitIds.map(traitId => {
                        const trait = allTraits[traitId];
                        const sourceNpcId = trait?.sourceNpc ?? trait?.source;
                        const sourceNpcName = sourceNpcId
                          ? npcs[sourceNpcId]?.name ?? sourceNpcId
                          : undefined;

                        return (
                          <Typography
                            key={traitId}
                            variant="caption"
                            color="text.secondary"
                          >
                            {trait?.name ?? traitId} · Permanent
                            {sourceNpcName ? ` · learned with ${sourceNpcName}` : ''}
                          </Typography>
                        );
                      })}
                    </Stack>

                    <Button
                      variant={isActive ? 'contained' : 'outlined'}
                      disabled={isActive}
                      onClick={() => dispatch(activateDoctrineThunk(doctrineId))}
                    >
                      {actionLabel}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {focusTraitIds.length > 0 && (
        <Button
          variant="text"
          onClick={() => dispatch(clearDoctrineFocusThunk())}
        >
          Clear doctrine focus
        </Button>
      )}
    </Stack>
  );
});

DoctrineFocusPanel.displayName = 'DoctrineFocusPanel';

export default DoctrineFocusPanel;
