import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import type { NPC } from '../../../state/NPCTypes';
import { useAppSelector } from '../../../../../app/hooks';
import { selectTraits } from '../../../../Traits/state/TraitsSelectors';

interface NPCOverviewTabProps {
  npc: NPC;
}

const NPCOverviewTab: React.FC<NPCOverviewTabProps> = ({ npc }) => {
  const allTraits = useAppSelector(selectTraits);

  // Get traits shared by the player with this NPC
  const visibleSharedTraits = useMemo(() => {
    if (!npc.sharedTraits || !allTraits) return [];
    
    return Object.entries(npc.sharedTraits)
      .filter(([_, npcTraitInfo]) => npcTraitInfo.isVisible)
      .map(([traitId, _]) => allTraits[traitId])
      .filter(trait => trait && trait.name);
  }, [npc.sharedTraits, allTraits]);

  // Get traits available from this NPC
  const availableTraitsDisplay = useMemo(() => {
    if (!npc.availableTraits || !allTraits) return [];
    
    return npc.availableTraits
      .map(traitId => allTraits[traitId])
      .filter(trait => trait && trait.name);
  }, [npc.availableTraits, allTraits]);

  const totalSharedTraits = visibleSharedTraits.length;
  const totalAvailableTraits = availableTraitsDisplay.length;

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* NPC Basic Info */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {npc.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {npc.description || 'No description available.'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Relationship Value</Typography>
              <Typography variant="body1">{npc.relationshipValue || 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Connection Depth</Typography>
              <Typography variant="body1">{npc.connectionDepth?.toFixed(1) || '0.0'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Shared Traits */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shared Traits ({totalSharedTraits})
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Traits you have shared with this NPC
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {visibleSharedTraits.length > 0 ? (
              visibleSharedTraits.map((trait) => (
                <Chip
                  key={trait.id}
                  label={trait.name || trait.id}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No shared traits yet
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Available Traits */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available Traits ({totalAvailableTraits})
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Traits available from this NPC
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availableTraitsDisplay.length > 0 ? (
              availableTraitsDisplay.map((trait) => (
                <Chip
                  key={trait.id}
                  label={trait.name || trait.id}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No traits available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(NPCOverviewTab);
