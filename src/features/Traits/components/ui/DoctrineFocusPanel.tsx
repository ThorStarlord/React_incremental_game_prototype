import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { previewDoctrineExpression } from '../../state/DoctrineExpressionPreview';
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
 * Player-facing doctrine selection over assimilated Traits. Future pairs remain
 * hidden; current/prospective expression is explained before a commitment.
 */
const DoctrineFocusPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const assimilatedTraitIds = useAppSelector(state => state.player.permanentTraits);
  const expressionSlots = useAppSelector(state => state.player.traitSlots);
  const [pendingDoctrineId, setPendingDoctrineId] = useState<DoctrineId | null>(null);
  const allTraits = useAppSelector(state => state.traits.traits);
  const npcs = useAppSelector(state => state.npcs.npcs);
  const activeDoctrineIds = useAppSelector(selectActiveDoctrineIds);
  const focusTraitIds = useAppSelector(selectDoctrineFocusTraitIds);

  const eligibleDoctrineIds = useMemo(() => {
    const assimilated = new Set(assimilatedTraitIds);
    return doctrineIds.filter(doctrineId =>
      DOCTRINE_DEFINITIONS[doctrineId].requiredPermanentTraitIds.every(
        traitId => assimilated.has(traitId)
      )
    );
  }, [assimilatedTraitIds]);

  const traitName = (id: string) => allTraits[id]?.name ?? id;
  const pendingDefinition = pendingDoctrineId ? DOCTRINE_DEFINITIONS[pendingDoctrineId] : undefined;
  const pendingPreview = pendingDefinition
    ? previewDoctrineExpression(expressionSlots, pendingDefinition.requiredPermanentTraitIds)
    : null;

  const activeDoctrineId = activeDoctrineIds[0];
  const activeDoctrine = activeDoctrineId
    ? DOCTRINE_DEFINITIONS[activeDoctrineId]
    : undefined;

  return (
    <Stack spacing={2.5} data-testid="doctrine-focus-panel">
      <Box>
        <Typography variant="h6" gutterBottom>
          Doctrine Focus
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assimilated Traits stay permanently available. Doctrine focus organizes
          a currently expressed pair into a higher-order strategic posture.
        </Typography>
      </Box>

      <Alert severity="info">
        Adopting or switching a doctrine explicitly expresses its assimilated pair
        in the first unlocked expression slots. Existing expressed patterns may
        be suppressed, but their learned ownership does not change. Review each
        doctrine's expression preview before committing.
      </Alert>

      <Box data-testid="active-doctrine-summary">
        <Typography variant="subtitle2" gutterBottom>
          Current doctrine
        </Typography>
        {activeDoctrine ? (
          <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
            <Chip
              label={activeDoctrine.name}
              color="primary"
              data-testid={`active-doctrine-${activeDoctrine.id}`}
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
          after every required relationship-derived Trait has been assimilated.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {eligibleDoctrineIds.map(doctrineId => {
            const definition = DOCTRINE_DEFINITIONS[doctrineId];
            const isActive = activeDoctrineIds.includes(doctrineId);
            const preview = previewDoctrineExpression(expressionSlots, definition.requiredPermanentTraitIds);
            const actionLabel = isActive
              ? 'Current doctrine'
              : activeDoctrineId
                ? `Switch to ${definition.name}`
                : `Adopt ${definition.name}`;

            return (
              <Card
                key={doctrineId}
                variant="outlined"
                data-testid={`doctrine-card-${doctrineId}`}
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
                        Assimilated patterns in this doctrine
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
                            {trait?.name ?? traitId} · Assimilated
                            {sourceNpcName ? ` · learned with ${sourceNpcName}` : ''}
                          </Typography>
                        );
                      })}
                    </Stack>

                    <Box role="group" aria-label={`Expression preview for ${definition.name}`} sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1.5 }}>
                      <Typography variant="caption" fontWeight={600} display="block">Before / after expression</Typography>
                      <Typography variant="body2">Currently expressed: {preview?.before.map(traitName).join(', ') || 'none'}</Typography>
                      <Typography variant="body2">After switching: {preview?.after.map(traitName).join(', ') || 'none'}</Typography>
                      {preview?.newlyExpressed.length ? (
                        <Typography variant="body2" color="success.main">Will express: {preview.newlyExpressed.map(traitName).join(', ')}</Typography>
                      ) : null}
                      {preview?.suppressed.length ? (
                        <Typography variant="body2" color="warning.main">Will suppress: {preview.suppressed.map(traitName).join(', ')}</Typography>
                      ) : null}
                      {!preview && <Typography variant="body2" color="warning.main">Not enough unlocked expression slots.</Typography>}
                      <Typography variant="caption" color="text.secondary">
                        Current active effects come only from expressed patterns. Assimilated ownership is not lost when a pattern is suppressed.
                      </Typography>
                    </Box>

                    <Button
                      variant={isActive ? 'contained' : 'outlined'}
                      disabled={isActive || !preview}
                      onClick={() => {
                        if (preview?.suppressed.length) setPendingDoctrineId(doctrineId);
                        else dispatch(activateDoctrineThunk(doctrineId));
                      }}
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

      <Dialog open={Boolean(pendingDoctrineId)} onClose={() => setPendingDoctrineId(null)} aria-labelledby="doctrine-switch-confirm-title">
        <DialogTitle id="doctrine-switch-confirm-title">Confirm Doctrine Switch</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Switching to {pendingDefinition?.name} will express {pendingPreview?.after.map(traitName).join(', ') || 'the required pair'}.
          </Typography>
          <Typography variant="body2" color="warning.main">
            This suppresses {pendingPreview?.suppressed.map(traitName).join(', ') || 'no patterns'} and stops their active effects. Known and assimilated ownership is not deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDoctrineId(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (pendingDoctrineId && pendingPreview) dispatch(activateDoctrineThunk(pendingDoctrineId));
            setPendingDoctrineId(null);
          }}>Confirm Switch</Button>
        </DialogActions>
      </Dialog>

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
