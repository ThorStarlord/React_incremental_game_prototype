import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useStore } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { RootState } from '../../../app/store';
import { getNpcWorldLocationId } from '../../NPCs/state/NPCWorldLocationDefinitions';
import {
  selectEffectiveRelationshipTether,
  selectRelationshipEssenceContributionByNpcId,
} from '../../Relationships/state/RelationshipSelectors';
import {
  getConnectedLocationDefinitions,
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../LocationDefinitions';
import { travelToLocationThunk } from '../TravelThunks';

interface ArrivalConsequence {
  npcId: string;
  npcName: string;
  beforeTether: string;
  afterTether: string;
  beforeRate: number;
  afterRate: number;
  showEssence: boolean;
}

interface ArrivalFeedback {
  locationName: string;
  consequences: ArrivalConsequence[];
}

const getArrivalConsequences = (
  beforeState: RootState,
  afterState: RootState
): ArrivalConsequence[] => {
  const discoveredNpcIds = afterState.npcs.discoveredNPCs ?? [];

  return discoveredNpcIds.flatMap(npcId => {
    if (!getNpcWorldLocationId(npcId)) return [];

    const beforeTether = selectEffectiveRelationshipTether(beforeState, npcId);
    const afterTether = selectEffectiveRelationshipTether(afterState, npcId);
    const beforeEssence = selectRelationshipEssenceContributionByNpcId(beforeState, npcId);
    const afterEssence = selectRelationshipEssenceContributionByNpcId(afterState, npcId);

    const tetherChanged = beforeTether.tetherState !== afterTether.tetherState;
    const rateChanged = Math.abs(beforeEssence.effectiveRate - afterEssence.effectiveRate) > 0.000001;
    if (!tetherChanged && !rateChanged) return [];

    return [{
      npcId,
      npcName: afterState.npcs.npcs[npcId]?.name ?? npcId,
      beforeTether: beforeTether.tetherState,
      afterTether: afterTether.tetherState,
      beforeRate: beforeEssence.effectiveRate,
      afterRate: afterEssence.effectiveRate,
      showEssence: beforeEssence.enabled || afterEssence.enabled,
    }];
  });
};

const TravelPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const reduxStore = useStore();
  const locationValue = useAppSelector(state => state.player.location);
  const [error, setError] = useState<string | null>(null);
  const [arrivalFeedback, setArrivalFeedback] = useState<ArrivalFeedback | null>(null);

  const currentLocationId = resolveCanonicalLocationId(locationValue);
  const currentLocation = currentLocationId
    ? getLocationDefinition(currentLocationId)
    : undefined;
  const destinations = getConnectedLocationDefinitions(locationValue);

  const handleTravel = async (destinationId: string) => {
    setError(null);
    setArrivalFeedback(null);
    const beforeState = reduxStore.getState() as RootState;
    const result = await dispatch(travelToLocationThunk(destinationId));
    if (travelToLocationThunk.rejected.match(result)) {
      setError(
        typeof result.payload === 'string'
          ? result.payload
          : result.error.message || 'Travel failed.'
      );
      return;
    }

    const afterState = reduxStore.getState() as RootState;
    const destination = getLocationDefinition(result.payload.toLocationId);
    setArrivalFeedback({
      locationName: destination?.name ?? result.payload.toLocationId,
      consequences: getArrivalConsequences(beforeState, afterState),
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Travel
      </Typography>

      {currentLocation ? (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current location: {currentLocation.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {currentLocation.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {destinations.map(destination => (
              <Button
                key={destination.id}
                variant="outlined"
                onClick={() => handleTravel(destination.id)}
              >
                Travel to {destination.name}
              </Button>
            ))}
          </Box>

          {destinations.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No direct routes are currently authored from this location.
            </Typography>
          )}
        </>
      ) : (
        <Alert severity="warning">
          Current location "{locationValue}" is not part of the authored M18 travel graph.
        </Alert>
      )}

      {arrivalFeedback && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2">Arrived: {arrivalFeedback.locationName}</Typography>
            {arrivalFeedback.consequences.length === 0 ? (
              <Typography variant="body2">
                No discovered anchored Relationship changed spatial Tether on this move.
              </Typography>
            ) : arrivalFeedback.consequences.map(consequence => (
              <Box key={consequence.npcId}>
                <Typography variant="body2" fontWeight="medium">{consequence.npcName}</Typography>
                <Typography variant="body2">
                  Tether: {consequence.beforeTether} → {consequence.afterTether}
                </Typography>
                {consequence.showEssence && (
                  <Typography variant="body2">
                    Relationship Essence: {consequence.beforeRate.toFixed(3)}/sec → {consequence.afterRate.toFixed(3)}/sec
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default TravelPanel;
