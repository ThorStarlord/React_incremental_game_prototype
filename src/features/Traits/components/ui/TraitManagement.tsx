import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material';
import {
  AutoAwesome as ResonateIcon,
  CheckCircle as PermanentIcon,
  Star as EssenceIcon,
} from '@mui/icons-material';

import {
  selectDiscoveredTraitObjects,
} from '../../state/TraitsSelectors';
import {
  selectPermanentTraits,
} from '../../../Player/state/PlayerSelectors';
import { stabilizeTraitWithEssenceThunk } from '../../state/TraitThunks';
import type { Trait } from '../../state/TraitsTypes';
import { evaluateTraitStabilizationReadiness } from '../../state/TraitResonanceReadiness';

export interface TraitManagementProps {
  currentEssence: number;
}

export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  currentEssence,
}) => {
  const dispatch = useAppDispatch();
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const rootState = useAppSelector(state => state);

  const traitsToMakePermanent = useMemo(() => {
    return discoveredTraits.filter(trait => !permanentTraitIds.includes(trait.id));
  }, [discoveredTraits, permanentTraitIds]);

  const handleMakePermanent = (trait: Trait) => {
    const readiness = evaluateTraitStabilizationReadiness(rootState, trait.id);
    if (readiness.ready) {
      dispatch(stabilizeTraitWithEssenceThunk({ traitId: trait.id }));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResonateIcon color="primary" />
        Trait Stabilization
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Stabilize Assimilated Patterns</AlertTitle>
        Essence can stabilize a discovered, sufficiently assimilated Trait pattern so it remains permanently available. Stabilized Traits still affect active play only while expressed in an expression slot.
      </Alert>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Discovered Unstabilized Traits ({traitsToMakePermanent.length})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EssenceIcon color="secondary" />
              <Typography variant="h6" color="secondary.main">
                {currentEssence.toLocaleString()} Essence
              </Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            {traitsToMakePermanent.length > 0 ? (
              traitsToMakePermanent.map((trait) => {
                const readiness = evaluateTraitStabilizationReadiness(rootState, trait.id);
                const cost = readiness.cost;
                return (
                  <ListItem
                    key={trait.id}
                    divider
                    secondaryAction={
                      <Tooltip title={readiness.ready ? 'Stabilize this Trait pattern' : readiness.blockers.join(' • ')}>
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMakePermanent(trait)}
                            disabled={!readiness.ready}
                            startIcon={<ResonateIcon />}
                          >
                            Resonate
                          </Button>
                        </span>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={trait.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {trait.description}
                          </Typography>
                          {trait.essenceCost !== undefined && (
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ display: 'block', mt: 0.5, fontWeight: 'medium' }}
                            >
                              Cost: {cost.toLocaleString()} Essence
                            </Typography>
                          )}
                          {!readiness.ready && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {readiness.blockers.join(' • ')}
                            </Typography>
                          )}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                );
              })
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <PermanentIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                <Typography color="text.secondary">
                  No discovered unstabilized Traits remain.
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';
export default TraitManagement;
