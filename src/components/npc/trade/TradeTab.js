import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Badge,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

/**
 * Component for trading with NPCs
 */
const TradeTab = ({
  npc,
  player,
  dispatch,
  currentRelationship = 0,
  essence = 0,
}) => {
  // State for buy/sell quantities
  const [buyQuantities, setBuyQuantities] = useState({});
  const [sellQuantities, setSellQuantities] = useState({});
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  
  // Calculate discount based on relationship
  const getDiscount = () => {
    // Example: 0-100 relationship gives 0-20% discount
    return Math.floor((currentRelationship / 100) * 20);
  };
  
  const discount = getDiscount();
  
  // Calculate actual price after discount
  const getDiscountedPrice = (originalPrice) => {
    const discountAmount = Math.floor((originalPrice * discount) / 100);
    return originalPrice - discountAmount;
  };
  
  // Check if player can afford an item
  const canAfford = (item, quantity = 1) => {
    const totalCost = getDiscountedPrice(item.price) * quantity;
    return essence >= totalCost;
  };
  
  // Check if player has item to sell
  const hasItemToSell = (itemId) => {
    return player.inventory && 
      player.inventory.some(item => item.id === itemId && item.quantity > 0);
  };
  
  // Get player's item quantity
  const getPlayerItemQuantity = (itemId) => {
    if (!player.inventory) return 0;
    const item = player.inventory.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  // Handle buy quantity change
  const handleBuyQuantityChange = (itemId, change) => {
    setBuyQuantities(prev => {
      const current = prev[itemId] || 0;
      const newQuantity = Math.max(0, current + change);
      return {
        ...prev,
        [itemId]: newQuantity
      };
    });
  };
  
  // Handle sell quantity change
  const handleSellQuantityChange = (itemId, change) => {
    setSellQuantities(prev => {
      const current = prev[itemId] || 0;
      const maxQuantity = getPlayerItemQuantity(itemId);
      const newQuantity = Math.min(maxQuantity, Math.max(0, current + change));
      return {
        ...prev,
        [itemId]: newQuantity
      };
    });
  };
  
  // Handle buy action
  const handleBuy = (item) => {
    const quantity = buyQuantities[item.id] || 0;
    if (quantity <= 0) return;
    
    const totalCost = getDiscountedPrice(item.price) * quantity;
    
    if (canAfford(item, quantity)) {
      dispatch({
        type: 'BUY_ITEM',
        payload: {
          item: {
            ...item,
            quantity
          },
          cost: totalCost
        }
      });
      
      // Reset quantity after purchase
      setBuyQuantities(prev => ({
        ...prev,
        [item.id]: 0
      }));
    }
  };
  
  // Handle sell action
  const handleSell = (item) => {
    const quantity = sellQuantities[item.id] || 0;
    if (quantity <= 0) return;
    
    const totalValue = Math.floor(item.sellPrice * quantity);
    
    dispatch({
      type: 'SELL_ITEM',
      payload: {
        itemId: item.id,
        quantity,
        value: totalValue
      }
    });
    
    // Reset quantity after sale
    setSellQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };
  
  // Get items player can sell (from inventory)
  const getSellableItems = () => {
    if (!player.inventory) return [];
    
    return player.inventory
      .filter(item => item.quantity > 0 && item.sellable !== false)
      .map(item => ({
        ...item,
        sellPrice: item.sellPrice || Math.floor(item.price * 0.5) // Default sell price is half buy price
      }));
  };
  
  const itemsForSale = npc.trades || [];
  const sellableItems = getSellableItems();
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">
          Trade with {npc.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalOfferIcon sx={{ mr: 0.5 }} />
          <Typography variant="body1">
            Your Essence: {essence}
          </Typography>
        </Box>
      </Box>
      
      {discount > 0 && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your good relationship with {npc.name} gives you a {discount}% discount on purchases!
        </Alert>
      )}
      
      {/* Buy/Sell Tab Selection */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Button 
          variant={activeTab === 'buy' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('buy')}
          startIcon={<ShoppingCartIcon />}
          sx={{ flexGrow: 1, mr: 1 }}
        >
          Buy Items
        </Button>
        <Button
          variant={activeTab === 'sell' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('sell')}
          startIcon={<SellIcon />}
          sx={{ flexGrow: 1 }}
        >
          Sell Items
        </Button>
      </Box>
      
      {/* Buy Tab */}
      {activeTab === 'buy' && (
        <Box>
          {itemsForSale.length > 0 ? (
            <List>
              {itemsForSale.map(item => {
                const quantity = buyQuantities[item.id] || 0;
                const originalPrice = item.price;
                const discountedPrice = getDiscountedPrice(originalPrice);
                const totalCost = discountedPrice * quantity;
                
                return (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              alt={item.name}
                              src={item.icon}
                              sx={{ 
                                mr: 2, 
                                bgcolor: item.rarity === 'rare' ? 'secondary.main' : 'primary.main'
                              }}
                            >
                              {item.icon ? null : item.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                              {item.rarity && (
                                <Chip 
                                  size="small"
                                  label={item.rarity.toUpperCase()} 
                                  color={item.rarity === 'rare' ? 'secondary' : 'primary'} 
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={5}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                textDecoration: discount > 0 ? 'line-through' : 'none',
                                color: discount > 0 ? 'text.secondary' : 'text.primary',
                              }}
                            >
                              Price: {originalPrice} Essence
                            </Typography>
                            
                            {discount > 0 && (
                              <Typography variant="subtitle2" color="success.main">
                                Your Price: {discountedPrice} Essence
                              </Typography>
                            )}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1.5 }}>
                              <IconButton 
                                size="small"
                                onClick={() => handleBuyQuantityChange(item.id, -1)}
                                disabled={quantity <= 0}
                              >
                                <RemoveIcon />
                              </IconButton>
                              
                              <Typography sx={{ mx: 2 }}>
                                {quantity}
                              </Typography>
                              
                              <IconButton 
                                size="small"
                                onClick={() => handleBuyQuantityChange(item.id, 1)}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                            
                            {quantity > 0 && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Total: {totalCost} Essence
                              </Typography>
                            )}
                            
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ mt: 1.5 }}
                              disabled={quantity === 0 || !canAfford(item, quantity)}
                              onClick={() => handleBuy(item)}
                            >
                              Buy
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              {npc.name} has nothing to sell at the moment.
            </Typography>
          )}
        </Box>
      )}
      
      {/* Sell Tab */}
      {activeTab === 'sell' && (
        <Box>
          {sellableItems.length > 0 ? (
            <List>
              {sellableItems.map(item => {
                const quantity = sellQuantities[item.id] || 0;
                const playerQuantity = getPlayerItemQuantity(item.id);
                const totalValue = item.sellPrice * quantity;
                
                return (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge badgeContent={playerQuantity} color="primary">
                              <Avatar 
                                alt={item.name}
                                src={item.icon}
                                sx={{ 
                                  mr: 2, 
                                  bgcolor: item.rarity === 'rare' ? 'secondary.main' : 'primary.main'
                                }}
                              >
                                {item.icon ? null : item.name.charAt(0)}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="subtitle1">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                              {item.rarity && (
                                <Chip 
                                  size="small"
                                  label={item.rarity.toUpperCase()} 
                                  color={item.rarity === 'rare' ? 'secondary' : 'primary'} 
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={5}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2">
                              Sell Price: {item.sellPrice} Essence each
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1.5 }}>
                              <IconButton 
                                size="small"
                                onClick={() => handleSellQuantityChange(item.id, -1)}
                                disabled={quantity <= 0}
                              >
                                <RemoveIcon />
                              </IconButton>
                              
                              <Typography sx={{ mx: 2 }}>
                                {quantity}
                              </Typography>
                              
                              <IconButton 
                                size="small"
                                onClick={() => handleSellQuantityChange(item.id, 1)}
                                disabled={quantity >= playerQuantity}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                            
                            {quantity > 0 && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Total: {totalValue} Essence
                              </Typography>
                            )}
                            
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ mt: 1.5 }}
                              disabled={quantity === 0}
                              onClick={() => handleSell(item)}
                            >
                              Sell
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              You don't have any items to sell.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TradeTab;