import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  getConnectedLocationDefinitions,
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../LocationDefinitions';
import { travelToLocationThunk } from '../TravelThunks';

const TravelPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const locationValue = useAppSelector(state => state.player.location);
  const [error, setError] = useState<string | null>(null);

  const currentLocationId = resolveCanonicalLocationId(locationValue);
  const currentLocation = currentLocationId
    ? getLocationDefinition(currentLocationId)
    : undefined;
  const destinations = getConnectedLocationDefinitions(locationValue);

  const handleTravel = async (destinationId: string) => {
    setError(null);
    const result = await dispatch(travelToLocationThunk(destinationId));
    if (travelToLocationThunk.rejected.match(result)) {
      setError(
        typeof result.payload === 'string'
          ? result.payload
          : result.error.message || 'Travel failed.'
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

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default TravelPanel;
