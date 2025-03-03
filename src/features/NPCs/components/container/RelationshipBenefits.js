import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const RelationshipBenefits = ({ relationshipTier }) => (
  <Box sx={{ mb: 2, backgroundColor: 'background.paper', p: 1, borderRadius: 1 }}>
    <Typography variant="subtitle2" color="text.secondary">
      Current Relationship Benefits:
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
      {relationshipTier.benefits.map((benefit, index) => (
        <Chip 
          key={index} 
          label={benefit} 
          size="small" 
          variant="outlined"
          sx={{ borderColor: relationshipTier.color, color: relationshipTier.color }}
        />
      ))}
    </Box>
  </Box>
);

export default RelationshipBenefits;