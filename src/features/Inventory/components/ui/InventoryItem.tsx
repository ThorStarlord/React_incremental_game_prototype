import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Tooltip,
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EquipIcon from '@mui/icons-material/CheckCircle';
import UseIcon from '@mui/icons-material/TouchApp';
import { Item, ItemRarity } from '../../../../context/initialStates/ItemsInitialState';
import { getItemRarityDisplay } from '../../utils/inventoryUtils';

/**
 * Interface for InventoryItem component props
 */
interface InventoryItemProps {
  /** The item to display */
  item: Item;
  /** Whether the item is currently equipped */
  isEquipped?: boolean;
  /** Callback when item is clicked */
  onClick?: (item: Item) => void;
  /** Callback when use button is clicked */
  onUse?: (item: Item) => void;
  /** Callback when equip button is clicked */
  onEquip?: (item: Item) => void;
  /** Callback when drop button is clicked */
  onDrop?: (item: Item) => void;
  /** Optional custom styles */
  sx?: React.CSSProperties;
}

// Styled components
const ItemCard = styled(Card)<{ rarity: ItemRarity }>(({ theme, rarity }) => {
  const rarityColor = getItemRarityDisplay({ rarity } as Item).color;
  
  return {
    position: 'relative',
    transition: 'transform 0.2s ease-in-out',
    border: `1px solid ${rarityColor}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 4px 8px rgba(${rarityColor}, 0.3)`,
    },
  };
});

/**
 * InventoryItem component displays a single item in the inventory
 * 
 * @param {InventoryItemProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  isEquipped = false,
  onClick,
  onUse,
  onEquip,
  onDrop,
  sx
}): JSX.Element => {
  const { text: rarityText, color: rarityColor } = getItemRarityDisplay(item);
  
  // Handle item click
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };
  
  return (
    <ItemCard 
      rarity={item.rarity}
      onClick={handleClick}
      sx={sx}
    >
      {isEquipped && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 0.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderBottomLeftRadius: 4,
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}
        >
          EQUIPPED
        </Box>
      )}
      
      {item.stackable && item.quantity && item.quantity > 1 && (
        <Badge
          badgeContent={item.quantity}
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          {item.image && (
            <Box 
              sx={{ 
                mr: 1, 
                width: 40, 
                height: 40, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold' }}>
              {item.name}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {item.category} • {rarityText}
            </Typography>
            
            {item.level && (
              <Chip 
                label={`Lvl ${item.level}`} 
                size="small" 
                sx={{ height: 16, fontSize: '0.6rem', mt: 0.5 }}
              />
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {item.value > 0 ? `${item.value} gold` : ''}
          </Typography>
          
          <Box>
            {item.usable && onUse && (
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onUse(item);
                }}
                title="Use item"
              >
                <UseIcon fontSize="small" />
              </IconButton>
            )}
            
            {['weapon', 'armor'].includes(item.category) && onEquip && (
              <IconButton 
                size="small"
                color={isEquipped ? 'primary' : 'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  onEquip(item);
                }}
                title={isEquipped ? "Unequip" : "Equip"}
              >
                <EquipIcon fontSize="small" />
              </IconButton>
            )}
            
            {onDrop && item.sellable !== false && (
              <IconButton 
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDrop(item);
                }}
                title="Drop item"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </ItemCard>
  );
};

export default InventoryItem;
