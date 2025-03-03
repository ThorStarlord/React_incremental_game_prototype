import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Chip,
  Tooltip
} from '@mui/material';

/**
 * Renders an individual inventory item with its details
 * 
 * @param {Object} props Component props
 * @param {Object} props.item The inventory item data object
 * @param {Function} props.onClick Function to call when the item is clicked
 * @param {boolean} props.selected Whether the item is currently selected
 * @returns {JSX.Element} The rendered inventory item
 */
const InventoryItem = ({ item, onClick, selected = false }) => {
  if (!item) return null;

  // Determine item rarity color
  const getRarityColor = () => {
    switch (item.rarity) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <Paper
      elevation={selected ? 3 : 1}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => onClick && onClick(item)}
    >
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" noWrap>
          {item.name}
        </Typography>
        {item.quantity > 1 && (
          <Chip 
            label={`x${item.quantity}`}
            size="small"
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        )}
      </Box>

      <Tooltip title={item.description || ''} arrow>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1, 
            flexGrow: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.description || 'No description'}
        </Typography>
      </Tooltip>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
        {item.category && (
          <Chip 
            label={item.category}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
        
        {item.rarity && (
          <Box 
            sx={{
              height: 8,
              width: 8,
              borderRadius: '50%',
              backgroundColor: getRarityColor(),
              alignSelf: 'center'
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default InventoryItem;
