import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
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
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
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

  const traitsToMakePermanent = useMemo(() => {
    return discoveredTraits.filter(trait => !permanentTraitIds.includes(trait.id));
  }, [discoveredTraits, permanentTraitIds]);

  const handleMakePermanent = (trait: Trait) => {
    if (trait.essenceCost !== undefined && currentEssence >= trait.essenceCost) {
      dispatch(acquireTraitWithEssenceThunk({
        traitId: trait.id,
        essenceCost: trait.essenceCost
      }));
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
        Spend Essence to "resonate" with a discovered trait, making it a permanent part of your character. Permanent traits are always active and do not require a slot.
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
                const canAfford = currentEssence >= cost;
                return (
                  <ListItem
                    key={trait.id}
                    divider
                    secondaryAction={
                      <Tooltip title={!canAfford ? `Requires ${cost} Essence` : 'Make this trait permanent'}>
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMakePermanent(trait)}
                            disabled={!canAfford}
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