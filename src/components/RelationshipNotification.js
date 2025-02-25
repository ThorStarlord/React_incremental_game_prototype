import React, { useContext, useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GameStateContext } from '../context/GameStateContext';
import { RELATIONSHIP_TIERS } from '../config/gameConstants';

const RelationshipNotification = () => {
  const { npcs } = useContext(GameStateContext);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const changedNpc = npcs.find(npc => npc.relationshipChanged);
    if (changedNpc) {
      const tier = Object.values(RELATIONSHIP_TIERS).find(t => t.name === changedNpc.newTier);
      if (tier) {
        setNotification({
          npc: changedNpc,
          tier
        });
      }
    }
  }, [npcs]);

  const handleClose = () => {
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        severity="success" 
        onClose={handleClose}
        icon={<FavoriteIcon sx={{ color: notification.tier.color }} />}
        sx={{ 
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2">
            Relationship with {notification.npc.name} has changed!
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: notification.tier.color,
              fontWeight: 'bold'
            }}
          >
            Now: {notification.tier.name}
          </Typography>
          {notification.tier.essenceRate > 0 && (
            <Typography variant="caption" sx={{ color: 'success.main', mt: 0.5 }}>
              +{notification.tier.essenceRate} essence/minute
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default RelationshipNotification;