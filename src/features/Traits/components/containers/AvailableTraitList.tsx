import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, Typography, Button, Grid, Paper, Chip, Alert, CircularProgress } from '@mui/material';
import { selectAvailableTraitObjectsForEquip, selectAvailableTraitSlotCount } from '../../state/TraitsSelectors';
import { equipTrait } from '../../state/TraitsSlice';
import TraitCard from '../ui/TraitCard';

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTraits = useAppSelector(selectAvailableTraitObjectsForEquip);
  const availableSlotCount = useAppSelector(selectAvailableTraitSlotCount);

  useEffect(() => {
    dispatch(fetchTraitsThunk());
  }, [dispatch]);

  const handleEquip = (traitId: string) => {
    dispatch(equipTrait({ traitId }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Available Traits
      </Typography>
      <Grid container spacing={2}>
        {availableTraits.map((trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            <TraitCard
              trait={trait}
              canEquip={availableSlotCount > 0}
              showEquipButton={true}
              onEquip={() => handleEquip(trait.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableTraitList;
