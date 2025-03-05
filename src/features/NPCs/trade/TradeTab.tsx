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
 * Interface for a trade item in a shop
 */
interface TradeItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Description of what the item does */
  description?: string;
  /** Base price of the item in essence */
  price: number;
  /** Path to the item's icon image */
  icon?: string;
  /** Rarity classification (common, rare, etc.) */
  rarity?: string;
  /** Price when selling this item back to NPCs */
  sellPrice?: number;
  /** Whether this item can be sold */
  sellable?: boolean;
  /** Quantity of item when dealing with inventory */
  quantity?: number;
}

/**
 * Interface for a player's inventory item
 */
interface InventoryItem extends TradeItem {
  /** Quantity of the item in player's inventory */
  quantity: number;
}

/**
 * Interface for an NPC that trades
 */
interface TradingNPC {
  /** Unique identifier of the NPC */
  id?: string;
  /** Display name of the NPC */
  name: string;
  /** Items this NPC sells */
  trades?: TradeItem[];
  /** Dialogue options for different trading scenarios */
  dialogues?: Record<string, string>;
}

/**
 * Interface for a simplified player object
 */
interface Player {
  /** Player's inventory items */
  inventory?: InventoryItem[];
}

/**
 * Interface for TradeTab component props
 */
interface TradeTabProps {
  /** NPC the player is trading with */
  npc: TradingNPC;
  /** Player data */
  player: Player;
  /** Redux dispatch function */
  dispatch: (action: any) => void;
  /** Player's relationship value with this NPC (0-100) */
  currentRelationship?: number;
  /** Player's essence currency amount */
  essence?: number;
}

/**
 * Type for tracking buy quantities by item ID
 */
type QuantityRecord = Record<string, number>;

/**
 * Component for trading with NPCs
 * 
 * @param props - Component properties
 * @returns Trade interface component
 */
const TradeTab: React.FC<TradeTabProps> = ({
  npc,
  player,
  dispatch,
  currentRelationship = 0,
  essence = 0,
}) => {
  // State for buy/sell quantities
  const [buyQuantities, setBuyQuantities] = useState<QuantityRecord>({});
  const [sellQuantities, setSellQuantities] = useState<QuantityRecord>({});
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy'); // 'buy' or 'sell'
  
  /**
   * Calculate discount percentage based on relationship
   * @returns Discount percentage (0-20)
   */
  const getDiscount = (): number => {
    // Example: 0-100 relationship gives 0-20% discount
    return Math.floor((currentRelationship / 100) * 20);
  };
  
  const discount = getDiscount();
  
  /**
   * Calculate actual price after discount
   * @param originalPrice - Base price before discount
   * @returns Price after applying relationship discount
   */
  const getDiscountedPrice = (originalPrice: number): number => {
    const discountAmount = Math.floor((originalPrice * discount) / 100);
    return originalPrice - discountAmount;
  };
  
  /**
   * Check if player can afford an item
   * @param item - Item to purchase
   * @param quantity - Quantity to buy
   * @returns Whether player has enough essence
   */
  const canAfford = (item: TradeItem, quantity = 1): boolean => {
    const totalCost = getDiscountedPrice(item.price) * quantity;
    return essence >= totalCost;
  };
  
  /**
   * Check if player has item to sell
   * @param itemId - Item identifier to check
   * @returns Whether player has at least one of this item
   */
  const hasItemToSell = (itemId: string): boolean => {
    return !!player.inventory && 
      player.inventory.some(item => item.id === itemId && item.quantity > 0);
  };
  
  /**
   * Get player's item quantity
   * @param itemId - Item identifier to check
   * @returns Quantity of item in player inventory
   */
  const getPlayerItemQuantity = (itemId: string): number => {
    if (!player.inventory) return 0;
    const item = player.inventory.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  /**
   * Handle buy quantity change
   * @param itemId - Item identifier
   * @param change - Amount to change quantity by
   */
  const handleBuyQuantityChange = (itemId: string, change: number): void => {
    setBuyQuantities(prev => {
      const current = prev[itemId] || 0;
      const newQuantity = Math.max(0, current + change);
      return {
        ...prev,
        [itemId]: newQuantity
      };
    });
  };
  
  /**
   * Handle sell quantity change
   * @param itemId - Item identifier
   * @param change - Amount to change quantity by
   */
  const handleSellQuantityChange = (itemId: string, change: number): void => {
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
  
  /**
   * Handle buy action
   * @param item - Item to purchase
   */
  const handleBuy = (item: TradeItem): void => {
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
  
  /**
   * Handle sell action
   * @param item - Item to sell
   */
  const handleSell = (item: InventoryItem): void => {
    const quantity = sellQuantities[item.id] || 0;
    if (quantity <= 0) return;
    
    const totalValue = Math.floor((item.sellPrice || 0) * quantity);
    
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
  
  /**
   * Get items player can sell (from inventory)
   * @returns Array of sellable items with prices
   */
  const getSellableItems = (): InventoryItem[] => {
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
                const totalValue = (item.sellPrice || 0) * quantity;
                
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
