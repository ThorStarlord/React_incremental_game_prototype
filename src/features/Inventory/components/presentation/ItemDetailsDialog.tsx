import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  Chip,
  Grid
} from '@mui/material';
import { Item, ItemStats } from '../../../../context/initialStates/ItemsInitialState';
import { getItemRarityDisplay } from '../../utils/inventoryUtils';

/**
 * Interface for ItemDetailsDialog component props
 */
interface ItemDetailsDialogProps {
  /** The item to display details for */
  item: Item | null;
  /** Whether the dialog is open */
  open: boolean;
  /** Whether the item is currently equipped */
  isEquipped?: boolean;
  /** Callback when the dialog is closed */
  onClose: () => void;
  /** Callback when the use button is clicked */
  onUse?: (item: Item) => void;
  /** Callback when the equip button is clicked */
  onEquip?: (item: Item) => void;
  /** Callback when the drop button is clicked */
  onDrop?: (item: Item) => void;
}

/**
 * ItemDetailsDialog component displays detailed information about an item
 * 
 * @param {ItemDetailsDialogProps} props Component props
 * @returns {React.ReactElement} Rendered component
 */
const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({ 
  item, 
  open, 
  isEquipped = false,
  onClose,
  onUse,
  onEquip,
  onDrop
}): React.ReactElement => {
  
  // If no item is provided, don't render the dialog content
  if (!item) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          <Typography>No item selected</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  // Get rarity display information
  const { text: rarityText, color: rarityColor } = getItemRarityDisplay(item);
  
  /**
   * Renders the item stats as a grid
   */
  const renderStats = (stats?: ItemStats) => {
    if (!stats) return null;
    
    const statEntries = Object.entries(stats).filter(([_, value]) => value !== undefined && value !== 0);
    
    if (statEntries.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Stats:</Typography>
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          {statEntries.map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ textTransform: 'capitalize' }}>{key}:</span>
                <span style={{ 
                  color: value !== undefined && value > 0 ? 'green' : 'red', 
                  fontWeight: 'bold' 
                }}>
                  {value !== undefined && value > 0 ? `+${value}` : value}
                </span>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  /**
   * Renders the item effects
   */
  const renderEffects = (effects?: Array<{ type: string; potency: number; duration?: number }>) => {
    if (!effects || effects.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Effects:</Typography>
        <Box sx={{ mt: 0.5 }}>
          {effects.map((effect, index) => (
            <Typography key={index} variant="body2">
              {effect.type}: {effect.potency} 
              {effect.duration ? ` for ${effect.duration}s` : ''}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };
    
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        borderBottom: `2px solid ${rarityColor}`,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box>
          {item.name}
          <Chip
            label={rarityText}
            size="small"
            sx={{ 
              ml: 1,
              backgroundColor: rarityColor,
              color: '#000',
              fontWeight: 'bold'
            }}
          />
        </Box>
        {item.level && (
          <Chip
            label={`Level ${item.level}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', my: 2 }}>
          {item.image && (
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${rarityColor}`,
                borderRadius: 1,
                mr: 2
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </Box>
          )}
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{item.description}</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {item.weight ? `Weight: ${item.weight}` : ''}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider />
        
        {renderStats(item.stats)}
        {renderEffects(item.effects)}
        
        {item.stackable && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Stackable (Max: {item.maxStack || 'Unlimited'})
              {item.quantity && item.quantity > 1 ? ` - Current: ${item.quantity}` : ''}
            </Typography>
          </Box>
        )}
        
        {isEquipped && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label="Currently Equipped" 
              color="success" 
              size="small"
            />
          </Box>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {item.sellable === false 
              ? "Cannot be sold" 
              : `Value: ${item.value} gold`}
          </Typography>
          
          {item.questItem && (
            <Chip 
              label="Quest Item" 
              color="warning" 
              size="small"
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 1 }}>
        {item.usable && onUse && (
          <Button 
            variant="contained"
            color="info"
            onClick={() => onUse(item)}
          >
            Use
          </Button>
        )}
        
        {['weapon', 'armor'].includes(item.category) && onEquip && (
          <Button 
            variant="contained"
            color={isEquipped ? "error" : "success"}
            onClick={() => onEquip(item)}
          >
            {isEquipped ? "Unequip" : "Equip"}
          </Button>
        )}
        
        {onDrop && item.sellable !== false && !item.questItem && (
          <Button 
            variant="outlined"
            color="error"
            onClick={() => onDrop(item)}
          >
            Drop
          </Button>
        )}
        
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsDialog;
