import React, { useContext, useState } from 'react';
import { Box, Typography, Tooltip, Grid } from '@mui/material';
import { DndContext, useDraggable, useDroppable, closestCenter, DragOverlay } from '@dnd-kit/core';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import Panel from './panel/Panel';

// Individual inventory item component
const InventoryItem = ({ item, id, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isOverlay
  });
  
  const itemStyles = {
    p: 1,
    border: '1px solid',
    borderColor: 'divider',
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
    boxShadow: item?.rarity === 'rare' ? '0 0 5px #FFD700' :
               item?.rarity === 'epic' ? '0 0 5px #9370DB' :
               item?.rarity === 'legendary' ? '0 0 5px #FF4500' : 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 'md',
    }
  };

  const content = (
    <Box sx={itemStyles} ref={!isOverlay ? setNodeRef : undefined} {...(!isOverlay ? attributes : {})} {...(!isOverlay ? listeners : {})}>
      {item ? (
        <>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', fontSize: '0.75rem', mb: 0.5 }}>
            {item.name}
          </Typography>
          <Box 
            component="img" 
            src={item.image || `/images/items/${item.type}.png`}
            alt={item.name} 
            sx={{ width: 40, height: 40, objectFit: 'contain' }}
            onError={(e) => {
              // Fallback image if the item image fails to load
              e.target.src = 'https://via.placeholder.com/40?text=Item';
            }}
          />
          {item.quantity > 1 && (
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
              {item.quantity}
            </Typography>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
          <Typography variant="body2">{item.description}</Typography>
          {item.stats && Object.entries(item.stats).map(([stat, value], index) => (
            <Typography key={index} variant="caption" component="div">
              {stat}: {value > 0 ? `+${value}` : value}
            </Typography>
          ))}
          {item.effects && Object.entries(item.effects).map(([effect, value], index) => (
            <Typography key={index} variant="caption" component="div" color="success.main">
              {effect.toUpperCase()}: +{value}
            </Typography>
          ))}
          {item.type === 'consumable' && (
            <Typography variant="caption" component="div" color="info.main">
              Right-click to use
            </Typography>
          )}
        </Box>
      }
      arrow
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
  const activeItem = activeId ? inventory[getActiveIndex()] : null;

  // Empty slots to fill the inventory grid if needed
  const totalSlots = 20; // 4x5 grid
  const filledItems = [...inventory];
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
        type: 'MOVE_ITEM',
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
    const item = inventory[itemIndex];

    if (item?.type === 'consumable') {
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
      <Typography variant="body2" sx={{ mb: 2 }}>
        Drag items to rearrange. Right-click consumables to use them.
      </Typography>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <Grid container spacing={0} sx={{ maxWidth: '480px' }}>
          {filledItems.map((item, index) => (
            <Grid item key={index} onContextMenu={(e) => item && handleContextMenu(e, index)}>
              <InventorySlot id={`slot-${index}`}>
                {item && <InventoryItem item={item} id={`item-${index}`} />}
              </InventorySlot>
            </Grid>
          ))}
        </Grid>

        {/* Overlay for the dragged item */}
        <DragOverlay>
          {activeId ? <InventoryItem item={activeItem} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>
    </Panel>
  );
};

export default InventoryList;