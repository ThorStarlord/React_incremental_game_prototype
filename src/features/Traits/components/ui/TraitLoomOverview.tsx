import React from 'react';
import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

interface TraitLoomOverviewProps {
  allTraits: Record<string, Trait>;
  traitSlots: TraitSlot[];
  permanentTraits: Trait[];
  discoveredTraits: Trait[];
}

/**
 * Read-only expression overview. Slot actions and Doctrine previews remain
 * in the existing canonical Expression and Doctrine tabs.
 */
export const TraitLoomOverview: React.FC<TraitLoomOverviewProps> = React.memo(({
  allTraits,
  traitSlots,
  permanentTraits,
  discoveredTraits,
}) => {
  const assimilated = new Set(permanentTraits.map(trait => trait.id));
  const currentlyExpressed = new Set(
    traitSlots.filter(slot => !slot.isLocked).map(slot => slot.traitId).filter((id): id is string => Boolean(id))
  );
  const suppressed = permanentTraits.filter(trait => !currentlyExpressed.has(trait.id));
  const discoveredOnly = discoveredTraits.filter(trait => !assimilated.has(trait.id));

  return (
    <Paper variant="outlined" data-testid="trait-loom-overview" sx={{ mb: 2, p: 2, borderTop: 3, borderTopColor: 'secondary.main' }}>
      <Typography variant="overline" color="secondary.main">Your learned patterns</Typography>
      <Typography variant="h6" component="h2" gutterBottom>Trait Loom</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your history determines which patterns you discover or assimilate. Only currently expressed patterns influence active play. Use Expression to change a slot, or Doctrine to preview a deliberate pair.
      </Typography>
      <Grid container spacing={1}>
        {[...traitSlots].sort((a, b) => a.slotIndex - b.slotIndex).map(slot => {
          const name = slot.traitId ? (allTraits[slot.traitId]?.name ?? slot.traitId) : null;
          return (
            <Grid item xs={12} sm={6} md={4} key={slot.id}>
              <Box role="group" aria-label={`Expression slot ${slot.slotIndex + 1}`} sx={{
                p: 1.5, minHeight: 98, height: '100%', border: 1, borderRadius: 2,
                borderColor: slot.isLocked ? 'divider' : slot.traitId ? 'secondary.main' : 'primary.light',
                bgcolor: slot.traitId && !slot.isLocked ? 'action.hover' : 'background.default',
              }}>
                <Typography variant="caption" color="text.secondary">Slot {slot.slotIndex + 1}</Typography>
                <Typography variant="subtitle2">{slot.isLocked ? 'Locked' : name ?? 'Empty unlocked slot'}</Typography>
                <Chip size="small" variant="outlined" sx={{ mt: 0.5 }}
                  label={slot.isLocked ? (slot.unlockRequirement ?? 'Not yet unlocked') : slot.traitId
                    ? assimilated.has(slot.traitId) ? 'Expressed · assimilated' : 'Expressed · temporary discovery'
                    : 'Available for expression'}
                  color={slot.isLocked ? 'default' : slot.traitId ? 'success' : 'primary'}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Assimilated library · {permanentTraits.length}</Typography>
          {suppressed.length > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Currently suppressed (still yours): {suppressed.map(trait => trait.name).join(', ')}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Learned patterns remain permanently available even when you stop expressing them.
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Discovered, not yet assimilated · {discoveredOnly.length}</Typography>
          <Typography variant="body2" color="text.secondary">
            {discoveredOnly.length ? discoveredOnly.map(trait => trait.name).join(', ') : 'No unassimilated discoveries in your current catalogue.'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
});

TraitLoomOverview.displayName = 'TraitLoomOverview';
