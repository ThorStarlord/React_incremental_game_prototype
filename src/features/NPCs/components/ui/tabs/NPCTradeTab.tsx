import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CoinIcon from '@mui/icons-material/MonetizationOn';

import type { NpcState } from '../../../state/NpcTypes';

interface NPCTradeTabProps {
  npc: NpcState;
}

interface TradeItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  inStock: number;
}

const NPCTradeTab: React.FC<NPCTradeTabProps> = ({ npc }) => {
  // Mock trade items - in real implementation, this would come from NPC data
  const tradeItems: TradeItem[] = [
    {
      id: 'healing_potion',
      name: 'Healing Potion',
      price: 50,
      category: 'Consumable',
      description: 'Restores 100 HP',
      inStock: 5
    },
    {
      id: 'mana_potion',
      name: 'Mana Potion',
      price: 75,
      category: 'Consumable',
      description: 'Restores 100 MP',
      inStock: 3
    },
    {
      id: 'iron_sword',
      name: 'Iron Sword',
      price: 200,
      category: 'Weapon',
      description: '+10 Attack Power',
      inStock: 1
    }
  ];

  const handlePurchase = (item: TradeItem) => {
    // TODO: Implement purchase logic
    console.log(`Purchasing ${item.name} for ${item.price} gold`);
  };

  const getRelationshipDiscount = (basePrice: number): number => {
    // Higher relationship = better prices
    const discountRate = Math.min(npc.relationshipValue * 0.05, 0.2); // Max 20% discount
    return Math.floor(basePrice * (1 - discountRate));
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShoppingCartIcon color="primary" />
        <Typography variant="h6">Trade with {npc.name}</Typography>
      </Box>

      {/* Relationship Bonus Info */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Relationship Bonus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your relationship level of {npc.relationshipValue.toFixed(1)} grants you a{' '}
            {Math.round(Math.min(npc.relationshipValue * 5, 20))}% discount on all items.
          </Typography>
        </CardContent>
      </Card>

      {/* Trade Items */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Items
          </Typography>
          
          <List>
            {tradeItems.map((item, index) => {
              const originalPrice = item.price;
              const discountedPrice = getRelationshipDiscount(originalPrice);
              const hasDiscount = discountedPrice < originalPrice;
              
              return (
                <ListItem
                  key={item.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={item.category} size="small" variant="outlined" />
                        <Typography variant="body2" color="text.secondary">
                          Stock: {item.inStock}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CoinIcon fontSize="small" color="warning" />
                        <Box>
                          {hasDiscount && (
                            <Typography
                              variant="body2"
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              {originalPrice}
                            </Typography>
                          )}
                          <Typography variant="subtitle1" color={hasDiscount ? 'success.main' : 'inherit'}>
                            {discountedPrice} Gold
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handlePurchase(item)}
                        disabled={item.inStock === 0}
                      >
                        {item.inStock === 0 ? 'Out of Stock' : 'Buy'}
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(NPCTradeTab);
