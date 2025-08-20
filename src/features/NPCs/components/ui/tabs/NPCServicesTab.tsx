import React, { useMemo, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Alert } from '@mui/material';
import { BuildCircle as ServiceIcon, MonetizationOn as GoldIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectNPCById } from '../../../state/NPCSelectors';
import type { NPC } from '../../../state/NPCTypes';
import { purchaseNPCServiceThunk } from '../../../state/NPCThunks';

interface NPCServicesTabProps {
  npcId: string;
}

const NPCServicesTab: React.FC<NPCServicesTabProps> = React.memo(({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector(state => selectNPCById(state, npcId));
  const playerGold = useAppSelector(state => state.player.gold);

  const discountPercentage = useMemo(() => {
    if (!npc) return 0;
    return Math.min(Math.floor((npc.affinity || 0) / 5), 20);
  }, [npc]);

  const calcPrice = useCallback((basePrice: number) => {
    return Math.round(basePrice * (1 - discountPercentage / 100));
  }, [discountPercentage]);

  const handlePurchase = useCallback((serviceId: string) => {
    if (!npc) return;
    dispatch(purchaseNPCServiceThunk({ npcId: npc.id, serviceId }));
  }, [dispatch, npc]);

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">NPC not found.</Alert>
      </Box>
    );
  }

  const services = (npc.services || []).filter(s => s.isAvailable !== false);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ServiceIcon color="primary" /> Services by {npc.name}
        </Typography>
        {discountPercentage > 0 && (
          <Alert severity="success">Relationship discount applied: {discountPercentage}%</Alert>
        )}
      </Box>

      {services.length === 0 ? (
        <Alert severity="info">No services available right now.</Alert>
      ) : (
        <Grid container spacing={2}>
          {services.map(svc => {
            const price = calcPrice(svc.currentPrice ?? svc.basePrice ?? 0);
            const lockedByAffinity = typeof svc.minAffinity === 'number' && (npc.affinity || 0) < svc.minAffinity;
            return (
              <Grid item xs={12} sm={6} md={4} key={svc.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{svc.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{svc.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip icon={<GoldIcon />} label={`${price}g`} size="small" color="primary" />
                      {lockedByAffinity && (
                        <Chip label={`Requires Affinity ${svc.minAffinity}`} size="small" color="warning" />
                      )}
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        disabled={price > playerGold || lockedByAffinity}
                        onClick={() => handlePurchase(svc.id)}
                      >
                        {lockedByAffinity ? 'Locked' : (price > playerGold ? 'Insufficient Gold' : 'Purchase')}
                      </Button>
                  </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
});

NPCServicesTab.displayName = 'NPCServicesTab';

export default NPCServicesTab;
