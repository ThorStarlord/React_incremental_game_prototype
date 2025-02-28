import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper
} from '@mui/material';

// Helper to get color based on trait type
const getTraitTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'combat':
      return 'error';
    case 'social':
      return 'secondary';
    case 'utility':
      return 'info';
    case 'knowledge':
      return 'warning';
    default:
      return 'primary';
  }
};

const CompactTraitCard = ({ trait }) => {
  if (!trait) return null;
  
  return (
    <Tooltip 
      title={
        <>
          <Typography variant="subtitle2">{trait.name}</Typography>
          <Typography variant="caption">{trait.type}</Typography>
          <Typography variant="body2">{trait.description}</Typography>
        </>
      }
    >
      <Paper
        elevation={1}
        sx={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          pl: 1.5,
          pr: 0.5,
          borderLeft: '3px solid',
          borderColor: `${getTraitTypeColor(trait.type)}.main`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        <Typography variant="body2" noWrap title={trait.name}>
          {trait.name}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

export default CompactTraitCard;