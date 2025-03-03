import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Chip,
  Tooltip 
} from '@mui/material';

/**
 * Renders a single inventory slot containing an item
 * 
 * @param {Object} props Component props
 * @param {Object} props.item The inventory item data object
 * @param {Function} props.onClick Function to call when the slot is clicked
 * @param {boolean} props.selected Whether this slot is currently selected
 * @returns {JSX.Element} The rendered inventory slot component
 */
const InventorySlot = ({ item, onClick, selected = false }) => {
  if (!item) return null;

  // Get appropriate color based on item rarity
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

  // Get border style based on item quality
  const getBorderStyle = () => {
    if (selected) return '2px solid';
    
    switch (item.quality) {
      case 'superior': return '1px solid #4caf50';
      case 'masterwork': return '1px solid #2196f3';
      case 'artifact': return '1px solid #9c27b0';
      default: return '1px solid';
    }
  };

  return (
    <Paper
      elevation={selected ? 3 : 1}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        border: getBorderStyle(),
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onClick && onClick(item)}
    >
      {/* Item rarity indicator */}
      {item.rarity && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '8px',
            height: '8px',
            bgcolor: getRarityColor(),
            borderRadius: '0 0 0 4px'
          }}
        />
      )}

      {/* Item name and quantity */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="subtitle2" noWrap sx={{ maxWidth: '80%' }}>
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

      {/* Item central area - icon or first letter */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1
        }}
      >
        {item.icon ? (
          <Box 
            component="img" 
            src={item.icon} 
            alt={item.name} 
            sx={{ 
              maxHeight: 40, 
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Typography 
            variant="h4" 
            color="text.secondary" 
            sx={{ opacity: 0.6 }}
          >
            {item.name?.charAt(0)}
          </Typography>
        )}
      </Box>

      {/* Item category or type */}
      <Box sx={{ mt: 'auto' }}>
        {item.category && (
          <Tooltip title={`${item.category} item`}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              {item.category}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default InventorySlot;
