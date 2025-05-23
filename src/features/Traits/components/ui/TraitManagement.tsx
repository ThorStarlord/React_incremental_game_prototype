import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { acquireTrait, makeTraitPermanentThunk } from '../../state/TraitsSlice';
import { 
  selectAcquiredTraits, 
  selectPermanentTraits, 
  selectDiscoveredTraits,
  selectAllTraits 
} from '../../state/TraitsSelectors';
import { selectEssenceAmount } from '../../../Essence/state/EssenceSelectors';

interface ConfirmDialogState {
  isOpen: boolean;
  action: 'acquire' | 'permanent' | null;
  trait: any | null;
}

export const TraitManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTraits = useAppSelector(selectAllTraits);
  const acquiredTraitIds = useAppSelector(selectAcquiredTraits);
  const permanentTraitIds = useAppSelector(selectPermanentTraits);
  const discoveredTraitIds = useAppSelector(selectDiscoveredTraits);
  const currentEssence = useAppSelector(selectEssenceAmount);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    action: null,
    trait: null,
  });

  // Convert trait IDs to trait objects
  const acquiredTraits = acquiredTraitIds.map(id => allTraits[id]).filter(Boolean);
  const permanentTraits = permanentTraitIds.map(id => allTraits[id]).filter(Boolean);
  const discoveredTraits = discoveredTraitIds.map(id => allTraits[id]).filter(Boolean);

  // Get traits by status
  const discoveredNotAcquired = discoveredTraits.filter(trait => 
    !acquiredTraitIds.includes(trait.id)
  );
  
  const acquiredNotPermanent = acquiredTraits.filter(trait => 
    !permanentTraitIds.includes(trait.id)
  );

  const handleAcquireTrait = useCallback((trait: any) => {
    if (trait.essenceCost && currentEssence >= trait.essenceCost) {
      setConfirmDialog({
        isOpen: true,
        action: 'acquire',
        trait: trait,
      });
    }
  }, [currentEssence]);

  const handleMakePermanent = useCallback((trait: any) => {
    if (trait.permanenceCost && currentEssence >= trait.permanenceCost) {
      setConfirmDialog({
        isOpen: true,
        action: 'permanent',
        trait: trait,
      });
    }
  }, [currentEssence]);

  const handleConfirmAction = useCallback(() => {
    if (!confirmDialog.trait) return;

    if (confirmDialog.action === 'acquire') {
      dispatch(acquireTrait(confirmDialog.trait.id));
    } else if (confirmDialog.action === 'permanent') {
      dispatch(makeTraitPermanentThunk(confirmDialog.trait.id));
    }

    setConfirmDialog({ isOpen: false, action: null, trait: null });
  }, [dispatch, confirmDialog]);

  const handleCloseDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, action: null, trait: null });
  }, []);

  const renderTraitCard = useCallback((trait: any, actionType: 'acquire' | 'permanent') => {
    const cost = actionType === 'acquire' ? trait.essenceCost : trait.permanenceCost;
    const canAfford = cost ? currentEssence >= cost : false;
    const isPermanent = permanentTraitIds.includes(trait.id);

    return (
      <Grid item xs={12} sm={6} md={4} key={trait.id}>
        <Card
          elevation={2}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: theme => isPermanent ? `2px solid ${theme.palette.warning.main}` : 'none',
            position: 'relative',
          }}
        >
          {isPermanent && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                zIndex: 1 
              }}
            >
              <Tooltip title="Permanent Trait">
                <StarIcon color="warning" />
              </Tooltip>
            </Box>
          )}
          
          <CardContent sx={{ flexGrow: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="h6" component="h3" noWrap>
                {trait.name}
              </Typography>
            </Box>
            
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip 
                label={trait.category} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={trait.rarity} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" mb={2}>
              {trait.description}
            </Typography>
            
            {trait.effects && typeof trait.effects === 'object' && (
              <Box mb={2}>
                <Typography variant="caption" color="primary" display="block" gutterBottom>
                  Effects:
                </Typography>
                {Object.entries(trait.effects).map(([key, value]) => (
                  <Typography key={key} variant="caption" display="block">
                    {key}: {typeof value === 'number' && value > 0 ? '+' : ''}{value}
                  </Typography>
                ))}
              </Box>
            )}
            
            {cost && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="subtitle2" 
                  color={canAfford ? 'primary' : 'error'}
                >
                  Cost: {cost.toLocaleString()} Essence
                </Typography>
                {!canAfford && (
                  <Tooltip title="Insufficient Essence">
                    <InfoIcon fontSize="small" color="error" />
                  </Tooltip>
                )}
              </Box>
            )}
          </CardContent>
          
          <CardActions>
            {actionType === 'acquire' ? (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAcquireTrait(trait)}
                disabled={!canAfford || !cost}
                startIcon={cost ? undefined : <CheckCircleIcon />}
                fullWidth
              >
                {cost ? 'Acquire' : 'Free'}
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => handleMakePermanent(trait)}
                disabled={!canAfford || !cost || isPermanent}
                startIcon={isPermanent ? <StarIcon /> : <LockIcon />}
                fullWidth
              >
                {isPermanent ? 'Permanent' : 'Make Permanent'}
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  }, [currentEssence, permanentTraitIds, handleAcquireTrait, handleMakePermanent]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Trait Management
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Current Essence: {currentEssence.toLocaleString()}
      </Alert>

      {/* Available to Acquire */}
      {discoveredNotAcquired.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Available to Acquire ({discoveredNotAcquired.length})
          </Typography>
          <Grid container spacing={2}>
            {discoveredNotAcquired.map(trait => renderTraitCard(trait, 'acquire'))}
          </Grid>
        </Box>
      )}

      {discoveredNotAcquired.length > 0 && acquiredNotPermanent.length > 0 && (
        <Divider sx={{ my: 3 }} />
      )}

      {/* Available for Permanence */}
      {acquiredNotPermanent.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Make Permanent ({acquiredNotPermanent.length})
          </Typography>
          <Grid container spacing={2}>
            {acquiredNotPermanent.map(trait => renderTraitCard(trait, 'permanent'))}
          </Grid>
        </Box>
      )}

      {/* No actions available */}
      {discoveredNotAcquired.length === 0 && acquiredNotPermanent.length === 0 && (
        <Alert severity="info">
          No traits available for acquisition or permanence at this time.
          Discover more traits by interacting with NPCs and exploring the world.
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.action === 'acquire' ? 'Acquire Trait' : 'Make Trait Permanent'}
        </DialogTitle>
        <DialogContent>
          {confirmDialog.trait && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {confirmDialog.trait.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {confirmDialog.trait.description}
              </Typography>
              <Typography variant="subtitle1" color="primary" mb={1}>
                Cost: {(confirmDialog.action === 'acquire' 
                  ? confirmDialog.trait.essenceCost 
                  : confirmDialog.trait.permanenceCost
                )?.toLocaleString()} Essence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining after action: {(currentEssence - (confirmDialog.action === 'acquire' 
                  ? confirmDialog.trait.essenceCost 
                  : confirmDialog.trait.permanenceCost
                )).toLocaleString()} Essence
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={confirmDialog.action === 'permanent' ? 'warning' : 'primary'}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TraitManagement;