import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Item } from '../../../../context/initialStates/ItemsInitialState';
import InventoryItem from '../ui/InventoryItem';

/**
 * Interface for InventorySlot component props
 */
interface InventorySlotProps {
  /** The item in this slot, if any */
  item: Item | null;
  /** Whether the slot is selected */
  isSelected?: boolean;
  /** Whether item in this slot is equipped */
  isEquipped?: boolean;
  /** Whether the slot is disabled */
  disabled?: boolean;
  /** Callback when the slot is clicked */
  onClick?: (item: Item | null) => void;
  /** Callback when an item in the slot is used */
  onUseItem?: (item: Item) => void;
  /** Callback when an item in the slot is equipped */
  onEquipItem?: (item: Item) => void;
  /** Callback when an item in the slot is dropped */
  onDropItem?: (item: Item) => void;
  /** Slot index in the inventory */
  slotIndex?: number;
  /** Custom slot styling */
  sx?: React.CSSProperties;
}

// Styled components
const SlotContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isSelected' && prop !== 'isEmpty' && prop !== 'isDisabled'
})<{
  isSelected?: boolean;
  isEmpty: boolean;
  isDisabled?: boolean;
}>(({ theme, isSelected, isEmpty, isDisabled }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '1',
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${isSelected 
    ? theme.palette.primary.main 
    : isEmpty 
      ? theme.palette.divider 
      : theme.palette.action.active}`,
  backgroundColor: isDisabled 
    ? theme.palette.action.disabledBackground 
    : theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: isDisabled ? 'default' : 'pointer',
  transition: theme.transitions.create(['border-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': {
    borderColor: isDisabled 
      ? theme.palette.divider 
      : theme.palette.primary.main,
    boxShadow: isDisabled 
      ? 'none' 
      : `0 0 0 1px ${theme.palette.primary.main}`,
    transform: isDisabled ? 'none' : 'translateY(-2px)'
  }
}));

/**
 * InventorySlot component displays a single inventory slot that can contain an item
 * 
 * @param {InventorySlotProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const InventorySlot: React.FC<InventorySlotProps> = ({
  item,
  isSelected = false,
  isEquipped = false,
  disabled = false,
  onClick,
  onUseItem,
  onEquipItem,
  onDropItem,
  slotIndex,
  sx
}): JSX.Element => {
  
  /**
   * Handle slot click
   */
  const handleClick = (): void => {
    if (disabled) return;
    
    if (onClick) {
      onClick(item);
    }
  };

  /**
   * Whether the slot is empty
   */
  const isEmpty = item === null;

  return (
    <SlotContainer 
      isSelected={isSelected}
      isEmpty={isEmpty}
      isDisabled={disabled}
      onClick={handleClick}
      sx={sx}
    >
      {item ? (
        <InventoryItem 
          item={item}
          isEquipped={isEquipped}
          onClick={onClick ? () => onClick(item) : undefined}
          onUse={onUseItem}
          onEquip={onEquipItem}
          onDrop={onDropItem}
        />
      ) : (
        <Box 
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled'
          }}
        >
          {slotIndex !== undefined ? (
            <Tooltip title="Empty slot">
              <Typography 
                variant="caption" 
                color="text.disabled"
              >
                {slotIndex + 1}
              </Typography>
            </Tooltip>
          ) : null}
        </Box>
      )}
    </SlotContainer>
  );
};

export default InventorySlot;
