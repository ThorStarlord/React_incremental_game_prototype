import React, { useContext, useState } from 'react';
import { Box, Typography, Button, Grid, Card, Tooltip, Tabs, Tab, Divider } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../../../context/GameStateContext';
import { itemsCatalog, ITEM_CATEGORIES, ITEM_RARITIES } from '../../itemsInitialState';
import useTraitEffects from '../../../traits/useTraitEffects';
import Panel from '../../../UI/Panel';

// Filter items to show in shop - typically you'd get this from your game state or API
// but for demo purposes we'll define it here
const getShopInventory = () => {
  // Filter items that should appear in the shop
  // For this example, we're excluding quest items and some materials
  const shopItems = Object.values(itemsCatalog).filter(item => 
    item.category !== ITEM_CATEGORIES.QUEST && 
    item.value > 0 // Items with value can be sold
  );
  
  return shopItems;
};

const ShopItem = ({ item, discountPercent = 0, onBuy, canAfford }) => {
  // Calculate discounted price
  const originalPrice = item.value;
  const discountedPrice = Math.max(1, Math.floor(originalPrice * (1 - discountPercent)));
  
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

  return (
    <Card 
      sx={{ 
        p: 2, 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: `4px solid ${getBorderColorFromRarity(item.rarity)}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', mb: 1.5 }}>
        {/* Item Icon */}
        <Box 
          component="img" 
          src={`/images/items/${item.icon}.png`}
          alt={item.name} 
          sx={{ 
            width: 40, 
            height: 40, 
            mr: 1.5,
            objectFit: 'contain',
            border: `1px solid ${getBorderColorFromRarity(item.rarity)}`,
            borderRadius: 1,
            p: 0.5,
            bgcolor: 'background.paper'
          }}
          onError={(e) => {
            e.target.src = `/images/items/default_${item.category}.png`;
            e.target.onerror = () => {
              e.target.src = 'https://via.placeholder.com/40?text=Item';
              e.target.onerror = null;
            };
          }}
        />

        {/* Item Name and Category */}
        <Box>
          <Tooltip title={item.description}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {item.name}
            </Typography>
          </Tooltip>
          <Typography variant="caption" color="text.secondary">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            {item.levelReq > 1 ? ` (Level ${item.levelReq})` : ''}
          </Typography>
        </Box>
      </Box>
      
      {/* Item Details */}
      <Typography variant="body2" sx={{ mb: 1, flexGrow: 1 }}>
        {item.description}
      </Typography>
      
      {/* Item Stats (if present) */}
      {item.stats && (
        <Box sx={{ mb: 1.5 }}>
          {Object.entries(item.stats)
            .filter(([key]) => key !== 'durability')
            .map(([stat, value], index) => (
              <Typography 
                key={index} 
                variant="caption" 
                display="block" 
                color={value > 0 ? 'success.main' : 'error.main'}
              >
                {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value > 0 ? `+${value}` : value}
              </Typography>
            ))}
          {item.stats.durability && (
            <Typography variant="caption" display="block">
              Durability: {item.stats.durability}
            </Typography>
          )}
        </Box>
      )}
      
      {/* Price and Buy Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Box>
          {discountPercent > 0 ? (
            <>
              <Typography 
                variant="caption" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}
              >
                {originalPrice}g
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="success.main">
                {discountedPrice}g
              </Typography>
            </>
          ) : (
            <Typography variant="body1" fontWeight="bold">
              {originalPrice}g
            </Typography>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          size="small"
          color="primary"
          disabled={!canAfford}
          onClick={() => onBuy(item)}
        >
          Buy
        </Button>
      </Box>
    </Card>
  );
};

const Shop = () => {
  const { inventory, player } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const [category, setCategory] = useState("all");

  // Use the trait effects hook - assuming this exists in your project
  const { getModifiedStat, getEffectsForScenario } = useTraitEffects ? useTraitEffects() : {
    getModifiedStat: (stat, value) => value,
    getEffectsForScenario: () => ({ discount: 0 })
  };
  
  // Get shop-specific effects
  const shopEffects = getEffectsForScenario('shop');
  const discountPercent = shopEffects.discount || 0;
  
  // Get shop inventory
  const allShopItems = getShopInventory();
  
  // Filter items by selected category
  const shopItems = category === "all" 
    ? allShopItems 
    : allShopItems.filter(item => item.category === category);
  
  // Buy item function
  const handleBuyItem = (item) => {
    // Calculate discounted price
    const discountedPrice = Math.max(1, Math.floor(item.value * (1 - discountPercent)));
    
    // Check if player can afford the item
    if (inventory.gold >= discountedPrice) {
      // Purchase the item
      dispatch({
        type: 'BUY_ITEM',
        payload: {
          itemId: item.id,
          price: discountedPrice
        }
      });
    }
  };
  
  // Category tabs
  const categories = [
    { value: "all", label: "All Items" },
    { value: ITEM_CATEGORIES.WEAPON, label: "Weapons" },
    { value: ITEM_CATEGORIES.ARMOR, label: "Armor" },
    { value: ITEM_CATEGORIES.CONSUMABLE, label: "Consumables" },
    { value: ITEM_CATEGORIES.MATERIAL, label: "Materials" }
  ];
  
  return (
    <Panel title="Shop">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" component="span">
            {player?.location?.name || "Town"} Market
          </Typography>
          {discountPercent > 0 && (
            <Typography variant="body2" sx={{ color: 'success.main', ml: 1 }}>
              ({Math.round(discountPercent * 100)}% Discount Active)
            </Typography>
          )}
        </Box>
        <Typography variant="h6" color="primary">
          Your Gold: {inventory.gold}
        </Typography>
      </Box>
      
      <Tabs 
        value={category} 
        onChange={(e, newValue) => setCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {categories.map(cat => (
          <Tab key={cat.value} value={cat.value} label={cat.label} />
        ))}
      </Tabs>
      
      <Divider sx={{ mb: 2 }} />
      
      {shopItems.length === 0 ? (
        <Typography sx={{ py: 4, textAlign: 'center' }}>
          No items available in this category.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {shopItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ShopItem 
                item={item}
                discountPercent={discountPercent}
                onBuy={handleBuyItem}
                canAfford={inventory.gold >= Math.floor(item.value * (1 - discountPercent))}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Panel>
  );
};

export default Shop;