import React, { useContext } from 'react';
import { Box, Typography, Button, Grid, Card } from '@mui/material';
import { GameStateContext, GameDispatchContext } from '../context/GameStateContext';
import useTraitEffects from '../hooks/useTraitEffects';

const Shop = () => {
  const { player, items } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  // Use the trait effects hook
  const { getModifiedStat, getEffectsForScenario } = useTraitEffects();
  
  // Get shop-specific effects
  const shopEffects = getEffectsForScenario('shop');
  
  // Buy item function
  const handleBuyItem = (item) => {
    // Apply shop discount from traits
    const discountedPrice = getModifiedStat('shopPrice', item.price);
    
    // Check if player can afford the item
    if (player.gold >= discountedPrice) {
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
  
  return (
    <Box>
      <Typography variant="h5">Shop</Typography>
      
      {/* Show discount from traits if applicable */}
      {shopEffects.discount > 0 && (
        <Typography sx={{ color: 'success.main' }}>
          Merchant Discount: {Math.round(shopEffects.discount * 100)}%
        </Typography>
      )}
      
      {/* Shop items */}
      <Grid container spacing={2}>
        {items.map(item => {
          const originalPrice = item.price;
          const discountedPrice = getModifiedStat('shopPrice', originalPrice);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">{item.description}</Typography>
                
                {/* Show original and discounted price */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  {discountedPrice < originalPrice ? (
                    <>
                      <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {originalPrice} gold
                      </Typography>
                      <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        {discountedPrice} gold
                      </Typography>
                    </>
                  ) : (
                    <Typography>{originalPrice} gold</Typography>
                  )}
                </Box>
                
                <Button 
                  variant="contained" 
                  sx={{ mt: 1 }}
                  disabled={player.gold < discountedPrice}
                  onClick={() => handleBuyItem(item)}
                >
                  Buy
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Shop;