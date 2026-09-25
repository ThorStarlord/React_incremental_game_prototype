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
import { acquireTraitWithEssenceThunk } from '../../state/TraitThunks';
import type { Trait } from '../../state/TraitsTypes';
import { evaluateTraitResonanceReadiness } from '../../state/TraitResonanceReadiness';

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
    const readiness = evaluateTraitResonanceReadiness(rootState, trait.id);
    if (readiness.ready) {
      dispatch(acquireTraitWithEssenceThunk({ traitId: trait.id }));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResonateIcon color="primary" />
        Trait Resonance
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Make Traits Permanent</AlertTitle>
        Resonance can make a discovered Trait permanent only when Campaign One has a qualified durable Player effect for it. Permanent Traits stay active without occupying a slot.
      </Alert>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Discovered Non-Permanent Traits ({traitsToMakePermanent.length})
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
                const readiness = evaluateTraitResonanceReadiness(rootState, trait.id);
                const cost = readiness.cost;
                return (
                  <ListItem
                    key={trait.id}
                    divider
                    secondaryAction={
                      <Tooltip title={readiness.ready ? 'Make this trait permanent' : readiness.blockers.join(' • ')}>
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
                  No discovered non-permanent Traits remain.
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
