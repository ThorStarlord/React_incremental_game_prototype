import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, Grid, Tabs, Tab, Button, 
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Chip, Divider, TextField, InputAdornment
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SellIcon from '@mui/icons-material/Sell';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

/**
 * TradeTab - Handles trading interactions with NPCs
 * 
 * @param {Object} props
 * @param {Object} props.npc - The NPC data object
 * @param {Object} props.player - The player data object
 * @param {Object} props.essence - Player's essence resource
 * @param {Function} props.dispatch - Redux dispatch function
 * @param {Function} props.showNotification - Function to show notifications
 * @returns {JSX.Element} Trading interface component
 */
const TradeTab = ({ npc, player, essence, dispatch, showNotification }) => {
  const [tradeMode, setTradeMode] = useState('buy');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Mock data for NPC inventory and player inventory
  // In a real implementation, this would come from the npc and player objects
  const npcInventory = useMemo(() => (npc.inventory || [
    { id: 'potion1', name: 'Minor Health Potion', price: 10, description: 'Restores a small amount of health', type: 'consumable', icon: '🧪' },
    { id: 'scroll1', name: 'Scroll of Wisdom', price: 25, description: 'Grants a small amount of experience', type: 'consumable', icon: '📜' },
    { id: 'dagger1', name: 'Iron Dagger', price: 50, description: 'A simple iron dagger', type: 'weapon', icon: '🗡️' },
    { id: 'ring1', name: 'Copper Ring', price: 75, description: '+1 to all attributes', type: 'accessory', icon: '💍' },
  ]), [npc]);
  
  const playerInventory = useMemo(() => (player.inventory || [
    { id: 'herb1', name: 'Healing Herb', price: 5, description: 'Common herb with minor healing properties', type: 'material', icon: '🌿' },
    { id: 'ore1', name: 'Iron Ore', price: 8, description: 'Common metal ore', type: 'material', icon: '🪨' },
    { id: 'gem1', name: 'Small Gem', price: 15, description: 'A small gemstone with minimal value', type: 'valuable', icon: '💎' },
  ]), [player]);
  
  const playerGold = useMemo(() => (player.gold || 100), [player]);
  
  // Handle trade mode change (buy/sell)
  const handleModeChange = (event, newValue) => {
    setTradeMode(newValue);
    setSelectedItem(null);
    setQuantity(1);
  };
  
  // Select an item to trade
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };
  
  // Buy or sell the selected item
  const handleTrade = () => {
    if (!selectedItem) return;
    
    const totalPrice = selectedItem.price * quantity;
    
    if (tradeMode === 'buy') {
      // Check if player has enough gold
      if (playerGold < totalPrice) {
        showNotification({
          open: true,
          message: "You don't have enough gold for this purchase.",
          severity: 'error'
        });
        return;
      }
      
      // Dispatch action to add item to player inventory and subtract gold
      // This would be implemented according to your game's state management
      // dispatch({ type: 'player/addItem', payload: { item: selectedItem, quantity } });
      // dispatch({ type: 'player/subtractGold', payload: { amount: totalPrice } });
      
      showNotification({
        open: true,
        message: `Purchased ${quantity} ${selectedItem.name} for ${totalPrice} gold.`,
        severity: 'success'
      });
    } else {
      // Sell logic
      // Dispatch action to remove item from player inventory and add gold
      // dispatch({ type: 'player/removeItem', payload: { itemId: selectedItem.id, quantity } });
      // dispatch({ type: 'player/addGold', payload: { amount: totalPrice } });
      
      showNotification({
        open: true,
        message: `Sold ${quantity} ${selectedItem.name} for ${totalPrice} gold.`,
        severity: 'success'
      });
    }
    
    setSelectedItem(null);
    setQuantity(1);
  };
  
  // Calculate maximum quantity based on gold or inventory
  const maxQuantity = useMemo(() => {
    if (!selectedItem) return 1;
    
    if (tradeMode === 'buy') {
      return Math.floor(playerGold / selectedItem.price);
    } else {
      const playerItem = playerInventory.find(item => item.id === selectedItem.id);
      return playerItem ? playerItem.quantity || 1 : 0;
    }
  }, [selectedItem, tradeMode, playerGold, playerInventory]);
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <StorefrontIcon sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{npc.name}'s Shop</Typography>
            <Typography variant="body2" color="text.secondary">
              {npc.shopDescription || "Browse through the available items and trade with the merchant."}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              icon={<MonetizationOnIcon />}
              label={`Your Gold: ${playerGold}`}
              color="primary"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tradeMode} onChange={handleModeChange} aria-label="trade options">
          <Tab icon={<ShoppingCartIcon />} label="Buy" value="buy" />
          <Tab icon={<SellIcon />} label="Sell" value="sell" />
        </Tabs>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {tradeMode === 'buy' ? 'Available Items' : 'Your Items'}
            </Typography>
            
            <List>
              {(tradeMode === 'buy' ? npcInventory : playerInventory).map((item) => (
                <ListItem 
                  key={item.id} 
                  button
                  selected={selectedItem && selectedItem.id === item.id}
                  onClick={() => handleSelectItem(item)}
                  sx={{ 
                    mb: 1, 
                    border: 1, 
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper', fontSize: '1.5rem' }}>
                      {item.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={item.name}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {item.description}
                        </Typography>
                        <Box mt={1}>
                          <Chip 
                            label={`${tradeMode === 'buy' ? 'Price' : 'Value'}: ${item.price} gold`}
                            size="small"
                            variant="outlined"
                            icon={<MonetizationOnIcon fontSize="small" />}
                          />
                          {item.type && (
                            <Chip
                              label={item.type}
                              size="small"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Transaction
            </Typography>
            
            {selectedItem ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'background.paper', fontSize: '1.5rem', mr: 2 }}>
                    {selectedItem.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{selectedItem.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedItem.price} gold each
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={7}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                      inputProps={{ min: 1, max: maxQuantity }}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Button 
                      fullWidth
                      variant="outlined"
                      onClick={() => setQuantity(maxQuantity)}
                    >
                      Max ({maxQuantity})
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="body1">Unit Price:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">{selectedItem.price} gold</Typography>
                    </Grid>
                  </Grid>
                  
                  <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                    <Grid item>
                      <Typography variant="body1">Quantity:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">{quantity}</Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="subtitle1">Total:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">{selectedItem.price * quantity} gold</Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleTrade}
                  disabled={maxQuantity < 1}
                >
                  {tradeMode === 'buy' ? 'Buy Now' : 'Sell Now'}
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Select an item to {tradeMode === 'buy' ? 'purchase' : 'sell'}.
                </Typography>
                <StorefrontIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradeTab;
