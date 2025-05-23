/**
 * @file NPCTradeTab.tsx
 * @description Trading interface with NPCs including inventory browsing and transaction handling
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  Inventory2,
  LocalOffer,
  Info,
  Add,
  Remove,
  AttachMoney,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById } from '../../state/NPCSelectors';
import { tradeWithNPC } from '../../state/NPCSlice';
import { NPC, NPCInventoryItem } from '../../state/NPCTypes';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

interface NPCTradeTabProps {
  npcId: string;
}

interface TradeItem extends NPCInventoryItem {
  selectedQuantity: number;
  finalPrice: number;
}

export const NPCTradeTab: React.FC<NPCTradeTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(selectNPCById(npcId)) as NPC;
  const [selectedItems, setSelectedItems] = useState<Record<string, TradeItem>>({});
  const [showTradeDialog, setShowTradeDialog] = useState(false);

  // Calculate relationship discount
  const relationshipDiscount = useMemo(() => {
    const tier = RELATIONSHIP_TIERS.find(t => 
      npc.relationshipValue >= t.minValue && npc.relationshipValue <= t.maxValue
    );
    
    // Base discount increases with relationship tier
    const baseDiscount = Math.max(0, (npc.relationshipValue - 20) * 0.5); // 0.5% per point above 20
    return Math.min(baseDiscount, 25); // Cap at 25% discount
  }, [npc.relationshipValue]);

  // Calculate final price with discount
  const calculateFinalPrice = (basePrice: number, itemDiscount: number = 0): number => {
    const totalDiscount = Math.max(relationshipDiscount, itemDiscount);
    return Math.round(basePrice * (1 - totalDiscount / 100));
  };

  // Handle quantity changes
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedItems };
      delete newSelected[itemId];
      setSelectedItems(newSelected);
      return;
    }

    const inventoryItem = npc.inventory?.items.find(item => item.id === itemId);
    if (!inventoryItem) return;

    const clampedQuantity = Math.min(quantity, inventoryItem.quantity);
    const finalPrice = calculateFinalPrice(
      inventoryItem.price,
      inventoryItem.relationshipDiscount
    );

    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...inventoryItem,
        selectedQuantity: clampedQuantity,
        finalPrice: finalPrice * clampedQuantity,
      }
    }));
  };

  // Calculate total trade value
  const totalTradeValue = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, item) => sum + item.finalPrice, 0);
  }, [selectedItems]);

  // Handle trade execution
  const handleTrade = async () => {
    const tradeItems = Object.values(selectedItems).map(item => ({
      itemId: item.id,
      quantity: item.selectedQuantity,
      price: item.finalPrice,
    }));

    await dispatch(tradeWithNPC({
      npcId,
      items: tradeItems,
    }));

    setSelectedItems({});
    setShowTradeDialog(false);
  };

  // Get player currency (mock for now)
  const playerCurrency = 1000; // This should come from player state

  if (!npc.inventory) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Inventory2 sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {npc.name} doesn't offer any items for trade
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Check back later or try building your relationship
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Trade Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Trading with {npc.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<LocalOffer />}
            label={`${relationshipDiscount.toFixed(1)}% Relationship Discount`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<AttachMoney />}
            label={`Your Currency: ${playerCurrency}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Inventory Grid */}
      <Grid container spacing={2}>
        {npc.inventory.items.map((item) => {
          const finalPrice = calculateFinalPrice(
            item.price,
            item.relationshipDiscount
          );
          const selectedItem = selectedItems[item.id];
          const isSelected = !!selectedItem;

          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  border: isSelected ? 2 : 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Item #{item.id}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Available: {item.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.price !== finalPrice && (
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                        >
                          ${item.price}
                        </Typography>
                      )}
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        ${finalPrice}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quantity Selection */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateItemQuantity(item.id, (selectedItem?.selectedQuantity || 0) - 1)}
                      disabled={!isSelected}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      size="small"
                      type="number"
                      value={selectedItem?.selectedQuantity || 0}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0, max: item.quantity }}
                      sx={{ width: 80 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => updateItemQuantity(item.id, (selectedItem?.selectedQuantity || 0) + 1)}
                      disabled={selectedItem?.selectedQuantity >= item.quantity}
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  {isSelected && (
                    <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
                      Total: ${selectedItem.finalPrice}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Trade Summary */}
      {Object.keys(selectedItems).length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Trade Summary
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(selectedItems).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>Item #{item.id}</TableCell>
                    <TableCell align="right">{item.selectedQuantity}</TableCell>
                    <TableCell align="right">${item.finalPrice / item.selectedQuantity}</TableCell>
                    <TableCell align="right">${item.finalPrice}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${totalTradeValue}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => setSelectedItems({})}
            >
              Clear Selection
            </Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => setShowTradeDialog(true)}
              disabled={totalTradeValue > playerCurrency}
            >
              Complete Trade (${totalTradeValue})
            </Button>
          </Box>

          {totalTradeValue > playerCurrency && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Insufficient currency. You need ${totalTradeValue - playerCurrency} more.
            </Alert>
          )}
        </Box>
      )}

      {/* Trade Confirmation Dialog */}
      <Dialog open={showTradeDialog} onClose={() => setShowTradeDialog(false)}>
        <DialogTitle>Confirm Trade</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to complete this trade with {npc.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total cost: ${totalTradeValue}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remaining currency: ${playerCurrency - totalTradeValue}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTradeDialog(false)}>Cancel</Button>
          <Button onClick={handleTrade} variant="contained">
            Confirm Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NPCTradeTab;
