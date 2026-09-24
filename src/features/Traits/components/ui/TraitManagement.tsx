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
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  AutoAwesome as ResonateIcon,
  CheckCircle as PermanentIcon,
  Star as EssenceIcon,
} from '@mui/icons-material';

import {
  selectDiscoveredTraitObjects,
} from '../../state/TraitsSelectors';
import { selectTraitResonanceReadinessById } from '../../state/TraitResonanceReadiness';
import {
  selectPermanentTraits,
} from '../../../Player/state/PlayerSelectors';
import { acquireTraitWithEssenceThunk } from '../../state/TraitThunks';
import type { Trait } from '../../state/TraitsTypes';

export interface TraitManagementProps {
  currentEssence: number;
}

export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  currentEssence,
}) => {
  const dispatch = useAppDispatch();
  const discoveredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const readinessById = useAppSelector(selectTraitResonanceReadinessById);

  const traitsToMakePermanent = useMemo(() => {
    return discoveredTraits.filter(trait => !permanentTraitIds.includes(trait.id));
  }, [discoveredTraits, permanentTraitIds]);

  const handleMakePermanent = (trait: Trait) => {
    dispatch(acquireTraitWithEssenceThunk({ traitId: trait.id }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResonateIcon color="primary" />
        Trait Resonance
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Make Traits Permanent</AlertTitle>
        Resonance makes a discovered Trait permanent. Essence is the final stabilization cost; relationship-derived Traits may also require qualified Connection, assimilation, compatibility, and Memory evidence. Permanent Traits are always active and do not require a slot.
      </Alert>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Discovered Traits ({traitsToMakePermanent.length} available to make permanent)
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
                const cost = trait.essenceCost ?? 0;
                const readiness = readinessById[trait.id];
                const canResonate = readiness?.ready ?? false;
                return (
                  <ListItem
                    key={trait.id}
                    divider
                    secondaryAction={
                      <Tooltip title={canResonate ? 'Make this Trait permanent' : readiness?.blockingMessage ?? 'Trait is not ready for Resonance'}>
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMakePermanent(trait)}
                            disabled={!canResonate}
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
                          {readiness && (
                            <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                              {readiness.requirements
                                .filter(item => item.code !== 'discovered')
                                .map(item => (
                                  <Chip
                                    key={`${trait.id}:${item.code}:${item.label}`}
                                    size="small"
                                    variant="outlined"
                                    color={item.met ? 'success' : 'default'}
                                    label={`${item.met ? '✓' : '○'} ${item.label}`}
                                  />
                                ))}
                            </Stack>
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
                  You have made all your discovered traits permanent.
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
