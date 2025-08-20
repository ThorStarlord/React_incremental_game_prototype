import React, { useMemo, useCallback } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import { addItem, removeItem } from '../../../../Inventory/state/InventorySlice';
import { spendGold, gainGold } from '../../../../Player/state/PlayerSlice';
import { getItemDef, itemCatalog } from '../../../../../shared/data/itemCatalog';
import { addNotification } from '../../../../../shared/state/NotificationSlice';
import { decrementNpcShopItem, incrementNpcShopItem } from '../../../state/NPCSlice';

interface NPCTradeTabProps {
  npcId: string;
}

// Helper: build display items from NPC persistent stock or a fallback list
const buildItemsForNPC = (npc: NPC) => {
  const entries: Array<{ id: string; stock: number }> = [];
  const stock = npc.shopStock;
  if (stock) {
    for (const [id, qty] of Object.entries(stock)) {
      // only show items that exist in the catalog
      if (getItemDef(id)) entries.push({ id, stock: qty });
    }
  }
  // Fallback: demo stock for NPCs without defined shopStock
  if (entries.length === 0) {
    return [
      { id: 'potion_health', stock: 5 },
      { id: 'potion_mana', stock: 3 },
      { id: 'sword_iron', stock: 1 },
      { id: 'shield_wooden', stock: 2 },
      { id: 'herb_rare', stock: 0 },
      { id: 'gem_small', stock: 1 },
    ];
  }
  return entries;
};

/**
 * NPCTradeTab - Handles trading interactions with NPCs
 */
const NPCTradeTab: React.FC<NPCTradeTabProps> = React.memo(({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(state => selectNPCById(state, npcId));
  const playerGold = useAppSelector(state => state.player.gold);
  const inventory = useAppSelector(state => state.inventory.items);
  
  const discountPercentage = useMemo(() => {
    if (!npc) return 0;
    // Simple rule: 1% per 5 affinity, up to 20%
    return Math.min(Math.floor((npc.affinity || 0) / 5), 20);
  }, [npc]);

  const calculateFinalPrice = useCallback((basePrice: number): number => {
    return Math.round(basePrice * (1 - discountPercentage / 100));
  }, [discountPercentage]);

  const calculateSellPrice = useCallback((basePrice: number): number => {
    // Base sell is 50% of base price; affinity bonus: +1% per 10 affinity up to +10% of base price
    const base = Math.round(basePrice * 0.5);
    const bonusPct = Math.min(Math.floor((npc?.affinity || 0) / 10), 10);
    return Math.max(1, Math.round(base * (1 + bonusPct / 100)));
  }, [npc]);

  const handlePurchase = useCallback((itemId: string, price: number) => {
    if (!npc) return;
    if (price > playerGold) return;
    // Check stock
    const inStock = Math.max(0, npc.shopStock?.[itemId] ?? 0);
    if (inStock <= 0) {
      dispatch(addNotification({ type: 'warning', message: 'Out of stock.' }));
      return;
    }
    dispatch(spendGold(price));
    dispatch(addItem({ itemId, quantity: 1 }));
    dispatch(decrementNpcShopItem({ npcId, itemId, quantity: 1 }));
    const def = getItemDef(itemId);
    dispatch(addNotification({ type: 'success', message: `Purchased ${def?.name ?? itemId} for ${price}g.` }));
  }, [dispatch, npc, npcId, playerGold]);

  const handleSell = useCallback((itemId: string) => {
    if (!npc) return;
    const def = getItemDef(itemId);
    if (!def) return;
    const ownedQty = inventory[itemId] ?? 0;
    if (ownedQty <= 0) return;
    const price = calculateSellPrice(def.basePrice);
    // Pay player and move one unit to NPC stock
    dispatch(removeItem({ itemId, quantity: 1 }));
    dispatch(incrementNpcShopItem({ npcId, itemId, quantity: 1 }));
    dispatch(gainGold(price));
    dispatch(addNotification({ type: 'info', message: `Sold ${def.name} for ${price}g.` }));
  }, [dispatch, npc, npcId, inventory, calculateSellPrice]);

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">NPC not found.</Alert>
      </Box>
    );
  }
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
        {buildItemsForNPC(npc).map(({ id, stock }) => {
          const def = getItemDef(id);
          if (!def) return null;
          const finalPrice = calculateFinalPrice(def.basePrice);
          const hasDiscount = finalPrice < def.basePrice;

          return (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {def.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {def.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={def.category} 
                      size="small" 
                      color="secondary" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      In Stock: {stock}
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
            {def.basePrice}g
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
        disabled={stock === 0 || finalPrice > playerGold}
        onClick={() => handlePurchase(id, finalPrice)}
                    sx={{ mt: 'auto' }}
                  >
        {stock === 0 ? 'Out of Stock' : (finalPrice > playerGold ? 'Insufficient Gold' : 'Purchase')}
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

      {/* Sell Items Section (simple) */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sell Items
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(inventory).map(([id, qty]) => {
            const def = getItemDef(id);
            if (!def || qty <= 0) return null;
            const price = calculateSellPrice(def.basePrice);
            return (
              <Grid item xs={12} sm={6} md={4} key={`sell-${id}`}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{def.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{def.category}</Typography>
                    <Typography variant="body2" sx={{ my: 1 }}>You own: {qty}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleSell(id)}
                    >
                      Sell for {price}g
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
});

NPCTradeTab.displayName = 'NPCTradeTab';

export default NPCTradeTab;
