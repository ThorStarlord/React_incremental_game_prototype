import React, { useContext, useState } from 'react';
import { Box, Typography, Tooltip, Grid } from '@mui/material';
import { DndContext, useDraggable, useDroppable, closestCenter, DragOverlay } from '@dnd-kit/core';
import { GameStateContext, GameDispatchContext } from '../../../context/GameStateContext';
import Panel from '../../../UI/Panel';
import { itemsCatalog, ITEM_RARITIES } from '../../itemsInitialState';

// Individual inventory item component
const InventoryItem = ({ itemInstance, id, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isOverlay
  });
  
  // Get the full item data from catalog using itemId reference
  const item = itemInstance ? itemsCatalog[itemInstance.itemId] : null;
  
  // Define border color based on item rarity
  const getBorderColorFromRarity = (rarity) => {
    switch(rarity) {
      case ITEM_RARITIES.UNCOMMON: return '#1eff00'; // Green
      case ITEM_RARITIES.RARE: return '#0070dd'; // Blue
      case ITEM_RARITIES.EPIC: return '#a335ee'; // Purple
      case ITEM_RARITIES.LEGENDARY: return '#ff8000'; // Orange
      default: return 'grey.400'; // Common/default
    }
  };
  
  const itemStyles = {
    p: 1,
    border: '1px solid',
    borderColor: item ? getBorderColorFromRarity(item.rarity) : 'divider',
    borderRadius: 1,
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    width: '80px',
    cursor: 'grab',
    position: 'relative',
    opacity: isDragging ? 0.4 : 1,
    boxShadow: item?.rarity === ITEM_RARITIES.RARE ? '0 0 5px #0070dd' :
               item?.rarity === ITEM_RARITIES.EPIC ? '0 0 5px #a335ee' :
               item?.rarity === ITEM_RARITIES.LEGENDARY ? '0 0 5px #ff8000' : 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 'md',
    }
  };

  // Display durability for equipment if applicable
  const showDurability = item && 
    (item.category === 'weapon' || item.category === 'armor') && 
    itemInstance.durability !== undefined;

  const content = (
    <Box sx={itemStyles} ref={!isOverlay ? setNodeRef : undefined} {...(!isOverlay ? attributes : {})} {...(!isOverlay ? listeners : {})}>
      {item ? (
        <>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', fontSize: '0.75rem', mb: 0.5 }}>
            {item.name}
          </Typography>
          <Box 
            component="img" 
            src={`/images/items/${item.icon}.png`}
            alt={item.name} 
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            onError={(e) => {
              // Fallback image if the item image fails to load
              e.target.src = `/images/items/default_${item.category}.png`;
              // Second fallback
              e.target.onerror = () => {
                e.target.src = 'https://via.placeholder.com/40?text=Item';
                e.target.onerror = null;
              };
            }}
          />
          {itemInstance.quantity > 1 && (
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                bottom: 5, 
                right: 5, 
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {itemInstance.quantity}
            </Typography>
          )}
          
          {showDurability && (
            <Box 
              sx={{
                position: 'absolute',
                bottom: 2,
                left: 2,
                right: 2,
                height: 3,
                bgcolor: 'grey.300',
                borderRadius: 1,
              }}
            >
              <Box 
                sx={{
                  height: '100%',
                  width: `${(itemInstance.durability / item.stats.durability) * 100}%`,
                  bgcolor: (itemInstance.durability / item.stats.durability) > 0.5 ? 'success.main' : 
                           (itemInstance.durability / item.stats.durability) > 0.2 ? 'warning.main' : 'error.main',
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
        }}>
          <Typography variant="caption" color="text.secondary">Empty</Typography>
        </Box>
      )}
    </Box>
  );

  if (!item) return content;

  return (
    <Tooltip 
      title={
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: getBorderColorFromRarity(item.rarity) }}>
            {item.name}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.category}
            {item.levelReq > 1 ? ` (Requires Level ${item.levelReq})` : ''}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>{item.description}</Typography>
          
          {/* Show stats if applicable */}
          {item.stats && (
            <Box sx={{ mb: 1 }}>
              {Object.entries(item.stats).map(([stat, value], index) => (
                stat !== 'durability' && (
                  <Typography key={index} variant="caption" component="div">
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value > 0 ? `+${value}` : value}
                  </Typography>
                )
              ))}
              
              {/* Show durability for equipment */}
              {showDurability && (
                <Typography variant="caption" component="div">
                  Durability: {itemInstance.durability}/{item.stats.durability}
                </Typography>
              )}
            </Box>
          )}
          
          {/* Show value */}
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            Value: {item.value} gold
          </Typography>
          
          {/* Usage instructions for consumables */}
          {item.category === 'consumable' && (
            <Typography variant="caption" component="div" color="info.main" sx={{ mt: 0.5 }}>
              Right-click to use
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      {content}
    </Tooltip>
  );
};

// Individual slot in the inventory grid
const InventorySlot = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id
  });
  
  return (
    <Box 
      ref={setNodeRef} 
      sx={{ 
        width: '90px', 
        height: '90px', 
        m: 0.5,
        p: 0.5,
        bgcolor: isOver ? 'action.hover' : 'transparent',
        border: '1px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 1,
        transition: 'all 0.2s'
      }}
    >
      {children}
    </Box>
  );
};

const InventoryList = () => {
  // Get inventory from game state
  const { inventory } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  // For showing the dragged item
  const [activeId, setActiveId] = useState(null);
  
  // Get the active item for the overlay
  const getActiveIndex = () => activeId ? parseInt(activeId.split('-')[1]) : -1;
  const activeItem = activeId ? inventory.items[getActiveIndex()] : null;

  // Empty slots to fill the inventory grid if needed
  const totalSlots = inventory.maxSlots || 20;
  const filledItems = [...inventory.items];
  while (filledItems.length < totalSlots) {
    filledItems.push(null);
  }

  // Handle item drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!active || !over) {
      setActiveId(null);
      return;
    }
    
    const activeIndex = parseInt(active.id.split('-')[1]);
    const overIndex = parseInt(over.id.split('-')[1]);
    
    if (activeIndex !== overIndex) {
      // Dispatch action to move item in inventory
      dispatch({
        type: 'MOVE_INVENTORY_ITEM',
        payload: {
          fromIndex: activeIndex,
          toIndex: overIndex
        }
      });
    }
    
    setActiveId(null);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle right click to use item
  const handleContextMenu = (e, itemIndex) => {
    e.preventDefault();
    const itemInstance = inventory.items[itemIndex];
    
    if (!itemInstance) return;
    
    const item = itemsCatalog[itemInstance.itemId];

    if (item?.category === 'consumable') {
      // Dispatch action to use item
      dispatch({
        type: 'USE_ITEM',
        payload: {
          index: itemIndex
        }
      });
    }
  };

  return (
    <Panel title="Inventory">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2">
          Drag items to rearrange. Right-click consumables to use them.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Gold: {inventory.gold}
        </Typography>
      </Box>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Grid container spacing={0} sx={{ maxWidth: '480px' }}>
          {filledItems.map((itemInstance, index) => (
            <Grid item key={index} onContextMenu={(e) => handleContextMenu(e, index)}>
              <InventorySlot id={`slot-${index}`}>
                {itemInstance && <InventoryItem itemInstance={itemInstance} id={`item-${index}`} />}
              </InventorySlot>
            </Grid>
          ))}
        </Grid>

        {/* Overlay for the dragged item */}
        <DragOverlay>
          {activeId ? <InventoryItem itemInstance={activeItem} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>
    </Panel>
  );
};

export default InventoryList;