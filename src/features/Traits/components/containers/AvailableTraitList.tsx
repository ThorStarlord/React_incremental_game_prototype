import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import { selectAvailableTraitObjects } from '../../state/TraitsSelectors';
import { equipTrait } from '../../state/TraitsSlice';
import { Trait } from '../../state/TraitsTypes';

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTraits = useAppSelector(selectAvailableTraitObjects);

  const handleEquipTrait = (traitId: string) => {
    dispatch(equipTrait({ traitId }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Available Traits
      </Typography>
      <Grid container spacing={2}>
        {availableTraits.map((trait: Trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {trait.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {trait.description}
              </Typography>
              <Chip label={trait.category} size="small" sx={{ mb: 1 }} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEquipTrait(trait.id)}
              >
                Equip
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableTraitList;
