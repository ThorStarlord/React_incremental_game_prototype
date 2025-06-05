import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  // Button, // Button for Make Permanent removed
  Chip,
  Alert,
  Divider,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as EssenceIcon, // Added back for current essence display
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
  onMakeTraitPermanent: (traitId: string) => void; // Deprecated
  
  // Utilities
  canMakePermanent: (trait: Trait) => boolean; // Deprecated
  getTraitAffordability: (trait: Trait) => { 
    canAfford: boolean;
    cost: number;
    currentEssence: number;
    message?: string;
  };
  isInProximityToNPC: boolean;
}

/**
 * Trait management interface for acquired traits.
 * "Make Permanent" functionality is now deprecated as Resonance handles it.
 */
export const TraitManagement: React.FC<TraitManagementProps> = React.memo(({
  acquiredTraits,
  permanentTraits, 
  currentEssence, // Destructure currentEssence
  equippedTraitIds,
  permanentTraitIds: playerPermanentTraitIds, 
  // onAcquireTrait, // Not used for "Make Permanent"
  // onMakeTraitPermanent, // Deprecated
  // canMakePermanent, // Deprecated
  // getTraitAffordability, // Not used for 'permanent' action
  // isInProximityToNPC // Not used for "Make Permanent" warning anymore
}) => {

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'error';
      case 'epic': return 'secondary';
      case 'rare': return 'primary';
      default: return 'default';
    }
  };

  const getStatusChip = (trait: Trait) => {
    if (playerPermanentTraitIds.includes(trait.id)) {
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
        label="Acquired"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const renderTraitItem = (trait: Trait) => {
    const isPermanentByPlayer = playerPermanentTraitIds.includes(trait.id);

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
              {trait.sourceNpc && (
                <Typography variant="caption" color="text.secondary">
                  • Source: {trait.sourceNpc}
                </Typography>
              )}
            </Box>
            
            {isPermanentByPlayer && (
                 <Typography variant="caption" color="success.main">
                    (Permanently active)
                 </Typography>
            )}
          </Box>
        </Box>
      </ListItem>
    );
  };

  const displayableAcquiredTraits = acquiredTraits.filter(t => !playerPermanentTraitIds.includes(t.id));

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Acquired Traits (Not Permanent)
                </Typography>
                <Tooltip title="Traits you have learned but are not yet permanent. Equip them in slots to use.">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {displayableAcquiredTraits.length === 0 ? (
                <Alert severity="info">
                  No non-permanent traits acquired yet. Resonate with NPCs to learn traits permanently, or equip their innate traits temporarily.
                </Alert>
              ) : (
                <List sx={{ width: '100%' }}>
                  {displayableAcquiredTraits.map(renderTraitItem)}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Permanent Traits
                </Typography>
                <Tooltip title="Traits you have permanently learned, e.g., via Resonance. These are always active.">
                 <CheckCircleIcon color="success" fontSize="small" />
                </Tooltip>
              </Box>

              {permanentTraits.length === 0 ? ( 
                <Alert severity="info">
                  No permanent traits yet. Resonate with NPCs to make traits permanent.
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
                <Typography variant="body2" color="text.secondary">Current Essence</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <EssenceIcon color="primary" />
                  <Typography variant="h6" color="primary">{currentEssence.toLocaleString()}</Typography>
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
