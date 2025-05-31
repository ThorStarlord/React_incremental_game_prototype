import React, { useCallback } from 'react';
import { Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectPlayerAttributes, selectAvailableAttributePoints } from '../../state/PlayerSelectors';
import { allocateAttributePoint } from '../../state/PlayerSlice';
import { recalculateStatsThunk } from '../../state/PlayerThunks';

/**
 * PlayerAttributeAllocationProps interface
 */
interface PlayerAttributeAllocationProps {
  // No specific props needed for now, as it will connect directly to Redux
}

/**
 * PlayerAttributeAllocation component
 * Allows players to allocate available attribute points to their core attributes.
 */
export const PlayerAttributeAllocation: React.FC<PlayerAttributeAllocationProps> = React.memo(() => {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector(selectPlayerAttributes);
  const availablePoints = useAppSelector(selectAvailableAttributePoints);

  const handleAllocatePoint = useCallback((attributeName: keyof typeof attributes) => {
    if (availablePoints > 0) {
      dispatch(allocateAttributePoint({ attributeName, points: 1 }));
      dispatch(recalculateStatsThunk()); // Recalculate stats after allocation
    }
  }, [dispatch, availablePoints]);

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Attribute Allocation
        </Typography>
        <Chip
          label={`Points: ${availablePoints}`}
          color={availablePoints > 0 ? 'primary' : 'default'}
          size="small"
        />
      </Box>
      <Grid container spacing={2}>
        {Object.entries(attributes).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {key}: <strong>{value}</strong>
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAllocatePoint(key as keyof typeof attributes)}
                disabled={availablePoints <= 0}
              >
                Add 1
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      {availablePoints === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          No attribute points available. Earn more through progression.
        </Typography>
      )}
    </Paper>
  );
});

PlayerAttributeAllocation.displayName = 'PlayerAttributeAllocation';

export default PlayerAttributeAllocation;
