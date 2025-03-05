import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Props for the EmptySlotCard component
 */
interface EmptySlotCardProps {
  /** Function called when a trait is dropped in this slot */
  onDrop?: () => void;
}

/**
 * A component that displays an empty trait slot where traits can be dragged
 * 
 * @param props - Component props
 * @returns React component
 */
const EmptySlotCard: React.FC<EmptySlotCardProps> = ({ onDrop }) => {
  // Drag event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (onDrop) onDrop();
  };
  
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
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.selected'
        },
        transition: 'border-color 0.2s, background-color 0.2s'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Tooltip title="Drag a trait here to equip">
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
