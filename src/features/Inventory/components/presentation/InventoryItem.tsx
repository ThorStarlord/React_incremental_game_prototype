import React from 'react';
import { Box, Paper } from '@mui/material';
import { Item } from '../../../../context/initialStates/itemsInitialState';
import InventoryItemUI from '../ui/InventoryItem';

/**
 * Interface for InventoryItem presentation component props
 */
interface InventoryItemProps {
  /** The item to display */
  item: Item;
  /** Whether the item is currently equipped */
  isEquipped?: boolean;
  /** Whether the item is selected */
  isSelected?: boolean;
  /** Whether the item should be rendered with enhanced visuals */
  enhanced?: boolean;
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

/**
 * InventoryItem presentation component that wraps the UI component with additional styling/behavior
 * 
 * @param {InventoryItemProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  isEquipped = false,
  isSelected = false,
  enhanced = false,
  onClick,
  onUse,
  onEquip,
  onDrop,
  sx
}): JSX.Element => {
  // Handle any presentation-specific behavior here
  
  return (
    <Box
      sx={{
        position: 'relative',
        transform: isSelected ? 'scale(1.05)' : 'none',
        transition: 'transform 0.2s ease',
        zIndex: isSelected ? 2 : 1,
        ...sx
      }}
    >
      {enhanced && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: -1,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)'
          }}
        />
      )}
      
      <InventoryItemUI
        item={item}
        isEquipped={isEquipped}
        onClick={onClick}
        onUse={onUse}
        onEquip={onEquip}
        onDrop={onDrop}
      />
    </Box>
  );
};

export default InventoryItem;
