import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Divider, 
  Button, 
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

import { Item, ItemCategory, ITEM_CATEGORIES } from '../../itemsInitialState';
import useInventory from '../../hooks/useInventory';
import InventoryList from './InventoryList';
import ItemDetailsDialog from '../presentation/ItemDetailsDialog';
import { getItemById } from '../../data/items';

/**
 * Interface for ShopItem with price information
 */
interface ShopItem extends Item {
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

/**
 * Interface for Shop component props
 */
interface ShopProps {
  /** Shop name */
  shopName?: string;
  /** Shop description */
  shopDescription?: string;
  /** Shop keeper name */
  shopkeeperName?: string;
  /** Shop location */
  location?: string;
  /** Custom shop items (overrides default) */
  shopItems?: ShopItem[];
  /** Whether this shop has limited stock */
  hasLimitedStock?: boolean;
  /** Custom styling */
  sx?: React.CSSProperties;
  /** Callback when shop is exited */
  onExit?: () => void;
}

/**
 * Interface for tab panel props
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * TabPanel component for shop tabs
 */
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

/**
 * Shop component for buying and selling items
 * 
 * @param {ShopProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const Shop: React.FC<ShopProps> = ({
  shopName = "General Store",
  shopDescription = "A small shop with various goods.",
  shopkeeperName = "Shopkeeper",
  location = "Town Center",
  shopItems: providedShopItems,
  hasLimitedStock = true,
  sx,
  onExit
}): JSX.Element => {
  // Get inventory from context
  const { inventory, addItem, removeItem } = useInventory();
  
  // Local state
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemDetails, setShowItemDetails] = useState<boolean>(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    severity: 'info'
  });
  
  // Initialize shop items if not provided
  useEffect(() => {
    if (providedShopItems) {
      setShopItems(providedShopItems);
      return;
    }
    
    // Generate some default shop items
    // This would typically come from an API or database
    const defaultItems: ShopItem[] = [
      {
        ...(getItemById('health_potion_minor') || {}),
        buyPrice: 10,
        sellPrice: 5,
        stock: 10
      },
      {
        ...(getItemById('mana_potion_minor') || {}),
        buyPrice: 10,
        sellPrice: 5,
        stock: 10
      },
      {
        ...(getItemById('bread') || {}),
        buyPrice: 5,
        sellPrice: 2,
        stock: 20
      },
      {
        ...(getItemById('leather_vest') || {}),
        buyPrice: 25,
        sellPrice: 12,
        stock: 3
      },
    ] as ShopItem[];
    
    setShopItems(defaultItems.filter(item => item.id));
  }, [providedShopItems]);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };
  
  // Handle selecting an item
  const handleItemSelected = (item: Item): void => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };
  
  // Handle buying an item
  const handleBuyItem = (item: ShopItem): void => {
    // Check if player has enough gold
    if (inventory.gold < item.buyPrice) {
      setNotification({
        show: true,
        message: "Not enough gold to purchase this item",
        severity: 'error'
      });
      return;
    }
    
    // Check if shop has stock
    if (hasLimitedStock && item.stock <= 0) {
      setNotification({
        show: true,
        message: "This item is out of stock",
        severity: 'error'
      });
      return;
    }
    
    // Process the purchase
    const purchaseSuccess = addItem({
      ...item,
      quantity: 1
    });
    
    if (purchaseSuccess) {
      // Update player's gold
      inventory.gold -= item.buyPrice;
      
      // Update shop stock if limited
      if (hasLimitedStock) {
        setShopItems(prev => 
          prev.map(shopItem => 
            shopItem.id === item.id 
              ? { ...shopItem, stock: shopItem.stock - 1 }
              : shopItem
          )
        );
      }
      
      setNotification({
        show: true,
        message: `Purchased ${item.name} for ${item.buyPrice} gold`,
        severity: 'success'
      });
    } else {
      setNotification({
        show: true,
        message: "Your inventory is full",
        severity: 'error'
      });
    }
    
    setShowItemDetails(false);
  };
  
  // Handle selling an item
  const handleSellItem = (item: Item): void => {
    // Find sell price
    const shopItem = shopItems.find(si => si.id === item.id);
    const sellPrice = shopItem?.sellPrice || Math.floor((item.value || 0) / 2);
    
    // Process the sale
    removeItem(item.id);
    
    // Update player's gold
    inventory.gold += sellPrice;
    
    // Update shop stock if it's a shop item
    if (shopItem && hasLimitedStock) {
      setShopItems(prev => 
        prev.map(si => 
          si.id === item.id 
            ? { ...si, stock: si.stock + 1 }
            : si
        )
      );
    }
    
    setNotification({
      show: true,
      message: `Sold ${item.name} for ${sellPrice} gold`,
      severity: 'success'
    });
    
    setShowItemDetails(false);
  };
  
  // Render buy button for shop items
  const renderBuyButton = (item: ShopItem): JSX.Element => {
    const canBuy = inventory.gold >= item.buyPrice && (!hasLimitedStock || item.stock > 0);
    
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<ShoppingCartIcon />}
        onClick={() => handleBuyItem(item)}
        disabled={!canBuy}
        fullWidth
      >
        Buy for {item.buyPrice} gold
      </Button>
    );
  };
  
  // Render sell button for inventory items
  const renderSellButton = (item: Item): JSX.Element => {
    const shopItem = shopItems.find(si => si.id === item.id);
    const sellPrice = shopItem?.sellPrice || Math.floor((item.value || 0) / 2);
    
    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<SellIcon />}
        onClick={() => handleSellItem(item)}
        disabled={item.sellable === false}
        fullWidth
      >
        Sell for {sellPrice} gold
      </Button>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5">{shopName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {shopDescription}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Shopkeeper: {shopkeeperName} • {location}
          </Typography>
        </Box>
        <Box>
          <Chip 
            label={`${inventory.gold} Gold`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="shop tabs"
        >
          <Tab label="Buy" id="shop-tab-0" aria-controls="shop-tabpanel-0" />
          <Tab label="Sell" id="shop-tab-1" aria-controls="shop-tabpanel-1" />
        </Tabs>
      </Box>
      
      <TabPanel value={activeTab} index={0}>
        {shopItems.length > 0 ? (
          <Grid container spacing={2}>
            {shopItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2,
                    position: 'relative',
                    opacity: hasLimitedStock && item.stock <= 0 ? 0.6 : 1
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    {item.image && (
                      <Box 
                        component="img" 
                        src={item.image} 
                        sx={{ width: 40, height: 40, mr: 2 }}
                        alt={item.name}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.category} • {item.rarity}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  
                  {hasLimitedStock && (
                    <Typography 
                      variant="body2" 
                      sx={{ mb: 1 }}
                      color={item.stock > 0 ? 'text.secondary' : 'error'}
                    >
                      Stock: {item.stock} remaining
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    {renderBuyButton(item)}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No items available in this shop
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <InventoryList 
          title="Your Items" 
          onItemSelected={handleItemSelected}
          fullFeatures={false}
        />
        
        {inventory.items.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              You have no items to sell
            </Typography>
          </Box>
        )}
      </TabPanel>
      
      {onExit && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button onClick={onExit} variant="outlined">
            Exit Shop
          </Button>
        </Box>
      )}
      
      {/* Item Details Dialog */}
      {selectedItem && (
        <ItemDetailsDialog
          item={selectedItem}
          open={showItemDetails}
          onClose={() => setShowItemDetails(false)}
          onUse={undefined} // No using items in shop
          onDrop={undefined} // No dropping items in shop
          onEquip={undefined} // No equipping items in shop
        >
          {/* Custom action buttons based on active tab */}
          {activeTab === 0 ? (
            renderBuyButton(selectedItem as ShopItem)
          ) : (
            renderSellButton(selectedItem)
          )}
        </ItemDetailsDialog>
      )}
      
      {/* Notifications */}
      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, show: false })}
      >
        <Alert 
          severity={notification.severity} 
          variant="filled"
          onClose={() => setNotification({ ...notification, show: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Shop;
