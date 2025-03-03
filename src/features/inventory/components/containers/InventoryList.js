import React, { useState, useContext } from 'react';
import { 
  Box, Typography, Grid, Button, Divider, 
  Tabs, Tab, Badge, Chip, LinearProgress
} from '@mui/material';
import { GameStateContext, useGameDispatch, useGameState } from '../../../../context/GameStateContext';
import Panel from '../../../../shared/components/layout/Panel';
import InventoryItem from '../presentation/InventoryItem';
import ItemDetailsDialog from '../presentation/ItemDetailsDialog';
import InventorySlot from '../presentation/InventorySlot';
import { safeArrayLength, ensureArray } from '../../../../utils/safeArrayUtils';

const InventoryList = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  
  // Safely access game state with default values
  const { player = {}, inventory = { maxSlots: 20 }, resources = {} } = useGameState();
  const dispatch = useGameDispatch();

  // Safely access player inventory with defaults
  const playerInventory = ensureArray(player?.inventory);
  
  // Safely determine maximum inventory slots with fallback value
  const maxSlots = inventory?.maxSlots || 20;
  const usedSlots = safeArrayLength(playerInventory);
  const remainingSlots = Math.max(0, maxSlots - usedSlots);
  
  // Item categories for filtering
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'weapon', label: 'Weapons' },
    { id: 'armor', label: 'Armor' },
    { id: 'consumable', label: 'Consumables' },
    { id: 'material', label: 'Materials' },
    { id: 'quest', label: 'Quest Items' }
  ];
  
  // Handle tab change for category filtering
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Get current category for filtering
  const currentCategory = categories[currentTab]?.id || 'all';
  
  // Filter items based on selected category
  const filteredItems = currentCategory === 'all' 
    ? playerInventory 
    : playerInventory.filter(item => item?.category === currentCategory);
  
  // Handle selecting an item to view details
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };
  
  // Handle closing the details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  // Handle using an item
  const handleUseItem = (itemId) => {
    dispatch({
      type: 'USE_ITEM',
      payload: { itemId }
    });
    setDetailsOpen(false);
  };
  
  // Handle dropping/discarding an item
  const handleDropItem = (itemId, quantity = 1) => {
    if (window.confirm('Are you sure you want to discard this item?')) {
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { itemId, quantity }
      });
      setDetailsOpen(false);
    }
  };

  return (
    <Panel title="Inventory">
      {/* Inventory capacity indicator */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Inventory Capacity: {usedSlots}/{maxSlots}
          </Typography>
          <Typography variant="body2" color={remainingSlots < 5 ? "error" : "text.secondary"}>
            {remainingSlots} slots remaining
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={(usedSlots / maxSlots) * 100}
          sx={{ 
            height: 8, 
            borderRadius: 1,
            bgcolor: 'background.paper',
            '& .MuiLinearProgress-bar': {
              bgcolor: remainingSlots < 5 ? 'error.main' : 'primary.main'
            }
          }} 
        />
      </Box>
      
      {/* Category tabs */}
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category, index) => (
          <Tab 
            key={category.id}
            label={
              <Badge 
                badgeContent={
                  category.id === 'all' 
                    ? usedSlots 
                    : playerInventory.filter(item => item?.category === category.id).length
                }
                color="primary"
                showZero={false}
                max={99}
              >
                {category.label}
              </Badge>
            }
            id={`inventory-tab-${index}`}
            aria-controls={`inventory-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {/* Inventory grid */}
      {filteredItems.length > 0 ? (
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={`${item.id}-${item.quality || 'normal'}`}>
              <InventorySlot
                item={item}
                onClick={() => handleSelectItem(item)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No {currentCategory === 'all' ? 'items' : currentCategory + 's'} in your inventory
          </Typography>
        </Box>
      )}

      {/* Empty slots visualization */}
      {remainingSlots > 0 && filteredItems.length > 0 && currentCategory === 'all' && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Empty Slots
          </Typography>
          <Grid container spacing={2}>
            {Array.from({ length: remainingSlots }).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={`empty-${index}`}>
                <Box
                  sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Empty
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Item details dialog */}
      {selectedItem && (
        <ItemDetailsDialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          item={selectedItem}
          onUse={handleUseItem}
          onDrop={handleDropItem}
        />
      )}
    </Panel>
  );
};

export default InventoryList;