import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LockIcon from '@mui/icons-material/Lock';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

const TraitCard = ({ 
  trait, 
  equipped = false, 
  permanent = false, 
  acquired = false,
  draggable = false,
  onDragStart,
  onRemove,
  onAcquire
}) => {
  // If no trait provided, return empty
  if (!trait) return null;
  
  // Handler for drag start
  const handleDragStart = (e) => {
    if (!draggable) return;
    
    e.dataTransfer.setData('text/plain', trait.id);
    if (onDragStart) onDragStart();
  };
  
  return (
    <Paper
      elevation={equipped ? 3 : 1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: draggable ? 'grab' : 'default',
        borderLeft: '4px solid',
        borderColor: permanent ? 'success.main' : 
                   `${getTraitTypeColor(trait.type)}.main`,
        '&:hover': draggable ? {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        } : {},
        transition: 'transform 0.2s, box-shadow 0.2s',
        bgcolor: equipped ? 'action.selected' : 
                permanent ? 'success.50' :
                acquired ? 'background.paper' : 'action.hover',
        opacity: acquired || equipped || permanent ? 1 : 0.8
      }}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <Box sx={{ p: 1.5 }}>
        {/* Header with name and type */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {trait.name}
          </Typography>
          <Chip 
            label={trait.type || 'Basic'} 
            size="small"
            color={getTraitTypeColor(trait.type)}
          />
        </Box>
        
        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {trait.description}
        </Typography>
        
        {/* Footer with status indicators and actions */}
        <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          {/* Status indicators */}
          <Box>
            {permanent && (
              <Chip
                icon={<LockIcon />}
                label="Permanent"
                size="small"
                color="success"
              />
            )}
            
            {equipped && (
              <Chip
                label="Equipped"
                size="small"
                color="primary"
              />
            )}
            
            {!equipped && !permanent && acquired && (
              <Chip
                label="Acquired"
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
            
            {!acquired && !equipped && !permanent && trait.essenceCost && (
              <Chip
                icon={<ShoppingCartIcon />}
                label={`${trait.essenceCost} essence`}
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Box>
          
          {/* Action buttons */}
          <Box>
            {equipped && onRemove && (
              <Tooltip title="Unequip">
                <IconButton 
                  size="small" 
                  onClick={onRemove}
                  color="primary"
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {!equipped && !permanent && !acquired && onAcquire && (
              <Tooltip title="Acquire">
                <IconButton 
                  size="small" 
                  onClick={onAcquire}
                  color="secondary"
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default TraitCard;