import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as LocalOfferIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingDown as DiscountIcon
} from '@mui/icons-material';
import type { NPC } from '../../../state/NPCTypes';

interface NPCTradeTabProps {
  npcId: string; // Add the missing npcId prop
}

/**
 * NPCTradeTab - Handles trading interactions with NPCs
 */
const NPCTradeTab: React.FC<NPCTradeTabProps> = ({ npcId }) => {
  // Mock NPC data - in a real application, this would be fetched from the server
  const npc = {
    id: npcId,
    name: 'Eldrin',
    relationshipLevel: 5 // Mock relationship level
  };

  // Calculate discount based on relationship level (up to 20% discount)
  const discountPercentage = useMemo(() => {
    return Math.min(npc.relationshipLevel * 2, 20);
  }, [npc.relationshipLevel]);

  const calculateFinalPrice = (basePrice: number): number => {
    return Math.round(basePrice * (1 - discountPercentage / 100));
  };

  const handlePurchase = (itemId: string, price: number) => {
    // TODO: Implement purchase logic
    console.log(`Purchasing item ${itemId} for ${price} gold`);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Trade Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          Trade with {npc.name}
        </Typography>
        
        {discountPercentage > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DiscountIcon />
              <Typography variant="body2">
                Friendship Discount: {discountPercentage}% off all items!
              </Typography>
            </Box>
          </Alert>
        )}
      </Box>

      {/* Trade Items Grid */}
      <Grid container spacing={2}>
        {mockTradeItems.map((item) => {
          const finalPrice = calculateFinalPrice(item.basePrice);
          const hasDiscount = finalPrice < item.basePrice;

          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      color="secondary" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      In Stock: {item.inStock}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Price Display */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MonetizationOnIcon fontSize="small" color="primary" />
                    <Box>
                      {hasDiscount ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                          >
                            {item.basePrice}g
                          </Typography>
                          <Typography variant="body1" color="success.main" fontWeight="bold">
                            {finalPrice}g
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" fontWeight="bold">
                          {finalPrice}g
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Purchase Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={item.inStock === 0}
                    onClick={() => handlePurchase(item.id, finalPrice)}
                    sx={{ mt: 'auto' }}
                  >
                    {item.inStock === 0 ? 'Out of Stock' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Trade Information */}
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          <Typography variant="body2">
            <LocalOfferIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            Build stronger relationships to unlock better discounts and exclusive items!
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
});

NPCTradeTab.displayName = 'NPCTradeTab';

export default NPCTradeTab;
