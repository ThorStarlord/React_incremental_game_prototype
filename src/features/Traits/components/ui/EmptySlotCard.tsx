import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// FIXED: Removed onDrop as it's not used by the parent anymore
interface EmptySlotCardProps {}

const EmptySlotCard: React.FC<EmptySlotCardProps> = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        bgcolor: 'action.hover',
        cursor: 'default',
        minHeight: 140,
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
        transition: 'border-color 0.2s, background-color 0.2s'
      }}
    >
      <Tooltip title="Click to equip a trait">
        <Box sx={{ textAlign: 'center' }}>
          <AddIcon color="disabled" sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Empty Slot
          </Typography>
        </Box>
      </Tooltip>
    </Paper>
  );
};

export default EmptySlotCard;