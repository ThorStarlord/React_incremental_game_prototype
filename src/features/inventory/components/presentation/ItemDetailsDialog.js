import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  TextField,
  IconButton,
  Grid,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import HealingIcon from '@mui/icons-material/Healing';

/**
 * Dialog component for displaying detailed information about an inventory item
 * and providing actions like using or dropping the item
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when closing the dialog
 * @param {Object} props.item - The item data to display
 * @param {Function} props.onUse - Function to call when using the item
 * @param {Function} props.onDrop - Function to call when dropping the item
 * @returns {JSX.Element} The item details dialog component
 */
const ItemDetailsDialog = ({ open, onClose, item, onUse, onDrop }) => {
  const [dropQuantity, setDropQuantity] = useState(1);

  // Guard against undefined item
  if (!item) return null;

  // Get the appropriate icon based on item category
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'weapon':
        return <FitnessCenterIcon />;
      case 'armor':
        return <SecurityIcon />;
      case 'consumable':
        return <HealingIcon />;
      default:
        return <LocalMallIcon />;
    }
  };

  // Get color for rarity display
  const getRarityColor = () => {
    switch (item.rarity?.toLowerCase()) {
      case 'common': return '#9e9e9e';
      case 'uncommon': return '#4caf50';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  // Handle quantity changes for dropping items
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, Math.min(item.quantity || 1, dropQuantity + amount));
    setDropQuantity(newQuantity);
  };

  // Handle direct input for quantity
  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setDropQuantity(Math.max(1, Math.min(item.quantity || 1, value)));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="item-details-title"
    >
      <DialogTitle id="item-details-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getCategoryIcon(item.category)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {item.name}
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px'
              }}
            >
              {item.icon || (
                <Typography variant="h3" color="text.secondary">
                  {item.name?.charAt(0)}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="body1" paragraph>
              {item.description || 'No description available.'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {item.category && (
                <Chip 
                  label={item.category} 
                  size="small" 
                  icon={getCategoryIcon(item.category)} 
                  variant="outlined" 
                />
              )}
              
              {item.rarity && (
                <Chip 
                  label={item.rarity.toUpperCase()} 
                  size="small" 
                  sx={{ 
                    bgcolor: getRarityColor(),
                    color: '#fff'
                  }} 
                />
              )}
              
              {item.quantity > 1 && (
                <Chip 
                  label={`Quantity: ${item.quantity}`} 
                  size="small" 
                  variant="outlined" 
                />
              )}
              
              {item.value > 0 && (
                <Chip 
                  label={`Value: ${item.value} gold`} 
                  size="small" 
                  variant="outlined" 
                  color="primary"
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        {/* Item stats/effects section */}
        {(item.stats || item.effect) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {item.stats ? 'Stats' : 'Effects'}
            </Typography>
            
            <List dense>
              {/* Stats for equipment */}
              {item.stats && Object.entries(item.stats).map(([stat, value]) => (
                <ListItem key={stat}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value > 0 ? '+' : ''}${value}`}
                  />
                </ListItem>
              ))}
              
              {/* Effects for consumables */}
              {item.effect && Object.entries(item.effect).map(([effect, value]) => (
                <ListItem key={effect}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${effect.charAt(0).toUpperCase() + effect.slice(1)}: ${value > 0 ? '+' : ''}${value}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Requirements section - if applicable */}
        {item.requirements && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Requirements
            </Typography>
            
            <List dense>
              {Object.entries(item.requirements).map(([req, value]) => (
                <ListItem key={req}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${req.charAt(0).toUpperCase() + req.slice(1)}: ${value}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        {/* Drop item controls */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Drop item">
            <IconButton 
              color="error" 
              onClick={() => onDrop(item.id, dropQuantity)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          
          {item.quantity > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(-1)}
                disabled={dropQuantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              
              <TextField
                value={dropQuantity}
                onChange={handleQuantityInput}
                variant="outlined"
                size="small"
                type="number"
                InputProps={{ 
                  inputProps: { min: 1, max: item.quantity, style: { textAlign: 'center' } },
                  sx: { width: 60, mx: 1 }
                }}
              />
              
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(1)}
                disabled={dropQuantity >= item.quantity}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        
        {/* Action buttons */}
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Close
          </Button>
          
          {(item.category === 'consumable' || item.usable) && (
            <Button 
              onClick={() => onUse(item.id)}
              variant="contained" 
              color="primary"
              startIcon={<CheckCircleIcon />}
            >
              Use
            </Button>
          )}
          
          {item.category === 'weapon' || item.category === 'armor' || item.equippable && (
            <Button 
              variant="contained" 
              color="primary"
            >
              Equip
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsDialog;
