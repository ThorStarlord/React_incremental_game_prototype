import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Alert,
  Divider,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as EssenceIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { Trait } from '../../state/TraitsTypes';

/**
 * Props for the TraitManagement component
 */
export interface TraitManagementProps {
  // Data
  acquiredTraits: Trait[];
  permanentTraits: Trait[];
  currentEssence: number;
  
  // Status arrays
  equippedTraitIds: string[];
  permanentTraitIds: string[];
  
  // Actions
  onAcquireTrait: (traitId: string) => void;
  onMakeTraitPermanent: (traitId: string) => void;
  
  // Utilities
  canMakePermanent: (trait: Trait) => boolean;
  getTraitAffordability: (trait: Trait, action: 'acquire' | 'permanent') => {
    canAfford: boolean;
    cost: number;
    currentEssence: number;
  };
}

/**
 * Trait management interface for acquired traits and permanence actions
 * Handles displaying acquired traits and allowing permanence conversion
 */
export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  acquiredTraits,
  permanentTraits,
  currentEssence,
  equippedTraitIds,
  permanentTraitIds,
  onAcquireTrait,
  onMakeTraitPermanent,
  canMakePermanent,
  getTraitAffordability
}) => {
  const handleMakePermanent = useCallback((trait: Trait) => {
    if (!canMakePermanent(trait)) return;
    
    const affordability = getTraitAffordability(trait, 'permanent');
    if (!affordability.canAfford) return;
    
    // TODO: Add confirmation dialog
    onMakeTraitPermanent(trait.id);
  }, [canMakePermanent, getTraitAffordability, onMakeTraitPermanent]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'error';
      case 'epic': return 'secondary';
      case 'rare': return 'primary';
      default: return 'default';
    }
  };

  const getStatusChip = (trait: Trait) => {
    if (permanentTraitIds.includes(trait.id)) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Permanent"
          color="success"
          size="small"
          variant="filled"
        />
      );
    }
    
    if (equippedTraitIds.includes(trait.id)) {
      return (
        <Chip
          icon={<StarIcon />}
          label="Equipped"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    }
    
    return (
      <Chip
        label="Available"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const renderTraitItem = (trait: Trait) => {
    const isPermanent = permanentTraitIds.includes(trait.id);
    const canMakePerm = canMakePermanent(trait);
    const affordability = trait.permanenceCost ? getTraitAffordability(trait, 'permanent') : null;

    return (
      <ListItem
        key={trait.id}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trait.name}
            </Typography>
            <Chip
              label={trait.rarity}
              color={getRarityColor(trait.rarity)}
              size="small"
            />
            {getStatusChip(trait)}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {trait.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Category: {trait.category}
              </Typography>
              {trait.source && (
                <Typography variant="caption" color="text.secondary">
                  • Source: {trait.source}
                </Typography>
              )}
            </Box>
            
            {!isPermanent && trait.permanenceCost && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {affordability && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EssenceIcon fontSize="small" />
                    <Typography
                      variant="body2"
                      color={affordability.canAfford ? 'success.main' : 'error.main'}
                    >
                      {trait.permanenceCost}
                    </Typography>
                  </Box>
                )}
                <Tooltip
                  title={
                    !canMakePerm
                      ? "Requirements not met or already permanent"
                      : !affordability?.canAfford
                      ? `Need ${trait.permanenceCost} Essence (have ${currentEssence})`
                      : "Make this trait permanently active"
                  }
                >
                  <span>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      disabled={!canMakePerm}
                      onClick={() => handleMakePermanent(trait)}
                      startIcon={<StarIcon />}
                    >
                      Make Permanent
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </ListItem>
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Acquired Traits Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Acquired Traits
                </Typography>
                <Tooltip title="Traits you have learned and can equip or make permanent">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {acquiredTraits.length === 0 ? (
                <Alert severity="info">
                  No traits acquired yet. Discover and acquire traits from NPCs or other sources.
                </Alert>
              ) : (
                <List sx={{ width: '100%' }}>
                  {acquiredTraits.map(renderTraitItem)}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Permanent Traits Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Permanent Traits
                </Typography>
                <CheckCircleIcon color="success" fontSize="small" />
              </Box>

              {permanentTraits.length === 0 ? (
                <Alert severity="info">
                  No permanent traits yet. Make acquired traits permanent with Essence.
                </Alert>
              ) : (
                <List dense>
                  {permanentTraits.map((trait) => (
                    <ListItem key={trait.id} sx={{ pl: 0 }}>
                      <ListItemText
                        primary={trait.name}
                        secondary={trait.category}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Chip
                        label={trait.rarity}
                        color={getRarityColor(trait.rarity)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Current Essence
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <EssenceIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    {currentEssence.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

TraitManagement.displayName = 'TraitManagement';

export default TraitManagement;