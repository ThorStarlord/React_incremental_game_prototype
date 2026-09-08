import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  CITY_CENTER_LOCATION_ID,
  getConnectedLocationDefinitions,
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../LocationDefinitions';
import { practiceForgeAssistanceThunk, travelToLocationThunk } from '../TravelThunks';
import { NPC_WORLD_LOCATION_IDS } from '../../NPCs/state/NPCWorldLocationDefinitions';
import { deriveSpatialRelationshipTether } from '../../Relationships/state/RelationshipSelectors';

interface SpatialTetherFeedback {
  npcId: string;
  npcName: string;
  fromTether: string;
  toTether: string;
}

const formatTether = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const TravelPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const locationValue = useAppSelector(state => state.player.location);
  const forgeFamiliar = useAppSelector(state => Boolean(state.player.routineFamiliarity?.forge_assistance));
  const npcs = useAppSelector(state => state.npcs.npcs);
  const [error, setError] = useState<string | null>(null);
  const [spatialFeedback, setSpatialFeedback] = useState<SpatialTetherFeedback[]>([]);

  const currentLocationId = resolveCanonicalLocationId(locationValue);
  const currentLocation = currentLocationId
    ? getLocationDefinition(currentLocationId)
    : undefined;
  const destinations = getConnectedLocationDefinitions(locationValue);

  const buildSpatialFeedback = (destinationId: string): SpatialTetherFeedback[] =>
    Object.keys(NPC_WORLD_LOCATION_IDS).flatMap(npcId => {
      const before = deriveSpatialRelationshipTether(npcId, locationValue);
      const after = deriveSpatialRelationshipTether(npcId, destinationId);
      if (!before || !after || before.tetherState === after.tetherState) return [];

      return [{
        npcId,
        npcName: npcs[npcId]?.name ?? npcId,
        fromTether: before.tetherState,
        toTether: after.tetherState,
      }];
    });

  const handleTravel = async (destinationId: string) => {
    setError(null);
    const pendingSpatialFeedback = buildSpatialFeedback(destinationId);
    const result = await dispatch(travelToLocationThunk(destinationId));
    if (travelToLocationThunk.rejected.match(result)) {
      setSpatialFeedback([]);
      setError(
        typeof result.payload === 'string'
          ? result.payload
          : result.error.message || 'Travel failed.'
      );
      return;
    }

    setSpatialFeedback(pendingSpatialFeedback);
  };

  const handleForgePractice = async () => {
    setError(null);
    const result = await dispatch(practiceForgeAssistanceThunk());
    if (practiceForgeAssistanceThunk.rejected.match(result)) {
      setError(
        typeof result.payload === 'string'
          ? result.payload
          : result.error.message || 'Forge practice failed.'
      );
    }
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

          {currentLocation.id === CITY_CENTER_LOCATION_ID && (
            <Box sx={{ mb: 2, p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2">City Forge</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Practice the workshop support routine yourself once to understand it before delegating it to a Copy.
              </Typography>
              <Button
                variant="contained"
                size="small"
                disabled={forgeFamiliar}
                onClick={handleForgePractice}
              >
                {forgeFamiliar ? 'Forge Assistance Learned' : 'Practice Forge Assistance (+5 Gold)'}
              </Button>
            </Box>
          )}

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

      {spatialFeedback.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }} data-testid="travel-spatial-feedback">
          <Typography variant="subtitle2" gutterBottom>
            Presence changed
          </Typography>
          {spatialFeedback.map(change => (
            <Typography key={change.npcId} variant="body2">
              {change.npcName} — Tether: {formatTether(change.fromTether)} → {formatTether(change.toTether)}
            </Typography>
          ))}
          <Typography variant="caption" color="text.secondary">
            Movement changed current presence/Tether, not Relationship history.
          </Typography>
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
