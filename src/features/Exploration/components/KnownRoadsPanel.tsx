import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { getConnectedLocationDefinitions, getMissingLocationExperienceIds, getLocationDefinition, resolveCanonicalLocationId } from '../LocationDefinitions';

interface KnownRoadsPanelProps {
  locationValue: string;
  recordedExperienceIds: ReadonlySet<string>;
}

/**
 * Informational local atlas. Shows exactly the adjacent authored roads and
 * their existing access requirements; TravelPanel remains the action owner.
 */
export const KnownRoadsPanel: React.FC<KnownRoadsPanelProps> = React.memo(({
  locationValue,
  recordedExperienceIds,
}) => {
  const locationId = resolveCanonicalLocationId(locationValue);
  const locationName = locationId ? getLocationDefinition(locationId)?.name : undefined;
  const neighbors = getConnectedLocationDefinitions(locationValue);
  if (!locationId || neighbors.length === 0) return null;

  return (
    <Box component="details" data-testid="known-roads-atlas" sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
      <Typography component="summary" variant="subtitle2" sx={{ cursor: 'pointer' }}>
        Known adjacent roads · {locationName}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ my: 1 }}>
        These are the recorded one-stop travel links, not a map of NPCs or a fast-travel shortcut.
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {neighbors.map(neighbor => {
          const locked = getMissingLocationExperienceIds(neighbor.id, recordedExperienceIds).length > 0;
          return (
            <Chip key={neighbor.id} size="small" variant="outlined"
              label={`${neighbor.name} · ${locked ? 'Not yet accessible' : 'Available road'}`}
              color={locked ? 'default' : 'primary'}
            />
          );
        })}
      </Stack>
    </Box>
  );
});

KnownRoadsPanel.displayName = 'KnownRoadsPanel';
