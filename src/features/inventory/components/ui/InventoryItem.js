import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Chip, Tooltip, IconButton } from '@mui/material';
import { itemsCatalog, ITEM_RARITIES, ITEM_CATEGORIES } from '../../itemsInitialState';

// Icons
import EquipIcon from '@mui/icons-material/Check';
import SellIcon from '@mui/icons-material/Sell';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';

/**
 * Reusable item display component with multiple display modes
 * @component
 */
const InventoryItem = ({ 
  itemInstance,
  mode = 'default',
  onUse = null,
  onEquip = null,
  onSell = null,
  onDrop = null,
  disableActions = false,
  showValue = true,
  size = 'medium'
}) => {
  // Get full item data from itemsCatalog using itemId reference
  const item = itemsCatalog[itemInstance.itemId];
  if (!item) return null;
  
  // Get color based on item rarity
  const getRarityColor = (rarity) => {
    switch(rarity) {
      case ITEM_RARITIES.UNCOMMON: return '#1eff00'; // Green
      case ITEM_RARITIES.RARE: return '#0070dd'; // Blue
      case ITEM_RARITIES.EPIC: return '#a335ee'; // Purple
      case ITEM_RARITIES.LEGENDARY: return '#ff8000'; // Orange
      default: return 'rgba(255,255,255,0.7)'; // Common/default
    }
  };
  
  // Get size settings based on size prop
  const sizeSettings = {
    small: {
      container: { p: 1 },
      image: { width: 32, height: 32 },
      titleVariant: 'caption',
      descriptionVariant: 'caption',
      buttonSize: 'small'
    },
    medium: {
      container: { p: 1.5 },
      image: { width: 48, height: 48 },
      titleVariant: 'subtitle2',
      descriptionVariant: 'body2',
      buttonSize: 'medium'
    },
    large: {
      container: { p: 2 },
      image: { width: 64, height: 64 },
      titleVariant: 'subtitle1',
      descriptionVariant: 'body1',
      buttonSize: 'large'
    }
  }[size];
  
  // Determine if item can be used
  const canUse = item.category === ITEM_CATEGORIES.CONSUMABLE && typeof onUse === 'function';
  
  // Determine if item can be equipped
  const canEquip = (item.category === ITEM_CATEGORIES.WEAPON || 
                   item.category === ITEM_CATEGORIES.ARMOR) && 
                   typeof onEquip === 'function';
  
  // Display durability for equipment if applicable
  const showDurability = (item.category === ITEM_CATEGORIES.WEAPON || 
                          item.category === ITEM_CATEGORIES.ARMOR) && 
                          itemInstance.durability !== undefined && 
                          mode !== 'compact';

  // Basic item icon with tooltip for all modes
  const itemIcon = (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle1" sx={{ color: getRarityColor(item.rarity) }}>
            {item.name}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.category}
            {item.levelReq > 1 ? ` (Requires Level ${item.levelReq})` : ''}
          </Typography>
          <Typography variant="body2">{item.description}</Typography>
          
          {item.stats && Object.entries(item.stats)
            .filter(([key]) => key !== 'durability')
            .map(([stat, value], index) => (
              <Typography key={index} variant="caption" component="div">
                {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value > 0 ? `+${value}` : value}
              </Typography>
            ))}
          
          {showDurability && (
            <Typography variant="caption" component="div">
              Durability: {itemInstance.durability}/{item.stats.durability}
            </Typography>
          )}
          
          {showValue && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Value: {item.value} gold
            </Typography>
          )}
        </Box>
      }
      arrow
    >
      <Box sx={{ position: 'relative' }}>
        <Box 
          component="img" 
          src={`/images/items/${item.icon}.png`}
          alt={item.name} 
          sx={{
            ...sizeSettings.image,
            objectFit: 'contain',
            border: `1px solid ${getRarityColor(item.rarity)}`,
            borderRadius: 1,
            p: 0.5,
            bgcolor: 'background.paper'
          }}
          onError={(e) => {
            e.target.src = `/images/items/default_${item.category}.png`;
            e.target.onerror = () => {
              e.target.src = 'https://via.placeholder.com/40?text=Item';
              e.target.onerror = null;
            };
          }}
        />
        
        {/* Stack count badge */}
        {itemInstance.quantity > 1 && (
          <Chip 
            label={itemInstance.quantity}
            size="small"
            sx={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              height: 16,
              fontSize: '0.6rem',
              p: 0,
              minWidth: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '& .MuiChip-label': {
                px: 0.5
              }
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
  
  // Compact mode - just icon with tooltip
  if (mode === 'compact') {
    return itemIcon;
  }
  
  // Icon only mode - icon with tooltip and maybe quantity
  if (mode === 'icon-only') {
    return (
      <Box sx={{ position: 'relative' }}>
        {itemIcon}
        {itemInstance.quantity > 1 && (
          <Typography 
            variant="caption" 
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: '50%',
              width: 16,
              height: 16,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.6rem'
            }}
          >
            {itemInstance.quantity}
          </Typography>
        )}
      </Box>
    );
  }
  
  // Default full display mode
  return (
    <Box sx={{
      display: 'flex',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden',
      bgcolor: 'background.paper',
      boxShadow: 1,
      width: '100%',
      position: 'relative',
      ...sizeSettings.container
    }}>
      {/* Rarity indicator bar */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 4,
          bgcolor: getRarityColor(item.rarity)
        }}
      />

      {/* Item icon */}
      <Box sx={{ pl: 1 }}>{itemIcon}</Box>

      {/* Item details */}
      <Box sx={{ ml: 1.5, flexGrow: 1, overflow: 'hidden' }}>
        <Typography 
          variant={sizeSettings.titleVariant} 
          noWrap 
          sx={{ fontWeight: 'bold' }}
        >
          {item.name}
        </Typography>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          component="div"
        >
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          {item.levelReq > 1 ? ` (Level ${item.levelReq})` : ''}
        </Typography>
        
        {mode === 'detailed' && (
          <Typography 
            variant={sizeSettings.descriptionVariant}
            sx={{ 
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              mt: 0.5
            }}
          >
            {item.description}
          </Typography>
        )}
        
        {/* Durability bar for equipment */}
        {showDurability && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              Durability:
            </Typography>
            <Box sx={{ flexGrow: 1, maxWidth: 100 }}>
              <Box 
                sx={{
                  height: 4,
                  bgcolor: 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{
                    height: '100%',
                    width: `${(itemInstance.durability / item.stats.durability) * 100}%`,
                    bgcolor: (itemInstance.durability / item.stats.durability) > 0.5 ? 'success.main' : 
                            (itemInstance.durability / item.stats.durability) > 0.2 ? 'warning.main' : 'error.main',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Item value */}
      {showValue && mode !== 'no-value' && (
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 'auto',
            mb: 0,
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <SellIcon fontSize="inherit" sx={{ mr: 0.5 }} />
          {item.value}g
        </Typography>
      )}

      {/* Action buttons */}
      {!disableActions && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          ml: 1 
        }}>
          {canEquip && (
            <IconButton 
              size="small" 
              onClick={() => onEquip(itemInstance.itemId, item)}
              color="primary"
            >
              <EquipIcon fontSize="small" />
            </IconButton>
          )}
          
          {canUse && (
            <IconButton 
              size="small" 
              onClick={() => onUse(itemInstance.itemId, item)}
              color="secondary"
            >
              <LocalDrinkIcon fontSize="small" />
            </IconButton>
          )}
          
          {typeof onSell === 'function' && (
            <IconButton 
              size="small" 
              onClick={() => onSell(itemInstance.itemId, item)}
              color="success"
            >
              <SellIcon fontSize="small" />
            </IconButton>
          )}
          
          {typeof onDrop === 'function' && (
            <IconButton 
              size="small" 
              onClick={() => onDrop(itemInstance.itemId, item)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

InventoryItem.propTypes = {
  /**
   * Item instance object containing itemId, quantity and possibly durability
   */
  itemInstance: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number,
    durability: PropTypes.number,
    customStats: PropTypes.object
  }).isRequired,
  
  /**
   * Display mode for the item
   * - default: Standard display with details
   * - compact: Just the icon with tooltip
   * - detailed: More details shown
   * - icon-only: Only the item icon
   * - no-value: Don't show the value
   */
  mode: PropTypes.oneOf(['default', 'compact', 'detailed', 'icon-only', 'no-value']),
  
  /**
   * Callback function when using an item
   */
  onUse: PropTypes.func,
  
  /**
   * Callback function when equipping an item
   */
  onEquip: PropTypes.func,
  
  /**
   * Callback function when selling an item
   */
  onSell: PropTypes.func,
  
  /**
   * Callback function when dropping an item
   */
  onDrop: PropTypes.func,
  
  /**
   * Whether to disable action buttons
   */
  disableActions: PropTypes.bool,
  
  /**
   * Whether to show item value
   */
  showValue: PropTypes.bool,
  
  /**
   * Size of the item display
   */
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default InventoryItem;